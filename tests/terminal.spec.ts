import { test, expect } from "@playwright/test";

test.describe("Embed-OS Desktop", () => {
  test("should load the desktop interface", async ({ page }) => {
    await page.goto("/");

    // Check that the desktop loads with the gradient background
    await expect(page.locator(".desktop")).toBeVisible();

    // Check that taskbar is visible
    await expect(page.locator('[class*="fixed bottom-0"]')).toBeVisible();
  });

  test("should display taskbar with app launcher", async ({ page }) => {
    await page.goto("/");

    // Check for app launcher buttons in taskbar
    const terminalButton = page.locator('button[title="Terminal"]');
    const filesButton = page.locator('button[title="Files"]');
    const editorButton = page.locator('button[title="Editor"]');

    await expect(terminalButton).toBeVisible();
    await expect(filesButton).toBeVisible();
    await expect(editorButton).toBeVisible();
  });

  test("should open terminal window when clicking Terminal button", async ({
    page,
  }) => {
    await page.goto("/");

    // Click terminal button
    const terminalButton = page.locator('button[title="Terminal"]');
    await terminalButton.click();

    // Window should appear with terminal title in header
    await expect(
      page.locator(".window-drag-handle >> text=Terminal"),
    ).toBeVisible();

    // Terminal welcome message should be visible
    await expect(page.locator("text=Embed-OS Terminal v1.0")).toBeVisible();
  });

  test("should open file explorer window", async ({ page }) => {
    await page.goto("/");

    // Click files button
    const filesButton = page.locator('button[title="Files"]');
    await filesButton.click();

    // Window should appear with Files title in header
    await expect(
      page.locator(".window-drag-handle >> text=Files"),
    ).toBeVisible();
  });

  test("should open text editor window", async ({ page }) => {
    await page.goto("/");

    // Click editor button
    const editorButton = page.locator('button[title="Editor"]');
    await editorButton.click();

    // Window should appear with Editor title in header
    await expect(
      page.locator(".window-drag-handle >> text=Editor"),
    ).toBeVisible();

    // Editor placeholder text should be visible
    await expect(
      page.locator('textarea[placeholder="Start typing..."]'),
    ).toBeVisible();
  });

  test("should close window when clicking X button", async ({ page }) => {
    await page.goto("/");

    // Open terminal
    await page.locator('button[title="Terminal"]').click();
    await expect(
      page.locator(".window-drag-handle >> text=Terminal"),
    ).toBeVisible();

    // Close window
    const closeButton = page.locator("button:has(svg.lucide-x)");
    await closeButton.click();

    // Window title should no longer be visible
    await expect(
      page.locator(".window-drag-handle >> text=Terminal"),
    ).not.toBeVisible();
  });

  test("should drag window by header", async ({ page }) => {
    await page.goto("/");

    // Open terminal
    await page.locator('button[title="Terminal"]').click();

    // Get the window drag handle
    const dragHandle = page.locator(".window-drag-handle").first();
    await expect(dragHandle).toBeVisible();

    // Get initial position
    const initialBox = await dragHandle.boundingBox();
    expect(initialBox).not.toBeNull();

    // Drag the window
    await dragHandle.hover();
    await page.mouse.down();
    await page.mouse.move(initialBox!.x + 100, initialBox!.y + 50);
    await page.mouse.up();

    // Verify window moved
    const newBox = await dragHandle.boundingBox();
    expect(newBox).not.toBeNull();
    expect(newBox!.x).toBeGreaterThan(initialBox!.x);
  });

  test("should show open windows in taskbar", async ({ page }) => {
    await page.goto("/");

    // Open terminal
    await page.locator('button[title="Terminal"]').click();

    // Check that Terminal appears in the taskbar window list
    const taskbarWindow = page.locator('button:has-text("Terminal")').last();
    await expect(taskbarWindow).toBeVisible();
  });

  test("should have context menu on right-click", async ({ page }) => {
    await page.goto("/");

    // Right-click on desktop
    await page
      .locator(".desktop")
      .click({ button: "right", position: { x: 300, y: 300 } });

    // Context menu should appear
    await expect(page.locator("text=Open Terminal")).toBeVisible();
    await expect(page.locator("text=Open File Explorer")).toBeVisible();
    await expect(page.locator("text=New Text File")).toBeVisible();
  });

  test("should display clock in system tray", async ({ page }) => {
    await page.goto("/");

    // Clock should be visible (format: HH:MM)
    const clock = page.locator(".font-mono").last();
    await expect(clock).toBeVisible();

    // Should contain time format
    const clockText = await clock.textContent();
    expect(clockText).toMatch(/\d{1,2}:\d{2}/);
  });

  test("should display desktop icons after seeding", async ({ page }) => {
    // Clear localStorage to trigger re-seeding
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Wait for desktop icons to appear
    await page.waitForTimeout(500);

    // Check for seeded files on desktop
    await expect(page.locator("text=README.txt")).toBeVisible();
    await expect(page.locator("text=notes.txt")).toBeVisible();
  });
});
