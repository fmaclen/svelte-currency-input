<script lang="ts">
	import { CurrencyInput } from '$lib/index';
	import type { CurrencyInputValues, IntlConfig } from '$lib/types';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';
	import { INPUT_CLASS } from './styles';
	import code from './international-currencies.txt?raw';

	const presets: { label: string; intlConfig: IntlConfig }[] = [
		{ label: 'de-DE (EUR)', intlConfig: { locale: 'de-DE', currency: 'EUR' } },
		{ label: 'ja-JP (JPY)', intlConfig: { locale: 'ja-JP', currency: 'JPY' } },
		{ label: 'en-IN (INR)', intlConfig: { locale: 'en-IN', currency: 'INR' } },
		{ label: 'es-PE (PEN)', intlConfig: { locale: 'es-PE', currency: 'PEN' } },
		{ label: 'es-CR (CRC)', intlConfig: { locale: 'es-CR', currency: 'CRC' } },
		{ label: 'th-TH (THB)', intlConfig: { locale: 'th-TH', currency: 'THB' } },
		{ label: 'he-IL (ILS)', intlConfig: { locale: 'he-IL', currency: 'ILS' } }
	];

	let selectedIndex = $state(0);
	let intlConfig = $derived(presets[selectedIndex].intlConfig);

	let value = $state('1234.56');
	let values = $state<CurrencyInputValues>({
		float: 1234.56,
		formatted: '1.234,56 €',
		value: '1234.56'
	});
</script>

<Example id="intl" title="International currencies" {code}>
	<div class="flex gap-3">
		<select bind:value={selectedIndex} class="{INPUT_CLASS} flex-1 bg-white">
			{#each presets as preset, i (preset.label)}
				<option value={i}>{preset.label}</option>
			{/each}
		</select>
		<CurrencyInput
			bind:value
			{intlConfig}
			placeholder="0.00"
			class="{INPUT_CLASS} flex-[2]"
			oninputvalue={(v) => (values = v)}
		/>
	</div>
	<ValueDisplay {values} />
</Example>
