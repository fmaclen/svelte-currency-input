<script lang="ts">
	import BasicUsage from './basic-usage.svelte';
	import PositiveNegativeNeutral from './positive-negative-neutral.svelte';
	import InternationalCurrencies from './international-currencies.svelte';
	import CustomPrefixSuffix from './custom-prefix-suffix.svelte';
	import Abbreviations from './abbreviations.svelte';
	import DecimalPrecision from './decimal-precision.svelte';
	import MinMaxStep from './min-max-step.svelte';
	import ChainedInputs from './chained-inputs.svelte';
	import FormatValueUtility from './format-value-utility.svelte';
	import TipCalculator from './tip-calculator.svelte';

	const packageManagers = [
		{ name: 'bun', command: 'bun add @canutin/svelte-currency-input' },
		{ name: 'pnpm', command: 'pnpm add @canutin/svelte-currency-input' },
		{ name: 'npm', command: 'npm install @canutin/svelte-currency-input' },
		{ name: 'yarn', command: 'yarn add @canutin/svelte-currency-input' }
	];

	let selectedPm = $state(0);

	const sections = [
		{
			title: 'Getting started',
			items: [
				{ id: 'install', label: 'Installation' },
				{ id: 'basic', label: 'Basic usage' }
			]
		},
		{
			title: 'Features',
			items: [
				{ id: 'intl', label: 'International currencies' },
				{ id: 'abbreviations', label: 'Abbreviations' },
				{ id: 'decimals', label: 'Decimal precision' },
				{ id: 'minmax', label: 'Min, max, and step' },
				{ id: 'custom', label: 'Custom prefix and suffix' }
			]
		},
		{
			title: 'Examples',
			items: [
				{ id: 'styling', label: 'Dynamic styling' },
				{ id: 'tip', label: 'Tip calculator' },
				{ id: 'chained', label: 'Chained inputs' },
				{ id: 'formatvalue', label: 'Format utility' }
			]
		}
	];
</script>

<svelte:head>
	<title>svelte-currency-input - Currency masking for Svelte 5</title>
	<meta
		name="description"
		content="A Svelte 5 form input component with currency masking, formatting, and internationalization support. Works with any currency and locale."
	/>
	<meta
		name="keywords"
		content="svelte, svelte 5, currency input, currency mask, form input, internationalization, i18n, number format"
	/>
	<meta name="author" content="Canutin" />

	<meta property="og:title" content="svelte-currency-input" />
	<meta
		property="og:description"
		content="A Svelte 5 form input component with currency masking, formatting, and internationalization support."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://svelte-currency-input.fernando.is" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="svelte-currency-input" />
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
					href="https://github.com/fmaclen/svelte-currency-input"
					target="_blank"
					class="border-b border-slate-300 text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-900"
				>
					GitHub
				</a>
				<a href="https://www.npmjs.com/package/@canutin/svelte-currency-input" target="_blank">
					<img
						src="https://img.shields.io/npm/dm/@canutin/svelte-currency-input?style=flat&color=black"
						alt="NPM downloads"
						class="h-5"
					/>
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
			<div class="grid gap-6 text-sm sm:grid-cols-3">
				{#each sections as section (section.title)}
					<div>
						<h2 class="mb-2 text-xs font-medium text-slate-400">{section.title}</h2>
						<ul class="flex flex-col gap-1.5">
							{#each section.items as item (item.id)}
								<li>
									<a
										href="#{item.id}"
										class="border-b border-slate-300 text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-900"
									>
										{item.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</header>

	<section id="install" class="mt-8">
		<div class="mb-3 flex items-center justify-between">
			<h2 class="text-base font-medium text-slate-800">Installation</h2>
			<div class="flex items-center gap-1">
				{#each packageManagers as pm, i (pm.name)}
					<button
						onclick={() => (selectedPm = i)}
						class="rounded border px-2 py-1 text-xs font-medium transition-colors {selectedPm === i
							? 'border-transparent bg-slate-200 text-slate-900'
							: 'border-slate-300 text-slate-500 hover:text-slate-700'}"
					>
						{pm.name}
					</button>
				{/each}
			</div>
		</div>
		<pre class="overflow-x-auto rounded border border-slate-200 bg-slate-50 p-4 text-xs"><code
				class="font-mono text-slate-700">{packageManagers[selectedPm].command}</code
			></pre>
	</section>

	<div class="mt-8 flex flex-col gap-8">
		<BasicUsage />
		<InternationalCurrencies />
		<Abbreviations />
		<DecimalPrecision />
		<MinMaxStep />
		<CustomPrefixSuffix />
		<PositiveNegativeNeutral />
		<TipCalculator />
		<ChainedInputs />
		<FormatValueUtility />
	</div>
</div>
