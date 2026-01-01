<script lang="ts">
	import { CurrencyInput } from '$lib/index.js';
	import type { CurrencyInputValues } from '$lib/types.js';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';

	const INPUT_CLASS =
		'w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs focus:border-slate-400 focus:outline-none placeholder:text-slate-400';

	let value = $state('99.99');
	let values = $state<CurrencyInputValues>({
		float: 99.99,
		formatted: '$99.99',
		value: '99.99'
	});
</script>

<Example
	id="decimals"
	title="Decimal precision"
	code={`<script lang="ts">
  import { CurrencyInput } from '@canutin/svelte-currency-input';
  let value = $state('99.99');
<\/script>

<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-US', currency: 'USD' }}
  decimalsLimit={2}
  decimalScale={2}
/>`}
>
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'en-US', currency: 'USD' }}
		decimalsLimit={2}
		decimalScale={2}
		placeholder="$0.00"
		class={INPUT_CLASS}
		oninputvalue={(v) => (values = v)}
	/>
	<ValueDisplay {values} />
</Example>
