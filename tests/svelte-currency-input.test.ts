import { expect, test, type Page } from '@playwright/test';

const DELAY_FOR_FORMATTED_VALUE_IN_MS = 25;

const isMacOs = process.platform === 'darwin';
const selectAll = async (page: Page) => {
	isMacOs ? await page.keyboard.press('Meta+A') : await page.keyboard.press('Control+A');
};

// HACK:
// This is a workaround because Playwright starts running the assertions immediately
// after the DOM loads but the component is updated a few milliseconds later.
// This causes a race condition in some tests causing assertions to fail.
//
// The real solution would be to figure out why some fields are not already updated
// when the component is mounted, or why is it triggering a re-render.
// REF: https://github.com/fmaclen/svelte-currency-input/issues/62
const waitForInitialLoad = async (page: Page) => {
	const DELAY_IN_MS = 100;
	await page.waitForTimeout(DELAY_IN_MS);
}

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
		await expect(yenFormattedInput).toHaveValue('¥5,678.90');
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
		const demoSubmitForm = page.locator('button#submit-form');
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
					'formatted-yen': '¥5,678.90',
					euro: '-42069.69',
					'formatted-euro': '€ -42.069,69',
					won: '0',
					'formatted-won': '',
					pesos: '999',
					'formatted-pesos': '$ 999,00',
					rupees: '678',
					'formatted-rupees': '₹678.000',
					soles: '0',
					'formatted-soles': 'S/ 0.00',
					dinars: '0',
					'formatted-dinars': '',
					'chained-east-caribbean-dollar': '10000',
					'formatted-chained-east-caribbean-dollar': 'EC$10,000.0000',
					'chained-euros': '10000',
					'formatted-chained-euros': '€ 10.000,00',
					'chained-dollars': '10000',
					'formatted-chained-dollars': '$10,000'
				},
				null,
				2
			)
		);
	});

	test('Updating an input has the correct behavior', async ({ page }) => {
		await waitForInitialLoad(page);

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
		await waitForInitialLoad(page);

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
			await waitForInitialLoad(page);

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
			await waitForInitialLoad(page);

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
			expect(await formattedInputs.count()).toBe(15);

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

	test('Autocomplete attribute can be set', async ({ page }) => {
		const pesosFormattedInput = page.locator('.currencyInput__formatted[name="formatted-pesos"]');
		await expect(pesosFormattedInput).toHaveAttribute('autocomplete', 'off');
	});

	test('A value with zero cents and more than 1 fraction digits gets formatted on blur', async ({ page }) => {
		const rupeesFormattedInput = page.locator('.currencyInput__formatted[name="formatted-rupees"]');
		const rupeesUnformattedInput = page.locator('.currencyInput__unformatted[name="rupees"]');
		await expect(rupeesFormattedInput).toHaveValue('₹678.000');
		await expect(rupeesUnformattedInput).toHaveValue('678');

		await rupeesFormattedInput.focus();
		await selectAll(page);
		await page.keyboard.press('Backspace');
		await page.keyboard.type('123');
		await expect(rupeesFormattedInput).toHaveValue('₹123');
		await expect(rupeesFormattedInput).not.toHaveValue('₹123.000');

		await page.locator('body').click(); // Click outside the input to trigger formatting
		await expect(rupeesFormattedInput).toHaveValue('₹123.000');
		await expect(rupeesUnformattedInput).toHaveValue('123');
	});

	test("isZeroNullish doesn't render placeholder when the value is 0", async ({ page }) => {
		const solesUnformattedInput = page.locator('.currencyInput__unformatted[name="soles"]');
		const solesFormattedInput = page.locator('.currencyInput__formatted[name="formatted-soles"]');
		await expect(solesUnformattedInput).toHaveValue('0');
		await expect(solesFormattedInput).toHaveValue('S/ 0.00');
		await expect(solesFormattedInput).toHaveAttribute('placeholder', '');

		const colonUnformattedInput = page.locator('.currencyInput__unformatted[name=colon]');
		const colonFormattedInput = page.locator('.currencyInput__formatted[name="formatted-colon"]');
		await expect(colonUnformattedInput).toHaveValue('0');
		await expect(colonFormattedInput).not.toHaveValue('₡0,00');
		await expect(colonFormattedInput).toHaveAttribute('placeholder', '₡0,00');
	});

	test("A custom placeholder can be set", async ({ page }) => {
		const dinarsUnformattedInput = page.locator('.currencyInput__unformatted[name="dinars"]');
		const dinarsFormattedInput = page.locator('.currencyInput__formatted[name="formatted-dinars"]');
		await expect(dinarsUnformattedInput).toHaveValue('0');
		await expect(dinarsFormattedInput).toHaveValue('');
		await expect(dinarsFormattedInput).toHaveAttribute('placeholder', 'How many Dinars?');
	});

	test('Prevent duplicated decimal points', async ({ page }) => {
		// Periods as decimals
		const poundUnformattedInput = page.locator('.currencyInput__unformatted[name=pound]');
		const poundFormattedInput = page.locator('.currencyInput__formatted[name="formatted-pound"]');
		await expect(poundUnformattedInput).toHaveValue('1234.56');
		await expect(poundFormattedInput).toHaveValue('£1,234.56');

		await poundFormattedInput.focus();
		await page.keyboard.type('....');
		await expect(poundUnformattedInput).toHaveValue('1234.56');
		await expect(poundFormattedInput).toHaveValue('£1,234.56');

		// Commas as decimals
		const colonUnformattedInput = page.locator('.currencyInput__unformatted[name=colon]');
		const colonFormattedInput = page.locator('.currencyInput__formatted[name="formatted-colon"]');
		await expect(colonUnformattedInput).toHaveValue('0');
		await expect(colonFormattedInput).toHaveValue('');

		await colonFormattedInput.focus();
		await page.keyboard.type('123,,,,,');
		await expect(colonUnformattedInput).toHaveValue('123');
		await expect(colonFormattedInput).toHaveValue('₡123,');

		// Pressing multiple commas when locale for decimals is a period
		const dinarsUnformattedInput = page.locator('.currencyInput__unformatted[name="dinars"]');
		const dinarsFormattedInput = page.locator('.currencyInput__formatted[name="formatted-dinars"]');
		await expect(dinarsUnformattedInput).toHaveValue('0');
		await expect(dinarsFormattedInput).toHaveValue('');

		await dinarsFormattedInput.focus();
		await page.keyboard.type('123,,,,,');
		await expect(dinarsUnformattedInput).toHaveValue('123');
		await expect(dinarsFormattedInput).toHaveValue('RSD 123.');
	});

	test("inputmode is set correctly based on fractionDigits", async ({ page }) => {
		// fractionDigits == undefined (defaults to 2)
		const solesFormattedInput = page.locator('.currencyInput__formatted[name="formatted-soles"]');
		await expect(solesFormattedInput).toHaveAttribute('inputmode', 'decimal');

		// fractionDigits == 3
		const rupeesFormattedInput = page.locator('.currencyInput__formatted[name="formatted-rupees"]');
		await expect(rupeesFormattedInput).toHaveAttribute('inputmode', 'decimal');

		// fractionDigits == 0
		const dinarsFormattedInput = page.locator('.currencyInput__formatted[name="formatted-dinars"]');
		await expect(dinarsFormattedInput).toHaveAttribute('inputmode', 'numeric');
	});

	test('Updating chained inputs have the correct behavior', async ({ page }) => {
		const chainedDollarsUnformattedInput = page.locator(
			'.currencyInput__unformatted[name="chained-dollars"]'
		);
		const chainedDollarsFormattedInput = page.locator(
			'.currencyInput__formatted[name="formatted-chained-dollars"]'
		);
		const chainedEurosUnformattedInput = page.locator(
			'.currencyInput__unformatted[name="chained-euros"]'
		);
		const chainedEurosFormattedInput = page.locator(
			'.currencyInput__formatted[name="formatted-chained-euros"]'
		);
		const chainedEastCaribbeanDollarUnformattedInput = page.locator(
			'.currencyInput__unformatted[name="chained-east-caribbean-dollar"]'
		);
		const chainedEastCaribbeanDollarFormattedInput = page.locator(
			'.currencyInput__formatted[name="formatted-chained-east-caribbean-dollar"]'
		);
		const chainedValueButton = page.locator('button#set-chained-value');

		// The default chained value is `9999.99` but because `chainedDollars` has
		// fraction digits set to `0` it gets rounded to `10_000` onMount(),
		// thus updating the other chained inputs to `10_000` as well.
		await expect(chainedDollarsUnformattedInput).toHaveValue('10000');
		await expect(chainedDollarsFormattedInput).toHaveValue('$10,000');
		await expect(chainedEurosUnformattedInput).toHaveValue('10000');
		await expect(chainedEurosFormattedInput).toHaveValue('€ 10.000,00');
		await expect(chainedEastCaribbeanDollarUnformattedInput).toHaveValue('10000');
		await expect(chainedEastCaribbeanDollarFormattedInput).toHaveValue('EC$10,000.0000');

		// Set a new chained value by clicking a button
		await chainedValueButton.click();
		// USD input has fraction digits is 0
		await expect(chainedDollarsUnformattedInput).toHaveValue('421');
		await expect(chainedDollarsFormattedInput).toHaveValue('$421');
		// EUR input has fraction digits is 2
		await expect(chainedEurosFormattedInput).toHaveValue('€ 420,69');
		await expect(chainedEurosUnformattedInput).toHaveValue('420.69');
		// XCD input has fraction digits is 4
		await expect(chainedEastCaribbeanDollarUnformattedInput).toHaveValue('420.69');
		await expect(chainedEastCaribbeanDollarFormattedInput).toHaveValue('EC$420.6900');

		// Set a new chained value by deleting the value in the USD input
		await chainedDollarsFormattedInput.focus();
		await selectAll(page);
		await page.keyboard.press('Backspace');
		await expect(chainedDollarsUnformattedInput).toHaveValue('0');
		await expect(chainedDollarsFormattedInput).toHaveValue('');
		await expect(chainedEurosUnformattedInput).toHaveValue('0');
		await expect(chainedEurosFormattedInput).toHaveValue('');
		await expect(chainedEastCaribbeanDollarUnformattedInput).toHaveValue('0');
		await expect(chainedEastCaribbeanDollarFormattedInput).toHaveValue('');
	});

	test('an id can be set', async ({ page }) => {
		const fourTwentySixNineInput = page.locator('#four-twenty-six-nine');
		await expect(fourTwentySixNineInput).toBeVisible();
		await expect(fourTwentySixNineInput).toHaveValue('-$42,069.69');
	});
});
