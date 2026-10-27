#!/usr/bin/env python3
"""動きの激しい縦型「文字PV」レンダラー (1080x1920 / 60fps)。

Alight Motion 系の文字入れ技法をプログラムで再現する:
  - ヌル(親)によるカメラワーク: ビートごとのズームパンチ・スイング・振動を画像と文字の両方に
  - イージング: 文字は行き過ぎて戻る (ease-out-back) ポップ、回転しながら着地
  - 強調文字は巨大化・赤、「ぐちゃぐちゃ」は文字化け、「言えない」は点滅など行ごとの演出
  - 図形: 線が細くなりながら広がる四角/円、ハート、ストライプ円、集中線
  - ビート上のカット + 円形ワイプ/ストライプワイプ/フラッシュ/ズームブラー/グリッチ
  - 舞うバラの花びら、ブルーム、RGB ずれ、グレイン

使い方:
    python3 render_kinetic.py --config kinetic.json --stills 2,6,12 --out st
    python3 render_kinetic.py --config kinetic.json --out out.mp4
"""

import argparse
import json
import math
import subprocess
import tempfile
from multiprocessing import Pool
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS = 1080, 1920, 60
RED = (230, 18, 52)
WHITE = (252, 248, 248)
PUNCT = set("、。！？!?「」…　 ")
APPEAR = 0.22       # 文字が出きるまで
EXIT = 0.12         # 行が消えるまで
MIN_FULL = 0.8      # 全文がはっきり見えている最短時間


def clamp(x, lo=0.0, hi=1.0):
    return lo if x < lo else hi if x > hi else x


def ease_out(p):
    return 1 - (1 - clamp(p)) ** 3


def ease_out_back(p, s=2.2):
    """行き過ぎて戻るイージング (グラフの山が 1 を超える)。"""
    p = clamp(p) - 1
    return 1 + (s + 1) * p ** 3 + s * p ** 2


def ease_io(p):
    p = clamp(p)
    return 0.5 - 0.5 * math.cos(math.pi * p)


# ====================================================================== 素材

class Assets:
    def __init__(self, cfg):
        fd = Path(cfg["fonts"])
        self.font_paths = {"dela": fd / "DelaGothicOne-Regular.ttf",
                           "serif": fd / "NotoSerifJP%5Bwght%5D.ttf",
                           "sans": fd / "NotoSansJP%5Bwght%5D.ttf",
                           "dot": fd / "DotGothic16-Regular.ttf",
                           "rampart": fd / "RampartOne-Regular.ttf",
                           "reggae": fd / "ReggaeOne-Regular.ttf"}
        self._fonts, self._glyphs, self._shapes = {}, {}, {}
        self.img, self.img_flip = {}, {}
        for key, path in cfg["images"].items():
            im = Image.open(path).convert("RGB")
            im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2.2, 80, 2))
            a = np.asarray(im).astype(np.float32) / 255
            a = np.clip((a - 0.5) * 1.12 + 0.5, 0, 1) ** 1.06  # 黒を締める
            a[..., 0] = np.clip(a[..., 0] * 1.06, 0, 1)         # 赤を少し強く
            im = Image.fromarray((a * 255).astype(np.uint8))
            self.img[key] = im
            self.img_flip[key] = im.transpose(Image.FLIP_LEFT_RIGHT)
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        self.xx, self.yy = xx, yy
        r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
        self.vig = np.clip(1 - 0.42 * (r / 1.3) ** 2.2, 0, 1)[..., None].astype(np.float32)
        rng = np.random.default_rng(9)
        self.grain = [rng.normal(0, 1, (H, W, 1)).astype(np.float32) for _ in range(8)]

    def font(self, key, size, weight=None):
        k = (key, size, weight)
        if k not in self._fonts:
            f = ImageFont.truetype(str(self.font_paths[key]), size)
            if weight:
                f.set_variation_by_axes([weight])
            self._fonts[k] = f
        return self._fonts[k]

    def glyph(self, ch, font, size, fill, weight=None, stroke=0, stroke_fill=(0, 0, 0, 255)):
        k = (ch, font, size, fill, weight, stroke, stroke_fill)
        g = self._glyphs.get(k)
        if g is None:
            f = self.font(font, size, weight)
            pad = size // 2 + stroke * 2
            g = Image.new("RGBA", (size + 2 * pad, size + 2 * pad), (0, 0, 0, 0))
            ImageDraw.Draw(g).text((g.width / 2, g.height / 2), ch, font=f, anchor="mm", fill=fill,
                                   stroke_width=stroke, stroke_fill=stroke_fill)
            self._glyphs[k] = g
        return g


