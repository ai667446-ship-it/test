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

// ======================================================================
// No.010 VPN / No.011 Bluetooth
// ======================================================================
const tunnel = (x, y, s, t) => g(at(x, y, s),
  rect(-420, -40, 840, 200, '#a8723f', 0, 0) + path('M-420 -40 L420 -40', 'none', 7) +
  `<path d="M-380 160 L-380 60 Q-380 0 -320 0 L320 0 Q380 0 380 60 L380 160 Z" fill="#5a4030" stroke="${INK}" stroke-width="7"/>` +
  [0, 1, 2, 3, 4].map((i) => `<circle cx="${-300 + i * 150}" cy="40" r="10" fill="${C.yellow}" opacity="${0.6 + 0.4 * Math.sin(t * 4 + i)}"/>`).join(''));
const envelope = (x, y, s, locked = false, r = 0) => g(at(x, y, s, r),
  rect(-60, -40, 120, 80, C.white, 8, 5) + path('M-60 -40 L0 5 L60 -40', 'none', 5) + (locked ? lockIcon(40, 30, 0.35, false) : hand(0, 25, '中身', 22, '#6b5d52')));
const binoculars = (x, y, s) => g(at(x, y, s), circle(-30, 0, 28, '#5a6070') + circle(30, 0, 28, '#5a6070') + rect(-12, -12, 24, 24, '#5a6070', 4, 5));
const office = (x, y, s) => g(at(x, y, s),
  rect(-120, -200, 240, 400, '#cfd6dd', 8) + [0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => rect(-90 + c * 65, -170 + r * 85, 45, 50, '#dff1fb', 4, 4)).join('')).join('') +
  rect(-40, 130, 80, 70, '#a8723f', 4, 5) + rect(-70, -250, 140, 46, C.white, 10, 5) + hand(0, -226, '会社', 30));
const earbuds = (x, y, s) => g(at(x, y, s),
  path('M-60 -30 Q-90 -30 -90 0 Q-90 30 -60 30 L-55 90', '#fffdf7', 7) + path('M60 -30 Q90 -30 90 0 Q90 30 60 30 L55 90', '#fffdf7', 7));
const watch = (x, y, s) => g(at(x, y, s), rect(-30, -110, 60, 220, '#5a6070', 14, 6) + rect(-55, -60, 110, 120, '#3a3f4b', 22, 7) + rect(-42, -47, 84, 94, '#dff1fb', 14, 4) + hand(0, 2, '9:41', 26));
const speaker = (x, y, s) => g(at(x, y, s), rect(-70, -100, 140, 200, '#5a6070', 24, 7) + circle(0, -35, 26, '#3a3f4b', 5) + circle(0, 45, 40, '#3a3f4b', 5));
const btIcon = (x, y, s, col = '#2f6fd0') => g(at(x, y, s), rect(-55, -75, 110, 150, col, 40, 6) + path('M-22 -30 L22 18 L0 40 L0 -40 L22 -18 L-22 30', 'none', 8).replace(INK, '#fff'));
const dashLink = (x1, y1, x2, y2, t, col = '#2f6fd0') =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${col}" stroke-width="7" stroke-dasharray="16 14" stroke-dashoffset="${-t * 60}" stroke-linecap="round"/>`;

