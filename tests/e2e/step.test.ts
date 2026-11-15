import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/test');
});

test('increments value with arrow up', async ({ page }) => {
	const input = page.getByLabel('increments value with arrow up');
	await expect(input).toHaveValue('');
	await input.click();
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$5');
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$10');
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$15');
});

test('decrements value with arrow down', async ({ page }) => {
	const input = page.getByLabel('decrements value with arrow down');
	await expect(input).toHaveValue('$10');
	await input.click();
	await input.press('ArrowDown');
	await expect(input).toHaveValue('$5');
	await input.press('ArrowDown');
	await expect(input).toHaveValue('$0');
});

test('handles decimal step values', async ({ page }) => {
	const input = page.getByLabel('handles decimal step values');
	await expect(input).toHaveValue('');
	await input.click();
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$0.25');
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$0.50');
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$0.75');
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$1.00');
});

test('steps a decimal value by a whole-number step without float errors', async ({ page }) => {
	const input = page.getByLabel(
		'steps a decimal value by a whole-number step without float errors'
	);
	await expect(input).toHaveValue('$8.2');
	await input.click();
	await input.press('ArrowDown');
	await expect(input).toHaveValue('$7.2');
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$8.2');
});

test('rounds a decimal step to the step decimals', async ({ page }) => {
	const input = page.getByLabel('rounds a decimal step to the step decimals');
	await expect(input).toHaveValue('$1.25');
	await input.click();
	await input.press('ArrowUp');
	await expect(input).toHaveValue('$1.4');
});

test('keeps the digits of a stepped value without float errors', async ({ page }) => {
	const input = page.getByLabel('keeps the digits of a stepped value without float errors');
	await expect(input).toHaveValue('$34.7');
	await input.click();
	await input.press('ArrowDown');
	await expect(input).toHaveValue('$22.70');
});
