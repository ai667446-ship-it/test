// No.002 キャッシュ / No.003 Cookie（A版＝ナレーション字幕の形式）

// ---------- 小物 ----------
const cloud = (x, y, s, label = 'ネット') => g(at(x, y, s),
  path('M-150 50 Q-200 50 -185 0 Q-195 -65 -120 -65 Q-100 -130 -25 -118 Q30 -160 85 -108 Q160 -118 160 -45 Q205 -10 170 50 Z', C.white, 7) +
  hand(0, -10, label, 52, '#2f8fb0'));
const doc = (x, y, s, col = C.blue, r = 0, stamp = '') => g(at(x, y, s, r),
  rect(-45, -58, 90, 116, C.white, 8, 5) + rect(-30, -42, 60, 38, col, 6, 4) + path('M-30 14 L30 14 M-30 32 L18 32', 'none', 4) +
  (stamp ? g('translate(22 34) rotate(-12)', rect(-34, -18, 68, 36, '#ffe1dc', 8, 4) + hand(0, 2, stamp, 26, C.red)) : ''));
const phoneBig = (x, y, s, screen = '') => g(at(x, y, s),
  rect(-130, -240, 260, 480, '#5a6070', 38) + rect(-108, -205, 216, 395, C.white, 14, 4) + rect(-30, -228, 60, 12, '#3a3f4b', 6, 0) + screen);
const spinner = (x, y, t) => g(`translate(${x} ${y}) rotate(${(t * 360) % 360})`,
  [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${Math.cos(i / 8 * 6.283) * 36}" cy="${Math.sin(i / 8 * 6.283) * 36}" r="${4 + i * 1.2}" fill="${INK}" opacity="${0.2 + i * 0.1}"/>`).join(''));
const cacheBox = (x, y, s, n, label = '控え') => {
  let in_ = '';
  for (let i = 0; i < n; i++) in_ += doc(-120 + (i % 5) * 60, -40 - Math.floor(i / 5) * 46 - (i % 2) * 8, 0.62, BOOK_COLORS[i % 7], (rnd(i) - 0.5) * 30);
  return g(at(x, y, s), in_ + path('M-190 -20 L-170 110 L170 110 L190 -20 Z', '#e0b77c', 7) + (label ? rect(-160, 20, 320, 64, C.white, 30, 5) + hand(0, 54, label, 40) : ''));
};
const trash = (x, y, s, open = 0) => g(at(x, y, s),
  path('M-90 -60 L-75 130 L75 130 L90 -60 Z', '#b9c3cc', 7) + path('M-40 -20 L-36 100 M0 -20 L0 100 M40 -20 L36 100', 'none', 5) +
  g(`rotate(${-open * 35} -100 -70)`, rect(-110, -95, 220, 34, '#9aa6b1', 12, 7) + rect(-30, -122, 60, 30, '#9aa6b1', 10, 6)));
const warnSign = (x, y, s) => g(at(x, y, s), path('M0 -70 L75 60 L-75 60 Z', C.yellow, 8) + hand(0, 18, '!', 80));
const check = (x, y, s, col = C.green) => g(at(x, y, s), circle(0, 0, 38, col) + path('M-18 0 L-4 15 L20 -14', 'none', 9));
const cross = (x, y, s) => g(at(x, y, s), circle(0, 0, 38, C.red) + path('M-15 -15 L15 15 M15 -15 L-15 15', 'none', 9));
const shop = (x, y, s, label, col = C.red) => g(at(x, y, s),
  rect(-150, -60, 300, 220, '#f7ead2', 10) + rect(-40, 40, 80, 120, '#a8723f', 6) + rect(-125, -20, 70, 60, '#dff1fb', 6, 5) + rect(55, -20, 70, 60, '#dff1fb', 6, 5) +
  path('M-175 -60 L175 -60 L150 -130 L-150 -130 Z', C.white, 7) +
  [0, 1, 2, 3, 4].map((i) => `<path d="M${-150 + i * 60} -130 L${-120 + i * 60} -130 L${-115 + i * 70 - 5} -60 L${-175 + i * 70} -60 Z" fill="${col}"/>`).join('') +
  path('M-175 -60 L175 -60 L150 -130 L-150 -130 Z', 'none', 7) +
  rect(-80, -190, 160, 56, C.white, 12, 5) + hand(0, -160, label, 38));
const card = (x, y, s, r = 0, col = C.orange, label = '会員カード', spy = false) => g(at(x, y, s, r),
  rect(-110, -70, 220, 140, C.white, 16, 6) + rect(-110, -70, 220, 42, col, 12, 6) + hand(0, -48, label, 30, C.white) +
  path('M-80 10 L40 10 M-80 38 L10 38', 'none', 5) + circle(70, 25, 20, C.yellow, 4) +
  (spy ? path('M-70 -2 L70 -2', 'none', 6) + `<ellipse cx="-38" cy="6" rx="34" ry="18" fill="${INK}"/><ellipse cx="38" cy="6" rx="34" ry="18" fill="${INK}"/>` : ''));
const bubble = (x, y, s, str, w = 380) => g(at(x, y, s),
  rect(-w / 2, -55, w, 110, C.white, 50, 6) + path('M-20 52 L-40 95 L20 52', C.white, 6) + rect(-w / 2 + 4, 30, w - 8, 18, C.white, 0, 0) + hand(0, 2, str, 46));
const browserWin = (x, y, w, h) =>
  rect(x, y, w, h, C.white, 24) + `<path d="M${x + 3} ${y + 24} Q${x + 3} ${y + 3} ${x + 24} ${y + 3} L${x + w - 24} ${y + 3} Q${x + w - 3} ${y + 3} ${x + w - 3} ${y + 24} L${x + w - 3} ${y + 70} L${x + 3} ${y + 70} Z" fill="#e6e9ee"/>` +
  path(`M${x} ${y + 72} L${x + w} ${y + 72}`, 'none', 5) + circle(x + 40, y + 36, 11, C.red, 4) + circle(x + 74, y + 36, 11, C.yellow, 4) + circle(x + 108, y + 36, 11, C.green, 4) +
  rect(x + 140, y + 18, w - 180, 38, C.white, 19, 4);
const toggle = (x, y, on, locked = false) => g(`translate(${x} ${y})`,
  rect(-55, -30, 110, 60, on ? C.green : '#cfcac0', 30, 6) + circle(on ? 25 : -25, 0, 22, C.white, 5) + (locked ? g('translate(-100 4)', rect(-18, -6, 36, 30, C.yellow, 5, 4) + path('M-10 -6 L-10 -16 Q0 -30 10 -16 L10 -6', 'none', 4)) : ''));

// まとめページ（図鑑の1ページ）
function summaryPage(lt, no, title, rows, note) {
  const rh = 760 / rows.length;
  let body = rect(-470, -440, 940, 900, C.white, 36) +
    rect(-330, -408, 660, 100, C.blue, 50) + hand(0, -356, `No.${no} ${title}`, 52, C.white);
  rows.forEach(([icon, label, desc, col], i) => {
    const y = -270 + rh * i + rh / 2 - 30;
    body += g(`translate(-330 ${y}) scale(${pop(lt, 0.3 + i * 0.35)})`, icon()) +
      hand(-200, y - 38, label, Math.min(54, 620 / [...label].length), INK, 'start') + hand(-200, y + 40, desc, Math.min(48, 620 / [...desc].length), col, 'start');
    if (i < rows.length - 1) body += path(`M-420 ${y + rh / 2 + 18} L420 ${y + rh / 2 + 18}`, 'none', 3);
  });
  if (note) body += hand(0, 400, note, 40, '#6b5d52');
  return g(`translate(540 500) scale(${pop(lt, 0)})`, body);
}
// 最後のお願いと次回予告
function ctaPage(lt, nextNo, nextTitle) {
  let s = g(`translate(540 330) scale(${pop(lt, 0)}) rotate(-3)`,
    hand(0, -60, 'フォローして', 96, INK) + hand(0, 70, '図鑑を集めよう！', 110, C.red));
  s += g(`translate(540 720) scale(${pop(lt, 0.6)})`,
    rect(-380, -130, 760, 260, C.white, 30) +
    rect(-340, -165, 320, 70, C.blue, 35) + hand(-180, -128, `次回 No.${nextNo}`, 46, C.white) +
    hand(0, 20, nextTitle, Math.min(70, 680 / [...nextTitle].length)));
  return s + sparkle(170, 200, 0.8 * pop(lt, 0.9)) + sparkle(920, 470, 0.6 * pop(lt, 1.1));
}
const qMarks = (lt, t, at0) => [0, 1, 2].map((i) => {
  const y = Math.sin(t * 5 + i) * 10;
  return g(`translate(${[150, 930, 900][i]} ${[230 + y, 180 - y, 600 + y][i]}) scale(${pop(lt, at0 + i * 0.2)}) rotate(${[-15, 12, 20][i]})`, hand(0, 0, '？', 120, [C.red, C.orange, C.purple][i]));
}).join('');

// ---------- No.002 キャッシュ ----------
Object.assign(SCENES, {
  c_hook(lt, t) {
    let s = g(`translate(540 430) scale(${pop(lt, 0)})`, phoneBig(0, 0, 1.15,
      hand(0, -150, '設定', 40, '#6b5d52') + path('M-90 -110 L90 -110', 'none', 3) +
      [0, 1, 2, 3].map((i) => rect(-90, -85 + i * 62, 180, 46, '#f0ede6', 10, 3)).join('')));
    s += g(`translate(540 760) scale(${pop(lt, 0.7)})`,
      rect(-330, -150, 660, 300, C.white, 30) + hand(0, -80, 'キャッシュを', 56) + hand(0, -15, '削除しますか？', 56) +
      rect(-280, 50, 250, 76, '#e6e9ee', 38, 5) + hand(-155, 90, 'キャンセル', 40) +
      rect(30, 50, 250, 76, C.red, 38, 5) + hand(155, 90, '削除', 44, C.white));
    return s + qMarks(lt, t, 2.0);
  },
  c_def(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 640, 100, '#9be3e8') + hand(0, 4, 'キャッシュ ＝ 手元の控え', 64));
    s += g(`scale(${pop(lt, 0.4)})`, '', '') + g(`translate(270 470) scale(${pop(lt, 0.3)})`, cloud(0, 0, 1.25) + doc(0, 150, 1.3, C.blue));
    s += g(`scale(1)`, arrow(420, 560, 640, 560, C.red, 10), `opacity="${clamp(prog(lt, 1.2, 1.5))}"`);
    s += g(`translate(530 470) scale(${pop(lt, 1.3)})`, hand(0, 0, 'コピー', 46, C.red));
    s += g(`translate(800 560) scale(${pop(lt, 1.7)})`, phoneBig(0, 0, 0.9, doc(0, -10, 1.3, C.blue, -4, '控え')));
    return s;
  },
  c_slow(lt, t) {
    let s = cloud(790, 230, 1.15) + phoneBig(260, 560, 1.0,
      lt < 1 ? '' : spinner(0, -10, t * 1.4) + hand(0, 90, '読みこみ中…', 32, '#6b5d52'));
    // 遠いネットからのろのろ運ばれる書類
    const p = ((lt * 0.28) % 1);
    const x = lerp(760, 300, p), y = lerp(330, 470, p) - Math.sin(p * Math.PI) * 140;
    s += doc(x, y, 0.9, C.blue, Math.sin(lt * 3) * 10);
    s += `<path d="M720 340 Q520 180 330 420" fill="none" stroke="${INK}" stroke-width="5" stroke-dasharray="4 22" stroke-linecap="round" opacity="0.5"/>`;
    if (lt > 3.5) {
      const q = pop(lt, 3.5), sh = Math.sin(t * 30) * 5;
      s += g(`translate(${560 + sh} 880) scale(${q}) rotate(-3)`, rect(-210, -64, 420, 128, C.white, 30) + hand(0, 4, 'おそい…', 72, C.red));
      s += sweat(400, 330, q) + sweat(130, 360, 0.8 * q);
    }
    return s;
  },
  c_copy(lt, t) {
    let s = cloud(800, 200, 1.0);
    const second = lt > 4;
    s += phoneBig(260, 520, 1.0, (lt > 1.4 || second) ? doc(0, -10, 1.25, C.blue) : spinner(0, -10, t * 1.4));
    // 1 回目: ネット → スマホ
    if (lt < 1.4) {
      const p = easeInOut(prog(lt, 0.2, 1.4));
      s += doc(lerp(770, 280, p), lerp(300, 500, p) - Math.sin(p * Math.PI) * 120, 0.9, C.blue);
    }
    // 控えを箱にしまう
    const drop = easeOut(prog(lt, 1.6, 2.4));
    s += cacheBox(700, 790, 1.05, drop >= 1 ? 1 : 0, '控え（キャッシュ）');
    if (drop > 0 && drop < 1) s += doc(lerp(360, 690, drop), lerp(500, 740, drop), 0.62, C.blue, 10);
    if (lt > 1.6 && lt < 3.6) s += g(`translate(560 560) scale(${pop(lt, 1.6)})`, hand(0, 0, 'コピーを保存', 42, '#2f8fb0'));
    // 2 回目: 箱からパッと
    if (second) {
      s += g('', cloud(800, 200, 1.0), 'opacity="0"');
      const z = pop(lt, 4.1, 0.3);
      s += g(`translate(500 640) scale(${z}) rotate(-8)`, path('M0 -90 L25 -30 L90 -40 L40 5 L70 70 L0 30 L-70 70 L-40 5 L-90 -40 L-25 -30 Z', C.yellow, 6) + hand(0, 4, '一瞬!', 40));
      s += arrow(650, 730, 400, 600, C.green, 9);
      s += g(`translate(560 120) scale(${pop(lt, 4.6)})`, rect(-220, -55, 440, 110, C.white, 30) + hand(0, 4, '2回目は速い！', 60, '#2f8f4e'));
    }
    return s;
  },
  c_full(lt, t) {
    const n = Math.floor(lerp(3, 20, easeOut(prog(lt, 0.2, 2.6))));
    let s = cacheBox(330, 760, 1.2, n, '控え（キャッシュ）');
    // 容量メーター
    const fill = lerp(0.35, 0.93, easeOut(prog(lt, 0.2, 2.6)));
    s += g('translate(540 120)', rect(-330, -40, 660, 80, C.white, 40) +
      `<rect x="-320" y="-30" width="${640 * fill}" height="60" rx="30" fill="${fill > 0.8 ? C.red : C.green}"/>` +
      rect(-330, -40, 660, 80, 'none', 40) + hand(-410, 2, '容量', 46));
    if (fill > 0.85) s += g(`translate(760 220) scale(${pop(lt, 2.2)})`, hand(0, 0, 'いっぱい!', 50, C.red));
    // 古い控えで表示が崩れる
    if (lt > 3.5) {
      s += phoneBig(800, 600, 0.95,
        g('rotate(8)', rect(-80, -150, 160, 90, C.blue, 8, 4)) + g('rotate(-14)', path('M-80 0 L80 20 M-80 40 L40 25 M-60 80 L70 110', 'none', 6)) + hand(30, 140, '？', 70, C.red));
      s += g(`translate(560 470) scale(${pop(lt, 3.7)}) rotate(-8)`, doc(0, 0, 0.9, '#bcb2a6', 0, '古い'));
      s += arrow(600, 520, 690, 560, C.red, 7);
    }
    return s;
  },
  c_clear(lt, t) {
    const left = 8 - Math.floor(clamp(prog(lt, 0.4, 2.6)) * 8);
    let s = cacheBox(300, 760, 1.15, left, '控え（キャッシュ）') + trash(820, 760, 1.1, lt > 0.3 && lt < 2.8 ? 1 : 0);
    for (let i = 0; i < 8; i++) {
      const a = 0.4 + i * 0.275, p = prog(lt, a, a + 0.5);
      if (p > 0 && p < 1) s += doc(lerp(300, 820, p), lerp(680, 640, p) - Math.sin(p * Math.PI) * 300, 0.62, BOOK_COLORS[i % 7], p * 360);
    }
    if (lt > 3.5) {
      s += cloud(330, 230, 0.9);
      const p = easeInOut(prog(lt, 3.6, 4.6));
      s += doc(lerp(360, 640, p), lerp(320, 260, p), 0.8, C.blue);
      s += g(`translate(720 230) scale(${pop(lt, 4.5)})`, check(0, 0, 1.2) + hand(150, 4, 'OK', 60, '#2f8f4e'));
      s += g(`translate(540 470) scale(${pop(lt, 3.8)})`, hand(0, 0, 'また取ってくるだけ', 52, '#2f8fb0'));
    }
    return s;
  },
  c_warn(lt, t) {
    let s = g(`translate(540 110) scale(${pop(lt, 0)})`, warnSign(-250, 0, 0.8) + hand(40, 4, 'ここに注意！', 70, C.red));
    s += g(`translate(290 560) scale(${pop(lt, 0.4)})`,
      rect(-220, -260, 440, 520, C.white, 30) + rect(-180, -220, 360, 90, '#e6e9ee', 45, 5) + hand(0, -175, 'キャッシュを削除', 38) +
      check(0, -20, 1.6) + hand(0, 110, '控えが消えるだけ', 40) + hand(0, 175, 'ログインはそのまま', 36, '#2f8f4e'));
    s += g(`translate(790 560) scale(${pop(lt, 1.0)})`,
      rect(-220, -260, 440, 520, '#fff3f0', 30) + rect(-180, -220, 360, 90, C.red, 45, 5) + hand(0, -175, 'データを削除', 40, C.white) +
      cross(0, -20, 1.6) + hand(0, 110, 'ログイン情報も', 40) + hand(0, 175, '設定も消える', 36, C.red));
    s += g(`translate(540 930) scale(${pop(lt, 1.8)})`, hand(0, 0, '※ 名前が似ているので押しまちがいに注意', 38, '#6b5d52'));
    return s;
  },
  c_summary(lt, t) {
    return summaryPage(lt, '002', 'キャッシュ', [
      [() => doc(0, 0, 1.1, C.blue, -6, '控え'), 'キャッシュ＝手元の控え', '2回目からパッと表示', '#2f8fb0'],
      [() => cacheBox(0, 30, 0.42, 10, ''), 'たまると容量を使う', '重いときは削除してOK', '#c4553f'],
      [() => warnSign(0, 0, 0.8), '「データを削除」は別物', 'ログイン情報まで消える', '#c4553f'],
    ]);
  },
  c_cta(lt, t) { return ctaPage(lt, '003', 'Cookieってなに？'); },
});

