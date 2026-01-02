import { describe, it, expect } from 'vitest';
import { getLocaleConfig } from '$lib/utils/getLocaleConfig';

describe('getLocaleConfig', () => {
	it('should return locale config even if no intlConfig', () => {
		expect(getLocaleConfig()).toStrictEqual({
			currencySymbol: '',
			decimalSeparator: '.',
			groupSeparator: ',',
			prefix: '',
			suffix: ''
		});
	});

	it('should return locale config from intlConfig', () => {
		expect(getLocaleConfig({ locale: 'ja-JP', currency: 'JPY' })).toStrictEqual({
			currencySymbol: '￥',
			decimalSeparator: '',
			groupSeparator: ',',
			prefix: '￥',
			suffix: ''
		});
	});

	it('should return locale config from intlConfig even without currency', () => {
		const config = getLocaleConfig({ locale: 'fr-FR' });
		expect(config.currencySymbol).toBe('');
		expect(config.decimalSeparator).toBe(',');
		expect(config.prefix).toBe('');
		expect(config.suffix).toBe('');
		expect(config.groupSeparator.trim()).toBe('');
		expect(config.groupSeparator.length).toBeGreaterThan(0);
	});

	it('should handle German locale with EUR', () => {
		const config = getLocaleConfig({ locale: 'de-DE', currency: 'EUR' });
		expect(config.currencySymbol).toBe('€');
		expect(config.decimalSeparator).toBe(',');
		expect(config.suffix).toContain('€');
	});

	it('should handle US locale with USD', () => {
		const config = getLocaleConfig({ locale: 'en-US', currency: 'USD' });
		expect(config.currencySymbol).toBe('$');
		expect(config.prefix).toBe('$');
		expect(config.decimalSeparator).toBe('.');
		expect(config.groupSeparator).toBe(',');
	});
});
