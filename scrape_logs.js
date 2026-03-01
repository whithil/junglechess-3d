const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
    page.on('pageerror', error => console.error('BROWSER_ERROR:', error.message));

    // Open local file using file://
    const filePath = 'file:///' + path.resolve('d:/ericc/OneDrive/Documentos/work/hobbies/games/junglechess-3d/index.html').replace(/\\/g, '/');
    console.log(`Navigating to ${filePath}`);
    await page.goto(filePath);

    // Wait a bit for game to initialize
    await page.waitForTimeout(2000);

    // Try to start game
    console.log("Starting game...");
    try {
        await page.evaluate(() => {
            const btn = document.querySelector('button[data-action="start_game_cpu"]');
            if (btn) btn.click();
            else console.log("Start button not found in standard DOM (could be Canvas)");
        });

        await page.waitForTimeout(1000);

        // Emulate a click on a canvas roughly where a piece might be
        console.log("Clicking canvas...");
        await page.mouse.click(300, 300);
        await page.waitForTimeout(500);
    } catch (e) {
        console.error("Evaluation error:", e);
    }

    await browser.close();
})();
