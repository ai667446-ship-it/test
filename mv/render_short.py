#!/usr/bin/env python3
"""縦型 (1080x1920) のリリックショート動画レンダラー。

複数のイラストをショット (カメラワーク付き) として並べ、歌詞の各行に合わせて
ビート上でカットを切り替える。車窓を流れる街の光、ビートに合わせた
街灯のスイープ、夜明けのホワイトアウト、海のきらめき、ぼかしから浮かぶ歌詞など。

使い方:
    python3 render_short.py --config short.json --out short.mp4
    python3 render_short.py --config short.json --stills 1,5,21
"""

import argparse
import json
import math
import subprocess
import tempfile
from multiprocessing import Pool
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

import render_mv as rm

W, H, FPS = 1080, 1920, 30
rm.W, rm.H = W, H  # 文字描画ヘルパーを縦型サイズで使う
clamp, smooth, ease_out = rm.clamp, rm.smooth, rm.ease_out
WHITE = (252, 250, 247)


def ease_io(p):
    p = clamp(p)
    return 0.5 - 0.5 * math.cos(math.pi * p)


class Assets(rm.Assets):
    """フォント・グリフのキャッシュは MV 版を流用し、素材はイラスト群を読む。"""

    def __init__(self, cfg):
        fdir = Path(cfg["fonts"])
        self.font_paths = {
            "serif": fdir / "NotoSerifJP%5Bwght%5D.ttf",
            "sans": fdir / "NotoSansJP%5Bwght%5D.ttf",
            "dot": fdir / "DotGothic16-Regular.ttf",
        }
        self._fonts, self._glyphs, self._misc = {}, {}, {}
        self.img = {}
        for key, path in cfg["images"].items():
            im = Image.open(path).convert("RGB")
            im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
            im = im.filter(ImageFilter.UnsharpMask(2.2, 70, 2))
            self.img[key] = im
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
        self.vig = np.clip(1 - 0.32 * (r / 1.3) ** 2.4, 0, 1)[..., None].astype(np.float32)
        rng = np.random.default_rng(3)
        self.grain = [rng.normal(0, 1, (H, W, 1)).astype(np.float32) for _ in range(6)]
        self.xx, self.yy = xx, yy
        # 歌詞・字幕の可読性のため下部をほんのり暗くするグラデーション
        self.shade = (1 - 0.38 * np.clip((yy - H * 0.62) / (H * 0.3), 0, 1))[..., None]


# ====================================================================== カメラ

def camera(A, key, cx, cy, zoom, rot=0.0):
    """イラストの一部を切り出して画面に収める (ズーム・パン・わずかな回転)。"""
    src = A.img[key]
    sw, sh = src.size
    vw = sw / zoom
    vh = vw * H / W
    cx = clamp(cx * sw, vw / 2, sw - vw / 2)
    cy = clamp(cy * sh, vh / 2, sh - vh / 2)
    s = vw / W
    co, si = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    a, b, d, e = s * co, -s * si, s * si, s * co
    c = cx - a * W / 2 - b * H / 2
    f = cy - d * W / 2 - e * H / 2
    return src.transform((W, H), Image.AFFINE, (a, b, c, d, e, f), resample=Image.BICUBIC), (cx, cy, s, sw, sh)


def to_screen(geo, nx, ny):
    """イラスト上の正規化座標を画面座標に変換する (回転は無視できる程度)。"""
    cx, cy, s, sw, sh = geo
    return (nx * sw - cx) / s + W / 2, (ny * sh - cy) / s + H / 2


def shot_state(shot, t, ctx):
    p = ease_io((t - shot["start"]) / (shot["end"] - shot["start"]))
    a, b = shot["from"], shot["to"]
    cx = a[0] + (b[0] - a[0]) * p
    cy = a[1] + (b[1] - a[1]) * p
    z = a[2] + (b[2] - a[2]) * p
    # 手持ち風の揺れと、小節頭でのわずかなズーム
    cx += 0.004 * math.sin(t * 0.9 + shot["start"])
    cy += 0.003 * math.sin(t * 0.7 + 1.3)
    z *= 1 + 0.012 * ctx["bar_pulse"] + 0.004 * ctx["pulse"]
    rot = 0.4 * math.sin(t * 0.5 + shot["start"])
    return cx, cy, z, rot


