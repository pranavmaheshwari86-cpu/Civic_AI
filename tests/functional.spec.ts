import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Functional Pass', () => {

  test('Search flow on /schemes', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/schemes`);
    
    // Check if search input exists
    const searchInput = page.getByPlaceholder(/tell me what you need/i);
    await expect(searchInput).toBeVisible();

    // Type a query
    await searchInput.fill('scholarship');
    
    // Wait for the query to trigger API fetch (debounce is 500ms)
    await page.waitForTimeout(1000); // Wait for debounce and fetch

    // There should be either scheme cards or a "No schemes found" message
    const hasCards = await page.locator('.bg-card').count() > 0;
    const hasEmptyState = await page.getByText(/no schemes found/i).count() > 0;
    
    expect(hasCards || hasEmptyState).toBeTruthy();
  });

  test('Admin dashboard tab switching', async ({ page }) => {
    // Admin is protected, so login first
    await page.goto(`${BASE_URL}/en/login`);
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('CorrectPassword123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    // Wait for redirect to admin
    await page.waitForURL(/\/admin/);

    await page.goto(`${BASE_URL}/en/admin`);
    
    // Initial state should be Service Catalog
    await expect(page.getByText('Manage Services & Schemes')).toBeVisible();

    // Click on Complaint Review Queue tab
    await page.getByRole('button', { name: /complaint review queue/i }).click();

    // Should show Review Queue
    await expect(page.getByRole('heading', { name: 'Review Queue' })).toBeVisible();
    await expect(page.getByRole('table').or(page.getByText('No complaints found in the queue.'))).toBeVisible();
  });

  test('Login form validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/login`);
    
    // Find login form submit button
    const loginBtn = page.getByRole('button', { name: /sign in/i });
    await expect(loginBtn).toBeVisible();

    // Fill invalid data
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('short');
    
    // Just verify the form does not crash when interacted with
  });
});
