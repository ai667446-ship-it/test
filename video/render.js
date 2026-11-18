// 使い方: node render.js <a|b> <出力.mp4> [fps] [--stills 1,5,10]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const [v, out, fpsArg] = process.argv.slice(2);
  const fps = Number(fpsArg || 30);
  const stillsIdx = process.argv.indexOf('--stills');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => { console.error('PAGE ERROR', e); process.exit(1); });
  await page.goto('file://' + path.resolve(__dirname, 'src/index.html') + '?v=' + v);
  const n = await page.evaluate(() => prepareFonts());
  console.error('fonts loaded:', n);
  const meta = await page.evaluate(() => meta());
  fs.writeFileSync(out.replace(/\.mp4$/, '') + '.meta.json', JSON.stringify(meta));

  if (stillsIdx > 0) {
    for (const s of process.argv[stillsIdx + 1].split(',').map(Number)) {
      await page.evaluate((t) => draw(t), s);
      await page.screenshot({ path: out.replace(/\.mp4$/, '') + `_t${s}.png` });
    }
    await browser.close();
    return;
  }

  const total = Math.round(meta.duration * fps);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => draw(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.error(`${v}: ${i}/${total}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await browser.close();
  console.error('done', out);
})();