# ====================================================================== ショット内の演出

def passing_lights(ctx, shot, geo, seed):
    """車窓の外を流れていく街の光 (ボケ + 流れの残像)。窓領域にだけ描く。"""
    t = ctx["t"]
    x0, y0, x1, y1 = shot["window"]
    sx0, sy0 = to_screen(geo, x0, y0)
    sx1, sy1 = to_screen(geo, x1, y1)
    layer = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    rng = np.random.default_rng(seed)
    speed = shot.get("flow", 900)
    cols = shot["light_colors"]
    span = (sx1 - sx0) + 600
    for k in range(34):
        y = sy0 + rng.uniform(0.1, 0.9) * (sy1 - sy0)
        v = speed * rng.uniform(0.5, 1.6)
        x = sx1 + 300 - ((t * v + rng.uniform(0, span)) % span)
        r = rng.uniform(8, 30)
        col = tuple(int(c * rng.uniform(0.35, 0.8)) for c in cols[k % len(cols)])
        # 丸いボケと、進行方向に伸びる細い光の尾
        d.ellipse([x - r, y - r, x + r, y + r], fill=col)
        tail = tuple(int(c * 0.35) for c in col)
        d.rectangle([x, y - r * 0.18, x + v * 0.09, y + r * 0.18], fill=tail)
    layer = layer.filter(ImageFilter.GaussianBlur(10))
    a = np.asarray(layer).astype(np.float32)
    # 窓の形のソフトマスク
    m = (smooth_edge(ctx["A"].xx, sx0, sx1, 60) * smooth_edge(ctx["A"].yy, sy0, sy1, 60))[..., None]
    return a * m


def smooth_edge(v, lo, hi, feather):
    return np.clip((v - lo) / feather, 0, 1) * np.clip((hi - v) / feather, 0, 1)


def light_sweep(ctx, color, period_beats=2, strength=0.32):
    """通り過ぎる街灯が車内を照らす斜めの光の帯 (ビート同期)。"""
    since = ctx["t"] - ctx["sweep_t0"]
    p = since / 0.75
    if p < 0 or p > 1:
        return None
    A = ctx["A"]
    pos = -0.4 + 1.8 * ease_out(p)
    band = (A.xx / W * 0.8 + A.yy / H * 0.35) - pos
    g = np.exp(-(band / 0.13) ** 2) * strength * math.sin(math.pi * p)
    return g[..., None] * np.array(color, np.float32)


def sea_sparkle(ctx, shot, geo, seed):
    """海面のきらめき。"""
    t = ctx["t"]
    x0, y0, x1, y1 = shot["sea"]
    rng = np.random.default_rng(seed)
    layer = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for k in range(140):
        nx, ny = rng.uniform(x0, x1), y0 + (y1 - y0) * rng.uniform(0, 1) ** 1.8
        ph, fr = rng.uniform(0, 6.28), rng.uniform(1.5, 4)
        b = max(0.0, math.sin(t * fr + ph)) ** 6
        if b < 0.05:
            continue
        x, y = to_screen(geo, nx, ny)
        r = 2 + 3 * b
        c = int(255 * b)
        d.ellipse([x - r * 2.5, y - r * 0.6, x + r * 2.5, y + r * 0.6], fill=(c, c, int(c * 0.9)))
    layer = layer.filter(ImageFilter.GaussianBlur(2))
    return np.asarray(layer).astype(np.float32)


def sun_flare(ctx, shot, geo, strength):
    A = ctx["A"]
    sx, sy = to_screen(geo, *shot["sun"])
    d2 = ((A.xx - sx) ** 2 + (A.yy - sy) ** 2)
    glow = np.exp(-d2 / (2 * 140 ** 2)) * 0.9 + np.exp(-d2 / (2 * 520 ** 2)) * 0.35
    # 横方向に伸びるアナモルフィック風の光芒
    streak = np.exp(-((A.yy - sy) / 7) ** 2) * np.exp(-np.abs(A.xx - sx) / 520) * 0.7
    col = np.array(shot.get("sun_color", (255, 190, 160)), np.float32)
    return (glow + streak)[..., None] * col * strength


