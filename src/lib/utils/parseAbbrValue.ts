import { escapeRegExp } from './escapeRegExp';

export const abbrValue = (value: number, decimalSeparator = '.', _decimalPlaces = 10): string => {
	if (value > 999) {
		let valueLength = ('' + value).length;
		const p = Math.pow;
		const d = p(10, _decimalPlaces);
		valueLength -= valueLength % 3;

		const abbrValue = Math.round((value * d) / p(10, valueLength)) / d + ' kMGTPE'[valueLength / 3];
		return abbrValue.replace('.', decimalSeparator);
	}

	return String(value);
};

type AbbrExponents = { [key: string]: number };

const abbrExponents: AbbrExponents = { k: 3, m: 6, b: 9 };

// Moves the decimal separator instead of multiplying, which gives 4.1m = 4099999.9999999995
export const expandAbbrValue = (value: string, decimalSeparator = '.'): string | undefined => {
	const reg = new RegExp(`(-?)(\\d*)(?:${escapeRegExp(decimalSeparator)}(\\d*))?([kmb])$`, 'i');
	const match = value.match(reg);

	// Both digit groups are optional so .5k matches, which also lets .k and a bare k through
	if (!match || (!match[2] && !match[3])) {
		return undefined;
	}

	const [, sign, int, decimals = '', abbr] = match;
	const exponent = abbrExponents[abbr.toLowerCase()];
	const paddedDecimals = decimals.padEnd(exponent, '0');
	const expandedInt = `${int}${paddedDecimals.slice(0, exponent)}`.replace(/^0+(?=\d)/, '');
	const remainingDecimals = paddedDecimals.slice(exponent).replace(/0+$/, '');

	return remainingDecimals
		? `${sign}${expandedInt}${decimalSeparator}${remainingDecimals}`
		: `${sign}${expandedInt}`;
};

export const parseAbbrValue = (value: string, decimalSeparator = '.'): number | undefined => {
	const expanded = expandAbbrValue(value, decimalSeparator);

	return expanded === undefined ? undefined : Number(expanded.replace(decimalSeparator, '.'));
};
