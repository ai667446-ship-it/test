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

for c in meta['cues']: add(pop_sfx(), c, 0.18)
for s in meta['scenes'][1:]: add(swish(), s - 0.1, 0.12)

mix = mix / max(1e-9, np.abs(mix).max()) * 0.8
data = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
print('wrote', sys.argv[2], dur, 's')
