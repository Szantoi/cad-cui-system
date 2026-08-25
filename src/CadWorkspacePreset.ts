import type { CadAnyProps } from './cad-types';
/**
 * Renderer-agnostic workspace-preset helpers.
 *
 * A preset intentionally contains serializable intent only. It does not know
 * whether a host renders panels with CSS grid, Dockview, a native shell, or a
 * canvas engine. Hosts can pass their existing panel-preference normalizer to
 * make a snapshot conform to their panel declarations.
 */

import { isRecord, toTrimmedString as text } from './cadValueUtils';

export const CAD_WORKSPACE_PRESET_SCHEMA = 'cad-cui-workspace-preset';
export const CAD_WORKSPACE_PRESET_VERSION = 1;

export const CAD_WORKSPACE_PRESET_ERROR_CODES = Object.freeze({
  INVALID_INPUT: 'invalid-input',
  INVALID_JSON: 'invalid-json',
  INVALID_PRESET: 'invalid-preset',
  UNSUPPORTED_SCHEMA: 'unsupported-schema',
  UNSUPPORTED_VERSION: 'unsupported-version',
  INVALID_FIELD: 'invalid-field',
  UNSAFE_KEY: 'unsafe-key',
  NORMALIZATION_FAILED: 'normalization-failed'
});

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const OMIT = Symbol('omit');

const isPlainRecord = value => isRecord(value) && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const isSafeKey = key => !UNSAFE_KEYS.has(key);

const recordFrom = value => {
  if (value instanceof Map) return Object.fromEntries(value.entries());
  return isRecord(value) ? value : {};
};

const presetName = (value, fallback) => text(value).replace(/\s+/g, ' ').slice(0, 80) || fallback;

const presetText = value => text(value).slice(0, 400);

const presetId = value => text(value)
  .toLocaleLowerCase()
  .replace(/[^a-z0-9._-]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80);

const finiteInteger = (value, fallback) => Number.isSafeInteger(value) && value > 0 ? value : fallback;

const optionsFrom = options => {
  const source = recordFrom(options);
  const schema = presetText(source.schema) || CAD_WORKSPACE_PRESET_SCHEMA;
  const version = finiteInteger(source.version, CAD_WORKSPACE_PRESET_VERSION);
  const defaultName = presetName(source.defaultName, 'Workspace');
  const panelNormalizer = typeof source.normalizePanelPreferences === 'function'
    ? source.normalizePanelPreferences
    : typeof source.panelPreferenceNormalizer === 'function'
      ? source.panelPreferenceNormalizer
      : undefined;
  return {
    schema,
    version,
    defaultName,
    panels: source.panels ?? source.panelDefinitions ?? [],
    panelNormalizer
  };
};

const normalizedSavedAt = value => {
  const candidate = text(value);
  if (!candidate || Number.isNaN(Date.parse(candidate))) return '';
  return new Date(candidate).toISOString();
};

/**
 * Produces a deep, JSON-safe value without calling `toJSON` or retaining
 * functions, class instances, symbols, cycles, or prototype-pollution keys.
 * Object keys are sorted so exported presets are stable and easy to diff.
 */
function jsonSafeValue(value, ancestors = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : OMIT;
  if (typeof value !== 'object') return OMIT;
  if (ancestors.has(value)) return OMIT;

  if (Array.isArray(value)) {
    const nextAncestors = new Set(ancestors);
    nextAncestors.add(value);
    return value.map(item => {
      const normalized = jsonSafeValue(item, nextAncestors);
      return normalized === OMIT ? null : normalized;
    });
  }

  if (!isPlainRecord(value)) return OMIT;
  const nextAncestors = new Set(ancestors);
  nextAncestors.add(value);
  return Object.keys(value).sort().reduce((result, key) => {
    if (!isSafeKey(key)) return result;
    const normalized = jsonSafeValue(value[key], nextAncestors);
    if (normalized !== OMIT) result[key] = normalized;
    return result;
  }, {});
}

const jsonSafeRecord = value => {
  const normalized = jsonSafeValue(recordFrom(value));
  return isPlainRecord(normalized) ? normalized : {};
};

