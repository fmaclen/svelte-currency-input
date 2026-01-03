export type IntlConfig = {
	locale: string;
} & Intl.NumberFormatOptions;

export type CurrencyInputValues = {
	float: number | null;
	formatted: string;
	value: string;
};

export type LocaleConfig = {
	currencySymbol: string;
	groupSeparator: string;
	decimalSeparator: string;
	prefix: string;
	suffix: string;
};

export type FormatValueOptions = {
	value: string | undefined;
	decimalSeparator?: string;
	groupSeparator?: string;
	disableGroupSeparators?: boolean;
	intlConfig?: IntlConfig;
	decimalScale?: number;
	prefix?: string;
	suffix?: string;
	roundValue?: boolean;
};

export type CleanValueOptions = {
	value: string;
	decimalSeparator?: string;
	groupSeparator?: string;
	allowDecimals?: boolean;
	decimalsLimit?: number;
	allowNegativeValue?: boolean;
	disableAbbreviations?: boolean;
	prefix?: string;
	transformRawValue?: (rawValue: string) => string;
};
