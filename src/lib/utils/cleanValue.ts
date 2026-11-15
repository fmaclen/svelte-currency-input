import type { CleanValueOptions } from '../types';
import { escapeRegExp } from './escapeRegExp';
import { expandAbbrValue } from './parseAbbrValue';
import { removeInvalidChars } from './removeInvalidChars';
import { removeSeparators } from './removeSeparators';

export const cleanValue = ({
	value: rawInput,
	groupSeparator = ',',
	decimalSeparator = '.',
	allowDecimals = true,
	decimalsLimit = 2,
	allowNegativeValue = true,
	disableAbbreviations = false,
	prefix = '',
	transformRawValue = (rawValue) => rawValue
}: CleanValueOptions): string => {
	// Intl uses U+2212 for the minus sign in some locales
	const value = rawInput.replace(/\u2212/g, '-');
	const transformedValue = transformRawValue(value);

	if (transformedValue === '-') {
		return allowNegativeValue ? transformedValue : '';
	}

	const abbreviations = disableAbbreviations ? [] : ['k', 'm', 'b'];
	const negativeDecimal = decimalSeparator ? `|(^-${escapeRegExp(decimalSeparator)})` : '';
	const reg = new RegExp(`((^|\\D)-\\d)|(-${escapeRegExp(prefix)})${negativeDecimal}`);
	const isNegative = reg.test(transformedValue);

	const [prefixWithValue, preValue] =
		RegExp(`(\\d+)-?${escapeRegExp(prefix)}`).exec(transformedValue) || [];
	const withoutPrefix = prefix
		? prefixWithValue
			? transformedValue.replace(prefixWithValue, '').concat(preValue)
			: transformedValue.replace(prefix, '')
		: transformedValue;
	const withoutSeparators = removeSeparators(withoutPrefix, groupSeparator);
	const withoutInvalidChars = removeInvalidChars(withoutSeparators, [
		groupSeparator,
		decimalSeparator,
		...abbreviations
	]);

	let valueOnly = withoutInvalidChars;
	let isAbbreviation = false;

	if (!disableAbbreviations) {
		if (
			abbreviations.some(
				(letter) => letter === withoutInvalidChars.toLowerCase().replace(decimalSeparator, '')
			)
		) {
			return '';
		}
		const parsed = expandAbbrValue(withoutInvalidChars, decimalSeparator);
		if (parsed !== undefined) {
			valueOnly = parsed;
			isAbbreviation = true;
		}
	}

	const includeNegative = isNegative && allowNegativeValue ? '-' : '';

	if (decimalSeparator && valueOnly.includes(decimalSeparator)) {
		const [int, decimals] = valueOnly.split(decimalSeparator);
		const trimmedDecimals = decimalsLimit && decimals ? decimals.slice(0, decimalsLimit) : decimals;
		// Expanded abbreviations always report "." decimals, eg. 1,2345k is 1234.5 with a "," separator
		const outputSeparator = isAbbreviation ? '.' : decimalSeparator;
		const includeDecimals = allowDecimals ? `${outputSeparator}${trimmedDecimals}` : '';

		return `${includeNegative}${int}${includeDecimals}`;
	}

	return `${includeNegative}${valueOnly}`;
};