const panelSourceFrom = source => source.panels ?? source.panelPreferences ?? source.preferences ?? {};
const settingsSourceFrom = source => source.settings ?? source.ui ?? source.state ?? {};

const normalizePanels = (sourcePanels, options) => {
  if (!options.panelNormalizer) return jsonSafeRecord(sourcePanels);
  try {
    // Signature mirrors normalizeCadWorkspacePanelPreferences(panels, value),
    // so hosts can pass that helper directly without a renderer adapter.
    return jsonSafeRecord(options.panelNormalizer(options.panels, sourcePanels));
  } catch {
    return jsonSafeRecord(sourcePanels);
  }
};

const presetFrom = (value, options) => {
  const source = recordFrom(value);
  const id = presetId(source.id ?? source.presetId);
  const description = presetText(source.description);
  const savedAt = normalizedSavedAt(source.savedAt ?? source.updatedAt);
  const preset: CadAnyProps = {
    schema: options.schema,
    version: options.version,
    name: presetName(source.name ?? source.label, options.defaultName),
    panels: normalizePanels(panelSourceFrom(source), options),
    settings: jsonSafeRecord(settingsSourceFrom(source)),
    metadata: jsonSafeRecord(source.metadata)
  };
  if (id) preset.id = id;
  if (description) preset.description = description;
  if (savedAt) preset.savedAt = savedAt;
  return preset;
};

const error = (code: any, message: string, path?: string) => ({ code, message, ...(path ? { path } : {}) });

const unsafeKeyErrors = (value, path = '$', ancestors = new Set(), errors = []) => {
  if (value === null || typeof value !== 'object' || ancestors.has(value)) return errors;
  const nextAncestors = new Set(ancestors);
  nextAncestors.add(value);
  if (Array.isArray(value)) {
    value.forEach((item, index) => unsafeKeyErrors(item, `${path}[${index}]`, nextAncestors, errors));
    return errors;
  }
  Object.keys(value).forEach(key => {
    const keyPath = `${path}.${key}`;
    if (!isSafeKey(key)) {
      errors.push(error(
        CAD_WORKSPACE_PRESET_ERROR_CODES.UNSAFE_KEY,
        `Preset key "${key}" is not allowed.`,
        keyPath
      ));
      return;
    }
    unsafeKeyErrors(value[key], keyPath, nextAncestors, errors);
  });
  return errors;
};

const recordFieldErrors = source => ['panels', 'settings', 'metadata'].reduce((errors, field) => {
  if (source[field] !== undefined && !isRecord(source[field])) {
    errors.push(error(
      CAD_WORKSPACE_PRESET_ERROR_CODES.INVALID_FIELD,
      `Preset field "${field}" must be an object.`,
      `$.${field}`
    ));
  }
  return errors;
}, []);

/**
 * Creates a canonical v1 UI snapshot. The input may use `panelPreferences`,
 * `preferences`, `ui`, or `state` aliases; output always uses `panels` and
 * `settings`. Pass `normalizePanelPreferences` and `panels` to apply a host's
 * declarative panel rules before saving.
 */
export function createCadWorkspacePresetSnapshot(value = {}, options = {}) {
  return presetFrom(value, optionsFrom(options));
}

/** Alias for hosts that prefer a shorter factory name. */
export const createCadWorkspacePreset = createCadWorkspacePresetSnapshot;

/**
 * Normalizes an in-memory preset or snapshot to the current schema version.
 * Use `validateCadWorkspacePreset` or `importCadWorkspacePreset` for strict
 * validation of untrusted data.
 */
export function normalizeCadWorkspacePreset(value = {}, options = {}) {
  return createCadWorkspacePresetSnapshot(value, options);
}

/**
 * Validates a parsed preset object and returns a normalized payload on success.
 * It does not mutate input or read/write any browser storage.
 */
