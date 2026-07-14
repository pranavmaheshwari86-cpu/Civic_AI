import { test, expect } from '@playwright/test';

test.describe('Home Page Verification', () => {
  test('loads correctly and has no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to the local server
    const response = await page.goto('/', { waitUntil: 'networkidle' });
    
    // Verify successful load
    expect(response?.status()).toBe(200);

    // Verify title or basic content
    await expect(page).toHaveTitle(/Civic AI|Smart Bharat/i);
    
    // Verify no console errors occurred during load
    expect(consoleErrors).toHaveLength(0);
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/home-screenshot.png', fullPage: true });
  });
});
