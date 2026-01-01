import { escapeRegExp } from './escapeRegExp.js';

type Options = {
	decimalSeparator?: string;
	groupSeparator?: string;
};

export const getSuffix = (
	value: string,
	{ groupSeparator = ',', decimalSeparator = '.' }: Options
): string | undefined => {
	const suffixReg = new RegExp(
		`\\d([^${escapeRegExp(groupSeparator)}${escapeRegExp(decimalSeparator)}0-9]+)`
	);
	const suffixMatch = value.match(suffixReg);
	return suffixMatch ? suffixMatch[1] : undefined;
};
