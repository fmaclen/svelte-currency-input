# Migration guide: v0.x to v1.0

This guide covers the breaking changes and migration steps when upgrading from v0.x (Svelte 4) to v1.0 (Svelte 5).

## Overview

v1.0 is a complete rewrite for Svelte 5 using runes. The API has been redesigned for simplicity and flexibility, inspired by [react-currency-input-field](https://github.com/cchanxzy/react-currency-input-field).

## Breaking changes summary

| v0.x                                   | v1.0                                             |
| -------------------------------------- | ------------------------------------------------ |
| `value: number`                        | `value: string` (bindable)                       |
| `locale` + `currency` (separate props) | `intlConfig={{ locale, currency }}`              |
| `fractionDigits`                       | `decimalsLimit` / `decimalScale`                 |
| `isNegativeAllowed`                    | `allowNegativeValue`                             |
| `isZeroNullish`                        | Removed                                          |
| `inputClasses` object                  | `class` string                                   |
| `onValueChange(value)`                 | `oninputvalue(values)` / `onchangevalue(values)` |
| Hidden + visible input wrapper         | Single `<input>` element                         |
| Built-in CSS styles                    | No built-in styles                               |
| Svelte 4                               | Svelte 5 (runes required)                        |

---

## Detailed migration steps

### 1. Value type: `number` → `string`

**v0.x:**

```svelte
<script>
	let value = 1234.56;
</script>

<CurrencyInput bind:value />
<!-- value is a number: 1234.56 -->
```

**v1.0:**

```svelte
<script>
	let value = $state('1234.56');
</script>

<CurrencyInput bind:value />
<!-- value is a string: "1234.56" -->
```

**Why?** String values avoid floating-point precision issues and match typical form handling patterns. Empty is `""`, zero is `"0"`.

**Converting values:**

```svelte
<script>
	let value = $state('1234.56');

	// Get numeric value when needed
	const numericValue = parseFloat(value) || 0;

	// Or use the callback
	let floatValue = $state(null);
</script>

<CurrencyInput bind:value oninputvalue={({ float }) => (floatValue = float)} />
```

---

### 2. Locale configuration

**v0.x:**

```svelte
<CurrencyInput locale="de-DE" currency="EUR" />
```

**v1.0:**

```svelte
<CurrencyInput intlConfig={{ locale: 'de-DE', currency: 'EUR' }} />
```

The `intlConfig` object also accepts other [`Intl.NumberFormatOptions`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options).

---

### 3. Decimal/fraction handling

**v0.x:**

```svelte
<CurrencyInput fractionDigits={2} />
```

**v1.0:**

```svelte
<!-- Limit decimals while typing -->
<CurrencyInput decimalsLimit={2} />

<!-- Pad/trim to exact decimals on blur -->
<CurrencyInput decimalScale={2} />

<!-- Both: limit while typing, pad on blur -->
<CurrencyInput decimalsLimit={2} decimalScale={2} />
```

| v0.x Prop        | v1.0 Equivalent      | Description                                                               |
| ---------------- | -------------------- | ------------------------------------------------------------------------- |
| `fractionDigits` | `decimalsLimit`      | Max decimals allowed while typing                                         |
| —                | `decimalScale`       | Pads/trims decimals on blur                                               |
| —                | `fixedDecimalLength` | Fixed decimal input (typing `123` with `fixedDecimalLength={2}` → `1.23`) |
| —                | `allowDecimals`      | Set to `false` to disallow decimals entirely                              |

---

### 4. Prop renames

| v0.x                | v1.0                 |
| ------------------- | -------------------- |
| `isNegativeAllowed` | `allowNegativeValue` |

**v0.x:**

```svelte
<CurrencyInput isNegativeAllowed={false} />
```

**v1.0:**

```svelte
<CurrencyInput allowNegativeValue={false} />
```

---

### 5. Removed props

#### `isZeroNullish`

This prop has been removed. The string-based value system makes the distinction clear:

- `""` (empty string) = no value / empty input
- `"0"` = zero

If you need to treat zero as empty, handle it in your code:

```svelte
<script>
	let value = $state('');

	const effectiveValue = value === '0' ? '' : value;
</script>
```

#### `placeholder` type changes

In v0.x, `placeholder` could be a `number` that would be formatted. In v1.0, `placeholder` is a standard HTML attribute (string only). Format it yourself:

**v0.x:**

```svelte
<CurrencyInput placeholder={0} />
<!-- Showed formatted: "$0.00" -->
```

**v1.0:**

```svelte
<CurrencyInput placeholder="$0.00" />
```

---

### 6. Styling: `inputClasses` → `class`

**v0.x:**

```svelte
<CurrencyInput
	inputClasses={{
		wrapper: 'form-control',
		formatted: 'py-1.5 text-gray-700',
		formattedPositive: 'text-green-700',
		formattedNegative: 'text-red-700',
		formattedZero: 'text-gray-500'
	}}
/>
```

**v1.0:**

```svelte
<script>
	let value = $state('');
	let colorClass = $state('text-gray-500');

	function updateStyle({ float }) {
		if (float === null || float === 0) colorClass = 'text-gray-500';
		else if (float > 0) colorClass = 'text-green-700';
		else colorClass = 'text-red-700';
	}
</script>

<CurrencyInput bind:value class="py-1.5 text-gray-700 {colorClass}" oninputvalue={updateStyle} />
```

**Why?** v1.0 has no wrapper element and no built-in styles. This makes it easier to integrate with any CSS framework and gives you full control.

---

### 7. Callbacks: `onValueChange` → `oninputvalue` / `onchangevalue`

**v0.x:**

```svelte
<CurrencyInput onValueChange={(value) => console.log(value)} />
<!-- value is a number -->
```

**v1.0:**

```svelte
<CurrencyInput
	oninputvalue={({ float, formatted, value }) => {
		console.log('Input:', float, formatted, value);
	}}
	onchangevalue={({ float, formatted, value }) => {
		console.log('Blur:', float, formatted, value);
	}}
/>
```

The callback now receives a `CurrencyInputValues` object:

```typescript
interface CurrencyInputValues {
	float: number | null; // Parsed number (null if empty)
	formatted: string; // Display value: "$1,234.56"
	value: string; // Raw value: "1234.56"
}
```

- `oninputvalue`: Fires on every keystroke/change
- `onchangevalue`: Fires on blur (when user finishes editing)

---

### 8. DOM structure: hidden input removed

**v0.x DOM:**

```html
<div class="currencyInput">
	<input type="hidden" name="total" value="1234.56" />
	<input type="text" name="formatted-total" value="$1,234.56" />
</div>
```

**v1.0 DOM:**

```html
<input type="text" inputmode="decimal" value="$1,234.56" />
```

v1.0 renders a single `<input>` element with no wrapper.

#### Form submissions

If you relied on the hidden input for form submissions, add one yourself:

**v1.0:**

```svelte
<form method="POST">
	<CurrencyInput bind:value name="formatted-amount" />
	<input type="hidden" name="amount" {value} />
	<button type="submit">Submit</button>
</form>
```

---

### 9. New features in v1.0

These features are new and have no v0.x equivalent:

| Feature                               | Description                                   |
| ------------------------------------- | --------------------------------------------- |
| `min` / `max`                         | Constrain values (enforced on arrow key step) |
| `step`                                | Arrow key increment/decrement amount          |
| `disableAbbreviations`                | Disable k/m/b abbreviation input              |
| `disableGroupSeparators`              | Disable thousand separators                   |
| `prefix` / `suffix`                   | Custom prefix/suffix (override locale)        |
| `decimalSeparator` / `groupSeparator` | Custom separators (override locale)           |
| `maxLength`                           | Max characters (excluding formatting)         |
| `transformRawValue`                   | Transform raw value before processing         |
| `formatValueOnBlur`                   | Control whether to format on blur             |
| `ref`                                 | Bindable reference to the input element       |

---

### 10. Svelte version

v1.0 requires **Svelte 5**. Ensure your project is using Svelte 5:

```json
{
	"peerDependencies": {
		"svelte": "^5.0.0"
	}
}
```

If you need to stay on Svelte 4, continue using v0.x:

```bash
npm install @canutin/svelte-currency-input@0
```

---

## Full migration example

**v0.x:**

```svelte
<script>
	import CurrencyInput from '@canutin/svelte-currency-input';

	let amount = 1234.56;

	function handleChange(value) {
		console.log('New value:', value);
	}
</script>

<CurrencyInput
	bind:value={amount}
	locale="en-US"
	currency="USD"
	fractionDigits={2}
	isNegativeAllowed={true}
	placeholder={0}
	inputClasses={{
		formatted: 'input-field',
		formattedPositive: 'text-green',
		formattedNegative: 'text-red'
	}}
	onValueChange={handleChange}
/>
```

**v1.0:**

```svelte
<script>
	import { CurrencyInput } from '@canutin/svelte-currency-input';

	let amount = $state('1234.56');
	let colorClass = $state('');

	function handleInput({ float, formatted, value }) {
		console.log('New value:', { float, formatted, value });

		if (float === null || float === 0) colorClass = '';
		else if (float > 0) colorClass = 'text-green';
		else colorClass = 'text-red';
	}
</script>

<CurrencyInput
	bind:value={amount}
	intlConfig={{ locale: 'en-US', currency: 'USD' }}
	decimalsLimit={2}
	decimalScale={2}
	allowNegativeValue={true}
	placeholder="$0.00"
	class="input-field {colorClass}"
	oninputvalue={handleInput}
/>
```

---

## Need help?

- Check the [README](./README.md) for full API documentation
- See the [live demo & examples](https://svelte-currency-input.fernando.is)
- Open an [issue](https://github.com/fmaclen/svelte-currency-input/issues) if you encounter problems
