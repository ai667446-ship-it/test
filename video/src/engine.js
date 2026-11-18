// クレヨン風アニメの描画エンジン（共通部品）
// renderAt(t) で時刻 t 秒のフレームを SVG として描く。完全に決定的（同じ t なら同じ絵）。

const W = 1080, H = 1920;
const INK = '#3a2e28';
const C = {
  paper: '#f4ecdc', wood: '#d39a5f', woodDark: '#a8723f',
  red: '#e8664f', yellow: '#f6c945', blue: '#5fa8d8', green: '#7cc26b',
  purple: '#a487c9', pink: '#f2a3b3', orange: '#f29a4a', gray: '#9a9a9a',
  skin: '#f7d4b2', white: '#fffdf7',
};

// ---------- 数学・イージング ----------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeBack = (x) => { const c1 = 1.7, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const lerp = (a, b, x) => a + (b - a) * x;
// 出現（ポンと弾む）スケール
const pop = (t, start, dur = 0.45) => easeBack(prog(t, start, start + dur));
// 決定的な疑似乱数
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- SVG ヘルパ ----------
const g = (tr, body, extra = '') => `<g transform="${tr}" ${extra}>${body}</g>`;
const at = (x, y, s = 1, r = 0) => `translate(${x} ${y}) rotate(${r}) scale(${s})`;
const rect = (x, y, w, h, fill, rx = 10, sw = 6) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`;
const circle = (x, y, r, fill, sw = 6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="${sw}"/>`;
const path = (d, fill = 'none', sw = 6) =>
  `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
const text = (x, y, s, str, fill = INK, size = 44, anchor = 'middle', weight = 400) =>
  `<text x="${x}" y="${y}" font-family="Yusei Magic" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" dominant-baseline="middle">${str}</text>`;
const hand = (x, y, str, size = 56, fill = INK, anchor = 'middle') => text(x, y, 1, str, fill, size, anchor);
// 塗りが紙からはみ出したようなクレヨンのラベル（下地マーカー）
const marker = (x, y, w, h, color) =>
  `<path d="M${x - w / 2} ${y - h / 2 + 4} Q${x} ${y - h / 2 - 6} ${x + w / 2} ${y - h / 2 + 2} L${x + w / 2 - 6} ${y + h / 2} Q${x} ${y + h / 2 + 8} ${x - w / 2 + 4} ${y + h / 2 - 2} Z" fill="${color}" opacity="0.85"/>`;

// ---------- 小物 ----------
function appWindow(x, y, w, h, color, label, icon = '') {
  return rect(x, y, w, h, C.white, 14) +
    `<path d="M${x + 3} ${y + 14} Q${x + 3} ${y + 3} ${x + 14} ${y + 3} L${x + w - 14} ${y + 3} Q${x + w - 3} ${y + 3} ${x + w - 3} ${y + 14} L${x + w - 3} ${y + 40} L${x + 3} ${y + 40} Z" fill="${color}"/>` +
    path(`M${x} ${y + 42} L${x + w} ${y + 42}`, 'none', 5) +
    hand(x + w / 2, y + 42 + (h - 42) / 2, label, Math.min(44, w / (label.length + 0.6))) +
    (icon ? hand(x + w - 26, y + 22, icon, 26) : '');
}

function desk(x, y, w, legH = 150) {
  // x,y = 天板の左上
  return rect(x + 30, y + 30, 26, legH, C.woodDark, 6) +
    rect(x + w - 56, y + 30, 26, legH, C.woodDark, 6) +
    rect(x, y, w, 44, C.wood, 10) +
    path(`M${x + 20} ${y + 16} L${x + w * 0.4} ${y + 16}`, 'none', 3);
}

const BOOK_COLORS = [C.red, C.blue, C.yellow, C.green, C.purple, C.orange, C.pink];
// fill: 0..1 本棚の埋まり具合（本が左から順に入る）
function bookshelf(x, y, w, h, rows, fill, t = 0) {
  let s = rect(x, y, w, h, C.wood, 12);
  const inner = 22, rowH = (h - inner * 2) / rows;
  s += rect(x + inner, y + inner, w - inner * 2, h - inner * 2, '#7a5232', 6, 4);
  let k = 0;
  const perRow = Math.floor((w - inner * 2 - 10) / 48);
  const total = rows * perRow;
  for (let r = 0; r < rows; r++) {
    const by = y + inner + rowH * (r + 1);
    let bx = x + inner + 8;
    for (let i = 0; i < perRow; i++, k++) {
      const appearAt = k / total;
      const p = clamp((fill - appearAt) * total / 2.5);
      if (p <= 0) { bx += 48; continue; }
      const bh = rowH - 18 - rnd(k) * 30;
      const drop = (1 - easeOut(p)) * -60;
      const bw = 38 + rnd(k + 50) * 6;
      s += g(`translate(0 ${drop})`, rect(bx, by - bh, bw, bh, BOOK_COLORS[k % BOOK_COLORS.length], 5, 4) +
        path(`M${bx + 8} ${by - bh + 16} L${bx + bw - 8} ${by - bh + 16}`, 'none', 3), `opacity="${clamp(p * 2)}"`);
      bx += 48;
    }
    if (r < rows - 1) s += path(`M${x + inner} ${by} L${x + w - inner} ${by}`, 'none', 7);
  }
  return s;
}

