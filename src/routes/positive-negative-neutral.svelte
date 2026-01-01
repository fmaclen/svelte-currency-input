<script lang="ts">
	import { CurrencyInput } from '$lib/index.js';
	import type { CurrencyInputValues } from '$lib/types.js';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';

	const INPUT_CLASS =
		'w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs focus:border-slate-400 focus:outline-none placeholder:text-slate-400';

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

<Example
	id="styling"
	title="Positive, negative, and neutral styling"
	code={`<script lang="ts">
  import { CurrencyInput } from '@canutin/svelte-currency-input';
  let value = $state('-3.14');

  const getColor = (val: string) => {
    if (!val || val === '-') return '';
    const num = parseFloat(val);
    if (num === 0) return 'text-slate-400';
    return num < 0 ? 'text-rose-500' : 'text-emerald-500';
  };
<\/script>

<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-GB', currency: 'GBP' }}
  class={getColor(value)}
/>`}
>
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'en-GB', currency: 'GBP' }}
		placeholder="£0.00"
		class="{INPUT_CLASS} {getValueColor(value)}"
		oninputvalue={(v) => (values = v)}
	/>
	<ValueDisplay {values} />
</Example>
