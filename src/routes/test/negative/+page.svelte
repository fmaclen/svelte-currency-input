<script lang="ts">
	import { CurrencyInput } from '$lib/index.js';

	let defaultValue = $state('');
	let disabledValue = $state('');
</script>

<label>
	Default (negative allowed)
	<CurrencyInput bind:value={defaultValue} intlConfig={{ locale: 'en-US', currency: 'USD' }} />
</label>
<output>{defaultValue}</output>

<label>
	Negative Disabled
	<CurrencyInput
		bind:value={disabledValue}
		intlConfig={{ locale: 'en-US', currency: 'USD' }}
		allowNegativeValue={false}
	/>
</label>
<output>{disabledValue}</output>
