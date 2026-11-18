#!/bin/bash
# 1本ぶんを作る: ./build.sh a  → out/memory_storage_a.mp4
set -e
cd "$(dirname "$0")"
v=$1
node render.js "$v" "out/$v.mp4" 30
python3 audio.py "out/$v.meta.json" "out/$v.wav"
ffmpeg -v error -y -i "out/$v.mp4" -i "out/$v.wav" -c:v copy -c:a aac -b:a 192k -shortest "out/memory_storage_$v.mp4"
echo "OK out/memory_storage_$v.mp4"
