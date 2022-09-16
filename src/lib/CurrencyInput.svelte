<script lang="ts">
	export let value: number = 0;
	export let locale: string = 'en-US';
	export let currency: string = 'USD';
	export let name: string = 'total';
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let isNegativeAllowed: boolean = true;

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
	const currencySymbol = formatCurrency(0, 0)
		.replace('0', '') // e.g. '$0' > '$'
		.replace(/\u00A0/, ''); // e.g '0 €' > '€'
	const currencyDecimal = new Intl.NumberFormat(locale).format(1.1).charAt(1); // '.' or ','

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
			// The order of the following operations is *critical*
			const isDecimalComma = currencyDecimal === ','; // Remove currency formatting from `formattedValue` so we can assign it to `value`
			unformattedValue = unformattedValue.replace(isDecimalComma ? /\./g : /\,/g, ''); // Remove all group symbols
			if (isDecimalComma) unformattedValue = unformattedValue.replace(',', '.'); // If the decimal point is a comma, replace it with a period
			value = parseFloat(unformattedValue);
		}
	};

	const applyFormatting = () => {
		formattedValue = isZero ? '' : formatCurrency(value, 2, 0);
	};
</script>

<div class="currencyInput">
	<input class="currencyInput__unformatted" type="hidden" {name} {disabled} bind:value />
	<input
		class="
			currencyInput__formatted
			{isNegativeAllowed && !isZero && !isNegative && 'currencyInput__formatted--positive'}
			{isZero && 'currencyInput__formatted--zero'}
			{isNegativeAllowed && isNegative && 'currencyInput__formatted--negative'}
		"
		type="text"
		inputmode="numeric"
		name={`formatted-${name}`}
		required={required && !isZero}
		{placeholder}
		{disabled}
		bind:value={formattedValue}
		on:keyup={setValue}
	/>
</div>

<style>
	div.currencyInput {
		display: flex;
		flex-direction: column;
	}

	input.currencyInput__formatted {
		border: 1px solid #e2e2e2;
		padding: 10px;
		box-sizing: border-box;
	}

	input.currencyInput__formatted--zero {
		color: #333;
	}

	input.currencyInput__formatted--positive {
		color: #00a36f;
	}

	input.currencyInput__formatted--negative {
		color: #e75258;
	}

	input.currencyInput__formatted:disabled {
		color: #999;
		background-color: #e2e2e2;
		pointer-events: none;
		cursor: default;
	}
</style>