Object.assign(SCENES, {
  // ---------- No.010 VPN ----------
  vp_hook(lt, t) {
    let s = phoneBig(540, 470, 1.35,
      hand(0, -165, '設定', 32, '#6b5d52') + path('M-95 -135 L95 -135', 'none', 3) +
      [['Wi-Fi', true], ['Bluetooth', true], ['VPN', false]].map(([lb, on], i) => {
        const y = -90 + i * 75;
        return (lb === 'VPN' ? rect(-100, y - 30, 200, 60, '#fff3c4', 12, 4) : '') + hand(-88, y, lb, 22, INK, 'start') + g(`translate(68 ${y}) scale(0.4)`, toggle(0, 0, on));
      }).join(''));
    s += hand(870, 560, '？', 130, C.red) + arrow(800, 640, 680, 600, C.red, 8);
    return s;
  },
  vp_def(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 720, 100, '#9be3e8') + hand(0, 4, 'VPN ＝ 秘密の地下トンネル', 60));
    s += tunnel(540, 560, 1.0, t);
    const p = (lt * 0.4) % 1;
    s += envelope(lerp(220, 860, p), 620, 0.8, true);
    s += phoneBig(110, 470, 0.45) + cloud(960, 420, 0.6, 'ネット');
    return s;
  },
  vp_open(lt, t) {
    let s = path('M60 380 L1020 380', 'none', 6) + hand(160, 330, 'フリーWi-Fi', 40, '#2f8fb0');
    const p = (lt * 0.4) % 1;
    s += envelope(lerp(120, 960, p), 450, 0.9, false);
    s += thief(540, 640, 0.6) + binoculars(540, 560, 0.9);
    if (lt < 2.4) s += g(`translate(820 600) scale(${pop(lt, 0.3)})`, hand(0, 0, 'のぞかれる…', 46, C.red));
    if (lt > 2.4) {
      s += tunnel(540, 830, 0.8, t);
      s += envelope(lerp(260, 820, (lt * 0.4) % 1), 880, 0.7, true);
      s += g(`translate(840 640) scale(${pop(lt, 2.5)})`, hand(0, -26, '暗号化して', 42, '#2f8f4e') + hand(0, 26, 'トンネルへ', 42, '#2f8f4e'));
    }
    return s;
  },
  vp_work(lt, t) {
    let s = house(220, 640, 0.9) + office(860, 580, 1.0) + tunnel(540, 840, 0.55, t);
    s += envelope(lerp(320, 760, (lt * 0.45) % 1), 880, 0.55, true);
    s += g(`translate(220 380) scale(${pop(lt, 0.3)})`, hand(0, 0, '家から', 46));
    if (lt > 2.4) s += g(`translate(540 260) scale(${pop(lt, 2.4)})`, rect(-200, -55, 400, 110, '#fff3c4', 30) + hand(0, 4, 'テレワーク', 54, '#c97a20'));
    return s;
  },
  vp_limit(lt, t) {
    let s = g(`translate(300 480) scale(${pop(lt, 0)})`, path('M0 -170 L150 -110 L150 20 Q150 140 0 200 Q-150 140 -150 20 L-150 -110 Z', '#dff1fb', 8) + hand(0, 0, 'VPN', 60, '#2f8fb0'));
    s += g(`translate(760 330) scale(${pop(lt, 0.5)})`, fishHook(0, 60, 0.6, 'サギ') + hand(180, -40, '防げない', 40, C.red));
    if (lt > 2.4) s += g(`translate(760 760) scale(${pop(lt, 2.4)})`,
      rect(-230, -110, 460, 220, '#ffe1dc', 30) + rect(-60, -80, 120, 100, C.gray, 26, 6) + hand(0, -30, '無料', 32, C.white) +
      hand(0, 60, '通信を見られる心配', 38, C.red));
    return s;
  },
  vp_summary(lt, t) {
    return summaryPage(lt, '010', 'VPN', [
      [() => lockIcon(0, 10, 0.6, false), 'VPN＝秘密の地下トンネル', '通信を暗号化して運ぶ', '#2f8fb0'],
      [() => wifiIcon(0, 0, 0.8, '#2f8fb0'), 'フリーWi-Fiや在宅勤務で', '通信を守ってくれる', '#2f8f4e'],
      [() => warnSign(0, 0, 0.6), 'サギやウイルスは防げない', '無料アプリは慎重に', '#c4553f'],
    ]);
  },
  vp_cta(lt, t) { return ctaPage(lt, '011', 'Bluetoothってなに？'); },

  // ---------- No.011 Bluetooth ----------
  bt_hook(lt, t) {
    let s = phoneBig(540, 470, 1.35,
      btIcon(0, -110, 0.6) + hand(0, -10, 'ペアリング', 32) + hand(0, 30, 'しますか？', 30) +
      rect(-90, 80, 180, 56, C.blue, 28, 4) + hand(0, 108, 'ペアリング', 26, C.white));
    s += earbuds(870, 520, 1.0) + hand(220, 280, '？', 120, C.red);
    return s;
  },
  bt_def(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 720, 100, '#c9d8ff') + hand(0, 4, 'Bluetooth ＝ 見えない糸電話', 58));
    s += phoneBig(260, 560, 0.8) + earbuds(820, 560, 1.4) + dashLink(370, 560, 690, 560, t);
    s += g(`translate(540 820) scale(${pop(lt, 0.8)})`, hand(0, 0, '近くの機器と 線なしでつなぐ', 44, '#2f6fd0'));
    return s;
  },
  bt_use(lt, t) {
    let s = phoneBig(540, 540, 0.75);
    const items = [[earbuds(200, 320, 0.9), 200, 320], [watch(880, 330, 0.9), 880, 330], [speaker(200, 820, 0.9), 200, 820], [g('', path('M760 760 L1000 760 L960 860 L800 860 Z', '#cfd6dd', 7) + circle(820, 880, 30, '#5a6070', 6) + circle(940, 880, 30, '#5a6070', 6) + hand(880, 720, '車', 40)), 880, 800]];
    items.forEach(([svg, x, y], i) => {
      s += g(`translate(${x} ${y}) scale(${pop(lt, 0.2 + i * 0.4)}) translate(${-x} ${-y})`, svg);
      if (lt > 0.4 + i * 0.4) s += dashLink(540, 540, x, y, t);
    });
    if (lt > 2.4) s += g(`translate(290 110) scale(${pop(lt, 2.4)})`, rect(-200, -45, 400, 90, '#fff3c4', 30) + hand(0, 4, '届くのは約10m', 46, '#c97a20'));
    return s;
  },
  bt_pair(lt, t) {
    let s = phoneBig(260, 560, 0.85) + earbuds(820, 600, 1.3);
    s += g(`translate(330 260) scale(${pop(lt, 0.3)})`, bubble(0, 0, 1, 'はじめまして！', 400));
    s += g(`translate(800 330) scale(${pop(lt, 0.9)})`, bubble(0, 0, 1, 'よろしく！', 320));
    if (lt > 2.4) {
      s += dashLink(380, 600, 700, 600, t);
      s += g(`translate(540 860) scale(${pop(lt, 2.4)})`, check(-200, 0, 1) + hand(-145, 4, '次から自動でつながる', 46, '#2f8f4e', 'start'));
    }
    return s;
  },
  bt_vs(lt, t) {
    let s = g(`translate(290 470) scale(${pop(lt, 0)})`, rect(-220, -260, 440, 520, C.white, 30) +
      wifiIcon(0, -130, 1.3, '#2f8fb0') + hand(0, -20, 'Wi-Fi', 56) + hand(0, 70, '→ インターネットへ', 38, '#2f8fb0') + cloud(0, 170, 0.6, ''));
    s += g(`translate(790 470) scale(${pop(lt, 0.5)})`, rect(-220, -260, 440, 520, C.white, 30) +
      btIcon(0, -130, 0.8) + hand(0, -20, 'Bluetooth', 50) + hand(0, 70, '→ 機器どうし', 38, '#2f6fd0') + earbuds(-70, 180, 0.5) + watch(80, 180, 0.5));
    if (lt > 2.4) s += g(`translate(540 920) scale(${pop(lt, 2.4)})`, rect(-330, -55, 660, 110, '#fff3c4', 30) + hand(0, 4, 'つながらない→登録を消して再ペアリング', 34, '#c97a20'));
    return s;
  },
  bt_summary(lt, t) {
    return summaryPage(lt, '011', 'Bluetooth', [
      [() => btIcon(0, 0, 0.55), 'Bluetooth＝見えない糸電話', 'イヤホン・時計・車など', '#2f6fd0'],
      [() => check(0, 0, 1.3), '最初にペアリング（自己紹介）', '次から自動でつながる', '#2f8f4e'],
      [() => wifiIcon(0, 0, 0.8, '#2f8fb0'), 'Wi-Fiはネットへ', 'Bluetoothは機器どうし', '#2f8fb0'],
    ]);
  },
  bt_cta(lt, t) { return ctaPage(lt, '012', 'QRコードってなに？'); },
});

