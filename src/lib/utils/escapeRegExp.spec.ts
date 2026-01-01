import { describe, it, expect } from 'vitest';
import { escapeRegExp } from './escapeRegExp.js';

describe('escapeRegExp', () => {
	it('should escape special regex characters', () => {
		expect(escapeRegExp('.')).toBe('\\.');
		expect(escapeRegExp('$')).toBe('\\$');
		expect(escapeRegExp('*')).toBe('\\*');
		expect(escapeRegExp('+')).toBe('\\+');
		expect(escapeRegExp('?')).toBe('\\?');
		expect(escapeRegExp('(')).toBe('\\(');
		expect(escapeRegExp(')')).toBe('\\)');
		expect(escapeRegExp('[')).toBe('\\[');
		expect(escapeRegExp(']')).toBe('\\]');
		expect(escapeRegExp('{')).toBe('\\{');
		expect(escapeRegExp('}')).toBe('\\}');
		expect(escapeRegExp('|')).toBe('\\|');
		expect(escapeRegExp('^')).toBe('\\^');
		expect(escapeRegExp('\\')).toBe('\\\\');
		expect(escapeRegExp('-')).toBe('\\-');
		expect(escapeRegExp('/')).toBe('\\/');
	});

	it('should not escape normal characters', () => {
		expect(escapeRegExp('abc')).toBe('abc');
		expect(escapeRegExp('123')).toBe('123');
	});

	it('should escape mixed strings', () => {
		expect(escapeRegExp('$100.00')).toBe('\\$100\\.00');
		expect(escapeRegExp('(test)')).toBe('\\(test\\)');
	});
});
