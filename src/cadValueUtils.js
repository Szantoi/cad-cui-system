/** React-free value guards shared by runtime, workspace, and preset modules. */
export const toTrimmedString = value => String(value ?? '').trim();

/**
 * Intentionally broad record guard. Objects with a custom prototype remain
 * valid; callers that require JSON-shaped input should apply a stricter guard.
 */
export const isRecord = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
