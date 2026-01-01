<script lang="ts">
	import { CurrencyInput } from '$lib/index.js';
	import type { CurrencyInputValues } from '$lib/types.js';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';

	const INPUT_CLASS =
		'w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs focus:border-slate-400 focus:outline-none placeholder:text-slate-400';

	let value = $state('');
	let values = $state<CurrencyInputValues>({
		float: null,
		formatted: '',
		value: ''
	});
</script>

<Example
	id="abbreviations"
	title="Abbreviations"
	code={`<script lang="ts">
  import { CurrencyInput } from '@canutin/svelte-currency-input';
  let value = $state('');
</script>

<!-- Type 1k, 2.5m, or 1b -->
<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-US', currency: 'USD' }}
/>`}
>
	<CurrencyInput
		bind:value
		intlConfig={{ locale: 'en-US', currency: 'USD' }}
		placeholder="Try 1k, 2.5m, or 1b"
		class={INPUT_CLASS}
		oninputvalue={(v) => (values = v)}
	/>
	<ValueDisplay {values} />
</Example>
