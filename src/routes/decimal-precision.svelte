<script lang="ts">
	import { CurrencyInput } from '$lib/index';
	import type { CurrencyInputValues } from '$lib/types';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';
	import { INPUT_CLASS } from './styles';
	import code from './decimal-precision.txt?raw';

	let value = $state('99.99');
	let values = $state<CurrencyInputValues>({
		float: 99.99,
		formatted: '$99.99',
		value: '99.99'
	});
</script>

<Example id="decimals" title="Decimal precision" {code}>
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
