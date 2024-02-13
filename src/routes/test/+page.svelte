<script>
	import CurrencyInput from '$lib/CurrencyInput.svelte';

	let change = 0;
	let output = '';
  let formState = {
		AskPrice: 22
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		output = JSON.stringify(Object.fromEntries(data.entries()), null, 2);
	};

	const changePrice = () => {
		formState.AskPrice += 1;
		change++;
	};
</script>

<form class="demoForm" on:submit={handleSubmit}>
	<div class="demoForm__container">
		<CurrencyInput name="default" bind:value={formState.AskPrice} />
    <!-- {#key change}
		<CurrencyInput name="changed" bind:value={formState.AskPrice} />
    {/key} -->
	</div>

	<nav class="demoForm__output">
		<button type="submit" class="demoForm__submit">Submit form</button>
	</nav>

	<button on:click={changePrice}>Change Price</button>
</form>
