import { escapeRegExp } from './escapeRegExp';

export const removeSeparators = (value: string, separator = ','): string => {
	const reg = new RegExp(escapeRegExp(separator), 'g');
	return value.replace(reg, '');
};
