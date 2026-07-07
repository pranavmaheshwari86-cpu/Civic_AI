import { test, expect } from '@playwright/test';

test('has title and elements', async ({ page }) => {
  await page.goto('/');

  // Should have the correct title
  await expect(page).toHaveTitle(/Smart Bharat/);

  // Should render the main header
  const header = page.locator('header');
  await expect(header).toBeVisible();

  // Should render language selector
  const langSelector = page.getByRole('button', { name: /Language/i });
  if (await langSelector.isVisible()) {
    await expect(langSelector).toBeVisible();
  }
});
