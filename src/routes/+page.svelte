<script lang="ts">
	import { CurrencyInput } from '$lib/index.js';

	let value = $state('');
</script>

<svelte:head>
	<title>Svelte Currency Input</title>
</svelte:head>

<div class="mx-auto max-w-md p-8">
	<h1 class="mb-6 text-2xl font-bold">Svelte Currency Input</h1>

	<label class="mb-2 block font-medium">
		Amount
		<CurrencyInput
			bind:value
			intlConfig={{ locale: 'en-US', currency: 'USD' }}
			class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
		/>
	</label>

	<p class="mt-4 text-sm text-gray-600">Value: {value || '(empty)'}</p>
</div>
