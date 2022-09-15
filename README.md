# svelte-currency-input

A form input that converts numbers to currencies as you type in localized formats

[<img width="1059" alt="image" src="https://user-images.githubusercontent.com/1434675/190315136-c1d310ab-0ef1-441d-a80c-2b3727d74f59.png">](https://svelte.dev/repl/d8f7d22e5b384555b430f62b157ac503?version=3.50.1)

<p align="center">
	<a href="https://svelte.dev/repl/d8f7d22e5b384555b430f62b157ac503?version=3.50.1" target="_blank">
		<strong>REPL Demo</strong>
	</a>
</p>

---

## Features

- Formats **positive** and **negative** values
- Leverages [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) for **localizing** currency denominations and masking the input
- Comprehensive [API](#api)
- Minimal default styling, [easy to customize](#styling)

## Usage

```bash
npm install svelte-currency-input --save
```

```html
<script lang="ts">
	import CurrencyInput from '@canutin/svelte-currency-input';

	const locale = 'nl-NL';
	const currency = 'EUR';
</script>

<CurrencyInput name="exchange-rate" value="{-420.69}" {locale} {currency} />
```

## How it works

When the form is submitted you get _unformatted_ or _formatted_ values from two `<input />`'s.
This is more or less what `<CurrencyInput />` looks like under the hood:

```html
<div class="currencyInput">
	<!-- Unformatted value -->
	<input class="currencyInput__unformatted" type="hidden" name="total" />

	<!-- Formatted value -->
	<input class="currencyInput__formatted" type="text" name="formattedTotal" />
</div>
```

## API

| Option            | Type      | Default     | Description                                                                                                                                                     |
| ----------------- | --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| value             | `number`  | `undefined` | Initial value. If left `undefined` a formatted value of `0` is visible as a placeholder                                                                         |
| locale            | `string`  | `en-US`     | Overrides default locale. [Examples](https://gist.github.com/ncreated/9934896)                                                                                  |
| currency          | `string`  | `USD`       | Overrides default currency. [Examples](https://github.com/datasets/currency-codes/blob/master/data/codes-all.csv)                                               |
| name              | `string`  | `total`     | Applies the name to the [input fields](#how-it-works) for _unformatted_ (e.g `[name=total]`) and _formatted_ (e.g. `[name=formattedTotal]` in camelCase) values |
| required          | `boolean` | `false`     | Marks the inputs as required                                                                                                                                    |
| disabled          | `boolean` | `false`     | Marks the inputs as disabled                                                                                                                                    |
| isNegativeAllowed | `boolean` | `true`      | If `true`, forces formatting only to positive values and ignores `--positive` and `--negative` styling modifiers                                                |

## Styling

The default styles use [BEM naming conventions](https://getbem.com/naming/). To override the default styles apply your styles as shown below:

```html
<div class="my-currency-input">
	<CurrencyInput name="total" value="{420.69}" />
</div>

<style>
	/* Container */
	div.my-currency-input :global(div.currencyInput) {
		/* ... */
	}

	/* Formatted input */
	div.my-currency-input :global(input.currencyInput__formatted) {
		/* ... */
	}

	/* Formatted input when the value is zero */
	div.my-currency-input :global(input.currencyInput__formatted--zero) {
		/* ... */
	}

	/* Formatted input when the value is positive */
	div.my-currency-input :global(input.currencyInput__formatted--positive) {
		/* ... */
	}

	/* Formatted input when the value is negative */
	div.my-currency-input :global(input.currencyInput__formatted--negative) {
		/* ... */
	}
</style>
```

## Contributing

Here's ways in which you can contribute:

- Found a bug? Open a [new issue](https://github.com/Canutin/svelte-currency-input/issues/new)
- Browse our [existing issues](https://github.com/Canutin/svelte-currency-input/issues)
- Submit a [pull request](https://github.com/Canutin/svelte-currency-input/pulls)

## Developing

This package was generated with [SvelteKit](https://kit.svelte.dev/).
Install dependencies with `npm install`, then start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
