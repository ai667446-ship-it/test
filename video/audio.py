"""BGM（カルプラス・ストロング法のはじいた弦）と効果音を合成して WAV にする。
使い方: python3 audio.py out/a.meta.json out/a.wav"""
import json, sys, wave
import numpy as np

SR = 44100
meta = json.load(open(sys.argv[1]))
dur = meta['duration']
N = int(SR * dur)
mix = np.zeros(N)
rng = np.random.default_rng(1)

def pluck(freq, length=1.6, bright=0.5):
    n = int(SR * length); p = int(SR / freq)
    buf = rng.uniform(-1, 1, p) * bright
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.996 * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out * np.linspace(1, 0, n) ** 1.5

def add(sig, t, gain):
    i = int(t * SR)
    if i >= N: return
    seg = sig[: N - i]
    mix[i:i + len(seg)] += seg * gain

note = lambda m: 440 * 2 ** ((m - 69) / 12)
bpm = 96; beat = 60 / bpm
# C - G - Am - F のアルペジオ
chords = [[48, 55, 60, 64, 67], [43, 50, 59, 62, 67], [45, 52, 57, 60, 64], [41, 48, 57, 60, 65]]
melody = [72, None, 76, 74, 72, None, 67, None, 69, None, 72, 71, 69, None, 67, None]
cache = {}
def P(m, l=1.6, b=0.5):
    k = (m, l, b)
    if k not in cache: cache[k] = pluck(note(m), l, b)
    return cache[k]

t, bar = 0.0, 0
while t < dur - 1:
    ch = chords[bar % 4]
    add(P(ch[0] - 12, 2.4, 0.7), t, 0.22)
    for k, idx in enumerate([1, 2, 3, 4, 3, 2, 3, 4]):
        add(P(ch[idx], 1.2, 0.4), t + k * beat / 2, 0.10)
    if bar % 8 >= 4:  # 後半はメロディも
        for k in range(4):
            m = melody[(bar % 4) * 4 + k]
            if m: add(P(m, 1.4, 0.45), t + k * beat, 0.13)
    t += beat * 4; bar += 1

# 最後はフェードアウト
fade = int(SR * 2.5)
mix[-fade:] *= np.linspace(1, 0, fade)

def pop_sfx():
    n = int(SR * 0.12); tt = np.arange(n) / SR
    f = 500 + 900 * tt / tt[-1]
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 35)
def swish():
    n = int(SR * 0.35); tt = np.arange(n) / SR
    noise = rng.normal(0, 1, n)
    k = np.ones(40) / 40
    noise = noise - np.convolve(noise, k, 'same')  # 高域寄りに
    return noise * np.sin(np.pi * tt / tt[-1]) ** 2 * 0.5

def page_flip(seed):
    # 紙をめくる「パラッ」: 高域寄りのノイズに、ばらつきのある立ち上がりと細かい揺れ
    r = np.random.default_rng(100 + seed)
    n = int(SR * (0.18 + r.uniform(0, 0.06))); tt = np.arange(n) / SR
    noise = r.normal(0, 1, n)
    hp = np.diff(noise, prepend=0)                       # 高域
    bp = np.convolve(hp, np.ones(6) / 6, 'same')         # 耳障りな最高域を少し落とす
    env = np.minimum(tt / 0.025, 1) * np.exp(-np.maximum(tt - 0.025, 0) * 18)
    flutter = 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * r.uniform(28, 40) * tt))
    return bp * env * flutter

def power_off():
    # 「カチッ」＋音程が下がる「ヒューン」
    n = int(SR * 0.9); tt = np.arange(n) / SR
    click = np.zeros(n); k = int(SR * 0.012)
    click[:k] = rng.normal(0, 1, k) * np.exp(-np.arange(k) / (SR * 0.003))
    click += np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 120) * 0.6
    f = 520 * np.exp(-tt * 4.0) + 35
    sweep = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.2) * np.minimum(tt / 0.02, 1)
    sweep = np.roll(sweep, int(SR * 0.04)); sweep[:int(SR * 0.04)] = 0
    return click * 0.9 + sweep * 0.8

ease_in_out = lambda x: 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2
names = meta.get('names', [])
for start, name in zip(meta['scenes'], names):
    if name == 'shelf':
        # 本が入るペース（fill = easeInOut((lt-0.5)/3.7)）に合わせて 8 回めくる
        for i in range(8):
            target = (i + 0.5) / 8
            lo, hi = 0.0, 1.0
            for _ in range(40):
                mid = (lo + hi) / 2
                lo, hi = (mid, hi) if ease_in_out(mid) < target else (lo, mid)
            add(page_flip(i), start + 0.5 + lo * 3.7, 0.5)
    if name == 'power':
        t_off = start + 1.0                               # 電源マークが OFF になる瞬間
        a, b = int((t_off - 0.05) * SR), int((t_off + 1.4) * SR)
        duck = np.ones(N)
        ramp = np.concatenate([np.linspace(1, 0.35, int(SR * 0.05)), np.full(int(SR * 1.0), 0.35), np.linspace(0.35, 1, int(SR * 0.4))])
        duck[a:a + len(ramp)] = ramp[: max(0, min(len(ramp), N - a))]
        mix *= duck                                       # BGM を一瞬下げる
        add(power_off(), t_off, 0.22)

def chime():
    n = int(SR * 0.6); tt = np.arange(n) / SR
    a = np.sin(2 * np.pi * 1318.5 * tt) * np.exp(-tt * 9)
    b = np.sin(2 * np.pi * 1760 * tt) * np.exp(-np.maximum(tt - 0.08, 0) * 9) * (tt > 0.08)
    return (a + b) * 0.5

def switch_click():
    n = int(SR * 0.05); tt = np.arange(n) / SR
    return (rng.normal(0, 1, n) * np.exp(-tt * 400) + np.sin(2 * np.pi * 2600 * tt) * np.exp(-tt * 250)) * 0.6

for start, name in zip(meta['scenes'], names):
    if name == 'c_clear':                                  # 控えをゴミ箱へ（8 枚）
        for i in range(8): add(page_flip(i + 10), start + 0.4 + i * 0.275 + 0.15, 0.45)
    if name == 'c_copy':                                   # 2 回目は一瞬
        add(chime(), start + 4.1, 0.3)
    if name == 'k_choose':                                 # スイッチをオフ
        add(switch_click(), start + 0.9, 0.5); add(switch_click(), start + 1.4, 0.5)

for c in meta['cues']: add(pop_sfx(), c, 0.18)
for s in meta['scenes'][1:]: add(swish(), s - 0.1, 0.12)

# 音量: 曲全体の中央値付近の RMS を -20dB にそろえ、はみ出す音だけ柔らかく抑える
win = int(SR * 0.5)
rms = np.sqrt(np.array([np.mean(mix[i:i + win] ** 2) for i in range(0, N - win, win)]))
mix = mix * (10 ** (-20 / 20) / max(1e-9, np.median(rms)))
mix = np.tanh(mix * 1.1) / 1.1 * 0.95
data = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
print('wrote', sys.argv[2], dur, 's')
