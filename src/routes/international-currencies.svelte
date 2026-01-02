<script lang="ts">
	import { CurrencyInput, formatValue, getLocaleConfig } from '$lib/index';
	import type { CurrencyInputValues, IntlConfig } from '$lib/types';
	import Example from './example.svelte';
	import ValueDisplay from './value-display.svelte';
	import { INPUT_CLASS } from './styles';
	import code from './international-currencies.txt?raw';

	const presets: { label: string; intlConfig: IntlConfig }[] = [
		{ label: 'de-DE (EUR)', intlConfig: { locale: 'de-DE', currency: 'EUR' } },
		{ label: 'en-IN (INR)', intlConfig: { locale: 'en-IN', currency: 'INR' } },
		{ label: 'es-PE (PEN)', intlConfig: { locale: 'es-PE', currency: 'PEN' } },
		{ label: 'es-CR (CRC)', intlConfig: { locale: 'es-CR', currency: 'CRC' } },
		{ label: 'th-TH (THB)', intlConfig: { locale: 'th-TH', currency: 'THB' } },
		{ label: 'he-IL (ILS)', intlConfig: { locale: 'he-IL', currency: 'ILS' } }
	];

	let selectedIndex = $state(0);
	let previousIndex = $state(0);
	let intlConfig = $derived(presets[selectedIndex].intlConfig);

	let floatValue = $state<number | null>(1234.56);
	let value = $state('1234.56');
	let values = $state<CurrencyInputValues>({
		float: 1234.56,
		formatted: '1.234,56 €',
		value: '1234.56'
	});

	$effect(() => {
		if (selectedIndex === previousIndex) return;
		previousIndex = selectedIndex;

		if (floatValue === null) {
			value = '';
			values = { float: null, formatted: '', value: '' };
			return;
		}

		const localeConfig = getLocaleConfig(intlConfig);
		const stringValue = String(floatValue).replace('.', localeConfig.decimalSeparator || '.');

		value = stringValue;

		const formatted = formatValue({
			value: stringValue,
			decimalSeparator: localeConfig.decimalSeparator,
			groupSeparator: localeConfig.groupSeparator,
			intlConfig,
			prefix: localeConfig.prefix,
			suffix: localeConfig.suffix
		});

		values = {
			float: floatValue,
			formatted,
			value: stringValue
		};
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
			oninputvalue={(v) => {
				floatValue = v.float;
				values = v;
			}}
		/>
	</div>
	<ValueDisplay {values} />
</Example>
