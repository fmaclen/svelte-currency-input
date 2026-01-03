import { describe, it, expect } from 'vitest';
import { abbrValue, parseAbbrValue } from '$lib/utils/parseAbbrValue';

describe('abbrValue', () => {
	it('should not convert value under 1000', () => {
		expect(abbrValue(999)).toBe('999');
	});

	it('should convert thousand to k', () => {
		expect(abbrValue(1000)).toBe('1k');
		expect(abbrValue(1500)).toBe('1.5k');
		expect(abbrValue(10000)).toBe('10k');
	});

	it('should work with comma as decimal separator', () => {
		expect(abbrValue(1500, ',')).toBe('1,5k');
	});

	it('should work with decimal places option', () => {
		expect(abbrValue(123456, '.')).toBe('0.123456M');
		expect(abbrValue(123456, '.', 2)).toBe('0.12M');
	});
});

describe('parseAbbrValue', () => {
	it('should return undefined if cannot parse', () => {
		expect(parseAbbrValue('1km')).toBeUndefined();
		expect(parseAbbrValue('2mb')).toBeUndefined();
		expect(parseAbbrValue('3a')).toBeUndefined();
	});

	it('should return undefined if no abbreviation', () => {
		expect(parseAbbrValue('1.23')).toBeUndefined();
		expect(parseAbbrValue('100')).toBeUndefined();
		expect(parseAbbrValue('20000')).toBeUndefined();
	});

	it('should return undefined for only letter', () => {
		expect(parseAbbrValue('k')).toBeUndefined();
		expect(parseAbbrValue('m')).toBeUndefined();
		expect(parseAbbrValue('b')).toBeUndefined();
	});

	it('should return 0 for 0', () => {
		expect(parseAbbrValue('0k')).toBe(0);
		expect(parseAbbrValue('0m')).toBe(0);
		expect(parseAbbrValue('0b')).toBe(0);
	});

	it('should parse k', () => {
		expect(parseAbbrValue('1k')).toBe(1000);
		expect(parseAbbrValue('1.k')).toBe(1000);
		expect(parseAbbrValue('2K')).toBe(2000);
		expect(parseAbbrValue('1.1239999k')).toBe(1123.9999);
		expect(parseAbbrValue('1.5k')).toBe(1500);
		expect(parseAbbrValue('50.12K')).toBe(50120);
		expect(parseAbbrValue('100K')).toBe(100000);
	});

	it('should parse m', () => {
		expect(parseAbbrValue('1m')).toBe(1000000);
		expect(parseAbbrValue('1.m')).toBe(1000000);
		expect(parseAbbrValue('1.5m')).toBe(1500000);
		expect(parseAbbrValue('45.123456m')).toBe(45123456);
		expect(parseAbbrValue('83.5m')).toBe(83500000);
		expect(parseAbbrValue('100M')).toBe(100000000);
	});

	it('should parse b', () => {
		expect(parseAbbrValue('1b')).toBe(1000000000);
		expect(parseAbbrValue('1.b')).toBe(1000000000);
		expect(parseAbbrValue('1.5b')).toBe(1500000000);
		expect(parseAbbrValue('65.5513b')).toBe(65551300000);
		expect(parseAbbrValue('100B')).toBe(100000000000);
	});

	it('should work with comma as decimal separator', () => {
		expect(parseAbbrValue('1,2k', ',')).toBe(1200);
		expect(parseAbbrValue('2,3m', ',')).toBe(2300000);
	});

	it('should handle high precision decimals (e.g. Bitcoin with 8 decimal places)', () => {
		expect(parseAbbrValue('1.12345678k')).toBe(1123.45678);
		expect(parseAbbrValue('0.00000001k')).toBe(0.00001);
	});
});
