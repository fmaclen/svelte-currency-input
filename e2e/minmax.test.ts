import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/test');
});

test('prevents step above max', async ({ page }) => {
	const input = page.getByLabel('prevents step above max');
	await expect(input).toHaveValue('$50');
	await input.click();
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$60');
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$70');
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$80');
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$90');
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$100');
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$100');
});

test('prevents step below min', async ({ page }) => {
	const input = page.getByLabel('prevents step below min');
	await expect(input).toHaveValue('$50');
	await input.click();
	await input.press('ArrowDown');
	await expect(input).toHaveValue('$40');
	await input.press('ArrowDown');
	await expect(input).toHaveValue('$30');
	await input.press('ArrowDown');
	await expect(input).toHaveValue('$20');
	await input.press('ArrowDown');
	await expect(input).toHaveValue('$10');
	await input.press('ArrowDown');
	await expect(input).toHaveValue('$0');
	await input.press('ArrowDown');
	await expect(input).toHaveValue('$0');
});
