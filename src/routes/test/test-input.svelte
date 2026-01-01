<script lang="ts">
	import { CurrencyInput } from '$lib/index.js';
	import type { ComponentProps } from 'svelte';

	type Props = ComponentProps<typeof CurrencyInput>;

	let { value = $bindable(''), class: className, ...rest }: Props = $props();
</script>

<CurrencyInput
	bind:value
	class="rounded-md border border-gray-300 px-3 py-2 {className ?? ''}"
	{...rest}
/>
