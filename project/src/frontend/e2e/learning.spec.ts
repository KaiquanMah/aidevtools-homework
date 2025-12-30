import { test, expect } from '@playwright/test';

test.describe('Learning Journey', () => {
    const testUser = {
        username: `learner_${Math.floor(Math.random() * 10000)}`,
        password: 'testpassword123'
    };

    test.beforeEach(async ({ page }) => {
        // Capture browser console logs
        page.on('console', msg => {
            console.log(`BROWSER [${msg.type()}]: ${msg.text()}`);
        });

        // Capture failed requests
        page.on('requestfailed', request => {
            console.log(`BROWSER REQUEST FAILED: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
        });

        console.log('--- Registering test user ---');
        await page.goto('/register');
        console.log('Navigated to /register');

        await page.fill('input[placeholder="Username"]', testUser.username);
        await page.fill('input[placeholder="Password"]', testUser.password);

        console.log('Clicking Register');
        await page.click('button:has-text("Register")');

        try {
            await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
            console.log('Redirected to login!');
        } catch (e) {
            console.error('Registration/Redirect to login failed.');
            console.error('Current URL:', page.url());

            // Check for error message on page
            const errorMsg = await page.locator('p.text-red-500').textContent().catch(() => 'No error message found');
            console.error('Visible error message:', errorMsg);

            await page.screenshot({ path: '/app/test-results/failed-registration.png' });
            throw e;
        }

        console.log('Logging in...');
        await page.fill('input[placeholder="Username"]', testUser.username);
        await page.fill('input[placeholder="Password"]', testUser.password);
        await page.click('button:has-text("Sign in")');

        try {
            await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
            console.log('Logged in to dashboard!');
        } catch (e) {
            console.error('Login/Redirect to dashboard failed.');
            console.error('Current URL:', page.url());
            await page.screenshot({ path: '/app/test-results/failed-login.png' });
            throw e;
        }
    });

    test('should navigate curriculum and complete a dynamic quiz', async ({ page }) => {
        console.log('Starting Learning Journey test');

        // 1. Navigate to Level 0
        console.log('Navigating to Level 0');
        const level0Card = page.locator('div.bg-white', { hasText: 'Level 0' });
        await level0Card.locator('text=Start Learning').click();
        await expect(page).toHaveURL(/.*learn\/\d+/, { timeout: 10000 });

        // 2. Select first lesson
        console.log('Selecting first lesson');
        await page.click('text=#1', { timeout: 10000 });
        await expect(page).toHaveURL(/.*learn\/\d+\/\d+/, { timeout: 10000 });

        // 3. Start Quiz
        const startQuizBtn = page.locator('button:has-text("Start Quiz")');
        await expect(startQuizBtn).toBeVisible();
        await startQuizBtn.click();

        // 4. Dynamically complete the quiz
        let hasNextSet = true;
        let setCounter = 1;

        while (hasNextSet) {
            console.log(`Answering questions in Set ${setCounter}`);

            // Find all questions in the current set - use more specific selector
            const questions = page.locator('div.border.rounded-lg', { has: page.locator('p.font-semibold') });
            const count = await questions.count();
            console.log(`Found ${count} questions in this set`);

            for (let i = 0; i < count; i++) {
                const container = questions.nth(i);
                // If not already answered
                const isAnswered = await container.locator('.bg-green-100, .bg-red-100').count() > 0;
                if (!isAnswered) {
                    const firstOption = container.locator('div.cursor-pointer').first();
                    await firstOption.click();
                    await page.waitForTimeout(100); // Small pause for UI
                }
            }

            // Check if we need to go to the next set
            const nextSetBtn = page.locator('button:has-text("Next Set")');
            if (await nextSetBtn.isVisible() && !await nextSetBtn.isDisabled()) {
                console.log('Clicking Next Set');
                await nextSetBtn.click();
                setCounter++;
                await page.waitForTimeout(500);
            } else {
                hasNextSet = false;
            }
        }

        // 5. Finish Quiz
        const finishBtn = page.locator('button:has-text("Finish Quiz")');
        await expect(finishBtn).toBeVisible();
        await expect(finishBtn).toBeEnabled({ timeout: 10000 });
        await finishBtn.click();

        // 6. Verify completion
        await expect(page.locator('h2')).toContainText(/(Passed|Try Again)/);
        console.log('Quiz finished. Result visible.');

        // 7. Verify DB persistence (Reload and check badge)
        console.log('Returning to Level');
        await page.click('a:has-text("Return to Level")');
        await expect(page).toHaveURL(/.*learn\/\d+/);

        // If we passed, we should see the Completed badge. 
        const completionBadge = page.locator('text=Completed');
        const passed = await page.locator('text=Passed').count() > 0;

        if (passed) {
            await expect(completionBadge).toBeVisible();
            console.log('Persistence verified: Completed badge found.');
        } else {
            console.log('Did not pass (clicked first option), skip badge verification.');
        }
    });
});
