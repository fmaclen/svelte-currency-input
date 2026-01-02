<script lang="ts">
	import { CurrencyInput } from '$lib/index.js';
	import type { CurrencyInputValues } from '$lib/types.js';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';
	import { INPUT_CLASS } from './styles.js';
	import code from './code-samples/abbreviations.md?raw';

	let value = $state('');
	let values = $state<CurrencyInputValues>({
		float: null,
		formatted: '',
		value: ''
	});
</script>

<Example id="abbreviations" title="Abbreviations" {code}>
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'en-US', currency: 'USD' }}
		placeholder="Try 1k, 2.5m, or 1b"
		class={INPUT_CLASS}
		oninputvalue={(v: CurrencyInputValues) => (values = v)}
	/>
	<ValueDisplay {values} />
</Example>
