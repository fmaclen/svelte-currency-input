<script lang="ts">
	import type { CurrencyInputValues } from '$lib/types';

	interface Props {
		values: CurrencyInputValues;
	}

	let { values }: Props = $props();
</script>

<div
	class="flex flex-wrap gap-x-6 gap-y-2 rounded border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs"
>
	<div class="flex gap-2">
		<span class="text-slate-400">float</span>
		<span class="text-slate-700">{values.float ?? 'null'}</span>
	</div>
	<div class="flex gap-2">
		<span class="text-slate-400">formatted</span>
		<span class="text-slate-700">{values.formatted || '""'}</span>
	</div>
	<div class="flex gap-2">
		<span class="text-slate-400">value</span>
		<span class="text-slate-700">{values.value ? `"${values.value}"` : '""'}</span>
	</div>
</div>