// ---------- No.003 Cookie ----------
Object.assign(SCENES, {
  k_hook(lt, t) {
    let s = g(`translate(540 470) scale(${pop(lt, 0)}) translate(-540 -470)`, browserWin(110, 120, 860, 760) +
      [0, 1, 2].map((i) => rect(160, 230 + i * 120, 760, 90, '#f0ede6', 12, 3)).join(''));
    const up = easeBack(prog(lt, 0.7, 1.2));
    s += g(`translate(540 ${lerp(1100, 760, up)})`,
      rect(-400, -150, 800, 300, C.white, 28) + hand(0, -80, 'Cookieを許可しますか？', 54) +
      rect(-330, 20, 300, 86, C.blue, 43, 5) + hand(-180, 64, '許可', 48, C.white) +
      rect(30, 20, 300, 86, '#e6e9ee', 43, 5) + hand(180, 64, '拒否', 48), `opacity="${clamp(up * 2)}"`);
    return s;
  },
  k_def(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 640, 100, '#ffc9d8') + hand(0, 4, 'Cookie ＝ 会員カード', 66));
    s += g(`translate(540 540) scale(${pop(lt, 0.4) * 2.3}) rotate(-6)`, card(0, 0, 1, 0, C.orange, '会員カード'));
    s += g(`translate(810 225) scale(${pop(lt, 1.2)}) rotate(8)`, rect(-130, -50, 260, 100, C.white, 24) + hand(0, 4, '小さなメモ', 46));
    s += g(`translate(540 880) scale(${pop(lt, 2.4)})`, hand(0, 0, 'サイトがブラウザに預ける', 50, '#6b5d52'));
    return s;
  },
  k_card(lt, t) {
    let s = shop(270, 560, 1.15, 'サイト') + phoneBig(820, 600, 0.85, hand(0, -150, 'ブラウザ', 34, '#6b5d52'));
    // 1 回目: カードを渡す
    const p1 = easeInOut(prog(lt, 0.6, 1.8));
    if (lt < 3.6) {
      s += card(lerp(330, 820, p1), lerp(500, 620, p1) - Math.sin(p1 * Math.PI) * 160, 0.9, (1 - p1) * -20);
      if (lt < 1.2) s += g(`translate(290 195) scale(${pop(lt, 0.2)})`, bubble(0, 0, 1, 'はじめまして！', 400));
    } else {
      // 2 回目: カードを見せる → おかえりなさい
      const p2 = easeOut(prog(lt, 3.6, 4.3));
      s += card(lerp(820, 600, p2), lerp(620, 520, p2), 0.95, -6);
      s += g(`translate(290 195) scale(${pop(lt, 4.4)})`, bubble(0, 0, 1, 'おかえりなさい！', 440));
      s += sparkle(560, 420, 0.7 * pop(lt, 4.6));
    }
    s += g(`translate(820 960) scale(${pop(lt, lt < 3.6 ? 0.2 : 3.6)})`, rect(-90, -40, 180, 80, C.white, 40, 5) + hand(0, 3, lt < 3.6 ? '1回目' : '2回目', 48, '#2f8fb0'));
    return s;
  },
  k_benefit(lt, t) {
    let s = phoneBig(300, 540, 1.1,
      rect(-85, -170, 170, 60, C.blue, 30, 4) + hand(0, -138, 'ログイン中', 30, C.white) +
      circle(0, -40, 46, C.skin, 5) + path('M-70 70 Q0 10 70 70', C.blue, 5) + hand(0, 130, 'こんにちは！', 30));
    s += g(`translate(300 120) scale(${pop(lt, 0.4)})`, check(-170, 0, 1) + hand(-110, 4, 'ログインしたまま', 50, INK, 'start'));
    if (lt > 3.3) {
      s += g(`translate(790 560) scale(${pop(lt, 3.5)})`,
        path('M-150 -90 L-110 -90 L-70 60 L120 60 L150 -50 L-90 -50', C.white, 9) + circle(-50, 110, 22, C.white, 7) + circle(100, 110, 22, C.white, 7) +
        rect(-60, -110, 70, 60, C.red, 8, 5) + rect(20, -100, 80, 50, C.yellow, 8, 5) + rect(-20, -150, 60, 50, C.green, 8, 5));
      s += g(`translate(760 860) scale(${pop(lt, 3.9)})`, check(-230, 0, 1) + hand(-170, 4, 'カートもそのまま', 50, INK, 'start'));
    }
    return s;
  },
  k_ad(lt, t) {
    const names = ['くつ屋', 'ニュース', '動画'], cols = [C.red, C.green, C.purple];
    let s = '';
    names.forEach((nm, i) => { s += shop(180 + i * 360, 300, 0.72, nm, cols[i]); });
    // サングラスのカードが店から店へ
    const hop = clamp(lt / 3.2) * 2, k = Math.floor(hop), f = hop - k;
    const x = lerp(180 + Math.min(k, 2) * 360, 180 + Math.min(k + 1, 2) * 360, easeInOut(f));
    s += card(x, 470 - Math.sin(f * Math.PI) * 120, 0.8, Math.sin(lt * 4) * 8, '#6b6b6b', '広告用', true);
    if (lt > 3.6) {
      s += phoneBig(540, 760, 0.62,
        rect(-90, 60, 180, 120, '#fff3c4', 10, 4) + path('M-55 140 Q-60 100 -30 100 L10 120 L60 125 Q70 150 40 155 L-55 155 Z', C.red, 4) + hand(0, 80, 'さっき見た くつ', 22));
      s += g(`translate(820 760) scale(${pop(lt, 3.8)})`, rect(-150, -50, 300, 100, C.white, 24) + hand(0, 4, 'また出た…', 48, C.red));
    }
    return s;
  },
  k_choose(lt, t) {
    const off = lt > 1.4;
    let s = g(`translate(540 470) scale(${pop(lt, 0) * 0.94})`,
      rect(-430, -420, 860, 840, C.white, 30) + hand(0, -350, 'Cookieの設定', 60) + path('M-380 -300 L380 -300', 'none', 3) +
      hand(-370, -200, '必須（サイトの動作）', 46, INK, 'start') + toggle(290, -200, true, true) +
      hand(-370, -60, '分析', 46, INK, 'start') + toggle(290, -60, !off) +
      hand(-370, 80, '広告', 46, INK, 'start') + toggle(290, 80, lt < 0.9) +
      rect(-300, 220, 600, 100, C.blue, 50, 6) + hand(0, 272, '選んだものを許可', 46, C.white));
    if (lt > 0.9) s += g(`translate(812 482) scale(${pop(lt, 0.9)}) rotate(-4)`, hand(0, 0, 'オフ！', 46, C.red));
    if (lt > 4.2) s += g(`translate(540 935) scale(${pop(lt, 4.2)})`, check(-300, 0, 0.9) + hand(20, 4, 'サイトはふつうに使える', 46, '#2f8f4e'));
    return s;
  },
  k_summary(lt, t) {
    return summaryPage(lt, '003', 'Cookie', [
      [() => card(0, 0, 0.6, -6), 'Cookie＝会員カード', 'サイトがブラウザに預けるメモ', '#c4553f'],
      [() => check(0, 0, 1.3), 'ログインやカートを覚える', 'だから次も便利', '#2f8f4e'],
      [() => card(0, 0, 0.6, 6, '#6b6b6b', '広告用', true), '広告用は追いかけてくる', '設定で選んでオフにできる', '#2f8fb0'],
    ]);
  },
  k_cta(lt, t) { return ctaPage(lt, '004', 'ギガってなに？'); },
});

