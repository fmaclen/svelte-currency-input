<script lang="ts">
	import { browser } from '$app/environment';
	import CurrencyInput from '$lib/CurrencyInput.svelte';

	let output: string;
	const handleSubmit = (event: Event) => {
		event.preventDefault();
		// Get the form data
		const data = new FormData(event.target as HTMLFormElement);
		// Pretty-print the data as JSON
		output = JSON.stringify(Object.fromEntries(data.entries()), null, 2);
	};

	let unchangedValue = 999; // Used for onValueChange()
</script>

<form class="demoForm" on:submit={handleSubmit}>
	<nav class="demoForm__nav">
		<h1 class="demoForm__h1">svelte-currency-input</h1>
		<a class="demoForm__a" href="https://github.com/canutin/svelte-currency-input" target="_blank"
			>GitHub repository</a
		>
		<a
			class="demoForm__a"
			href="https://github.com/canutin/svelte-currency-input/issues"
			target="_blank">Known issues</a
		>
		<a
			class="demoForm__a"
			href="https://github.com/canutin/svelte-currency-input#contributing"
			target="_blank">Contribute</a
		>
		<a
			class="demoForm__a"
			href="https://www.npmjs.com/package/@canutin/svelte-currency-input"
			target="_blank">NPM</a
		>
		<a
			class="demoForm__a"
			href="https://svelte.dev/repl/d8f7d22e5b384555b430f62b157ac503?version=3.59.2"
			target="_blank">REPL</a
		>
	</nav>

	<div class="demoForm__container">
		<CurrencyInput name="default" value={-42069.69} />
		<CurrencyInput name="colon" locale="es-CR" currency="CRC" />
		<CurrencyInput
			name="pound"
			value={1234.56}
			isNegativeAllowed={false}
			placeholder={null}
			locale="en-GB"
			currency="GBP"
		/>
		<CurrencyInput
			name="bitcoin"
			value={0.87654321}
			locale="th-TH"
			currency="THB"
			fractionDigits={8}
		/>

		<CurrencyInput name="yen" value={5678.9} locale="en-JP" currency="JPY" />
		<CurrencyInput name="shekel" value={97532.95} disabled={true} locale="il-IL" currency="ILS" />
		<CurrencyInput name="euro" value={-42069.69} locale="nl-NL" currency="EUR" />
		<CurrencyInput
			name="won"
			placeholder={1234.56}
			isNegativeAllowed={false}
			locale="ko-KO"
			currency="KRW"
			inputClasses={{
				wrapper: 'currencyInput custom-wrapper-class',
				unformatted: 'custom-unformatted-class'
			}}
		/>
		<CurrencyInput
			name="pesos"
			value={unchangedValue}
			isNegativeAllowed={false}
			placeholder={null}
			autocomplete="off"
			locale="es-AR"
			currency="ARS"
			onValueChange={(value) => {
				// Prevent alerting on initial load
				if (unchangedValue !== value) {
					unchangedValue = value; // Update the unchanged value
					if (browser) window.alert(`The value for ARS has changed to: ${value}`); // Alert the user
				}
			}}
		/>
		<CurrencyInput name="rupees" value={678} locale="hi-IN" currency="INR" fractionDigits={3} />
		<CurrencyInput name="soles" value={0} isZeroNullish={true} placeholder={null} locale="es-PE" currency="PEN" />
		<CurrencyInput name="dinars" value={0} placeholder={"How many Dinars?"} locale="en-US" currency="RSD" fractionDigits={0} />
	</div>

	<nav class="demoForm__output">
		<button type="submit" class="demoForm__submit">Submit form</button>

		<pre class="demoForm__pre {!output && 'demoForm__pre--placeholder'}">{output
				? output
				: 'Submit form to see a JSON output of the values'}</pre>
	</nav>
</form>

<style>
	/* Overriding the styles of the <CurrencyInput /> component */
	form.demoForm :global(input.currencyInput__formatted) {
		width: 100%;
		font-family: monospace;
		font-size: 13px;
	}

	/* Styles for demo presentation (you can ignore these) */
	:global(body) {
		--gap: 64px;

		font-family: sans-serif;
		box-sizing: border-box;
		min-height: 100vh;
		margin: 0;
		background-color: #eaeaea;
		display: flex;
		align-items: center;
		justify-content: center;
		place-items: center;
		padding: var(--gap);

		@media (max-width: 768px) {
			--gap: 48px;
		}

		@media (max-width: 512px) {
			--gap: 32px;
		}
	}

	form.demoForm {
		display: flex;
		flex-direction: column;
		row-gap: var(--gap);
	}

	div.demoForm__container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		align-items: center;
		justify-content: center;
		gap: calc(var(--gap) / 2);
		height: max-content;

		@media (max-width: 768px) {
			grid-template-columns: repeat(2, 1fr);
		}
		
		@media (max-width: 512px) {
			grid-template-columns: 1fr;
		}
	}

	h1.demoForm__h1 {
		color: #333;
		font-size: 20px;
		letter-spacing: -0.025em;
		line-height: 1em;
		margin-block: unset;
		margin-right: auto;
		padding-right: 16px;
	}

	nav.demoForm__nav {
		font-size: 13px;
		display: flex;
		gap: 16px;
		justify-content: center;

		@media (max-width: 512px) {
			flex-direction: column;
			gap: 24px;
		}
	}

	a.demoForm__a {
		color: #333;
		text-decoration: none;
		border-bottom-width: 1px;
		border-bottom-color: #ccc;
		border-bottom-style: solid;
	}

	a.demoForm__a:visited {
		color: #666;
	}

	a.demoForm__a:hover {
		color: #000;
		border-bottom-color: transparent;
	}

	nav.demoForm__output {
		display: grid;
		grid-template-columns: max-content auto;
		gap: calc(var(--gap) / 2);

		@media (max-width: 512px) {
			grid-template-columns: unset;
		}
	}

	pre.demoForm__pre {
		background-color: #f4f4f4;
		padding: 10px;
		margin: 0;
		color: #666;
		box-sizing: border-box;
		max-width: 100%;
		overflow-y: auto;
	}

	pre.demoForm__pre--placeholder {
		font-family: sans-serif;
		font-size: 13px;
	}

	button.demoForm__submit {
		border: none;
		background-color: #333;
		color: #fff;
		padding: 10px;
		font-size: 13px;
		cursor: pointer;
		height: max-content;
	}

	button.demoForm__submit:hover {
		background-color: #000;
	}
</style>
