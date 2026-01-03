import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/test');
});

test('expands k to thousands', async ({ page }) => {
	const input = page.getByLabel('expands k to thousands');
	await expect(input).toHaveValue('');
	await input.fill('5k');
	await expect(input).toHaveValue('$5,000');
});

test('expands m to millions', async ({ page }) => {
	const input = page.getByLabel('expands m to millions');
	await expect(input).toHaveValue('');
	await input.fill('4.1m');
	await expect(input).toHaveValue('$4,100,000');
});

test('expands b to billions', async ({ page }) => {
	const input = page.getByLabel('expands b to billions');
	await expect(input).toHaveValue('');
	await input.fill('1b');
	await expect(input).toHaveValue('$1,000,000,000');
});

test('does not expand abbreviations when disabled', async ({ page }) => {
	const input = page.getByLabel('does not expand abbreviations when disabled');
	await expect(input).toHaveValue('');
	await input.fill('5k');
	await expect(input).toHaveValue('$5');
});
