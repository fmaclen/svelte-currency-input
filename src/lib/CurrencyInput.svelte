<script lang="ts">
	import {
		DEFAULT_LOCALE,
		DEFAULT_CURRENCY,
		DEFAULT_NAME,
		DEFAULT_VALUE,
		DEFAULT_FRACTION_DIGITS,
		DEFAULT_CLASS_WRAPPER,
		DEFAULT_CLASS_UNFORMATTED,
		DEFAULT_CLASS_FORMATTED,
		DEFAULT_CLASS_FORMATTED_POSITIVE,
		DEFAULT_CLASS_FORMATTED_NEGATIVE,
		DEFAULT_CLASS_FORMATTED_ZERO
	} from '$lib/constants';
	import type { InputClasses, Callback } from '$lib/types';
	import { onMount } from 'svelte';

	// Value and formatting
	export let value: number = DEFAULT_VALUE;
	export let locale: string = DEFAULT_LOCALE;
	export let currency: string = DEFAULT_CURRENCY;
	export let fractionDigits: number = DEFAULT_FRACTION_DIGITS;

	// Input attributes
	export let name: string = DEFAULT_NAME;
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let placeholder: string | number | null = DEFAULT_VALUE;
	export let autocomplete: string | null | undefined = undefined;

	// Behavior options
	export let isNegativeAllowed: boolean = true;
	export let isZeroNullish: boolean = false;

	// Styling
	export let inputClasses: InputClasses | null = null;

	// Callback
	export let onValueChange: Callback = () => {};

	// Private variables
	let inputElement: HTMLInputElement;
	let inputTarget: EventTarget | null;
	let formattedValue = '';

	// Svelte reactive statements
	$: isNegative = value < 0;
	$: isPositive = value > 0;
	$: isZero = !isNegative && !isPositive;
	$: value, setFormattedValue();

	onMount(() => {
		// Set the correct fraction digits when the value is zero on initial load
		setFormattedValue();
	});

	// Formats value as: e.g. $1,523.00 | -$1,523.00
	function formatCurrency(
		value: number,
		maximumFractionDigits?: number,
		minimumFractionDigits?: number
	) {
		return new Intl.NumberFormat(locale, {
			currency: currency,
			style: 'currency',
			maximumFractionDigits: maximumFractionDigits || 0,
			minimumFractionDigits: minimumFractionDigits || 0
		}).format(value);
	}

	// Checks if the key pressed is allowed
	function handleKeyDown(event: KeyboardEvent) {
		const isDeletion = event.key === 'Backspace' || event.key === 'Delete';
		const isModifier = event.metaKey || event.altKey || event.ctrlKey;
		const isArrowKey = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
		const isTab = event.key === 'Tab';
		// Keys that are not a digit, comma, period or minus sign
		const isInvalidCharacter = !/^\d|,|\.|-$/g.test(event.key);

		function isPunctuationDuplicated() {
			// Is `false` because it's not a punctuation key
			if (event.key !== ',' && event.key !== '.') return false;
			if (isDecimalComma) return formattedValue.split(',').length >= 2;
			if (!isDecimalComma) return formattedValue.split('.').length >= 2;
			return false;
		}

		if (
			isPunctuationDuplicated() ||
			(!isDeletion && !isModifier && !isArrowKey && isInvalidCharacter && !isTab)
		)
			event.preventDefault();
	}

	function handlePlaceholder(placeholder: string | number | null) {
		if (typeof placeholder === 'number')
			return formatCurrency(placeholder, fractionDigits, fractionDigits);
		if (placeholder === null) return '';
		return placeholder;
	}

	const currencyDecimal = new Intl.NumberFormat(locale).format(1.1).charAt(1);
	const isDecimalComma = currencyDecimal === ',';
	const currencySymbol = formatCurrency(0, 0)
		.replace('0', '') // e.g. '$0' > '$'
		.replace(/\u00A0/, ''); // e.g '0 €' > '€'

	// Updates `value` by stripping away the currency formatting
	function setUnformattedValue(event?: KeyboardEvent) {
		if (event) {
			// Don't format if the user is typing a `currencyDecimal` point
			if (event.key === currencyDecimal) return;

			// Pressing `.` when the decimal point is `,` gets replaced with `,`
			if (isDecimalComma && event.key === '.')
				// Only replace the last occurence
				formattedValue = formattedValue.replace(/\.([^.]*)$/, currencyDecimal + '$1');

			// Pressing `,` when the decimal point is `.` gets replaced with `.`
			if (!isDecimalComma && event.key === ',')
				// Only replace the last occurence
				formattedValue = formattedValue.replace(/\,([^,]*)$/, currencyDecimal + '$1');

			// Don't format if `formattedValue` is ['$', '-$', '-']
			const ignoreSymbols = [currencySymbol, `-${currencySymbol}`, '-'];
			const strippedUnformattedValue = formattedValue.replace(' ', '');
			if (ignoreSymbols.includes(strippedUnformattedValue)) return;

			inputTarget = event.target;

			// Allow negative values if `isNegativeAllowed` is true
			if (isNegativeAllowed && event.key === '-') value = value * -1;
		}

		// Remove all characters that arent: numbers, commas, periods (or minus signs if `isNegativeAllowed`)
		let unformattedValue = isNegativeAllowed
			? formattedValue.replace(/[^0-9,.-]/g, '')
			: formattedValue.replace(/[^0-9,.]/g, '');

		// If the value is not a number, set it to 0
		if (Number.isNaN(parseFloat(unformattedValue))) {
			value = 0;
		} else {
			// NOTE: The order of the following operations is intentional
			unformattedValue = unformattedValue.replace(isDecimalComma ? /\./g : /\,/g, '');
			if (isDecimalComma) unformattedValue = unformattedValue.replace(',', '.');

			// If the zero-key has been pressed
			// and if the current `value` is the same as the `value` before the key-press
			// formatting may need to be done (Issue #30)
			const previousValue = value;
			value = parseFloat(unformattedValue);

			if (event && previousValue === value) {
				// Do the formatting if the number of digits after the decimal point exceeds `fractionDigits`
				if (
					unformattedValue.includes('.') &&
					unformattedValue.split('.')[1].length > fractionDigits
				) {
					setFormattedValue();
				}
			}
		}
	}

	function setFormattedValue() {
		// Do nothing because the page hasn't mounted yet
		if (!inputElement) return;

		// Previous caret position
		const startCaretPosition = inputElement.selectionStart || 0;
		const previousFormattedValueLength = formattedValue.length;

		// Apply formatting to input
		formattedValue =
			isZero && !isZeroNullish
				? ''
				: formatCurrency(
						value,
						fractionDigits,
						document.activeElement === inputElement ? 0 : fractionDigits
				  );

		// Update `value` after formatting
		setUnformattedValue();

		let retries = 0;
		while (previousFormattedValueLength === formattedValue.length && retries < 10) retries++;

		if (previousFormattedValueLength !== formattedValue.length) {
			const endCaretPosition =
				startCaretPosition + formattedValue.length - previousFormattedValueLength;
			inputElement?.setSelectionRange(endCaretPosition, endCaretPosition);
		}

		// Run callback function when `value` changes
		onValueChange(value);
	}
