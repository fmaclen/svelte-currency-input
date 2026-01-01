import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/test/basic');
});

test('formats numbers with currency symbol and separators', async ({ page }) => {
	const input = page.getByLabel('Amount');
	await input.fill('1234567');
	await expect(input).toHaveValue('$1,234,567');
});

test('strips invalid characters', async ({ page }) => {
	const input = page.getByLabel('Amount');
	await input.fill('xyz123xyz456');
	await expect(input).toHaveValue('$123,456');
});

test('shows empty for only invalid characters', async ({ page }) => {
	const input = page.getByLabel('Amount');
	await input.fill('hello');
	await expect(input).toHaveValue('');
});

test('updates bound value', async ({ page }) => {
	const input = page.getByLabel('Amount');
	const output = page.locator('output');

	await input.fill('1234');
	await expect(output).toHaveText('1234');
});
