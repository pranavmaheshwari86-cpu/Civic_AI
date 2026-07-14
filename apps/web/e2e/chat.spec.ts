import { test, expect } from '@playwright/test';

test.describe('Chat Flow', () => {
  test('should be able to open chat and send a message', async ({ page }) => {
    await page.goto('/en/chat');

    // Wait for chat input
    const input = page.getByPlaceholder(/Ask Bharat AI/i);
    await expect(input).toBeVisible();

    // Type a message
    await input.fill('I want to start a small business');
    
    // Press enter or click send
    await input.press('Enter');

    // Expect a user message bubble to appear
    await expect(page.locator('text=I want to start a small business')).toBeVisible();

    // Expect an AI typing indicator or response
    // The exact text will depend on the AI, but there should be a response bubble
    // We can just verify the input is cleared
    await expect(input).toHaveValue('');
  });
});