# ====================================================================== 解析・タイムライン

class Timeline:
    def __init__(self, cfg):
        b = json.load(open(cfg["beats"]))
        self.beats = np.array(b["beats"])
        self.period = float(np.median(np.diff(self.beats)))
        lead = cfg.get("lyric_lead_beats", 1) * self.period
        lines = json.load(open(cfg["lyrics_timed"], encoding="utf-8"))
        self.lines = []
        for i, (ln, meta) in enumerate(zip(lines, cfg["lines"])):
            ln = {**ln, **meta, "index": i}
            # 行ごとの微調整: offset_beats (+0.5 で半拍遅らせる)
            shift = meta.get("offset_beats", 0) * self.period
            ln["chars"] = [c - lead + shift for c in ln["chars"]]
            self.lines.append(ln)
        for i, ln in enumerate(self.lines):
            nxt = self.lines[i + 1]["chars"][0] if i + 1 < len(self.lines) else cfg["duration"]
            last = max(ln["chars"])
            ln["start"] = ln["chars"][0]
            ln["end"] = min(nxt - 0.03, last + APPEAR + max(ln.get("hold", 1.4), MIN_FULL) + EXIT)
            # 最後の文字までしっかり見せる時間を確保するため、必要なら出現を前に詰める
            deadline = ln["end"] - EXIT - MIN_FULL - APPEAR
            first = ln["chars"][0]
            if last > deadline and last > first:
                k = max(0.0, deadline - first) / (last - first)
                ln["chars"] = [first + (c - first) * k for c in ln["chars"]]
        # ショット: 開始時刻をビートに吸着
        self.shots = []
        for s in cfg["shots"]:
            s = dict(s)
            j = int(np.argmin(np.abs(self.beats - s["t"])))
            if abs(self.beats[j] - s["t"]) < 0.2:
                s["t"] = float(self.beats[j])
            self.shots.append(s)
        self.shots[0]["t"] = 0.0
        for k, s in enumerate(self.shots):
            s["end"] = self.shots[k + 1]["t"] if k + 1 < len(self.shots) else cfg["duration"]
            s["seed"] = k * 37 + 5
        # 強いヒット: 行頭 + 4拍ごと
        self.hits = sorted([ln["start"] + APPEAR * 0.5 for ln in self.lines] +
                           [float(x) for x in self.beats[::4]])

    def beat_info(self, t):
        bt = self.beats
        i = int(np.searchsorted(bt, t, side="right") - 1)
        if i < 0:
            return 0, 9.0, 9.0
        bar = i - (i % 4)
        return i, t - bt[i], t - bt[bar]

    def last_hit(self, t):
        i = int(np.searchsorted(self.hits, t, side="right") - 1)
        return t - self.hits[i] if i >= 0 else 9.0


# ====================================================================== カメラ (ヌル)

def camera_null(tl, t):
    """全体を動かす親ヌル: ビートでズームパンチ、ゆっくりスイング、ヒットで振動。"""
    i, since, bar_since = tl.beat_info(t)
    pulse = math.exp(-since / 0.11)
    bar = math.exp(-bar_since / 0.22)
    hit = tl.last_hit(t)
    vib = math.exp(-hit / 0.22) if hit < 1 else 0.0
    scale = 1 + 0.045 * pulse + 0.035 * bar
    rot = 2.2 * math.sin(2 * math.pi * t / (tl.period * 8)) + vib * 2.5 * math.sin(2 * math.pi * 15 * hit)
    dx = vib * 26 * math.sin(2 * math.pi * 14 * hit + 1.0)
    dy = vib * 18 * math.sin(2 * math.pi * 11 * hit)
    return {"scale": scale, "rot": rot, "dx": dx, "dy": dy, "pulse": pulse, "bar": bar, "vib": vib, "beat": i}


# ====================================================================== 背景ショット

