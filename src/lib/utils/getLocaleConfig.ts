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

	return numberFormatter.formatToParts(1000.1).reduce((prev, curr, i): LocaleConfig => {
		if (curr.type === 'currency') {
			if (i === 0) {
				return { ...prev, currencySymbol: curr.value, prefix: curr.value };
			} else {
				return { ...prev, currencySymbol: curr.value, suffix: curr.value };
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
