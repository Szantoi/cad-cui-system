import type { CadAnyProps } from './cad-types';
/** React-free value guards shared by runtime, workspace, and preset modules. */
export const toTrimmedString = (value: unknown): string => String(value ?? '').trim();

/**
 * Intentionally broad record guard. Objects with a custom prototype remain
 * valid; callers that require JSON-shaped input should apply a stricter guard.
 */
export const isRecord = (value: unknown): value is CadAnyProps => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
