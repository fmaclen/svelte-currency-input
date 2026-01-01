<script lang="ts">
	import { CurrencyInput, formatValue } from '$lib/index.js';
	import type { CurrencyInputValues } from '$lib/types.js';
	import Example from './examples/Example.svelte';
	import ValueDisplay from './examples/ValueDisplay.svelte';

	const INPUT_CLASS =
		'w-full rounded border border-slate-300 px-2 py-2 font-mono text-xs focus:border-slate-400 focus:outline-none placeholder:text-slate-400';

	const features = [
		{ id: 'basic', label: 'Basic usage' },
		{ id: 'styling', label: 'Positive, negative, and neutral styling' },
		{ id: 'intl', label: 'International currencies' },
		{ id: 'custom', label: 'Custom prefix and suffix' },
		{ id: 'abbreviations', label: 'Abbreviations' },
		{ id: 'decimals', label: 'Decimal precision' },
		{ id: 'minmax', label: 'Min, max, and step' },
		{ id: 'chained', label: 'Chained inputs' },
		{ id: 'formatvalue', label: 'formatValue utility' },
		{ id: 'tip', label: 'Tip calculator' }
	];

	let basicValue = $state('1234.56');
	let basicValues = $state<CurrencyInputValues>({
		float: 1234.56,
		formatted: '$1,234.56',
		value: '1234.56'
	});

	let styledValue = $state('-3.14');
	let styledValues = $state<CurrencyInputValues>({
		float: -3.14,
		formatted: '-£3.14',
		value: '-3.14'
	});

	const getValueColor = (val: string) => {
		if (!val || val === '-') return '';
		const num = parseFloat(val);
		if (num === 0) return 'text-slate-400';
		return num < 0 ? 'text-rose-500' : 'text-emerald-500';
	};

	let intlValue = $state('1234.56');
	let intlValues = $state<CurrencyInputValues>({
		float: 1234.56,
		formatted: '1.234,56 €',
		value: '1234.56'
	});

	let abbrValue = $state('');
	let abbrValues = $state<CurrencyInputValues>({
		float: null,
		formatted: '',
		value: ''
	});

	let decimalsValue = $state('99.99');
	let decimalsValues = $state<CurrencyInputValues>({
		float: 99.99,
		formatted: '$99.99',
		value: '99.99'
	});

	let stepValue = $state('50');
	let stepValues = $state<CurrencyInputValues>({
		float: 50,
		formatted: '$50.00',
		value: '50'
	});

	let chainedValue = $state('1000');
	let chainedValues = $state<CurrencyInputValues>({
		float: 1000,
		formatted: '$1,000.00',
		value: '1000'
	});

	let customValue = $state('1500');
	let customValues = $state<CurrencyInputValues>({
		float: 1500,
		formatted: '1,500 pts',
		value: '1500'
	});

	let btcValue = $state('0.00042069');
	let btcValues = $state<CurrencyInputValues>({
		float: 0.00042069,
		formatted: '₿ 0.00042069',
		value: '0.00042069'
	});

	let formatValueInput = $state('1234567.89');
	let formatPrefix = $state('$');
	let formatGroupSeparator = $state(',');
	let formatDecimalSeparator = $state('.');
	let formatDisableGroupSeparators = $state(false);
	let formattedResult = $derived(
		formatValue({
			value: formatValueInput,
			prefix: formatPrefix,
			groupSeparator: formatGroupSeparator,
			decimalSeparator: formatDecimalSeparator,
			disableGroupSeparators: formatDisableGroupSeparators
		})
	);

	let billValue = $state('85.50');
	let tipPercent = $state(18);
	let tipAmount = $derived(() => {
		const bill = parseFloat(billValue) || 0;
		return ((bill * tipPercent) / 100).toFixed(2);
	});
	let totalAmount = $derived(() => {
		const bill = parseFloat(billValue) || 0;
		const tip = parseFloat(tipAmount()) || 0;
		return (bill + tip).toFixed(2);
	});
</script>

