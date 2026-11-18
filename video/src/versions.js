// A版（ナレーション字幕）と B版（おばあちゃん×孫の掛け合い）の台本とタイミング

const seq = (list) => list.map(([from, to, scene]) => ({ from, to, draw: SCENES[scene], name: scene }));

const VERSIONS = {
  a: {
    duration: 47,
    scenes: seq([
      [0, 4.5, 'hook'], [4.5, 9.5, 'compare'], [9.5, 17, 'desk'], [17, 24, 'shelf'],
      [24, 31.5, 'small'], [31.5, 37.5, 'power'], [37.5, 44, 'summary'], [44, 47, 'cta'],
    ]),
    captions: [
      [0.0, 2.2, 'パソコンを買うとき\nよく見るこの2つ'],
      [2.2, 4.5, '{y:メモリ}と{c:ストレージ}\nなにが違うの？'],
      [4.5, 6.8, 'ひとことで言うと…'],
      [6.8, 9.5, '{y:メモリ}は{y:作業机}\n{c:ストレージ}は{c:本棚}'],
      [9.5, 12.8, '{y:メモリ}は\n今つかう物を広げる{y:机}'],
      [12.8, 17.0, '机が広いほど\nアプリを{y:同時に}たくさん開ける'],
      [17.0, 20.5, '{c:ストレージ}は\n物をしまっておく{c:本棚}'],
      [20.5, 24.0, '写真もアプリも動画も\n{c:ぜんぶここに保存}'],
      [24.0, 27.5, 'でも机が{r:せまい}と…'],
      [27.5, 31.5, '本棚との出し入れが増えて\n{r:動きが遅くなる}'],
      [31.5, 34.3, '電源を切ると？'],
      [34.3, 37.5, '机の上は{r:片づく（消える）}\n本棚は{c:そのまま}'],
      [37.5, 41.0, '{y:メモリ}＝作業の{y:サクサク}さ\n{c:ストレージ}＝保存できる{c:量}'],
      [41.0, 44.0, 'これで店員さんの話も\n{g:こわくない！}'],
    ],
    stage: { tx: 0, ty: 150, s: 1 },
    capY: 1420,
  },

  b: {
    duration: 50,
    scenes: seq([
      [0, 5.6, 'hook'], [5.6, 11, 'compare'], [11, 19.5, 'desk'], [19.5, 26, 'shelf'],
      [26, 33, 'small'], [33, 40, 'power'], [40, 46.5, 'summary'], [46.5, 50, 'cta'],
    ]),
    // [from, to, text, speaker('g'|'b'), mood]
    captions: [
      [0.0, 3.2, '店員さんに「メモリは？」って\n聞かれたんだけど…', 'g', 'q'],
      [3.2, 5.6, '{y:メモリ}と{c:ストレージ}って\nなにが違うんだい？', 'g', 'q'],
      [5.6, 8.0, '{y:机}と{c:本棚}で考えると\nカンタンだよ', 'b'],
      [8.0, 11.0, '{y:メモリ}は{y:作業机}\n{c:ストレージ}は{c:本棚}', 'b', 'point'],
      [11.0, 14.5, 'メモリは今つかってる物を\n広げておく{y:机}', 'b', 'point'],
      [14.5, 17.5, '机が広いと いろいろ\n{y:同時に}できるのかい？', 'g'],
      [17.5, 19.5, '{g:そのとおり！}', 'b'],
      [19.5, 22.5, 'じゃあ{c:ストレージ}は？', 'g'],
      [22.5, 26.0, '写真やアプリを\nしまっておく{c:本棚}だよ', 'b', 'point'],
      [26.0, 29.0, '机が{r:せまい}と\nどうなるの？', 'g', 'q'],
      [29.0, 33.0, '本棚と行ったり来たりで\n{r:遅くなっちゃう}', 'b'],
      [33.0, 36.0, '電源を切ったら？', 'g', 'q'],
      [36.0, 40.0, '机の上は{r:片づく（消える）}けど\n本棚は{c:そのまま}', 'b', 'point'],
      [40.0, 44.0, '机は{y:広さ}、本棚は{c:大きさ}\nってことだね', 'g', 'happy'],
      [44.0, 46.5, '{g:ばっちり！}', 'b'],
    ],
    stage: { tx: 97, ty: 70, s: 0.82 },
    capY: 1555,
  },
};

