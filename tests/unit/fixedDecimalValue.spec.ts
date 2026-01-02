import { describe, it, expect } from 'vitest';
import { fixedDecimalValue } from '$lib/utils/fixedDecimalValue';

describe('fixedDecimalValue', () => {
	it('should return value if no fixedDecimalLength', () => {
		expect(fixedDecimalValue('123', '.')).toBe('123');
		expect(fixedDecimalValue('12345', '.')).toBe('12345');
	});

	it('should return value if length is 1 or less', () => {
		expect(fixedDecimalValue('1', '.', 2)).toBe('1');
		expect(fixedDecimalValue('', '.', 2)).toBe('');
	});

	it('should add decimal at correct position', () => {
		expect(fixedDecimalValue('123', '.', 2)).toBe('1.23');
		expect(fixedDecimalValue('1234', '.', 2)).toBe('12.34');
		expect(fixedDecimalValue('12345', '.', 2)).toBe('123.45');
	});

	it('should handle fixedDecimalLength of 0', () => {
		expect(fixedDecimalValue('1.23', '.', 0)).toBe('123');
	});

	it('should handle value already containing decimal separator', () => {
		expect(fixedDecimalValue('1.23', '.', 2)).toBe('1.23');
		expect(fixedDecimalValue('1.234', '.', 2)).toBe('1.23');
		expect(fixedDecimalValue('1.2', '.', 2)).toBe('1.2');
	});

	it('should handle 3 decimal places', () => {
		expect(fixedDecimalValue('1234', '.', 3)).toBe('1.234');
		expect(fixedDecimalValue('12345', '.', 3)).toBe('12.345');
	});

	it('should handle comma as decimal separator', () => {
		expect(fixedDecimalValue('123', ',', 2)).toBe('1,23');
		expect(fixedDecimalValue('1,23', ',', 2)).toBe('1,23');
	});

	it('should handle short values', () => {
		expect(fixedDecimalValue('12', '.', 2)).toBe('1.2');
	});
});
