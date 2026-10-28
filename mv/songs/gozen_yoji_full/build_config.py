import json, sys
sys.path.insert(0, '/home/user/test')
import numpy as np
import beat_sync as b

t, beats, L, g = b.detect_beats('song.mp3', 137.98)
json.dump({"bpm": t, "beats": [float(x) for x in beats]}, open('beats.json', 'w'))
print('bpm', round(t, 3), 'grid', g, 'n', len(beats), 'dur', round(L, 2))

EN = ["4 a.m. — the city died", "only you were smiling",
      "slipping past the convenience store lights", "down a road whose name we don't even know",
      "“how far are we going?”", "we promised never to ask",
      "yesterday, tossed onto the passenger seat", "and a half-drunk, lukewarm coffee",
      "the right way to live", "I want to forget it, just for tonight",
      "an unfamiliar song on the radio", "you hum along under your breath",
      "watching your profile", "I feel like I could never go home",
      "a getaway at 4 a.m.", "take me away until the morning comes", "even if our tomorrow",
      "is nowhere to be found, that's alright", "flowing past beyond the window",
      "afterimages of a sleepless city", "with you, even a place with nothing",
      "felt like the edge of the world",
      "a rusted guardrail along the sea", "the wind was strangely cold", "you, still barefoot,",
      "were gazing at the white waves", "“will we forget all of this someday?”",
      "you murmured, almost to yourself", "there were things I wanted to forget",
      "but this was a night I never wanted to",
      "come tomorrow, surely", "we'll go back to our everyday faces", "so just for now",
      "let's stay liars a little longer",
      "a getaway at 4 a.m.", "I was afraid of the morning coming", "we couldn't give our yesterday",
      "a name", "the horizon turns pale", "light fills your eyes",
      "pretending to look for the way home", "we stayed here a little longer",
      "the truth is, I wanted to run", "not from you, but from myself", "but next to you",
      "I could breathe, just a little", "instead of asking “will I see you again?”",
      "I started the engine", "you smiled, a little troubled",
      "“let's meet in the daytime next time”",
      "a getaway at 4 a.m.", "the sunrise dyes the city", "our tomorrow is beginning",
      "or so it felt", "flowing past beyond the window", "the shadow of who I was until yesterday",
      "that horizon we saw together", "I'll live on without forgetting it",
      "4 a.m. — the city woke up", "only you were still smiling"]
assert len(EN) == 60

NIGHT = {"mul": [0.38, 0.45, 0.75], "add": [0, 2, 10]}
PREDAWN = {"mul": [0.72, 0.68, 0.9], "add": [12, 6, 28]}
WARM = {"mul": [1.12, 0.88, 0.70], "add": [30, 10, 0]}
CAR = {
    "green": {"window": [0.5, 0.29, 1.0, 0.47], "flow": 800,
              "light_colors": [[120, 255, 230], [255, 170, 200], [255, 240, 200], [140, 200, 255]],
              "sweep_color": [150, 255, 205]},
    "red": {"window": [0.62, 0.24, 0.95, 0.55], "flow": 1000,
            "light_colors": [[255, 80, 160], [90, 160, 255], [255, 230, 240], [255, 140, 90]],
            "sweep_color": [255, 120, 200]},
    "purple": {"window": [0.40, 0.30, 1.0, 0.54], "flow": 900,
               "light_colors": [[255, 120, 220], [120, 240, 255], [255, 255, 255], [200, 150, 255]],
               "sweep_color": [220, 160, 255]},
}
BEACH = {"couple": {"sun": [0.5, 0.335], "sea": [0.0, 0.34, 1.0, 0.80]},
         "girl": {"sun": [0.41, 0.665], "sea": [0.0, 0.715, 1.0, 0.87], "sun_color": [255, 200, 170]}}


def car(t, img, fr, to, trans="cut", grade=None, **kw):
    s = {"image": img, "kind": "car", "start": t, "from": fr, "to": to, "trans_in": trans, **CAR[img], **kw}
    if grade:
        s["grade"] = grade
        if grade is WARM:  # 夜明けの車窓は流れる光を弱めに
            s["light_amt"] = 0.35
    return s


