export const escapeRegExp = (stringToGoIntoTheRegex: string): string => {
	return stringToGoIntoTheRegex.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};
