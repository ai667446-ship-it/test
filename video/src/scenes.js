// 「メモリとストレージ」回のシーン群。1080x1000 の舞台座標で描く。
// 各関数は lt（シーン開始からの秒）と t（全体の秒）を受け取る。

const SCENES = {
  hook(lt, t) {
    const sp = pop(lt, 0);
    let s = g(`translate(540 400) scale(${sp}) translate(-540 -400)`,
      laptop(540, 400, 1.15, hand(0, -30, '？', 150, C.blue)));
    const card = pop(lt, 0.9);
    s += g(`translate(540 800) scale(${card})`,
      rect(-330, -120, 660, 240, C.white, 24) +
      path('M-290 0 L290 0', 'none', 3) +
      marker(-140, -60, 230, 70, C.yellow) + hand(-140, -58, 'メモリ', 56) + hand(170, -58, '16GB', 60) +
      marker(-140, 60, 300, 70, '#9be3e8') + hand(-140, 62, 'ストレージ', 56) + hand(170, 62, '512GB', 60));
    for (let i = 0; i < 3; i++) {
      const q = pop(lt, 1.8 + i * 0.2);
      const y = Math.sin(t * 5 + i) * 10;
      s += g(`translate(${[150, 930, 880][i]} ${[230 + y, 180 - y, 560 + y][i]}) scale(${q}) rotate(${[-15, 12, 20][i]})`, hand(0, 0, '？', 120, [C.red, C.orange, C.purple][i]));
    }
    return s;
  },

  compare(lt, t) {
    const l = pop(lt, 0.15), r = pop(lt, 1.1);
    let s = g(`translate(270 470) scale(${l})`,
      g('translate(-190 -40)', desk(0, 0, 380, 120) +
        appWindow(40, -150, 140, 140, C.red, 'ブラウザ') + appWindow(200, -130, 140, 120, C.green, 'LINE')) +
      marker(0, 210, 260, 80, C.yellow) + hand(0, 212, 'メモリ', 64) + hand(0, 310, '＝ 作業机', 64));
    s += g(`translate(810 470) scale(${r})`,
      g('translate(-160 -330)', bookshelf(0, 0, 320, 400, 3, 1)) +
      marker(0, 210, 330, 80, '#9be3e8') + hand(0, 212, 'ストレージ', 64) + hand(0, 310, '＝ 本棚', 64));
    s += g(`translate(540 470) scale(${pop(lt, 1.8)})`, hand(0, 0, '＆', 80, C.gray));
    // スペック表での呼び名（RAM / ROM）
    if (lt > NOTE_AT) {
      s += g(`translate(270 880) scale(${pop(lt, NOTE_AT)}) rotate(-3)`, rect(-120, -45, 240, 90, '#fff3c4', 45) + hand(0, 4, 'RAM', 60));
      s += g(`translate(810 880) scale(${pop(lt, NOTE_AT + 0.3)}) rotate(3)`, rect(-120, -45, 240, 90, '#d9f4f6', 45) + hand(0, 4, 'ROM', 60));
      s += g(`translate(810 965) scale(${pop(lt, NOTE_AT + 0.8)})`, hand(0, 0, '※ ROMの本来の意味は別物', 40, '#6b5d52'));
    }
    return s;
  },

  desk(lt, t) {
    let s = g(`translate(540 90) scale(${pop(lt, 0)})`, marker(0, 0, 520, 100, C.yellow) + hand(0, 4, 'メモリ ＝ 作業机', 70));
    s += desk(90, 720, 900, 170);
    const apps = [
      [130, 470, 260, 240, C.red, 'ブラウザ'], [420, 500, 240, 210, C.green, 'LINE'],
      [690, 450, 260, 260, C.blue, '写真'], [250, 230, 250, 220, C.purple, '動画'], [560, 210, 260, 230, C.orange, '地図'],
    ];
    apps.forEach((a, i) => {
      const p = prog(lt, 0.7 + i * 0.55, 1.15 + i * 0.55);
      if (p <= 0) return;
      const dy = (1 - easeBack(p)) * -260;
      s += g(`translate(0 ${dy}) rotate(${(rnd(i) - 0.5) * 8} ${a[0] + a[2] / 2} ${a[1] + a[3] / 2})`, appWindow(...a), `opacity="${clamp(p * 3)}"`);
    });
    if (lt > 4.2) {
      const p = pop(lt, 4.2);
      s += g(`translate(540 960) scale(${p})`, path('M-400 0 L400 0 M-370 -26 L-400 0 L-370 26 M370 -26 L400 0 L370 26', 'none', 9) +
        g('translate(0 -2)', rect(-130, -42, 260, 84, C.yellow, 40) + hand(0, 2, '広い！', 54)));
    }
    return s;
  },

  shelf(lt, t) {
    let s = g(`translate(540 80) scale(${pop(lt, 0)})`, marker(0, 0, 560, 100, '#9be3e8') + hand(0, 4, 'ストレージ ＝ 本棚', 68));
    s += bookshelf(200, 170, 620, 780, 4, easeInOut(prog(lt, 0.5, 4.2)), t);
    const tags = [['写真', C.pink], ['アプリ', C.green], ['動画', C.purple], ['書類', C.yellow]];
    tags.forEach(([lb, col], i) => {
      const p = pop(lt, 1.2 + i * 0.6);
      s += g(`translate(935 ${300 + i * 185}) scale(${p}) rotate(${(i % 2 ? 6 : -6)})`,
        path('M-115 -10 L-80 0', 'none', 5) + rect(-80, -40, 170, 80, col, 40) + hand(5, 2, lb, 44));
    });
    return s;
  },

  small(lt, t) {
    let s = desk(80, 700, 380, 160);
    // 机からあふれる窓
    const apps = [[110, 500, 200, 200, C.red, 'ブラウザ'], [250, 480, 200, 220, C.blue, '写真'], [170, 330, 210, 190, C.purple, '動画']];
    apps.forEach((a, i) => {
      const p = prog(lt, 0.2 + i * 0.4, 0.6 + i * 0.4);
      if (p <= 0) return;
      const wob = lt > 1.6 ? Math.sin(t * 14 + i) * 3 : 0;
      s += g(`translate(${wob} ${(1 - easeBack(p)) * -200}) rotate(${(i - 1) * 9} ${a[0] + 100} ${a[1] + 100})`, appWindow(...a), `opacity="${clamp(p * 3)}"`);
    });
    s += bookshelf(640, 330, 340, 540, 3, 1);
    // 出し入れ（書類が行き来する）
    if (lt > 1.8) {
      const cyc = ((lt - 1.8) * 1.1) % 2;
      const go = cyc < 1 ? cyc : 2 - cyc;
      const e = easeInOut(go);
      const x = lerp(400, 700, e), y = lerp(560, 480, e) - Math.sin(e * Math.PI) * 220;
      s += g(at(x, y, 1, Math.sin(lt * 6) * 15), rect(-40, -50, 80, 100, C.white, 6, 5) + path('M-22 -20 L22 -20 M-22 0 L22 0 M-22 20 L10 20', 'none', 4));
      s += g('translate(0 0)', arrow(470, 470, 640, 420, C.red, 7) + arrow(650, 520, 480, 560, C.red, 7), `opacity="0.7"`);
    }
    if (lt > 3) {
      const p = pop(lt, 3);
      const shake = Math.sin(t * 30) * 6;
      s += g(`translate(${540 + shake} 140) scale(${p}) rotate(-4)`, rect(-230, -70, 460, 140, C.white, 30) + hand(0, 4, 'カクカク…', 76, C.red));
      s += sweat(300, 250, 1.2 * p) + sweat(820, 250, 1 * p);
    }
    return s;
  },

  power(lt, t) {
    const on = lt < 1.0;
    let s = g(`translate(540 170) scale(${pop(lt, 0) * (on ? 1 : 1 - 0.08 * Math.max(0, Math.sin((lt - 1) * 20)) * (lt < 1.3))})`, powerIcon(0, 0, 1, on));
    if (!on) s += g(`translate(680 120) scale(${pop(lt, 1)})`, rect(-30, -40, 150, 80, C.white, 20) + hand(45, 2, 'OFF', 50));
    s += desk(60, 760, 420, 150);
    const apps = [[90, 560, 180, 190, C.red, 'ブラウザ'], [280, 540, 180, 210, C.blue, '写真']];
    const vanish = prog(lt, 1.3, 1.9);
    apps.forEach((a, i) => {
      if (vanish < 1) s += g(`translate(${a[0] + 90} ${a[1] + 100}) scale(${1 - vanish}) translate(${-a[0] - 90} ${-a[1] - 100})`, appWindow(...a));
      s += poof(a[0] + 90, a[1] + 100, prog(lt, 1.3, 2.3));
    });
    s += bookshelf(600, 380, 380, 520, 3, 1);
    if (lt > 2) {
      s += sparkle(600, 380, 0.8 * pop(lt, 2)) + sparkle(980, 470, 0.6 * pop(lt, 2.2)) + sparkle(960, 880, 0.7 * pop(lt, 2.4));
    }
    s += g(`translate(270 990) scale(${pop(lt, 2.5)})`, hand(0, 0, '机 → からっぽ', 56, C.red));
    s += g(`translate(790 990) scale(${pop(lt, 3.1)})`, hand(0, 0, '本棚 → そのまま', 56, '#2f8fb0'));
    return s;
  },

  summary(lt, t) {
    let s = g(`translate(540 500) scale(${pop(lt, 0)})`,
      rect(-470, -440, 940, 900, C.white, 36) +
      marker(0, -360, 300, 100, C.yellow) + hand(0, -356, 'まとめ', 76) +
      // 1 行目
      g(`translate(-300 -150) scale(0.55)`, desk(-190, 40, 380, 100) + appWindow(-150, -100, 150, 140, C.red, 'ブラウザ') + appWindow(20, -90, 140, 130, C.green, 'LINE')) +
      hand(-120, -200, 'メモリ（机）', 60, INK, 'start') +
      hand(-120, -110, '広いほど サクサク', 54, '#c4553f', 'start') +
      path('M-420 0 L420 0', 'none', 3) +
      // 2 行目
      g(`translate(-300 170) scale(0.42)`, bookshelf(-170, -230, 340, 460, 3, 1)) +
      hand(-120, 120, 'ストレージ（本棚）', 60, INK, 'start') +
      hand(-120, 210, '大きいほど たくさん保存', 54, '#2f8fb0', 'start') +
      path('M-420 300 L420 300', 'none', 3) +
      hand(0, 375, 'ふだん使いの目安：メモリ16GB〜', 44, '#6b5d52'));
    return s;
  },

  // いいね＆保存のお願い（途中に挟む）
  save(lt, t) {
    const heart = 'M0 40 C-80 -10 -70 -90 0 -50 C70 -90 80 -10 0 40 Z';
    const mark = 'M-48 -70 L48 -70 L48 70 L0 35 L-48 70 Z';
    const tapH = 1.0, tapS = 2.0;
    const hOn = lt > tapH, sOn = lt > tapS;
    const beat = (on, at0) => on ? 1 + 0.25 * Math.sin(prog(lt, at0, at0 + 0.35) * Math.PI) : 1;
    let s = g(`translate(540 150) scale(${pop(lt, 0)}) rotate(-2)`, marker(0, 0, 640, 110, C.pink) + hand(0, 4, 'あとで見返せる！', 72));
    s += g(`translate(310 470) scale(${pop(lt, 0.15) * 2.3 * beat(hOn, tapH)})`, path(heart, hOn ? C.red : C.white, 4));
    s += g(`translate(770 470) scale(${pop(lt, 0.4) * 2.1 * beat(sOn, tapS)})`, path(mark, sOn ? C.yellow : C.white, 4));
    s += g(`translate(310 740) scale(${pop(lt, 0.3)})`, hand(0, 0, 'いいね', 72, hOn ? C.red : INK));
    s += g(`translate(770 740) scale(${pop(lt, 0.55)})`, hand(0, 0, '保存', 72, sOn ? '#c99a12' : INK));
    if (hOn) s += sparkle(170, 330, 0.7 * pop(lt, tapH)) + sparkle(450, 360, 0.5 * pop(lt, tapH + 0.1));
    if (sOn) s += sparkle(640, 330, 0.6 * pop(lt, tapS)) + sparkle(910, 360, 0.7 * pop(lt, tapS + 0.1));
    // タップする手（素材画像は HTML 側で重ねる。ここでは位置だけ決める）
    if (lt > 0.5 && lt < 3.2) {
      const enter = easeOut(prog(lt, 0.5, 0.9));
      const x = lt < 1.5 ? lerp(520, 310, enter) : lerp(310, 770, easeInOut(prog(lt, 1.3, 1.85)));
      const yBase = lt < 1.5 ? lerp(780, 500, enter) : 500;
      const press = (a) => Math.max(0, 1 - Math.abs(lt - a) / 0.15);
      const pr = Math.max(press(tapH), press(tapS));
      HAND = { x, y: yBase + pr * 18, s: 0.42 * (1 - pr * 0.08), rot: -8,
        opacity: clamp(prog(lt, 0.5, 0.7)) * (1 - prog(lt, 2.9, 3.2)),
        marks: (lt > tapH && lt < tapH + 0.45) || (lt > tapS && lt < tapS + 0.45) };
    }
    return s;
  },

  cta(lt, t) {
    let s = g(`translate(540 330) scale(${pop(lt, 0)}) rotate(-3)`,
      hand(0, -60, 'フォローして', 96, INK) + hand(0, 70, '用語をスッキリ！', 110, C.red));
    s += g(`translate(540 720) scale(${pop(lt, 0.6)})`,
      rect(-380, -130, 760, 260, C.white, 30) +
      rect(-340, -165, 180, 70, C.blue, 35) + hand(-250, -128, '次回', 46, C.white) +
      hand(0, 20, 'キャッシュってなに？', 70));
    s += sparkle(170, 200, 0.8 * pop(lt, 0.9)) + sparkle(920, 470, 0.6 * pop(lt, 1.1));
    return s;
  },
};
