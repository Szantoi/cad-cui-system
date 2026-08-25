import type { CadAnyProps } from './cad-types.js';
import React from 'react';
export declare const CAD_CUI_RUNTIME_VERSION = 1;
/**
 * Declarative, serializable CUI registry. Keep executable callbacks out of
 * this object: runtime adapters receive an `intent` when a command is run.
 * The same schema can therefore drive a ribbon, quick access bar, context
 * menus and a command palette without coupling to a window manager.
 */
export declare function defineCadCuiSystem(definition?: CadAnyProps): any;
export declare const DEFAULT_CAD_CUI_SYSTEM: any;
/**
 * Resolves host-owned command state without putting executable or transient
 * data into the serializable registry. It is used by every command surface so
 * visibility, disabled state, selected/pressed treatment and badges never
 * drift apart between the ribbon, palette and quick access bar.
 */
export declare function resolveCadCuiCommand(command: any, { state, capabilities, commandStates, placement }?: CadAnyProps): any;
export declare const resolveCadCuiCommandState: typeof resolveCadCuiCommand;
export declare function sanitizeCadCuiState(system: any, candidate: any): CadAnyProps;
export declare function loadCadCuiState(system: any, storage?: Pick<Storage, 'getItem'> | null): CadAnyProps;
export declare function saveCadCuiState(system: any, state: any, storage?: Pick<Storage, 'setItem'> | null): boolean;
export declare function selectCadCuiCommands(system: any, state: any, { surface, tabId, menuId, groupId, capabilities, commandStates }?: CadAnyProps): any;
/**
 * Returns command groups with their resolved commands. Groups are opt-in:
 * registries with no `groups` keep the legacy flat ribbon output untouched.
 */
export declare function selectCadCuiCommandGroups(system: any, state: any, { surface, tabId, menuId, capabilities, commandStates }?: CadAnyProps): any;
/**
 * Copy/paste integration:
 *
 * <CadCuiProvider registry={registry} capabilities={{ admin: isAdmin }}
 *   commandStates={{ 'draw.line': { active: true, badge: 2 } }} handlers={{
 *   'panel.open': ({ intent }) => openWorkspacePanel(intent.panelId),
 *   'panel.place': ({ intent }) => placeWorkspacePanel(intent.panelId, intent.placement),
 *   'workspace.reset-layout': () => resetWorkspaceLayout(),
 *   'workspace.toggle-fullscreen': () => toggleWorkspaceFullscreen()
 * }}>
 *   <CadCuiRibbon iconMap={icons} />
 *   <CadCuiQuickAccess iconMap={icons} />
 *   <CadCuiContextMenu menuId="node" iconMap={icons} />
 *   <CadCuiCommandPalette iconMap={icons} />
 *   <CadCuiCustomizer />
 * </CadCuiProvider>
 *
 * The provider owns only serializable UI preferences. Domain data, window
 * manager handles and authorization remain in the application adapter.
 */
export declare function CadCuiProvider({ registry, capabilities, commandStates, handlers, onCommand, children }: CadAnyProps): React.JSX.Element;
export declare function useCadCui(): CadAnyProps;
export declare function useCadCuiCommand(commandId: any, source?: string): (payload?: any) => any;
export declare function CadCuiRibbon({ iconMap, className, title, description, renderBadge, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadCuiQuickAccess({ iconMap, commandIds, className, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadCuiContextMenu({ menuId, iconMap, className, onClose, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadCuiCommandPalette({ iconMap, className, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadCuiCustomizer({ className, ...props }: CadAnyProps): React.JSX.Element;
