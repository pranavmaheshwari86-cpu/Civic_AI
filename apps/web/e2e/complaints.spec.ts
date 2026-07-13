import { test, expect } from '@playwright/test';

test.describe('Complaint Flow', () => {
  test('should load complaint tracking and filing options', async ({ page }) => {
    await page.goto('/en/complaints');
    
    // Verify main components are visible
    await expect(page.locator('h1', { hasText: /Report an Issue/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /File Complaint/i })).toBeVisible();
  });
});