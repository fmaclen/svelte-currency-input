import type { IntlConfig, LocaleConfig } from '../types';

const defaultConfig: LocaleConfig = {
	currencySymbol: '',
	groupSeparator: '',
	decimalSeparator: '',
	prefix: '',
	suffix: ''
};

export const getLocaleConfig = (intlConfig?: IntlConfig): LocaleConfig => {
	const { locale, currency, ...formatOptions } = intlConfig || {};
	const numberFormatter = locale
		? new Intl.NumberFormat(locale, {
				...formatOptions,
				...(currency && { currency, style: 'currency' })
			})
		: new Intl.NumberFormat();

	const parts = numberFormatter.formatToParts(1000.1);
	return parts.reduce((prev, curr, i): LocaleConfig => {
		if (curr.type === 'currency') {
			if (i === 0) {
				const nextPart = parts[i + 1];
				const literal = nextPart?.type === 'literal' ? nextPart.value : '';
				return { ...prev, currencySymbol: curr.value, prefix: curr.value + literal };
			} else {
				const prevPart = parts[i - 1];
				const literal = prevPart?.type === 'literal' ? prevPart.value : '';
				return { ...prev, currencySymbol: curr.value, suffix: literal + curr.value };
			}
		}
		if (curr.type === 'group') {
			return { ...prev, groupSeparator: curr.value };
		}
		if (curr.type === 'decimal') {
			return { ...prev, decimalSeparator: curr.value };
		}

		return prev;
	}, defaultConfig);
};
