import { describe, it, expect } from 'vitest';
import { getSuffix } from '$lib/utils/getSuffix';

describe('getSuffix', () => {
	it('should return undefined for values without suffix', () => {
		expect(getSuffix('1,000', {})).toBeUndefined();
		expect(getSuffix('1000.00', {})).toBeUndefined();
		expect(getSuffix('123', {})).toBeUndefined();
	});

	it('should detect currency suffix', () => {
		expect(getSuffix('100 €', {})).toBe(' €');
		expect(getSuffix('1,000 EUR', {})).toBe(' EUR');
	});

	it('should handle different separators', () => {
		expect(getSuffix('1.000,00 €', { groupSeparator: '.', decimalSeparator: ',' })).toBe(' €');
	});

	it('should return suffix characters after last digit', () => {
		expect(getSuffix('100%', {})).toBe('%');
		expect(getSuffix('100 %', {})).toBe(' %');
	});
});