<svelte:head>
	<title>Svelte Currency Input</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-8">
	<header>
		<div class="mb-8 grid grid-cols-[1fr_auto] items-end gap-4">
			<div>
				<h1 class="text-xl font-bold text-slate-900">svelte-currency-input</h1>
				<p class="text-sm text-balance text-slate-600">
					A Svelte 5 form input with currency masking and internationalization support
				</p>
			</div>
			<nav class="flex items-center gap-3 text-sm">
				<a
					href="https://github.com/canutin/svelte-currency-input#readme"
					target="_blank"
					class="border-b border-slate-300 text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-900"
				>
					Docs
				</a>
				<a
					href="https://www.npmjs.com/package/@canutin/svelte-currency-input"
					target="_blank"
					class="border-b border-slate-300 text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-900"
				>
					NPM
				</a>
				<a
					href="https://github.com/canutin/svelte-currency-input"
					target="_blank"
					class="border-b border-slate-300 text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-900"
				>
					GitHub
				</a>
				<a href="https://github.com/canutin/svelte-currency-input" target="_blank">
					<img
						src="https://img.shields.io/github/stars/canutin/svelte-currency-input?style=flat&color=black"
						alt="GitHub stars"
						class="h-5"
					/>
				</a>
			</nav>
		</div>

		<div class="border-y border-slate-200 bg-white py-4">
			<ul class="grid gap-1.5 text-sm sm:grid-cols-2">
				{#each features as feature}
					<li>
						<a
							href="#{feature.id}"
							class="border-b border-slate-300 text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-900"
						>
							{feature.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</header>

	<div class="mt-8 flex flex-col gap-8">
		<Example
			id="basic"
			title="Basic usage"
			code={`<script lang="ts">
  import { CurrencyInput } from '@canutin/svelte-currency-input';
  let value = $state('1234.56');
<\/script>

<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-US', currency: 'USD' }}
/>`}
		>
			<CurrencyInput
				bind:value={basicValue}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				placeholder="$0.00"
				class={INPUT_CLASS}
				oninputvalue={(values) => (basicValues = values)}
			/>
			<ValueDisplay values={basicValues} />
		</Example>

		<Example
			id="styling"
			title="Positive, negative, and neutral styling"
			code={`<script lang="ts">
  import { CurrencyInput } from '@canutin/svelte-currency-input';
  let value = $state('-3.14');

  const getColor = (val: string) => {
    if (!val || val === '-') return '';
    const num = parseFloat(val);
    if (num === 0) return 'text-slate-400';
    return num < 0 ? 'text-rose-500' : 'text-emerald-500';
  };
<\/script>

<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-GB', currency: 'GBP' }}
  class={getColor(value)}
/>`}
		>
			<CurrencyInput
				bind:value={styledValue}
				intlConfig={{ locale: 'en-GB', currency: 'GBP' }}
				placeholder="£0.00"
				class="{INPUT_CLASS} {getValueColor(styledValue)}"
				oninputvalue={(values) => (styledValues = values)}
			/>
			<ValueDisplay values={styledValues} />
		</Example>

		<Example
			id="intl"
			title="International currencies"
			code={`<CurrencyInput
  intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
/>

<CurrencyInput
  intlConfig={{ locale: 'en-IN', currency: 'INR' }}
/>

<CurrencyInput
  intlConfig={{ locale: 'es-PE', currency: 'PEN' }}
/>`}
		>
			<CurrencyInput
				bind:value={intlValue}
				intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
				placeholder="0,00 €"
				class={INPUT_CLASS}
				oninputvalue={(values) => (intlValues = values)}
			/>
			<CurrencyInput
				bind:value={intlValue}
				intlConfig={{ locale: 'en-IN', currency: 'INR' }}
				placeholder="₹0.00"
				class={INPUT_CLASS}
			/>
			<CurrencyInput
				bind:value={intlValue}
				intlConfig={{ locale: 'es-PE', currency: 'PEN' }}
				placeholder="S/ 0.00"
				class={INPUT_CLASS}
			/>
			<ValueDisplay values={intlValues} />
		</Example>

		<Example
			id="custom"
			title="Custom prefix and suffix"
			code={`<CurrencyInput
  suffix=" pts"
  decimalsLimit={0}
/>

<CurrencyInput
  prefix="₿ "
  decimalsLimit={8}
/>`}
		>
			<CurrencyInput
				bind:value={customValue}
				suffix=" pts"
				decimalsLimit={0}
				placeholder="0 pts"
				class={INPUT_CLASS}
				oninputvalue={(values) => (customValues = values)}
			/>
			<CurrencyInput
				bind:value={btcValue}
				prefix="₿ "
				decimalsLimit={8}
				placeholder="₿ 0.00000000"
				class={INPUT_CLASS}
				oninputvalue={(values) => (btcValues = values)}
			/>
			<ValueDisplay values={btcValues} />
		</Example>

		<Example
			id="abbreviations"
			title="Abbreviations"
			code={`<script lang="ts">
  import { CurrencyInput } from '@canutin/svelte-currency-input';
  let value = $state('');
<\/script>

<!-- Type 1k, 2.5m, or 1b -->
<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-US', currency: 'USD' }}
/>`}
		>
			<CurrencyInput
				bind:value={abbrValue}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				placeholder="Try 1k, 2.5m, or 1b"
				class={INPUT_CLASS}
				oninputvalue={(values) => (abbrValues = values)}
			/>
			<ValueDisplay values={abbrValues} />
		</Example>

		<Example
			id="decimals"
			title="Decimal precision"
			code={`<script lang="ts">
  import { CurrencyInput } from '@canutin/svelte-currency-input';
  let value = $state('99.99');
<\/script>

<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-US', currency: 'USD' }}
  decimalsLimit={2}
  decimalScale={2}
/>`}
		>
			<CurrencyInput
				bind:value={decimalsValue}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				decimalsLimit={2}
				decimalScale={2}
				placeholder="$0.00"
				class={INPUT_CLASS}
				oninputvalue={(values) => (decimalsValues = values)}
			/>
			<ValueDisplay values={decimalsValues} />
		</Example>

		<Example
			id="minmax"
			title="Min, max, and step"
			code={`<script lang="ts">
  import { CurrencyInput } from '@canutin/svelte-currency-input';
  let value = $state('50');
<\/script>

<!-- Use arrow keys to step -->
<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-US', currency: 'USD' }}
  min={0}
  max={100}
  step={10}
/>`}
		>
			<CurrencyInput
				bind:value={stepValue}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				min={0}
				max={100}
				step={10}
				placeholder="$0.00"
				class={INPUT_CLASS}
				oninputvalue={(values) => (stepValues = values)}
			/>
			<ValueDisplay values={stepValues} />
		</Example>

		<Example
			id="chained"
			title="Chained inputs"
			code={`<script lang="ts">
  import { CurrencyInput } from '@canutin/svelte-currency-input';
  let value = $state('1000');
<\/script>

<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-US', currency: 'USD' }}
/>
<CurrencyInput
  bind:value
  intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
/>
<CurrencyInput
  bind:value
  intlConfig={{ locale: 'en-GB', currency: 'GBP' }}
  disabled
/>`}
		>
			<CurrencyInput
				bind:value={chainedValue}
				intlConfig={{ locale: 'en-US', currency: 'USD' }}
				placeholder="$0.00"
				class={INPUT_CLASS}
				oninputvalue={(values) => (chainedValues = values)}
			/>
			<CurrencyInput
				bind:value={chainedValue}
				intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
				placeholder="0,00 €"
				class={INPUT_CLASS}
			/>
			<CurrencyInput
				bind:value={chainedValue}
				intlConfig={{ locale: 'en-GB', currency: 'GBP' }}
				placeholder="£0.00"
				class="{INPUT_CLASS} bg-slate-100 text-slate-400"
				disabled
			/>
			<ValueDisplay values={chainedValues} />
		</Example>

		<Example
			id="formatvalue"
			title="formatValue utility"
			code={`<script lang="ts">
  import { formatValue } from '@canutin/svelte-currency-input';

  let value = $state('1234567.89');
  let prefix = $state('$');
  let groupSeparator = $state(',');
  let decimalSeparator = $state('.');

  let formatted = $derived(
    formatValue({
      value,
      prefix,
      groupSeparator,
      decimalSeparator
    })
  );
<\/script>`}
		>
			<div class="grid grid-cols-2 gap-2">
				<input bind:value={formatValueInput} placeholder="Value" class={INPUT_CLASS} />
				<input bind:value={formatPrefix} placeholder="Prefix" class={INPUT_CLASS} />
				<input
					bind:value={formatGroupSeparator}
					placeholder="Group separator"
					class={INPUT_CLASS}
				/>
				<input
					bind:value={formatDecimalSeparator}
					placeholder="Decimal separator"
					class={INPUT_CLASS}
				/>
			</div>
			<label class="flex items-center gap-2 text-xs text-slate-600">
				<input type="checkbox" bind:checked={formatDisableGroupSeparators} />
				Disable group separators
			</label>
			<div
				class="rounded border border-slate-300 bg-slate-100 px-2 py-2 font-mono text-xs text-slate-400"
			>
				{formattedResult}
			</div>
		</Example>

		<Example
			id="tip"
			title="Tip calculator"
			code={`<script lang="ts">
  import { CurrencyInput, formatValue } from '@canutin/svelte-currency-input';

  let bill = $state('85.50');
  let tipPercent = $state(18);

  let tip = $derived(() => {
    const amount = parseFloat(bill) || 0;
    return ((amount * tipPercent) / 100).toFixed(2);
  });

  let total = $derived(() => {
    return (parseFloat(bill) + parseFloat(tip())).toFixed(2);
  });
<\/script>`}
		>
			<div class="flex items-center gap-2">
				<CurrencyInput
					bind:value={billValue}
					intlConfig={{ locale: 'en-US', currency: 'USD' }}
					placeholder="$0.00"
					class="{INPUT_CLASS} flex-1"
				/>
				<input type="range" bind:value={tipPercent} min="0" max="30" class="flex-1" />
				<span class="w-12 text-right font-mono text-xs text-slate-600">{tipPercent}%</span>
			</div>
			<div class="grid grid-cols-2 gap-2 text-xs">
				<div class="rounded border border-slate-200 bg-slate-50 px-3 py-2">
					<span class="text-slate-400">Tip</span>
					<span class="ml-2 font-mono"
						>{formatValue({
							value: tipAmount(),
							intlConfig: { locale: 'en-US', currency: 'USD' }
						})}</span
					>
				</div>
				<div class="rounded border border-slate-200 bg-slate-50 px-3 py-2">
					<span class="text-slate-400">Total</span>
					<span class="ml-2 font-mono"
						>{formatValue({
							value: totalAmount(),
							intlConfig: { locale: 'en-US', currency: 'USD' }
						})}</span
					>
				</div>
			</div>
		</Example>
	</div>
</div>
