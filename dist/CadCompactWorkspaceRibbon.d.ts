import type { CadAnyProps } from './cad-types.js';
import React from 'react';
/**
 * Resolves a tab's hierarchical command groups without coupling the menu to
 * a router, renderer, docking manager or command runtime.
 */
export declare function resolveCadCompactWorkspaceRibbonGroups({ groups, commands, tabId, defaultGroupId, defaultGroupLabel }?: CadAnyProps): {
    id: any;
    label: any;
    commands: any;
}[];
/**
 * A compact CAD ribbon that deliberately discloses commands in three steps:
 * tab → command group → command. It uses `CadPopover` so clicking the active
 * tab a second time, pressing Escape, moving focus or the pointer away, or
 * interacting outside the menu closes the disclosure without host-specific
 * event plumbing.
 *
 * `openTabId` and `openGroupId` are independently controllable. Commands
 * close by default after execution, returning the operator to Model Space.
 * Set `closeOnCommand={false}` for a deliberately persistent toggle palette.
 */
export declare function CadCompactWorkspaceRibbon({ tabs, activeTab, defaultActiveTab, onActiveTabChange, openTabId, defaultOpenTabId, onOpenTabChange, openGroupId, defaultOpenGroupId, onOpenGroupChange, groups, commands, defaultGroupId, defaultGroupLabel, label, tabListLabel, identity, endSlot, placement, closeOnOutside, closeOnEscape, closeOnFocusOutside, closeOnPointerLeave, closeOnCommand, renderIcon, renderCommand, onCommand, className, style, ...props }: CadAnyProps): React.JSX.Element;