// ---------- タイムライン ----------
VERSIONS.c2 = {
  no: '002', narration: true, stage: { tx: 0, ty: 150, s: 1 }, capY: 1420, duration: 54.5,
  scenes: seq([
    [0, 5, 'c_hook'], [5, 9.5, 'c_def'], [9.5, 17, 'c_slow'], [17, 25, 'c_copy'], [25, 32, 'c_full'],
    [32, 40, 'c_clear'], [40, 45, 'c_warn'], [45, 51.5, 'c_summary'], [51.5, 54.5, 'c_cta'],
  ]),
  captions: [
    [0.0, 2.6, '「キャッシュを削除」って\n見たことありませんか？'],
    [2.6, 5.0, '{c:キャッシュ}って\nいったい何？'],
    [5.0, 7.0, 'ひとことで言うと…'],
    [7.0, 9.5, '{c:キャッシュ}は\nよく見るものの{y:控え（コピー）}'],
    [9.5, 13.0, 'サイトの画像や文字を\n毎回ネットから取ってくると…'],
    [13.0, 17.0, '遠くまで取りに行くので\n{r:時間がかかる}'],
    [17.0, 21.0, 'だから一度見たものは\nスマホの中に{c:控え}を保存'],
    [21.0, 25.0, '次からは控えを使うので\n{y:パッと表示}される'],
    [25.0, 28.5, 'でも控えがたまると\n{r:容量を圧迫}することも'],
    [28.5, 32.0, '古い控えのせいで\n表示が{r:おかしくなる}ことも'],
    [32.0, 35.5, 'そんな時は\n{y:キャッシュを削除}'],
    [35.5, 40.0, '消してもただの控え\n{g:また取ってくるだけ}でOK'],
    [40.0, 42.5, 'ただし アプリの\n「{r:データを削除}」は別物！'],
    [42.5, 45.0, 'こちらは{r:ログイン情報まで}\n消えるので注意'],
    [45.0, 48.5, '{c:キャッシュ}＝手元の{y:控え}\nだから{y:速い}'],
    [48.5, 51.5, '重くなったら\n{g:削除してOK}'],
    [51.5, 54.5, '次回は{p:Cookie}！\nフォローして図鑑を集めよう'],
  ],
};
VERSIONS.k3 = {
  no: '003', narration: true, stage: { tx: 0, ty: 150, s: 1 }, capY: 1420, duration: 50.5,
  scenes: seq([
    [0, 5, 'k_hook'], [5, 10, 'k_def'], [10, 18, 'k_card'], [18, 25, 'k_benefit'], [25, 33, 'k_ad'],
    [33, 41, 'k_choose'], [41, 47.5, 'k_summary'], [47.5, 50.5, 'k_cta'],
  ]),
  captions: [
    [0.0, 2.6, 'サイトを開くと出てくる\n「{p:Cookie}を許可しますか？」'],
    [2.6, 5.0, 'これって\n許可して大丈夫？'],
    [5.0, 7.4, '{p:Cookie}は サイトが\nブラウザに預ける{y:小さなメモ}'],
    [7.4, 10.0, 'お店の{y:会員カード}みたいなもの'],
    [10.0, 13.6, 'はじめて来たお客さんに\nお店が{y:カード}をわたす'],
    [13.6, 18.0, '次に来たとき カードを見せれば\n「{y:おかえりなさい！}」'],
    [18.0, 21.3, 'だから{y:ログインしたまま}'],
    [21.3, 25.0, 'カートの中身も\n{y:覚えていてくれる}'],
    [25.0, 29.0, 'ただし 別のサイトまで\n追いかけてくる{r:広告用Cookie}も'],
    [29.0, 33.0, 'さっき見た商品の広告が\n{r:ずっと出てくる}のはこのため'],
    [33.0, 37.0, '多くのサイトでは\n{g:必要なものだけ}許可を選べる'],
    [37.0, 41.0, '広告用をオフにしても\nサイトは{g:ふつうに使える}ことが多い'],
    [41.0, 44.5, '{p:Cookie}＝サイトが預ける\n{y:会員カード}'],
    [44.5, 47.5, '広告用は{g:選んでオフ}にできる'],
    [47.5, 50.5, '次回は{y:ギガ}！\nフォローして図鑑を集めよう'],
  ],
};
insertBeat(VERSIONS.c2, 9.5, 3.5, ['あとで見返せるように\n{p:いいね}と{y:保存}を忘れずに！']);
insertBeat(VERSIONS.k3, 10, 3.5, ['あとで見返せるように\n{p:いいね}と{y:保存}を忘れずに！']);

// ---------- No.003 Cookie 短い版（冒頭につかみ＋目的、約32秒）----------
VERSIONS.k3s = {
  no: '003', narration: true, stage: { tx: 0, ty: 150, s: 1 }, capY: 1420, duration: 32,
  bigFirst: true, sticker: [7.6, 11.8],
  scenes: seq([
    [0, 4, 'k_hook', 1, 1.3], [4, 7, 'k_def', 1.3], [7, 12, 'k_card', 1.25], [12, 16, 'k_benefit', 1.6],
    [16, 21, 'k_ad', 1.4], [21, 26, 'k_choose', 1.3], [26, 29, 'k_summary', 1.2], [29, 32, 'k_cta'],
  ]),
  captions: [
    [0.0, 1.9, '「{p:Cookie}」って\nちゃんと知ってる？'],
    [1.9, 4.0, '30秒で{y:許可していいか}\nわかるようになります'],
    [4.0, 7.0, '{p:Cookie}は\nお店の{y:会員カード}みたいなもの'],
    [7.0, 9.5, 'はじめて来たら\n{y:カード}をもらって'],
    [9.5, 12.0, '次は見せるだけで\n「{y:おかえりなさい！}」'],
    [12.0, 14.0, 'だから{y:ログインしたまま}'],
    [14.0, 16.0, '{y:カートの中身}も残る'],
    [16.0, 18.5, 'でも{r:広告用Cookie}は\n別のサイトまで追いかけてくる'],
    [18.5, 21.0, 'さっき見た商品の広告が\n{r:ずっと出る}のはこのため'],
    [21.0, 23.5, '多くのサイトで\n{g:広告用だけオフ}にできる'],
    [23.5, 26.0, 'オフにしても\nサイトは{g:ふつうに使える}ことが多い'],
    [26.0, 29.0, '迷ったら\n{g:広告用はオフ}でOK'],
    [29.0, 32.0, '{y:保存}して 次に聞かれたとき\n見返してね'],
  ],
};