</script>

<div class={inputClasses?.wrapper ?? DEFAULT_CLASS_WRAPPER}>
	<input
		class={inputClasses?.unformatted ?? DEFAULT_CLASS_UNFORMATTED}
		type="hidden"
		{name}
		{disabled}
		bind:value
	/>
	<input
		class="
			{inputClasses?.formatted ?? DEFAULT_CLASS_FORMATTED}
			{isNegativeAllowed && !isZero && !isNegative
			? inputClasses?.formattedPositive ?? DEFAULT_CLASS_FORMATTED_POSITIVE
			: ''}
			{isZero ? inputClasses?.formattedZero ?? DEFAULT_CLASS_FORMATTED_ZERO : ''}
			{isNegativeAllowed && isNegative
			? inputClasses?.formattedNegative ?? DEFAULT_CLASS_FORMATTED_NEGATIVE
			: ''}
		"
		type="text"
		inputmode={fractionDigits > 0 ? 'decimal' : 'numeric'}
		name={`formatted-${name}`}
		required={required && !isZero}
		placeholder={handlePlaceholder(placeholder)}
		{autocomplete}
		{disabled}
		bind:this={inputElement}
		bind:value={formattedValue}
		on:keydown={handleKeyDown}
		on:keyup={setUnformattedValue}
		on:blur={setFormattedValue}
	/>
</div>

<style>
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
