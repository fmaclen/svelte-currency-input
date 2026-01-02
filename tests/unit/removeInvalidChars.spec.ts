import { describe, it, expect } from 'vitest';
import { removeInvalidChars } from '$lib/utils/removeInvalidChars';

describe('removeInvalidChars', () => {
	it('should remove invalid characters', () => {
		expect(removeInvalidChars('$1,000.00', [',', '.'])).toBe('1,000.00');
		expect(removeInvalidChars('£1,000.00', [',', '.'])).toBe('1,000.00');
	});

	it('should keep digits and valid chars', () => {
		expect(removeInvalidChars('1,000.00', [',', '.'])).toBe('1,000.00');
	});

	it('should handle abbreviations', () => {
		expect(removeInvalidChars('1k', ['k', 'm', 'b'])).toBe('1k');
		expect(removeInvalidChars('1.5m', ['.', 'k', 'm', 'b'])).toBe('1.5m');
	});

	it('should remove all non-digit chars when no valid chars specified', () => {
		expect(removeInvalidChars('$1,000', [])).toBe('1000');
	});
});
