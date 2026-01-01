<script lang="ts">
	import { CurrencyInput } from '$lib/index.js';
	import type { CurrencyInputValues } from '$lib/types.js';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';

	const INPUT_CLASS =
		'w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs focus:border-slate-400 focus:outline-none placeholder:text-slate-400';

	let value = $state('1234.56');
	let values = $state<CurrencyInputValues>({
		float: 1234.56,
		formatted: '1.234,56 €',
		value: '1234.56'
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
		oninputvalue={(v) => (values = v)}
	/>
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'en-IN', currency: 'INR' }}
		placeholder="₹0.00"
		class={INPUT_CLASS}
		oninputvalue={(v) => (values = v)}
	/>
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'es-PE', currency: 'PEN' }}
		placeholder="S/ 0.00"
		class={INPUT_CLASS}
		oninputvalue={(v) => (values = v)}
	/>
	<ValueDisplay {values} />
</Example>