VERSIONS.v10 = {
  no: '010', narration: true, stage: { tx: 0, ty: 150, s: 1 }, capY: 1420, duration: 28, bgm: 'lofi',
  bigFirst: true, sticker: [7.6, 11.8],
  scenes: seq([
    [0, 4, 'vp_hook'], [4, 7, 'vp_def'], [7, 12, 'vp_open'], [12, 17, 'vp_work'], [17, 22, 'vp_limit', 1.1],
    [22, 25, 'vp_summary', 1.2], [25, 28, 'vp_cta'],
  ]),
  captions: [
    [0.0, 1.9, '設定にある「{c:VPN}」\n何のためか知ってる？'],
    [1.9, 4.0, 'この動画で{c:VPN}が\nわかるようになります'],
    [4.0, 7.0, '{c:VPN}は\nネットの{y:秘密の地下トンネル}'],
    [7.0, 9.5, '{r:フリーWi-Fi}だと\n通信をのぞかれることも'],
    [9.5, 12.0, '{c:VPN}なら中身を{y:暗号化}して\nトンネルで運ぶ'],
    [12.0, 14.5, '会社のネットワークに\n外から{g:安全につなぐ}ときにも'],
    [14.5, 17.0, '{g:テレワーク}で\nよく使われている'],
    [17.0, 19.5, 'ただし{r:サギやウイルス}までは\n防げない'],
    [19.5, 22.0, '{r:無料のVPNアプリ}は\n通信を見られる心配も'],
    [22.0, 25.0, '{c:VPN}＝秘密のトンネル\n使うなら{g:信頼できるもの}を'],
    [25.0, 28.0, '{y:保存}して\nカフェのWi-Fiを使う前に見返してね'],
  ],
};
VERSIONS.b11 = {
  no: '011', narration: true, stage: { tx: 0, ty: 150, s: 1 }, capY: 1420, duration: 28, bgm: 'marimba',
  bigFirst: true, sticker: [7.6, 11.8],
  scenes: seq([
    [0, 4, 'bt_hook'], [4, 7, 'bt_def'], [7, 12, 'bt_use'], [12, 17, 'bt_pair', 1.1], [17, 22, 'bt_vs', 1.1],
    [22, 25, 'bt_summary', 1.2], [25, 28, 'bt_cta'],
  ]),
  captions: [
    [0.0, 1.9, 'イヤホンの「{y:ペアリング}」\nって何か知ってる？'],
    [1.9, 4.0, 'この動画で{y:Bluetooth}が\nわかるようになります'],
    [4.0, 7.0, '{y:Bluetooth}は\n機器どうしの{c:見えない糸電話}'],
    [7.0, 9.5, 'ワイヤレスイヤホンや\n{y:スマートウォッチ}をつなぐ'],
    [9.5, 12.0, '届くのは\n{c:だいたい10m}くらい'],
    [12.0, 14.5, '最初の{y:ペアリング}は\nおたがいの{y:自己紹介}'],
    [14.5, 17.0, '一度すれば\n次から{g:自動でつながる}'],
    [17.0, 19.5, '{c:Wi-Fi}はインターネットへ\n{y:Bluetooth}は機器どうし'],
    [19.5, 22.0, 'つながらないときは\n{g:登録を消して}ペアリングし直す'],
    [22.0, 25.0, '{y:Bluetooth}＝見えない糸電話\n最初に{y:ペアリング}'],
    [25.0, 28.0, '{y:保存}して\nイヤホンがつながらないとき見返してね'],
  ],
};

// ======================================================================
// No.012 QRコード / No.013 情報漏洩
// ======================================================================
// 見た目だけのQRコード風の模様（決定的）
const qrCode = (x, y, s, seed = 1, col = INK) => {
  let b = rect(-150, -150, 300, 300, C.white, 12, 6);
  const cell = 240 / 21;
  const finder = (cx, cy) => `<rect x="${cx}" y="${cy}" width="${cell * 7}" height="${cell * 7}" fill="${col}"/><rect x="${cx + cell}" y="${cy + cell}" width="${cell * 5}" height="${cell * 5}" fill="#fff"/><rect x="${cx + cell * 2}" y="${cy + cell * 2}" width="${cell * 3}" height="${cell * 3}" fill="${col}"/>`;
  for (let r = 0; r < 21; r++) for (let c = 0; c < 21; c++) {
    const inF = (r < 8 && c < 8) || (r < 8 && c > 12) || (r > 12 && c < 8);
    if (!inF && rnd(r * 31 + c * 7 + seed * 101) > 0.52) b += `<rect x="${-120 + c * cell}" y="${-120 + r * cell}" width="${cell + 0.5}" height="${cell + 0.5}" fill="${col}"/>`;
  }
  b += finder(-120, -120) + finder(-120 + cell * 14, -120) + finder(-120, -120 + cell * 14);
  return g(at(x, y, s), b);
};
const server = (x, y, s) => g(at(x, y, s), rect(-90, -150, 180, 300, '#5a6070', 12) +
  [0, 1, 2, 3].map((i) => rect(-70, -130 + i * 68, 140, 50, '#3a3f4b', 6, 4) + circle(45, -105 + i * 68, 7, C.green, 3)).join(''));
const tvNews = (x, y, s, head) => g(at(x, y, s),
  rect(-330, -210, 660, 420, '#3a3f4b', 24) + rect(-300, -180, 600, 330, '#dff1fb', 10, 4) +
  rect(-300, 60, 600, 90, C.red, 6, 4) + hand(0, 105, head, 46, C.white) + hand(-220, -140, 'NEWS', 36, C.red) +
  rect(-40, 210, 80, 40, '#3a3f4b', 6, 5));
