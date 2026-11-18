// 使い方: node render_icons.js → out/icon_<案>.png（1024x1024）
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1024, height: 1024 } });
  await p.goto('file://' + path.resolve(__dirname, 'icon.html'));
  await p.evaluate(() => prep());
  for (const k of ['cover', 'popup', 'lens']) {
    await p.evaluate((k) => show(k), k);
    await p.screenshot({ path: path.join(__dirname, 'out', `icon_${k}.png`) });
  }
  await b.close();
})();
