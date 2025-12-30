import { test, expect } from '@playwright/test';

test.describe('Speech Practice', () => {
    const testUser = {
        username: `speaker_${Math.floor(Math.random() * 10000)}`,
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

        // Mock SpeechRecognition API
        await page.addInitScript(() => {
            class MockSpeechRecognition extends EventTarget {
                lang = 'en-US';
                continuous = false;
                interimResults = false;
                maxAlternatives = 1;

                private _isStarted = false;

                start() {
                    if (this._isStarted) return;
                    this._isStarted = true;
                    console.log('MockSpeechRecognition: start() called');

                    // Trigger onstart
                    setTimeout(() => {
                        if (typeof (this as any).onstart === 'function') {
                            (this as any).onstart();
                        }
                        this.dispatchEvent(new Event('start'));
                    }, 50);

                    // Simulate a result after a delay
                    setTimeout(() => {
                        this.simulateResult('kissa');
                    }, 500);
                }

                stop() {
                    if (!this._isStarted) return;
                    this._isStarted = false;
                    console.log('MockSpeechRecognition: stop() called');
                    setTimeout(() => {
                        if (typeof (this as any).onend === 'function') {
                            (this as any).onend();
                        }
                        this.dispatchEvent(new Event('end'));
                    }, 50);
                }

                simulateResult(transcript: string) {
                    console.log(`MockSpeechRecognition: simulating result: ${transcript}`);
                    const event = {
                        results: [
                            {
                                isFinal: true,
                                0: { transcript, confidence: 0.95 },
                                length: 1
                            }
                        ],
                        resultIndex: 0
                    };

                    if (typeof (this as any).onresult === 'function') {
                        (this as any).onresult(event);
                    }
                    this.dispatchEvent(new CustomEvent('result', { detail: event }));

                    // After result, it usually ends
                    this.stop();
                }
            }

            // @ts-ignore
            window.SpeechRecognition = MockSpeechRecognition;
            // @ts-ignore
            window.webkitSpeechRecognition = MockSpeechRecognition;
            console.log('SpeechRecognition API mocked');
        });

        console.log('--- Registering test user ---');
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

    test('should practice speaking and get graded', async ({ page }) => {
        console.log('Starting Speech Practice test');

        // 1. Navigate to Level 0
        const level0Card = page.locator('div.bg-white', { hasText: 'Level 0' });
        await level0Card.locator('text=Start Learning').click();
        await expect(page).toHaveURL(/.*learn\/\d+/);

        // 2. Select first lesson
        await page.click('text=#1');
        await expect(page).toHaveURL(/.*learn\/\d+\/\d+/);

        // 3. Start Speech Practice
        const speechBtn = page.locator('button:has-text("Practice Speaking")');
        await expect(speechBtn).toBeVisible();
        await speechBtn.click();

        // 4. Verify current word is displayed
        console.log('Verifying word display');
        await expect(page.locator('p.text-4xl')).toContainText('kissa');

        // 5. Start Speaking (triggers mocked recognition)
        console.log('Triggering speech recognition');
        await page.click('button:has-text("Start Speaking")');

        // 6. Verify result display
        console.log('Waiting for grading results...');
        // The mock automatically returns 'kissa' which should result in a high score/Passed
        await expect(page.locator('text=Results')).toBeVisible({ timeout: 15000 });

        const scoreDisplay = page.locator('span.text-3xl.font-bold');
        await expect(scoreDisplay).toBeVisible();
        const scoreText = await scoreDisplay.textContent();
        console.log(`Speech graded! Score: ${scoreText}`);

        // 7. Verify feedback visibility
        await expect(page.locator('text=Feedback:')).toBeVisible();

        console.log('Speech practice test completed successfully');
    });
});
