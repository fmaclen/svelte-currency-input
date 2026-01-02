import { describe, it, expect } from 'vitest';
import { padTrimValue } from '$lib/utils/padTrimValue';

describe('padTrimValue', () => {
	it('should return value if no decimalScale', () => {
		expect(padTrimValue('100', '.')).toBe('100');
		expect(padTrimValue('100.00', '.')).toBe('100.00');
	});

	it('should return value if no decimalSeparator', () => {
		expect(padTrimValue('100', '', 2)).toBe('100');
		expect(padTrimValue('100', undefined, 2)).toBe('100');
	});

	it('should return empty string if no digits', () => {
		expect(padTrimValue('$', '.', 2)).toBe('');
		expect(padTrimValue('abc', '.', 2)).toBe('');
	});

	it('should pad decimals when needed', () => {
		expect(padTrimValue('100', '.', 2)).toBe('100.00');
		expect(padTrimValue('100.1', '.', 2)).toBe('100.10');
		expect(padTrimValue('100.1', '.', 4)).toBe('100.1000');
	});

	it('should trim decimals when needed', () => {
		expect(padTrimValue('100.1234', '.', 2)).toBe('100.12');
		expect(padTrimValue('100.123456', '.', 4)).toBe('100.1234');
	});

	it('should handle decimalScale of 0', () => {
		expect(padTrimValue('100.99', '.', 0)).toBe('100');
		expect(padTrimValue('100', '.', 0)).toBe('100');
	});

	it('should handle comma decimal separator', () => {
		expect(padTrimValue('100', ',', 2)).toBe('100,00');
		expect(padTrimValue('100,1', ',', 2)).toBe('100,10');
		expect(padTrimValue('100,1234', ',', 2)).toBe('100,12');
	});
});
