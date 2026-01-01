<script lang="ts">
	import { CurrencyInput, formatValue } from '$lib/index.js';
	import type { CurrencyInputValues } from '$lib/types.js';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';

	const INPUT_CLASS =
		'w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs focus:border-slate-400 focus:outline-none placeholder:text-slate-400';

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

<Example
	id="intl"
	title="International currencies"
	code={`<CurrencyInput
  intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
/>

<CurrencyInput
  intlConfig={{ locale: 'en-IN', currency: 'INR' }}
/>

<CurrencyInput
  intlConfig={{ locale: 'es-PE', currency: 'PEN' }}
/>`}
>
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
