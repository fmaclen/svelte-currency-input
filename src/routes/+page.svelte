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
	import ArgentinaRates from './argentina-rates.svelte';

	const packageManagers = [
		{ name: 'bun', command: 'bun add @canutin/svelte-currency-input' },
		{ name: 'pnpm', command: 'pnpm add @canutin/svelte-currency-input' },
		{ name: 'npm', command: 'npm install @canutin/svelte-currency-input' },
		{ name: 'yarn', command: 'yarn add @canutin/svelte-currency-input' }
	];

	let selectedPm = $state(0);

	const UTM = 'utm_source=svelte-currency-input&utm_medium=demo';

	const sections: {
		title: string;
		items: { id: string; label: string; href?: string }[];
	}[] = [
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
				{ id: 'chained', label: 'Chained inputs' },
				{ id: 'formatvalue', label: 'Format utility' },
				{ id: 'one-usd', label: 'One USD, many pesos' }
			]
		},
		{
			title: 'Resources',
			items: [
				{
					id: 'docs',
					label: 'Docs',
					href: `https://github.com/fmaclen/svelte-currency-input?${UTM}#readme`
				},
				{
					id: 'contributing',
					label: 'Contributing',
					href: `https://github.com/fmaclen/svelte-currency-input/blob/main/CONTRIBUTING.md?${UTM}`
				},
				{
					id: 'migration',
					label: 'Migration guide (v0 to v1)',
					href: `https://github.com/fmaclen/svelte-currency-input/blob/main/MIGRATION.md?${UTM}`
				},
				{
					id: 'npm',
					label: 'NPM',
					href: `https://www.npmjs.com/package/@canutin/svelte-currency-input?${UTM}`
				},
				{
					id: 'github',
					label: 'GitHub',
					href: `https://github.com/fmaclen/svelte-currency-input?${UTM}`
				}
			]
		}
	];
</script>

{#snippet hr()}
	<hr class="my-8 border-slate-200" />
{/snippet}

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
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 class="text-xl font-bold text-slate-900">svelte-currency-input</h1>
				<p class="text-sm text-balance text-slate-600">
					A Svelte 5 form input with currency masking and internationalization support
				</p>
			</div>
			<nav class="flex items-center gap-2">
				<a
					href={`https://github.com/fmaclen/svelte-currency-input?${UTM}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src="https://img.shields.io/github/stars/fmaclen/svelte-currency-input?style=flat&color=black"
						alt="GitHub stars"
						class="h-5"
					/>
				</a>
				<a
					href={`https://github.com/fmaclen/svelte-currency-input/blob/main/LICENSE?${UTM}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src="https://img.shields.io/npm/l/@canutin/svelte-currency-input?style=flat&color=3178c6"
						alt="License"
						class="h-5"
					/>
				</a>
				<a
					href={`https://www.npmjs.com/package/@canutin/svelte-currency-input?${UTM}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src="https://img.shields.io/npm/v/@canutin/svelte-currency-input?style=flat&color=cb3837"
						alt="NPM version"
						class="h-5"
					/>
				</a>
				<a
					href={`https://www.npmjs.com/package/@canutin/svelte-currency-input?${UTM}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src="https://img.shields.io/npm/dm/@canutin/svelte-currency-input?style=flat&color=cb3837"
						alt="NPM downloads"
						class="h-5"
					/>
				</a>
			</nav>
		</div>

		{@render hr()}

		<nav class="grid gap-6 text-sm sm:grid-cols-4">
			{#each sections as section (section.title)}
				<div>
					<h2 class="mb-2 text-xs font-medium text-slate-400">{section.title}</h2>
					<ul class="flex flex-col gap-1.5">
						{#each section.items as item (item.id)}
							<li>
								{#if item.href}
									<!-- eslint-disable svelte/no-navigation-without-resolve -- external link -->
									<a
										href={item.href}
										target="_blank"
										rel="noopener noreferrer"
										class="border-b border-slate-300 text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-900"
									>
										{item.label}
									</a>
									<!-- eslint-enable svelte/no-navigation-without-resolve -->
								{:else}
									<a
										href="#{item.id}"
										class="border-b border-slate-300 text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-900"
									>
										{item.label}
									</a>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</header>

	{@render hr()}

	<!-- Getting started -->
	<section id="install" class="flex flex-col gap-8">
		<div>
			<div class="mb-3 flex items-center justify-between">
				<h2 class="text-base font-medium text-slate-800">Installation</h2>
				<div class="flex items-center gap-1">
					{#each packageManagers as pm, i (pm.name)}
						<button
							onclick={() => (selectedPm = i)}
							class="rounded border px-2 py-1 text-xs font-medium transition-colors {selectedPm ===
							i
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
		</div>
		<BasicUsage />
	</section>

	{@render hr()}

	<!-- Features -->
	<section class="flex flex-col gap-8">
		<InternationalCurrencies />
		<Abbreviations />
		<DecimalPrecision />
		<MinMaxStep />
		<CustomPrefixSuffix />
	</section>

	{@render hr()}

	<!-- Examples -->
	<section class="flex flex-col gap-8">
		<PositiveNegativeNeutral />
		<ChainedInputs />
		<FormatValueUtility />
		<ArgentinaRates />
	</section>

	{@render hr()}

	<footer class="text-center text-sm text-slate-500">
		Made by <a
			href="https://github.com/fmaclen?{UTM}"
			target="_blank"
			rel="noopener noreferrer"
			class="border-b border-slate-300 text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-900"
		>
			@fmaclen
		</a>
		·
		<a
			href="https://fernando.is?{UTM}"
			target="_blank"
			rel="noopener noreferrer"
			class="border-b border-slate-300 text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-900"
		>
			fernando.is
		</a>
	</footer>
</div>