// ======================================================================
// No.004 ギガ / No.005 Wi-Fiとモバイル通信（ショート形式：冒頭につかみ＋目的）
// ======================================================================
const WATER = '#7cc4ea';
// 水のタンク（level 0..1）
const tank = (x, y, s, level, label = 'ギガ') => g(at(x, y, s),
  `<clipPath id="tk${Math.round(x)}${Math.round(y)}"><rect x="-120" y="-170" width="240" height="320" rx="30"/></clipPath>` +
  `<g clip-path="url(#tk${Math.round(x)}${Math.round(y)})"><rect x="-120" y="${150 - 320 * level}" width="240" height="${320 * level}" fill="${WATER}"/>` +
  `<path d="M-120 ${150 - 320 * level} Q-60 ${140 - 320 * level} 0 ${150 - 320 * level} T120 ${150 - 320 * level}" fill="none" stroke="#fff" stroke-width="6" opacity="0.7"/></g>` +
  rect(-120, -170, 240, 320, 'none', 30, 8) + rect(-70, -205, 140, 40, '#cfd6dd', 10, 6) +
  (label ? rect(-80, -60, 160, 70, C.white, 35, 5) + hand(0, -24, label, 44) : ''));
// 蛇口と水
const faucet = (x, y, s, flow) => g(at(x, y, s),
  path('M-90 -40 L30 -40 Q60 -40 60 -10 L60 20 L30 20 L30 0 L-90 0 Z', '#b9c3cc', 7) + rect(-30, -75, 40, 40, '#9aa6b1', 8, 6) +
  (flow > 0 ? `<rect x="${45 - 8 * flow}" y="22" width="${16 * flow}" height="${170}" rx="${8 * flow}" fill="${WATER}" stroke="${INK}" stroke-width="4"/>` : ''));
const house = (x, y, s, col = C.orange) => g(at(x, y, s),
  rect(-150, -40, 300, 210, '#f7ead2', 10) + path('M-185 -30 L0 -190 L185 -30 Z', col, 8) + rect(-35, 70, 70, 100, '#a8723f', 6) + rect(-115, 10, 70, 60, '#dff1fb', 6, 5) + rect(45, 10, 70, 60, '#dff1fb', 6, 5));
const wifiIcon = (x, y, s, col = INK) => g(at(x, y, s),
  [70, 46, 22].map((r) => `<path d="M${-r} ${-r * 0.3} A${r} ${r} 0 0 1 ${r} ${-r * 0.3}" fill="none" stroke="${col}" stroke-width="11" stroke-linecap="round" transform="translate(0 ${r * 0.55})"/>`).join('') + `<circle cx="0" cy="${22 * 0.55 + 14}" r="9" fill="${col}"/>`);
const barsIcon = (x, y, s, col = INK) => g(at(x, y, s), [0, 1, 2, 3].map((i) => `<rect x="${-50 + i * 28}" y="${30 - i * 22}" width="18" height="${20 + i * 22}" rx="4" fill="${col}"/>`).join(''));
const waves = (x, y, s, t, col = C.blue) => g(at(x, y, s), [0, 1, 2].map((i) => {
  const p = ((t * 0.8 + i / 3) % 1);
  return `<circle cx="0" cy="0" r="${40 + p * 160}" fill="none" stroke="${col}" stroke-width="7" opacity="${1 - p}"/>`;
}).join(''));
const tower = (x, y, s) => g(at(x, y, s),
  path('M-60 160 L0 -150 L60 160 M-40 60 L40 60 M-25 -20 L25 -20 M-50 110 L50 110', 'none', 9) + circle(0, -160, 16, C.red, 5));
const snail = (x, y, s) => g(at(x, y, s),
  path('M-90 40 Q-110 40 -100 20 L60 20 Q90 20 90 40 Z', '#e7c7a0', 6) + circle(-10, -10, 50, '#d9a35f', 6) +
  path('M-10 -10 m-30 0 a30 30 0 1 0 30 -30 a18 18 0 1 0 -18 18', 'none', 5) + path('M70 20 L80 -30 M85 20 L100 -25', 'none', 5));
const bottle = (x, y, s, level) => g(at(x, y, s),
  `<rect x="-55" y="${100 - 190 * level}" width="110" height="${190 * level}" rx="12" fill="${WATER}"/>` +
  rect(-60, -90, 120, 195, 'none', 24, 7) + rect(-30, -130, 60, 42, C.green, 8, 6));
const lockIcon = (x, y, s, open) => g(at(x, y, s),
  rect(-45, -10, 90, 75, open ? '#ffe1dc' : C.yellow, 12, 6) +
  path(open ? 'M-28 -10 L-28 -45 Q-28 -75 0 -75 Q28 -75 28 -45 L28 -55' : 'M-28 -10 L-28 -45 Q-28 -75 0 -75 Q28 -75 28 -45 L28 -10', 'none', 8));

Object.assign(SCENES, {
  // ---------- No.004 ギガ ----------
  g_hook(lt, t) {
    let s = phoneBig(540, 470, 1.35,
      hand(0, -150, '残りデータ', 34, '#6b5d52') + hand(0, -85, '0.3GB', 70, C.red) +
      rect(-85, -30, 170, 36, '#eee', 18, 4) + `<rect x="-82" y="-27" width="${18 + Math.sin(t * 4) * 3}" height="30" rx="15" fill="${C.red}"/>` +
      rect(-90, 40, 180, 60, '#ffe1dc', 30, 4) + hand(0, 72, '速度制限中', 32, C.red) + spinner(0, 150, t));
    return s + sweat(760, 210, 1.2) + sweat(330, 260, 0.9);
  },
  g_def(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 760, 100, C.yellow) + hand(0, 4, 'ギガ ＝ 毎月のデータの量', 60));
    s += g(`translate(540 560) scale(${pop(lt, 0.25) * 1.25})`, tank(0, 0, 1, 0.85 - 0.05 * Math.sin(t * 2)));
    s += g(`translate(830 330) scale(${pop(lt, 0.9)}) rotate(6)`, rect(-120, -45, 240, 90, C.white, 24) + hand(0, 4, '例：20GB', 46));
    return s;
  },
  g_use(lt, t) {
    const level = lerp(0.9, 0.35, easeInOut(prog(lt, 0.5, 4.5)));
    let s = tank(820, 660, 0.95, level);
    const items = [['LINEの文字', 0.15, C.green], ['写真', 0.45, C.yellow], ['動画', 1.0, C.red]];
    items.forEach(([lb, f, col], i) => {
      const on = lt > 0.3 + i * 0.5;
      const x = 150 + i * 200;
      s += g(`translate(0 0) scale(1)`, faucet(x, 560, 1, on ? f * (0.85 + 0.15 * Math.sin(t * 9 + i)) : 0));
      s += g(`translate(${x + 20} 860) scale(${pop(lt, 0.3 + i * 0.5)})`, rect(-95, -40, 190, 80, col, 40, 5) + hand(0, 3, lb, lb.length > 3 ? 32 : 44));
    });
    s += g(`translate(${lt > 2.8 ? 560 : 160} 380) scale(${pop(lt, lt > 2.8 ? 2.8 : 1.2)})`,
      hand(0, 0, lt > 2.8 ? 'ドバドバ！' : 'ちょろっと', 50, lt > 2.8 ? C.red : '#2f8f4e'));
    return s;
  },
  g_empty(lt, t) {
    const level = lerp(0.3, 0, easeOut(prog(lt, 0.2, 1.8)));
    let s = tank(300, 560, 1.05, level);
    if (lt > 1.6) s += g(`translate(300 200) scale(${pop(lt, 1.6)})`, hand(0, 0, 'からっぽ…', 56, C.red));
    if (lt > 2.3) {
      s += g(`translate(${760 + Math.sin(t) * 6} 640) scale(${pop(lt, 2.3) * 1.2})`, snail(0, 0, 1));
      s += g(`translate(760 380) scale(${pop(lt, 2.6)})`, rect(-150, -50, 300, 100, '#ffe1dc', 50, 6) + hand(0, 4, '速度制限', 52, C.red));
      s += g(`translate(760 860) scale(${pop(lt, 2.9)})`, hand(0, 0, '読みこみ…', 46, '#6b5d52'));
    }
    return s;
  },
  g_wifi(lt, t) {
    let s = house(330, 620, 1.3) + waves(330, 470, 1, t, '#2f8fb0') + wifiIcon(330, 440, 0.8, '#2f8fb0');
    s += phoneBig(330, 700, 0.42, hand(0, 0, '動画', 60));
    s += tank(820, 640, 0.9, 0.6);
    if (lt > 2.2) {
      s += g(`translate(820 330) scale(${pop(lt, 2.2)})`, check(-120, 0, 1) + hand(-65, 4, '減らない', 54, '#2f8f4e', 'start'));
      s += arrow(560, 520, 700, 520, C.gray, 7);
      s += g(`translate(630 440) scale(${pop(lt, 2.4)})`, cross(0, 0, 0.7));
    }
    return s;
  },
  g_tips(lt, t) {
    let s = g(`translate(540 470) scale(${pop(lt, 0)})`, rect(-420, -380, 840, 760, C.white, 30) + hand(0, -310, 'ギガの節約', 64) + path('M-370 -260 L370 -260', 'none', 3));
    const rows = [['動画はWi-Fiのときに', C.blue], ['アプリの更新もWi-Fiで', C.blue], ['残りは「設定」で確認', C.orange]];
    rows.forEach(([lb, col], i) => {
      s += g(`translate(540 ${330 + i * 190}) scale(${pop(lt, [0.4, 1.0, 2.3][i])})`,
        check(-330, 0, 1, i < 2 ? C.green : C.yellow) + hand(-270, 4, lb, 50, INK, 'start'));
    });
    s += g(`translate(540 890) scale(${pop(lt, 3.4)})`, hand(0, 0, '※ 携帯会社のアプリでも見られる', 36, '#6b5d52'));
    return s;
  },
  g_summary(lt, t) {
    return summaryPage(lt, '004', 'ギガ', [
      [() => tank(0, 10, 0.32, 0.7, ''), 'ギガ＝毎月のデータの量', '水のタンクのイメージ', '#2f8fb0'],
      [() => faucet(0, -20, 0.7, 1), '動画はたくさん使う', '文字はほんの少し', '#c4553f'],
      [() => wifiIcon(0, 0, 0.8, '#2f8fb0'), 'Wi-Fi中は減らない', '空になると速度制限', '#2f8f4e'],
    ]);
  },
  g_cta(lt, t) { return ctaPage(lt, '005', 'Wi-Fiってなに？'); },

  // ---------- No.005 Wi-Fiとモバイル通信 ----------
  w_hook(lt, t) {
    let s = g('translate(540 430)',
      rect(-430, -150, 860, 300, C.white, 40) +
      hand(-300, 0, '9:41', 72) + wifiIcon(90, -10, 1.15) + barsIcon(290, 0, 1.25) + hand(390, 0, '5G', 50));
    const b = Math.sin(t * 5) * 8;
    s += g(`translate(630 ${640 + b})`, path('M0 -40 L-25 0 L25 0 Z', C.red, 5));
    s += g(`translate(830 ${640 - b})`, path('M0 -40 L-25 0 L25 0 Z', C.red, 5));
    s += g('translate(630 760)', hand(-160, 0, '？', 120, C.red) + hand(160, 0, '？', 120, C.orange));
    return s;
  },
  w_def(lt, t) {
    let s = g(`translate(290 470) scale(${pop(lt, 0.1)})`, house(0, -40, 0.9) + faucet(-10, 230, 0.8, 0.9) +
      marker(0, 340, 280, 80, '#9be3e8') + hand(0, 342, 'Wi-Fi', 60) + hand(0, 420, '＝ 家の水道', 50));
    s += g(`translate(790 470) scale(${pop(lt, 0.9)})`, bottle(0, 40, 1.3, 0.75) +
      marker(0, 340, 330, 80, C.yellow) + hand(0, 342, 'モバイル通信', 54) + hand(0, 420, '＝ 持ち歩く水筒', 50));
    return s;
  },
  w_wifi(lt, t) {
    let s = `<circle cx="420" cy="560" r="${300 + Math.sin(t * 2) * 6}" fill="#e3f3fa" stroke="#7cc4ea" stroke-width="6" stroke-dasharray="18 14"/>`;
    s += house(420, 600, 1.2);
    s += g('translate(420 520)', rect(-60, -25, 120, 50, '#5a6070', 12, 5) + path('M-35 -25 L-45 -70 M35 -25 L45 -70', 'none', 6)) + waves(420, 500, 0.8, t, '#2f8fb0');
    s += path('M280 760 Q150 860 90 940', 'none', 9) + g('translate(110 970)', rect(-80, -32, 160, 64, C.white, 32, 5) + hand(0, 3, '光回線', 36));
    s += g('translate(420 500)', hand(0, -130, 'ルーター', 34, '#2f8fb0'));
    if (lt > 2.4) s += g(`translate(870 760) scale(${pop(lt, 2.4)})`, rect(-150, -60, 300, 120, C.white, 30) + hand(0, -15, '届くのは', 38) + hand(0, 30, '家の中くらい', 38, '#2f8fb0'));
    return s;
  },
  w_mobile(lt, t) {
    let s = tower(830, 380, 1.1) + waves(830, 230, 0.9, t, C.orange);
    s += g('translate(830 600)', rect(-110, -32, 220, 64, C.white, 32, 5) + hand(0, 3, '基地局', 38));
    const walk = Math.sin(t * 3) * 10;
    s += phoneBig(300 + walk, 560, 0.75, hand(0, -60, '外でも', 40) + hand(0, 10, 'OK', 60, '#2f8f4e'));
    if (lt > 2.4) {
      s += g(`translate(560 820) scale(${pop(lt, 2.4)})`, tank(0, 0, 0.55, lerp(0.8, 0.55, prog(lt, 2.4, 4.5))));
      s += g(`translate(560 590) scale(${pop(lt, 2.6)})`, hand(0, 0, 'ギガを使う', 46, C.red));
    }
    return s;
  },
  w_icons(lt, t) {
    let s = g(`translate(290 470) scale(${pop(lt, 0)})`, rect(-220, -260, 440, 520, C.white, 30) +
      wifiIcon(0, -90, 1.9, '#2f8fb0') + hand(0, 90, 'Wi-Fi', 64) + hand(0, 170, '扇形のマーク', 40, '#2f8fb0'));
    s += g(`translate(790 470) scale(${pop(lt, 0.6)})`, rect(-220, -260, 440, 520, C.white, 30) +
      barsIcon(0, -80, 2.0, C.orange) + hand(0, 90, 'モバイル通信', 54) + hand(0, 170, '棒のマーク', 40, '#c97a20'));
    s += g(`translate(540 900) scale(${pop(lt, 1.6)})`, hand(0, 0, '※ 両方出ているときは Wi-Fi が優先', 38, '#6b5d52'));
    return s;
  },
  w_free(lt, t) {
    let s = g('translate(330 560)', rect(-220, -150, 440, 330, '#f7ead2', 12) + path('M-250 -150 L250 -150 L220 -230 L-220 -230 Z', C.green, 8) +
      rect(-90, 60, 180, 120, '#a8723f', 6) + rect(-180, -110, 140, 100, '#dff1fb', 6, 5) + rect(40, -110, 140, 100, '#dff1fb', 6, 5) +
      rect(-150, -320, 300, 80, C.white, 16, 6) + hand(0, -280, 'FREE Wi-Fi', 44, '#2f8fb0'));
    s += g(`translate(800 420) scale(${pop(lt, 0.8)})`, lockIcon(0, 0, 1.4, true) + hand(0, 150, '鍵なしのことも', 44, C.red));
    if (lt > 2.4) s += g(`translate(800 800) scale(${pop(lt, 2.4)})`, rect(-200, -70, 400, 140, '#ffe1dc', 30) +
      hand(0, -18, 'パスワード入力は', 40) + hand(0, 32, 'さけると安心', 44, C.red));
    return s;
  },
  w_summary(lt, t) {
    return summaryPage(lt, '005', 'Wi-Fiとモバイル通信', [
      [() => wifiIcon(0, 0, 0.8, '#2f8fb0'), 'Wi-Fi＝家の水道', 'ギガを使わない', '#2f8fb0'],
      [() => barsIcon(0, 0, 0.9, C.orange), 'モバイル通信＝水筒', 'どこでも使えるがギガを使う', '#c97a20'],
      [() => lockIcon(0, 0, 0.6, true), 'フリーWi-Fiは注意', '大事な入力はさけよう', '#c4553f'],
    ]);
  },
  w_cta(lt, t) { return ctaPage(lt, '006', 'クラウドってなに？'); },
});

