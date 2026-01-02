<script lang="ts">
	import { CurrencyInput } from '$lib/index';
	import Field from './field.svelte';
	import { INPUT_CLASS } from '../styles';

	let basic1 = $state('');
	let basic2 = $state('');
	let basic3 = $state('');
	let basic4 = $state('');

	let decimal1 = $state('');
	let decimal2 = $state('');
	let decimal3 = $state('');
	let decimal4 = $state('');
	let decimal5 = $state('');
	let decimal6 = $state('');
	let decimal7 = $state('');
	let decimal8 = $state('');

	let negative1 = $state('');
	let negative2 = $state('');
	let negative3 = $state('');
	let negative4 = $state('');

	let locale1 = $state('');
	let locale2 = $state('5679');

	let editing1 = $state('123');
	let editing2 = $state('1234');
	let editing3 = $state('1234');
	let editing4 = $state('1234');
	let editing5 = $state('1234');
	let editing6 = $state('12.34');

	let minmax1 = $state('50');
	let minmax2 = $state('50');

	let step1 = $state('');
	let step2 = $state('10');
	let step3 = $state('');

	let abbr1 = $state('');
	let abbr2 = $state('');
	let abbr3 = $state('');
	let abbr4 = $state('');

	let placeholder1 = $state('');
</script>

<svelte:head>
	<title>E2E Tests</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-8 p-8">
	<section class="space-y-3">
		<h2 class="text-lg font-semibold text-gray-800">Basic</h2>

		<Field label="formats numbers with currency symbol and separators">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={basic1}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="strips invalid characters">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={basic2}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="shows empty for only invalid characters">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={basic3}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="updates bound value">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={basic4}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>
		<output class="text-sm text-gray-500">{basic4}</output>
	</section>

	<section class="space-y-3">
		<h2 class="text-lg font-semibold text-gray-800">Decimals</h2>

		<Field label="allows decimal values">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={decimal1}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="limits decimals to 2 by default">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={decimal2}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="does not allow multiple decimal separators">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={decimal3}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="allows starting with decimal separator">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={decimal4}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="clears decimal-only input on blur">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={decimal5}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="does not allow decimals when allowDecimals is false">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={decimal6}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				allowDecimals={false}
			/>
		</Field>

		<Field label="pads decimals to scale on blur">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={decimal7}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				decimalScale={2}
			/>
		</Field>

		<Field label="pads single decimal to scale on blur">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={decimal8}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				decimalScale={2}
			/>
		</Field>
	</section>

	<section class="space-y-3">
		<h2 class="text-lg font-semibold text-gray-800">Negative</h2>

		<Field label="allows negative value with minus at start">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={negative1}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="allows just minus sign while typing">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={negative2}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="clears minus-only input on blur">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={negative3}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="does not allow negative when disabled">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={negative4}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				allowNegativeValue={false}
			/>
		</Field>
	</section>

	<section class="space-y-3">
		<h2 class="text-lg font-semibold text-gray-800">Locale</h2>

		<Field label="formats Euro with German locale">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={locale1}
				intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
			/>
		</Field>

		<Field label="formats Yen with Japanese locale">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={locale2}
				intlConfig={{ locale: 'ja-JP', currency: 'JPY' }}
			/>
		</Field>
	</section>

	<section class="space-y-3">
		<h2 class="text-lg font-semibold text-gray-800">Editing</h2>

		<Field label="can type digits at the end of existing value">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={editing1}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="can type digits in the middle of existing value">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={editing2}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="can delete characters with backspace">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={editing3}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="can select all and replace">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={editing4}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="can clear input and type new value">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={editing5}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="can delete the decimal separator">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={editing6}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>
	</section>

	<section class="space-y-3">
		<h2 class="text-lg font-semibold text-gray-800">Min/Max</h2>

		<Field label="prevents step above max">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={minmax1}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				max={100}
				step={10}
			/>
		</Field>

		<Field label="prevents step below min">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={minmax2}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				min={0}
				step={10}
			/>
		</Field>
	</section>

	<section class="space-y-3">
		<h2 class="text-lg font-semibold text-gray-800">Step</h2>

		<Field label="increments value with arrow up">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={step1}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				step={5}
			/>
		</Field>

		<Field label="decrements value with arrow down">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={step2}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				step={5}
			/>
		</Field>

		<Field label="handles decimal step values">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={step3}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				step={0.25}
			/>
		</Field>
	</section>

	<section class="space-y-3">
		<h2 class="text-lg font-semibold text-gray-800">Abbreviations</h2>

		<Field label="expands k to thousands">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={abbr1}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="expands m to millions">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={abbr2}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="expands b to billions">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={abbr3}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
			/>
		</Field>

		<Field label="does not expand abbreviations when disabled">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={abbr4}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				disableAbbreviations={true}
			/>
		</Field>
	</section>

	<section class="space-y-3">
		<h2 class="text-lg font-semibold text-gray-800">Placeholder</h2>

		<Field label="shows placeholder when empty">
			<CurrencyInput
				class={INPUT_CLASS}
				bind:value={placeholder1}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				placeholder="$0.00"
			/>
		</Field>
	</section>
</div>