def beach(t, img, fr, to, trans="cut", mood="dawn", **kw):
    s = {"image": img, "kind": "beach", "start": t, "from": fr, "to": to, "trans_in": trans, **BEACH[img], **kw}
    if mood == "night":
        s.update(grade=NIGHT, sun_amt=0.0)
    elif mood == "predawn":
        s.update(grade=PREDAWN, sun_amt=0.14)
    return s


shots = [
    # Intro (曲名の表示) → 「午前四時、街が死んだ」
    car(0.0, "green", [0.78, 0.33, 2.2], [0.72, 0.33, 1.9]),
    car(8.7, "green", [0.62, 0.30, 1.35], [0.55, 0.42, 1.1], "zoom"),
    car(15.6, "red", [0.66, 0.36, 1.25], [0.62, 0.40, 1.08], "whip"),
    # Verse 1
    car(22.2, "purple", [0.78, 0.30, 1.8], [0.66, 0.30, 1.6], "whip"),
    car(28.5, "green", [0.55, 0.45, 1.1], [0.6, 0.35, 1.3], "zoom"),
    car(35.1, "red", [0.6, 0.42, 1.08], [0.64, 0.38, 1.22], "flash"),
    car(42.0, "purple", [0.55, 0.40, 1.3], [0.6, 0.32, 1.15], "whip"),
    # Pre-Chorus
    car(49.7, "purple", [0.62, 0.30, 1.75], [0.62, 0.30, 1.5], "zoom"),
    car(56.4, "red", [0.70, 0.33, 1.8], [0.68, 0.32, 1.5], "flash"),
    # Chorus 1 (ショート版と同じ構成、最後は夜の海へ)
    car(62.81, "green", [0.62, 0.30, 1.35], [0.55, 0.45, 1.06], "flash"),
    car(66.28, "red", [0.60, 0.42, 1.08], [0.66, 0.36, 1.25], "whip"),
    car(69.76, "purple", [0.55, 0.40, 1.35], [0.62, 0.30, 1.15], "zoom"),
    car(74.54, "green", [0.78, 0.33, 2.2], [0.70, 0.33, 1.95], "glitch", light_amt=1.1, flow=1300),
    car(76.72, "purple", [0.80, 0.28, 1.9], [0.62, 0.28, 1.7], "whip", light_amt=1.1, flow=1500),
    car(80.63, "red", [0.70, 0.33, 1.9], [0.68, 0.32, 1.6], "flash"),
    beach(83.5, "couple", [0.5, 0.25, 1.6], [0.5, 0.52, 1.1], "whiteout", "night", trans_in_dur=0.8),
    beach(87.6, "girl", [0.45, 0.35, 1.35], [0.5, 0.5, 1.05], "zoom", "night"),
    # 間奏 → Verse 2 (夜の海)
    beach(92.6, "girl", [0.5, 0.82, 1.9], [0.5, 0.78, 1.6], "whip", "night"),
    beach(98.6, "couple", [0.5, 0.55, 1.4], [0.5, 0.48, 1.2], "zoom", "night"),
    beach(104.6, "girl", [0.5, 0.86, 1.9], [0.5, 0.82, 1.6], "whip", "night"),
    beach(108.6, "girl", [0.5, 0.72, 1.3], [0.5, 0.62, 1.1], "zoom", "night"),
    beach(111.6, "couple", [0.62, 0.36, 1.7], [0.6, 0.4, 1.5], "flash", "night"),
    beach(118.3, "girl", [0.45, 0.28, 1.6], [0.45, 0.3, 1.4], "zoom", "night"),
    # Pre-Chorus 2 (車に戻る)
    car(126.4, "red", [0.68, 0.32, 1.7], [0.66, 0.34, 1.4], "whip"),
    car(133.0, "purple", [0.62, 0.30, 1.5], [0.6, 0.34, 1.3], "zoom"),
    # Chorus 2 (夜明け前)
    beach(141.6, "couple", [0.5, 0.30, 1.5], [0.5, 0.45, 1.2], "flash", "predawn"),
    beach(144.9, "girl", [0.45, 0.28, 1.6], [0.47, 0.32, 1.4], "whip", "predawn"),
    car(147.9, "green", [0.6, 0.32, 1.4], [0.56, 0.4, 1.15], "zoom", grade=PREDAWN),
    beach(152.5, "couple", [0.5, 0.2, 1.7], [0.5, 0.3, 1.45], "glitch", "predawn"),
    beach(155.4, "couple", [0.5, 0.33, 1.8], [0.5, 0.38, 1.4], "flash", "predawn", sun_amt=0.3),
    beach(158.9, "girl", [0.45, 0.24, 2.0], [0.45, 0.25, 1.75], "zoom", "predawn", sun_amt=0.25),
    car(162.1, "purple", [0.75, 0.3, 1.7], [0.62, 0.3, 1.5], "whip", grade=PREDAWN),
    beach(166.3, "couple", [0.5, 0.5, 1.15], [0.5, 0.5, 1.02], "zoom", "predawn", sun_amt=0.3),
    # Bridge (車・エンジン)
    car(170.3, "green", [0.6, 0.3, 1.5], [0.58, 0.36, 1.25], "flash"),
    car(177.0, "purple", [0.58, 0.36, 1.4], [0.62, 0.3, 1.2], "whip"),
    car(184.1, "red", [0.62, 0.42, 1.15], [0.66, 0.36, 1.3], "zoom"),
    car(187.8, "red", [0.78, 0.40, 1.9], [0.74, 0.40, 1.7], "glitch"),
    car(190.6, "green", [0.62, 0.28, 1.7], [0.6, 0.3, 1.45], "whip"),
    beach(194.5, "girl", [0.45, 0.3, 1.5], [0.45, 0.32, 1.3], "flash", "predawn", sun_amt=0.3),
    # Final Chorus (朝焼け)
    beach(197.9, "couple", [0.5, 0.25, 1.6], [0.5, 0.5, 1.08], "whiteout", trans_in_dur=1.2),
    car(202.3, "green", [0.78, 0.36, 2.0], [0.72, 0.36, 1.75], "whip", grade=WARM),
    beach(205.4, "couple", [0.5, 0.33, 1.9], [0.5, 0.36, 1.5], "flash"),
    beach(209.8, "girl", [0.45, 0.35, 1.4], [0.48, 0.42, 1.15], "zoom"),
    car(212.2, "purple", [0.8, 0.3, 1.8], [0.64, 0.3, 1.6], "whip", grade=WARM),
    car(216.2, "red", [0.66, 0.36, 1.4], [0.62, 0.4, 1.15], "zoom", grade=WARM),
    beach(219.2, "couple", [0.5, 0.45, 1.3], [0.5, 0.5, 1.02], "whiteout", trans_in_dur=0.6),
    beach(223.4, "girl", [0.45, 0.4, 1.3], [0.5, 0.5, 1.0], "zoom"),
    # Outro
    car(229.6, "green", [0.72, 0.35, 1.8], [0.62, 0.36, 1.3], "whiteout", grade=WARM, trans_in_dur=0.8),
    beach(233.1, "girl", [0.45, 0.35, 1.35], [0.5, 0.5, 1.0], "zoom"),
]

