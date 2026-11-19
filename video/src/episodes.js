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
      hand(-200, y - 38, label, 54, INK, 'start') + hand(-200, y + 40, desc, 48, col, 'start');
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
    hand(0, 20, nextTitle, 70));
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
    return s + qMarks(lt, t, 2.2);
  },
  k_def(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 640, 100, '#ffc9d8') + hand(0, 4, 'Cookie ＝ 会員カード', 66));
    s += g(`translate(540 540) scale(${pop(lt, 0.4) * 2.3}) rotate(-6)`, card(0, 0, 1, 0, C.orange, '会員カード'));
    s += g(`translate(820 300) scale(${pop(lt, 1.2)}) rotate(8)`, rect(-130, -50, 260, 100, C.white, 24) + hand(0, 4, '小さなメモ', 46));
    s += g(`translate(540 880) scale(${pop(lt, 2.4)})`, hand(0, 0, 'サイトがブラウザに預ける', 50, '#6b5d52'));
    return s;
  },
  k_card(lt, t) {
    let s = shop(270, 560, 1.15, 'サイト') + phoneBig(820, 600, 0.85, hand(0, -150, 'ブラウザ', 34, '#6b5d52'));
    // 1 回目: カードを渡す
    const p1 = easeInOut(prog(lt, 0.6, 1.8));
    if (lt < 3.6) {
      s += card(lerp(330, 820, p1), lerp(500, 620, p1) - Math.sin(p1 * Math.PI) * 160, 0.9, (1 - p1) * -20);
      if (lt < 1.2) s += g(`translate(330 260) scale(${pop(lt, 0.2)})`, bubble(0, 0, 1, 'はじめまして！', 400));
    } else {
      // 2 回目: カードを見せる → おかえりなさい
      const p2 = easeOut(prog(lt, 3.6, 4.3));
      s += card(lerp(820, 600, p2), lerp(620, 520, p2), 0.95, -6);
      s += g(`translate(330 250) scale(${pop(lt, 4.4)})`, bubble(0, 0, 1, 'おかえりなさい！', 440));
      s += sparkle(560, 420, 0.7 * pop(lt, 4.6));
    }
    s += g(`translate(540 960) scale(${pop(lt, lt < 3.6 ? 0.2 : 3.6)})`, hand(0, 0, lt < 3.6 ? '1回目' : '2回目', 54, '#2f8fb0'));
    return s;
  },
  k_benefit(lt, t) {
    let s = phoneBig(300, 540, 1.1,
      rect(-85, -170, 170, 60, C.blue, 30, 4) + hand(0, -138, 'ログイン中', 30, C.white) +
      circle(0, -40, 46, C.skin, 5) + path('M-70 70 Q0 10 70 70', C.blue, 5) + hand(0, 130, 'こんにちは！', 30));
    s += g(`translate(300 120) scale(${pop(lt, 0.4)})`, check(-150, 0, 1) + hand(40, 4, 'ログインしたまま', 50));
    if (lt > 3.3) {
      s += g(`translate(790 560) scale(${pop(lt, 3.5)})`,
        path('M-150 -90 L-110 -90 L-70 60 L120 60 L150 -50 L-90 -50', C.white, 9) + circle(-50, 110, 22, C.white, 7) + circle(100, 110, 22, C.white, 7) +
        rect(-60, -110, 70, 60, C.red, 8, 5) + rect(20, -100, 80, 50, C.yellow, 8, 5) + rect(-20, -150, 60, 50, C.green, 8, 5));
      s += g(`translate(790 860) scale(${pop(lt, 3.9)})`, check(-200, 0, 1) + hand(30, 4, 'カートもそのまま', 50));
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
    let s = g(`translate(540 520) scale(${pop(lt, 0)})`,
      rect(-430, -420, 860, 840, C.white, 30) + hand(0, -350, 'Cookieの設定', 60) + path('M-380 -300 L380 -300', 'none', 3) +
      hand(-370, -200, '必須（サイトの動作）', 46, INK, 'start') + toggle(290, -200, true, true) +
      hand(-370, -60, '分析', 46, INK, 'start') + toggle(290, -60, !off) +
      hand(-370, 80, '広告', 46, INK, 'start') + toggle(290, 80, lt < 0.9) +
      rect(-300, 220, 600, 100, C.blue, 50, 6) + hand(0, 272, '選んだものを許可', 46, C.white));
    if (lt > 0.9) s += g(`translate(830 535) scale(${pop(lt, 0.9)}) rotate(-4)`, hand(0, 0, 'オフ！', 46, C.red));
    if (lt > 4.2) s += g(`translate(540 985) scale(${pop(lt, 4.2)})`, check(-300, 0, 0.9) + hand(20, 4, 'サイトはふつうに使える', 46, '#2f8f4e'));
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
