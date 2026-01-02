<script lang="ts">
	import { formatValue } from '$lib/index';
	import Example from './example.svelte';
	import { INPUT_CLASS } from './styles';
	import code from './format-value-utility.txt?raw';

	let valueInput = $state('1234567.89');
	let prefix = $state('$');
	let groupSeparator = $state(',');
	let decimalSeparator = $state('.');
	let disableGroupSeparators = $state(false);

	let formattedResult = $derived(
		formatValue({
			value: valueInput,
			prefix,
			groupSeparator,
			decimalSeparator,
			disableGroupSeparators
		})
	);
</script>

<Example id="formatvalue" title="Format utility" {code}>
	<div class="grid grid-cols-2 gap-2">
		<input bind:value={valueInput} placeholder="Value" class={INPUT_CLASS} />
		<input bind:value={prefix} placeholder="Prefix" class={INPUT_CLASS} />
		<input bind:value={groupSeparator} placeholder="Group separator" class={INPUT_CLASS} />
		<input bind:value={decimalSeparator} placeholder="Decimal separator" class={INPUT_CLASS} />
	</div>
	<label class="flex items-center gap-2 text-xs text-slate-600">
		<input type="checkbox" bind:checked={disableGroupSeparators} />
		Disable group separators
	</label>
	<div
		class="rounded border border-slate-300 bg-slate-100 px-2 py-2 font-mono text-xs text-slate-400"
	>
		{formattedResult}
	</div>
</Example>