lines = json.load(open('lyrics_timed.json', encoding='utf-8'))
starts = [s["start"] for s in shots]
meta = []
for i, ln in enumerate(lines):
    st = ln["chars"][0]
    shot = shots[max(k for k, x in enumerate(starts) if x <= st)]
    if ln["text"].startswith("午前四時"):
        lay = "title"
    elif shot["kind"] == "beach":
        lay = "high" if i % 2 == 0 else "vleft"
    else:
        lay = "low" if i % 2 == 0 else "vleft"
    meta.append({"layout": lay, "en": EN[i]})
meta[-1]["hold"] = 2.5

cfg = {
    "title": "午前四時の逃避行", "artist": "Heppoko39",
    "audio": "song.mp3", "lyrics_timed": "lyrics_timed.json", "beats": "beats.json", "fonts": "fonts",
    "duration": round(L, 3), "lyric_offset_beats": -1,
    "images": {"couple": "img/img1.jpg", "girl": "img/img2.jpg", "green": "img/img3.jpg",
               "purple": "img/img4.jpg", "red": "img/img5.jpg"},
    "marks": {"dawn": 197.9, "end_card": 239.5, "open_card": [1.0, 7.8]},
    "clock": [[0, 0], [63, 10], [98, 20], [141, 32], [198, 46], [230, 55], [247, 59]],
    "lines": meta, "shots": shots,
}
json.dump(cfg, open('full.json', 'w'), ensure_ascii=False, indent=1)
print('shots', len(shots), 'lines', len(meta))
