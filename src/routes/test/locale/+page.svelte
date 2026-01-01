<script lang="ts">
	import { CurrencyInput } from '$lib/index.js';

	let euroValue = $state('');
	let yenValue = $state('');
</script>

<label>
	Euro (de-DE)
	<CurrencyInput bind:value={euroValue} intlConfig={{ locale: 'de-DE', currency: 'EUR' }} />
</label>
<output>{euroValue}</output>

<label>
	Yen (ja-JP)
	<CurrencyInput bind:value={yenValue} intlConfig={{ locale: 'ja-JP', currency: 'JPY' }} />
</label>
<output>{yenValue}</output>
