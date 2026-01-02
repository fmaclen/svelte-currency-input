<script lang="ts">
	import { CurrencyInput } from '$lib/index';
	import type { CurrencyInputValues } from '$lib/types';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';
	import { INPUT_CLASS } from './styles';
	import code from './code-samples/positive-negative-neutral.md?raw';

	let value = $state('-3.14');
	let values = $state<CurrencyInputValues>({
		float: -3.14,
		formatted: '-£3.14',
		value: '-3.14'
	});

	const getValueColor = (val: string) => {
		if (!val || val === '-') return '';
		const num = parseFloat(val);
		if (num === 0) return 'text-slate-400';
		return num < 0 ? 'text-rose-500' : 'text-emerald-500';
	};
</script>

<Example id="styling" title="Positive, negative, and neutral styling" {code}>
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'en-GB', currency: 'GBP' }}
		placeholder="£0.00"
		class="{INPUT_CLASS} {getValueColor(value)}"
		oninputvalue={(v: CurrencyInputValues) => (values = v)}
	/>
	<ValueDisplay {values} />
</Example>
