import { describe, expect, it } from 'vitest';
import { isRecord, toTrimmedString } from '../src/cadValueUtils';

describe('cad value helpers', () => {
  it('normalizes nullable values into trimmed text without hiding valid scalars', () => {
    expect(toTrimmedString(null)).toBe('');
    expect(toTrimmedString(undefined)).toBe('');
    expect(toTrimmedString('  Model Space  ')).toBe('Model Space');
    expect(toTrimmedString(0)).toBe('0');
    expect(toTrimmedString(false)).toBe('false');
  });

  it('accepts broad object records while rejecting nullable values and arrays', () => {
    expect(isRecord(null)).toBe(false);
    expect(isRecord(undefined)).toBe(false);
    expect(isRecord('layer')).toBe(false);
    expect(isRecord([])).toBe(false);
    expect(isRecord({ id: 'layers' })).toBe(true);
    expect(isRecord(Object.create(null))).toBe(true);
    expect(isRecord(new Map())).toBe(true);
  });
});
