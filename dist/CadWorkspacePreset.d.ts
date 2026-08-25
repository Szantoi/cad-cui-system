import type { CadAnyProps } from './cad-types.js';
export declare const CAD_WORKSPACE_PRESET_SCHEMA = "cad-cui-workspace-preset";
export declare const CAD_WORKSPACE_PRESET_VERSION = 1;
export declare const CAD_WORKSPACE_PRESET_ERROR_CODES: Readonly<{
    INVALID_INPUT: "invalid-input";
    INVALID_JSON: "invalid-json";
    INVALID_PRESET: "invalid-preset";
    UNSUPPORTED_SCHEMA: "unsupported-schema";
    UNSUPPORTED_VERSION: "unsupported-version";
    INVALID_FIELD: "invalid-field";
    UNSAFE_KEY: "unsafe-key";
    NORMALIZATION_FAILED: "normalization-failed";
}>;
/**
 * Creates a canonical v1 UI snapshot. The input may use `panelPreferences`,
 * `preferences`, `ui`, or `state` aliases; output always uses `panels` and
 * `settings`. Pass `normalizePanelPreferences` and `panels` to apply a host's
 * declarative panel rules before saving.
 */
export declare function createCadWorkspacePresetSnapshot(value?: {}, options?: {}): CadAnyProps;
/** Alias for hosts that prefer a shorter factory name. */
export declare const createCadWorkspacePreset: typeof createCadWorkspacePresetSnapshot;
/**
 * Normalizes an in-memory preset or snapshot to the current schema version.
 * Use `validateCadWorkspacePreset` or `importCadWorkspacePreset` for strict
 * validation of untrusted data.
 */
export declare function normalizeCadWorkspacePreset(value?: {}, options?: {}): CadAnyProps;
/**
 * Validates a parsed preset object and returns a normalized payload on success.
 * It does not mutate input or read/write any browser storage.
 */
export declare function validateCadWorkspacePreset(value: any, options?: {}): {
    ok: boolean;
    preset: any;
    errors: any[];
} | {
    ok: boolean;
    preset: CadAnyProps;
    errors: any[];
};
/**
 * Serializes a current UI snapshot as pretty, portable JSON. The result is a
 * discriminated object so hosts can surface export errors without try/catch.
 */
export declare function exportCadWorkspacePreset(value?: {}, options?: {}): {
    json: any;
    ok: boolean;
    preset: any;
    errors: any[];
} | {
    ok: boolean;
    preset: any;
    json: string;
    errors: any[];
};
/**
 * Parses and validates a portable preset JSON string. Parsed objects are also
 * accepted for hosts that already read a file with their own transport layer.
 */
export declare function importCadWorkspacePreset(value: any, options?: {}): {
    ok: boolean;
    preset: any;
    errors: any[];
};
