<script lang="ts">
	export let value: number;
	export let name: string;
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let isNegativeAllowed: boolean = true;
	export let locale: string = 'en-US';
	export let currency: string = 'USD';

	let formattedValue = '';
	$: isZero = value === 0;
	$: isNegative = value < 0;
	$: value, applyFormatting();

	// Formats value as: e.g. $1,523.00 | -$1,523.00
	const formatCurrency = (
		value: number,
		maximumFractionDigits?: number,
		minimumFractionDigits?: number
	) => {
		return new Intl.NumberFormat(locale, {
			currency: currency,
			style: 'currency',
			maximumFractionDigits: maximumFractionDigits || 0,
			minimumFractionDigits: minimumFractionDigits || 0
		}).format(value);
	};

	const placeholder = formatCurrency(0, 2, 2); // e.g. '$0.00'
	const currencySymbol = formatCurrency(0, 0).replace('0', ''); // e.g. '$'
	const currencyDecimal = new Intl.NumberFormat(locale).format(1.1).charAt(1); // '.' or ','
	const currenctInputName = `currency${name.replace(/^./g, ($1) => $1.toUpperCase())}`;

	// Updates `value` by stripping away the currency formatting
	const setValue = (event?: KeyboardEvent) => {
		// Don't format if the user is typing a currencyDecimal point
		if (event?.key === currencyDecimal) return;

		// If `formattedValue` is ['$', '-$', "-"] we don't need to continue
		const ignoreSymbols = [currencySymbol, `-${currencySymbol}`, '-'];
		const strippedUnformattedValue = formattedValue.replace(' ', '');
		if (ignoreSymbols.includes(strippedUnformattedValue)) return;

		// Remove all characters that arent: numbers, commas, periods (or minus signs if `isNegativeAllowed`)
		let unformattedValue = isNegativeAllowed
			? formattedValue.replace(/[^0-9,.-]/g, '')
			: formattedValue.replace(/[^0-9,.]/g, '');

		// Reverse the value when minus is pressed
		if (isNegativeAllowed && event?.key === '-') value = value * -1;

		// Finally set the value
		if (Number.isNaN(parseFloat(unformattedValue))) {
			value = 0;
		} else {
			const isDecimalComma = currencyDecimal === ','; // Remove currency formatting from `formattedValue` so we can assign it to `value`
			if (isDecimalComma) unformattedValue = unformattedValue.replace(',', '.'); // If the decimal point is a comma, replace it with a period
			unformattedValue = unformattedValue.replace(isDecimalComma ? /\./g : /\,/g, ''); // Remove all group symbols
			value = parseFloat(unformattedValue);
		}
	};

	const applyFormatting = () => {
		formattedValue = isZero ? '' : formatCurrency(value, 2, 0);
	};
</script>

<div class="currencyInput">
	<input class="currencyInput__input" type="hidden" {name} {disabled} bind:value />
	<input
		class="
			currencyInput__currency
			{isNegativeAllowed && !isZero && !isNegative && 'currencyInput__currency--positive'}
			{isZero && 'currencyInput__currency--zero'}
			{isNegativeAllowed && isNegative && 'currencyInput__currency--negative'}
		"
		type="text"
		inputmode="numeric"
		name={currenctInputName}
		required={required && !isZero}
		{placeholder}
		{disabled}
		bind:value={formattedValue}
		on:keyup={setValue}
	/>
</div>

<style lang="scss">
	div.currencyInput {
		display: flex;
		flex-direction: column;
	}

	input.currencyInput__currency {
		background-color: var(--color-white);
		border: 2px solid var(--color-border);
		border-radius: 4px;
		padding: 10px;
		font-family: var(--font-sansSerif);
		font-size: 12px;
		box-sizing: border-box;
		/* background-color: var(--input-background-color);
		border-width: var(--input-border-width);
		border-style: var(--input-border-style);
		border-radius: var(--input-border-radius);
		border-color: var(--input-border-color);
		padding: var(--input-padding);
		font-family: var(--input-font-family);
		font-size: var(--input-font-size);
		box-sizing: var(--input-box-sizing); */

		&:active,
		&:focus {
			outline-color: var(--color-bluePrimary);
			outline-style: auto;
			/* outline-color: var(--input-active-outline-color);
			outline-style: var(--input-active-outline-style); */
		}

		font-family: var(--font-monospace);

		&--positive {
			color: var(--color-greenPrimary);
		}

		&--zero {
			color: var(--color-grey80);
		}

		&--negative {
			color: var(--color-redPrimary);
		}

		&--error {
			border-color: var(--color-redPrimary);
		}

		&::placeholder {
			color: var(--color-grey40);
		}

		&:disabled {
			pointer-events: none;
			background-color: var(--color-grey10);
			color: var(--color-grey40);
			cursor: default;
		}
	}
</style>
