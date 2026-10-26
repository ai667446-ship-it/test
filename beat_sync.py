#!/usr/bin/env python3
"""楽曲のビートに合わせて動画クリップを自動でカット編集するスクリプト。

必要なもの: Python 3.9+, numpy, ffmpeg / ffprobe (PATH 上)

使い方の例:
    python3 beat_sync.py --music song.mp3 --clips clips/ --out out.mp4
    python3 beat_sync.py --music song.mp3 --clips clips/ --out out.mp4 \
        --aspect 9:16 --beats-per-cut 2 --start 45 --duration 30 --flash
"""

import argparse
import json
import random
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

VIDEO_EXTS = {".mp4", ".mov", ".m4v", ".mkv", ".webm", ".avi"}
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
ASPECTS = {"16:9": (1920, 1080), "9:16": (1080, 1920), "1:1": (1080, 1080), "4:5": (1080, 1350)}

SR = 22050
N_FFT = 2048
HOP = 512
# 窓付きスペクトルフラックスは実際の発音より少し早く立ち上がるため、その分を補正する (秒)
ONSET_LATENCY = 0.02


# ---------------------------------------------------------------- 音声解析

def load_audio(path):
    """ffmpeg で音声をモノラル float32 として読み込む。"""
    cmd = ["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR),
           "-f", "f32le", "-"]
    raw = subprocess.run(cmd, check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def mel_filterbank(n_mels=64, fmin=30.0, fmax=11000.0):
    """三角形のメルフィルタバンク (低域のキック等を相対的に重視するため)。"""
    def hz2mel(f):
        return 2595.0 * np.log10(1.0 + f / 700.0)

    def mel2hz(m):
        return 700.0 * (10 ** (m / 2595.0) - 1.0)

    freqs = np.fft.rfftfreq(N_FFT, 1.0 / SR)
    edges = mel2hz(np.linspace(hz2mel(fmin), hz2mel(fmax), n_mels + 2))
    fb = np.zeros((n_mels, len(freqs)), dtype=np.float32)
    for i in range(n_mels):
        lo, mid, hi = edges[i:i + 3]
        up = (freqs - lo) / (mid - lo)
        down = (hi - freqs) / (hi - mid)
        fb[i] = np.maximum(0.0, np.minimum(up, down))
    return fb


def onset_envelope(y):
    """スペクトルフラックスによるオンセット強度 (フレーム単位)。"""
    # フレーム t の窓の中心が t * HOP サンプル目になるように前後をパディング
    y = np.pad(y, (N_FFT // 2, N_FFT // 2))
    if len(y) < N_FFT:
        y = np.pad(y, (0, N_FFT - len(y)))
    n_frames = 1 + (len(y) - N_FFT) // HOP
    window = np.hanning(N_FFT).astype(np.float32)
    idx = np.arange(N_FFT)[None, :] + HOP * np.arange(n_frames)[:, None]
    spec = np.abs(np.fft.rfft(y[idx] * window, axis=1))
    logspec = np.log1p(100.0 * (spec ** 2) @ mel_filterbank().T)
    flux = np.maximum(0.0, np.diff(logspec, axis=0)).sum(axis=1)
    flux = np.concatenate([[0.0], flux])
    # 局所平均を引いて立ち上がりだけを強調
    k = 16
    local = np.convolve(flux, np.ones(2 * k + 1) / (2 * k + 1), mode="same")
    env = np.maximum(0.0, flux - local)
    std = env.std()
    return env / std if std > 0 else env


def estimate_bpm(env, bpm_min=60.0, bpm_max=200.0, prior=120.0):
    """自己相関からテンポを推定する。120BPM 付近をやや優先する。"""
    fps = SR / HOP
    env = env - env.mean()
    ac = np.correlate(env, env, mode="full")[len(env) - 1:]
    lags = np.arange(len(ac))
    lag_min = max(1, int(fps * 60.0 / bpm_max))
    lag_max = min(len(ac) - 1, int(fps * 60.0 / bpm_min))
    if lag_max <= lag_min:
        return prior
    cand = lags[lag_min:lag_max + 1]
    bpms = 60.0 * fps / cand
    weight = np.exp(-0.5 * (np.log2(bpms / prior) / 1.0) ** 2)
    i = lag_min + int(np.argmax(ac[lag_min:lag_max + 1] * weight))
    # 放物線補間でラグをサブフレーム精度に
    lag = float(i)
    if 0 < i < len(ac) - 1:
        a, b, c = ac[i - 1], ac[i], ac[i + 1]
        denom = a - 2 * b + c
        if denom != 0:
            lag += 0.5 * (a - c) / denom
    return 60.0 * fps / lag


def track_beats(env, bpm, tightness=100.0):
    """動的計画法によるビートトラッキング (Ellis 2007)。ビート時刻 (秒) を返す。"""
    fps = SR / HOP
    period = 60.0 * fps / bpm
    n = len(env)
    score = env.astype(np.float64).copy()
    backlink = np.full(n, -1, dtype=np.int64)
    lo, hi = int(round(period / 2)), int(round(2 * period))
    offsets = np.arange(-hi, -lo + 1)
    penalty = -tightness * np.log(-offsets / period) ** 2
    for t in range(n):
        prev = t + offsets
        valid = prev >= 0
        if not valid.any():
            continue
        cand = score[prev[valid]] + penalty[valid]
        i = int(np.argmax(cand))
        if cand[i] > 0:
            score[t] += cand[i]
            backlink[t] = prev[valid][i]
    # 末尾付近で最もスコアの高いフレームから逆にたどる
    tail = max(0, n - int(round(period)))
    t = tail + int(np.argmax(score[tail:]))
    beats = []
    while t >= 0:
        beats.append(t)
        t = backlink[t]
    beats = np.array(beats[::-1], dtype=np.float64)
    # 冒頭の弱いビート (無音部分) を除去
    if len(beats):
        strong = env[beats.astype(int)] > 0.1 * env.max()
        first = int(np.argmax(strong)) if strong.any() else 0
        beats = beats[first:]
    return beats * HOP / SR


def fit_grid(env, bpm, beats, tol=0.05, min_agree=0.8):
    """曲全体に等間隔グリッドを当てはめる (テンポが一定の曲向け)。

    BPM と位相を細かく探索してオンセット強度の総和が最大になるグリッドを求め、
    DP で検出したビートの大半 (min_agree 以上) がグリッドと一致すれば採用する。
    フレーム量子化の誤差や、途中で裏拍に飛ぶ誤検出を取り除ける。
    """
    if len(beats) < 8:
        return None
    fps = SR / HOP
    frames = np.arange(len(env))
    best = (-1.0, None, None)
    for b in bpm * np.linspace(0.98, 1.02, 81):
        period = 60.0 * fps / b
        phases = np.arange(0.0, period, 0.25)
        k = np.arange(int((len(env) - 1) / period) + 1)
        pos = phases[:, None] + period * k[None, :]
        score = np.where(pos <= len(env) - 1,
                         np.interp(pos, frames, env), 0.0).sum(axis=1)
        i = int(np.argmax(score))
        if score[i] > best[0]:
            best = (score[i], period, phases[i])
    _, period, phase = best
    grid = (phase + period * np.arange(int((len(env) - 1 - phase) / period) + 1)) / fps
    # DP ビートとの一致率を確認。DP が途中で裏拍に飛ぶことがあるので、
    # 半拍ずれた位置で一致したものも「テンポは合っている」とみなす
    def near(points):
        idx = np.clip(np.searchsorted(points, beats), 1, len(points) - 1)
        return np.minimum(np.abs(points[idx] - beats), np.abs(points[idx - 1] - beats)) < tol

    on = near(grid)
    off = near(grid + period / fps / 2)
    if (on | off).mean() < min_agree or on.mean() < off.mean():
        return None
    first = beats[0] - tol
    return grid[grid >= first]


def detect_beats(music, bpm=None, grid=True):
    y = load_audio(music)
    env = onset_envelope(y)
    tempo = bpm or estimate_bpm(env)
    beats = track_beats(env, tempo)
    snapped = False
    if grid:
        fitted = fit_grid(env, tempo, beats)
        if fitted is not None:
            beats, snapped = fitted, True
    if len(beats) > 1:
        tempo = 60.0 / np.polyfit(np.arange(len(beats)), beats, 1)[0]
    return float(tempo), beats + ONSET_LATENCY, len(y) / SR, snapped


# ---------------------------------------------------------------- カット計画

def probe_duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True).stdout.strip()
    try:
        return float(out)
    except ValueError:
        return 0.0


def collect_clips(folder):
    clips = []
    for p in sorted(Path(folder).iterdir()):
        ext = p.suffix.lower()
        if ext in VIDEO_EXTS:
            dur = probe_duration(p)
            if dur > 0:
                clips.append({"path": p, "image": False, "duration": dur, "cursor": 0.0})
        elif ext in IMAGE_EXTS:
            clips.append({"path": p, "image": True, "duration": float("inf"), "cursor": 0.0})
    return clips


def plan_cuts(beats, start, end, beats_per_cut, fps, min_cut):
    """カット位置を出力動画のフレーム番号で返す (フレーム単位で丸めて音ズレを防ぐ)。"""
    inside = beats[(beats > start) & (beats < end)]
    points = [start] + list(inside[::beats_per_cut]) + [end]
    frames = sorted({int(round((t - start) * fps)) for t in points})
    min_frames = max(1, int(round(min_cut * fps)))
    last = frames[-1]
    merged = [frames[0]]
    for f in frames[1:-1]:
        if f - merged[-1] >= min_frames:
            merged.append(f)
    # 最後のカットが短すぎる場合は直前のカットを延ばす
    if len(merged) > 1 and last - merged[-1] < min_frames:
        merged[-1] = last
    else:
        merged.append(last)
    return [(a, b - a) for a, b in zip(merged[:-1], merged[1:]) if b > a]


def pick_source(clips, length, order, rng, state):
    """セグメント長 length 秒に使うクリップと開始位置を選ぶ。"""
    if order == "shuffle":
        if not state["bag"]:
            state["bag"] = list(range(len(clips)))
            rng.shuffle(state["bag"])
            # 同じ素材が連続しないように
            if state["last"] is not None and len(clips) > 1 and state["bag"][-1] == state["last"]:
                state["bag"].insert(0, state["bag"].pop())
        idx = state["bag"].pop()
    else:
        idx = state["next"] % len(clips)
        state["next"] += 1
    state["last"] = idx
    clip = clips[idx]
    if clip["image"]:
        return clip, 0.0
    room = clip["duration"] - length
    if room <= 0:
        return clip, 0.0
    if order == "shuffle":
        offset = rng.uniform(0, room)
    else:
        # 順番モード: 素材を頭から少しずつ使っていく
        if clip["cursor"] > room:
            clip["cursor"] = 0.0
        offset = clip["cursor"]
        clip["cursor"] += length
    return clip, offset


# ---------------------------------------------------------------- 書き出し

def render_segment(clip, offset, n_frames, fps, size, flash, zoom, dst):
    w, h = size
    filters = [f"scale={w}:{h}:force_original_aspect_ratio=increase", f"crop={w}:{h}",
               "setsar=1", f"fps={fps}"]
    if zoom:
        # ビート頭から少しずつズームイン
        filters += [f"scale=w='trunc({w}*(1+0.06*t/{n_frames / fps:.4f})/2)*2'"
                    f":h=-2:eval=frame", f"crop={w}:{h}"]
    if flash:
        filters.append(f"fade=t=in:st=0:d={min(0.12, n_frames / fps / 2):.3f}:color=white")
    cmd = ["ffmpeg", "-v", "error", "-y"]
    if clip["image"]:
        cmd += ["-loop", "1", "-framerate", str(fps), "-i", str(clip["path"])]
    else:
        if clip["duration"] - offset < n_frames / fps:
            cmd += ["-stream_loop", "-1"]
        cmd += ["-ss", f"{offset:.3f}", "-i", str(clip["path"])]
    cmd += ["-vf", ",".join(filters), "-frames:v", str(n_frames), "-an",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
            "-pix_fmt", "yuv420p", "-r", str(fps), str(dst)]
    subprocess.run(cmd, check=True)


def build(args):
    for tool in ("ffmpeg", "ffprobe"):
        if shutil.which(tool) is None:
            sys.exit(f"{tool} が見つかりません。インストールしてください。")

    print(f"♪ ビート解析中: {args.music}")
    tempo, beats, music_len, snapped = detect_beats(args.music, args.bpm, not args.no_grid)
    beats = beats + args.offset
    print(f"  BPM ≈ {tempo:.1f} / 検出ビート数 {len(beats)} / 曲の長さ {music_len:.1f}s"
          f"{' (一定テンポとしてグリッド補正済み)' if snapped else ''}")

    start = args.start
    end = music_len if args.duration is None else min(music_len, start + args.duration)
    if end <= start:
        sys.exit("--start / --duration の範囲が曲の長さを超えています。")

    if args.beats_json:
        Path(args.beats_json).write_text(json.dumps(
            {"bpm": tempo, "beats": [round(b, 4) for b in beats]}, indent=2))
        print(f"  ビート情報を書き出しました: {args.beats_json}")

    cuts = plan_cuts(beats, start, end, args.beats_per_cut, args.fps, args.min_cut)
    print(f"  カット数 {len(cuts)} (平均 {(end - start) / len(cuts):.2f}s / カット)")

    if args.dry_run:
        for i, (f0, n) in enumerate(cuts):
            print(f"  #{i:03d} {start + f0 / args.fps:8.3f}s  +{n / args.fps:.3f}s")
        return

    clips = collect_clips(args.clips)
    if not clips:
        sys.exit(f"素材が見つかりません: {args.clips} (動画: {sorted(VIDEO_EXTS)}, "
                 f"画像: {sorted(IMAGE_EXTS)})")
    print(f"  素材 {len(clips)} 本")

    size = ASPECTS[args.aspect]
    rng = random.Random(args.seed)
    state = {"bag": [], "last": None, "next": 0}
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        lines = []
        for i, (_, n) in enumerate(cuts):
            clip, offset = pick_source(clips, n / args.fps, args.order, rng, state)
            seg = tmp / f"seg_{i:04d}.mp4"
            render_segment(clip, offset, n, args.fps, size, args.flash, args.zoom, seg)
            lines.append(f"file '{seg.as_posix()}'")
            print(f"\r  書き出し中 {i + 1}/{len(cuts)}", end="", flush=True)
        print()
        (tmp / "list.txt").write_text("\n".join(lines) + "\n")
        video = tmp / "video.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0",
                        "-i", str(tmp / "list.txt"), "-c", "copy", str(video)], check=True)

        total = end - start
        afilter = []
        if args.fade_out > 0:
            afilter = ["-af", f"afade=t=out:st={max(0.0, total - args.fade_out):.3f}"
                              f":d={args.fade_out:.3f}"]
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video),
                        "-ss", f"{start:.3f}", "-t", f"{total:.3f}", "-i", str(args.music),
                        "-map", "0:v", "-map", "1:a", "-c:v", "copy", *afilter,
                        "-c:a", "aac", "-b:a", "192k", "-shortest",
                        "-movflags", "+faststart", str(args.out)], check=True)
    print(f"✔ 完成: {args.out}")


