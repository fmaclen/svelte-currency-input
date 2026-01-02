import { describe, it, expect } from 'vitest';
import { removeSeparators } from '$lib/utils/removeSeparators';

describe('removeSeparators', () => {
	it('should remove default comma separator', () => {
		expect(removeSeparators('1,000')).toBe('1000');
		expect(removeSeparators('1,000,000')).toBe('1000000');
	});

	it('should remove custom separator', () => {
		expect(removeSeparators('1.000.000', '.')).toBe('1000000');
		expect(removeSeparators('1 000 000', ' ')).toBe('1000000');
	});

	it('should handle strings without separators', () => {
		expect(removeSeparators('1000')).toBe('1000');
		expect(removeSeparators('100')).toBe('100');
	});

	it('should handle empty string', () => {
		expect(removeSeparators('')).toBe('');
	});
});