def dust(ctx, seed, count=60, color=(255, 240, 230)):
    t = ctx["t"]
    rng = np.random.default_rng(seed)
    layer = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(count):
        x0, y0, vx, vy, s, ph = rng.uniform(0, 1, 6)
        x = (x0 * W + (vx - 0.5) * 50 * t) % W
        y = (y0 * H - (0.3 + vy) * 40 * t) % H
        b = 0.5 + 0.5 * math.sin(ph * 6.28 + t * 1.3)
        r = 1.5 + s * 4
        d.ellipse([x - r, y - r, x + r, y + r], fill=tuple(int(c * b) for c in color))
    return np.asarray(layer.filter(ImageFilter.GaussianBlur(1.5))).astype(np.float32)


def render_shot(ctx, shot):
    """1ショット分の画 (float32 HxWx3) を返す。"""
    t = ctx["t"]
    A = ctx["A"]
    cx, cy, z, rot = shot_state(shot, t, ctx)
    im, geo = camera(A, shot["image"], cx, cy, z, rot)
    a = np.asarray(im).astype(np.float32)
    g = shot.get("grade")
    if g:
        a = a * np.array(g["mul"], np.float32) + np.array(g.get("add", (0, 0, 0)), np.float32)
    kind = shot["kind"]
    if kind == "car":
        if "window" in shot:
            a += passing_lights(ctx, shot, geo, shot["seed"]) * shot.get("light_amt", 0.9)
        sw = light_sweep(ctx, shot["sweep_color"])
        if sw is not None:
            a += sw
    elif kind == "beach":
        a += sea_sparkle(ctx, shot, geo, 11) * 0.8
        a += sun_flare(ctx, shot, geo, 0.38 + 0.08 * ctx["bar_pulse"])
        a += dust(ctx, 5, 28) * 0.22
    return a


# ====================================================================== トランジション

def hblur(a, radius):
    """水平方向のモーションブラー (累積和によるボックスブラー)。"""
    r = int(radius)
    if r < 2:
        return a
    c = np.cumsum(np.pad(a, ((0, 0), (r, r), (0, 0)), mode="edge"), axis=1)
    return (c[:, 2 * r:] - c[:, :-2 * r]) / (2 * r)