def main():
    ap = argparse.ArgumentParser(description="楽曲のビートに合わせて動画を自動カット編集します。")
    ap.add_argument("--music", required=True, help="楽曲ファイル (mp3, wav など)")
    ap.add_argument("--clips", help="動画・画像素材が入ったフォルダ")
    ap.add_argument("--out", default="output.mp4", help="出力ファイル (既定: output.mp4)")
    ap.add_argument("--aspect", choices=sorted(ASPECTS), default="16:9", help="画面比率")
    ap.add_argument("--fps", type=int, default=30, help="フレームレート (既定: 30)")
    ap.add_argument("--beats-per-cut", type=int, default=2,
                    help="何拍ごとにカットを切り替えるか (1=毎拍, 4=1小節。既定: 2)")
    ap.add_argument("--min-cut", type=float, default=0.25,
                    help="これより短いカットは前のカットに結合する (秒。既定: 0.25)")
    ap.add_argument("--start", type=float, default=0.0, help="曲の使用開始位置 (秒)")
    ap.add_argument("--duration", type=float, help="使用する長さ (秒。省略時は曲の最後まで)")
    ap.add_argument("--bpm", type=float, help="BPM を手動指定 (自動推定がずれる場合)")
    ap.add_argument("--no-grid", action="store_true",
                    help="一定テンポのグリッド補正をしない (テンポが変わる曲向け)")
    ap.add_argument("--offset", type=float, default=0.0,
                    help="ビート位置を全体にずらす (秒。カットが早い/遅いと感じたら調整)")
    ap.add_argument("--order", choices=["shuffle", "sequential"], default="shuffle",
                    help="素材の使い方 (shuffle=ランダム, sequential=ファイル名順)")
    ap.add_argument("--seed", type=int, default=0, help="shuffle の乱数シード")
    ap.add_argument("--flash", action="store_true", help="カット頭に白フラッシュを入れる")
    ap.add_argument("--zoom", action="store_true", help="各カットでゆっくりズームイン")
    ap.add_argument("--fade-out", type=float, default=1.0, help="音声フェードアウト (秒。0で無効)")
    ap.add_argument("--beats-json", help="検出したビート情報を JSON で保存するパス")
    ap.add_argument("--dry-run", action="store_true", help="書き出さずにカット位置だけ表示")
    args = ap.parse_args()
    if args.beats_per_cut < 1:
        ap.error("--beats-per-cut は 1 以上にしてください")
    if not args.dry_run and not args.clips:
        ap.error("--clips を指定してください (--dry-run の場合は不要)")
    build(args)


if __name__ == "__main__":
    main()
