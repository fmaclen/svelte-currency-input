<script lang="ts">
	import { CurrencyInput, formatValue } from '$lib/index';
	import Example from './example.svelte';
	import { INPUT_CLASS } from './styles';
	import code from './argentina-rates.txt?raw';

	const arsConfig = { locale: 'es-AR', currency: 'ARS' };
	const usdConfig = { locale: 'es-AR', currency: 'USD' };

	const dollarRates = [
		{ name: 'Oficial', rate: 1495 },
		{ name: 'MEP', rate: 1503.6 },
		{ name: 'Blue', rate: 1530 },
		{ name: 'CCL', rate: 1534.9 },
		{ name: 'Cripto', rate: 1549.72 },
		{ name: 'Tarjeta', rate: 1943.5 }
	];

	let usdAmount = $state<number | null>(1);

	function formatUSD(value: number): string {
		return formatValue({ value: value.toFixed(2), intlConfig: usdConfig });
	}

	function formatARS(value: number): string {
		return formatValue({ value: value.toFixed(2), intlConfig: arsConfig, suffix: ' ARS' });
	}
</script>

<Example id="one-usd" title="One USD, many pesos" {code}>
	<div class="flex flex-col gap-3">
		<CurrencyInput
			value={usdAmount != null ? String(usdAmount) : ''}
			oninputvalue={(v) => (usdAmount = v.float)}
			intlConfig={usdConfig}
			placeholder="US$ 0,00"
			class={INPUT_CLASS}
		/>
		<table class="w-full text-xs">
			<tbody>
				{#each dollarRates as { name, rate } (name)}
					<tr class="border-b border-slate-100 last:border-b-0">
						<td class="py-2 font-medium text-slate-600">{name}</td>
						<td class="py-2 font-mono text-slate-400">{formatUSD(rate)}</td>
						<td class="py-2 font-mono font-medium text-slate-800"
							>{formatARS((usdAmount ?? 0) * rate)}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</Example>
