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
		formatted: '$1,234.56',
		value: '1234.56'
	});
</script>

<Example
	id="basic"
	title="Basic usage"
	code={`<script lang="ts">
  import { CurrencyInput } from '@canutin/svelte-currency-input';
  let value = $state('1234.56');
<\/script>

<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-US', currency: 'USD' }}
/>`}
>
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'en-US', currency: 'USD' }}
		placeholder="$0.00"
		class={INPUT_CLASS}
		oninputvalue={(v) => (values = v)}
	/>
	<ValueDisplay {values} />
</Example>
