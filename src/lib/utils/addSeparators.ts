export const addSeparators = (value: string, separator = ','): string => {
	return value.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};
