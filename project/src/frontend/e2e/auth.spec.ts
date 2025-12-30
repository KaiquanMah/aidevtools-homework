import { test, expect } from '@playwright/test';

console.log('Loading auth.spec.ts');
console.log('BASE_URL environment variable:', process.env.BASE_URL);

test.describe('Authentication', () => {
    test.describe.configure({ mode: 'serial' });
    const testUser = {
        username: `user_${Math.floor(Math.random() * 10000)}`,
        password: 'testpassword123'
    };

    test('should register a new user and redirect to login', async ({ page }) => {
        await page.goto('/register');

        await page.fill('input[placeholder="Username"]', testUser.username);
        await page.fill('input[placeholder="Password"]', testUser.password);

        await page.click('button:has-text("Register")');

        // Should redirect to login after successful registration
        await expect(page).toHaveURL(/.*login/);
    });

    test('should login with existing user', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[placeholder="Username"]', testUser.username);
        await page.fill('input[placeholder="Password"]', testUser.password);

        await page.click('button:has-text("Sign in")');

        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should show error for invalid credentials', async ({ page }) => {
        console.log('Test: invalid credentials started');
        await page.goto('/login');
        console.log('Navigated to /login');

        await page.fill('input[placeholder="Username"]', 'nonexistentuser');
        await page.fill('input[placeholder="Password"]', 'wrongpassword');

        console.log('Clicking sign in');
        await page.click('button:has-text("Sign in")');

        try {
            console.log('Expecting error message...');
            await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 15000 });
            console.log('Error message visible!');
        } catch (e) {
            console.error('Invalid credentials test failed. Current URL:', page.url());
            await page.screenshot({ path: '/app/test-results/failure-invalid-credentials.png' });
            throw e;
        }
    });

    test('should redirect to login when accessing protected route unauthenticated', async ({ page }) => {
        console.log('Test: protected route started');
        // Clear localStorage and session storage to ensure we are unauthenticated
        await page.goto('/');
        console.log('Navigated to / for clearing state');
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        // Also clear cookies if any
        await page.context().clearCookies();

        console.log('Navigating to protected /dashboard');
        await page.goto('/dashboard');
        console.log('Navigated to /dashboard');

        try {
            console.log('Expecting redirect to login...');
            await expect(page).toHaveURL(/.*login/, { timeout: 20000 });
            console.log('Redirect successful!');
        } catch (e) {
            console.error('Protected route redirect failed. Current URL:', page.url());
            await page.screenshot({ path: '/app/test-results/failure-protected-redirect.png' });
            throw e;
        }
    });
});