def shot_frame(A, shot, t, cam):
    """ショットの画像をカメラ込みで切り出す (float32)。"""
    p = ease_io((t - shot["t"]) / max(0.01, shot["end"] - shot["t"]))
    f0, f1 = shot["from"], shot.get("to", shot["from"])
    cx = f0[0] + (f1[0] - f0[0]) * p
    cy = f0[1] + (f1[1] - f0[1]) * p
    z = (f0[2] + (f1[2] - f0[2]) * p) * cam["scale"]
    rot = shot.get("rot", 0) + cam["rot"]
    src = (A.img_flip if shot.get("flip") else A.img)[shot["img"]]
    if shot.get("flip"):
        cx = 1 - cx
    sw, sh = src.size
    # 縦長素材が画面を覆う最小倍率を 1 とする (回転しても端が出ないよう少し余裕を持たせる)
    base = max(W / sw, H / sh) * 1.06
    s = 1 / (base * z)
    vw, vh = W * s, H * s
    pcx = clamp(cx * sw, vw / 2, sw - vw / 2)
    pcy = clamp(cy * sh, vh / 2, sh - vh / 2)
    co, si = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    a, b, d, e = s * co, -s * si, s * si, s * co
    ox, oy = W / 2 + cam["dx"], H / 2 + cam["dy"]
    c = pcx - a * ox - b * oy
    f = pcy - d * ox - e * oy
    im = src.transform((W, H), Image.AFFINE, (a, b, c, d, e, f), resample=Image.BILINEAR)
    arr = np.asarray(im).astype(np.float32)
    if shot.get("dark"):
        arr *= shot["dark"]
    return arr


def current_shot(tl, t):
    k = max(i for i, s in enumerate(tl.shots) if s["t"] <= t or i == 0)
    return k, tl.shots[k]


