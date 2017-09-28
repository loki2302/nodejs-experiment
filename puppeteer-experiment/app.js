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

    await page.pdf({ path: '1.pdf', format: 'A4' });

    const { pageTitle } = await page.evaluate(() => {
        return {
            pageTitle: document.title
        };
    });
    console.log(`page title is ${pageTitle}`);

    await browser.close();
})();
