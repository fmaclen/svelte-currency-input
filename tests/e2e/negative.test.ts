import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/test');
});

test('allows negative value with minus at start', async ({ page }) => {
	const input = page.getByLabel('allows negative value with minus at start');
	await expect(input).toHaveValue('');
	await input.fill('-1234');
	await expect(input).toHaveValue('-$1,234');
});

test('allows just minus sign while typing', async ({ page }) => {
	const input = page.getByLabel('allows just minus sign while typing');
	await expect(input).toHaveValue('');
	await input.fill('-');
	await expect(input).toHaveValue('-');
});

test('clears minus-only input on blur', async ({ page }) => {
	const input = page.getByLabel('clears minus-only input on blur');
	await expect(input).toHaveValue('');
	await input.fill('-');
	await expect(input).toHaveValue('-');
	await input.blur();
	await expect(input).toHaveValue('');
});

test('does not allow negative when disabled', async ({ page }) => {
	const input = page.getByLabel('does not allow negative when disabled');
	await expect(input).toHaveValue('');
	await input.fill('-1234');
	await expect(input).toHaveValue('$1,234');
});