export function validateCadWorkspacePreset(value, options = {}) {
  const config = optionsFrom(options);
  if (!isRecord(value)) {
    return {
      ok: false,
      preset: undefined,
      errors: [error(CAD_WORKSPACE_PRESET_ERROR_CODES.INVALID_PRESET, 'A workspace preset must be a JSON object.', '$')]
    };
  }

  const errors = [];
  if (value.schema !== config.schema) {
    errors.push(error(
      CAD_WORKSPACE_PRESET_ERROR_CODES.UNSUPPORTED_SCHEMA,
      `Expected preset schema "${config.schema}".`,
      '$.schema'
    ));
  }
  if (!Number.isSafeInteger(value.version) || value.version !== config.version) {
    errors.push(error(
      CAD_WORKSPACE_PRESET_ERROR_CODES.UNSUPPORTED_VERSION,
      `Expected preset version ${config.version}.`,
      '$.version'
    ));
  }
  if (value.name !== undefined && typeof value.name !== 'string') {
    errors.push(error(CAD_WORKSPACE_PRESET_ERROR_CODES.INVALID_FIELD, 'Preset field "name" must be a string.', '$.name'));
  }
  if (value.id !== undefined && typeof value.id !== 'string') {
    errors.push(error(CAD_WORKSPACE_PRESET_ERROR_CODES.INVALID_FIELD, 'Preset field "id" must be a string.', '$.id'));
  }
  if (value.description !== undefined && typeof value.description !== 'string') {
    errors.push(error(CAD_WORKSPACE_PRESET_ERROR_CODES.INVALID_FIELD, 'Preset field "description" must be a string.', '$.description'));
  }
  if (value.savedAt !== undefined && (!normalizedSavedAt(value.savedAt) || typeof value.savedAt !== 'string')) {
    errors.push(error(CAD_WORKSPACE_PRESET_ERROR_CODES.INVALID_FIELD, 'Preset field "savedAt" must be a valid ISO date string.', '$.savedAt'));
  }
  errors.push(...recordFieldErrors(value), ...unsafeKeyErrors(value));

  if (errors.length) return { ok: false, preset: undefined, errors };

  try {
    return { ok: true, preset: presetFrom(value, config), errors: [] };
  } catch {
    return {
      ok: false,
      preset: undefined,
      errors: [error(CAD_WORKSPACE_PRESET_ERROR_CODES.NORMALIZATION_FAILED, 'The workspace preset could not be normalized.')]
    };
  }
}

/**
 * Serializes a current UI snapshot as pretty, portable JSON. The result is a
 * discriminated object so hosts can surface export errors without try/catch.
 */
export function exportCadWorkspacePreset(value = {}, options = {}) {
  const config = optionsFrom(options);
  const preset = presetFrom(value, config);
  const validation = validateCadWorkspacePreset(preset, options);
  if (!validation.ok) return { ...validation, json: undefined };
  const source = recordFrom(options);
  const space = source.pretty === false ? 0 : Math.max(0, Math.min(10, Number.isFinite(source.space) ? Math.floor(source.space) : 2));
  try {
    return { ok: true, preset: validation.preset, json: JSON.stringify(validation.preset, null, space), errors: [] };
  } catch {
    return {
      ok: false,
      preset: undefined,
      json: undefined,
      errors: [error(CAD_WORKSPACE_PRESET_ERROR_CODES.NORMALIZATION_FAILED, 'The workspace preset could not be serialized.')]
    };
  }
}

/**
 * Parses and validates a portable preset JSON string. Parsed objects are also
 * accepted for hosts that already read a file with their own transport layer.
 */
export function importCadWorkspacePreset(value, options = {}) {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value.replace(/^\uFEFF/, ''));
      return validateCadWorkspacePreset(parsed, options);
    } catch {
      return {
        ok: false,
        preset: undefined,
        errors: [error(CAD_WORKSPACE_PRESET_ERROR_CODES.INVALID_JSON, 'The workspace preset is not valid JSON.')]
      };
    }
  }
  if (isRecord(value)) return validateCadWorkspacePreset(value, options);
  return {
    ok: false,
    preset: undefined,
    errors: [error(CAD_WORKSPACE_PRESET_ERROR_CODES.INVALID_INPUT, 'Provide a preset JSON string or parsed object.')]
  };
}
