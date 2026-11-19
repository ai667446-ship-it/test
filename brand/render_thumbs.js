// 使い方: node render_thumbs.js [番号...] → thumbs/thumb_<番号>.png（1080x1920）
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const nos = process.argv.slice(2).length ? process.argv.slice(2) : ['001', '002', '003'];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', (e) => { console.error(e); process.exit(1); });
  await p.goto('file://' + path.resolve(__dirname, 'thumb.html'));
  await p.evaluate(() => prep());
  for (const no of nos) {
    await p.evaluate((n) => show(n), no);
    await p.screenshot({ path: path.join(__dirname, 'thumbs', `thumb_${no}.png`) });
  }
  await b.close();
})();
