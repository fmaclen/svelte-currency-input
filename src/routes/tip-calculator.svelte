<script lang="ts">
	import { CurrencyInput, formatValue } from '$lib/index.js';
	import Example from './example.svelte';

	const INPUT_CLASS =
		'w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs focus:border-slate-400 focus:outline-none placeholder:text-slate-400';

	const intlConfig = { locale: 'es-AR', currency: 'ARS' };

	let billFloat = $state(250.75);
	let tipPercent = $state(18);

	let tipAmount = $derived(((billFloat * tipPercent) / 100).toFixed(2));
	let totalAmount = $derived((billFloat + Number(tipAmount)).toFixed(2));
</script>

<Example
	id="tip"
	title="Tip calculator"
	code={`<script lang="ts">
  import { CurrencyInput, formatValue } from '@canutin/svelte-currency-input';

  const intlConfig = { locale: 'es-AR', currency: 'ARS' };
  let billFloat = $state(250.75);
  let tipPercent = $state(18);

  let tipAmount = $derived(((billFloat * tipPercent) / 100).toFixed(2));
  let totalAmount = $derived((billFloat + Number(tipAmount)).toFixed(2));
</script>

<CurrencyInput
  value={String(billFloat)}
  oninputvalue={(v) => (billFloat = v.float ?? 0)}
  {intlConfig}
/>
<input type="range" bind:value={tipPercent} min="0" max="30" />

<p>Tip: {formatValue({ value: tipAmount, intlConfig })}</p>
<p>Total: {formatValue({ value: totalAmount, intlConfig })}</p>`}
>
	<div class="grid grid-cols-2 gap-2">
		<CurrencyInput
			value={String(billFloat)}
			oninputvalue={(v) => (billFloat = v.float ?? 0)}
			{intlConfig}
			placeholder="$ 0,00"
			class={INPUT_CLASS}
		/>
		<div class="flex items-center gap-2">
			<input type="range" bind:value={tipPercent} min="0" max="30" class="flex-1" />
			<span class="w-10 text-right font-mono text-xs text-slate-600">{tipPercent}%</span>
		</div>
		<div class="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
			<span class="text-slate-400">Tip</span>
			<span class="ml-2 font-mono">
				{formatValue({ value: tipAmount, intlConfig })}
			</span>
		</div>
		<div class="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
			<span class="text-slate-400">Total</span>
			<span class="ml-2 font-mono">
				{formatValue({ value: totalAmount, intlConfig })}
			</span>
		</div>
	</div>
</Example>
