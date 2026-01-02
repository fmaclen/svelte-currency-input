<script lang="ts">
	import { CurrencyInput } from '$lib/index';
	import type { CurrencyInputValues } from '$lib/types';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';
	import { INPUT_CLASS } from './styles';
	import code from './min-max-step.txt?raw';

	let value = $state('50');
	let values = $state<CurrencyInputValues>({
		float: 50,
		formatted: '$50.00',
		value: '50'
	});
</script>

<Example id="minmax" title="Min, max, and step" {code}>
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
