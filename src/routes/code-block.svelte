<script lang="ts">
	interface Props {
		code: string;
	}

	let { code }: Props = $props();

	let copied = $state(false);

	function copyCode() {
		navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="relative flex h-full min-w-0 flex-col">
	<button
		onclick={copyCode}
		class="absolute top-3 right-3 text-slate-400 transition-colors hover:text-slate-600"
		title="Copy code"
	>
		{#if copied}
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
		{:else}
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
				/>
			</svg>
		{/if}
	</button>
	<pre
		class="max-w-full flex-1 overflow-x-auto rounded border border-slate-200 bg-slate-50 p-4 pr-10 text-xs"
		style="tab-size: 2;"><code class="font-mono text-slate-700">{code.trim()}</code></pre>
</div>