def zoom_blur(a, amount):
    if amount < 0.01:
        return a
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    acc = a.copy()
    n = 4
    for k in range(1, n):
        s = 1 + amount * k / n
        w2, h2 = int(W * s), int(H * s)
        z = im.resize((w2, h2), Image.BILINEAR).crop(((w2 - W) // 2, (h2 - H) // 2, (w2 - W) // 2 + W, (h2 - H) // 2 + H))
        acc += np.asarray(z).astype(np.float32)
    return acc / n


def background(A, tl, t, cam):
    k, shot = current_shot(tl, t)
    a = shot_frame(A, shot, t, cam)
    since = t - shot["t"]
    kind = shot.get("trans", "cut")
    post = {}
    if k > 0 and kind in ("radial", "stripe") and since < 0.26:
        prev = shot_frame(A, tl.shots[k - 1], t, cam)
        p = ease_out(since / 0.26)
        if kind == "radial":
            r = p * 1150
            m = ((A.xx - W / 2) ** 2 + (A.yy - H / 2) ** 2 < r * r)[..., None]
            ring = np.abs(np.sqrt((A.xx - W / 2) ** 2 + (A.yy - H / 2) ** 2) - r) < 10
            a = np.where(m, a, prev)
            a[ring] = 255
        else:
            band = ((A.xx * 0.7 + A.yy * 0.7) % 160) / 160
            m = (band < p * 1.05)[..., None]
            a = np.where(m, a, prev)
    elif kind == "zoom" and since < 0.2:
        a = zoom_blur(a, 0.3 * (1 - ease_out(since / 0.2)))
    elif kind == "flash" and since < 0.16:
        post["flash"] = 1 - since / 0.16
    elif kind == "redflash" and since < 0.16:
        post["redflash"] = 1 - since / 0.16
    elif kind == "glitch" and since < 0.18:
        post["glitch"] = 8
        post["ca"] = 22
    elif kind == "invert" and since < 0.05:
        a = 255 - a
    if shot.get("flicker"):
        r = np.random.default_rng(int(t * FPS) // 3 + 77).random()
        a *= 0.35 if r < 0.18 else 1.0
    return a, post


# ====================================================================== 図形

def heart_points(cx, cy, size, n=60):
    pts = []
    for k in range(n):
        th = 2 * math.pi * k / n
        x = 16 * math.sin(th) ** 3
        y = -(13 * math.cos(th) - 5 * math.cos(2 * th) - 2 * math.cos(3 * th) - math.cos(4 * th))
        pts.append((cx + x * size / 34, cy + y * size / 34))
    return pts


def draw_shape(layer, kind, cx, cy, size, width, rot, color, alpha):
    """図形を1つ描く。線は width (0 なら塗り)。"""
    if alpha <= 0.02 or size < 4:
        return
    S = int(size * 1.6) + 20
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    c = S / 2
    col = color + (int(255 * alpha),)
    w = max(1, int(width))
    r = size / 2
    if kind == "square":
        d.rectangle([c - r, c - r, c + r, c + r], outline=col, width=w)
    elif kind == "ring":
        d.ellipse([c - r, c - r, c + r, c + r], outline=col, width=w)
    elif kind == "heart":
        pts = heart_points(c, c, size)
        if width <= 0:
            d.polygon(pts, fill=col)
        else:
            d.line(pts + [pts[0]], fill=col, width=w, joint="curve")
    elif kind == "stripe":
        for k in range(-S, 2 * S, 22):
            d.line([(k, 0), (k - S, S)], fill=col, width=9)
        m = Image.new("L", (S, S), 0)
        ImageDraw.Draw(m).ellipse([c - r, c - r, c + r, c + r], fill=255)
        im.putalpha(Image.fromarray((np.asarray(im.getchannel("A")).astype(np.float32) * np.asarray(m) / 255).astype(np.uint8)))
    elif kind == "burst":
        for k in range(24):
            th = 2 * math.pi * k / 24 + rot / 57.3
            r0, r1 = r * 0.45, r * (0.85 + 0.15 * (k % 2))
            d.line([(c + r0 * math.cos(th), c + r0 * math.sin(th)), (c + r1 * math.cos(th), c + r1 * math.sin(th))],
                   fill=col, width=w)
    if rot and kind not in ("burst",):
        im = im.rotate(rot, Image.BILINEAR)
    layer.paste(im, (int(cx - S / 2), int(cy - S / 2)), im)


def shape_events(tl, cfg):
    """図形を出すタイミング: 行頭 (行の設定) + 4拍ごとの飾り。"""
    ev = []
    kinds = ["square", "ring", "stripe", "square", "burst", "ring"]
    rng = np.random.default_rng(4)
    for k, b in enumerate(tl.beats[::4]):
        if b < 0.3 or b > cfg["duration"] - 0.3:
            continue
        ev.append({"t": float(b), "kind": kinds[k % len(kinds)], "x": rng.uniform(0.2, 0.8) * W,
                   "y": rng.uniform(0.25, 0.75) * H, "size": rng.uniform(380, 620),
                   "color": WHITE if k % 3 else RED, "dur": 0.5, "spin": rng.uniform(-90, 90)})
    for ln in tl.lines:
        for sh in ln.get("shapes", []):
            ev.append({"t": ln["start"] + sh.get("at", 0.0), "kind": sh["kind"], "x": sh.get("x", 0.5) * W,
                       "y": sh.get("y", 0.5) * H, "size": sh.get("size", 700),
                       "color": tuple(sh.get("color", RED)), "dur": sh.get("dur", 0.6),
                       "spin": sh.get("spin", 0), "fill": sh.get("fill", False)})
    return ev


def draw_shapes(layer, ev, t):
    for e in ev:
        p = (t - e["t"]) / e["dur"]
        if not 0 <= p <= 1:
            continue
        g = ease_out(p)
        size = e["size"] * (0.35 + 0.85 * g)
        if e["kind"] == "heart" and e.get("fill"):
            size = e["size"] * ease_out_back(p * 2.5) if p < 0.4 else e["size"]
            width = 0
            alpha = 0.6 * (1 - clamp((p - 0.6) / 0.4))  # 塗りのハートは顔を隠さないよう半透明
        else:
            width = 46 * (1 - g) + 2        # 線が太い → 細い (境界線 300→0 相当)
            alpha = 1 - clamp((p - 0.55) / 0.45)
        draw_shape(layer, e["kind"], e["x"], e["y"], size, width, e["spin"] * g, e["color"], alpha)


def draw_petals(layer, t, n=26):
    d = ImageDraw.Draw(layer)
    rng = np.random.default_rng(12)
    for _ in range(n):
        x0, y0, vx, vy, s, ph = rng.uniform(0, 1, 6)
        x = (x0 * W + (vx - 0.3) * 160 * t + 40 * math.sin(t * 1.5 + ph * 6)) % (W + 80) - 40
        y = (y0 * H + (0.35 + vy) * 260 * t) % (H + 80) - 40
        ang = ph * 6.28 + t * (1.5 + vx * 2)
        L, Wd = 14 + s * 22, 8 + s * 10
        pts = []
        for k in range(10):
            th = 2 * math.pi * k / 10
            px, py = L * math.cos(th), Wd * math.sin(th) * (0.6 + 0.4 * math.cos(th))
            pts.append((x + px * math.cos(ang) - py * math.sin(ang), y + px * math.sin(ang) + py * math.cos(ang)))
        d.polygon(pts, fill=(170 + int(60 * s), 10, 30, 215))


# ====================================================================== 文字

def layout_line(A, ln):
    """行の各文字の (x, y, size, font, color, rot) を決める。"""
    text = ln["text"]
    emph = set()
    for wd in ln.get("emph", []):
        i = text.find(wd)
        while i >= 0:
            emph.update(range(i, i + len(wd)))
            i = text.find(wd, i + 1)
    base = ln.get("size", 150)
    lay = ln["layout"]
    items = []

    def sz(i):
        c = text[i]
        s = base * (ln.get("emph_scale", 1.55) if i in emph else 1.0)
        return s * (0.7 if c in PUNCT else 1.0)

    def adv(i):
        return sz(i) * (0.62 if text[i] in PUNCT else 1.0)

    def row(idx, y, align, max_w=980, x_left=60, x_right=1020):
        tot = sum(adv(i) for i in idx)
        k = min(1.0, max_w / tot) if tot else 1.0
        if align == "center":
            x = W / 2 - tot * k / 2
        elif align == "left":
            x = x_left
        else:
            x = x_right - tot * k
        out = []
        for i in idx:
            a = adv(i) * k
            out.append((i, x + a / 2, y, sz(i) * k, 0.0))
            x += a
        return out

    idx = [i for i, c in enumerate(text) if c not in "　 "]
    if lay == "center":
        items = row(idx, ln.get("y", 0.68) * H, "center")
    elif lay == "two_rows":
        k = ln["split"]
        y1, y2 = ln.get("y", [0.62, 0.74])
        items = row([i for i in idx if i < k], y1 * H, "left") + row([i for i in idx if i >= k], y2 * H, "right")
    elif lay == "stack":
        x = ln.get("x", 0.85) * W
        y = ln.get("y", 0.30) * H
        tot = sum(adv(i) for i in idx)
        k = min(1.0, (H * 0.62) / tot)
        for i in idx:
            a = adv(i) * k
            items.append((i, x, y + a / 2, sz(i) * k, 0.0))
            y += a
    elif lay == "diag":
        (x0, y0), (x1, y1) = ln.get("from", [0.1, 0.56]), ln.get("to", [0.9, 0.8])
        x0, y0, x1, y1 = x0 * W, y0 * H, x1 * W, y1 * H
        ang = math.degrees(math.atan2(y1 - y0, x1 - x0))
        tot = sum(adv(i) for i in idx)
        L = math.hypot(x1 - x0, y1 - y0)
        k = min(1.0, L / tot)
        pos = 0.0
        for i in idx:
            a = adv(i) * k
            f = (pos + a / 2) / L
            items.append((i, x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, sz(i) * k, -ang))
            pos += a
    out = []
    for i, x, y, s, rot in items:
        e = i in emph
        font = ln.get("emph_font", "dela") if e else ln.get("font", "serif")
        color = tuple(ln.get("emph_color", RED)) if e else WHITE
        out.append({"i": i, "ch": text[i], "x": x, "y": y, "size": int(s), "font": font, "color": color,
                    "rot": rot, "emph": e})
    return out


GLITCH_CHARS = "ぐちゃあいうえおかきくけこ嫌好愛#%&@*?ガギグ"


def draw_line(layer, A, ln, t, cam):
    if not (ln["start"] - 0.05 <= t < ln["end"]):
        return
    if "_layout" not in ln:
        ln["_layout"] = layout_line(A, ln)
    items = ln["_layout"]
    out_p = clamp((t - (ln["end"] - EXIT)) / EXIT)
    # 行全体のヌル: ゆっくり流れつつ、ビートで少し膨らむ
    lt = t - ln["start"]
    drift = ln.get("drift", [0, -40])
    gx = drift[0] * ease_io(lt / 3)
    gy = drift[1] * ease_io(lt / 3)
    gscale = 1 + 0.05 * cam["pulse"] * (1 if ln.get("pump", True) else 0)
    style = ln.get("style", "pop")
    for it in items:
        ct = ln["chars"][it["i"]]
        p = (t - ct) / APPEAR
        if p <= 0:
            continue
        rng = np.random.default_rng(ln["index"] * 100 + it["i"])
        r0 = rng.uniform(-35, 35)
        ox, oy = rng.uniform(-90, 90), rng.uniform(-90, 90)
        if it["emph"]:
            sc = 1 + 2.2 * (1 - ease_out(p * 1.4))          # 叩きつけ
            rot = it["rot"] + r0 * 0.3 * (1 - ease_out(p))
            dx = dy = 0
        else:
            sc = max(0.0, ease_out_back(p))                  # 行き過ぎて戻るポップ
            rot = it["rot"] + r0 * (1 - ease_out(p))
            dx, dy = ox * (1 - ease_out(p)), oy * (1 - ease_out(p))
        ch = it["ch"]
        alpha = 1.0
        if style == "glitch" and it["i"] in ln.get("glitch_idx", []):
            k = int(t * 24 + it["i"] * 3)
            if (k % 7) < 2:
                ch = GLITCH_CHARS[(k * 7 + it["i"]) % len(GLITCH_CHARS)]
            dx += np.random.default_rng(int(t * FPS) * 13 + it["i"]).uniform(-14, 14)
        if style == "blink" and it["i"] in ln.get("blink_idx", []) and t > ct + APPEAR:
            alpha = 1.0 if int((t - ct) * 9) % 2 == 0 or t > ct + 0.8 else 0.25
        if out_p > 0:
            sc *= 1 - 0.4 * out_p
            alpha *= 1 - out_p
            rot += 25 * out_p * (1 if it["i"] % 2 else -1)
        size = it["size"]
        x = W / 2 + (it["x"] + gx + dx - W / 2) * gscale
        y = H / 2 + (it["y"] + gy + dy - H / 2) * gscale
        stroke = max(3, size // 22)
        if it["emph"]:
            # 赤い文字の後ろに白いずれ版 (二重写し) を重ねる
            g2 = A.glyph(ch, it["font"], size, (255, 255, 255, 255), None, stroke, (0, 0, 0, 255))
            paste(layer, g2, x + size * 0.035, y + size * 0.03, sc, rot, alpha * 0.6)
            g = A.glyph(ch, it["font"], size, it["color"] + (255,), None, stroke, (0, 0, 0, 255))
        else:
            g = A.glyph(ch, it["font"], size, it["color"] + (255,), ln.get("weight", 900), stroke, (10, 0, 4, 255))
        paste(layer, g, x, y, sc, rot, alpha)
    # 英語の飾り文字
    tag = ln.get("tag")
    if tag:
        p = clamp((t - ln["start"] - 0.1) / 0.3) * (1 - out_p)
        f = A.font("dot", 44)
        d = ImageDraw.Draw(layer)
        ty = ln.get("tag_y", 0.88) * H
        sp = int(10 + 30 * (1 - ease_out(p)))  # 文字間隔が詰まりながら出る
        x = W / 2 - (len(tag) * (26 + sp)) / 2
        for c in tag:
            d.text((x, ty), c, font=f, fill=(255, 255, 255, int(220 * p)), anchor="lm")
            x += 26 + sp


def paste(layer, g, x, y, sc, rot, alpha):
    if alpha <= 0.02 or sc <= 0.02:
        return
    if abs(sc - 1) > 0.01:
        g = g.resize((max(1, int(g.width * sc)), max(1, int(g.height * sc))), Image.BILINEAR)
    if abs(rot) > 0.3:
        g = g.rotate(rot, Image.BILINEAR, expand=True)
    if alpha < 0.99:
        g = g.copy()
        g.putalpha(g.getchannel("A").point(lambda v: int(v * alpha)))
    layer.paste(g, (int(x - g.width / 2), int(y - g.height / 2)), g)


def transform_layer(layer, cam, parallax=1.25):
    """文字レイヤーにカメラのヌルを (少し強めに) かける。"""
    s = 1 + (cam["scale"] - 1) * parallax
    rot = cam["rot"] * parallax
    co, si = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    inv = 1 / s
    a, b, d, e = inv * co, -inv * si, inv * si, inv * co
    ox, oy = W / 2 + cam["dx"] * parallax, H / 2 + cam["dy"] * parallax
    c = W / 2 - a * ox - b * oy
    f = H / 2 - d * ox - e * oy
    return layer.transform((W, H), Image.AFFINE, (a, b, c, d, e, f), resample=Image.BILINEAR)


# ====================================================================== 合成

def post(a, A, layer, cam, fx, fi):
    small = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).resize((W // 8, H // 8), Image.BILINEAR)
    sa = np.clip(np.asarray(small).astype(np.float32) - 140, 0, None) * 1.8
    bloom = Image.fromarray(np.clip(sa, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(5))
    a = a + np.asarray(bloom.resize((W, H), Image.BILINEAR)).astype(np.float32) * 0.7
    if layer.getbbox():
        glow = layer.resize((W // 4, H // 4), Image.BILINEAR).filter(ImageFilter.GaussianBlur(4))
        ga = np.asarray(glow.resize((W, H), Image.BILINEAR)).astype(np.float32)
        a = a + ga[..., :3] * (ga[..., 3:] / 255) * 0.35
        la = np.asarray(layer).astype(np.float32)
        al = la[..., 3:] / 255
        a = a * (1 - al) + la[..., :3] * al
    ca = int(2 + 10 * cam["pulse"] + fx.get("ca", 0))
    a[..., 0] = np.roll(a[..., 0], ca, axis=1)
    a[..., 2] = np.roll(a[..., 2], -ca, axis=1)
    g = fx.get("glitch", 0) + (4 if cam["vib"] > 0.85 else 0)
    if g:
        rng = np.random.default_rng(fi * 7)
        for _ in range(g):
            y0 = int(rng.integers(0, H - 40))
            h = int(rng.integers(10, 140))
            a[y0:y0 + h] = np.roll(a[y0:y0 + h], int(rng.integers(-180, 180)), axis=1)
    if fx.get("flash"):
        a += (255 - a) * fx["flash"] * 0.85
    if fx.get("redflash"):
        a = a * (1 - 0.6 * fx["redflash"]) + np.array(RED, np.float32) * 0.6 * fx["redflash"]
    a *= A.vig
    a += A.grain[fi % len(A.grain)] * 7
    a *= fx.get("fade", 1.0)
    return np.clip(a, 0, 255).astype(np.uint8)


class Renderer:
    def __init__(self, cfg):
        self.cfg = cfg
        self.A = Assets(cfg)
        self.tl = Timeline(cfg)
        self.ev = shape_events(self.tl, cfg)

    def frame(self, fi):
        t = fi / FPS
        cfg, A, tl = self.cfg, self.A, self.tl
        cam = camera_null(tl, t)
        a, fx = background(A, tl, t, cam)
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw_petals(layer, t)
        draw_shapes(layer, self.ev, t)
        for ln in tl.lines:
            draw_line(layer, A, ln, t, cam)
        layer = transform_layer(layer, cam)
        fx["fade"] = clamp(t / 0.12) * clamp((cfg["duration"] - t) / 0.25)
        return post(a, A, layer, cam, fx, fi)


_R = None


def _init(cfg):
    global _R
    _R = Renderer(cfg)


def _chunk(args):
    f0, f1, path = args
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                          "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "16",
                          "-pix_fmt", "yuv420p", "-g", "60", str(path)], stdin=subprocess.PIPE)
    for fi in range(f0, f1):
        p.stdin.write(_R.frame(fi).tobytes())
    p.stdin.close()
    p.wait()
    return path


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--config", required=True)
    ap.add_argument("--out", default="kinetic.mp4")
    ap.add_argument("--stills")
    ap.add_argument("--workers", type=int, default=4)
    args = ap.parse_args()
    p = Path(args.config)
    cfg = json.load(open(p, encoding="utf-8"))
    for k in ("audio", "lyrics_timed", "fonts", "beats"):
        cfg[k] = str((p.parent / cfg[k]).resolve())
    cfg["images"] = {k: str((p.parent / v).resolve()) for k, v in cfg["images"].items()}
    if args.stills:
        _init(cfg)
        out = Path(args.out)
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
        lst.write_text("".join(f"file '{q}'\n" for q in parts))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-i", cfg["audio"],
                        "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest",
                        "-movflags", "+faststart", args.out], check=True)
    print(f"完成: {args.out}")


if __name__ == "__main__":
    main()
