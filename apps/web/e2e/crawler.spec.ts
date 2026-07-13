import { test, expect } from '@playwright/test';

const PAGES = [
  '/en',
  '/en/dashboard',
  '/en/schemes',
  '/en/complaints',
  '/en/chat'
];

test.describe('Automated QA Crawler', () => {
  for (const pagePath of PAGES) {
    test(`Crawl ${pagePath} without errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const networkErrors: string[] = [];

      // Listen for console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
        if (pagePath === '/en/schemes') {
          console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
        }
      });

      // Listen for failed network requests
      page.on('requestfailed', request => {
        networkErrors.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
      });
      
      page.on('response', response => {
        // Ignore known external assets that might 403 or analytics, focus on local/API
        if (response.status() >= 400 && response.status() !== 401 && response.status() !== 403) {
          networkErrors.push(`HTTP ${response.status()} - ${response.url()}`);
        }
      });

      // Navigate to the page
      const response = await page.goto(`http://localhost:3001${pagePath}`, { waitUntil: 'networkidle' });
      
      // Basic assertions
      expect(response?.status()).toBeLessThan(400);

      // Wait a bit for client-side hydration/rendering errors
      await page.waitForTimeout(2000);

      // Assert zero console errors
      if (consoleErrors.length > 0) {
        console.error(`[${pagePath}] Console Errors:`, consoleErrors);
      }
      expect(consoleErrors, `Page ${pagePath} had console errors`).toHaveLength(0);

      // Assert zero network errors
      if (networkErrors.length > 0) {
        console.error(`[${pagePath}] Network Errors:`, networkErrors);
      }
      expect(networkErrors, `Page ${pagePath} had network errors`).toHaveLength(0);

      // Take screenshot for visual audit
      await page.screenshot({ path: `e2e/screenshots/${pagePath.replace(/\//g, '_')}_desktop.png`, fullPage: true });
    });
  }
});