const mail = (x, y, s, label = '', col = C.white, r = 0) => g(at(x, y, s, r),
  rect(-70, -45, 140, 90, col, 8, 5) + path('M-70 -45 L0 10 L70 -45', 'none', 5) + (label ? hand(0, 28, label, 22, C.red) : ''));

Object.assign(SCENES, {
  // ---------- No.012 QRコード ----------
  qr_hook(lt, t) {
    let s = qrCode(540, 470, 1.6, 3);
    s += g('translate(860 230) rotate(10)', rect(-110, -60, 220, 120, C.white, 16) + circle(0, 0, 36, C.red, 0) + `<rect x="-110" y="-60" width="220" height="120" rx="16" fill="none" stroke="${INK}" stroke-width="6"/>`);
    s += hand(220, 230, '？', 110, C.orange);
    return s;
  },
  qr_def(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 720, 100, C.yellow) + hand(0, 4, 'QRコード ＝ 四角い住所メモ', 60));
    s += g(`translate(300 520) scale(${pop(lt, 0.2)})`, qrCode(0, 0, 1.1, 5));
    s += arrow(500, 520, 640, 520, C.gray, 9);
    s += g(`translate(820 520) scale(${pop(lt, 0.9)})`, rect(-180, -70, 360, 140, C.white, 24) + hand(0, -20, 'サイトの住所', 38, '#2f8fb0') + hand(0, 30, 'https://…', 36, '#2f6fd0'));
    return s;
  },
  qr_scan(lt, t) {
    let s = qrCode(300, 600, 0.95, 7);
    const scanY = 470 + ((lt * 1.2) % 1) * 260;
    s += phoneBig(700, 560, 1.0, rect(-100, -190, 200, 300, '#3a3f4b', 10, 0) + qrCode(0, -40, 0.5, 7) +
      `<rect x="-90" y="${scanY - 560 - 40}" width="180" height="6" fill="${C.green}" opacity="0.8"/>`);
    if (lt > 2.4) s += g(`translate(700 880) scale(${pop(lt, 2.4)})`, rect(-180, -48, 360, 96, '#e6f4e8', 24) + hand(0, 4, 'https://…を開く', 34, '#2f6fd0'));
    s += g(`translate(300 330) scale(${pop(lt, 0.3)})`, hand(0, 0, 'かざすだけ', 50, '#2f8f4e'));
    return s;
  },
  qr_use(lt, t) {
    const items = [
      ['メニュー', (x, y) => rect(x - 70, y - 90, 140, 180, '#fffdf7', 10, 6) + path(`M${x - 45} ${y - 50} L${x + 45} ${y - 50} M${x - 45} ${y - 10} L${x + 30} ${y - 10} M${x - 45} ${y + 30} L${x + 40} ${y + 30}`, 'none', 5)],
      ['支払い', (x, y) => phoneBig(x, y, 0.38, hand(0, 0, '¥', 120, C.red))],
      ['Wi-Fi', (x, y) => wifiIcon(x, y, 1.1, '#2f8fb0')],
      ['友だち追加', (x, y) => circle(x, y - 20, 50, C.skin) + path(`M${x - 70} ${y + 90} Q${x} ${y + 20} ${x + 70} ${y + 90}`, C.green, 6) + hand(x + 70, y - 70, '+', 60, '#2f8f4e')],
    ];
    let s = '';
    items.forEach(([lb, draw], i) => {
      const x = 290 + (i % 2) * 500, y = 350 + Math.floor(i / 2) * 400;
      s += g(`translate(${x} ${y}) scale(${pop(lt, 0.2 + i * (i < 2 ? 0.4 : 0.5) + (i >= 2 ? 1.6 : 0))}) translate(${-x} ${-y})`,
        rect(x - 200, y - 160, 400, 320, C.white, 24) + draw(x, y - 20) + hand(x, y + 120, lb, 44));
    });
    return s;
  },
  qr_fake(lt, t) {
    let s = g('translate(540 520)', rect(-300, -380, 600, 760, '#fff3c4', 16) + hand(0, -310, '駐車場のお支払い', 46) + qrCode(0, 20, 1.1, 9));
    const peel = easeOut(prog(lt, 0.6, 1.4));
    s += g(`translate(${540 + (1 - peel) * 500} ${540 - (1 - peel) * 200}) rotate(${(1 - peel) * 30})`, qrCode(0, 0, 1.05, 21, '#7a2a20') + rect(-160, -160, 320, 320, 'none', 14, 5));
    if (lt > 1.4) s += g(`translate(820 300) scale(${pop(lt, 1.4)})`, rect(-150, -50, 300, 100, '#ffe1dc', 30) + hand(0, 4, 'ニセのシール', 40, C.red));
    if (lt > 2.6) s += g(`translate(540 945) scale(${pop(lt, 2.6)})`, hand(0, 0, '→ ニセのサイトへ…', 44, C.red));
    return s;
  },
  qr_summary(lt, t) {
    return summaryPage(lt, '012', 'QRコード', [
      [() => qrCode(0, 0, 0.28, 5), 'QRコード＝四角い住所メモ', '実は日本生まれ', '#c97a20'],
      [() => phoneBig(0, 0, 0.22), 'カメラでかざすだけ', 'メニュー・支払い・Wi-Fiなど', '#2f8f4e'],
      [() => warnSign(0, 0, 0.6), 'ニセのQRコードに注意', '出てきた住所をチェック', '#c4553f'],
    ]);
  },
  qr_cta(lt, t) { return ctaPage(lt, '013', '情報漏洩ってなに？'); },

  // ---------- No.013 情報漏洩 ----------
  lk_hook(lt, t) {
    return tvNews(540, 450, 1.25, '個人情報が漏えい') + hand(870, 820, '自分には', 46) + hand(870, 880, '関係ない？', 46, C.red);
  },
  lk_def(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 780, 100, '#ffc9d8') + hand(0, 4, '情報漏洩 ＝ 名簿が外に出る', 60));
    s += shop(380, 600, 1.1, 'お店', C.blue);
    s += g('translate(380 640)', rect(-60, -70, 120, 140, C.white, 8, 5) + hand(0, -30, '会員', 26) + hand(0, 10, '名簿', 26));
    for (let i = 0; i < 4; i++) {
      const p = ((lt * 0.5 + i / 4) % 1);
      if (lt > 0.6) s += g(at(lerp(470, 920, p), 560 - Math.sin(p * Math.PI) * 200 + i * 30, 0.7, p * 200), rect(-40, -50, 80, 100, C.white, 6, 4) + path('M-25 -20 L25 -20 M-25 0 L25 0 M-25 20 L10 20', 'none', 3));
    }
    return s;
  },
  lk_cause(lt, t) {
    const items = [
      ['不正アクセス', (x, y) => server(x - 50, y, 0.45) + thief(x + 70, y + 10, 0.4)],
      ['設定ミス', (x, y) => lockIcon(x, y, 1.0, true) + hand(x + 90, y - 40, '!', 70, C.red)],
      ['持ち出し', (x, y) => rect(x - 70, y - 40, 140, 100, '#e0b77c', 8, 6) + path(`M${x - 70} ${y - 40} L${x - 40} ${y - 70} L${x + 100} ${y - 70} L${x + 70} ${y - 40}`, '#e9c99a', 6)],
      ['紛失', (x, y) => laptop(x, y + 20, 0.35) + hand(x + 100, y - 60, '?', 70, C.red)],
    ];
    let s = '';
    items.forEach(([lb, draw], i) => {
      const x = 290 + (i % 2) * 500, y = 450 + Math.floor(i / 2) * 350;
      const at0 = i < 2 ? 0.2 + i * 0.4 : 2.5 + (i - 2) * 0.4;
      s += g(`translate(${x} ${y}) scale(${pop(lt, at0)}) translate(${-x} ${-y})`,
        rect(x - 200, y - 140, 400, 280, C.white, 24) + draw(x, y - 25) + hand(x, y + 98, lb, 44, C.red));
    });
    return s;
  },
  lk_spam(lt, t) {
    let s = phoneBig(320, 560, 1.0, hand(0, -150, '受信 99+', 30, C.red));
    for (let i = 0; i < 6; i++) {
      const p = clamp((lt - i * 0.3) / 1.2);
      if (p > 0) s += mail(lerp(900, 340, easeOut(p)), lerp(200 + i * 60, 400 + (i % 3) * 120, easeOut(p)), 0.8, '', C.white, (rnd(i) - 0.5) * 30);
    }
    if (lt > 2.4) s += g(`translate(780 620) scale(${pop(lt, 2.4)})`, mail(0, 0, 2.0, '', '#ffe1dc') + hand(0, -10, '【お詫び】', 30, C.red) + hand(0, 140, 'これもニセモノかも', 40, C.red));
    return s;
  },
  lk_reuse(lt, t) {
    const good = lt > 2.4;
    let s = '';
    ['A', 'B', 'C'].forEach((nm, i) => {
      const x = 560 + i * 200;
      s += door(x, 560, 0.55, good ? 0 : clamp((lt - 0.6 - i * 0.3) * 2)) + hand(x, 380, nm, 46);
      if (good) s += keyIcon(x, 800, 0.6, -20, [C.yellow, C.green, C.pink][i]);
    });
    if (!good) {
      s += g('translate(220 560)', thief(0, 0, 0.7)) + keyIcon(260, 740, 0.9, -15);
      s += g(`translate(700 880) scale(${pop(lt, 0.8)})`, hand(0, 0, '1本の鍵で全部開く！', 48, C.red));
    } else {
      s += g(`translate(250 560) scale(${pop(lt, 2.4)})`, check(0, 0, 1.4) + hand(0, 120, '鍵はバラバラに', 44, '#2f8f4e'));
    }
    return s;
  },
  lk_2fa(lt, t) {
    let s = door(700, 560, 0.9) + keyIcon(350, 560, 1.2, -20);
    s += g(`translate(760 230) scale(${pop(lt, 0.4)})`, bubble(0, 0, 1, '合言葉は？', 320));
    s += g(`translate(540 930) scale(${pop(lt, 1.0)})`, hand(0, 0, '二段階認証で さらに安心', 46, '#2f8f4e'));
    return s;
  },
  lk_summary(lt, t) {
    return summaryPage(lt, '013', '情報漏洩', [
      [() => server(0, 0, 0.35), '情報漏洩＝名簿が外に出る', 'だれにでも起こりうる', '#c4553f'],
      [() => mail(0, 0, 0.7, '', '#ffe1dc'), 'サギのメールが増える', '「お詫び」メールも注意', '#c4553f'],
      [() => keyIcon(0, 0, 0.7, -20), 'パスワードは使い回さない', '二段階認証でさらに安心', '#2f8f4e'],
    ]);
  },
  lk_cta(lt, t) { return ctaPage(lt, '014', 'ランサムウェアってなに？'); },
});

