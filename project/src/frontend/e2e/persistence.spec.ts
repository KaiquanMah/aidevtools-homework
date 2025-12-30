import { test, expect } from '@playwright/test';

test.describe('Database Sync Integrity', () => {
    const testUser = {
        username: `sync_user_${Math.floor(Math.random() * 10000)}`,
        password: 'testpassword123'
    };

    test.beforeEach(async ({ page }) => {
        // Capture browser console logs
        page.on('console', msg => {
            console.log(`BROWSER [${msg.type()}]: ${msg.text()}`);
        });

        console.log('--- Registering sync user ---');
        await page.goto('/register');
        await page.fill('input[placeholder="Username"]', testUser.username);
        await page.fill('input[placeholder="Password"]', testUser.password);
        await page.click('button:has-text("Register")');
        await expect(page).toHaveURL(/.*login/, { timeout: 10000 });

        console.log('Logging in...');
        await page.fill('input[placeholder="Username"]', testUser.username);
        await page.fill('input[placeholder="Password"]', testUser.password);
        await page.click('button:has-text("Sign in")');
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    });

    test('should save progress and persist after reload', async ({ page }) => {
        console.log('Starting Persistence test');

        // 1. Navigate to Level 0
        const level0Card = page.locator('div.bg-white', { hasText: 'Level 0' });
        await level0Card.locator('text=Start Learning').click();
        await expect(page).toHaveURL(/.*learn\/\d+/);

        // 2. Select "Numbers 1-10 & Colors" lesson (#3)
        console.log('Selecting Numbers lesson');
        await page.click('text=#3');
        await expect(page).toHaveURL(/.*learn\/\d+\/\d+/);
        await expect(page.locator('h1')).toContainText('Numbers 1-10 & Colors');

        // 3. Start Quiz
        const startQuizBtn = page.locator('button:has-text("Start Quiz")');
        await expect(startQuizBtn).toBeVisible();
        await startQuizBtn.click();

        // 4. Complete the quiz correctly
        console.log('Answering questions correctly');

        // Map of questions to correct answers for "Numbers 1-10 & Colors"
        const correctAnswers = {
            "What is '5' in Finnish?": "viisi",
            "Solve: kaksi + kaksi = ?": "neljä",
            "What number is 'kolme'?": "3",
            "What color is 'Sininen'?": "Blue"
        };

        const questions = page.locator('div.border.rounded-lg', { has: page.locator('p.font-semibold') });
        const count = await questions.count();
        console.log(`Found ${count} questions`);

        for (let i = 0; i < count; i++) {
            const container = questions.nth(i);
            const questionText = (await container.locator('p.font-semibold').textContent()) || "";

            // Clean question text (remove numbering like "1. ")
            const cleanQuestion = questionText.replace(/^\d+\.\s*/, "").trim();
            const answer = correctAnswers[cleanQuestion as keyof typeof correctAnswers];

            if (answer) {
                console.log(`Question: "${cleanQuestion}" -> Answering: "${answer}"`);
                await container.locator(`div.cursor-pointer:has-text("${answer}")`).first().click();
                await page.waitForTimeout(100);
            } else {
                console.warn(`Unknown question: "${cleanQuestion}", picking first option`);
                await container.locator('div.cursor-pointer').first().click();
            }
        }

        // 5. Finish Quiz
        const finishBtn = page.locator('button:has-text("Finish Quiz")');
        await expect(finishBtn).toBeEnabled({ timeout: 5000 });
        await finishBtn.click();

        // 6. Verify "Passed" screen
        // Depending on actual text, could be "Passed" or something else
        await expect(page.locator('h2')).toContainText(/(Passed|Passed!)/, { timeout: 10000 });
        console.log('Quiz Passed!');

        // 7. Return to Level and verify "Completed" badge
        await page.click('a:has-text("Return to Level")');
        await expect(page).toHaveURL(/.*learn\/\d+/);

        // Selector for badge in LevelClient.tsx: {lesson.is_completed && (<span className="text-green-600 font-bold">✓ Completed</span>)}
        const completionBadge = page.locator('span.text-green-600', { hasText: 'Completed' });
        await expect(completionBadge).toBeVisible({ timeout: 10000 });
        console.log('Initial persistence verified: Completed badge visible.');

        // 8. Reload page and verify badge still exists
        console.log('Reloading page to verify DB persistence');
        await page.reload();
        await expect(completionBadge).toBeVisible({ timeout: 10000 });
        console.log('DB persistence verified: Completed badge still visible after reload.');
    });
});
