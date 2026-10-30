#!/usr/bin/env python3
"""「笑うな、心臓！」リリック MV レンダラー。

カバー画像・歌詞タイミング・ビート情報から、ビートに同期した演出付きの
1920x1080 / 30fps の MV を生成する。映像素材は不要 (すべてプログラムで描画)。

使い方:
    python3 render_mv.py --config song.json --out mv.mp4            # 全編
    python3 render_mv.py --config song.json --stills 12.5,45,160     # 静止画で確認
    python3 render_mv.py --config song.json --range 40 60 --out p.mp4 # 一部だけ
"""

import argparse
import json
import math
import subprocess
import sys
import tempfile
from multiprocessing import Pool
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import beat_sync  # noqa: E402

W, H, FPS = 1920, 1080, 30

# 縦書き用の文字置き換えと、右上に寄せる小書き文字
VERT = {"「": "﹁", "」": "﹂", "、": "︑", "。": "︒", "ー": "︱", "！": "︕", "？": "︖",
        "…": "︙", "（": "︵", "）": "︶", "～": "︴"}
SMALL = set("ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ")
PUNCT = set("、。！？「」…　 ")

RED = (235, 30, 55)
WHITE = (250, 248, 244)
TEAL = (150, 215, 210)


def clamp(x, lo=0.0, hi=1.0):
    return lo if x < lo else hi if x > hi else x


def ease_out(p):
    return 1 - (1 - p) ** 3


def smooth(p):
    p = clamp(p)
    return p * p * (3 - 2 * p)


# ====================================================================== 解析

def analyze(cfg):
    """ビート・エネルギー・低域オンセットをフレーム単位で求める。"""
    y = beat_sync.load_audio(cfg["audio"])
    env = beat_sync.onset_envelope(y)
    bpm = cfg.get("bpm") or beat_sync.estimate_bpm(env)
    beats = beat_sync.track_beats(env, bpm) + beat_sync.ONSET_LATENCY
    beats = smooth_beats(beats)
    n_frames = int(round(cfg["duration"] * FPS))
    hop = beat_sync.SR / FPS
    rms = np.array([np.sqrt(np.mean(y[int(i * hop):int((i + 1) * hop)] ** 2) + 1e-12)
                    for i in range(n_frames)])
    k = np.ones(9) / 9
    rms = np.convolve(rms, k, mode="same")
    energy = np.clip(rms / np.percentile(rms, 95), 0, 1.2)
    return {"beats": beats.tolist(), "energy": energy.tolist(), "bpm": float(bpm)}


def smooth_beats(beats, half=4, tol=0.12):
    """局所的に等間隔な区間ではビートを直線で当てはめ、フレーム量子化の揺れを除く。"""
    out = beats.copy()
    for i in range(len(beats)):
        lo, hi = max(0, i - half), min(len(beats), i + half + 1)
        seg = beats[lo:hi]
        d = np.diff(seg)
        if len(d) < 3 or np.abs(d / np.median(d) - 1).max() > tol:
            continue
        n = np.arange(lo, hi)
        a, b = np.polyfit(n, seg, 1)
        out[i] = a * i + b
    return out


def build_lines(cfg):
    lines = json.load(open(cfg["lyrics_timed"], encoding="utf-8"))
    for idx, ov in cfg.get("overrides", {}).items():
        ln = lines[int(idx)]
        s, e = ov["start"], ov["end"]
        n = [i for i, c in enumerate(ln["text"]) if c not in PUNCT]
        times = list(ln["chars"])
        for k, i in enumerate(n):
            times[i] = s + (e - s) * k / max(1, len(n) - 1)
        last = s
        for i in range(len(times)):
            if i in n:
                last = times[i]
            else:
                times[i] = last
        ln["chars"], ln["start"] = times, s
    for i, ln in enumerate(lines):
        nxt = lines[i + 1]["start"] if i + 1 < len(lines) else cfg["duration"]
        hold = 2.6 if ln["section"] in ("Verse 1", "Verse 2", "Bridge", "Outro", "Intro") else 1.2
        ln["end"] = min(nxt - 0.04, max(ln["chars"]) + hold)
        ln["index"] = i
    return lines


# ====================================================================== 素材