VERSIONS.g4 = {
  no: '004', narration: true, stage: { tx: 0, ty: 150, s: 1 }, capY: 1420, duration: 33,
  bigFirst: true, sticker: [7.6, 11.8],
  scenes: seq([
    [0, 4, 'g_hook'], [4, 7, 'g_def'], [7, 12, 'g_use'], [12, 17, 'g_empty', 1.1], [17, 22, 'g_wifi', 1.1],
    [22, 27, 'g_tips', 1.15], [27, 30, 'g_summary', 1.2], [30, 33, 'g_cta'],
  ]),
  captions: [
    [0.0, 1.9, '「ギガが減る」って\n何が減ってるか知ってる？'],
    [1.9, 4.0, '30秒で{y:ギガの節約}が\nわかるようになります'],
    [4.0, 7.0, '{y:ギガ}は 毎月使える\n{c:データの量}のこと'],
    [7.0, 9.5, 'LINEの文字なら\n{g:ちょろっと}しか減らない'],
    [9.5, 12.0, 'でも動画は\n{r:ドバドバ}使う'],
    [12.0, 14.5, 'タンクが{r:空になる}と…'],
    [14.5, 17.0, '通信が{r:とても遅くなる}\n（速度制限）'],
    [17.0, 19.5, 'でも{c:Wi-Fi}に\nつないでいる間は'],
    [19.5, 22.0, 'ギガは{g:減らない}'],
    [22.0, 24.5, '動画やアプリの更新は\n{g:Wi-Fiのときに}'],
    [24.5, 27.0, '残りは{y:設定}や\n携帯会社のアプリで確認'],
    [27.0, 30.0, '{y:ギガ}＝毎月のデータの量\n{c:Wi-Fi}を上手に使おう'],
    [30.0, 33.0, '{y:保存}して\n月末に見返してね'],
  ],
};
VERSIONS.w5 = {
  no: '005', narration: true, stage: { tx: 0, ty: 150, s: 1 }, capY: 1420, duration: 32,
  bigFirst: true, sticker: [7.6, 11.8],
  scenes: seq([
    [0, 4, 'w_hook'], [4, 7, 'w_def'], [7, 12, 'w_wifi'], [12, 17, 'w_mobile', 1.1], [17, 21, 'w_icons'],
    [21, 26, 'w_free', 1.1], [26, 29, 'w_summary', 1.2], [29, 32, 'w_cta'],
  ]),
  captions: [
    [0.0, 1.9, 'スマホのこの{c:扇形のマーク}\n何か知ってる？'],
    [1.9, 4.0, '30秒で{c:Wi-Fi}と{y:モバイル通信}の\n違いがわかります'],
    [4.0, 7.0, '{c:Wi-Fi}は家の水道\n{y:モバイル通信}は持ち歩く水筒'],
    [7.0, 9.5, '{c:Wi-Fi}は 家のネット回線を\n電波で飛ばしたもの'],
    [9.5, 12.0, '届くのは\n{c:家の中}くらいまで'],
    [12.0, 14.5, '{y:モバイル通信}は\n携帯会社の{y:基地局}につなぐ'],
    [14.5, 17.0, 'どこでも使えるけど\n{r:ギガを使う}'],
    [17.0, 21.0, '画面の{c:扇形}がWi-Fi\n{y:棒のマーク}がモバイル通信'],
    [21.0, 23.5, 'カフェなどの{r:フリーWi-Fi}は\nだれでも入れることも'],
    [23.5, 26.0, '大事なパスワード入力は\n{r:さけると安心}'],
    [26.0, 29.0, '家では{c:Wi-Fi}\n外では{y:モバイル通信}'],
    [29.0, 32.0, '{y:保存}して\nギガの節約に役立ててね'],
  ],
};

// No.003 Cookie ナレーション版（k3s と同じ絵・字幕。時間は声に合わせて伸び縮み）
VERSIONS.k3v = Object.assign({}, VERSIONS.k3s, {
  captions: VERSIONS.k3s.captions.map((c, i) => i === 1 ? [c[0], c[1], 'この動画で{y:許可していいか}\nわかるようになります'] : c),
});

// No.004 / No.005 ナレーション版
VERSIONS.g4v = Object.assign({}, VERSIONS.g4, {
  captions: VERSIONS.g4.captions.map((c, i) => i === 1 ? [c[0], c[1], 'この動画で{y:ギガの節約}が\nわかるようになります'] : c),
});
VERSIONS.w5v = Object.assign({}, VERSIONS.w5, {
  captions: VERSIONS.w5.captions.map((c, i) => i === 1 ? [c[0], c[1], 'この動画で{c:Wi-Fi}と{y:モバイル通信}の\n違いがわかります'] : c),
});

// ======================================================================
// No.006 クラウド / No.007 二段階認証（ナレーション前提のショート形式）
// ======================================================================
const warehouse = (x, y, s) => g(at(x, y, s),
  rect(-170, -60, 340, 200, '#e9edf2', 10) + path('M-195 -50 L0 -170 L195 -50 Z', '#9aa6b1', 8) +
  rect(-110, 10, 220, 130, '#c9d1d9', 6, 6) + [0, 1, 2, 3].map((i) => path(`M-110 ${40 + i * 28} L110 ${40 + i * 28}`, 'none', 4)).join('') +
  rect(-70, -120, 140, 44, C.white, 10, 5) + hand(0, -97, '倉庫', 32));
