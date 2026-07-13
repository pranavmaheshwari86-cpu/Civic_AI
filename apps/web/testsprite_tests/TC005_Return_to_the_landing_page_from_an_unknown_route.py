import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3001")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Open the URL '/unknown-page' and verify a 404 message is displayed and a visible way back to the landing page (for example a 'Home' link or the site logo).
        await page.goto("http://localhost:3001/unknown-page")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Scroll down the page to reveal the '404' or 'Page not found' message and the site logo/Home link so they are visible on screen.
        await page.mouse.wheel(0, 300)
        
        # --> Assertions to verify final state
        
        # --> Verify a 404 page is displayed
        # Assert: The page displays a 404 message indicating the resource was not found.
        await expect(page.locator("xpath=/html/body/div/div/div").nth(0)).to_contain_text("404", timeout=15000), "The page displays a 404 message indicating the resource was not found."
        
        # --> Verify a way back to the landing page is displayed
        # Assert: The site logo link 'Civic AI' is visible as a way back to the landing page.
        await expect(page.locator("xpath=/html/body/header/div/div[1]/a").nth(0)).to_have_text("Civic AI", timeout=15000), "The site logo link 'Civic AI' is visible as a way back to the landing page."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    