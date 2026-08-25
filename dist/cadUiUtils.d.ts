export declare const cx: (...values: unknown[]) => string;
export declare const asArray: <T = any>(value: readonly T[] | unknown) => T[];
export declare const itemLabel: (item: unknown) => string;
/**
 * Keeps a small UI primitive usable in both controlled and standalone forms.
 * Callback arguments after the new value are forwarded untouched.
 */
export declare function useControllableState(controlledValue: any, defaultValue: any, onChange?: (value: any, ...args: any[]) => void): [any, (nextValue: any, ...args: any[]) => void];
export declare const clamp: (value: number, minimum?: number, maximum?: number) => number;