VERSIONS.q12 = {
  no: '012', narration: true, stage: { tx: 0, ty: 150, s: 1 }, capY: 1420, duration: 28, bgm: 'chip',
  bigFirst: true, sticker: [7.6, 11.8],
  scenes: seq([
    [0, 4, 'qr_hook'], [4, 7, 'qr_def'], [7, 12, 'qr_scan'], [12, 17, 'qr_use'], [17, 22, 'qr_fake', 1.1],
    [22, 25, 'qr_summary', 1.2], [25, 28, 'qr_cta'],
  ]),
  captions: [
    [0.0, 1.9, '{y:QRコード}って\n実は{y:日本生まれ}って知ってる？'],
    [1.9, 4.0, 'この動画で{y:QRコード}の\n使い方と注意点がわかります'],
    [4.0, 7.0, '{y:QRコード}は\n情報をしまった{c:四角い住所メモ}'],
    [7.0, 9.5, 'スマホのカメラで\n{g:かざすだけ}で読み取れる'],
    [9.5, 12.0, '中に書かれた\n{c:サイトの住所}が出てくる'],
    [12.0, 14.5, 'お店のメニューや\n{y:支払い}にも使われる'],
    [14.5, 17.0, '{y:Wi-Fi}や{g:友だち追加}も\nQRコードでかんたん'],
    [17.0, 19.5, 'でも中身は\n{r:見た目ではわからない}'],
    [19.5, 22.0, '上から貼られた{r:ニセのQRコード}で\nニセサイトに飛ばされることも'],
    [22.0, 25.0, '読み取ったら\n{g:出てきた住所}をチェック'],
    [25.0, 28.0, '{y:保存}して\nQRコードを読む前に見返してね'],
  ],
};
VERSIONS.l13 = {
  no: '013', narration: true, stage: { tx: 0, ty: 150, s: 1 }, capY: 1420, duration: 31, bgm: 'musicbox',
  bigFirst: true, sticker: [7.6, 11.8],
  scenes: seq([
    [0, 4, 'lk_hook'], [4, 7, 'lk_def'], [7, 12, 'lk_cause'], [12, 17, 'lk_spam', 1.1], [17, 22, 'lk_reuse', 1.1],
    [22, 25, 'lk_2fa'], [25, 28, 'lk_summary', 1.2], [28, 31, 'lk_cta'],
  ]),
  captions: [
    [0.0, 1.9, 'ニュースでよく聞く「{r:情報漏洩}」\n自分には関係ないと思ってない？'],
    [1.9, 4.0, 'この動画で{r:情報漏洩}から\n身を守る方法がわかります'],
    [4.0, 7.0, '{r:情報漏洩}は お店に預けた\n{y:会員名簿}が外に出ること'],
    [7.0, 9.5, '原因は{r:不正アクセス}や\n{r:設定ミス}'],
    [9.5, 12.0, '内部の人の持ち出しや\nパソコンの{r:紛失}も'],
    [12.0, 14.5, '漏れたメールアドレスに\n{r:サギのメール}が届きやすくなる'],
    [14.5, 17.0, '「お詫び」を名乗る\n{r:ニセメール}にも注意'],
    [17.0, 19.5, '{g:パスワードの使い回し}は\nやめよう'],
    [19.5, 22.0, '1つ漏れると\n{r:ほかのサービスも}開けられてしまう'],
    [22.0, 25.0, '{g:二段階認証}をオンにしておけば\nさらに安心'],
    [25.0, 28.0, '漏れても困らないように\n{g:使い回さない}・{g:二段階認証}'],
    [28.0, 31.0, '{y:保存}して\n家族にもシェアしてね'],
  ],
};