const photo = (x, y, s, col = C.blue, r = 0) => g(at(x, y, s, r),
  rect(-50, -40, 100, 80, C.white, 6, 5) + path('M-38 26 L-12 -2 L8 16 L22 4 L38 26 Z', col, 4) + circle(24, -18, 8, C.yellow, 3));
const gauge = (x, y, w, fill, label) => g(`translate(${x} ${y})`,
  rect(-w / 2, -32, w, 64, C.white, 32) + `<rect x="${-w / 2 + 8}" y="-24" width="${(w - 16) * fill}" height="48" rx="24" fill="${fill > 0.8 ? C.red : C.green}"/>` +
  rect(-w / 2, -32, w, 64, 'none', 32) + (label ? hand(-w / 2 - 20, 2, label, 40, INK, 'end') : ''));
const door = (x, y, s, open = 0) => g(at(x, y, s),
  rect(-130, -230, 260, 460, '#e9d8bf', 12) + g(`translate(-110 0) scale(${1 - open * 0.7} 1) translate(110 0)`,
    rect(-110, -210, 220, 420, '#a8723f', 10) + circle(70, 20, 14, C.yellow, 5) + rect(55, 50, 30, 50, '#5a4030', 6, 4)));
const keyIcon = (x, y, s, r = 0, col = C.yellow) => g(at(x, y, s, r),
  circle(-40, 0, 30, col, 7) + circle(-40, 0, 10, C.paper, 4) + rect(-12, -10, 100, 20, col, 6, 6) + rect(55, 8, 14, 22, col, 3, 5) + rect(75, 8, 12, 16, col, 3, 5));
const thief = (x, y, s) => g(at(x, y, s),
  path('M-90 200 Q-90 70 0 62 Q90 70 90 200 Z', '#4a4f5c') + circle(0, -10, 72, C.skin) +
  `<path d="M-74 -18 L74 -18 L74 10 L-74 10 Z" fill="${INK}"/>` + `<circle cx="-28" cy="-4" r="7" fill="#fff"/><circle cx="28" cy="-4" r="7" fill="#fff"/>` +
  path('M-75 -40 Q0 -110 75 -40 Z', '#4a4f5c', 6));
const codeBoxes = (x, y, s, code, shown = 6) => g(at(x, y, s),
  [...code].map((ch, i) => rect(-165 + i * 56, -34, 48, 68, C.white, 8, 5) + (i < shown ? hand(-141 + i * 56, 4, ch, 46) : '')).join(''));

Object.assign(SCENES, {
  // ---------- No.006 クラウド ----------
  cl_hook(lt, t) {
    let s = phoneBig(400, 480, 1.25,
      rect(-95, -170, 190, 130, '#ffe1dc', 16, 4) + hand(0, -135, 'ストレージが', 28, C.red) + hand(0, -95, 'いっぱいです', 28, C.red) +
      [0, 1, 2, 3, 4, 5].map((i) => photo(-60 + (i % 3) * 60, 10 + Math.floor(i / 3) * 70, 0.45, BOOK_COLORS[i])).join(''));
    s += cloud(820, 300, 0.95, 'クラウド') + hand(820, 470, '？', 110, C.red);
    s += arrow(560, 420, 690, 360, C.gray, 8);
    return s;
  },
  cl_def(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 760, 100, '#9be3e8') + hand(0, 4, 'クラウド ＝ ネットの貸し倉庫', 58));
    s += g(`translate(540 520) scale(${pop(lt, 0.3)})`, cloud(0, 120, 2.0, '') + warehouse(0, 40, 1.05));
    return s;
  },
  cl_store(lt, t) {
    let s = cloud(760, 450, 1.4, '') + warehouse(760, 430, 0.65) + phoneBig(260, 640, 0.95, [0, 1, 2, 3].map((i) => photo(-45 + (i % 2) * 90, -90 + Math.floor(i / 2) * 100, 0.7, BOOK_COLORS[i])).join(''));
    for (let i = 0; i < 4; i++) {
      const p = ((lt * 0.55 + i * 0.25) % 1);
      s += photo(lerp(300, 740, p), lerp(560, 470, p) - Math.sin(p * Math.PI) * 100, 0.8, BOOK_COLORS[i], p * 20);
    }
    if (lt > 2.4) s += g(`translate(760 740) scale(${pop(lt, 2.4)})`,
      rect(-200, -55, 400, 110, C.white, 30) + hand(0, -14, 'iCloud', 38, '#2f8fb0') + hand(0, 30, 'Googleドライブ など', 34, '#2f8fb0'));
    return s;
  },
  cl_merit(lt, t) {
    let s = cloud(540, 230, 1.5, '') + warehouse(540, 210, 0.7);
    s += phoneBig(220, 700, 0.75, path('M-80 -150 L-10 -60 L-50 0 L30 90 L-20 170', 'none', 6) + hand(0, 40, '', 10));
    s += g(`translate(220 430) scale(${pop(lt, 0.3)})`, hand(0, 0, 'こわれた…', 44, C.red));
    s += g(`translate(540 470) scale(${pop(lt, 0.9)})`, check(-110, 0, 1) + hand(-60, 4, '写真は無事', 50, '#2f8f4e', 'start'));
    if (lt > 2.4) {
      s += laptop(820, 760, 0.6, photo(0, -20, 1.4, C.green));
      s += arrow(620, 360, 790, 620, C.green, 8);
      s += g(`translate(820 940) scale(${pop(lt, 2.6)})`, hand(0, 0, 'パソコンからも', 46, '#2f8f4e'));
    }
    return s;
  },
  cl_space(lt, t) {
    const f = lerp(0.95, 0.45, easeInOut(prog(lt, 0.4, 3.2)));
    let s = gauge(560, 140, 620, f, 'スマホ');
    s += phoneBig(300, 620, 0.95, [0, 1, 2, 3, 4, 5].map((i) => (i < Math.round(f * 6) ? photo(-50 + (i % 2) * 100, -120 + Math.floor(i / 2) * 95, 0.65, BOOK_COLORS[i]) : '')).join(''));
    s += cloud(800, 560, 1.2, '') + warehouse(800, 540, 0.55);
    s += arrow(470, 560, 650, 520, C.blue, 9);
    if (lt > 2.6) s += g(`translate(560 290) scale(${pop(lt, 2.6)})`, hand(0, 0, 'スッキリ！', 56, '#2f8f4e'));
    return s;
  },
  cl_care(lt, t) {
    let s = cloud(320, 330, 1.4, '') + warehouse(320, 310, 0.65);
    s += gauge(320, 620, 440, 0.95, '');
    s += g('translate(320 700)', hand(0, 0, '無料分には上限', 44, C.red));
    if (lt > 2.4) {
      s += g(`translate(800 450) scale(${pop(lt, 2.4)})`, keyIcon(0, 0, 1.6, -20) + hand(0, 160, 'パスワード', 50, INK));
      s += g(`translate(800 720) scale(${pop(lt, 2.8)})`, rect(-170, -50, 340, 100, '#fff3c4', 30) + hand(0, 4, 'しっかり守る', 46, '#c97a20'));
    }
    return s;
  },
  cl_summary(lt, t) {
    return summaryPage(lt, '006', 'クラウド', [
      [() => cloud(0, 0, 0.42, ''), 'クラウド＝ネットの貸し倉庫', 'iCloud・Googleドライブなど', '#2f8fb0'],
      [() => check(0, 0, 1.3), '壊れても写真は無事', 'パソコンからも見られる', '#2f8f4e'],
      [() => keyIcon(0, 0, 0.8, -20), '無料分には上限がある', 'パスワードはしっかり守る', '#c97a20'],
    ]);
  },
  cl_cta(lt, t) { return ctaPage(lt, '007', '二段階認証ってなに？'); },

  // ---------- No.007 二段階認証 ----------
  tf_hook(lt, t) {
    let s = phoneBig(540, 470, 1.35,
      hand(0, -160, 'ログイン', 34, '#6b5d52') + hand(0, -105, '確認コードを入力', 26) +
      [0, 1, 2, 3, 4, 5].map((i) => rect(-90 + i * 31, -70, 25, 36, C.white, 5, 3)).join('') +
      rect(-95, 20, 190, 110, '#e6f4e8', 16, 4) + hand(0, 50, 'SMS', 26, '#2f8f4e') + hand(0, 95, '123456', 40));
    s += hand(870, 260, '？', 130, C.red) + hand(220, 330, '？', 100, C.orange);
    return s;
  },
  tf_def(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 680, 100, C.yellow) + hand(0, 4, '二段階認証 ＝ 鍵＋合言葉', 60));
    s += door(540, 560, 1.0);
    s += g(`translate(250 520) scale(${pop(lt, 0.5)})`, keyIcon(0, 0, 1.2, -25) + hand(0, 140, '① 鍵', 50));
    s += g(`translate(840 430) scale(${pop(lt, 1.2)})`, bubble(0, 0, 1, '合言葉は？', 320) + hand(0, 250, '② 合言葉', 50));
    return s;
  },
  tf_steal(lt, t) {
    let s = door(760, 560, 1.0) + thief(330, 600, 1.05) + keyIcon(470, 640, 0.9, -10);
    s += g(`translate(330 400) scale(${pop(lt, 0.3)})`, hand(0, 0, 'パスワードを盗んだ！', 44, C.red));
    if (lt > 2.4) {
      s += g(`translate(680 310) scale(${pop(lt, 2.4)})`, bubble(0, 0, 1, '合言葉は？', 320));
      s += g(`translate(540 560) scale(${pop(lt, 2.9) * 1.6})`, cross(0, 0, 1));
      s += g(`translate(560 940) scale(${pop(lt, 3.1)})`, hand(0, 0, '入れない！', 60, '#2f8f4e'));
    }
    return s;
  },
  tf_code(lt, t) {
    const shown = Math.floor(clamp(prog(lt, 0.6, 2.0)) * 6);
    let s = phoneBig(300, 560, 1.05, rect(-95, -160, 190, 100, '#e6f4e8', 16, 4) + hand(0, -130, '確認コード', 26, '#2f8f4e') + hand(0, -85, '483920', 36) +
      circle(0, 60, 50, C.skin, 5) + path('M-60 170 Q0 110 60 170', C.blue, 5) + hand(0, 200, 'あなた', 26));
    s += codeBoxes(760, 360, 0.9, '483920', shown);
    s += g(`translate(760 250) scale(${pop(lt, 0.4)})`, hand(0, 0, 'あなたのスマホだけに届く', 38, '#2f8fb0'));
    if (lt > 2.4) s += g(`translate(760 620) scale(${pop(lt, 2.4)})`,
      rect(-210, -90, 420, 180, '#fff3c4', 30) + hand(0, -30, '使えるのは1回だけ', 40) + hand(0, 30, 'しばらくすると無効', 40, '#c97a20'));
    return s;
  },
  tf_scam(lt, t) {
    let s = phoneBig(320, 560, 1.05, rect(-95, -150, 190, 170, '#ffe1dc', 16, 4) + hand(0, -115, '【重要】', 28, C.red) + hand(0, -70, 'コードを', 30) + hand(0, -30, '教えてください', 26));
    s += g(`translate(320 560) scale(${pop(lt, 0.8) * 2.2})`, cross(0, 0, 1), 'opacity="0.9"');
    s += g(`translate(780 330) scale(${pop(lt, 0.5)})`, warnSign(0, 0, 1.2) + hand(0, 140, 'サギ！', 70, C.red));
    if (lt > 2.4) s += g(`translate(780 720) scale(${pop(lt, 2.4)})`,
      rect(-210, -70, 420, 140, C.white, 30) + hand(0, -18, 'コードは', 42) + hand(0, 32, 'だれにも教えない', 42, C.red));
    return s;
  },
  tf_setup(lt, t) {
    let s = g(`translate(540 470) scale(${pop(lt, 0) * 0.94})`,
      rect(-430, -380, 860, 760, C.white, 30) + hand(0, -310, '2段階認証の設定', 56) + path('M-380 -260 L380 -260', 'none', 3) +
      [['LINE', 0.6], ['Google', 1.1], ['Apple ID', 1.6]].map(([nm, at0], i) =>
        hand(-370, -160 + i * 150, nm, 50, INK, 'start') + toggle(290, -160 + i * 150, lt > at0)).join('') +
      hand(0, 300, '※ 各アプリの「設定」から', 34, '#6b5d52'));
    return s;
  },
  tf_summary(lt, t) {
    return summaryPage(lt, '007', '二段階認証', [
      [() => keyIcon(0, 0, 0.8, -20), '二段階認証＝鍵＋合言葉', 'パスワードが盗まれても安心', '#2f8fb0'],
      [() => codeBoxes(0, 0, 0.32, '483920'), '合言葉はあなたのスマホに', '1回だけ・しばらくで無効', '#c97a20'],
      [() => warnSign(0, 0, 0.6), 'コードはだれにも教えない', '「教えて」はサギ', '#c4553f'],
    ]);
  },
  tf_cta(lt, t) { return ctaPage(lt, '008', 'アップデートって必要？'); },
});

