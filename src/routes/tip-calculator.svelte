<script lang="ts">
	import { CurrencyInput, formatValue } from '$lib/index.js';
	import Example from './example.svelte';

	const INPUT_CLASS =
		'w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs focus:border-slate-400 focus:outline-none placeholder:text-slate-400';

	let billValue = $state('8550');
	let tipPercent = $state(18);

	let tipAmount = $derived(() => {
		const bill = parseFloat(billValue.replace(',', '.')) || 0;
		return ((bill * tipPercent) / 100).toFixed(2);
	});

	let totalAmount = $derived(() => {
		const bill = parseFloat(billValue.replace(',', '.')) || 0;
		const tip = parseFloat(tipAmount()) || 0;
		return (bill + tip).toFixed(2);
	});
</script>

<Example
	id="tip"
	title="Tip calculator"
	code={`<script lang="ts">
  import { CurrencyInput, formatValue } from '@canutin/svelte-currency-input';

  const intlConfig = { locale: 'es-AR', currency: 'ARS' };
  let bill = $state('8550');
  let tipPercent = $state(18);

  let tip = $derived(() => {
    const amount = parseFloat(bill) || 0;
    return ((amount * tipPercent) / 100).toFixed(2);
  });

  let total = $derived(() => {
    return (parseFloat(bill) + parseFloat(tip())).toFixed(2);
  });
<\/script>

<CurrencyInput bind:value={bill} {intlConfig} />
<input type="range" bind:value={tipPercent} min="0" max="30" />

<p>Tip: {formatValue({ value: tip(), intlConfig })}</p>
<p>Total: {formatValue({ value: total(), intlConfig })}</p>`}
>
	<div class="grid grid-cols-2 gap-2">
		<CurrencyInput
			bind:value={billValue}
			intlConfig={{ locale: 'es-AR', currency: 'ARS' }}
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
				{formatValue({ value: tipAmount(), intlConfig: { locale: 'es-AR', currency: 'ARS' } })}
			</span>
		</div>
		<div class="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
			<span class="text-slate-400">Total</span>
			<span class="ml-2 font-mono">
				{formatValue({ value: totalAmount(), intlConfig: { locale: 'es-AR', currency: 'ARS' } })}
			</span>
		</div>
	</div>
</Example>
