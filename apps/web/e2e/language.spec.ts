import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test('should toggle language between English and Hindi', async ({ page }) => {
    // Go to home page
    await page.goto('/en');
    
    // Check initial English text
    await expect(page.locator('main')).toContainText(/Built for India/i);

    // Find the language switch button
    const langBtn = page.getByRole('button', { name: /switch language/i });
    await expect(langBtn).toBeVisible();

    // Click to switch to Hindi
    await langBtn.click();

    // Wait for the URL to change to /hi
    await expect(page).toHaveURL(/\/hi/);

    // Click back to English
    await langBtn.click();
    await expect(page).toHaveURL(/\/en/);
  });
});