class Assets:
    def __init__(self, cfg):
        fdir = Path(cfg["fonts"])
        self.font_paths = {
            "dela": fdir / "DelaGothicOne-Regular.ttf",
            "serif": fdir / "NotoSerifJP%5Bwght%5D.ttf",
            "sans": fdir / "NotoSansJP%5Bwght%5D.ttf",
            "dot": fdir / "DotGothic16-Regular.ttf",
        }
        self._fonts = {}
        self._glyphs = {}
        self._misc = {}
        src = Image.open(cfg["cover"]).convert("RGB").resize((2048, 2048), Image.LANCZOS)
        src = src.filter(ImageFilter.UnsharpMask(2, 60, 2))
        a = np.asarray(src).astype(np.float32) / 255
        lum = a @ np.array([0.299, 0.587, 0.114], np.float32)
        self.var = {
            "teal": grade_teal(a, lum),
            "red": duotone(lum, [(0.04, 0.0, 0.02), (0.78, 0.04, 0.12), (1.0, 0.88, 0.86)], 1.25),
            "pink": duotone(lum, [(0.07, 0.02, 0.14), (0.95, 0.22, 0.55), (1.0, 0.95, 0.97)], 1.1),
            "mono": duotone(np.clip((lum - 0.32) * 2.6 + 0.5, 0, 1), [(0, 0, 0), (0.5, 0.5, 0.5), (1, 1, 1)], 1.0),
            "neg": duotone(1 - lum, [(0.02, 0.05, 0.06), (0.15, 0.75, 0.78), (0.95, 1.0, 1.0)], 1.4),
        }
        self.var = {k: Image.fromarray(v) for k, v in self.var.items()}
        self.var["blur"] = self.var["teal"].filter(ImageFilter.GaussianBlur(28))
        # ポストエフェクト用のマップ
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
        self.vig = np.clip(1 - 0.55 * (r / 1.25) ** 2.2, 0, 1)[..., None].astype(np.float32)
        rng = np.random.default_rng(7)
        self.grain = [rng.normal(0, 1, (H, W, 1)).astype(np.float32) for _ in range(6)]
        scan = np.ones((H, 1, 1), np.float32)
        scan[::3] = 0.86
        self.scan = scan
        # 光漏れ (ブリッジ・アウトロ用)
        leak = np.zeros((H // 4, W // 4, 3), np.float32)
        ly, lx = np.mgrid[0:H // 4, 0:W // 4].astype(np.float32)
        for cx, cy, rad, col in [(80, 40, 160, (1.0, 0.45, 0.2)), (420, 230, 130, (1.0, 0.2, 0.45)),
                                 (260, 120, 90, (1.0, 0.75, 0.4))]:
            g = np.exp(-(((lx - cx) ** 2 + (ly - cy) ** 2) / (2 * rad ** 2)))
            leak += g[..., None] * np.array(col, np.float32)
        self.leak = np.asarray(Image.fromarray((np.clip(leak, 0, 1) * 255).astype(np.uint8))
                               .resize((W, H), Image.BILINEAR)).astype(np.float32)
        self.dust = rng.uniform(0, 1, (110, 6))
        self.polaroid = make_polaroid(self.var["teal"])

    def font(self, key, size, weight=None):
        k = (key, size, weight)
        if k not in self._fonts:
            f = ImageFont.truetype(str(self.font_paths[key]), size)
            if weight:
                try:
                    f.set_variation_by_axes([weight])
                except OSError:  # 可変フォントでなければ太さ指定は無視する
                    pass
            self._fonts[k] = f
        return self._fonts[k]

    def glyph(self, ch, key, size, color, weight=None, stroke=0, stroke_color=(0, 0, 0, 0),
              vertical=False):
        """1文字を、文字送りの中心を画像中心に合わせた RGBA 画像として返す。"""
        k = (ch, key, size, color, weight, stroke, stroke_color, vertical)
        g = self._glyphs.get(k)
        if g is None:
            f = self.font(key, size, weight)
            c = VERT.get(ch, ch) if vertical else ch
            pad = size // 2 + stroke * 2
            im = Image.new("RGBA", (size + 2 * pad, size + 2 * pad), (0, 0, 0, 0))
            d = ImageDraw.Draw(im)
            ox = oy = 0
            if vertical and ch in SMALL:
                ox, oy = size * 0.12, -size * 0.12
            d.text((im.width / 2 + ox, im.height / 2 + oy), c, font=f, anchor="mm",
                   fill=color, stroke_width=stroke, stroke_fill=stroke_color)
            g = im
            self._glyphs[k] = g
        return g

    def misc(self, key, factory):
        if key not in self._misc:
            self._misc[key] = factory()
        return self._misc[key]


def grade_teal(a, lum):
    c = lum[..., None] * np.array([0.74, 0.93, 0.98], np.float32)
    out = 0.68 * c + 0.32 * a
    out = np.clip((out - 0.5) * 1.12 + 0.5, 0, 1) ** 1.05 * 0.94 + 0.025
    return (np.clip(out, 0, 1) * 255).astype(np.uint8)


def duotone(lum, stops, gamma):
    l = np.clip(lum, 0, 1) ** gamma
    s0, s1, s2 = (np.array(s, np.float32) for s in stops)
    lo = np.clip(l * 2, 0, 1)[..., None]
    hi = np.clip(l * 2 - 1, 0, 1)[..., None]
    out = s0 + (s1 - s0) * lo + (s2 - s1) * hi
    return (np.clip(out, 0, 1) * 255).astype(np.uint8)


def make_polaroid(img):
    card = Image.new("RGBA", (700, 830), (243, 240, 232, 255))
    card.paste(img.resize((630, 630), Image.LANCZOS), (35, 35))
    shadow = Image.new("RGBA", (780, 910), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rectangle([40, 40, 740, 870], fill=(0, 0, 0, 170))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    shadow.alpha_composite(card, (40, 40))
    return shadow


# ====================================================================== 描画ヘルパー

def background(A, var, cx, cy, zoom, rot=0.0, dx=0.0, dy=0.0, mirror=False):
    """カバー画像の一部を切り出して 16:9 の背景にする (ズーム・回転・手ぶれ)。"""
    src = A.var[var]
    S = src.width
    vw = S / zoom
    vh = vw * H / W
    cx = clamp(cx * S, vw / 2, S - vw / 2) if rot == 0 else cx * S
    cy = clamp(cy * S, vh / 2, S - vh / 2) if rot == 0 else cy * S
    s = vw / W
    co, si = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    a, b, d, e = s * co, -s * si, s * si, s * co
    c = cx - a * (W / 2 + dx) - b * (H / 2 + dy)
    f = cy - d * (W / 2 + dx) - e * (H / 2 + dy)
    im = src.transform((W, H), Image.AFFINE, (a, b, c, d, e, f), resample=Image.BILINEAR)
    if mirror:
        arr = np.asarray(im).copy()
        arr[:, W // 2:] = arr[:, :W // 2][:, ::-1]
        im = Image.fromarray(arr)
    return im


def paste_glyph(im, g, cx, cy, scale=1.0, alpha=1.0, rot=0.0):
    if alpha <= 0.01:
        return
    if scale != 1.0:
        g = g.resize((max(1, int(g.width * scale)), max(1, int(g.height * scale))), Image.BILINEAR)
    if rot:
        g = g.rotate(rot, Image.BILINEAR, expand=True)
    if alpha < 0.99:
        g = g.copy()
        g.putalpha(g.getchannel("A").point(lambda v: int(v * alpha)))
    im.paste(g, (int(cx - g.width / 2), int(cy - g.height / 2)), g)


def draw_line(im, A, ctx, ln, x, y, size, font, color, mode="type", vertical=False, weight=None,
              stroke=0, stroke_color=(0, 0, 0, 0), align="left", spacing=0.0, shadow=None,
              appear=None, alpha=1.0, jitter=0.0):
    """歌詞1行を、各文字の歌唱タイミングに合わせて描画する。"""
    t = ctx["t"]
    text = ln["text"]
    f = A.font(font, size, weight)
    adv = [size * (1 + spacing) if vertical else f.getlength(c) + size * spacing for c in text]
    total = sum(adv)
    if align == "center":
        pos0 = (y if vertical else x) - total / 2
    elif align == "right":
        pos0 = (y if vertical else x) - total
    else:
        pos0 = y if vertical else x
    appear = appear or {"type": 0.12, "slam": 0.14, "fade": 0.45, "pop": 0.1}[mode]
    fade_out = clamp((ln["end"] - t) / 0.25)
    pos = pos0
    for i, ch in enumerate(text):
        a = adv[i]
        ct = ln["chars"][i]
        p = (t - ct) / appear
        cpos = pos + a / 2
        pos += a
        if p <= 0 or ch in "　 ":
            continue
        p = clamp(p)
        rng = np.random.default_rng(ln["index"] * 1000 + i)
        jx, jy = rng.uniform(-1, 1, 2) * jitter
        if mode == "type":
            al, sc, off = ease_out(p), 1.0, (1 - ease_out(p)) * size * 0.25
            if t - ct < 0.2 and np.random.default_rng(ctx["fi"] * 31 + i).random() < 0.25:
                continue
        elif mode == "slam":
            al, sc, off = 1.0, 1 + 1.6 * (1 - ease_out(p)), 0
        elif mode == "pop":
            al, sc, off = 1.0, 1 + 0.5 * (1 - ease_out(p)), 0
        else:
            al, sc, off = smooth(p), 1.0, (1 - smooth(p)) * size * 0.1
        al *= alpha * fade_out
        if vertical:
            gx, gy = x + jx, cpos + jy + off
        else:
            gx, gy = cpos + jx, y + jy + off
        if shadow:
            sg = A.glyph(ch, font, size, shadow[0], weight, stroke, stroke_color, vertical)
            paste_glyph(im, sg, gx + shadow[1], gy + shadow[2], sc, al)
        g = A.glyph(ch, font, size, color, weight, stroke, stroke_color, vertical)
        paste_glyph(im, g, gx, gy, sc, al)
    return total


def text_image(A, text, font, size, color, stroke=0, stroke_color=(0, 0, 0, 0), weight=None):
    def make():
        f = A.font(font, size, weight)
        w = int(f.getlength(text)) + size + stroke * 4
        im = Image.new("RGBA", (w, int(size * 1.6) + stroke * 4), (0, 0, 0, 0))
        ImageDraw.Draw(im).text((im.width / 2, im.height / 2), text, font=f, anchor="mm", fill=color,
                                stroke_width=stroke, stroke_fill=stroke_color)
        return im
    return A.misc(("txt", text, font, size, color, stroke, stroke_color, weight), make)


def ecg_points(ctx, x0, x1, y, amp, span=2.6, head=0.82, rate=1):
    """ビートに合わせて脈打つ心電図の折れ線。"""
    t = ctx["t"]
    beats = ctx["beats"]
    if rate == 2:
        beats = beats[::2]
    elif rate == 0.5:
        beats = np.sort(np.concatenate([beats, (beats[:-1] + beats[1:]) / 2]))
    ts = np.linspace(t - span * head, t, 420)
    i = np.clip(np.searchsorted(beats, ts), 1, len(beats) - 1)
    nb = np.where(np.abs(ts - beats[i - 1]) < np.abs(ts - beats[i]), beats[i - 1], beats[i])
    dt = ts - nb
    v = (0.12 * np.exp(-((dt + 0.12) / 0.03) ** 2) - 0.18 * np.exp(-((dt + 0.022) / 0.008) ** 2)
         + 1.0 * np.exp(-(dt / 0.011) ** 2) - 0.32 * np.exp(-((dt - 0.024) / 0.01) ** 2)
         + 0.22 * np.exp(-((dt - 0.17) / 0.045) ** 2))
    xs = x0 + (ts - (t - span * head)) / span * (x1 - x0)
    return list(zip(xs.tolist(), (y - v * amp).tolist()))


def draw_ecg(im, ctx, y, amp, color, width=3, x0=0, x1=W, rate=1, alpha=255):
    pts = ecg_points(ctx, x0, x1, y, amp, rate=rate)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.line(pts, fill=color + (int(alpha * 0.25),), width=width * 4, joint="curve")
    d.line(pts, fill=color + (alpha,), width=width, joint="curve")
    hx, hy = pts[-1]
    d.ellipse([hx - width * 2.5, hy - width * 2.5, hx + width * 2.5, hy + width * 2.5],
              fill=(255, 255, 255, alpha))
    im.paste(layer, (0, 0), layer)


def draw_hud(im, A, ctx, color=(235, 240, 240), focus=0.0, rec=True, inset=0):
    """カメラのファインダー風 HUD。inset はレターボックスの高さ (その内側に描く)。"""
    d = ImageDraw.Draw(im)
    m, L, w = 70, 90, 4
    top, bot = m + inset * 0.6, H - m - inset * 0.6
    for sx, sy in [(m, top), (W - m, top), (m, bot), (W - m, bot)]:
        dx = 1 if sx < W / 2 else -1
        dy = 1 if sy < H / 2 else -1
        d.line([(sx, sy + dy * L), (sx, sy), (sx + dx * L, sy)], fill=color, width=w)
    f = A.font("dot", 34)
    t = ctx["t"]
    if rec:
        if int(t * 2) % 2 == 0:
            d.ellipse([m + 30, top + 30, m + 58, top + 58], fill=RED)
        d.text((m + 72, top + 44), "REC", font=f, fill=color, anchor="lm")
    fr = int(round(t * FPS))
    tc = f"{fr // (FPS * 3600):02d}:{fr // (FPS * 60) % 60:02d}:{fr // FPS % 60:02d}:{fr % FPS:02d}"
    d.text((W - m - 30, top + 44), tc, font=f, fill=color, anchor="rm")
    d.text((m + 30, bot - 40), "ISO 800   F2.8   1/60", font=A.font("dot", 28), fill=color, anchor="lm")
    bx, by = W - m - 120, bot - 56
    d.rectangle([bx, by, bx + 80, by + 32], outline=color, width=3)
    d.rectangle([bx + 80, by + 9, bx + 88, by + 23], fill=color)
    d.rectangle([bx + 6, by + 6, bx + 6 + 22, by + 26], fill=RED)
    # フォーカス枠 (focus=1 で中央に寄って赤くなる)
    fw = 520 - 300 * smooth(focus)
    fh = fw * 0.62
    fc = RED if focus >= 1 else color
    cx, cy = W / 2, H / 2
    for sx, sy in [(-1, -1), (1, -1), (-1, 1), (1, 1)]:
        px, py = cx + sx * fw / 2, cy + sy * fh / 2
        d.line([(px, py - sy * 36), (px, py), (px - sx * 36, py)], fill=fc, width=3)
    d.line([(cx - 14, cy), (cx + 14, cy)], fill=color, width=2)
    d.line([(cx, cy - 14), (cx, cy + 14)], fill=color, width=2)


def draw_dust(im, A, ctx, alpha=1.0):
    d = ImageDraw.Draw(im)
    t = ctx["t"]
    for x0, y0, vx, vy, s, ph in A.dust:
        x = (x0 * W + (vx - 0.5) * 60 * t) % W
        y = (y0 * H - (0.2 + vy) * 25 * t) % H
        b = (0.5 + 0.5 * math.sin(ph * 6.28 + t * (1 + vx))) * alpha
        r = 1 + s * 3
        c = int(150 + 100 * b)
        if b > 0.15:
            d.ellipse([x - r, y - r, x + r, y + r], fill=(c, c, int(c * 0.95)))


def draw_polaroid(im, A, cx, cy, rot, scale=1.0):
    key = ("pol", round(rot * 2) / 2, round(scale, 2))

    def make():
        p = A.polaroid
        if scale != 1.0:
            p = p.resize((int(p.width * scale), int(p.height * scale)), Image.LANCZOS)
        return p.rotate(round(rot * 2) / 2, Image.BICUBIC, expand=True)
    p = A.misc(key, make)
    im.paste(p, (int(cx - p.width / 2), int(cy - p.height / 2)), p)


def giant_kanji(im, A, ch, ctx, color, rot, scale):
    g = A.misc(("giant", ch, color), lambda: _outline(A, ch, 980, color))
    paste_glyph(im, g, W / 2, H / 2, scale, 1.0, rot)


def _outline(A, ch, size, color):
    f = A.font("dela", size)
    im = Image.new("RGBA", (int(size * 1.4), int(size * 1.4)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.text((im.width / 2, im.height / 2), ch, font=f, anchor="mm", fill=(0, 0, 0, 0),
           stroke_width=10, stroke_fill=color + (255,))
    return im


# ====================================================================== シーン

FOCUS = {  # カバー画像内の注目点 (x, y)
    "mask": (0.51, 0.62), "eye_l": (0.41, 0.58), "eye_r": (0.60, 0.58),
    "light": (0.51, 0.12), "window": (0.48, 0.40), "floor": (0.45, 0.85), "room": (0.5, 0.45),
}


def beat_ctx(ctx):
    beats = ctx["beats"]
    t = ctx["t"]
    i = int(np.searchsorted(beats, t, side="right") - 1)
    i = max(0, min(i, len(beats) - 2))
    since = t - beats[i] if t >= beats[i] else 1.0
    ctx["bi"] = i
    ctx["since"] = since
    ctx["period"] = float(beats[i + 1] - beats[i])
    ctx["pulse"] = math.exp(-max(0.0, since) / 0.13) if t >= beats[0] else 0.0


def section_of(cfg, t):
    for s in cfg["sections"]:
        if s["start"] <= t < s["end"]:
            return s
    return cfg["sections"][-1]


def flicker(fi, base=0.97, rate=0.06, seed=0):
    """蛍光灯のちらつき。"""
    r = np.random.default_rng(fi // 2 * 7919 + seed).random()
    if r < rate:
        return 0.35 + r * 4
    return base + 0.03 * math.sin(fi * 1.7)


def scene(ctx, A, cfg):
    """セクションごとの背景・演出。描画した PIL 画像とポストエフェクト設定を返す。"""
    t, fi, sec = ctx["t"], ctx["fi"], ctx["sec"]
    name = sec["name"]
    sp = (t - sec["start"]) / (sec["end"] - sec["start"])
    pulse = ctx["pulse"]
    post = {"ca": 2, "glitch": 0, "flash": 0.0, "grain": 9, "vig": 1.0, "scan": False,
            "tint": None, "bright": 1.0, "fade": 1.0, "redvig": 0.0, "letterbox": 0}
    bi = ctx["bi"]
    lines = ctx["lines_here"]

    if name == "intro":
        chz = cfg["marks"]["intro_shutter"]
        band = cfg["marks"]["intro_band"]
        if t < chz:
            fl = flicker(fi, 0.0 if t < 0.5 else 0.9, 0.35, 1)
            im = background(A, "teal", *FOCUS["mask"], 1.5 - 0.1 * t / chz)
            post["bright"] = fl * smooth(t / 0.6)
            draw_hud(im, A, ctx, focus=clamp((t - 0.6) / (chz - 0.8)))
        elif t < band:
            im = background(A, "blur", *FOCUS["room"], 1.1)
            post["bright"] = 0.45
            k = (t - chz) / (band - chz)
            draw_polaroid(im, A, W / 2, H / 2 - 40 + 30 * k, -4 + 2 * k, 1.0)
            post["flash"] = math.exp(-(t - chz) / 0.18)
        else:
            k = t - band
            v = "red" if (bi % 4 == 0 and pulse > 0.5) else "teal"
            im = background(A, v, *FOCUS["mask"], 1.2 + 0.03 * k + 0.05 * pulse, dx=_shake(fi, 4 * pulse),
                            dy=_shake(fi + 9, 4 * pulse))
            post["bright"] = 0.55 + 0.25 * pulse
            post["ca"] = 3 + 12 * pulse
            post["flash"] = 0.9 * math.exp(-k / 0.12)
            draw_ecg(im, ctx, H * 0.72, 120, RED, 3)
            title_card(im, A, ctx, k, cfg)
            post["glitch"] = 3 if pulse > 0.7 else 0
        post["scan"] = True
        return im, post

    if name in ("verse1", "verse2"):
        ln = lines[0] if lines else None
        li = ln["index"] if ln else 0
        foci = ["mask", "window", "eye_l", "floor", "light", "eye_r", "room", "mask"]
        fx, fy = FOCUS[foci[li % len(foci)]]
        lt = (t - ln["start"]) if ln else t - sec["start"]
        zoom = 1.18 + 0.025 * lt
        mirror = name == "verse2" and t >= cfg["marks"]["mirror"]
        var = "teal"
        if mirror and pulse > 0.6 and bi % 2 == 0:
            var = "neg"
        im = background(A, var, fx, fy, zoom, dx=-6 * lt, mirror=mirror)
        post["bright"] = flicker(fi, 0.95, 0.03, 3)
        post["letterbox"] = 138
        post["scan"] = True
        post["ca"] = 2 + 4 * pulse * (bi % 4 == 0)
        post["glitch"] = 2 if (bi % 8 == 7 and pulse > 0.6) else 0
        draw_hud(im, A, ctx, inset=post["letterbox"])
        return im, post

    if name in ("pre1", "pre2"):
        sh = 2 + 9 * sp
        im = background(A, "teal", *FOCUS["mask"], 1.15 + 1.1 * sp ** 1.6,
                        dx=_shake(fi, sh * pulse), dy=_shake(fi + 3, sh * pulse))
        post["tint"] = (1.0, 1 - 0.55 * sp, 1 - 0.5 * sp)
        post["bright"] = 0.85 - 0.25 * sp + 0.2 * pulse
        post["letterbox"] = int(130 + 150 * sp ** 2)
        post["redvig"] = (0.25 + 0.6 * sp) * pulse
        post["ca"] = 2 + 10 * sp * pulse
        post["glitch"] = 3 if (sp > 0.6 and pulse > 0.8) else 0
        draw_ecg(im, ctx, H / 2 + 260, 90 + 120 * sp, (240, 60, 70), 3, alpha=int(150 + 100 * sp))
        if sec["end"] - t < 0.28:  # サビ直前のブラックアウト
            post["bright"] = 0.0
        return im, post

    if name in ("chorus1", "chorus2", "final", "build"):
        return chorus_scene(ctx, A, cfg, post, sp)

    if name == "bridge":
        lit = t >= cfg["marks"]["bridge_lift"]
        im = background(A, "blur", 0.5 + 0.03 * math.sin(t * 0.3), 0.5, 1.15 + 0.004 * (t - sec["start"]))
        post["bright"] = 0.42 + (0.18 * pulse if lit else 0)
        draw_dust(im, A, ctx, 1.0)
        post["leak"] = 0.25 + (0.25 * pulse if lit else 0.1 * math.sin(t))
        post["grain"] = 12
        if lit:
            draw_ecg(im, ctx, H * 0.80, 70, (255, 200, 190), 2, rate=2, alpha=110)
        if sec["end"] - t < 1.0:
            post["fade"] = smooth((sec["end"] - t) / 1.0)
        return im, post

    if name == "break":
        sh = cfg["marks"]["break_shutter"]
        if t < sh:
            im = background(A, "teal", *FOCUS["mask"], 1.6)
            post["bright"] = flicker(fi, 0.55, 0.15, 5)
            draw_hud(im, A, ctx, focus=clamp((t - sec["start"]) / (sh - sec["start"] - 0.2)))
        else:
            im = Image.new("RGB", (W, H), (8, 8, 10))
            k = t - sh
            draw_polaroid(im, A, W / 2, H / 2 + 60 * k ** 2, -3 - 4 * k, 0.95)
            post["flash"] = math.exp(-k / 0.2)
        post["scan"] = True
        return im, post

    if name == "outro":
        k = t - sec["start"]
        end_card = cfg["marks"]["end_card"]
        im = background(A, "teal", *FOCUS["mask"], 1.25 + 0.01 * k)
        fl = flicker(fi, 0.9, 0.04, 9)
        if t > cfg["duration"] - 3.2:  # 最後に蛍光灯が切れる
            fl *= 0.0 if np.random.default_rng(fi // 2).random() < (t - cfg["duration"] + 3.2) / 2 else 1
        post["bright"] = fl * (0.85 if t < end_card else 0.5)
        post["leak"] = 0.15
        post["letterbox"] = 138
        draw_dust(im, A, ctx, 0.6)
        if t < end_card:
            draw_hud(im, A, ctx, inset=post["letterbox"])
        else:
            end_title(im, A, cfg, t - end_card)
        post["fade"] = smooth((cfg["duration"] - t) / 1.2)
        post["scan"] = True
        return im, post

    return Image.new("RGB", (W, H)), post


def _shake(seed, amp):
    return float(np.random.default_rng(seed).uniform(-1, 1) * amp)


CHORUS_LOOKS = [
    ("red", "mask", 1.55), ("mono", "room", 1.05), ("pink", "eye_l", 2.1), ("black", None, 0),
    ("red", "light", 1.6), ("neg", "mask", 1.3), ("pink", "floor", 1.5), ("red", "eye_r", 2.2),
    ("mono", "mask", 1.8), ("black", None, 0), ("teal", "room", 1.0), ("red", "window", 1.7),
]


def chorus_scene(ctx, A, cfg, post, sp):
    t, fi, sec = ctx["t"], ctx["fi"], ctx["sec"]
    name = sec["name"]
    pulse, bi = ctx["pulse"], ctx["bi"]
    lines = ctx["lines_here"]
    ln = lines[0] if lines else None
    final = name == "final"
    build = name == "build"
    # 何拍ごとに切り替えるか (ビルドアップは加速していく)
    step = 2
    if build:
        step = 4 if sp < 0.35 else 2 if sp < 0.7 else 1
    block = bi // step
    rng = np.random.default_rng(block * 131 + (7 if final else 0))
    look = CHORUS_LOOKS[(block * 5 + (3 if final else 0)) % len(CHORUS_LOOKS)]
    calm = final and t >= cfg["marks"]["final_calm"]
    if calm:
        look = ("teal", "mask", 1.0)
    var, focus, zoom = look
    rot = rng.uniform(-3, 3) if not calm else 0
    sh = (10 if final else 7) * pulse * (0 if calm else 1)
    dx, dy = _shake(fi, sh), _shake(fi + 5, sh)
    if var == "black":
        im = Image.new("RGB", (W, H), (6, 4, 6))
        giant_kanji(im, A, "笑", ctx, RED, rot * 2 + 10 * math.sin(t), 0.95 + 0.12 * pulse)
    else:
        fx, fy = FOCUS[focus]
        z = zoom * (1 + 0.09 * pulse) * (1 + 0.04 * (t % (ctx["period"] * step)))
        if calm:
            z = 1.35 - 0.25 * smooth((t - cfg["marks"]["final_calm"]) / 3.5)
        im = background(A, var, fx + rng.uniform(-0.04, 0.04), fy, z, rot, dx, dy)
    post["ca"] = 4 + (16 if final else 12) * pulse
    post["bright"] = 0.88 + 0.2 * pulse
    post["grain"] = 11
    post["glitch"] = (5 if final else 3) if (pulse > 0.75 and bi % 2 == 1) else 0
    if build and sp < 0.3:
        post["bright"] = 0.25 + 0.4 * pulse
        post["glitch"] = 6 if pulse > 0.6 else 0
    if calm:
        post.update(ca=2 + 4 * pulse, glitch=0, bright=0.9 - 0.2 * smooth(sp * 3 - 2.2))
        post["tint"] = (1.0, 0.95, 0.95)
    # ラララ部分は行の背景で横スクロールする文字
    if ln and "ラララ" in ln["text"] or (ctx["prev_line"] and "ラララ" in ctx["prev_line"]["text"]
                                         and ln and ln["start"] - ctx["prev_line"]["start"] < 3):
        lala(im, A, ctx)
    ecg_y = H * 0.86
    draw_ecg(im, ctx, ecg_y, 110 if not build else 150, WHITE if var in ("red", "pink") else RED,
             4, rate=0.5 if (build and sp > 0.7) else 1, alpha=210)
    # 行頭でフラッシュ
    for l2 in lines:
        if l2["text"].startswith("笑うな"):
            post["flash"] = max(post["flash"], 0.85 * math.exp(-max(0, t - l2["start"]) / 0.12)
                                if t >= l2["start"] else 0)
    if sec["start"] <= t < sec["start"] + 0.5 and not build:
        post["flash"] = max(post["flash"], math.exp(-(t - sec["start"]) / 0.15))
    if build and sec["end"] - t < 0.6:
        post["flash"] = max(post["flash"], smooth(1 - (sec["end"] - t) / 0.6))
    if final and (bi % 4 == 0) and not calm:
        post["flash"] = max(post["flash"], 0.35 * pulse)
    return im, post


def lala(im, A, ctx):
    t = ctx["t"]
    strip = A.misc("lala", lambda: text_image(A, "ラララ　ラララ　" * 4, "dela", 150, (0, 0, 0, 0),
                                               stroke=4, stroke_color=(255, 255, 255, 150)))
    seg = strip.width / 4
    for r in range(5):
        y = 40 + r * 210
        sp = 260 * (1 if r % 2 else -1)
        x = -((t * sp) % seg) - (0 if sp > 0 else 0)
        im.paste(strip, (int(x), int(y)), strip)


def title_card(im, A, ctx, k, cfg):
    """イントロのタイトル表示。"""
    title = cfg["title"]
    f = A.font("dela", 190)
    total = sum(f.getlength(c) for c in title)
    x = W / 2 - total / 2
    for i, ch in enumerate(title):
        a = f.getlength(ch)
        ct = 0.05 + i * ctx["period"] / 2
        p = clamp((k - ct) / 0.12)
        if p > 0:
            sc = 1 + 1.3 * (1 - ease_out(p))
            paste_glyph(im, A.glyph(ch, "dela", 190, RED + (255,)), x + a / 2 + 9, H * 0.42 + 7, sc)
            paste_glyph(im, A.glyph(ch, "dela", 190, WHITE + (255,)), x + a / 2, H * 0.42, sc)
        x += a
    if k > 1.6:
        sub = text_image(A, cfg["artist"], "dot", 52, WHITE + (255,))
        paste_glyph(im, sub, W / 2, H * 0.60, 1.0, smooth((k - 1.6) / 0.6))


def end_title(im, A, cfg, k):
    t1 = text_image(A, cfg["title"], "dela", 150, WHITE + (255,))
    paste_glyph(im, t1, W / 2, H * 0.44, 1.0, smooth(k / 0.8))
    t2 = text_image(A, cfg["artist"], "dot", 48, WHITE + (255,))
    paste_glyph(im, t2, W / 2, H * 0.60, 1.0, smooth((k - 0.6) / 0.8))


# ====================================================================== 歌詞

def lyrics(im, A, ctx, cfg):
    t = ctx["t"]
    for ln in ctx["lines_here"]:
        sec = ln["section"]
        n = ln["index"]
        txt = ln["text"]
        if sec == "Intro":
            if txt.startswith("ハイ"):
                draw_line(im, A, ctx, ln, W / 2, H * 0.80, 76, "dot", WHITE + (255,), "type",
                          align="center")
            else:
                draw_line(im, A, ctx, ln, W / 2, H * 0.90, 58, "serif", WHITE + (255,), "type",
                          weight=600, align="center", spacing=0.08)
        elif sec in ("Verse 1", "Verse 2"):
            k = cfg["verse_layout"][n % len(cfg["verse_layout"])]
            col, sh = WHITE + (255,), ((0, 0, 0, 170), 4, 4)
            if k == "vr":
                draw_line(im, A, ctx, ln, W * 0.86, H * 0.17, 74, "serif", col, "type", vertical=True,
                          weight=700, shadow=sh)
            elif k == "vl":
                draw_line(im, A, ctx, ln, W * 0.14, H * 0.17, 74, "serif", col, "type", vertical=True,
                          weight=700, shadow=sh)
            elif k == "hl":
                draw_line(im, A, ctx, ln, W * 0.09, H * 0.74, 70, "serif", col, "type", weight=700,
                          shadow=sh)
            else:
                draw_line(im, A, ctx, ln, W * 0.91, H * 0.30, 70, "serif", col, "type", weight=700,
                          shadow=sh, align="right")
        elif sec == "Pre-Chorus":
            w = draw_line(im, A, ctx, ln, W / 2, H / 2, 92, "serif", WHITE + (255,), "type",
                          weight=800, align="center", shadow=((0, 0, 0, 200), 5, 5),
                          jitter=3 * ctx["pulse"])
            p = clamp((t - ln["start"]) / max(0.3, ln["end"] - ln["start"]))
            d = ImageDraw.Draw(im)
            d.rectangle([W / 2 - w / 2, H / 2 + 70, W / 2 - w / 2 + w * p, H / 2 + 78], fill=RED)
        elif sec in ("Chorus", "Final Chorus"):
            chorus_line(im, A, ctx, ln)
        elif sec == "Bridge":
            first = n % 2 == 0
            draw_line(im, A, ctx, ln, W / 2, H * (0.44 if first else 0.57), 70, "serif",
                      WHITE + (255,), "fade", weight=500, align="center", spacing=0.35,
                      shadow=((0, 0, 0, 150), 3, 3))
        elif sec == "Break":
            if txt.startswith("ハイ"):
                draw_line(im, A, ctx, ln, W / 2, H * 0.80, 88, "dot", WHITE + (255,), "type",
                          align="center")
            else:
                g = 18 * ctx["pulse"] if t > ln["chars"][-1] else 0
                draw_line(im, A, ctx, ln, W / 2, H / 2, 84, "serif", WHITE + (255,), "fade",
                          weight=500, align="center", spacing=0.15, jitter=g)
        elif sec == "Outro":
            first = txt.startswith("「")
            draw_line(im, A, ctx, ln, W / 2, H * (0.46 if first else 0.58), 80 if first else 60,
                      "serif", WHITE + (255,), "fade", weight=600 if first else 400,
                      align="center", spacing=0.12, shadow=((0, 0, 0, 160), 4, 4))


def chorus_line(im, A, ctx, ln):
    txt = ln["text"]
    red, white = RED + (255,), WHITE + (255,)
    if txt.startswith("笑うな"):
        draw_line(im, A, ctx, ln, W / 2, H * 0.46, 230, "dela", white, "slam", align="center",
                  shadow=(red, 12, 9), jitter=4 * ctx["pulse"])
    elif "　" in txt and txt.split("　")[0] == txt.split("　")[1]:
        # 「バレるだろ　バレるだろ」「ラララ　ラララ」など繰り返しの行
        stamps(im, A, ctx, ln, txt.split("　")[0])
    else:
        big = len(txt) <= 11
        draw_line(im, A, ctx, ln, W / 2, H * 0.5, 120 if big else 100, "dela", white, "pop",
                  align="center", stroke=7, stroke_color=(0, 0, 0, 255), shadow=(red, 8, 6),
                  jitter=3 * ctx["pulse"])


def stamps(im, A, ctx, ln, phrase):
    """同じ言葉をビートごとにハンコのように画面中に叩きつける。"""
    t = ctx["t"]
    beats = ctx["beats"]
    starts = [ln["chars"][0], ln["chars"][len(phrase) + 1]]
    extra = [b for b in beats if ln["start"] < b < ln["end"]]
    times = sorted(set(round(x, 3) for x in starts + extra))
    fade = clamp((ln["end"] - t) / 0.2)
    for k, st in enumerate(times):
        if t < st:
            continue
        rng = np.random.default_rng(ln["index"] * 97 + k)
        main = st in [round(s, 3) for s in starts]
        size = 200 if main else int(rng.uniform(90, 150))
        col = (WHITE if (main or k % 3 == 0) else RED) + (255,)
        rot = round(rng.uniform(-14, 14))
        g = A.misc(("stamp", phrase, size, col, rot),
                   lambda: text_image(A, phrase, "dela", size, col, 6, (0, 0, 0, 255)).rotate(
                       rot, Image.BICUBIC, expand=True))
        if main:
            first = st == round(starts[0], 3)
            cx, cy = W / 2 + (-260 if first else 260), H * (0.36 if first else 0.62)
        else:
            cx, cy = rng.uniform(0.15, 0.85) * W, rng.uniform(0.12, 0.88) * H
        p = clamp((t - st) / 0.1)
        paste_glyph(im, g, cx, cy, 1 + 0.8 * (1 - ease_out(p)), fade)


# ====================================================================== ポスト処理

def post_process(im, A, post, fi, layer=None):
    a = np.asarray(im).astype(np.float32)
    if post.get("tint"):
        a *= np.array(post["tint"], np.float32)
    a *= post["bright"]
    if post.get("leak"):
        sh = int(fi * 2) % W
        a += np.roll(A.leak, sh, axis=1) * post["leak"]
    if layer is not None and layer.getbbox():
        la = np.asarray(layer).astype(np.float32)
        al = la[..., 3:] / 255
        a = a * (1 - al) + la[..., :3] * al
    ca = int(round(post["ca"]))
    if ca:
        a[..., 0] = np.roll(a[..., 0], ca, axis=1)
        a[..., 2] = np.roll(a[..., 2], -ca, axis=1)
    if post["glitch"]:
        rng = np.random.default_rng(fi * 13)
        for _ in range(post["glitch"]):
            y0 = int(rng.integers(0, H - 20))
            h = int(rng.integers(8, 90))
            dx = int(rng.integers(-120, 120))
            a[y0:y0 + h] = np.roll(a[y0:y0 + h], dx, axis=1)
            if rng.random() < 0.5:
                a[y0:y0 + h, :, int(rng.integers(0, 3))] *= 0.3
    if post["flash"] > 0.01:
        a += (255 - a) * min(1.0, post["flash"])
    if post["redvig"] > 0:
        a[..., 0] += (1 - A.vig[..., 0]) * 255 * post["redvig"]
    a *= A.vig
    a += A.grain[fi % len(A.grain)] * post["grain"]
    if post["scan"]:
        a *= A.scan
    lb = post["letterbox"]
    if lb:
        a[:lb] = 0
        a[H - lb:] = 0
    if post["fade"] < 1:
        a *= post["fade"]
    return np.clip(a, 0, 255).astype(np.uint8)


# ====================================================================== メイン

class Renderer:
    def __init__(self, cfg, analysis):
        self.cfg = cfg
        self.A = Assets(cfg)
        self.beats = np.array(analysis["beats"])
        self.energy = analysis["energy"]
        self.lines = build_lines(cfg)

    def frame(self, fi):
        t = fi / FPS
        cfg = self.cfg
        ctx = {"t": t, "fi": fi, "beats": self.beats,
               "energy": self.energy[min(fi, len(self.energy) - 1)]}
        beat_ctx(ctx)
        ctx["sec"] = section_of(cfg, t)
        here = [ln for ln in self.lines if ln["start"] - 0.3 <= t < ln["end"]]
        ctx["lines_here"] = here
        prev = [ln for ln in self.lines if ln["start"] <= t]
        ctx["prev_line"] = prev[-2] if len(prev) >= 2 else None
        im, post = scene(ctx, self.A, cfg)
        # 歌詞は明るさ・色補正を受けないように別レイヤーに描いて後から重ねる
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        lyrics(layer, self.A, ctx, cfg)
        return post_process(im, self.A, post, fi, layer)


_R = None


def _init(cfg, analysis):
    global _R
    _R = Renderer(cfg, analysis)


def _render_chunk(args):
    f0, f1, path = args
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
                          "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264",
                          "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-g", "60",
                          str(path)], stdin=subprocess.PIPE)
    for fi in range(f0, f1):
        p.stdin.write(_R.frame(fi).tobytes())
    p.stdin.close()
    p.wait()
    return path


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--config", required=True)
    ap.add_argument("--out", default="mv.mp4")
    ap.add_argument("--stills", help="カンマ区切りの秒数。その時刻の静止画を書き出す")
    ap.add_argument("--range", nargs=2, type=float, help="開始・終了秒 (一部だけ書き出す)")
    ap.add_argument("--workers", type=int, default=4)
    args = ap.parse_args()

    cfg_path = Path(args.config)
    cfg = json.load(open(cfg_path, encoding="utf-8"))
    base = cfg_path.parent
    for k in ("audio", "cover", "lyrics_timed", "fonts"):
        cfg[k] = str((base / cfg[k]).resolve())
    cache = base / "analysis.json"
    if cache.exists():
        analysis = json.load(open(cache))
    else:
        print("音声を解析中...")
        analysis = analyze(cfg)
        json.dump(analysis, open(cache, "w"))

    if args.stills:
        _init(cfg, analysis)
        out = Path(args.out).with_suffix("")
        out.mkdir(parents=True, exist_ok=True)
        for s in args.stills.split(","):
            fi = int(round(float(s) * FPS))
            Image.fromarray(_R.frame(fi)).save(out / f"still_{float(s):07.2f}.png")
        print(f"静止画を書き出しました: {out}")
        return

    t0, t1 = args.range if args.range else (0.0, cfg["duration"])
    f0, f1 = int(round(t0 * FPS)), int(round(t1 * FPS))
    n = args.workers
    bounds = [f0 + (f1 - f0) * i // n for i in range(n + 1)]
    with tempfile.TemporaryDirectory() as tmp:
        jobs = [(bounds[i], bounds[i + 1], Path(tmp) / f"part{i}.mp4") for i in range(n)]
        with Pool(n, initializer=_init, initargs=(cfg, analysis)) as pool:
            parts = pool.map(_render_chunk, jobs)
        lst = Path(tmp) / "list.txt"
        lst.write_text("".join(f"file '{p}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
                        "-ss", f"{t0:.3f}", "-t", f"{t1 - t0:.3f}", "-i", cfg["audio"],
                        "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k",
                        "-shortest", "-movflags", "+faststart", args.out], check=True)
    print(f"完成: {args.out}")


if __name__ == "__main__":
    main()
