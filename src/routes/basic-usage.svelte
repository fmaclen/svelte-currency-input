<script lang="ts">
	import { CurrencyInput } from '$lib/index';
	import type { CurrencyInputValues } from '$lib/types';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';
	import { INPUT_CLASS } from './styles';
	import code from './basic-usage.txt?raw';

	let value = $state('1234.56');
	let values = $state<CurrencyInputValues>({
		float: 1234.56,
		formatted: '$1,234.56',
		value: '1234.56'
	});
</script>

<Example id="basic" title="Basic usage" {code}>
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'en-US', currency: 'USD' }}
		placeholder="$0.00"
		class={INPUT_CLASS}
		oninputvalue={(v) => (values = v)}
	/>
	<ValueDisplay {values} />
</Example>
