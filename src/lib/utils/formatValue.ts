import type { FormatValueOptions } from '../types';
import { escapeRegExp } from './escapeRegExp';
import { getSuffix } from './getSuffix';

export const formatValue = (options: FormatValueOptions): string => {
	const {
		value: _value,
		decimalSeparator,
		intlConfig,
		decimalScale,
		prefix = '',
		suffix = '',
		roundValue = false
	} = options;

	if (_value === '' || _value === undefined) {
		return '';
	}

	if (_value === '-') {
		return '-';
	}

	const isNegative = new RegExp(`^\\d?-${prefix ? `${escapeRegExp(prefix)}?` : ''}\\d`).test(
		_value
	);

	let value =
		decimalSeparator !== '.'
			? replaceDecimalSeparator(_value, decimalSeparator, isNegative)
			: _value;

	if (decimalSeparator && decimalSeparator !== '-' && value.startsWith(decimalSeparator)) {
		value = '0' + value;
	}

	const { locale, currency, ...formatOptions } = intlConfig || {};

	const defaultNumberFormatOptions = {
		...formatOptions,
		minimumFractionDigits: decimalScale || 0,
		maximumFractionDigits: roundValue && decimalScale !== undefined ? decimalScale : 20
	};

	const numberFormatter = intlConfig
		? new Intl.NumberFormat(locale, {
				...defaultNumberFormatOptions,
				...(currency && { style: 'currency', currency })
			})
		: new Intl.NumberFormat(undefined, defaultNumberFormatOptions);

	const parts = numberFormatter.formatToParts(Number(value));

	let formatted = replaceParts(parts, options);

	const intlSuffix = getSuffix(formatted, { ...options });

	const includeDecimalSeparator = _value.slice(-1) === decimalSeparator ? decimalSeparator : '';

	const [, decimals] = value.match(RegExp('\\d+\\.(\\d+)')) || [];

	if (decimalScale === undefined && decimals && decimalSeparator) {
		if (formatted.includes(decimalSeparator)) {
			formatted = formatted.replace(
				RegExp(`(\\d+)(${escapeRegExp(decimalSeparator)})(\\d+)`, 'g'),
				`$1$2${decimals}`
			);
		} else {
			if (intlSuffix && !suffix) {
				formatted = formatted.replace(intlSuffix, `${decimalSeparator}${decimals}${intlSuffix}`);
			} else {
				formatted = `${formatted}${decimalSeparator}${decimals}`;
			}
		}
	}

	if (suffix && includeDecimalSeparator) {
		return `${formatted}${includeDecimalSeparator}${suffix}`;
	}

	if (intlSuffix && includeDecimalSeparator) {
		return formatted.replace(intlSuffix, `${includeDecimalSeparator}${intlSuffix}`);
	}

	if (intlSuffix && suffix) {
		return formatted.replace(intlSuffix, `${includeDecimalSeparator}${suffix}`);
	}

	return [formatted, includeDecimalSeparator, suffix].join('');
};

const replaceDecimalSeparator = (
	value: string,
	decimalSeparator: FormatValueOptions['decimalSeparator'],
	isNegative: boolean
): string => {
	let newValue = value;
	if (decimalSeparator && decimalSeparator !== '.') {
		newValue = newValue.replace(RegExp(escapeRegExp(decimalSeparator), 'g'), '.');
		if (isNegative && decimalSeparator === '-') {
			newValue = `-${newValue.slice(1)}`;
		}
	}
	return newValue;
};

const replaceParts = (
	parts: Intl.NumberFormatPart[],
	{
		prefix,
		groupSeparator,
		decimalSeparator,
		decimalScale,
		disableGroupSeparators = false,
		roundValue = false
	}: Pick<
		FormatValueOptions,
		| 'prefix'
		| 'groupSeparator'
		| 'decimalSeparator'
		| 'decimalScale'
		| 'disableGroupSeparators'
		| 'roundValue'
	>
): string => {
	return parts
		.reduce(
			(prev, { type, value }, i) => {
				if (i === 0 && prefix) {
					if (type === 'minusSign') {
						return [value, prefix];
					}

					if (type === 'currency') {
						return [...prev, prefix];
					}

					return [prefix, value];
				}

				if (type === 'currency') {
					return prefix ? prev : [...prev, value];
				}

				if (type === 'group') {
					return !disableGroupSeparators
						? [...prev, groupSeparator !== undefined ? groupSeparator : value]
						: prev;
				}

				if (type === 'decimal') {
					if (decimalScale !== undefined && decimalScale === 0) {
						return prev;
					}

					return [...prev, decimalSeparator !== undefined ? decimalSeparator : value];
				}

				if (type === 'fraction') {
					if (roundValue) {
						return [...prev, value];
					}
					return [...prev, decimalScale !== undefined ? value.slice(0, decimalScale) : value];
				}

				return [...prev, value];
			},
			['']
		)
		.join('');
};
