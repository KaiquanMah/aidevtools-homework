import { test, expect } from '@playwright/test';

test('smoke test - can load home page', async ({ page }) => {
    const url = process.env.BASE_URL || 'http://localhost:3000';
    console.log(`Navigating to ${url}`);
    try {
        const response = await page.goto('/', { timeout: 10000 });
        console.log(`Response status: ${response?.status()}`);
        console.log('Page title:', await page.title());
        await expect(page).toHaveTitle(/.*Finnish.*/i);
    } catch (e) {
        console.error('Page load failed:', e);
        const content = await page.content();
        console.log('Page content snippet:', content.substring(0, 500));
        throw e;
    }
});
