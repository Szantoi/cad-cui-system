import type { CadAnyProps } from './cad-types.js';
import React from 'react';
export declare const CAD_WORKSPACE_PANEL_PLACEMENTS: Readonly<{
    DOCK: "dock";
    FLOAT: "float";
}>;
/** Physical workspace zones a docked panel may occupy. */
export declare const CAD_WORKSPACE_PANEL_DOCK_ZONES: Readonly<{
    LEFT: "left";
    RIGHT: "right";
    BOTTOM: "bottom";
}>;
export declare const CAD_WORKSPACE_PANEL_ACTIONS: Readonly<{
    OPEN: "open";
    CLOSE: "close";
    TOGGLE: "toggle";
    DOCK: "dock";
    FLOAT: "float";
    SET_DOCK_ZONE: "dock-zone";
    RESET: "reset";
    RESET_ALL: "reset-all";
    PATCH: "patch";
}>;
/** Accepts common dock/floating aliases while keeping persisted state compact. */
export declare function normalizeCadWorkspacePanelPlacement(value: unknown, fallback?: any): any;
/** Accepts common physical-zone aliases while keeping persisted state compact. */
export declare function normalizeCadWorkspacePanelDockZone(value: unknown, fallback?: any): any;
/**
 * Normalizes declarative panel records without coupling them to a docking
 * library. The host may include any additional metadata (React icons,
 * permissions, analytics IDs, renderer references) and it will pass through.
 */
export declare function normalizeCadWorkspacePanels(panels?: readonly any[]): CadAnyProps[];
/**
 * Returns a compact, JSON-safe preference map for the supplied declarations.
 * Unknown IDs are deliberately omitted here; `updateCadWorkspacePanelPreference`
 * and `resetCadWorkspacePanelPreferences` preserve them when writing state.
 */
export declare function normalizeCadWorkspacePanelPreferences(panels?: readonly any[], value?: CadAnyProps): CadAnyProps;
export declare function getCadWorkspacePanelPreference(panels?: readonly any[], value?: CadAnyProps, panelId?: any): CadAnyProps | undefined;
/**
 * Groups declared, visible docked panels by their physical workspace edge.
 * This is intentionally a pure adapter: the host still chooses whether each
 * resulting item becomes a tab, a stacked panel, or a docking-library view.
 * Panels without a declared `dockZone` are omitted rather than guessed.
 */
export declare function groupCadWorkspacePanelsByDockZone(panels?: readonly any[], value?: CadAnyProps): CadAnyProps;
/**
 * Applies one intent to a host-owned preference map. It never mutates input,
 * never opens a dock, and preserves unknown panel records for feature flags or
 * profiles that are currently inactive.
 */
export declare function updateCadWorkspacePanelPreference(panels?: readonly any[], value?: CadAnyProps, panelId?: any, action?: any): CadAnyProps;
/** Resets all declared panels while retaining unknown records and metadata. */
export declare function resetCadWorkspacePanelPreferences(panels?: readonly any[], value?: CadAnyProps): CadAnyProps;
/**
 * Creates a stable, scope-aware key for host persistence. It intentionally
 * does not read or write localStorage, so public/admin, project, user and
 * server storage policies remain entirely host-owned.
 */
export declare function createCadWorkspacePanelPreferencesKey(namespaceOrOptions?: CadAnyProps | string, legacyScope?: string): string;
/**
 * Controlled/uncontrolled state adapter for workspace-panel preferences.
 * Use it when a host wants the same data contract without rendering the menu.
 */
export declare function useCadWorkspacePanelPreferences({ panels, value, defaultValue, onChange }?: CadAnyProps): {
    panels: CadAnyProps[];
    value: CadAnyProps;
    preferences: CadAnyProps;
    dispatch: (panelId: any, action: any, event: any) => CadAnyProps;
    reset: (event: any) => CadAnyProps;
};
/**
 * A compact CAD workspace-customization flyout. It only edits serializable
 * intent ({ open, placement, dockZone? }); hosts decide whether that means a
 * Dockview tab, a floating HTML panel, a native window, or a renderer overlay.
 */
export declare function CadWorkspacePanelManager({ panels, value, defaultValue, onChange, onPanelChange, onPanelAction, onPanelOpen, onPanelClose, onPanelDock, onPanelDockZone, onPanelFloat, onPanelReset, onResetAll, menuOpen, defaultMenuOpen, onMenuOpenChange, title, description, trigger, renderTrigger, triggerLabel, triggerIcon, scope, placement, emptyLabel, filter, defaultFilter, onFilterChange, filterable, filterLabel, filterPlaceholder, clearFilterLabel, filteredEmptyLabel, resetAllLabel, showResetAll, closeLabel, renderPanel, renderPanelIcon, className, contentClassName, ...props }: CadAnyProps): React.JSX.Element;
export declare const CadWorkspacePanelPreferences: typeof CadWorkspacePanelManager;
