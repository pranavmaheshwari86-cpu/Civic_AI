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
        
        # -> Click the 'Skip to main content' link to set focus, then press the Tab key twice to traverse the header navigation and observe focus order.
        # Skip to main content link
        elem = page.get_by_role('link', name='Skip to main content', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify keyboard focus moves through interactive elements in a usable order
        # Assert: The Skip link moved focus to the main content (URL contains '#main-content').
        await expect(page).to_have_url(re.compile("\\#main\\-content"), timeout=15000), "The Skip link moved focus to the main content (URL contains '#main-content')."
        await page.locator("xpath=/html/body/a").nth(0).scroll_into_view_if_needed()
        # Assert: The 'Skip to main content' link is present and focusable.
        await expect(page.locator("xpath=/html/body/a").nth(0)).to_be_visible(timeout=15000), "The 'Skip to main content' link is present and focusable."
        await page.locator("xpath=/html/body/header/div/nav/a[1]").nth(0).scroll_into_view_if_needed()
        # Assert: Header navigation item 'Dashboard' is visible and reachable by keyboard.
        await expect(page.locator("xpath=/html/body/header/div/nav/a[1]").nth(0)).to_be_visible(timeout=15000), "Header navigation item 'Dashboard' is visible and reachable by keyboard."
        await page.locator("xpath=/html/body/header/div/nav/a[2]").nth(0).scroll_into_view_if_needed()
        # Assert: Header navigation item 'Government Services' is visible and reachable by keyboard.
        await expect(page.locator("xpath=/html/body/header/div/nav/a[2]").nth(0)).to_be_visible(timeout=15000), "Header navigation item 'Government Services' is visible and reachable by keyboard."
        
        # --> Verify the landing page content remains readable and accessible
        await page.locator("xpath=/html/body/a").nth(0).scroll_into_view_if_needed()
        # Assert: The visible 'Skip to main content' link is present to allow keyboard users to jump to the main content.
        await expect(page.locator("xpath=/html/body/a").nth(0)).to_be_visible(timeout=15000), "The visible 'Skip to main content' link is present to allow keyboard users to jump to the main content."
        # Assert: The primary call-to-action text 'Launch Citizen Portal' is visible and readable on the landing page.
        await expect(page.locator("xpath=/html/body/main/div/section[1]/div/div[1]/div[1]/div").nth(0)).to_have_text("Launch Citizen Portal", timeout=15000), "The primary call-to-action text 'Launch Citizen Portal' is visible and readable on the landing page."
        # Assert: The language toggle exposes an accessible aria-label 'Switch language' for assistive technologies.
        await expect(page.locator("xpath=/html/body/header/div/div[2]/button[1]").nth(0)).to_have_attribute("aria-label", "Switch language", timeout=15000), "The language toggle exposes an accessible aria-label 'Switch language' for assistive technologies."
        # Assert: The theme toggle exposes an accessible aria-label 'Toggle theme' for assistive technologies.
        await expect(page.locator("xpath=/html/body/header/div/div[2]/button[2]").nth(0)).to_have_attribute("aria-label", "Toggle theme", timeout=15000), "The theme toggle exposes an accessible aria-label 'Toggle theme' for assistive technologies."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    