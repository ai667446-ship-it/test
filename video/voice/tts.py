"""VOICEVOX で台本を読み上げ、声の長さに合わせたタイムライン（時間の伸び縮み）を作る。
使い方: python3 voice/tts.py <版> <話者ID> [話速]
出力: out/voice_<版>/clip_XX.wav と warp.json"""
import json, sys, os, wave, urllib.request, urllib.parse
sys.path.insert(0, os.path.dirname(__file__))
from narration import NARRATION

API = 'http://127.0.0.1:50021'
v, speaker = sys.argv[1], int(sys.argv[2])
speed = float(sys.argv[3]) if len(sys.argv) > 3 else 1.15
out = f'out/voice_{v}'; os.makedirs(out, exist_ok=True)
meta = json.load(open(f'out/{v}.meta.json'))  # 字幕の元のタイミング（render.js --stills で書き出し）

def post(path, data=None, params=None):
    url = API + path + ('?' + urllib.parse.urlencode(params) if params else '')
    req = urllib.request.Request(url, data=data, method='POST', headers={'Content-Type': 'application/json'})
    return urllib.request.urlopen(req).read()

lines = NARRATION[v]
cues = meta['cues'] + [meta['duration']]
assert len(lines) == len(meta['cues']), f'台本 {len(lines)} 行 / 字幕 {len(meta["cues"])} 枚'
warp, clips, t_new = [], [], 0.0
for i, text in enumerate(lines):
    q = json.loads(post('/audio_query', params={'text': text, 'speaker': speaker}))
    q['speedScale'] = speed; q['prePhonemeLength'] = 0.05; q['postPhonemeLength'] = 0.1
    wav = post('/synthesis', data=json.dumps(q).encode(), params={'speaker': speaker})
    path = f'{out}/clip_{i:02d}.wav'; open(path, 'wb').write(wav)
    with wave.open(path) as w: length = w.getnframes() / w.getframerate()
    o0, o1 = cues[i], cues[i + 1]
    d = max(length + 0.25, 1.0)                   # 声 + 少しの間
    warp.append([round(t_new, 3), round(t_new + d, 3), o0, o1])
    clips.append({'path': path, 'start': round(t_new + 0.05, 3), 'len': round(length, 3)})
    print(f'{i:2d} {o1 - o0:4.1f}s → {d:4.2f}s  {text}')
    t_new += d
json.dump({'speaker': speaker, 'duration': round(t_new, 3), 'warp': warp, 'clips': clips}, open(f'{out}/warp.json', 'w'), ensure_ascii=False, indent=1)
print('合計', round(t_new, 2), '秒')
