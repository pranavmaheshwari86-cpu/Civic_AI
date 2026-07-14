import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = 'http://localhost:3000';

test.describe('Cross-cutting Audits', () => {
  test.describe('Accessibility', () => {
    test('Homepage should not have any automatically detectable accessibility violations', async ({ page }) => {
      await page.goto(`${BASE_URL}/en`);
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      if (accessibilityScanResults.violations.length > 0) {
        require('fs').writeFileSync('homepage-violations.json', JSON.stringify(accessibilityScanResults.violations.map(v => `${v.id}: ${v.help}`), null, 2));
      }
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('Login page should not have any accessibility violations', async ({ page }) => {
      await page.goto(`${BASE_URL}/en/login`);
      await page.waitForLoadState('networkidle');
      // Wait for framer-motion fade-in animation to complete
      await page.waitForTimeout(1000);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      if (accessibilityScanResults.violations.length > 0) {
        require('fs').writeFileSync('login-violations.json', JSON.stringify(accessibilityScanResults.violations.map(v => `${v.id}: ${v.help}`), null, 2));
      }
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Security & Authorization', () => {
    test('Unauthenticated user is redirected to login when accessing protected routes', async ({ page }) => {
      // Clear any cookies/storage
      await page.context().clearCookies();
      
      const protectedRoutes = [
        `${BASE_URL}/en/admin`,
        `${BASE_URL}/en/dashboard`
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);
        // Should redirect to login
        await expect(page).toHaveURL(/.*\/login.*/);
      }
    });

    test('Citizen cannot access admin area', async ({ page }) => {
      // Login as citizen
      await page.goto(`${BASE_URL}/en/login`);
      await page.getByLabel(/email/i).fill('citizen@example.com');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: /sign in/i }).click();

      await page.waitForURL(/\/dashboard/);
      
      // Try to access admin area
      await page.goto(`${BASE_URL}/en/admin`);
      
      // The frontend should either show an unauthorized message or redirect away
      // We will check if we are redirected to /login?redirect=... or if we see 'Access Denied'
      // If it doesn't do this, it's a security vulnerability.
      
      // Wait a bit for potential redirects
      await page.waitForTimeout(1000);
      const url = page.url();
      if (url.includes('/admin')) {
        // If we stayed on /admin, verify if there's an unauthorized message or something similar
        // Since we don't know the exact implementation, we'll check if the main admin headings are NOT visible
        await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).not.toBeVisible();
      }
    });
  });

  test.describe('Performance & Console', () => {
    test('Homepage should load without console errors', async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Some intentional known errors like 401s for auth check might happen, filter them out if needed.
      page.on('pageerror', exception => {
        consoleErrors.push(exception.message);
      });

      await page.goto(`${BASE_URL}/en`);
      await page.waitForLoadState('networkidle');

      // Filter out hydration errors or known intentional errors if necessary, but ideally should be empty
      expect(consoleErrors).toEqual([]);
    });
  });
});
