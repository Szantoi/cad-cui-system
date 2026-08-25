import type { CadAnyProps } from './cad-types.js';
import React from 'react';
/**
 * Turns flat command declarations into stable, ordered ribbon groups.
 *
 * It understands either generic `{ tabId, groupId, groupLabel, order }`
 * fields or the serializable `placement` shape emitted by `CadCuiRuntime`.
 * No command is executed or mutated here, so it is safe to use with any
 * drawing renderer, router or state manager.
 */
export declare function groupCadWorkspaceRibbonCommands(commands?: any[], { tabId, defaultGroupId, defaultGroupLabel }?: {
    tabId?: string;
    defaultGroupId?: string;
    defaultGroupLabel?: string;
}): {
    id: any;
    label: any;
    commands: any;
}[];
/**
 * A renderer-agnostic AutoCAD-style command ribbon.
 *
 * The host keeps command execution, icons, authentication and rendering
 * adapters. This primitive only manages the tab/minimized UI state and emits
 * selected command records through `onCommand`.
 */
export declare function CadWorkspaceRibbon({ tabs, activeTab, defaultActiveTab, onActiveTabChange, groups, commands, defaultGroupId, defaultGroupLabel, label, tabListLabel, minimized, defaultMinimized, onMinimizedChange, collapsible, compact, identity, renderIdentity, status, statusLabel, renderStatus, endSlot, renderIcon, renderCommand, renderMinimizeControl, onCommand, className, style, children, ...props }: CadAnyProps): React.JSX.Element;
