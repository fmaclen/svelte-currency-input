<script lang="ts">
	import type { Snippet } from 'svelte';
	import CodeBlock from './CodeBlock.svelte';

	interface Props {
		id: string;
		title: string;
		code: string;
		children: Snippet;
	}

	let { id, title, code, children }: Props = $props();
</script>

<section {id} class="scroll-mt-6">
	<h2 class="mb-3 text-sm font-medium text-slate-800">{title}</h2>
	<div class="grid gap-3 lg:grid-cols-2">
		<div class="flex flex-col gap-3 rounded border border-slate-200 bg-white p-4">
			{@render children()}
		</div>
		<CodeBlock {code} />
	</div>
</section>
