<script lang="ts">
	import { CurrencyInput, formatValue } from '$lib/index';
	import type { CurrencyInputValues } from '$lib/types';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';
	import { INPUT_CLASS } from './styles';
	import code from './chained-inputs.txt?raw';

	let value = $state('1000');

	let usdValues = $derived<CurrencyInputValues>({
		float: value ? parseFloat(value) : null,
		formatted: formatValue({ value, intlConfig: { locale: 'en-US', currency: 'USD' } }),
		value
	});

	let eurValues = $derived<CurrencyInputValues>({
		float: value ? parseFloat(value) : null,
		formatted: formatValue({ value, intlConfig: { locale: 'de-DE', currency: 'EUR' } }),
		value
	});

	let gbpValues = $derived<CurrencyInputValues>({
		float: value ? parseFloat(value) : null,
		formatted: formatValue({ value, intlConfig: { locale: 'en-GB', currency: 'GBP' } }),
		value
	});
</script>

<Example id="chained" title="Chained inputs" {code}>
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'en-US', currency: 'USD' }}
		placeholder="$0.00"
		class={INPUT_CLASS}
	/>
	<ValueDisplay values={usdValues} />
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
		placeholder="0,00 €"
		class={INPUT_CLASS}
	/>
	<ValueDisplay values={eurValues} />
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'en-GB', currency: 'GBP' }}
		placeholder="£0.00"
		class="{INPUT_CLASS} bg-slate-100 text-slate-400"
		disabled
	/>
	<ValueDisplay values={gbpValues} />
</Example>