function laptop(x, y, s, screen = '') {
  return g(at(x, y, s),
    path('M-230 120 L230 120 L270 170 L-270 170 Z', '#c9ccd4') +
    rect(-210, -170, 420, 290, '#5a6070', 22) +
    rect(-185, -148, 370, 245, '#dff1fb', 10, 4) + screen);
}

function powerIcon(x, y, s, on) {
  return g(at(x, y, s),
    circle(0, 0, 90, on ? C.green : '#d9d4c8') +
    path('M-38 -30 A50 50 0 1 0 38 -30', 'none', 12) + path('M0 -58 L0 -5', 'none', 12));
}

// キラキラ
function sparkle(x, y, s, color = C.yellow) {
  return g(at(x, y, s), path('M0 -40 Q6 -6 40 0 Q6 6 0 40 Q-6 6 -40 0 Q-6 -6 0 -40 Z', color, 5));
}
// 汗
function sweat(x, y, s) { return g(at(x, y, s), path('M0 -30 Q22 5 0 22 Q-22 5 0 -30 Z', '#9fd3f2', 5)); }
// 矢印
function arrow(x1, y1, x2, y2, color = INK, sw = 10) {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 34;
  const p1 = [x2 - L * Math.cos(a - 0.5), y2 - L * Math.sin(a - 0.5)];
  const p2 = [x2 - L * Math.cos(a + 0.5), y2 - L * Math.sin(a + 0.5)];
  return `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 70} ${x2} ${y2} M${p1[0]} ${p1[1]} L${x2} ${y2} L${p2[0]} ${p2[1]}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// もくもく（消える演出）
function poof(x, y, p) {
  if (p <= 0 || p >= 1) return '';
  let s = '';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2, d = 20 + p * 70;
    s += circle(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7, 26 * (1 - p) + 6, '#ffffff', 4);
  }
  return `<g opacity="${1 - p}">${s}</g>`;
}

// ---------- キャラクター（B版） ----------
// talk: 話している最中か / t: 時刻
function mouth(talking, t, w = 26) {
  const open = talking && Math.floor(t * 9) % 2 === 0;
  return open
    ? `<ellipse cx="0" cy="38" rx="${w * 0.55}" ry="14" fill="#b4483c" stroke="${INK}" stroke-width="5"/>`
    : path(`M${-w / 2} 34 Q0 ${50} ${w / 2} 34`, 'none', 5);
}
function eyes(t, seed, dx = 34) {
  const blink = ((t + seed) % 3.7) < 0.12;
  return blink
    ? path(`M${-dx - 10} 0 L${-dx + 10} 0 M${dx - 10} 0 L${dx + 10} 0`, 'none', 5)
    : `<circle cx="${-dx}" cy="0" r="8" fill="${INK}"/><circle cx="${dx}" cy="0" r="8" fill="${INK}"/>`;
}
function grandma(x, y, s, talking, t, mood = 'normal') {
  const bob = talking ? Math.sin(t * 10) * 4 : Math.sin(t * 2) * 3;
  const body =
    path('M-120 260 Q-120 120 0 110 Q120 120 120 260 Z', C.purple) +                     // カーディガン
    path('M0 120 L0 255', 'none', 4) +
    circle(-30, 170, 7, C.white, 3) + circle(-30, 215, 7, C.white, 3);
  const head = g(`translate(0 ${bob})`,
    circle(0, -125, 42, '#cfcfd6') +                                                       // お団子
    circle(0, -20, 95, C.skin) +
    path('M-95 -30 Q-90 -110 0 -112 Q90 -110 95 -30 Q60 -80 0 -80 Q-60 -80 -95 -30 Z', '#d8d8de') + // 白髪
    g('translate(0 -6)', eyes(t, 0.4)) +
    `<circle cx="-34" cy="-6" r="24" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="34" cy="-6" r="24" fill="none" stroke="${INK}" stroke-width="5"/>` +
    path('M-10 -6 L10 -6', 'none', 5) +
    `<ellipse cx="-58" cy="28" rx="16" ry="9" fill="${C.pink}" opacity="0.8"/><ellipse cx="58" cy="28" rx="16" ry="9" fill="${C.pink}" opacity="0.8"/>` +
    (mood === 'q' ? hand(115, -110, '？', 80, C.red) : '') +
    (mood === 'happy' ? sparkle(120, -100, 0.6) : '') +
    g('translate(0 6)', mouth(talking, t, 24)));
  return g(at(x, y, s), body + head);
}
function boy(x, y, s, talking, t, mood = 'normal') {
  const bob = talking ? Math.sin(t * 10 + 1) * 4 : Math.sin(t * 2 + 1) * 3;
  const body =
    path('M-115 260 Q-115 120 0 110 Q115 120 115 260 Z', C.blue) +                       // パーカー
    path('M-40 120 Q0 160 40 120', 'none', 5) + path('M-20 150 L-24 200 M20 150 L24 200', 'none', 4);
  const head = g(`translate(0 ${bob})`,
    circle(0, -20, 92, C.skin) +
    path('M-96 -20 Q-100 -118 0 -118 Q100 -118 96 -20 Q80 -70 40 -64 Q10 -90 -20 -66 Q-60 -80 -96 -20 Z', '#4a3a30') + // 髪
    g('translate(0 -4)', eyes(t, 1.9, 32)) +
    `<ellipse cx="-56" cy="26" rx="15" ry="8" fill="${C.pink}" opacity="0.8"/><ellipse cx="56" cy="26" rx="15" ry="8" fill="${C.pink}" opacity="0.8"/>` +
    (mood === 'point' ? '' : '') +
    g('translate(0 4)', mouth(talking, t, 28)));
  // 指さし腕
  const arm = mood === 'point'
    ? `<path d="M70 150 Q130 95 150 35" fill="none" stroke="${INK}" stroke-width="44" stroke-linecap="round"/><path d="M70 150 Q130 95 150 35" fill="none" stroke="${C.blue}" stroke-width="32" stroke-linecap="round"/>` + circle(154, 22, 20, C.skin, 5)
    : '';
  return g(at(x, y, s), body + arm + head);
}

// ---------- 字幕 ----------
// "普通の{y:黄色}{r:赤}{c:水色}" 記法。\n で改行。
const HL = { y: '#ffd43b', r: '#ff6b5a', c: '#5fe0e6', g: '#8be36a', p: '#ffa8c5' };
function captionSVG(str, cx, cy, size, t0, t, opts = {}) {
  const lines = str.split('\n');
  // 一番長い行が幅 1000px に収まるよう自動縮小
  const em = (line) => { let w = 0; line.replace(/\{(\w):([^}]*)\}|([^{]+)/g, (m, k, hl, pl) => { const f = (x) => [...x].reduce((a, ch) => a + (ch.charCodeAt(0) < 256 ? 0.6 : 1), 0); w += hl ? f(hl) * 1.22 : f(pl); return ''; }); return w; };
  size = Math.min(size, 1000 / Math.max(...lines.map(em)) / 1.05);
  const lh = size * 1.32;
  const sc = 0.86 + 0.14 * easeBack(prog(t, t0, t0 + 0.28));
  let out = '';
  lines.forEach((line, i) => {
    const y = (i - (lines.length - 1) / 2) * lh;
    let spans = '';
    line.replace(/\{(\w):([^}]*)\}|([^{]+)/g, (m, k, hl, plain) => {
      if (plain) spans += `<tspan fill="${opts.color || '#ffffff'}">${plain}</tspan>`;
      else spans += `<tspan fill="${HL[k]}" font-size="${size * 1.22}">${hl}</tspan>`;
      return '';
    });
    out += `<text x="0" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" stroke="${opts.stroke || '#2b2420'}" stroke-width="${size * 0.2}" stroke-linejoin="round" paint-order="stroke fill">${spans}</text>`;
  });
  return g(`translate(${cx} ${cy}) scale(${sc})`, out);
}

