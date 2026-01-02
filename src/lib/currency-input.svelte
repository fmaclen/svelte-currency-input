<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type {
		IntlConfig,
		CurrencyInputValues,
		CleanValueOptions,
		FormatValueOptions
	} from './types';
	import {
		isNumber,
		cleanValue,
		fixedDecimalValue,
		formatValue,
		getLocaleConfig,
		padTrimValue,
		getSuffix,
		repositionCursor
	} from './utils/index';

	type Props = Omit<HTMLInputAttributes, 'value'> & {
		value?: string;
		intlConfig?: IntlConfig;
		prefix?: string;
		suffix?: string;
		decimalSeparator?: string;
		groupSeparator?: string;
		allowDecimals?: boolean;
		decimalsLimit?: number;
		decimalScale?: number;
		fixedDecimalLength?: number;
		allowNegativeValue?: boolean;
		min?: number;
		max?: number;
		maxLength?: number;
		step?: number;
		disableGroupSeparators?: boolean;
		disableAbbreviations?: boolean;
		formatValueOnBlur?: boolean;
		transformRawValue?: (rawValue: string) => string;
		oninputvalue?: (values: CurrencyInputValues) => void;
		onchangevalue?: (values: CurrencyInputValues) => void;
		ref?: HTMLInputElement | null;
	};

	let {
		value = $bindable(''),
		intlConfig,
		prefix: userPrefix,
		suffix: userSuffix,
		decimalSeparator: _decimalSeparator,
		groupSeparator: _groupSeparator,
		allowDecimals = true,
		decimalsLimit,
		decimalScale,
		fixedDecimalLength,
		allowNegativeValue = true,
		min,
		max,
		maxLength: userMaxLength,
		step,
		disableGroupSeparators = false,
		disableAbbreviations = false,
		formatValueOnBlur = true,
		transformRawValue,
		oninputvalue,
		onchangevalue,
		ref = $bindable(null),
		...restProps
	}: Props = $props();

	$effect(() => {
		if (_decimalSeparator && isNumber(_decimalSeparator)) {
			throw new Error('decimalSeparator cannot be a number');
		}

		if (_groupSeparator && isNumber(_groupSeparator)) {
			throw new Error('groupSeparator cannot be a number');
		}
	});

	let localeConfig = $derived(getLocaleConfig(intlConfig));
	let decimalSeparator = $derived(_decimalSeparator || localeConfig.decimalSeparator || '');
	let groupSeparator = $derived(_groupSeparator || localeConfig.groupSeparator || '');
	let prefix = $derived(userPrefix ?? localeConfig.prefix);
	let suffix = $derived(userSuffix ?? '');

	$effect(() => {
		if (
			decimalSeparator &&
			groupSeparator &&
			decimalSeparator === groupSeparator &&
			disableGroupSeparators === false
		) {
			throw new Error('decimalSeparator cannot be the same as groupSeparator');
		}
	});

	let formatValueOptions = $derived<Partial<FormatValueOptions>>({
		decimalSeparator,
		groupSeparator,
		disableGroupSeparators,
		intlConfig,
		prefix,
		suffix
	});

	let cleanValueOptions = $derived<Partial<CleanValueOptions>>({
		decimalSeparator,
		groupSeparator,
		allowDecimals,
		decimalsLimit: decimalsLimit ?? fixedDecimalLength ?? 2,
		allowNegativeValue,
		disableAbbreviations,
		prefix,
		transformRawValue
	});

	let stateValue = $state('');
	let dirty = $state(false);
	let cursor = $state(0);
	let changeCount = $state(0);
	let lastKeyStroke = $state<string | null>(null);

	$effect(() => {
		if (stateValue === '-' || (decimalSeparator && stateValue === decimalSeparator)) {
			return;
		}
		if (value !== undefined && value !== null && value !== '') {
			const formatted = formatValue({
				...formatValueOptions,
				decimalScale: dirty ? undefined : decimalScale,
				value: String(value)
			});
			if (!dirty) {
				stateValue = formatted;
			}
		} else if (!dirty) {
			stateValue = '';
		}
	});

	$effect(() => {
		if (dirty && stateValue !== '-' && ref && document.activeElement === ref) {
			ref.setSelectionRange(cursor, cursor);
		}
	});

	function processChange(inputValue: string, selectionStart?: number | null): void {
		dirty = true;

		const { modifiedValue, cursorPosition } = repositionCursor({
			selectionStart,
			value: inputValue,
			lastKeyStroke,
			stateValue,
			groupSeparator
		});

		const stringValue = cleanValue({ value: modifiedValue, ...cleanValueOptions });

		if (userMaxLength && stringValue.replace(/-/g, '').length > userMaxLength) {
			if (ref) {
				ref.value = stateValue;
				const cursorPos = Math.min(selectionStart ?? 0, stateValue.length);
				ref.setSelectionRange(cursorPos, cursorPos);
			}
			return;
		}

		if (stringValue === '' || stringValue === '-' || stringValue === decimalSeparator) {
			value = '';
			stateValue = stringValue;
			cursor = 1;

			if (ref) {
				ref.value = stringValue;
				ref.setSelectionRange(cursor, cursor);
			}

			const values: CurrencyInputValues = { float: null, formatted: '', value: '' };
			oninputvalue?.(values);
			return;
		}

		const stringValueWithoutSeparator = decimalSeparator
			? stringValue.replace(decimalSeparator, '.')
			: stringValue;

		const numberValue = parseFloat(stringValueWithoutSeparator);

		const formattedValue = formatValue({
			value: stringValue,
			...formatValueOptions
		});

		let newCursor = cursorPosition ?? formattedValue.length;
		if (cursorPosition != null) {
			newCursor = cursorPosition + (formattedValue.length - inputValue.length);
			newCursor = newCursor <= 0 ? (prefix ? prefix.length : 0) : newCursor;
		}

		cursor = newCursor;
		changeCount = changeCount + 1;
		stateValue = formattedValue;
		value = stringValue;

		if (ref) {
			ref.value = formattedValue;
			ref.setSelectionRange(cursor, cursor);
		}

		const values: CurrencyInputValues = {
			float: numberValue,
			formatted: formattedValue,
			value: stringValue
		};
		oninputvalue?.(values);
	}

	function handleInput(event: Event): void {
		const target = event.target as HTMLInputElement;
		const { value: inputValue, selectionStart } = target;

		processChange(inputValue, selectionStart);
	}

	function handleBlur(event: FocusEvent): void {
		const target = event.target as HTMLInputElement;
		const { value: inputValue } = target;

		const valueOnly = cleanValue({ value: inputValue, ...cleanValueOptions });

		if (valueOnly === '-' || valueOnly === decimalSeparator || !valueOnly) {
			stateValue = '';
			value = '';
			dirty = false;
			return;
		}

		const fixedDecimals = fixedDecimalValue(valueOnly, decimalSeparator, fixedDecimalLength);

		const newValue = padTrimValue(
			fixedDecimals,
			decimalSeparator,
			decimalScale !== undefined ? decimalScale : fixedDecimalLength
		);

		const stringValueWithoutSeparator = decimalSeparator
			? newValue.replace(decimalSeparator, '.')
			: newValue;

		const numberValue = parseFloat(stringValueWithoutSeparator);

		const formattedValue = formatValue({
			...formatValueOptions,
			value: newValue
		});

		if (formatValueOnBlur) {
			stateValue = formattedValue;
			value = newValue;

			const values: CurrencyInputValues = {
				float: numberValue,
				formatted: formattedValue,
				value: newValue
			};
			onchangevalue?.(values);
		}

		dirty = false;
	}

	function handleKeyDown(event: KeyboardEvent): void {
		const { key } = event;

		lastKeyStroke = key;

		if (step && (key === 'ArrowUp' || key === 'ArrowDown')) {
			event.preventDefault();
			cursor = stateValue.length;

			const stringValueWithoutSeparator =
				decimalSeparator && value ? value.replace(decimalSeparator, '.') : value;

			const currentValue =
				parseFloat(
					stringValueWithoutSeparator != null && stringValueWithoutSeparator !== ''
						? stringValueWithoutSeparator
						: cleanValue({ value: stateValue, ...cleanValueOptions })
				) || 0;
			const newValue = key === 'ArrowUp' ? currentValue + step : currentValue - step;

			if ((min !== undefined && newValue < min) || (!allowNegativeValue && newValue < 0)) {
				return;
			}

			if (max !== undefined && newValue > max) {
				return;
			}

			const fixedLength = String(step).includes('.')
				? Number(String(step).split('.')[1].length)
				: undefined;

			processChange(
				String(fixedLength ? newValue.toFixed(fixedLength) : newValue).replace(
					'.',
					decimalSeparator
				)
			);
		}
	}

	function handleKeyUp(event: KeyboardEvent): void {
		const { key } = event;
		const target = event.currentTarget as HTMLInputElement;
		const { selectionStart } = target;

		if (key !== 'ArrowUp' && key !== 'ArrowDown' && stateValue !== '-') {
			const suffixValue = getSuffix(stateValue, { groupSeparator, decimalSeparator });

			if (
				suffixValue &&
				selectionStart &&
				selectionStart > stateValue.length - suffixValue.length
			) {
				if (ref) {
					const newCursor = stateValue.length - suffixValue.length;
					ref.setSelectionRange(newCursor, newCursor);
				}
			}
		}
	}

	let displayValue = $derived.by(() => {
		if (stateValue === '-' || stateValue === decimalSeparator) {
			return stateValue;
		}
		if (value !== undefined && value !== null && value !== '') {
			return formatValue({
				...formatValueOptions,
				decimalScale: dirty ? undefined : decimalScale,
				value: String(value)
			});
		}
		return stateValue;
	});
</script>

<input
	bind:this={ref}
	type="text"
	inputmode="decimal"
	value={displayValue}
	oninput={handleInput}
	onblur={handleBlur}
	onkeydown={handleKeyDown}
	onkeyup={handleKeyUp}
	{...restProps}
/>
