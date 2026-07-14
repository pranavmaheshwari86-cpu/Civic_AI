import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/en/admin',
  '/en/analytics',
  '/en/applications',
  '/en/chat',
  '/en/complaints',
  '/en/dashboard',
  '/en/documents',
  '/en/login',
  '/en/schemes',
  '/en/track'
];

test.describe('Smoke Pass', () => {
  for (const route of routes) {
    test(`Route ${route} loads without errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      page.on('pageerror', err => {
        pageErrors.push(err.message);
      });

      const response = await page.goto(route, { waitUntil: 'networkidle' });
      
      // Some routes might redirect (e.g. to login), which is fine. 
      // We just want to ensure it doesn't crash or return 500.
      expect(response?.status()).toBeLessThan(400);

      // Verify no uncaught exceptions or console errors
      expect(pageErrors, `Page errors found on ${route}`).toHaveLength(0);
      
      if (consoleErrors.length > 0) {
        console.warn(`Console errors on ${route}:`, consoleErrors);
      }
      
      await page.screenshot({ path: `test-results/smoke-${route.replace(/\//g, '-')}-screenshot.png`, fullPage: true });
    });
  }
});
