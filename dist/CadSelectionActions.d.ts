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
/**
 * Normalizes host input without retaining engine object references. The result
 * is safe to pass to resolver functions and command handlers, but remains
 * transient state rather than a persisted CUI preference.
 */
export declare function normalizeCadSelection(candidate?: unknown): CadSelectionSnapshot;
/** Creates a serializable copy of a declarative selection rule. */
export declare function normalizeCadSelectionRule(candidate: unknown): CadSelectionRule | undefined;
/**
 * Tests a selection snapshot against a command rule. It returns a stable
 * reason code so a host can choose whether an unavailable action is hidden or
 * rendered disabled with an explanatory tooltip.
 */
export declare function matchesCadSelection(rule: CadSelectionRule | undefined, candidate?: unknown): CadSelectionMatchResult;
