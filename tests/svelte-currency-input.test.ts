import { expect, test, type Page } from '@playwright/test';

const DELAY_FOR_FORMATTED_VALUE_IN_MS = 25;

const isMacOs = process.platform === 'darwin';
const selectAll = async (page: Page) => {
	isMacOs ? await page.keyboard.press('Meta+A') : await page.keyboard.press('Control+A');
};

test.describe('CurrencyInput', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('Default behavior is correct', async ({ page }) => {
		// Test field with "zero" value
		const colonUnformattedInput = page.locator('.currencyInput__unformatted[name=colon]');
		const colonFormattedInput = page.locator('.currencyInput__formatted[name="formatted-colon"]');
		await expect(colonUnformattedInput).not.toBeDisabled();
		await expect(colonUnformattedInput).toHaveAttribute('type', 'hidden');
		await expect(colonUnformattedInput).toHaveValue('0');
		await expect(colonFormattedInput).not.toBeDisabled();
		await expect(colonFormattedInput).toHaveValue('');
		await expect(colonFormattedInput).toHaveAttribute('type', 'text');
		await expect(colonFormattedInput).toHaveAttribute('placeholder', '₡0,00');
		await expect(colonFormattedInput).not.toHaveClass(/currencyInput__formatted--positive/);
		await expect(colonFormattedInput).not.toHaveClass(/currencyInput__formatted--negative/);
		await expect(colonFormattedInput).toHaveClass(/currencyInput__formatted--zero/);

		// Test field with "positive" value
		const yenUnformattedInput = page.locator('.currencyInput__unformatted[name=yen]');
		const yenFormattedInput = page.locator('.currencyInput__formatted[name="formatted-yen"]');
		await expect(yenUnformattedInput).not.toBeDisabled();
		await expect(yenUnformattedInput).toHaveAttribute('type', 'hidden');
		await expect(yenUnformattedInput).toHaveValue('5678.9');
		await expect(yenFormattedInput).not.toBeDisabled();
		await expect(yenFormattedInput).toHaveValue('¥5,678.9');
		await expect(yenFormattedInput).toHaveAttribute('type', 'text');
		await expect(yenFormattedInput).toHaveAttribute('placeholder', '¥0.00');
		await expect(yenFormattedInput).toHaveClass(/currencyInput__formatted--positive/);
		await expect(yenFormattedInput).not.toHaveClass(/currencyInput__formatted--negative/);
		await expect(yenFormattedInput).not.toHaveClass(/currencyInput__formatted--zero/);

		// Test field with "negative" value
		const defaultUnformattedInput = page.locator('.currencyInput__unformatted[name=default]');
		const defaultFormattedInput = page.locator(
			'.currencyInput__formatted[name="formatted-default"]'
		);
		await expect(yenUnformattedInput).not.toBeDisabled();
		await expect(defaultUnformattedInput).toHaveAttribute('type', 'hidden');
		await expect(defaultUnformattedInput).toHaveValue('-42069.69');
		await expect(defaultFormattedInput).not.toBeDisabled();
		await expect(defaultFormattedInput).toHaveValue('-$42,069.69');
		await expect(defaultFormattedInput).toHaveAttribute('type', 'text');
		await expect(defaultFormattedInput).toHaveAttribute('placeholder', '$0.00');
		await expect(defaultFormattedInput).not.toHaveClass(/currencyInput__formatted--positive/);
		await expect(defaultFormattedInput).toHaveClass(/currencyInput__formatted--negative/);
		await expect(defaultFormattedInput).not.toHaveClass(/currencyInput__formatted--zero/);

		// Test field that is "disabled"
		const shekelUnformattedInput = page.locator('.currencyInput__unformatted[name=shekel]');
		const shekelFormattedInput = page.locator('.currencyInput__formatted[name="formatted-shekel"]');
		await expect(shekelUnformattedInput).toBeDisabled();
		await expect(shekelUnformattedInput).toHaveAttribute('type', 'hidden');
		await expect(shekelUnformattedInput).toHaveValue('97532.95');
		await expect(shekelFormattedInput).toHaveValue('₪97,532.95');
		await expect(shekelFormattedInput).toBeDisabled();
		await expect(shekelFormattedInput).toHaveAttribute('type', 'text');
		await expect(shekelFormattedInput).toHaveAttribute('placeholder', '₪0.00');
		await expect(shekelFormattedInput).toHaveClass(/currencyInput__formatted--positive/);
		await expect(shekelFormattedInput).not.toHaveClass(/currencyInput__formatted--negative/);
		await expect(shekelFormattedInput).not.toHaveClass(/currencyInput__formatted--zero/);

		// Submitting a form returns the correct values
		const demoSubmitForm = page.locator('button.demoForm__submit');
		const demoOutput = page.locator('pre.demoForm__pre');
		await demoSubmitForm.click();
		expect(await demoOutput.textContent()).toMatch(
			JSON.stringify(
				{
					default: '-42069.69',
					'formatted-default': '-$42,069.69',
					colon: '0',
					'formatted-colon': '',
					pound: '1234.56',
					'formatted-pound': '£1,234.56',
					bitcoin: '0.87654321',
					'formatted-bitcoin': '฿0.87654321',
					yen: '5678.9',
					'formatted-yen': '¥5,678.9',
					euro: '-42069.69',
					'formatted-euro': '€ -42.069,69',
					won: '0',
					'formatted-won': '',
					pesos: '999',
					'formatted-pesos': '$ 999',
				},
				null,
				2
			)
		);
	});

	test('Updating an input has the correct behavior', async ({ page }) => {
		const colonUnformattedInput = page.locator('.currencyInput__unformatted[name=colon]');
		const colonFormattedInput = page.locator('.currencyInput__formatted[name="formatted-colon"]');

		// Check the there is no value in the input
		await expect(colonUnformattedInput).toHaveValue('0');
		await expect(colonFormattedInput).toHaveValue('');

		await colonFormattedInput.focus();
		await page.keyboard.type('420,69', { delay: DELAY_FOR_FORMATTED_VALUE_IN_MS });
		await expect(colonFormattedInput).toHaveValue('₡420,69');
		await expect(colonUnformattedInput).toHaveValue('420.69');
		await expect(colonFormattedInput).toHaveClass(/currencyInput__formatted--positive/);
		await expect(colonFormattedInput).not.toHaveClass(/currencyInput__formatted--negative/);
		await expect(colonFormattedInput).not.toHaveClass(/currencyInput__formatted--zero/);

		// Use arrow keys to go back to the first character
		for (let i = 0; i < '₡420,69'.length; i++) await page.keyboard.press('ArrowLeft');
		await page.keyboard.type('-');
		await expect(colonFormattedInput).toHaveValue('-₡420,69');
		await expect(colonUnformattedInput).toHaveValue('-420.69');
		await expect(colonFormattedInput).not.toHaveClass(/currencyInput__formatted--positive/);
		await expect(colonFormattedInput).toHaveClass(/currencyInput__formatted--negative/);
		await expect(colonFormattedInput).not.toHaveClass(/currencyInput__formatted--zero/);

		// Use right arrow keys to position cusror at the end of the input
		for (let i = 0; i < '₡420,69'.length; i++) await page.keyboard.press('ArrowRight');
		// Delete the number but keep the currency symbol and sign
		for (let i = 1; i < '420,69'.length; i++) await page.keyboard.press('Backspace');
		await page.waitForTimeout(DELAY_FOR_FORMATTED_VALUE_IN_MS);
		await expect(colonFormattedInput).toHaveValue('-₡');
		// FIXME: at this point the hidden value should be set to 0 but without formatting `colonFormattedInput`
		await expect(colonUnformattedInput).toHaveValue('-4');

		await page.keyboard.press('Backspace');
		await page.waitForTimeout(DELAY_FOR_FORMATTED_VALUE_IN_MS);
		await expect(colonFormattedInput).toHaveValue('-');
		// FIXME: at this point the hidden value should be set to 0 but without formatting `colonFormattedInput`
		await expect(colonUnformattedInput).toHaveValue('-4');

		await page.keyboard.type('69,42', { delay: DELAY_FOR_FORMATTED_VALUE_IN_MS });
		await expect(colonFormattedInput).toHaveValue('-₡69,42');
		await expect(colonUnformattedInput).toHaveValue('-69.42');

		for (let i = 0; i < '-₡69,42'.length; i++) await page.keyboard.press('Backspace');
		await page.waitForTimeout(DELAY_FOR_FORMATTED_VALUE_IN_MS);
		await expect(colonUnformattedInput).toHaveValue('0');
	});

	test("Incorrect characters can't be entered", async ({ page }) => {
		const colonUnformattedInput = page.locator('.currencyInput__unformatted[name=colon]');
		const colonFormattedInput = page.locator('.currencyInput__formatted[name="formatted-colon"]');

		// Check the there is no value in the input
		await expect(colonUnformattedInput).toHaveValue('0');
		await expect(colonFormattedInput).toHaveValue('');

		// Check typing letters doesn't do anything
		await colonFormattedInput.focus();
		await page.keyboard.type('abc');
		await expect(colonUnformattedInput).toHaveValue('0');
		await expect(colonFormattedInput).toHaveValue('');

		// Check keyboard combinations don't do anything
		await page.keyboard.press('Shift+A');
		await expect(colonFormattedInput).toHaveValue('');

		// Check keyboard shortcuts are allowed
		await page.keyboard.type('420,69', { delay: DELAY_FOR_FORMATTED_VALUE_IN_MS });
		await expect(colonFormattedInput).toHaveValue('₡420,69');
		await expect(colonUnformattedInput).toHaveValue('420.69');

		// Check "Backspace" works
		await selectAll(page);
		await page.keyboard.press('Backspace');
		await page.waitForTimeout(DELAY_FOR_FORMATTED_VALUE_IN_MS);
		await expect(colonUnformattedInput).toHaveValue('0');
		await expect(colonFormattedInput).toHaveValue('');

		// Add data to the field again
		await page.keyboard.type('-420,69', { delay: DELAY_FOR_FORMATTED_VALUE_IN_MS });
		await expect(colonFormattedInput).toHaveValue('-₡420,69');
		await expect(colonUnformattedInput).toHaveValue('-420.69');

		// Check "Delete" also works
		await selectAll(page);
		await page.keyboard.press('Delete');
		await expect(colonUnformattedInput).toHaveValue('0');
		await expect(colonFormattedInput).toHaveValue('');
	});

	test('Placeholders can be overriden', async ({ page }) => {
		// Default placeholder
		const defaultFormattedInput = page.locator(
			'.currencyInput__formatted[name="formatted-default"]'
		);
		await expect(defaultFormattedInput).toHaveAttribute('placeholder', '$0.00');

		// Null placeholder
		const poundFormattedInput = page.locator('.currencyInput__formatted[name="formatted-pound"]');
		await expect(poundFormattedInput).toHaveAttribute('placeholder', '');

		// Overriden placeholder
		const wonFormattedInput = page.locator('.currencyInput__formatted[name="formatted-won"]');
		await expect(wonFormattedInput).toHaveAttribute('placeholder', '₩1,234.56');
	});

	test('Fraction digits can be overriden', async ({ page }) => {
		const bitcoinUnformattedInput = page.locator('.currencyInput__unformatted[name=bitcoin]');
		const bitcoinFormattedInput = page.locator(
			'.currencyInput__formatted[name="formatted-bitcoin"]'
		);

		await expect(bitcoinUnformattedInput).toHaveValue('0.87654321');
		await expect(bitcoinFormattedInput).toHaveValue('฿0.87654321');
		await expect(bitcoinFormattedInput).toHaveAttribute('placeholder', '฿0.00000000');

		await bitcoinFormattedInput.focus();
		await selectAll(page);
		await page.keyboard.press('Backspace');
		await page.waitForTimeout(DELAY_FOR_FORMATTED_VALUE_IN_MS);
		await expect(bitcoinUnformattedInput).toHaveValue('0');
		await expect(bitcoinFormattedInput).toHaveValue('');

		// Decimals beyond the maximum allowed are rounded
		await page.keyboard.type('-0.987654329', { delay: DELAY_FOR_FORMATTED_VALUE_IN_MS });
		await expect(bitcoinUnformattedInput).toHaveValue('-0.98765433');
		await expect(bitcoinFormattedInput).toHaveValue('-฿0.98765433');
	});

	test.describe('Pressing the comma or period keys have the correct behavior', async () => {
		test('Pressing "." gets converted to ","', async ({ page }) => {
			const euroFormattedInput = page.locator('.currencyInput__formatted[name="formatted-euro"]');
			const euroUnformattedInput = page.locator('.currencyInput__unformatted[name=euro]');
			await euroFormattedInput.focus();

			await selectAll(page);
			await page.keyboard.press('Backspace');
			await page.waitForTimeout(DELAY_FOR_FORMATTED_VALUE_IN_MS);
			await expect(euroUnformattedInput).toHaveValue('0');

			await page.keyboard.type('-111222.33', { delay: DELAY_FOR_FORMATTED_VALUE_IN_MS });
			await expect(euroFormattedInput).toHaveValue('€ -111.222,33');
			await expect(euroUnformattedInput).toHaveValue('-111222.33');
		});

		test('Pressing "," gets converted to "."', async ({ page }) => {
			const bitcoinUnformattedInput = page.locator('.currencyInput__unformatted[name=bitcoin]');
			const bitcoinFormattedInput = page.locator(
				'.currencyInput__formatted[name="formatted-bitcoin"]'
			);

			await bitcoinFormattedInput.focus();
			await selectAll(page);
			await page.keyboard.press('Backspace');
			await page.waitForTimeout(DELAY_FOR_FORMATTED_VALUE_IN_MS);
			await expect(bitcoinUnformattedInput).toHaveValue('0');

			await page.keyboard.type('444555,66', { delay: DELAY_FOR_FORMATTED_VALUE_IN_MS });
			await expect(bitcoinFormattedInput).toHaveValue('฿444,555.66');
			await expect(bitcoinUnformattedInput).toHaveValue('444555.66');
		});
	});

	test('Formatting is applied on:blur', async ({ page }) => {
		const euroFormattedInput = page.locator('.currencyInput__formatted[name="formatted-euro"]');
		const euroUnformattedInput = page.locator('.currencyInput__unformatted[name=euro]');
		const colonFormattedInput = page.locator('.currencyInput__formatted[name="formatted-colon"]');

		// The old value should remain because `-` doesn't override it
		await euroFormattedInput.focus();
		await selectAll(page);
		await page.keyboard.type('-');
		await colonFormattedInput.focus();
		await expect(euroFormattedInput).toHaveValue('€ -42.069,69');
		await expect(euroUnformattedInput).toHaveValue('-42069.69');

		// The value is reset to 0 because Backspace overrides it
		await euroFormattedInput.focus();
		await selectAll(page);
		await page.keyboard.press('Backspace');
		await page.waitForTimeout(DELAY_FOR_FORMATTED_VALUE_IN_MS);
		await page.keyboard.type('-');
		await colonFormattedInput.focus();
		await expect(euroFormattedInput).toHaveValue('');
		await expect(euroUnformattedInput).toHaveValue('0');
	});

	test('Pressing Tab has the correct behavior', async ({ page }, testInfo) => {
		// Tabbing in Webkit is broken: https://github.com/Canutin/svelte-currency-input/issues/40
		if (testInfo.project.name !== 'webkit') {
			const formattedInputs = page.locator('.currencyInput__formatted');
			expect(await formattedInputs.count()).toBe(9);

			await formattedInputs.first().focus();
			await expect(formattedInputs.nth(0)).toBeFocused();

			await page.keyboard.press('Tab');
			await expect(formattedInputs.nth(1)).toBeFocused();

			await page.keyboard.press('Tab');
			await expect(formattedInputs.nth(2)).toBeFocused();

			await page.keyboard.press('Tab');
			await expect(formattedInputs.nth(3)).toBeFocused();

			await page.keyboard.press('Tab');
			await expect(formattedInputs.nth(4)).toBeFocused();

			await page.keyboard.press('Tab');
			await expect(formattedInputs.nth(5)).not.toBeFocused(); // The fifth input is disabled
			await expect(formattedInputs.nth(6)).toBeFocused();

			await page.keyboard.press('Tab');
			await expect(formattedInputs.nth(7)).toBeFocused();

			await page.keyboard.press('Tab');
			await expect(formattedInputs.nth(8)).toBeFocused();
		}
	});

	test('Class names can be overwritten', async ({ page }) => {
		const customWrapperClass = page.locator('.custom-wrapper-class');
		const customUnformattedClass = page.locator('.custom-unformatted-class');

		await expect(customWrapperClass).toBeVisible();
		await expect(customWrapperClass).toHaveClass(/currencyInput/); // We don't override the default class
		await expect(customUnformattedClass).toHaveValue('0');
		await expect(customUnformattedClass).not.toHaveClass(/currencyInput__unformatted/); // We override the default class
	});

	test('A callback function is fired when value changes', async ({ page }) => {
		const pesosFormattedInput = page.locator('.currencyInput__formatted[name="formatted-pesos"]');

		// Prepare to assert and accept dialog
		page.on('dialog', (dialog) => {
			expect(dialog.message()).not.toMatch('The value for ARS has changed to: 999');
			expect(dialog.message()).toMatch('The value for ARS has changed to: 99');
			dialog.accept();
		});

		await expect(pesosFormattedInput).toBeVisible();
		await pesosFormattedInput.focus();
		await page.keyboard.press('Backspace');
	});

	test.skip('Updating chained inputs have the correct behavior', async () => {
		// TODO
	});
});
