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

type AbbrMap = { [key: string]: number };

const abbrMap: AbbrMap = { k: 1000, m: 1000000, b: 1000000000 };

export const parseAbbrValue = (value: string, decimalSeparator = '.'): number | undefined => {
	const reg = new RegExp(`(\\d+(${escapeRegExp(decimalSeparator)}\\d*)?)([kmb])$`, 'i');
	const match = value.match(reg);

	if (match) {
		const [, digits, , abbr] = match;
		const multiplier = abbrMap[abbr.toLowerCase()];
		const result = Number(digits.replace(decimalSeparator, '.')) * multiplier;

		// Round based on input precision to avoid floating-point errors
		// e.g. 4.1 * 1000000 = 4099999.9999999995 should become 4100000
		// but 1.12345678 * 1000 = 1123.45678 should preserve all decimals
		const decimalPart = digits.split(decimalSeparator)[1] || '';
		const inputDecimals = decimalPart.length;
		const multiplierZeros = Math.log10(multiplier);
		const resultDecimals = Math.max(0, inputDecimals - multiplierZeros);
		const precision = Math.pow(10, resultDecimals);

		return Math.round(result * precision) / precision;
	}

	return undefined;
};
