<script lang="ts">
	import { CurrencyInput } from '$lib/index.js';
	import type { CurrencyInputValues } from '$lib/types.js';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';

	const INPUT_CLASS =
		'w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs focus:border-slate-400 focus:outline-none placeholder:text-slate-400';

	let value = $state('50');
	let values = $state<CurrencyInputValues>({
		float: 50,
		formatted: '$50.00',
		value: '50'
	});
</script>

<Example
	id="minmax"
	title="Min, max, and step"
	code={`<script lang="ts">
  import { CurrencyInput } from '@canutin/svelte-currency-input';
  let value = $state('50');
</script>

<!-- Use arrow keys to step -->
<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-US', currency: 'USD' }}
  min={0}
  max={100}
  step={10}
/>`}
>
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'en-US', currency: 'USD' }}
		min={0}
		max={100}
		step={10}
		placeholder="$0.00"
		class={INPUT_CLASS}
		oninputvalue={(v) => (values = v)}
	/>
	<ValueDisplay {values} />
</Example>
