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
		value?: string | undefined;
		intlConfig?: IntlConfig | undefined;
		prefix?: string | undefined;
		suffix?: string | undefined;
		decimalSeparator?: string | undefined;
		groupSeparator?: string | undefined;
		allowDecimals?: boolean | undefined;
		decimalsLimit?: number | undefined;
		decimalScale?: number | undefined;
		fixedDecimalLength?: number | undefined;
		allowNegativeValue?: boolean | undefined;
		min?: number | undefined;
		max?: number | undefined;
		maxLength?: number | undefined;
		step?: number | undefined;
		disableGroupSeparators?: boolean | undefined;
		disableAbbreviations?: boolean | undefined;
		formatValueOnBlur?: boolean | undefined;
		transformRawValue?: ((rawValue: string) => string) | undefined;
		oninputvalue?: ((values: CurrencyInputValues) => void) | undefined;
		onchangevalue?: ((values: CurrencyInputValues) => void) | undefined;
		ref?: HTMLInputElement | null | undefined;
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
	let negativeDecimal = $derived(`-${decimalSeparator}`);

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
		// With group separators disabled, the locale's group separator can equal the decimal separator
		groupSeparator:
			disableGroupSeparators && groupSeparator === decimalSeparator ? '' : groupSeparator,
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
			// Not groupSeparator: it can equal the decimal separator, see cleanValueOptions
			groupSeparator: cleanValueOptions.groupSeparator
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

		if (
			stringValue === '' ||
			stringValue === '-' ||
			stringValue === decimalSeparator ||
			stringValue === negativeDecimal
		) {
			value = '';
			stateValue = stringValue;
			cursor = stringValue === negativeDecimal ? negativeDecimal.length : 1;

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

		if (
			valueOnly === '-' ||
			valueOnly === decimalSeparator ||
			valueOnly === negativeDecimal ||
			!valueOnly
		) {
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

			const stepString = String(step);
			const valueString = String(currentValue);
			const stepDecimals = stepString.includes('.') ? stepString.split('.')[1].length : 0;

			const toStepValue = (decimals: number): string =>
				String(decimals ? newValue.toFixed(decimals) : newValue).replace('.', decimalSeparator);

			const stepValue = toStepValue(stepDecimals);

			// Float errors, eg. 8.2 - 1 = 7.199999999999999, are dropped by rounding to the value decimals
			const valueDecimals =
				decimalSeparator && Number.isInteger(step) && /^-?\d+\.\d+$/.test(valueString)
					? valueString.split('.')[1].length
					: 0;
			const roundedValue = valueDecimals ? toStepValue(valueDecimals) : stepValue;

			const toNumber = (value: string): number => {
				const cleaned = cleanValue({ ...cleanValueOptions, value, transformRawValue: undefined });
				return parseFloat(cleaned.replace(decimalSeparator, '.'));
			};

			// Rounding a result that was already right would drop digits, eg. 34.7 - 12 must stay 22.70
			processChange(
				roundedValue === stepValue || toNumber(roundedValue) === toNumber(stepValue)
					? stepValue
					: roundedValue
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
