#!/bin/bash
# VOICEVOX エンジンを起動する（Docker）。http://127.0.0.1:50021 で待ち受け。
# ナレーション入り動画の作り方:
#   1) voice/narration.py に台本を書く（字幕1枚 = 1行）
#   2) node render.js <版> out/<版>.mp4 30 --stills 0      # 字幕のタイミング（meta）を書き出す
#   3) python3 voice/tts.py <版> <話者ID> 1.3              # 声とタイミング表（warp.json）を作る
#   4) node render_frames.js <版> out/frames_<版> 30 300 out/voice_<版>/warp.json
#   5) python3 audio.py out/frames_<版>/meta.json out/<版>.wav → ffmpeg で結合
pgrep dockerd >/dev/null || (dockerd >/tmp/dockerd.log 2>&1 &)
for i in $(seq 1 20); do docker info >/dev/null 2>&1 && break; sleep 1; done
docker image inspect voicevox/voicevox_engine:cpu-latest >/dev/null 2>&1 || docker pull voicevox/voicevox_engine:cpu-latest
docker ps --format '{{.Names}}' | grep -q '^vv$' || docker run -d --rm --name vv -p 50021:50021 voicevox/voicevox_engine:cpu-latest
for i in $(seq 1 40); do curl -sf http://127.0.0.1:50021/version >/dev/null && echo "VOICEVOX ready" && exit 0; sleep 3; done
echo "VOICEVOX failed to start"; exit 1
