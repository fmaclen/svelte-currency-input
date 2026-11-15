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

test('drops a lone minus sign when negatives are disabled', async ({ page }) => {
	const input = page.getByLabel('drops a lone minus sign when negatives are disabled');
	await expect(input).toHaveValue('');
	await input.pressSequentially('-');
	await expect(input).toHaveValue('');
	await input.pressSequentially('5');
	await expect(input).toHaveValue('$5');
});

test('keeps a minus sign and decimal separator while typing', async ({ page }) => {
	const input = page.getByLabel('keeps a minus sign and decimal separator while typing');
	await expect(input).toHaveValue('');
	await input.pressSequentially('-.');
	await expect(input).toHaveValue('-.');
	await input.pressSequentially('5');
	await expect(input).toHaveValue('-$0.5');
	await input.fill('-.');
	await input.blur();
	await expect(input).toHaveValue('');
});

test('keeps a minus sign and comma while typing in German locale', async ({ page }) => {
	const input = page.getByLabel('keeps a minus sign and comma while typing in German locale');
	await expect(input).toHaveValue('');
	await input.pressSequentially('-,');
	await expect(input).toHaveValue('-,');
	await input.pressSequentially('5');
	await expect(input).toHaveValue('-0,5 €');
});

test('keeps the leading zero when typing a negative decimal', async ({ page }) => {
	const input = page.getByLabel('keeps the leading zero when typing a negative decimal');
	await expect(input).toHaveValue('');
	await input.pressSequentially('-.05');
	await expect(input).toHaveValue('-$0.05');
});