def zoom_blur(a, amount):
    """中心から放射状に流れるズームブラー (拡大した画を数枚重ねる)。"""
    if amount < 0.005:
        return a
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    acc = a.copy()
    n = 5
    for k in range(1, n):
        s = 1 + amount * k / n
        w2, h2 = int(W * s), int(H * s)
        z = im.resize((w2, h2), Image.BILINEAR).crop(((w2 - W) // 2, (h2 - H) // 2, (w2 - W) // 2 + W,
                                                      (h2 - H) // 2 + H))
        acc += np.asarray(z).astype(np.float32)
    return acc / n


def compose(ctx, cfg):
    """現在時刻のショット(と前後のショット)を合成し、トランジションをかける。"""
    t = ctx["t"]
    shots = cfg["shots"]
    i = max(k for k, s in enumerate(shots) if s["start"] <= t or k == 0)
    cur = shots[i]
    a = render_shot(ctx, cur)
    if i > 0:
        a = transition_tail(a, cur, t - cur["start"])
    return a


def transition_tail(a, shot, since):
    """カット直後 (次ショット側) のトランジション後半。前半は transition_head で処理する。"""
    kind = shot.get("trans_in", "cut")
    dur = shot.get("trans_in_dur", 0.35)
    if kind == "cut" or since < 0 or since > dur / 2:
        return a
    p = clamp(since / (dur / 2))  # 0 → 1
    if kind == "whip":
        k = 1 - ease_out(p)
        shift = int(k * W * 0.35)
        a = np.roll(a, -shift, axis=1)
        a = hblur(a, k * 140)
    elif kind == "zoom":
        a = zoom_blur(a, 0.25 * (1 - ease_out(p)))
    elif kind == "flash":
        a = a + (255 - a) * (1 - ease_out(p)) * 0.9
    elif kind == "glitch":
        if p < 1:
            rng = np.random.default_rng(int(since * 1000))
            for _ in range(8):
                y0 = int(rng.integers(0, H - 40))
                h = int(rng.integers(10, 120))
                a[y0:y0 + h] = np.roll(a[y0:y0 + h], int(rng.integers(-160, 160)), axis=1)
            sh = int(18 * (1 - p))
            a[..., 0] = np.roll(a[..., 0], sh, axis=1)
            a[..., 2] = np.roll(a[..., 2], -sh, axis=1)
    elif kind == "whiteout":
        a = a + (255 - a) * (1 - ease_io(p))
    return a


def transition_head(a, nxt, t):
    """次のショットへのトランジション前半 (現ショット側)。"""
    kind = nxt.get("trans_in", "cut")
    dur = nxt.get("trans_in_dur", 0.35)
    until = nxt["start"] - t
    if kind == "cut" or until > dur / 2 or until <= 0:
        return a
    p = 1 - until / (dur / 2)  # 0 → 1
    if kind == "whip":
        k = p ** 2
        a = np.roll(a, int(k * W * 0.35), axis=1)
        a = hblur(a, k * 140)
    elif kind == "zoom":
        a = zoom_blur(a, 0.3 * p ** 2)
    elif kind == "flash":
        a = a + (255 - a) * p ** 3 * 0.9
    elif kind == "whiteout":
        a = a + (255 - a) * ease_io(p)
    return a


# ====================================================================== 歌詞

def draw_lyrics(layer, A, ctx, cfg):
    t = ctx["t"]
    for ln in ctx["lines"]:
        if not (ln["start"] - 0.4 <= t < ln["end"] + 0.6):
            continue
        lay = ln["layout"]
        out = clamp((t - ln["end"]) / 0.6)
        alpha = 1 - ease_out(out)
        rise = -40 * ease_out(out)
        col = WHITE + (255,)
        sh = ((10, 12, 30, 150), 3, 4)
        if lay == "title":
            rm.draw_line(layer, A, ctx, ln, W / 2, H * 0.40 + rise, 100, "serif", col, "fade",
                         weight=700, align="center", spacing=0.22, shadow=sh, alpha=alpha,
                         appear=0.55)
        elif lay == "low":
            rm.draw_line(layer, A, ctx, ln, W / 2, H * 0.76 + rise, 72, "serif", col, "fade",
                         weight=600, align="center", spacing=0.12, shadow=sh, alpha=alpha,
                         appear=0.45)
        elif lay == "high":
            rm.draw_line(layer, A, ctx, ln, W / 2, H * 0.17 + rise, 72, "serif", col, "fade",
                         weight=600, align="center", spacing=0.12, shadow=sh, alpha=alpha,
                         appear=0.45)
        elif lay in ("vleft", "vright"):
            x = W * (0.14 if lay == "vleft" else 0.86)
            rm.draw_line(layer, A, ctx, ln, x, H * 0.16 + rise, 76, "serif", col, "fade",
                         vertical=True, weight=600, spacing=0.12, shadow=sh, alpha=alpha,
                         appear=0.45)
        # 英訳のサブタイトル
        en = ln.get("en")
        if en:
            p = clamp((t - ln["chars"][0] - 0.3) / 0.6) * alpha
            g = rm.text_image(A, en, "sans", 34, (240, 240, 245, 255), weight=500)
            y = H * 0.40 + 92 if lay == "title" else H * 0.865
            rm.paste_glyph(layer, g, W / 2, y + rise * 0.5, 1.0, p * 0.85)


def draw_hud(layer, A, ctx, cfg):
    """左上の時計と、下部の曲名クレジット。"""
    t = ctx["t"]
    d = ImageDraw.Draw(layer)
    dawn = cfg["marks"]["dawn"]
    # 4:00 から少しずつ進み、夜明けで 4:58 に飛ぶ
    if t < dawn:
        mins = int(t / dawn * 12)
    else:
        mins = 58
    colon = ":" if (t % 1.0) < 0.6 else " "
    f = A.font("dot", 46)
    a = int(220 * clamp(t / 0.8) * (1 - smooth((t - cfg["marks"]["end_card"]) / 0.6)))
    d.text((72, 120), f"AM 04{colon}{mins:02d}", font=f, fill=(255, 255, 255, a))
    fs = A.font("sans", 26, 400)
    d.text((72, 178), cfg["title"] + "  /  " + cfg["artist"], font=fs, fill=(255, 255, 255, int(a * 0.8)))
    # 進行バー
    p = t / cfg["duration"]
    d.rectangle([72, H - 96, W - 72, H - 94], fill=(255, 255, 255, int(a * 0.25)))
    d.rectangle([72, H - 96, 72 + (W - 144) * p, H - 94], fill=(255, 255, 255, int(a * 0.85)))


def end_card(layer, A, ctx, cfg):
    t = ctx["t"]
    k = t - cfg["marks"]["end_card"]
    if k < 0:
        return
    t1 = rm.text_image(A, cfg["title"], "serif", 84, WHITE + (255,), weight=700)
    rm.paste_glyph(layer, t1, W / 2, H * 0.13, 1.0, smooth(k / 0.9))
    t2 = rm.text_image(A, cfg["artist"], "sans", 40, WHITE + (255,), weight=500)
    rm.paste_glyph(layer, t2, W / 2, H * 0.13 + 100, 1.0, smooth((k - 0.4) / 0.9))


# ====================================================================== ポスト

def post(a, A, ctx, layer):
    fi = ctx["fi"]
    # ブルーム (明るい部分をにじませる)
    small = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).resize((W // 8, H // 8), Image.BILINEAR)
    sa = np.asarray(small).astype(np.float32)
    sa = np.clip(sa - 165, 0, None) * 1.6
    bloom = Image.fromarray(np.clip(sa, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))
    a = a + np.asarray(bloom.resize((W, H), Image.BILINEAR)).astype(np.float32) * 0.55
    a *= A.shade
    # 歌詞レイヤー: 背後に暗いハロー、上に柔らかいグローを付けて重ねる
    if layer.getbbox():
        glow = layer.resize((W // 4, H // 4), Image.BILINEAR).filter(ImageFilter.GaussianBlur(5))
        ga = np.asarray(glow.resize((W, H), Image.BILINEAR)).astype(np.float32)
        halo = layer.getchannel("A").resize((W // 8, H // 8), Image.BILINEAR).filter(ImageFilter.GaussianBlur(4))
        ha = np.asarray(halo.resize((W, H), Image.BILINEAR)).astype(np.float32)[..., None] / 255
        a = a * (1 - np.clip(ha * 1.6, 0, 0.5))
        a = a + ga[..., :3] * (ga[..., 3:] / 255) * 0.35
        la = np.asarray(layer).astype(np.float32)
        al = la[..., 3:] / 255
        a = a * (1 - al) + la[..., :3] * al
    ca = 1 + int(3 * ctx["pulse"] * ctx["ca_amt"])
    a[..., 0] = np.roll(a[..., 0], ca, axis=1)
    a[..., 2] = np.roll(a[..., 2], -ca, axis=1)
    a *= A.vig
    a += A.grain[fi % len(A.grain)] * 6
    a *= ctx["fade"]
    return np.clip(a, 0, 255).astype(np.uint8)


# ====================================================================== メイン

class Renderer:
    def __init__(self, cfg):
        self.cfg = cfg
        self.A = Assets(cfg)
        b = json.load(open(cfg["beats"]))
        self.beats = np.array(b["beats"])
        lines = json.load(open(cfg["lyrics_timed"], encoding="utf-8"))
        for i, ln in enumerate(lines):
            meta = cfg["lines"][i]
            ln.update(meta)
            ln["index"] = i
            nxt = lines[i + 1]["chars"][0] if i + 1 < len(lines) else cfg["duration"]
            ln["start"] = ln["chars"][0]
            ln["end"] = min(nxt - 0.35, max(ln["chars"]) + meta.get("hold", 1.6))
        self.lines = lines
        # カットをビートに吸着させる
        shots = cfg["shots"]
        for k, s in enumerate(shots):
            if k == 0:
                s["start"] = 0.0
            else:
                j = int(np.argmin(np.abs(self.beats - s["start"])))
                s["start"] = float(self.beats[j]) if abs(self.beats[j] - s["start"]) < 0.25 else s["start"]
        for k, s in enumerate(shots):
            s["seed"] = k * 101 + 7
            s["end"] = shots[k + 1]["start"] if k + 1 < len(shots) else cfg["duration"]

    def frame(self, fi):
        cfg = self.cfg
        t = fi / FPS
        bt = self.beats
        i = int(np.searchsorted(bt, t, side="right") - 1)
        since = t - bt[i] if i >= 0 else 9
        bar_i = i - (i % 4) if i >= 0 else 0
        bar_since = t - bt[bar_i] if i >= 0 else 9
        sweep_i = i - (i % 2) if i >= 0 else 0
        ctx = {"t": t, "fi": fi, "A": self.A, "lines": self.lines,
               "pulse": math.exp(-since / 0.18), "bar_pulse": math.exp(-bar_since / 0.35),
               "sweep_t0": bt[sweep_i] if i >= 0 else -9, "ca_amt": 1.0,
               "fade": smooth(t / 0.5) * smooth((cfg["duration"] - t) / 1.3)}
        a = compose(ctx, cfg)
        shots = cfg["shots"]
        for k, s in enumerate(shots[:-1]):
            if s["start"] <= t < s["end"]:
                a = transition_head(a, shots[k + 1], t)
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw_lyrics(layer, self.A, ctx, cfg)
        draw_hud(layer, self.A, ctx, cfg)
        end_card(layer, self.A, ctx, cfg)
        return post(a, self.A, ctx, layer)


_R = None


def _init(cfg):
    global _R
    _R = Renderer(cfg)


def _chunk(args):
    f0, f1, path = args
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
                          "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264",
                          "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-g", "30",
                          str(path)], stdin=subprocess.PIPE)
    for fi in range(f0, f1):
        p.stdin.write(_R.frame(fi).tobytes())
    p.stdin.close()
    p.wait()
    return path


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--config", required=True)
    ap.add_argument("--out", default="short.mp4")
    ap.add_argument("--stills")
    ap.add_argument("--workers", type=int, default=4)
    args = ap.parse_args()
    cfg_path = Path(args.config)
    cfg = json.load(open(cfg_path, encoding="utf-8"))
    base = cfg_path.parent
    for k in ("audio", "lyrics_timed", "fonts", "beats"):
        cfg[k] = str((base / cfg[k]).resolve())
    cfg["images"] = {k: str((base / v).resolve()) for k, v in cfg["images"].items()}

    if args.stills:
        _init(cfg)
        out = Path(args.out).with_suffix("")
        out.mkdir(parents=True, exist_ok=True)
        for s in args.stills.split(","):
            Image.fromarray(_R.frame(int(round(float(s) * FPS)))).save(out / f"still_{float(s):06.2f}.png")
        print(f"静止画を書き出しました: {out}")
        return

    n_frames = int(round(cfg["duration"] * FPS))
    n = args.workers
    bounds = [n_frames * i // n for i in range(n + 1)]
    with tempfile.TemporaryDirectory() as tmp:
        jobs = [(bounds[i], bounds[i + 1], Path(tmp) / f"p{i}.mp4") for i in range(n)]
        with Pool(n, initializer=_init, initargs=(cfg,)) as pool:
            parts = pool.map(_chunk, jobs)
        lst = Path(tmp) / "list.txt"
        lst.write_text("".join(f"file '{p}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
                        "-i", cfg["audio"], "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                        "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart",
                        args.out], check=True)
    print(f"完成: {args.out}")


if __name__ == "__main__":
    main()
