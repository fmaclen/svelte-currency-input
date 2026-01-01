<script lang="ts">
	import { CurrencyInput } from '$lib/index.js';

	let defaultValue = $state('');
	let noDecimalsValue = $state('');
	let decimalScaleValue = $state('');
</script>

<label>
	Default (decimalsLimit=2)
	<CurrencyInput bind:value={defaultValue} intlConfig={{ locale: 'en-US', currency: 'USD' }} />
</label>
<output>{defaultValue}</output>

<label>
	No Decimals
	<CurrencyInput
		bind:value={noDecimalsValue}
		intlConfig={{ locale: 'en-US', currency: 'USD' }}
		allowDecimals={false}
	/>
</label>
<output>{noDecimalsValue}</output>

<label>
	Decimal Scale 2
	<CurrencyInput
		bind:value={decimalScaleValue}
		intlConfig={{ locale: 'en-US', currency: 'USD' }}
		decimalScale={2}
	/>
</label>
<output>{decimalScaleValue}</output>
