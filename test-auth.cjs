const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:5174/drafts', { waitUntil: 'networkidle2' });
  
  await page.type('input[type="password"]', 'BOS@Drafts2026');
  await page.click('button');
  
  await page.waitForTimeout(2000);
  
  const content = await page.content();
  console.log("BODY length:", content.length);
  await browser.close();
  console.log("Done");
})();
