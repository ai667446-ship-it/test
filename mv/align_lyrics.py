#!/usr/bin/env python3
"""Whisper の単語タイムスタンプを正式な歌詞に合わせ、1文字ごとの時刻を求める。

使い方:
    python3 align_lyrics.py lyrics.txt whisper.json timeline_lyrics.json

lyrics.txt は Suno 形式 ([Verse 1] などのセクション見出し + 歌詞行)。
whisper.json は transcribe.py の出力 (word_timestamps 付き)。
"""

import difflib
import json
import re
import sys
import unicodedata

PUNCT = set("、。，．・！？!?「」『』…　 ,.-—~〜\"'")


def norm(ch):
    """比較用に文字を正規化する (カタカナ→ひらがな、記号は除外)。"""
    if ch in PUNCT:
        return ""
    ch = unicodedata.normalize("NFKC", ch)
    if len(ch) != 1 or ch in PUNCT or ch.isspace():
        return ""
    o = ord(ch)
    if 0x30A1 <= o <= 0x30F6:
        ch = chr(o - 0x60)
    return ch


def parse_lyrics(path):
    lines, section = [], None
    for raw in open(path, encoding="utf-8"):
        raw = raw.strip()
        if not raw:
            continue
        m = re.match(r"^\[(.+)\]$", raw)
        if m:
            section = m.group(1)
            continue
        lines.append({"section": section, "text": raw})
    return lines


def whisper_chars(path):
    """Whisper の単語列を (正規化文字, 時刻) の列に展開する。単語内は時間を等分。"""
    out = []
    for seg in json.load(open(path, encoding="utf-8")):
        for w in seg["words"]:
            chars = [c for c in w["w"] if norm(c)]
            if not chars:
                continue
            step = (w["e"] - w["s"]) / len(chars)
            for i, c in enumerate(chars):
                out.append((norm(c), w["s"] + step * i, w["p"]))
    return out


def align(lines, wchars):
    # 歌詞側の文字列 (正規化済み) と、各文字が属する行・行内位置
    lchars, owner = [], []
    for li, line in enumerate(lines):
        for ci, c in enumerate(line["text"]):
            n = norm(c)
            if n:
                lchars.append(n)
                owner.append((li, ci))
    sm = difflib.SequenceMatcher(None, lchars, [c for c, _, _ in wchars], autojunk=False)
    times = [None] * len(lchars)
    for a, b, size in sm.get_matching_blocks():
        for k in range(size):
            times[a + k] = wchars[b + k][1]
    # 一致しなかった文字は前後の一致から線形補間 (端は外挿しない)
    known = [i for i, t in enumerate(times) if t is not None]
    for i in range(len(times)):
        if times[i] is not None:
            continue
        prev = max((k for k in known if k < i), default=None)
        nxt = min((k for k in known if k > i), default=None)
        if prev is not None and nxt is not None:
            times[i] = times[prev] + (times[nxt] - times[prev]) * (i - prev) / (nxt - prev)
        elif prev is not None:
            times[i] = times[prev] + 0.15 * (i - prev)
        else:
            times[i] = times[nxt] - 0.15 * (nxt - i)
    # 時刻が逆行しないように
    for i in range(1, len(times)):
        times[i] = max(times[i], times[i - 1])
    matched = [0] * len(lines)
    for a, b, size in sm.get_matching_blocks():
        for k in range(size):
            matched[owner[a + k][0]] += 1
    result = []
    for li, line in enumerate(lines):
        ct = [None] * len(line["text"])
        for (l2, ci), t in zip(owner, times):
            if l2 == li:
                ct[ci] = t
        # 記号には直前の文字の時刻を割り当てる
        last = next((t for t in ct if t is not None), 0.0)
        for i, t in enumerate(ct):
            if t is None:
                ct[i] = last
            last = ct[i]
        n = sum(1 for c in line["text"] if norm(c))
        result.append({**line, "chars": [round(t, 3) for t in ct],
                       "start": round(min(ct), 3), "match": round(matched[li] / max(1, n), 2)})
    return result


def main():
    lines = parse_lyrics(sys.argv[1])
    res = align(lines, whisper_chars(sys.argv[2]))
    json.dump(res, open(sys.argv[3], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for r in res:
        print(f"{r['start']:7.2f} {r['match']:.2f} [{r['section']}] {r['text']}")


if __name__ == "__main__":
    main()
