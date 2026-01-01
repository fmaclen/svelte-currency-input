import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/test');
});

test('formats numbers with currency symbol and separators', async ({ page }) => {
	const input = page.getByLabel('formats numbers with currency symbol and separators');
	await expect(input).toHaveValue('');
	await input.fill('1234567');
	await expect(input).toHaveValue('$1,234,567');
});

test('strips invalid characters', async ({ page }) => {
	const input = page.getByLabel('strips invalid characters');
	await expect(input).toHaveValue('');
	await input.fill('xyz123xyz456');
	await expect(input).toHaveValue('$123,456');
});

test('shows empty for only invalid characters', async ({ page }) => {
	const input = page.getByLabel('shows empty for only invalid characters');
	await expect(input).toHaveValue('');
	await input.fill('hello');
	await expect(input).toHaveValue('');
});

test('updates bound value', async ({ page }) => {
	const input = page.getByLabel('updates bound value');
	const output = page.locator('output');

	await expect(input).toHaveValue('');
	await expect(output).toHaveText('');
	await input.fill('1234');
	await expect(output).toHaveText('1234');
});

test('shows placeholder when empty', async ({ page }) => {
	const input = page.getByLabel('shows placeholder when empty');
	await expect(input).toHaveValue('');
	await expect(input).toHaveAttribute('placeholder', '$0.00');
	await input.fill('100');
	await expect(input).toHaveValue('$100');
});
