import { test, expect } from '@playwright/test';

test.describe('Schemes Discovery Page', () => {
  test('should load the schemes discovery page and show core UI elements', async ({ page }) => {
    // Navigate to the localized schemes page
    await page.goto('/en/schemes');

    // Wait for the hero section to load
    await expect(page.locator('h2', { hasText: 'Discover Your Benefits' })).toBeVisible();
    
    // Check search input placeholder
    await expect(page.getByPlaceholder('Tell me what you need... (e.g., \'Looking for a business loan\')')).toBeVisible();

    // Verify Category Pills exist
    await expect(page.locator('button', { hasText: 'All Categories' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Health & Wellness' })).toBeVisible();
  });

  test('should allow searching for schemes', async ({ page }) => {
    await page.goto('/en/schemes');

    // Find the search input and type a query
    const searchInput = page.getByPlaceholder('Tell me what you need...');
    await searchInput.fill('Healthcare');

    // Wait for debounce and API call (mocking or relying on actual API structure)
    // Here we just verify that the input registered the state
    await expect(searchInput).toHaveValue('Healthcare');
    
    // There should be a "Recommended for You" section
    await expect(page.locator('h3', { hasText: 'Recommended for You' })).toBeVisible();
  });
});
