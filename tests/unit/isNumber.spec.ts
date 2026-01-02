import { describe, it, expect } from 'vitest';
import { isNumber } from '$lib/utils/isNumber';

describe('isNumber', () => {
	it('should return true for strings containing digits', () => {
		expect(isNumber('1')).toBe(true);
		expect(isNumber('123')).toBe(true);
		expect(isNumber('1.23')).toBe(true);
		expect(isNumber('$100')).toBe(true);
		expect(isNumber('abc123')).toBe(true);
	});

	it('should return false for strings without digits', () => {
		expect(isNumber('')).toBe(false);
		expect(isNumber('abc')).toBe(false);
		expect(isNumber('$')).toBe(false);
		expect(isNumber('.')).toBe(false);
	});
});
