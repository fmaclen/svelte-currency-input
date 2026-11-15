import { describe, it, expect } from 'vitest';
import { cleanValue } from '$lib/utils/cleanValue';

describe('cleanValue', () => {
	it('should remove group separator in string', () => {
		expect(
			cleanValue({
				value: '1,000,000'
			})
		).toBe('1000000');
	});

	it('should handle period decimal separator in string', () => {
		expect(
			cleanValue({
				value: '1.000.000,12',
				decimalSeparator: ',',
				groupSeparator: '.'
			})
		).toBe('1000000,12');
	});

	it('should remove prefix', () => {
		expect(
			cleanValue({
				value: '£1000000',
				prefix: '£'
			})
		).toBe('1000000');

		expect(
			cleanValue({
				value: '$5.5',
				prefix: '$'
			})
		).toBe('5.5');

		expect(
			cleanValue({
				value: '$ 1.5',
				prefix: '$ '
			})
		).toBe('1.5');

		expect(
			cleanValue({
				value: 'JMD5.5',
				prefix: 'JMD'
			})
		).toBe('5.5');

		expect(
			cleanValue({
				value: 'Value: 1.5',
				prefix: 'Value: '
			})
		).toBe('1.5');
	});

	it('should remove suffix', () => {
		expect(
			cleanValue({
				value: '123 €'
			})
		).toBe('123');

		expect(
			cleanValue({
				groupSeparator: '.',
				decimalSeparator: ',',
				value: '123.456,99 €'
			})
		).toBe('123456,99');
	});

	it('should remove extra decimals', () => {
		expect(
			cleanValue({
				value: '100.0000'
			})
		).toBe('100.00');
	});

	it('should remove decimals if not allowed', () => {
		expect(
			cleanValue({
				value: '100.0000',
				allowDecimals: false,
				decimalsLimit: 0
			})
		).toBe('100');
	});

	it('should include decimals if allowed', () => {
		expect(
			cleanValue({
				value: '100.123',
				allowDecimals: true,
				decimalsLimit: 0
			})
		).toBe('100.123');
	});

	it('should format value', () => {
		expect(
			cleanValue({
				value: '£1,234,567.89',
				prefix: '£'
			})
		).toBe('1234567.89');
	});

	describe('negative values', () => {
		it('should handle negative value', () => {
			expect(
				cleanValue({
					value: '-£1,000',
					decimalSeparator: '.',
					groupSeparator: ',',
					allowDecimals: true,
					decimalsLimit: 2,
					prefix: '£'
				})
			).toBe('-1000');
		});

		it('should handle negative value with intl with prefix', () => {
			expect(
				cleanValue({
					value: '€\xa0-123',
					prefix: '€'
				})
			).toBe('-123');
		});

		it('should handle negative value with decimal', () => {
			expect(
				cleanValue({
					value: '-£99,999.99',
					decimalSeparator: '.',
					groupSeparator: ',',
					allowDecimals: true,
					decimalsLimit: 2,
					prefix: '£'
				})
			).toBe('-99999.99');
		});

		it('should handle negative value with group separator', () => {
			expect(
				cleanValue({
					value: '-£99-999.99',
					decimalSeparator: '.',
					groupSeparator: '-',
					allowDecimals: true,
					decimalsLimit: 2,
					prefix: '£'
				})
			).toBe('-99999.99');
		});

		it('should handle not allow negative value if allowNegativeValue is false', () => {
			expect(
				cleanValue({
					value: '-£1,000',
					decimalSeparator: '.',
					groupSeparator: ',',
					allowDecimals: true,
					decimalsLimit: 2,
					allowNegativeValue: false,
					prefix: '£'
				})
			).toBe('1000');
		});

		it('should return an empty string for a lone minus sign if allowNegativeValue is false', () => {
			expect(cleanValue({ value: '-', allowNegativeValue: false })).toBe('');
		});

		it('should keep the minus sign before a leading decimal separator', () => {
			expect(cleanValue({ value: '-.', prefix: '$' })).toBe('-.');
			expect(cleanValue({ value: '-.5', prefix: '$' })).toBe('-.5');
			expect(
				cleanValue({ value: '-,5', prefix: 'R$', decimalSeparator: ',', groupSeparator: '.' })
			).toBe('-,5');
		});
	});

	it('should handle values placed before prefix', () => {
		expect(
			cleanValue({
				value: '2£1',
				prefix: '£'
			})
		).toBe('12');

		expect(
			cleanValue({
				value: '-2£1',
				prefix: '£'
			})
		).toBe('-12');

		expect(
			cleanValue({
				value: '2-£1',
				prefix: '£'
			})
		).toBe('-12');

		expect(
			cleanValue({
				value: '2-£1.99',
				prefix: '£',
				decimalsLimit: 5
			})
		).toBe('-1.992');
	});

	describe('abbreviations', () => {
		it('should return empty string if abbreviation only', () => {
			expect(
				cleanValue({
					value: 'k',
					disableAbbreviations: false
				})
			).toBe('');

			expect(
				cleanValue({
					value: 'm',
					disableAbbreviations: false
				})
			).toBe('');

			expect(
				cleanValue({
					value: 'b',
					disableAbbreviations: false
				})
			).toBe('');
		});

		it('should return empty string if prefix and abbreviation only', () => {
			expect(
				cleanValue({
					value: '$k',
					prefix: '$',
					disableAbbreviations: false
				})
			).toBe('');

			expect(
				cleanValue({
					value: '£m',
					prefix: '£',
					disableAbbreviations: false
				})
			).toBe('');
		});

		it('should return empty string if decimal separator and abbreviation only', () => {
			expect(
				cleanValue({
					value: '.k'
				})
			).toBe('');

			expect(
				cleanValue({
					value: '.m'
				})
			).toBe('');

			expect(
				cleanValue({
					value: '£.m',
					prefix: '£'
				})
			).toBe('');
		});

		it('should expand abbreviations without floating-point errors', () => {
			expect(cleanValue({ value: '4.1m' })).toBe('4100000');
			expect(cleanValue({ value: '-4.11B' })).toBe('-4110000000');
			expect(cleanValue({ value: '1.025m' })).toBe('1025000');
			expect(cleanValue({ value: '2.1k' })).toBe('2100');
			expect(cleanValue({ value: '3.1m' })).toBe('3100000');
		});

		it('should apply decimalsLimit to an expanded abbreviation', () => {
			expect(cleanValue({ value: '1.2345678k', decimalsLimit: 2 })).toBe('1234.56');
		});

		it('should drop the decimals of an expanded abbreviation if decimals are not allowed', () => {
			expect(cleanValue({ value: '1.2345k', allowDecimals: false })).toBe('1234');
		});

		it('should report a "." decimal in an expanded abbreviation with a comma decimal separator', () => {
			expect(cleanValue({ value: '1,2345k', decimalSeparator: ',', groupSeparator: '.' })).toBe(
				'1234.5'
			);
			expect(cleanValue({ value: '1,2345678k', decimalSeparator: ',', groupSeparator: '.' })).toBe(
				'1234.56'
			);
			expect(cleanValue({ value: '4,1m', decimalSeparator: ',', groupSeparator: '.' })).toBe(
				'4100000'
			);
		});

		it('should expand abbreviations of values below one', () => {
			expect(cleanValue({ value: '0.5k' })).toBe('500');
		});

		it('should expand abbreviations that start with the decimal separator', () => {
			expect(cleanValue({ value: '.5k' })).toBe('500');
			expect(cleanValue({ value: '.05k' })).toBe('50');
			expect(cleanValue({ value: '.25m' })).toBe('250000');
			expect(cleanValue({ value: '-.5k' })).toBe('-500');
			expect(cleanValue({ value: '$.5k', prefix: '$' })).toBe('500');
			expect(cleanValue({ value: ',5k', decimalSeparator: ',', groupSeparator: '.' })).toBe('500');
		});

		it('should expand an abbreviation of zero to 0', () => {
			expect(cleanValue({ value: '0k' })).toBe('0');
			expect(cleanValue({ value: '0.0k' })).toBe('0');
			expect(cleanValue({ value: '00m' })).toBe('0');
		});

		it('should drop trailing zeros from the decimals of an expanded abbreviation', () => {
			expect(cleanValue({ value: '1.50000k' })).toBe('1500');
			expect(cleanValue({ value: '1.23450k', decimalsLimit: 3 })).toBe('1234.5');
		});

		it('should keep large expanded abbreviations exact', () => {
			expect(cleanValue({ value: '123456789.123b' })).toBe('123456789123000000');
		});

		it('should ignore abbreviations if disableAbbreviations is true', () => {
			expect(
				cleanValue({
					value: '1k',
					disableAbbreviations: true
				})
			).toBe('1');

			expect(
				cleanValue({
					value: '-2k',
					disableAbbreviations: true
				})
			).toBe('-2');

			expect(
				cleanValue({
					value: '25.6m',
					disableAbbreviations: true
				})
			).toBe('25.6');

			expect(
				cleanValue({
					value: '9b',
					disableAbbreviations: true
				})
			).toBe('9');
		});
	});

	it('should keep a U+2212 minus sign as a negative sign', () => {
		expect(cleanValue({ value: '\u22125,00 €', decimalSeparator: ',', groupSeparator: '.' })).toBe(
			'-5,00'
		);
	});

	it('should look for a digit before the prefix in the transformed value', () => {
		const movePrefixToFront = (rawValue: string) =>
			rawValue.endsWith('$') ? `$${rawValue.slice(0, -1)}` : rawValue;
		expect(cleanValue({ value: '12$', prefix: '$', transformRawValue: movePrefixToFront })).toBe(
			'12'
		);
	});
});
