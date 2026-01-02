import { describe, it, expect } from 'vitest';
import { addSeparators } from '$lib/utils/addSeparators';

describe('addSeparators', () => {
	it('should add default comma separator', () => {
		expect(addSeparators('1000')).toBe('1,000');
		expect(addSeparators('1000000')).toBe('1,000,000');
		expect(addSeparators('1000000000')).toBe('1,000,000,000');
	});

	it('should add custom separator', () => {
		expect(addSeparators('1000', '.')).toBe('1.000');
		expect(addSeparators('1000000', ' ')).toBe('1 000 000');
	});

	it('should not add separator for values under 1000', () => {
		expect(addSeparators('100')).toBe('100');
		expect(addSeparators('99')).toBe('99');
		expect(addSeparators('1')).toBe('1');
	});

	it('should handle empty string', () => {
		expect(addSeparators('')).toBe('');
	});
});
