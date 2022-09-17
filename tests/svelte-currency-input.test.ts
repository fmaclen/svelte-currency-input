import { expect, test } from '@playwright/test';

test.describe('CurrencyInput', () => {
	test('Default behavior is correct', async ({ page }) => {
		await page.goto('/');

		// Test field with "zero" value
		const rentUnformattedInput = page.locator('.currencyInput__unformatted[name=rent]');
		const rentFormattedInput = page.locator('.currencyInput__formatted[name="formatted-rent"]');
		await expect(rentUnformattedInput).not.toBeDisabled();
		await expect(rentUnformattedInput).toHaveAttribute('type', 'hidden');
		await expect(rentUnformattedInput).toHaveValue('0');
		await expect(rentFormattedInput).not.toBeDisabled();
		await expect(rentFormattedInput).toHaveValue('');
		await expect(rentFormattedInput).toHaveAttribute('type', 'text');
		await expect(rentFormattedInput).toHaveAttribute('placeholder', '$0.00');
		await expect(rentFormattedInput).not.toHaveClass(/currencyInput__formatted--positive/);
		await expect(rentFormattedInput).not.toHaveClass(/currencyInput__formatted--negative/);
		await expect(rentFormattedInput).toHaveClass(/currencyInput__formatted--zero/);

		// Test field with "positive" value
		const amountUnformattedInput = page.locator('.currencyInput__unformatted[name=amount]');
		const amountFormattedInput = page.locator('.currencyInput__formatted[name="formatted-amount"]');
		await expect(amountUnformattedInput).not.toBeDisabled();
		await expect(amountUnformattedInput).toHaveAttribute('type', 'hidden');
		await expect(amountUnformattedInput).toHaveValue('5678.9');
		await expect(amountFormattedInput).not.toBeDisabled();
		await expect(amountFormattedInput).toHaveValue('€ 5.678,9');
		await expect(amountFormattedInput).toHaveAttribute('type', 'text');
		await expect(amountFormattedInput).toHaveAttribute('placeholder', '€ 0,00');
		await expect(amountFormattedInput).toHaveClass(/currencyInput__formatted--positive/);
		await expect(amountFormattedInput).not.toHaveClass(/currencyInput__formatted--negative/);
		await expect(amountFormattedInput).not.toHaveClass(/currencyInput__formatted--zero/);

		// Test field with "negative" value
		const totalUnformattedInput = page.locator('.currencyInput__unformatted[name=total]');
		const totalFormattedInput = page.locator('.currencyInput__formatted[name="formatted-total"]');
		await expect(amountUnformattedInput).not.toBeDisabled();
		await expect(totalUnformattedInput).toHaveAttribute('type', 'hidden');
		await expect(totalUnformattedInput).toHaveValue('-42069.69');
		await expect(totalFormattedInput).not.toBeDisabled();
		await expect(totalFormattedInput).toHaveValue('-$42,069.69');
		await expect(totalFormattedInput).toHaveAttribute('type', 'text');
		await expect(totalFormattedInput).toHaveAttribute('placeholder', '$0.00');
		await expect(totalFormattedInput).not.toHaveClass(/currencyInput__formatted--positive/);
		await expect(totalFormattedInput).toHaveClass(/currencyInput__formatted--negative/);
		await expect(totalFormattedInput).not.toHaveClass(/currencyInput__formatted--zero/);

		// Test field that is "disabled"
		const lossUnformattedInput = page.locator('.currencyInput__unformatted[name=loss]');
		const lossFormattedInput = page.locator('.currencyInput__formatted[name="formatted-loss"]');
		await expect(lossUnformattedInput).toBeDisabled();
		await expect(lossUnformattedInput).toHaveAttribute('type', 'hidden');
		await expect(lossUnformattedInput).toHaveValue('97532.95');
		await expect(lossFormattedInput).toHaveValue('€ 97.532,95');
		await expect(lossFormattedInput).toBeDisabled();
		await expect(lossFormattedInput).toHaveAttribute('type', 'text');
		await expect(lossFormattedInput).toHaveAttribute('placeholder', '€ 0,00');
		await expect(lossFormattedInput).toHaveClass(/currencyInput__formatted--positive/);
		await expect(lossFormattedInput).not.toHaveClass(/currencyInput__formatted--negative/);
		await expect(lossFormattedInput).not.toHaveClass(/currencyInput__formatted--zero/);

		// Submitting a form returns the correct values
		const demoSubmitForm = page.locator('button.demoForm__submit');
		const demoOutput = page.locator('pre.demoForm__pre');
		await demoSubmitForm.click();
		expect(await demoOutput.textContent()).toMatch(
			JSON.stringify(
				{
					total: '-42069.69',
					'formatted-total': '-$42,069.69',
					rent: '0',
					'formatted-rent': '',
					cashflow: '5678.9',
					'formatted-cashflow': '$5,678.9',
					balance: '1234.56',
					'formatted-balance': '$1,234.56',
					amount: '5678.9',
					'formatted-amount': '€ 5.678,9',
					deficit: '1234.56',
					'formatted-deficit': '€ 1.234,56',
					cost: '-42069.69',
					'formatted-cost': '€ -42.069,69'
				},
				null,
				2
			)
		);
	});

	test('Updating an input has the correct behavior', async ({ page }) => {
		await page.goto('/');

		const rentUnformattedInput = page.locator('.currencyInput__unformatted[name=rent]');
		const rentFormattedInput = page.locator('.currencyInput__formatted[name="formatted-rent"]');

		// Check the there is no value in the input
		await expect(rentUnformattedInput).toHaveValue('0');
		await expect(rentFormattedInput).toHaveValue('');

		await rentFormattedInput.focus();
		await page.keyboard.type('420.69');
		await expect(rentFormattedInput).toHaveValue('$420.69');
		await expect(rentUnformattedInput).toHaveValue('420.69');
		await expect(rentFormattedInput).toHaveClass(/currencyInput__formatted--positive/);
		await expect(rentFormattedInput).not.toHaveClass(/currencyInput__formatted--negative/);
		await expect(rentFormattedInput).not.toHaveClass(/currencyInput__formatted--zero/);

		// Use arrow keys to go back to the first character
		for (let i = 0; i < '$420.69'.length; i++) await page.keyboard.press('ArrowLeft');
		await page.keyboard.type('-');
		await expect(rentFormattedInput).toHaveValue('-$420.69');
		await expect(rentUnformattedInput).toHaveValue('-420.69');
		await expect(rentFormattedInput).not.toHaveClass(/currencyInput__formatted--positive/);
		await expect(rentFormattedInput).toHaveClass(/currencyInput__formatted--negative/);
		await expect(rentFormattedInput).not.toHaveClass(/currencyInput__formatted--zero/);

		// Use right arrow keys to position cusror at the end of the input
		for (let i = 0; i < '$420.69'.length; i++) await page.keyboard.press('ArrowRight');
		// Delete the number but keep the currency symbol and sign
		for (let i = 1; i < '420.69'.length; i++) await page.keyboard.press('Backspace');
		await expect(rentFormattedInput).toHaveValue('-$');
		// FIXME: at this point the hidden value should be set to 0 but without formatting `rentFormattedInput`
		await expect(rentUnformattedInput).toHaveValue('-4');

		await page.keyboard.press('Backspace');
		await expect(rentFormattedInput).toHaveValue('-');
		// FIXME: at this point the hidden value should be set to 0 but without formatting `rentFormattedInput
		await expect(rentUnformattedInput).toHaveValue('-4');

		await page.keyboard.type('69.42');
		await expect(rentFormattedInput).toHaveValue('-$69.42');
		await expect(rentUnformattedInput).toHaveValue('-69.42');

		for (let i = 0; i < '-$69.42'.length; i++) await page.keyboard.press('Backspace');
		await expect(rentUnformattedInput).toHaveValue('0');
	});

	test("Incorrect characters can't be entered", async ({ page }) => {
		await page.goto('/');

		const isMacOs = process.platform === 'darwin';
		const rentUnformattedInput = page.locator('.currencyInput__unformatted[name=rent]');
		const rentFormattedInput = page.locator('.currencyInput__formatted[name="formatted-rent"]');

		// Check the there is no value in the input
		await expect(rentUnformattedInput).toHaveValue('0');
		await expect(rentFormattedInput).toHaveValue('');

		// Check typing letters doesn't do anything
		await rentFormattedInput.focus();
		await page.keyboard.type('abc');
		await expect(rentUnformattedInput).toHaveValue('0');
		await expect(rentFormattedInput).toHaveValue('');

		// Check keyboard combinations don't do anything
		await page.keyboard.press('Shift+A');
		await expect(rentFormattedInput).toHaveValue('');

		// Check keyboard shortcuts are allowed
		await page.keyboard.type('420.69');
		await expect(rentFormattedInput).toHaveValue('$420.69');
		await expect(rentUnformattedInput).toHaveValue('420.69');

		// Select all
		isMacOs ? await page.keyboard.press('Meta+A') : await page.keyboard.press('Control+A');

		// Check "Backspace" works
		await page.keyboard.press('Backspace');
		await expect(rentUnformattedInput).toHaveValue('0');
		await expect(rentFormattedInput).toHaveValue('');

		// Add data to the field again
		await page.keyboard.type('-420.69');
		await expect(rentFormattedInput).toHaveValue('-$420.69');
		await expect(rentUnformattedInput).toHaveValue('-420.69');

		// Select all
		isMacOs ? await page.keyboard.press('Meta+A') : await page.keyboard.press('Control+A');

		// Check "Delete" also works
		await page.keyboard.press('Delete');
		await expect(rentUnformattedInput).toHaveValue('0');
		await expect(rentFormattedInput).toHaveValue('');
	});

	test.skip('Updating chained inputs have the correct behavior', async () => {
		// TODO
	});
});
