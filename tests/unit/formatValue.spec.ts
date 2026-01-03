import { describe, it, expect } from 'vitest';
import { formatValue } from '$lib/utils/formatValue';

describe('formatValue', () => {
	it('should return empty if blank value', () => {
		expect(
			formatValue({
				value: ''
			})
		).toBe('');
	});

	it('should add group separator', () => {
		expect(
			formatValue({
				value: '1234567',
				groupSeparator: '/'
			})
		).toBe('1/234/567');
	});

	it('should handle comma separator for decimals', () => {
		expect(
			formatValue({
				value: '1234567,89',
				decimalSeparator: ',',
				groupSeparator: '.'
			})
		).toBe('1.234.567,89');
	});

	it('should handle - as separator for decimals', () => {
		expect(
			formatValue({
				value: '1234567-89',
				decimalSeparator: '-',
				groupSeparator: '.'
			})
		).toBe('1.234.567-89');
	});

	it('should handle empty decimal separator', () => {
		expect(
			formatValue({
				value: '123456789',
				decimalSeparator: '',
				groupSeparator: ''
			})
		).toBe('123456789');
	});

	it('should NOT add separator if "disableGroupSeparators" is true', () => {
		expect(
			formatValue({
				value: '1234567',
				disableGroupSeparators: true
			})
		).toBe('1234567');
	});

	it('should NOT add separator if "disableGroupSeparators" is true even if decimal and group separators specified', () => {
		expect(
			formatValue({
				value: '1234567',
				decimalSeparator: '.',
				groupSeparator: ',',
				disableGroupSeparators: true
			})
		).toBe('1234567');
	});

	it('should add prefix', () => {
		expect(
			formatValue({
				value: '123',
				prefix: '£'
			})
		).toBe('£123');
	});

	it('should include decimal separator if last char', () => {
		expect(
			formatValue({
				value: '1234567.',
				groupSeparator: ',',
				decimalSeparator: '.'
			})
		).toBe('1,234,567.');

		expect(
			formatValue({
				value: '1234567,',
				groupSeparator: '.',
				decimalSeparator: ','
			})
		).toBe('1.234.567,');
	});

	it('should include decimals', () => {
		expect(
			formatValue({
				value: '1234.567',
				groupSeparator: ',',
				decimalSeparator: '.'
			})
		).toBe('1,234.567');
	});

	it('should format value', () => {
		expect(
			formatValue({
				value: '1234567.89',
				groupSeparator: ',',
				decimalSeparator: '.',
				prefix: '£'
			})
		).toBe('£1,234,567.89');
	});

	it('should handle decimals 999999', () => {
		expect(
			formatValue({
				value: '1.99999',
				intlConfig: { locale: 'en-GB', currency: 'GBP' }
			})
		).toBe('£1.99999');

		expect(
			formatValue({
				value: '1.99999'
			})
		).toBe('1.99999');
	});

	it('should handle 0 value', () => {
		expect(
			formatValue({
				value: '0',
				prefix: '£'
			})
		).toBe('£0');

		expect(
			formatValue({
				decimalSeparator: '.',
				groupSeparator: ',',
				disableGroupSeparators: false,
				decimalScale: 2,
				prefix: '£',
				value: '0'
			})
		).toBe('£0.00');
	});

	it('should pad decimal values with decimalScale', () => {
		expect(
			formatValue({
				decimalSeparator: '.',
				groupSeparator: ',',
				disableGroupSeparators: false,
				decimalScale: 2,
				prefix: '£',
				value: '0.1'
			})
		).toBe('£0.10');

		expect(
			formatValue({
				decimalSeparator: '.',
				groupSeparator: ',',
				disableGroupSeparators: false,
				decimalScale: 4,
				prefix: '£',
				value: '0.01'
			})
		).toBe('£0.0100');
	});

	it('should trim decimal values with decimalScale', () => {
		const value = String(9.99 / 0.33);

		expect(
			formatValue({
				value,
				decimalScale: 2,
				intlConfig: { locale: 'en-AU', currency: 'AUD' }
			})
		).toBe('$30.27');

		expect(
			formatValue({
				value,
				decimalScale: 1,
				intlConfig: { locale: 'en-AU', currency: 'AUD' }
			})
		).toBe('$30.2');

		expect(
			formatValue({
				value,
				decimalScale: 0,
				intlConfig: { locale: 'en-AU', currency: 'AUD' }
			})
		).toBe('$30');
	});

	describe('roundValue option', () => {
		const intlConfig = { locale: 'en-US', currency: 'USD' };

		it('should truncate by default (roundValue: false)', () => {
			expect(
				formatValue({
					value: '87.5',
					intlConfig,
					decimalScale: 0
				})
			).toBe('$87');

			expect(
				formatValue({
					value: '1.999',
					intlConfig,
					decimalScale: 2
				})
			).toBe('$1.99');
		});

		it('should round when roundValue is true', () => {
			expect(
				formatValue({
					value: '87.5',
					intlConfig,
					decimalScale: 0,
					roundValue: true
				})
			).toBe('$88');

			expect(
				formatValue({
					value: '1.999',
					intlConfig,
					decimalScale: 2,
					roundValue: true
				})
			).toBe('$2.00');
		});

		it('should handle floating-point precision issues when roundValue is true', () => {
			const sum = 500.75 + 300.5 - 200.25 - 150.33; // = 450.66999999999996

			expect(
				formatValue({
					value: String(sum),
					intlConfig,
					decimalScale: 2,
					roundValue: true
				})
			).toBe('$450.67');
		});

		it('should round 1.255 to 1.26 with decimalScale=2 when roundValue is true', () => {
			expect(
				formatValue({
					value: '1.255',
					intlConfig,
					decimalScale: 2,
					roundValue: true
				})
			).toBe('$1.26');
		});
	});

	it('should prefix decimal values correctly with zero', () => {
		expect(
			formatValue({
				decimalSeparator: '.',
				groupSeparator: ',',
				decimalScale: 2,
				prefix: '$',
				value: '.02'
			})
		).toBe('$0.02');
	});

	describe('negative values', () => {
		it('should handle negative values', () => {
			expect(
				formatValue({
					value: '-1234',
					groupSeparator: ',',
					decimalSeparator: '.',
					prefix: '£'
				})
			).toBe('-£1,234');
		});

		it('should return negative sign if only negative sign', () => {
			expect(
				formatValue({
					value: '-',
					prefix: '£'
				})
			).toBe('-');
		});
	});

	it('should handle negative value and "-" as groupSeparator', () => {
		expect(
			formatValue({
				value: '-1234',
				groupSeparator: '-',
				prefix: '£'
			})
		).toBe('-£1-234');
	});

	it('should handle negative value and "-" as decimalSeparator', () => {
		expect(
			formatValue({
				value: '-12-34',
				decimalSeparator: '-',
				prefix: '£'
			})
		).toBe('-£12-34');
	});

	it('should handle negative value and "-" as groupSeparator', () => {
		expect(
			formatValue({
				value: '-123456',
				groupSeparator: '-',
				prefix: '£'
			})
		).toBe('-£123-456');
	});

	describe('intlConfig', () => {
		it('should handle intlConfig passed in', () => {
			expect(
				formatValue({
					value: '-500000',
					intlConfig: { locale: 'hi-IN', currency: 'INR' }
				})
			).toBe('-₹5,00,000');

			expect(
				formatValue({
					value: '123456.79',
					intlConfig: { locale: 'zh-CN', currency: 'CNY' }
				})
			).toBe('¥123,456.79');

			expect(
				formatValue({
					value: '-123',
					intlConfig: { locale: 'nl-NL', currency: 'EUR' }
				})
			).toBe('€\xa0-123');

			expect(
				formatValue({
					value: '-123',
					intlConfig: { locale: 'nl-NL', currency: 'EUR' },
					prefix: '€'
				})
			).toBe('€\xa0-123');
		});

		it('should able to omit intlConfig.currency', () => {
			expect(
				formatValue({
					value: '-500000',
					intlConfig: { locale: 'hi-IN' }
				})
			).toBe('-5,00,000');

			expect(
				formatValue({
					value: '123456.79',
					intlConfig: { locale: 'zh-CN' }
				})
			).toBe('123,456.79');
		});

		it('should handle suffix', () => {
			expect(
				formatValue({
					value: '1',
					decimalSeparator: ',',
					intlConfig: { locale: 'de-DE', currency: 'EUR' }
				})
			).toBe(`1\xa0€`);
		});

		it('should handle suffix ending with decimal separator', () => {
			expect(
				formatValue({
					value: '1,',
					decimalSeparator: ',',
					intlConfig: { locale: 'de-DE', currency: 'EUR' }
				})
			).toBe(`1,\xa0€`);
		});

		it('should handle suffix ending with decimal separator and decimals', () => {
			expect(
				formatValue({
					value: '123,00',
					decimalSeparator: ',',
					intlConfig: { locale: 'de-DE', currency: 'EUR' }
				})
			).toBe(`123,00\xa0€`);

			expect(
				formatValue({
					value: '123,98',
					decimalSeparator: ',',
					intlConfig: { locale: 'de-DE', currency: 'EUR' }
				})
			).toBe(`123,98\xa0€`);
		});

		it('should override locale if prefix passed in', () => {
			expect(
				formatValue({
					value: '345',
					intlConfig: { locale: 'en-US', currency: 'USD' },
					prefix: '₹'
				})
			).toBe('₹345');

			expect(
				formatValue({
					value: '123',
					intlConfig: { locale: 'en-US', currency: 'USD' },
					prefix: '$'
				})
			).toBe('$123');

			expect(
				formatValue({
					value: '-123',
					intlConfig: { locale: 'en-US', currency: 'USD' },
					prefix: '$'
				})
			).toBe('-$123');
		});

		it('should override locale if groupSeparator passed in', () => {
			expect(
				formatValue({
					value: '-123456',
					intlConfig: { locale: 'hi-IN', currency: 'INR' },
					groupSeparator: '-'
				})
			).toBe('-₹1-23-456');
		});

		it('should override locale if decimalSeparator passed in', () => {
			expect(
				formatValue({
					value: '654321-00',
					intlConfig: { locale: 'zh-CN', currency: 'CNY' },
					decimalSeparator: '-'
				})
			).toBe('¥654,321-00');
		});

		it('should override locale if disableGroupSeparators passed in', () => {
			expect(
				formatValue({
					value: '987654321',
					intlConfig: { locale: 'zh-CN', currency: 'CNY' },
					decimalSeparator: '.',
					groupSeparator: ',',
					disableGroupSeparators: true
				})
			).toBe('¥987654321');
		});
	});

	describe('custom suffix', () => {
		it('should handle custom suffix', () => {
			expect(
				formatValue({
					value: '123',
					suffix: '$'
				})
			).toBe(`123$`);

			expect(
				formatValue({
					value: '0',
					suffix: ' %'
				})
			).toBe(`0 %`);
		});

		it('should handle custom suffix with negative', () => {
			expect(
				formatValue({
					value: '-123.99',
					suffix: '$'
				})
			).toBe(`-123.99$`);
		});

		it('should handle custom suffix with decimalScale', () => {
			expect(
				formatValue({
					value: '123',
					decimalSeparator: '.',
					decimalScale: 3,
					suffix: '$'
				})
			).toBe(`123.000$`);

			expect(
				formatValue({
					value: '123.456',
					decimalSeparator: '.',
					decimalScale: 2,
					suffix: '$'
				})
			).toBe(`123.45$`);
		});

		it('should handle custom suffix ending with decimal separator', () => {
			expect(
				formatValue({
					value: '123.',
					decimalSeparator: '.',
					suffix: '$'
				})
			).toBe(`123.$`);
		});

		it('should handle custom suffix ending with decimal separator and decimals', () => {
			expect(
				formatValue({
					value: '123.45',
					decimalSeparator: '.',
					suffix: '$'
				})
			).toBe(`123.45$`);

			expect(
				formatValue({
					value: '123.0',
					decimalSeparator: '.',
					suffix: '$'
				})
			).toBe(`123.0$`);
		});

		it('should override intl config suffix', () => {
			expect(
				formatValue({
					value: '123.98',
					decimalSeparator: '.',
					suffix: '$',
					intlConfig: { locale: 'de-DE', currency: 'EUR' }
				})
			).toBe(`123.98$`);

			expect(
				formatValue({
					value: '-123.98',
					decimalSeparator: '.',
					suffix: '$',
					intlConfig: { locale: 'de-DE', currency: 'EUR' }
				})
			).toBe(`-123.98$`);
		});

		it('should handle custom suffix and prefix', () => {
			expect(
				formatValue({
					value: '123.98',
					decimalSeparator: '.',
					suffix: '$',
					prefix: '£'
				})
			).toBe(`£123.98$`);
		});

		it('should handle custom suffix and prefix with intl config', () => {
			expect(
				formatValue({
					value: '123.98',
					decimalSeparator: '.',
					suffix: '$',
					prefix: '£',
					intlConfig: { locale: 'de-DE', currency: 'EUR' }
				})
			).toBe(`£123.98$`);
		});

		it('should add decimals if intlConfig has no currency provided, decimalScale defined and the input value is X.00', () => {
			expect(
				formatValue({
					value: '123.00',
					intlConfig: { locale: 'en-US' },
					decimalScale: 2
				})
			).toBe(`123.00`);
		});

		it('should add decimals if intlConfig has no currency provided, decimalScale defined and the input value is X.00 (de-DE)', () => {
			expect(
				formatValue({
					value: '123.00',
					intlConfig: { locale: 'de-DE' },
					decimalScale: 2
				})
			).toBe(`123,00`);
		});
	});
});