VERSIONS.c6 = {
  no: '006', narration: true, stage: { tx: 0, ty: 150, s: 1 }, capY: 1420, duration: 32,
  bigFirst: true, sticker: [7.6, 11.8],
  scenes: seq([
    [0, 4, 'cl_hook'], [4, 7, 'cl_def'], [7, 12, 'cl_store'], [12, 17, 'cl_merit', 1.1], [17, 21, 'cl_space'],
    [21, 26, 'cl_care', 1.1], [26, 29, 'cl_summary', 1.2], [29, 32, 'cl_cta'],
  ]),
  captions: [
    [0.0, 1.9, '「クラウドに保存」って\nどこに保存してるか知ってる？'],
    [1.9, 4.0, 'この動画で{c:クラウド}が\nわかるようになります'],
    [4.0, 7.0, '{c:クラウド}は\nネットの向こうの{y:貸し倉庫}'],
    [7.0, 9.5, '写真やファイルを\nネットの倉庫に{y:預けておく}'],
    [9.5, 12.0, '{c:iCloud}や{c:Googleドライブ}が\nその代表'],
    [12.0, 14.5, 'スマホが{r:壊れても}\n写真は{g:無事}'],
    [14.5, 17.0, '{g:別のスマホやパソコン}からも\n見られる'],
    [17.0, 21.0, 'スマホの中を空けて\n{g:容量の節約}にもなる'],
    [21.0, 23.5, '無料で使える量には\n{r:上限}がある'],
    [23.5, 26.0, '倉庫の鍵＝{r:パスワード}は\nしっかり守ろう'],
    [26.0, 29.0, '{c:クラウド}＝ネットの貸し倉庫\n{g:預けておけば安心}'],
    [29.0, 32.0, '{y:保存}して\nスマホを買い替えるとき見返してね'],
  ],
};
VERSIONS.t7 = {
  no: '007', narration: true, stage: { tx: 0, ty: 150, s: 1 }, capY: 1420, duration: 32,
  bigFirst: true, sticker: [7.6, 11.8],
  scenes: seq([
    [0, 4, 'tf_hook'], [4, 7, 'tf_def'], [7, 12, 'tf_steal'], [12, 17, 'tf_code', 1.1], [17, 22, 'tf_scam', 1.1],
    [22, 26, 'tf_setup'], [26, 29, 'tf_summary', 1.2], [29, 32, 'tf_cta'],
  ]),
  captions: [
    [0.0, 1.9, '「確認コード」が届くアレ\nなんのためか知ってる？'],
    [1.9, 4.0, 'この動画で{y:二段階認証}が\nわかるようになります'],
    [4.0, 7.0, '{y:二段階認証}は\n{c:鍵}と{p:合言葉}の二重ロック'],
    [7.0, 9.5, 'もしパスワードが\n{r:盗まれても}'],
    [9.5, 12.0, '合言葉がないので\n{g:入れない}'],
    [12.0, 14.5, '合言葉は\n{y:あなたのスマホだけ}に届く'],
    [14.5, 17.0, '使えるのは1回だけ\n{y:しばらくすると無効}'],
    [17.0, 19.5, '「コードを教えて」は\n{r:サギ}'],
    [19.5, 22.0, '確認コードは\n{r:だれにも教えない}'],
    [22.0, 26.0, '大事なアカウントは\n{g:設定でオン}にしておこう'],
    [26.0, 29.0, '{y:二段階認証}＝鍵＋合言葉\nコードは{r:だれにも教えない}'],
    [29.0, 32.0, '{y:保存}して\n家族にも教えてあげてね'],
  ],
};

// ======================================================================
// No.008 アップデート / No.009 フィッシング詐欺
// ======================================================================
const hammer = (x, y, s, r = 0) => g(at(x, y, s, r), rect(-12, -10, 24, 150, '#a8723f', 6, 6) + rect(-60, -50, 120, 50, '#9aa6b1', 10, 6));
const holeWall = (x, y, s, patched) => g(at(x, y, s),
  rect(-200, -150, 400, 300, '#f7ead2', 10) + [0, 1, 2].map((r) => path(`M-200 ${-75 + r * 75} L200 ${-75 + r * 75}`, 'none', 3)).join('') +
  (patched ? rect(-70, -55, 140, 110, '#e0b77c', 10, 6) + path('M-50 -35 L50 35 M50 -35 L-50 35', 'none', 4)
    : `<path d="M-60 -40 L-20 -55 L30 -35 L60 0 L40 45 L-10 55 L-55 30 Z" fill="${INK}"/>`));
const plug = (x, y, s) => g(at(x, y, s), rect(-40, -30, 80, 60, '#e6e9ee', 12, 6) + path('M-15 -30 L-15 -60 M15 -30 L15 -60', 'none', 8) + path('M0 30 Q0 90 -60 110', 'none', 8));
const popupAd = (x, y, s) => g(at(x, y, s),
  rect(-230, -150, 460, 300, '#fff3f0', 20, 7) + rect(-230, -150, 460, 64, C.red, 18, 7) + hand(0, -116, '警告！', 40, C.white) +
  hand(0, -30, 'ウイルスに感染', 40, C.red) + rect(-150, 40, 300, 76, C.red, 38, 6) + hand(0, 80, '今すぐ更新', 40, C.white));
const fishHook = (x, y, s, bait = '当選！') => g(at(x, y, s),
  path('M0 -150 L0 40 Q0 110 -60 110 Q-110 110 -110 60', 'none', 9) + path('M-110 60 L-125 30', 'none', 9) +
  g('translate(-40 90)', rect(-90, -40, 180, 80, C.yellow, 40, 6) + hand(0, 3, bait, 40, C.red)));
const urlBar = (x, y, s, url, bad) => g(at(x, y, s),
  rect(-330, -40, 660, 80, C.white, 40) + lockIcon(-280, 8, 0.38, bad) + hand(-235, 3, url, 40, bad ? C.red : INK, 'start'));
const formCard = (x, y, s) => g(at(x, y, s),
  rect(-200, -190, 400, 380, C.white, 20) + hand(0, -150, 'ログイン', 40) +
  [['ID', -80], ['パスワード', 10], ['カード番号', 100]].map(([lb, yy]) => hand(-170, yy - 28, lb, 26, '#6b5d52', 'start') + rect(-170, yy - 10, 340, 46, '#f0ede6', 8, 4) + hand(-155, yy + 14, '●●●●●', 26, INK, 'start')).join(''));
const starIcon = (x, y, s, col = C.yellow) => g(at(x, y, s), path('M0 -60 L17 -18 L60 -18 L25 8 L38 52 L0 26 L-38 52 L-25 8 L-60 -18 L-17 -18 Z', col, 6));

