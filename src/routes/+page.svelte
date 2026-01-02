<script lang="ts">
	import BasicUsage from './components/basic-usage.svelte';
	import PositiveNegativeNeutral from './components/positive-negative-neutral.svelte';
	import InternationalCurrencies from './components/international-currencies.svelte';
	import CustomPrefixSuffix from './components/custom-prefix-suffix.svelte';
	import Abbreviations from './components/abbreviations.svelte';
	import DecimalPrecision from './components/decimal-precision.svelte';
	import MinMaxStep from './components/min-max-step.svelte';
	import ChainedInputs from './components/chained-inputs.svelte';
	import FormatValueUtility from './components/format-value-utility.svelte';
	import TipCalculator from './components/tip-calculator.svelte';

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
</script>

<svelte:head>
	<title>Svelte Currency Input - Currency masking for Svelte 5</title>
	<meta
		name="description"
		content="A Svelte 5 form input component with currency masking, formatting, and internationalization support. Works with any currency and locale."
	/>
	<meta
		name="keywords"
		content="svelte, svelte 5, currency input, currency mask, form input, internationalization, i18n, number format"
	/>
	<meta name="author" content="Canutin" />

	<meta property="og:title" content="Svelte Currency Input" />
	<meta
		property="og:description"
		content="A Svelte 5 form input component with currency masking, formatting, and internationalization support."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://svelte-currency-input.fernando.is" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Svelte Currency Input" />
	<meta
		name="twitter:description"
		content="A Svelte 5 form input component with currency masking, formatting, and internationalization support."
	/>

	<link rel="canonical" href="https://svelte-currency-input.fernando.is" />
</svelte:head>

<div class="mx-auto max-w-5xl overflow-hidden px-4 py-8">
	<header>
		<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 class="text-xl font-bold text-slate-900">svelte-currency-input</h1>
				<p class="text-sm text-balance text-slate-600">
					A Svelte 5 form input with currency masking and internationalization support
				</p>
			</div>
			<nav class="flex items-center gap-3 text-sm">
				<a
					href="https://github.com/fmaclen/svelte-currency-input#readme"
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
					href="https://github.com/fmaclen/svelte-currency-input"
					target="_blank"
					class="border-b border-slate-300 text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-900"
				>
					GitHub
				</a>
				<a href="https://github.com/fmaclen/svelte-currency-input" target="_blank">
					<img
						src="https://img.shields.io/github/stars/fmaclen/svelte-currency-input?style=flat&color=black"
						alt="GitHub stars"
						class="h-5"
					/>
				</a>
			</nav>
		</div>

		<div class="border-y border-slate-200 bg-white py-4">
			<ul class="grid gap-1.5 text-sm sm:grid-cols-2">
				{#each features as feature (feature.id)}
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
		<BasicUsage />
		<PositiveNegativeNeutral />
		<InternationalCurrencies />
		<CustomPrefixSuffix />
		<Abbreviations />
		<DecimalPrecision />
		<MinMaxStep />
		<ChainedInputs />
		<FormatValueUtility />
		<TipCalculator />
	</div>
</div>
