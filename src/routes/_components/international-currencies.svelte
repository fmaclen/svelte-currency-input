<script lang="ts">
	import { CurrencyInput, formatValue } from '$lib/index.js';
	import type { CurrencyInputValues } from '$lib/types.js';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';
	import { INPUT_CLASS } from './styles.js';
	import code from './code-samples/international-currencies.md?raw';

	let value = $state('1234.56');

	let eurValues = $derived<CurrencyInputValues>({
		float: value ? parseFloat(value) : null,
		formatted: formatValue({ value, intlConfig: { locale: 'de-DE', currency: 'EUR' } }),
		value
	});

	let inrValues = $derived<CurrencyInputValues>({
		float: value ? parseFloat(value) : null,
		formatted: formatValue({ value, intlConfig: { locale: 'en-IN', currency: 'INR' } }),
		value
	});

	let penValues = $derived<CurrencyInputValues>({
		float: value ? parseFloat(value) : null,
		formatted: formatValue({ value, intlConfig: { locale: 'es-PE', currency: 'PEN' } }),
		value
	});
</script>

<Example id="intl" title="International currencies" {code}>
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
		placeholder="0,00 €"
		class={INPUT_CLASS}
	/>
	<ValueDisplay values={eurValues} />
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'en-IN', currency: 'INR' }}
		placeholder="₹0.00"
		class={INPUT_CLASS}
	/>
	<ValueDisplay values={inrValues} />
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'es-PE', currency: 'PEN' }}
		placeholder="S/ 0.00"
		class={INPUT_CLASS}
	/>
	<ValueDisplay values={penValues} />
</Example>
