// Component
export { default as CurrencyInput } from './currency-input.svelte';

// Types
export type {
	IntlConfig,
	CurrencyInputValues,
	LocaleConfig,
	FormatValueOptions,
	CleanValueOptions
} from './types';

// Utilities
export {
	addSeparators,
	cleanValue,
	escapeRegExp,
	fixedDecimalValue,
	formatValue,
	getLocaleConfig,
	getSuffix,
	isNumber,
	padTrimValue,
	parseAbbrValue,
	abbrValue,
	removeInvalidChars,
	removeSeparators,
	repositionCursor
} from './utils/index';