// 案内役つきの見本（No.013 と同じ内容。絵を少し小さくして下に案内役）
VERSIONS.l13h = Object.assign({}, VERSIONS.l13, { host: true, stage: { tx: 86, ty: 100, s: 0.84 }, capY: 1485 });

// 案内役つき（No.011 / No.012）
VERSIONS.b11h = Object.assign({}, VERSIONS.b11, { host: true, stage: { tx: 86, ty: 100, s: 0.84 }, capY: 1485 });
VERSIONS.q12h = Object.assign({}, VERSIONS.q12, { host: true, stage: { tx: 86, ty: 100, s: 0.84 }, capY: 1485 });

// ======================================================================
// No.014 ランサムウェア / No.015 サポート詐欺（新しい冒頭カードつき）
// ======================================================================
const chainLock = (x, y, s) => g(at(x, y, s),
  path('M-170 -60 Q0 -10 170 -60 M-170 40 Q0 90 170 40', 'none', 12) + lockIcon(0, 0, 1.3, false));
const ransomNote = (x, y, s, r = 0) => g(at(x, y, s, r),
  rect(-170, -120, 340, 240, '#fffdf7', 6, 6) + path('M-170 -120 L-140 -95 L-110 -120 L-80 -95 L-50 -120', 'none', 0) +
  hand(0, -60, 'データは', 40, C.red) + hand(0, -5, 'あずかった', 40, C.red) + hand(0, 60, '返してほしければ…', 32));
const moneyBag = (x, y, s) => g(at(x, y, s),
  path('M-80 -60 Q-110 70 0 90 Q110 70 80 -60 Q60 -90 30 -95 L-30 -95 Q-60 -90 -80 -60 Z', '#e0b77c', 7) +
  path('M-30 -95 L-40 -125 L40 -125 L30 -95', '#e0b77c', 6) + hand(0, 15, '¥', 70, '#8b5a35'));
const extDrive = (x, y, s) => g(at(x, y, s),
  rect(-80, -110, 160, 220, '#5a6070', 22) + rect(-55, -80, 110, 40, '#3a3f4b', 8, 4) + circle(0, 50, 14, C.green, 4));
const fileIcon = (x, y, s, locked, col = C.blue) => g(at(x, y, s),
  path('M-50 -65 L25 -65 L50 -40 L50 65 L-50 65 Z', C.white, 6) + rect(-32, -30, 64, 36, col, 6, 4) + (locked ? lockIcon(25, 40, 0.42, false) : ''));

