const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({
        width: 1024,
        height: 2000
    });
    await page.goto('http://retask.me');
    await page.screenshot({ path: '1.png' });
    await browser.close();
})();
