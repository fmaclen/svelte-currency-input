<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		label: string;
		children: Snippet;
	};

	let { label, children }: Props = $props();
</script>

<label class="flex flex-col gap-1 text-sm">
	<span class="font-medium text-gray-700">{label}</span>
	{@render children()}
</label>