Object.assign(SCENES, {
  // ---------- No.014 ランサムウェア ----------
  rs_def(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 820, 100, '#ffc9d8') + hand(0, 4, 'ランサムウェア ＝ データの誘拐犯', 56));
    s += laptop(420, 520, 1.25, chainLock(0, -30, 0.75));
    s += g(`translate(820 560) scale(${pop(lt, 0.6)})`, ransomNote(0, 0, 0.9, 6));
    return s;
  },
  rs_lock(lt, t) {
    let s = '';
    for (let i = 0; i < 6; i++) {
      const x = 200 + (i % 3) * 340, y = 330 + Math.floor(i / 3) * 330;
      s += fileIcon(x, y, 1.3, lt > 0.4 + i * 0.25, BOOK_COLORS[i]);
      if (lt > 0.4 + i * 0.25 && lt < 0.7 + i * 0.25) s += g(`translate(${x + 30} ${y + 50}) scale(${pop(lt, 0.4 + i * 0.25, 0.3) * 1.6})`, '', '');
    }
    if (lt > 2.2) s += g(`translate(540 900) scale(${pop(lt, 2.2)})`, rect(-330, -55, 660, 110, '#ffe1dc', 30) + hand(0, 4, '開けない！', 56, C.red));
    return s;
  },
  rs_entry(lt, t) {
    let s = phoneBig(300, 560, 0.95, mail(0, -90, 1.1, '', C.white) + rect(-80, 0, 160, 60, '#f0ede6', 10, 4) + hand(0, 30, '請求書.zip', 26) + hand(0, 110, 'http://xx…', 24, '#2f6fd0'));
    s += g(`translate(780 560) scale(${pop(lt, 0.3)})`, rect(-220, -60, 440, 120, C.white, 30) + hand(0, -14, '添付ファイル', 40) + hand(0, 32, '怪しいリンク', 40, C.red));
    if (lt > 1.6) s += g(`translate(780 790) scale(${pop(lt, 1.6)})`, cross(-140, 0, 1) + hand(-90, 4, '開かない', 54, C.red, 'start'));
    return s;
  },
  rs_pay(lt, t) {
    let s = moneyBag(300, 560, 1.4) + arrow(440, 520, 700, 520, C.gray, 9) + thief(820, 600, 0.8);
    if (lt > 1.2) s += g(`translate(540 260) scale(${pop(lt, 1.2)})`, rect(-300, -60, 600, 120, '#ffe1dc', 30) + hand(0, 4, '戻る保証はない', 56, C.red));
    return s;
  },
  rs_backup(lt, t) {
    let s = laptop(300, 480, 0.95, [0, 1, 2].map((i) => fileIcon(-90 + i * 90, -30, 0.55, false, BOOK_COLORS[i])).join(''));
    const p = (lt * 0.5) % 1;
    s += fileIcon(lerp(420, 720, p), 480 - Math.sin(p * Math.PI) * 120, 0.6, false, C.blue);
    s += extDrive(820, 360, 0.9) + cloud(820, 700, 0.8, '');
    s += g(`translate(820 860) scale(${pop(lt, 1.0)})`, hand(0, 0, '別の場所にコピー', 46, '#2f8f4e'));
    return s;
  },
  rs_summary(lt, t) {
    return summaryPage(lt, '014', 'ランサムウェア', [
      [() => lockIcon(0, 10, 0.6, false), 'ランサムウェア＝データの誘拐犯', 'カギをかけてお金を要求', '#c4553f'],
      [() => mail(0, 0, 0.7), '添付やリンクから入る', '怪しいものは開かない', '#c4553f'],
      [() => extDrive(0, 0, 0.4), '一番の対策はバックアップ', 'パソコンとは別の場所に', '#2f8f4e'],
    ]);
  },
  rs_cta(lt, t) { return ctaPage(lt, '015', 'サポート詐欺ってなに？'); },

  // ---------- No.015 サポート詐欺 ----------
  sp_def(lt, t) {
    const blink = Math.floor(t * 4) % 2 === 0;
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 820, 100, '#ffc9d8') + hand(0, 4, 'サポート詐欺 ＝ ニセの警告', 58));
    s += browserWin(110, 180, 860, 700) + g('translate(540 540)',
      rect(-330, -230, 660, 460, blink ? '#fff3f0' : '#ffe1dc', 16, 6) + rect(-330, -230, 660, 80, C.red, 14, 6) + hand(0, -190, '警告！', 44, C.white) +
      hand(0, -90, 'ウイルスに感染しました', 42, C.red) + hand(0, -20, 'サポートに電話してください', 36) +
      rect(-200, 60, 400, 90, '#fff3c4', 20, 5) + hand(0, 106, '☎ 0120-XXX-XXX', 40));
    return s;
  },
  sp_alarm(lt, t) {
    let s = speaker(300, 520, 1.3);
    [0, 1, 2].forEach((i) => { const r = 120 + ((t * 2 + i / 3) % 1) * 160; s += `<path d="M${300 + r * 0.6} ${520 - r * 0.8} A${r} ${r} 0 0 1 ${300 + r * 0.6} ${520 + r * 0.8}" fill="none" stroke="${C.red}" stroke-width="10" opacity="${1 - ((t * 2 + i / 3) % 1)}"/>`; });
    s += g(`translate(780 420) scale(${pop(lt, 0.3)}) rotate(${Math.sin(t * 20) * 4})`, warnSign(0, 0, 1.6));
    s += g(`translate(780 700) scale(${pop(lt, 0.8)})`, hand(0, 0, 'ピーピー！', 60, C.red));
    return s;
  },
  sp_call(lt, t) {
    let s = phoneBig(260, 560, 0.9, hand(0, -40, '☎', 90) + hand(0, 70, '通話中…', 32));
    s += thief(800, 520, 0.85);
    s += g(`translate(300 250) scale(${pop(lt, 0.4)})`, rect(-200, -60, 400, 120, C.white, 30) + hand(0, 4, '遠隔操作アプリを…', 38, C.red));
    if (lt > 1.6) s += g(`translate(800 860) scale(${pop(lt, 1.6)})`, moneyBag(0, 0, 0.8) + hand(0, 120, 'お金を要求', 44, C.red));
    return s;
  },
  sp_fake(lt, t) {
    let s = browserWin(110, 150, 860, 620) + g('translate(540 470)', rect(-300, -180, 600, 360, '#ffe1dc', 16, 6) + hand(0, -60, '警告！', 60, C.red) + hand(0, 30, 'ウイルスに感染', 44, C.red));
    s += g(`translate(540 470) scale(${pop(lt, 0.4) * 2.2})`, cross(0, 0, 1));
    s += g(`translate(540 880) scale(${pop(lt, 1.0)})`, hand(0, 0, 'ただのWebページ', 60, '#2f8fb0'));
    return s;
  },
  sp_close(lt, t) {
    let s = g(`translate(300 480) scale(${pop(lt, 0)})`, rect(-210, -230, 420, 460, C.white, 30) +
      rect(-80, -150, 160, 160, C.red, 30, 7) + path('M-40 -110 L40 -30 M40 -110 L-40 -30', 'none', 14).replace(INK, '#fff') +
      hand(0, 80, 'ブラウザを閉じる', 40) + check(0, 170, 0.8));
    s += g(`translate(780 480) scale(${pop(lt, 0.6)})`, rect(-210, -230, 420, 460, C.white, 30) + powerIcon(0, -70, 0.9, true) + hand(0, 80, '閉じられない時は', 34) + hand(0, 130, '再起動', 44, '#2f8f4e') + check(0, 195, 0.7));
    return s;
  },
  sp_help(lt, t) {
    let s = phoneBig(320, 540, 1.0, hand(0, -30, '188', 110, '#2f8fb0') + hand(0, 60, 'いやや', 34));
    s += g(`translate(760 420) scale(${pop(lt, 0.3)})`, rect(-230, -110, 460, 220, '#fff3c4', 30) + hand(0, -45, '消費者ホットライン', 38) + hand(0, 30, '188', 90, '#c97a20'));
    s += g(`translate(760 720) scale(${pop(lt, 1.0)})`, hand(0, 0, '電話してしまったら相談', 38, '#6b5d52'));
    return s;
  },
  sp_summary(lt, t) {
    return summaryPage(lt, '015', 'サポート詐欺', [
      [() => warnSign(0, 0, 0.6), 'サポート詐欺＝ニセの警告', '音と画面であわてさせる', '#c4553f'],
      [() => cross(0, 0, 1.1), '書いてある番号に電話しない', 'ただのWebページ', '#c4553f'],
      [() => check(0, 0, 1.3), 'ブラウザを閉じる・再起動', '困ったら188に相談', '#2f8f4e'],
    ]);
  },
  sp_cta(lt, t) { return ctaPage(lt, '016', 'バッテリーの最大容量'); },
});

