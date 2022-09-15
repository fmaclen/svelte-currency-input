<script lang="ts">
	import CurrencyInput from '$lib/CurrencyInput.svelte';
	import '../app.scss';

	const locale = 'nl-NL';
	const currency = 'EUR';
</script>

<div class="container">
	<CurrencyInput name="cashflow" value={-42069.69} />
	<CurrencyInput name="rent" value={0} />
	<CurrencyInput name="total" value={5678.9} />
	<CurrencyInput name="balance" value={1234.56} isNegativeAllowed={false} />

	<CurrencyInput name="amount" value={5678.9} {locale} {currency} />
	<CurrencyInput name="deficit" value={1234.56} isNegativeAllowed={false} {locale} {currency} />
	<CurrencyInput name="cost" value={-42069.69} {locale} {currency} />
	<CurrencyInput name="exchange" value={0} {locale} {currency} />
</div>

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		align-items: center;
		justify-content: center;
		height: max-content;
		column-gap: 32px;
		row-gap: 64px;
	}
</style>