Object.assign(SCENES, {
  // ---------- No.008 アップデート ----------
  up_hook(lt, t) {
    const press = lt > 1.2 && lt < 1.6;
    let s = phoneBig(540, 470, 1.35,
      hand(0, -160, 'ソフトウェア', 30, '#6b5d52') + hand(0, -120, 'アップデート', 30, '#6b5d52') +
      rect(-95, -80, 190, 80, '#dff1fb', 14, 4) + hand(0, -40, 'iOS 新しい版', 26) +
      rect(-90, 30, 180, 56, C.blue, 28, 4) + hand(0, 58, '今すぐ', 30, C.white) +
      rect(-90, 105, 180, 56, press ? '#cfd6dd' : '#eee', 28, 4) + hand(0, 133, 'あとで', 30));
    s += g(`translate(870 720) scale(${1 + (press ? 0.15 : 0)})`, hand(0, 0, 'ポチッ', 60, C.red));
    s += hand(240, 260, '？', 110, C.orange);
    return s;
  },
  up_def(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 820, 100, C.yellow) + hand(0, 4, 'アップデート ＝ 防犯リフォーム', 58));
    s += house(540, 600, 1.5);
    s += g(`translate(820 420) rotate(${Math.sin(t * 8) * 18})`, hammer(0, 0, 1.0, 30));
    s += sparkle(260, 360, 0.9 * pop(lt, 0.8)) + sparkle(820, 760, 0.7 * pop(lt, 1.2));
    return s;
  },
  up_hole(lt, t) {
    const patched = lt > 2.6;
    let s = holeWall(560, 620, 1.3, patched);
    if (!patched) s += g(`translate(${270 + Math.sin(t * 2) * 10} 600)`, thief(0, 0, 0.75));
    if (patched) {
      s += g(`translate(820 420) rotate(${Math.sin(t * 8) * 18})`, hammer(0, 0, 0.9, 30));
      s += g(`translate(560 860) scale(${pop(lt, 2.6)})`, check(-150, 0, 1) + hand(-95, 4, '穴をふさいだ！', 50, '#2f8f4e', 'start'));
    } else {
      s += g(`translate(560 400) scale(${pop(lt, 0.4)})`, hand(0, 0, '防犯の穴', 54, C.red));
    }
    return s;
  },
  up_how(lt, t) {
    let s = phoneBig(300, 560, 1.0, hand(0, -40, '更新中…', 34) + rect(-80, 10, 160, 26, '#eee', 13, 4) + `<rect x="-77" y="13" width="${154 * ((lt * 0.25) % 1)}" height="20" rx="10" fill="${C.green}"/>`);
    s += plug(300, 900, 0.9);
    s += g(`translate(760 360) scale(${pop(lt, 0.3)})`, wifiIcon(0, 0, 1.3, '#2f8fb0') + hand(0, 120, 'Wi-Fi', 50));
    s += g(`translate(760 640) scale(${pop(lt, 0.7)})`, rect(-110, -50, 220, 100, '#fff3c4', 30) + hand(0, 4, '充電', 54));
    if (lt > 2.4) s += g(`translate(760 850) scale(${pop(lt, 2.4)})`, cloud(0, 0, 0.8, 'バックアップ'));
    return s;
  },
  up_fake(lt, t) {
    let s = browserWin(110, 120, 860, 760) + g(`translate(540 520) scale(${pop(lt, 0.2)})`, popupAd(0, 0, 1.2));
    if (lt > 0.9) s += g(`translate(820 330) scale(${pop(lt, 0.9) * 1.6})`, cross(0, 0, 1)) + g(`translate(540 790) scale(${pop(lt, 1.1)})`, hand(0, 0, 'ニセモノに注意！', 50, C.red));
    if (lt > 2.4) s += g(`translate(540 960) scale(${pop(lt, 2.4)})`,
      rect(-330, -55, 660, 110, C.white, 30) + check(-270, 0, 0.8) + hand(-225, 4, '設定・アプリストアから', 46, '#2f8f4e', 'start'));
    return s;
  },
  up_summary(lt, t) {
    return summaryPage(lt, '008', 'アップデート', [
      [() => hammer(0, -20, 0.55, 30), 'アップデート＝防犯リフォーム', '新機能＋防犯の穴をふさぐ', '#c97a20'],
      [() => wifiIcon(0, 0, 0.8, '#2f8fb0'), 'Wi-Fi＋充電で寝る前に', '心配なら先にバックアップ', '#2f8fb0'],
      [() => warnSign(0, 0, 0.6), '広告の「今すぐ更新」は注意', '更新は設定やストアから', '#c4553f'],
    ]);
  },
  up_cta(lt, t) { return ctaPage(lt, '009', 'フィッシング詐欺ってなに？'); },

  // ---------- No.009 フィッシング詐欺 ----------
  ph_hook(lt, t) {
    let s = phoneBig(540, 470, 1.35,
      hand(0, -165, 'SMS', 30, '#6b5d52') +
      rect(-100, -135, 200, 170, '#f0ede6', 16, 4) + hand(0, -105, 'お荷物を', 26) + hand(0, -70, 'お届けできません', 22) + hand(0, -30, 'でした', 26) +
      hand(0, 10, 'http://xx…', 22, '#2f6fd0') + rect(-90, 70, 180, 56, C.red, 28, 4) + hand(0, 98, '確認する', 28, C.white));
    s += hand(230, 300, '？', 110, C.red) + hand(860, 260, '！', 110, C.orange);
    return s;
  },
  ph_def(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 820, 100, '#ffc9d8') + hand(0, 4, 'フィッシング ＝ ニセのエサで釣る', 56));
    s += g(`translate(540 ${470 + Math.sin(t * 3) * 14}) scale(${pop(lt, 0.2)})`, fishHook(0, 0, 1.5));
    s += g(`translate(540 920) scale(${pop(lt, 1.0)})`, hand(0, 0, '※ 魚＝あなた', 44, '#6b5d52'));
    return s;
  },
  ph_fake(lt, t) {
    let s = shop(300, 620, 1.05, '本物', C.blue) + shop(780, 620, 1.05, 'ニセモノ', C.blue);
    s += g(`translate(540 420) scale(${pop(lt, 0.5)})`, hand(0, 0, 'そっくり！', 56, C.red));
    if (lt > 2.4) s += g(`translate(780 870) scale(${pop(lt, 2.4)})`, rect(-260, -50, 520, 100, '#ffe1dc', 30) + hand(0, 4, '配達・未払い・停止…', 40, C.red));
    return s;
  },
  ph_steal(lt, t) {
    let s = formCard(320, 560, 1.15) + thief(800, 620, 0.85);
    for (let i = 0; i < 3; i++) {
      const p = ((lt * 0.5 + i / 3) % 1);
      if (lt > 0.6) s += g(at(lerp(450, 740, p), 520 + i * 60 - Math.sin(p * Math.PI) * 60, 0.8), rect(-50, -22, 100, 44, C.yellow, 10, 4) + hand(0, 2, '●●●', 24));
    }
    s += g(`translate(800 340) scale(${pop(lt, 0.4)})`, hand(0, 0, 'いただき！', 52, C.red));
    return s;
  },
  ph_check(lt, t) {
    let s = urlBar(540, 260, 1.15, 'amaz0n-login.xyz', true);
    s += g(`translate(${870 + Math.sin(t * 2) * 20} 400)`, circle(0, 0, 60, 'none', 10) + path('M42 42 L95 95', 'none', 16));
    s += g(`translate(480 400) scale(${pop(lt, 0.4)})`, hand(0, 0, 'アドレスがちょっと変', 46, C.red));
    if (lt > 2.4) {
      s += g(`translate(540 720) scale(${pop(lt, 2.4)})`,
        rect(-260, -120, 520, 240, C.white, 30) + hand(0, -60, 'でも一番は', 44) + hand(0, 20, 'リンクを押さない', 56, '#2f8f4e'));
    }
    return s;
  },
  ph_safe(lt, t) {
    let s = g(`translate(300 520) scale(${pop(lt, 0)})`, rect(-200, -230, 400, 460, C.white, 30) + starIcon(0, -80, 1.4) + hand(0, 70, 'ブックマーク', 48) + check(0, 160, 0.9));
    s += g(`translate(780 520) scale(${pop(lt, 0.5)})`, rect(-200, -230, 400, 460, C.white, 30) +
      rect(-70, -150, 140, 140, C.blue, 32, 6) + hand(0, -80, 'App', 44, C.white) + hand(0, 70, '公式アプリ', 48) + check(0, 160, 0.9));
    return s;
  },
  ph_summary(lt, t) {
    return summaryPage(lt, '009', 'フィッシング詐欺', [
      [() => fishHook(0, 70, 0.32, ''), 'フィッシング＝ニセのエサ', '本物そっくりのメール・SMS', '#c4553f'],
      [() => cross(0, 0, 1.1), 'メッセージのリンクは押さない', 'ID・パスワード・カードを守る', '#c4553f'],
      [() => starIcon(0, 0, 0.7), '公式アプリ・ブックマークから', '入力したらすぐパスワード変更', '#2f8f4e'],
    ]);
  },
  ph_cta(lt, t) { return ctaPage(lt, '010', 'VPNってなに？'); },
});

VERSIONS.u8 = {
  no: '008', narration: true, stage: { tx: 0, ty: 150, s: 1 }, capY: 1420, duration: 28,
  bigFirst: true, sticker: [7.6, 11.8],
  scenes: seq([
    [0, 4, 'up_hook'], [4, 7, 'up_def'], [7, 12, 'up_hole'], [12, 17, 'up_how', 1.1], [17, 22, 'up_fake', 1.1],
    [22, 25, 'up_summary', 1.2], [25, 28, 'up_cta'],
  ]),
  captions: [
    [0.0, 1.9, '「アップデートしますか？」\nいつも「あとで」押してない？'],
    [1.9, 4.0, 'この動画で{y:アップデートの大切さ}が\nわかるようになります'],
    [4.0, 7.0, '{y:アップデート}は\nスマホやアプリの{y:防犯リフォーム}'],
    [7.0, 9.5, '新しい機能だけじゃなく\n{y:防犯の穴}もふさいでくれる'],
    [9.5, 12.0, '放っておくと\n{r:穴から入られる}ことも'],
    [12.0, 14.5, '{g:Wi-Fi}と{g:充電}をつないで\n寝る前にするのがおすすめ'],
    [14.5, 17.0, '心配なら\n先に{c:バックアップ}を'],
    [17.0, 19.5, 'ネット広告の「今すぐ更新」は\n{r:ニセモノ}のことも'],
    [19.5, 22.0, 'アップデートは\n{g:設定}や{g:アプリストア}から'],
    [22.0, 25.0, '{y:アップデート}＝防犯リフォーム\n「あとで」より{g:今夜}'],
    [25.0, 28.0, '{y:保存}して\n「あとで」を押す前に見返してね'],
  ],
};
VERSIONS.p9 = {
  no: '009', narration: true, stage: { tx: 0, ty: 150, s: 1 }, capY: 1420, duration: 31,
  bigFirst: true, sticker: [7.6, 11.8],
  scenes: seq([
    [0, 4, 'ph_hook'], [4, 7, 'ph_def'], [7, 12, 'ph_fake'], [12, 17, 'ph_steal'], [17, 22, 'ph_check', 1.1],
    [22, 25, 'ph_safe'], [25, 28, 'ph_summary', 1.2], [28, 31, 'ph_cta'],
  ]),
  captions: [
    [0.0, 1.9, '「お荷物をお届けできませんでした」\nこのSMS 押したことある？'],
    [1.9, 4.0, 'この動画で{r:フィッシング詐欺}の\n見分け方がわかります'],
    [4.0, 7.0, '{r:フィッシング}は\nニセモノの{y:エサで釣る}サギ'],
    [7.0, 9.5, '本物そっくりの\nメールやSMSが届く'],
    [9.5, 12.0, '{y:配達}・{y:未払い}・{y:アカウント停止}など\nあせらせる内容が多い'],
    [12.0, 14.5, 'リンク先は\n{r:ニセモノのサイト}'],
    [14.5, 17.0, 'IDやパスワード\n{r:カード番号}を盗まれる'],
    [17.0, 19.5, 'アドレスが{r:ちょっと変}なのも\n見分けるヒント'],
    [19.5, 22.0, 'でも見分けるより\n{g:リンクを押さない}のが一番'],
    [22.0, 25.0, '{g:公式アプリ}や{g:ブックマーク}から\n開けば安心'],
    [25.0, 28.0, '{r:フィッシング}＝ニセモノのエサ\nメッセージのリンクは{g:押さない}'],
    [28.0, 31.0, '{y:保存}して\n家族にもシェアしてね'],
  ],
};
