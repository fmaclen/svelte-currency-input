import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/test');
});

test('allows decimal values', async ({ page }) => {
	const input = page.getByLabel('allows decimal values');
	await expect(input).toHaveValue('');
	await input.fill('1234.56');
	await expect(input).toHaveValue('$1,234.56');
});

test('limits decimals to 2 by default', async ({ page }) => {
	const input = page.getByLabel('limits decimals to 2 by default');
	await expect(input).toHaveValue('');
	await input.fill('1234.5678');
	await expect(input).toHaveValue('$1,234.56');
});

test('does not allow multiple decimal separators', async ({ page }) => {
	const input = page.getByLabel('does not allow multiple decimal separators');
	await expect(input).toHaveValue('');
	await input.fill('12.34.56');
	await expect(input).toHaveValue('$12.34');
});

test('allows starting with decimal separator', async ({ page }) => {
	const input = page.getByLabel('allows starting with decimal separator');
	await expect(input).toHaveValue('');
	await input.fill('.');
	await expect(input).toHaveValue('.');
	await input.fill('.5');
	await expect(input).toHaveValue('$0.5');
});

test('clears decimal-only input on blur', async ({ page }) => {
	const input = page.getByLabel('clears decimal-only input on blur');
	await expect(input).toHaveValue('');
	await input.fill('.');
	await expect(input).toHaveValue('.');
	await input.blur();
	await expect(input).toHaveValue('');
});

test('does not allow decimals when allowDecimals is false', async ({ page }) => {
	const input = page.getByLabel('does not allow decimals when allowDecimals is false');
	await expect(input).toHaveValue('');
	await input.fill('1234.56');
	await expect(input).toHaveValue('$1,234');
});

test('pads decimals to scale on blur', async ({ page }) => {
	const input = page.getByLabel('pads decimals to scale on blur');
	await expect(input).toHaveValue('');
	await input.fill('100');
	await expect(input).toHaveValue('$100');
	await input.blur();
	await expect(input).toHaveValue('$100.00');
});

test('pads single decimal to scale on blur', async ({ page }) => {
	const input = page.getByLabel('pads single decimal to scale on blur');
	await expect(input).toHaveValue('');
	await input.fill('100.5');
	await expect(input).toHaveValue('$100.5');
	await input.blur();
	await expect(input).toHaveValue('$100.50');
});

test('pads short decimal on blur with fixed decimal length', async ({ page }) => {
	const input = page.getByLabel('pads short decimal on blur with fixed decimal length');
	await expect(input).toHaveValue('');
	await input.fill('123.4');
	await input.blur();
	await expect(input).toHaveValue('$123.40');
});

test('keeps the sign when fixed decimal length moves the point', async ({ page }) => {
	const input = page.getByLabel('keeps the sign when fixed decimal length moves the point');
	await expect(input).toHaveValue('');
	await input.fill('-123');
	await input.blur();
	await expect(input).toHaveValue('-$1.23');
});

test('keeps trailing zero decimals when prefix contains the decimal separator', async ({
	page
}) => {
	const input = page.getByLabel(
		'keeps trailing zero decimals when prefix contains the decimal separator'
	);
	await expect(input).toHaveValue('');
	await input.pressSequentially('1.0');
	await expect(input).toHaveValue('kr.1.0');
});

test('keeps decimals while typing when prefix contains the decimal separator', async ({ page }) => {
	const input = page.getByLabel(
		'keeps decimals while typing when prefix contains the decimal separator'
	);
	await expect(input).toHaveValue('');
	await input.pressSequentially('1000.05');
	await expect(input).toHaveValue('kr.1,000.05');
});