// ---------- フレーム全体 ----------
function frameSVG(t, illustration, overlay) {
  const seed = Math.floor(t * 8) % 6 + 1; // 線のゆらぎ（1秒に8回）
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="crayon" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="${seed}" result="warp"/>
      <feDisplacementMap in="SourceGraphic" in2="warp" scale="9" xChannelSelector="R" yChannelSelector="G" result="wob"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="7" result="grain"/>
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -0.75" result="grainA"/>
      <feComposite in="wob" in2="grainA" operator="in"/>
    </filter>
    <filter id="paper">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="2"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.3  0 0 0 0.10 0"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  <rect width="${W}" height="${H}" filter="url(#paper)"/>
  <g filter="url(#crayon)">${illustration}</g>
  ${overlay}
</svg>`;
}

// タイムライン共通処理
// scenes: [{from, to, draw(lt, t)}], captions: [{from, to, text, ...}]
function activeAt(list, t) { return list.find((s) => t >= s.from && t < s.to) || list[list.length - 1]; }
// シーン切り替え時のワイプ（紙をめくるように横スライド）
function sceneTransition(scenes, t) {
  const sc = activeAt(scenes, t);
  const lt = t - sc.from;
  const inP = easeOut(prog(lt, 0, 0.35));
  const dx = (1 - inP) * 120;
  return g(`translate(${dx} 0)`, sc.draw(lt, t), `opacity="${inP}"`);
}
