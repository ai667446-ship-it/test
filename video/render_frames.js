// 再開できるコマ書き出し: node render_frames.js <a|b> <出力フォルダ> [fps] [最大秒数]
// 既にあるコマは飛ばす。最大秒数を超えたら途中でも終了（もう一度実行すると続きから）。
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const [v, dir, fpsArg, budgetArg, warpPath] = process.argv.slice(2);
  const fps = Number(fpsArg || 30), budget = Number(budgetArg || 240) * 1000, t0 = Date.now();
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.resolve(__dirname, 'src/index.html') + '?v=' + v);
  await page.evaluate(() => prepareFonts());
  const meta = await page.evaluate(() => meta());
  if (warpPath) {
    const wj = JSON.parse(fs.readFileSync(warpPath, 'utf8'));
    await page.evaluate((w) => { window.WARP = w.warp; window.VOICE = w.clips; }, wj);
    meta.warp = wj.warp; meta.voice = wj.clips; meta.duration = wj.duration;
  }
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta));
  const total = Math.round(meta.duration * fps);
  let done = 0;
  for (let i = 0; i < total; i++) {
    const f = path.join(dir, `f${String(i).padStart(5, '0')}.jpg`);
    if (fs.existsSync(f)) { done++; continue; }
    if (Date.now() - t0 > budget) break;
    await page.evaluate((t) => draw(t), i / fps);
    fs.writeFileSync(f + '.tmp', await page.screenshot({ type: 'jpeg', quality: 95 }));
    fs.renameSync(f + '.tmp', f);
    done++;
  }
  await browser.close();
  console.log(`${done}/${total}`);
})();
