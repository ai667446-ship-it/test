#!/bin/bash
# 1本ぶんを作る: ./build.sh b  → out/memory_storage_b.mp4
# コマ書き出しは途中で止まっても、もう一度実行すれば続きから再開する。
set -e
cd "$(dirname "$0")"
v=$1
until node render_frames.js "$v" "out/frames_$v" 30 240 | tee /dev/stderr | awk -F/ '$1==$2{ok=1} END{exit !ok}'; do :; done
python3 audio.py "out/frames_$v/meta.json" "out/$v.wav"
ffmpeg -v error -y -framerate 30 -i "out/frames_$v/f%05d.jpg" -i "out/$v.wav" -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  -c:a aac -b:a 192k -shortest -movflags +faststart "out/memory_storage_$v.mp4"
echo "OK out/memory_storage_$v.mp4（台本を変えたら out/frames_$v を消してから実行）"
