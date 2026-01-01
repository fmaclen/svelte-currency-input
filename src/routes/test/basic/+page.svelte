<script lang="ts">
	import { CurrencyInput } from '$lib/index.js';

	let value = $state('');
</script>

<label>
	Amount
	<CurrencyInput bind:value intlConfig={{ locale: 'en-US', currency: 'USD' }} />
</label>
<output>{value}</output>
