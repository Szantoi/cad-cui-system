import type { CadAnyProps } from './cad-types';
import { useCallback, useState } from 'react';

export const cx = (...values: unknown[]): string => values.filter(Boolean).join(' ');

export const asArray = <T = any>(value: readonly T[] | unknown): T[] => Array.isArray(value) ? [...value] : [];

export const itemLabel = (item: unknown): string => {
  const value = item as CadAnyProps;
  if (typeof item === 'string' || typeof item === 'number') return String(item);
  return String(value?.label ?? value?.name ?? value?.id ?? '');
};

/**
 * Keeps a small UI primitive usable in both controlled and standalone forms.
 * Callback arguments after the new value are forwarded untouched.
 */
export function useControllableState(controlledValue: any, defaultValue: any, onChange?: (value: any, ...args: any[]) => void): [any, (nextValue: any, ...args: any[]) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback((nextValue, ...args) => {
    const resolvedValue = typeof nextValue === 'function' ? nextValue(value) : nextValue;
    if (!isControlled) setUncontrolledValue(resolvedValue);
    onChange?.(resolvedValue, ...args);
  }, [isControlled, onChange, value]);

  return [value, setValue];
}

export const clamp = (value: number, minimum?: number, maximum?: number): number => {
  if (!Number.isFinite(value)) return value;
  if (Number.isFinite(minimum) && value < minimum) return minimum;
  if (Number.isFinite(maximum) && value > maximum) return maximum;
  return value;
};
