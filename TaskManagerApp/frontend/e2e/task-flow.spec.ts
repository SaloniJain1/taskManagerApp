import { test, expect } from '@playwright/test';

test.describe('Task Manager E2E Flow', () => {
    const taskId = String(Math.floor(Math.random() * 899999) + 100000);
    const taskTitle = 'Playwright Test Task';

    test('should create, edit, and delete a task with manual ID', async ({ page }) => {
        // 1. Navigate to Add Task
        await page.goto('/tasks/new');

        // 2. Fill form
        await page.fill('input[name="id"]', taskId);
        await page.fill('input[name="title"]', taskTitle);
        await page.fill('textarea[name="description"]', 'This is an E2E test');
        await page.fill('input[name="dueDate"]', '2026-12-31T23:59');

        // 3. Save and verify in list
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/.*\/tasks$/);
        await expect(page.locator('table.task-table')).toContainText(taskId);
        await expect(page.locator('table.task-table')).toContainText(taskTitle);

        // 4. Edit the task
        const row = page.locator('tr').filter({ hasText: taskId });
        await row.getByRole('button', { name: 'Edit' }).click();
        await page.waitForURL(/.*\/tasks\/edit\/.*/);
        await page.fill('input[name="title"]', taskTitle + ' Updated');
        await page.click('button[type="submit"]');

        // 5. Verify update
        await expect(page).toHaveURL(/.*\/tasks$/);
        await expect(page.locator('table.task-table')).toContainText(taskTitle + ' Updated');

        // 6. Delete the task
        page.on('dialog', dialog => dialog.accept());
        await row.getByRole('button', { name: 'Delete' }).click();

        // 7. Verify deletion
        await expect(page.locator('table.task-table')).not.toContainText(taskId);
    });

    test('should show error for duplicate manual ID', async ({ page }) => {
        // Preliminary: ensure task exists (or just try to create)
        await page.goto('/tasks/new');
        await page.fill('input[name="id"]', '500'); // ID 500 created in previous manual test
        await page.fill('input[name="title"]', 'Duplicate Test');
        await page.click('button[type="submit"]');

        // Handle the alert (Angular interceptor shows window.alert)
        const dialogPromise = page.waitForEvent('dialog');
        await page.click('button[type="submit"]');

        const dialog = await dialogPromise;
        expect(dialog.message()).toContain('already exists');
        await dialog.dismiss();

        // We remain on the same page or see the error
        // Note: In our current implementation, we show an alert.
    });
});
