import type { CadAnyProps } from './cad-types.js';
import React from 'react';
/**
 * Presentational primitives for CAD-like workspaces. An application owns its
 * window manager; this kit only gives panels compact, calibrated content UI.
 */
export declare function CadPanelShell({ as: Component, tone, density, visualStrength, scroll, className, style, children, ...props }: CadAnyProps): React.DetailedReactHTMLElement<{
    'data-tone': any;
    'data-density': any;
    'data-visual-strength': any;
    className: string;
    style: any;
}, HTMLElement>;
export declare function CadPanelHeader({ icon: Icon, eyebrow, title, description, status, actions, compact, className, children }: CadAnyProps): React.JSX.Element;
export declare function CadPanelSection({ as: Component, icon: Icon, eyebrow, title, description, actions, compact, className, children, ...props }: CadAnyProps): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export declare function CadSegmentTabs({ items, activeId, onChange, label, className }: CadAnyProps): React.JSX.Element;
export declare function CadActionButton({ icon: Icon, tone, compact, className, children, type, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadIconButton({ icon: Icon, label, tone, className, type, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadDataRow({ as: Component, icon: Icon, title, detail, meta, status, actions, active, tone, className, children, ...props }: CadAnyProps): React.DetailedReactHTMLElement<{
    'data-active': string;
    'data-tone': any;
    className: string;
}, HTMLElement>;
export declare function CadStatGrid({ items, className, label }: CadAnyProps): React.JSX.Element;
export declare function CadPanelFooter({ className, children }: CadAnyProps): React.JSX.Element;
export declare function CadEmptyState({ icon: Icon, title, children, className }: CadAnyProps): React.JSX.Element;