// 指定時刻に「いいね＆保存」の場面を差し込み、以降を後ろへずらす
function insertBeat(V, at0, dur, caption) {
  V.duration += dur;
  V.scenes.forEach((sc) => { if (sc.from >= at0) sc.from += dur; if (sc.to >= at0) sc.to += dur; });
  const prev = V.scenes.find((sc) => sc.to === at0 + dur);
  if (prev) prev.to = at0;
  V.scenes.push({ from: at0, to: at0 + dur, draw: SCENES.save, name: 'save' });
  V.scenes.sort((a, b) => a.from - b.from);
  V.captions.forEach((c) => { if (c[0] >= at0) { c[0] += dur; c[1] += dur; } });
  V.captions.push([at0, at0 + dur, ...caption]);
  V.captions.sort((a, b) => a[0] - b[0]);
}
// 直前のシーンを延長して字幕を足す（RAM / ROM の補足用）
function extendBeat(V, at0, dur, caps) {
  V.duration += dur;
  V.scenes.forEach((sc) => { if (sc.from >= at0) sc.from += dur; if (sc.to >= at0) sc.to += dur; });
  V.captions.forEach((c) => { if (c[0] >= at0) { c[0] += dur; c[1] += dur; } });
  let tt = at0;
  caps.forEach(([d, ...rest]) => { V.captions.push([tt, tt + d, ...rest]); tt += d; });
  V.captions.sort((a, b) => a[0] - b[0]);
}
extendBeat(VERSIONS.a, 9.5, 3.5, [[3.5, 'スペック表では\n{y:RAM}・{c:ROM}と書かれることも']]);
VERSIONS.a.noteAt = 5.0;
extendBeat(VERSIONS.b, 11, 7, [
  [3.0, 'スマホ屋さんで見た\n{y:RAM}と{c:ROM}ってこれかい？', 'g', 'q'],
  [4.0, 'そう！お店ではストレージを\n{c:ROM}って書くことが多いんだ', 'b', 'point'],
]);
VERSIONS.b.noteAt = 5.4;

insertBeat(VERSIONS.a, 13, 3.5, ['あとで見返せるように\n{p:いいね}と{y:保存}を忘れずに！']);
insertBeat(VERSIONS.b, 18, 3.5, ['あとで見返せるように\n{p:いいね}と{y:保存}を忘れずにね！', 'b', 'point']);

let HAND = null;
let NOTE_AT = 99;
const NAMES = { g: ['ばあちゃん', '#a487c9'], b: ['ソラ', '#5fa8d8'] };

function renderAt(v, t) {
  const V = VERSIONS[v];
  HAND = null;
  NOTE_AT = V.noteAt;
  const st = V.stage;
  let ill = g(`translate(${st.tx} ${st.ty}) scale(${st.s})`, sceneTransition(V.scenes, t));
  // 手の素材の位置（舞台座標 → 画面座標）
  if (HAND) HAND = { ...HAND, x: st.tx + HAND.x * st.s, y: st.ty + HAND.y * st.s, s: HAND.s * st.s };
  let overlay = '';
  const cap = V.captions.find((c) => t >= c[0] && t < c[1]);

  if (v === 'b') {
    const sp = cap ? cap[3] : null;
    const mood = cap ? cap[4] : null;
    const enter = easeOut(prog(t, 0, 0.6));
    ill += grandma(230 - (1 - enter) * 300, 1060, 0.9, sp === 'g', t, sp === 'g' ? mood : 'normal');
    ill += boy(850 + (1 - enter) * 300, 1060, 0.9, sp === 'b', t, sp === 'b' ? mood : 'normal');
    // 床の線
    ill += path('M40 1305 Q540 1290 1040 1305', 'none', 5);
    if (cap && cap[3]) {
      const [nm, col] = NAMES[cap[3]];
      const x = cap[3] === 'g' ? 230 : 850;
      overlay += g(`translate(${x} 1400) scale(${pop(t, cap[0], 0.3)})`,
        `<path d="M-18 -50 L0 -78 L18 -50 Z" fill="${col}" stroke="#2b2420" stroke-width="5" stroke-linejoin="round"/>` +
        `<rect x="-110" y="-52" width="220" height="70" rx="35" fill="${col}" stroke="#2b2420" stroke-width="6"/>` +
        `<text x="0" y="-15" text-anchor="middle" dominant-baseline="middle" font-family="Zen Maru Gothic" font-weight="900" font-size="40" fill="#fff">${nm}</text>`);
    }
  }
  if (cap) overlay += captionSVG(cap[2], 540, V.capY, cap[2].includes('\n') ? 70 : 80, cap[0], t);
  // 進行バー（最下部）
  overlay += `<rect x="0" y="${H - 14}" width="${W * (t / V.duration)}" height="14" fill="#e8664f" opacity="0.9"/>`;
  return frameSVG(t, ill, overlay);
}

function allText() {
  const s = new Set();
  for (const k in VERSIONS) VERSIONS[k].captions.forEach((c) => s.add(c[2]));
  return [...s].join('') + 'ばあちゃんソラ';
}
