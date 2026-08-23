import { useCallback, useState } from 'react';

export const cx = (...values) => values.filter(Boolean).join(' ');

export const asArray = value => Array.isArray(value) ? value : [];

export const itemLabel = item => {
  if (typeof item === 'string' || typeof item === 'number') return String(item);
  return String(item?.label ?? item?.name ?? item?.id ?? '');
};

/**
 * Keeps a small UI primitive usable in both controlled and standalone forms.
 * Callback arguments after the new value are forwarded untouched.
 */
export function useControllableState(controlledValue, defaultValue, onChange) {
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

export const clamp = (value, minimum, maximum) => {
  if (!Number.isFinite(value)) return value;
  if (Number.isFinite(minimum) && value < minimum) return minimum;
  if (Number.isFinite(maximum) && value > maximum) return maximum;
  return value;
};
