import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Critical User Journeys (CUJ)', () => {

  test('CUJ 1: Citizen files a civic complaint', async ({ page }) => {
    // 1. Navigate to the complaints page
    await page.goto(`${BASE_URL}/en/complaints`);
    
    // 2. Verify we are on the complaints page
    await expect(page.getByRole('heading', { name: 'Report an Issue' })).toBeVisible();

    // 3. Fill out the complaint form
    await page.getByRole('combobox').selectOption('road_infrastructure');
    await page.getByPlaceholder(/describe the issue/i).fill('There is a large pothole on Main St. that needs urgent repair.');

    // 4. Submit the complaint
    await page.getByRole('button', { name: /file complaint/i }).click();

    // 5. Verify success screen and tracking ID
    await expect(page.getByRole('heading', { name: 'Complaint Filed Successfully' })).toBeVisible();
    await expect(page.getByText('Your Tracking ID')).toBeVisible();
    
    // Check if the tracking ID is displayed (it's inside a <p> tag with text-2xl class)
    // We can just check that a tracking ID format exists or there's a button to file another
    await expect(page.getByRole('button', { name: /file another complaint/i })).toBeVisible();
  });

  test('CUJ 2: Citizen asks the AI Assistant for help', async ({ page }) => {
    // 1. Navigate to the chat page
    await page.goto(`${BASE_URL}/en/chat`);

    // 2. Verify initial UI
    await expect(page.getByRole('heading', { name: /Namaste! I am Bharat AI/i })).toBeVisible();

    // 3. Click one of the suggested prompts to populate input and send
    await page.getByRole('button', { name: /Healthcare Find Ayushman Bharat/i }).click();
    
    // Submit the form by clicking the send button (which is type="submit")
    // Note: Since the send button is just an SVG, it's safer to locate it via type="submit" or the form
    await page.locator('button[type="submit"]').click();

    // 4. Verify user message appears in chat
    await expect(page.getByText('Find healthcare schemes')).toBeVisible();

    // 5. Verify assistant starts responding or shows a response
    // Wait for the "Thinking..." or response to show up
    // The response is a mock in the test env, but we just verify the role="assistant" message is appended.
    // We expect at least one message from assistant or an error fallback
    await page.waitForTimeout(2000); // Wait for the stream to process
    
    // Check if there's any response bubble (we can't know exact text, but the bubble structure exists)
    // The assistant's text is placed in a div, let's just check if there's any text other than our prompt.
    // We can verify there's a Bot icon
    const botIcons = page.locator('.w-8.h-8.rounded-full.bg-primary\\/10 .text-primary');
    await expect(botIcons).not.toHaveCount(0);
  });
  test('CUJ 3: Official reviews and updates the status of a complaint', async ({ page }) => {
    const uniqueDesc = `Water leak ${Date.now()}`;
    // 1. File a complaint so there's one to review
    await page.goto(`${BASE_URL}/en/complaints`);
    await page.getByRole('combobox').selectOption('water_supply');
    await page.getByPlaceholder(/describe the issue/i).fill(uniqueDesc);
    await page.getByRole('button', { name: /file complaint/i }).click();
    await expect(page.getByRole('heading', { name: 'Complaint Filed Successfully' })).toBeVisible();

    // 2. Login as admin
    await page.goto(`${BASE_URL}/en/login`);
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('CorrectPassword123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for redirect to admin
    await page.waitForURL(/\/admin/);

    // 3. Verify Admin Dashboard and click Complaints tab
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
    await page.getByRole('button', { name: /complaint review queue/i }).click();

    // 4. Find the complaint and resolve it
    // Wait for the table to load
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText(uniqueDesc).first()).toBeVisible();

    // Click the first check circle button (resolve)
    // We'll target the row that contains the unique description
    const row = page.locator('tr', { hasText: uniqueDesc }).first();
    const resolveButton = row.getByRole('button', { name: /mark as resolved/i });
    
    await expect(resolveButton).toBeVisible();
    await resolveButton.click();

    // 5. Verify status changed to resolved
    // Since the mutation invalidates queries, the row should update and the button should disappear
    await expect(resolveButton).not.toBeVisible();
    await expect(row.getByText('resolved')).toBeVisible();
  });

});
