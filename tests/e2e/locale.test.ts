import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/test');
});

test('formats Euro with German locale', async ({ page }) => {
	const input = page.getByLabel('formats Euro with German locale');
	await expect(input).toHaveValue('');
	await input.fill('1234,56');
	await expect(input).toHaveValue('1.234,56\u00A0€');
});

test('formats Yen with Japanese locale', async ({ page }) => {
	const input = page.getByLabel('formats Yen with Japanese locale');
	await expect(input).toHaveValue('￥5,679');
	await input.fill('1234');
	await expect(input).toHaveValue('￥1,234');
});
