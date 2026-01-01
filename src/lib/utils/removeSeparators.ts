import { escapeRegExp } from './escapeRegExp.js';

export const removeSeparators = (value: string, separator = ','): string => {
	const reg = new RegExp(escapeRegExp(separator), 'g');
	return value.replace(reg, '');
};
