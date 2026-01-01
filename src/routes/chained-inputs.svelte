<script lang="ts">
	import { CurrencyInput, formatValue } from '$lib/index.js';
	import type { CurrencyInputValues } from '$lib/types.js';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';

	const INPUT_CLASS =
		'w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs focus:border-slate-400 focus:outline-none placeholder:text-slate-400';

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

<Example
	id="chained"
	title="Chained inputs"
	code={`<script lang="ts">
  import { CurrencyInput } from '@canutin/svelte-currency-input';
  let value = $state('1000');
<\/script>

<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-US', currency: 'USD' }}
/>
<CurrencyInput
  bind:value
  intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
/>
<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-GB', currency: 'GBP' }}
  disabled
/>`}
>
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
