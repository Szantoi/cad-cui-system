import { toTrimmedString as text } from './cadValueUtils';

/**
 * A deliberately small, engine-free description of the current selection.
 *
 * The host owns the entities themselves; the CUI only needs stable ids and
 * aggregate capabilities in order to decide which commands make sense. This
 * record is transient runtime input and must not be put into a saved workspace
 * preference or preset.
 */
export interface CadSelectionSnapshot<TMeta = Record<string, never>> {
  readonly ids: readonly string[];
  readonly entityTypes?: readonly string[];
  readonly traits?: readonly string[];
  readonly source?: string;
  readonly meta?: TMeta;
}

/** A count class intentionally avoids serializing a live entity list. */
export type CadSelectionCount = 'none' | 'one' | 'many' | 'any';
export type CadSelectionMatchMode = 'any' | 'all';

/**
 * Declarative availability requirement for a command.
 *
 * `entityTypes` are matched against every selected entity type by default,
 * while `traits` represent aggregate host capabilities such as `editable` or
 * `planar`. For a multi-selection, expose a trait only when it is true for
 * every selected object if the command must operate on all of them.
 */
export interface CadSelectionRule {
  readonly count?: CadSelectionCount;
  readonly entityTypes?: readonly string[];
  readonly typeMatch?: CadSelectionMatchMode;
  readonly traits?: readonly string[];
  readonly traitMatch?: CadSelectionMatchMode;
}

export interface CadSelectionMatchResult {
  readonly matches: boolean;
  readonly reason: string;
  readonly selection: CadSelectionSnapshot;
}

const uniqueTerms = (value: unknown): string[] => [...new Set(
  (Array.isArray(value) ? value : []).map(item => text(item).toLocaleLowerCase('en')).filter(Boolean)
)];

const uniqueIds = (value: unknown): string[] => [...new Set(
  (Array.isArray(value) ? value : []).map(item => text(item)).filter(Boolean)
)];

const copyTerms = (value: unknown): readonly string[] => Object.freeze(uniqueTerms(value));

const countMatches = (count: number, requirement: CadSelectionCount | undefined) => {
  if (!requirement) return true;
  if (requirement === 'none') return count === 0;
  if (requirement === 'one') return count === 1;
  if (requirement === 'many') return count > 1;
  return count > 0;
};

/**
 * Normalizes host input without retaining engine object references. The result
 * is safe to pass to resolver functions and command handlers, but remains
 * transient state rather than a persisted CUI preference.
 */
export function normalizeCadSelection(candidate: unknown = {}): CadSelectionSnapshot {
  const source = candidate && typeof candidate === 'object' ? candidate as CadSelectionSnapshot : {} as CadSelectionSnapshot;
  // Entity ids belong to the host and may be case-sensitive. Only matching
  // vocabulary (types and traits) is canonicalized for rule comparisons.
  const ids = Object.freeze(uniqueIds(source.ids));
  const entityTypes = copyTerms(source.entityTypes);
  const traits = copyTerms(source.traits);
  const normalized: CadSelectionSnapshot = {
    ids,
    entityTypes,
    traits,
    source: text(source.source) || undefined,
    meta: source.meta
  };
  return Object.freeze(normalized);
}

/** Creates a serializable copy of a declarative selection rule. */
export function normalizeCadSelectionRule(candidate: unknown): CadSelectionRule | undefined {
  if (!candidate || typeof candidate !== 'object') return undefined;
  const source = candidate as CadSelectionRule;
  const count = source.count === 'none' || source.count === 'one' || source.count === 'many' || source.count === 'any'
    ? source.count
    : undefined;
  const typeMatch = source.typeMatch === 'any' ? 'any' : source.typeMatch === 'all' ? 'all' : undefined;
  const traitMatch = source.traitMatch === 'any' ? 'any' : source.traitMatch === 'all' ? 'all' : undefined;
  const entityTypes = copyTerms(source.entityTypes);
  const traits = copyTerms(source.traits);
  if (!count && !typeMatch && !traitMatch && !entityTypes.length && !traits.length) return undefined;
  return Object.freeze({
    ...(count ? { count } : {}),
    ...(entityTypes.length ? { entityTypes } : {}),
    ...(typeMatch ? { typeMatch } : {}),
    ...(traits.length ? { traits } : {}),
    ...(traitMatch ? { traitMatch } : {})
  });
}

/**
 * Tests a selection snapshot against a command rule. It returns a stable
 * reason code so a host can choose whether an unavailable action is hidden or
 * rendered disabled with an explanatory tooltip.
 */
export function matchesCadSelection(rule: CadSelectionRule | undefined, candidate: unknown = {}): CadSelectionMatchResult {
  const selection = normalizeCadSelection(candidate);
  const normalizedRule = normalizeCadSelectionRule(rule);
  if (!normalizedRule) return { matches: true, reason: '', selection };

  if (!countMatches(selection.ids.length, normalizedRule.count)) {
    return {
      matches: false,
      reason: selection.ids.length === 0 ? 'SELECTION_REQUIRED' : 'SELECTION_COUNT_MISMATCH',
      selection
    };
  }

  const selectionTypes = new Set(selection.entityTypes || []);
  const allowedTypes = new Set(normalizedRule.entityTypes || []);
  if (allowedTypes.size) {
    const typeMatches = normalizedRule.typeMatch === 'any'
      ? [...selectionTypes].some(type => allowedTypes.has(type))
      : selectionTypes.size > 0 && [...selectionTypes].every(type => allowedTypes.has(type));
    if (!typeMatches) return { matches: false, reason: 'ENTITY_TYPE_MISMATCH', selection };
  }

  const selectionTraits = new Set(selection.traits || []);
  const requiredTraits = normalizedRule.traits || [];
  if (requiredTraits.length) {
    const traitMatches = normalizedRule.traitMatch === 'any'
      ? requiredTraits.some(trait => selectionTraits.has(trait))
      : requiredTraits.every(trait => selectionTraits.has(trait));
    if (!traitMatches) return { matches: false, reason: 'SELECTION_TRAIT_MISMATCH', selection };
  }

  return { matches: true, reason: '', selection };
}
