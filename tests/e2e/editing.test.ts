import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/test');
});

test('can type digits at the end of existing value', async ({ page }) => {
	const input = page.getByLabel('can type digits at the end of existing value');
	await expect(input).toHaveValue('$123');
	await input.click();
	await input.press('End');
	await input.pressSequentially('456');
	await expect(input).toHaveValue('$123,456');
});

test('can type digits in the middle of existing value', async ({ page }) => {
	const input = page.getByLabel('can type digits in the middle of existing value');
	await expect(input).toHaveValue('$1,234');
	await input.focus();
	await input.evaluate((el: HTMLInputElement) => el.setSelectionRange(2, 2));
	await input.pressSequentially('99');
	await expect(input).toHaveValue('$199,234');
});

test('can delete characters with backspace', async ({ page }) => {
	const input = page.getByLabel('can delete characters with backspace');
	await expect(input).toHaveValue('$1,234');
	await input.click();
	await input.press('End');
	await input.press('Backspace');
	await expect(input).toHaveValue('$123');
	await input.press('Backspace');
	await expect(input).toHaveValue('$12');
});

test('can select all and replace', async ({ page }) => {
	const input = page.getByLabel('can select all and replace');
	await expect(input).toHaveValue('$1,234');
	await input.selectText();
	await input.pressSequentially('999');
	await expect(input).toHaveValue('$999');
});

test('can clear input and type new value', async ({ page }) => {
	const input = page.getByLabel('can clear input and type new value');
	await expect(input).toHaveValue('$1,234');
	await input.clear();
	await expect(input).toHaveValue('');
	await input.fill('5678');
	await expect(input).toHaveValue('$5,678');
});

test('can delete the decimal separator', async ({ page }) => {
	const input = page.getByLabel('can delete the decimal separator');
	await expect(input).toHaveValue('$12.34');
	await input.click();
	await input.press('End');
	await input.press('ArrowLeft');
	await input.press('ArrowLeft');
	await input.press('Backspace');
	await expect(input).toHaveValue('$1,234');
});
