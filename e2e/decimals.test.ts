import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/test/decimals');
});

test('allows decimal values', async ({ page }) => {
	const input = page.getByLabel('Default (decimalsLimit=2)');
	await input.fill('1234.56');
	await expect(input).toHaveValue('$1,234.56');
});

test('limits decimals to 2 by default', async ({ page }) => {
	const input = page.getByLabel('Default (decimalsLimit=2)');
	await input.fill('1234.5678');
	await expect(input).toHaveValue('$1,234.56');
});

test('does not allow multiple decimal separators', async ({ page }) => {
	const input = page.getByLabel('Default (decimalsLimit=2)');
	await input.fill('12.34.56');
	await expect(input).toHaveValue('$12.34');
});

test('allows starting with decimal separator', async ({ page }) => {
	const input = page.getByLabel('Default (decimalsLimit=2)');
	await input.fill('.');
	await expect(input).toHaveValue('.');
	await input.fill('.5');
	await expect(input).toHaveValue('$0.5');
});

test('clears decimal-only input on blur', async ({ page }) => {
	const input = page.getByLabel('Default (decimalsLimit=2)');
	await input.fill('.');
	await expect(input).toHaveValue('.');
	await input.blur();
	await expect(input).toHaveValue('');
});

test('does not allow decimals when allowDecimals is false', async ({ page }) => {
	const input = page.getByLabel('No Decimals');
	await input.fill('1234.56');
	await expect(input).toHaveValue('$1,234');
});

test('pads decimals to scale on blur', async ({ page }) => {
	const input = page.getByLabel('Decimal Scale 2');
	await input.fill('100');
	await input.blur();
	await expect(input).toHaveValue('$100.00');
});

test('pads single decimal to scale on blur', async ({ page }) => {
	const input = page.getByLabel('Decimal Scale 2');
	await input.fill('100.5');
	await input.blur();
	await expect(input).toHaveValue('$100.50');
});
