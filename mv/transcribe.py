#!/usr/bin/env python3
"""Whisper (faster-whisper) で歌声を文字起こしし、単語ごとのタイムスタンプを保存する。

使い方:
    pip install faster-whisper
    python3 transcribe.py song.m4a whisper.json [ヒントにする歌詞の一部]

出力は align_lyrics.py で正式な歌詞に合わせて使う。
"""

import json
import subprocess
import sys

import numpy as np
from faster_whisper import WhisperModel


def main():
    src, dst = sys.argv[1], sys.argv[2]
    prompt = sys.argv[3] if len(sys.argv) > 3 else None
    model = WhisperModel("turbo", device="cpu", compute_type="int8")
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", "16000",
                          "-f", "f32le", "-"], check=True, capture_output=True).stdout
    audio = np.frombuffer(raw, np.float32)
    segs, _ = model.transcribe(audio, language="ja", word_timestamps=True, vad_filter=False,
                               beam_size=5, condition_on_previous_text=False,
                               initial_prompt=prompt)
    out = []
    for s in segs:
        out.append({"start": s.start, "end": s.end, "text": s.text,
                    "words": [{"s": w.start, "e": w.end, "w": w.word, "p": w.probability}
                              for w in s.words]})
        print(f"{s.start:7.2f}-{s.end:7.2f} {s.text}", flush=True)
    json.dump(out, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
