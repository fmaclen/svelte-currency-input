<script lang="ts">
	import { CurrencyInput } from '$lib/index';
	import type { CurrencyInputValues } from '$lib/types';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';
	import { INPUT_CLASS } from './styles';
	import code from './custom-prefix-suffix.txt?raw';

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

<Example id="custom" title="Custom prefix and suffix" {code}>
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
