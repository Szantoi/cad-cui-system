import type { CadAnyProps } from './cad-types.js';
/** React-free value guards shared by runtime, workspace, and preset modules. */
export declare const toTrimmedString: (value: unknown) => string;
/**
 * Intentionally broad record guard. Objects with a custom prototype remain
 * valid; callers that require JSON-shaped input should apply a stricter guard.
 */
export declare const isRecord: (value: unknown) => value is CadAnyProps;
