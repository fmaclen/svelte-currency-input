<script lang="ts">
	import { CurrencyInput } from '$lib/index.js';
	import type { CurrencyInputValues } from '$lib/types.js';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';

	const INPUT_CLASS =
		'w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs focus:border-slate-400 focus:outline-none placeholder:text-slate-400';

	let customValue = $state('1500');
	let customValues = $state<CurrencyInputValues>({
		float: 1500,
		formatted: '1,500 pts',
		value: '1500'
	});

	let btcValue = $state('0.00042069');
	let btcValues = $state<CurrencyInputValues>({
		float: 0.00042069,
		formatted: '₿ 0.00042069',
		value: '0.00042069'
	});
</script>

<Example
	id="custom"
	title="Custom prefix and suffix"
	code={`<CurrencyInput
  suffix=" pts"
  decimalsLimit={0}
/>

<CurrencyInput
  prefix="₿ "
  decimalsLimit={8}
/>`}
>
	<CurrencyInput
		bind:value={customValue}
		suffix=" pts"
		decimalsLimit={0}
		placeholder="0 pts"
		class={INPUT_CLASS}
		oninputvalue={(v) => (customValues = v)}
	/>
	<ValueDisplay values={customValues} />
	<CurrencyInput
		bind:value={btcValue}
		prefix="₿ "
		decimalsLimit={8}
		placeholder="₿ 0.00000000"
		class={INPUT_CLASS}
		oninputvalue={(v) => (btcValues = v)}
	/>
	<ValueDisplay values={btcValues} />
</Example>