const HOSTV = { narration: true, host: true, stage: { tx: 86, ty: 100, s: 0.84 }, capY: 1485, bigFirst: true, sticker: [7.6, 11.8] };
VERSIONS.r14 = Object.assign({}, HOSTV, {
  no: '014', duration: 26, bgm: 'lofi',
  hook: { text: 'パソコンのデータが\n{r:人質}に!?', bg: '#1f2430' },
  point: [1],
  scenes: seq([
    [0, 1.6, 'rs_def'], [1.6, 4.5, 'rs_def', 1, 1.6], [4.5, 7.5, 'rs_lock'], [7.5, 10.5, 'rs_entry'], [10.5, 13.5, 'rs_pay'],
    [13.5, 20, 'rs_backup'], [20, 23, 'rs_summary', 1.2], [23, 26, 'rs_cta'],
  ]),
  captions: [
    [0.0, 1.6, 'パソコンのデータが人質に!?'],
    [1.6, 4.5, '{r:ランサムウェア}は\nデータを人質にとる{r:ウイルス}'],
    [4.5, 7.5, 'ファイルに{r:カギ}をかけて\n「返してほしければお金を」'],
    [7.5, 10.5, 'メールの添付や{r:怪しいリンク}から\n入ってくる'],
    [10.5, 13.5, 'お金を払っても\n{r:戻る保証はない}'],
    [13.5, 17.0, '一番の対策は\n{g:バックアップ}'],
    [17.0, 20.0, '{g:パソコンとは別の場所}に\nデータのコピーを'],
    [20.0, 23.0, '{r:ランサムウェア}＝データの誘拐犯\n{g:バックアップ}で守ろう'],
    [23.0, 26.0, '{y:保存}して\n家族にもシェアしてね'],
  ],
});
VERSIONS.s15 = Object.assign({}, HOSTV, {
  no: '015', duration: 29, bgm: 'chip', sticker: [7.6, 10.8],
  hook: { text: 'この画面が出ても\n{y:電話しないで！}', bg: '#7a1d17' },
  point: [1],
  scenes: seq([
    [0, 1.6, 'sp_def'], [1.6, 5, 'sp_def', 1, 1.6], [5, 8, 'sp_alarm'], [8, 11, 'sp_call'], [11, 14, 'sp_fake'],
    [14, 18, 'sp_close'], [18, 21.5, 'sp_help'], [21.5, 25, 'sp_summary', 1.2], [25, 29, 'sp_cta'],
  ]),
  captions: [
    [0.0, 1.6, 'この画面が出ても電話しないで！'],
    [1.6, 5.0, 'これは{r:サポート詐欺}\nニセの警告で電話させる手口'],
    [5.0, 8.0, '大きな音や警告で\n{r:あわてさせる}のが特徴'],
    [8.0, 11.0, '電話すると{r:遠隔操作}させられたり\n{r:お金}を払わされたり'],
    [11.0, 14.0, '本物の警告じゃない\n{g:ただのWebページ}'],
    [14.0, 18.0, '{g:ブラウザを閉じれば}大丈夫\n閉じられないときは{g:再起動}'],
    [18.0, 21.5, '電話してしまったら\n{y:消費者ホットライン188}へ'],
    [21.5, 25.0, '{r:サポート詐欺}＝ニセの警告\n{g:電話しない}・{g:閉じる}'],
    [25.0, 29.0, '{y:保存}して\n家族にもシェアしてね'],
  ],
});
