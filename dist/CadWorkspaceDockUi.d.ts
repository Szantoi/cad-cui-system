import type { CadAnyProps } from './cad-types.js';
/** The compact visibility states a host can persist for a workspace dock. */
export declare const CAD_WORKSPACE_DOCK_MODES: Readonly<{
    OPEN: "open";
    RAIL: "rail";
    CLOSED: "closed";
}>;
/**
 * Host-owned dock intent, without choosing a layout engine or writing any
 * persistence. `size` is always a clamped pixel count, while `mode` remains a
 * serializable `open`, `rail`, or `closed` value.
 */
export declare function useCadWorkspaceDock({ mode, defaultMode, onModeChange, size, defaultSize, minSize, maxSize, onSizeChange }?: CadAnyProps): {
    mode: string;
    size: number;
    minSize: number;
    maxSize: number;
    setMode: (nextValue: any, event: any, source?: string) => {
        changed: boolean;
        mode: string;
        previousMode: string;
        source: string;
    };
    setSize: (nextValue: any, event: any, source?: string, metadata?: {}) => {
        source: string;
        changed: boolean;
        size: number;
        previousSize: number;
        minSize: number;
        maxSize: number;
    };
    open: (event: any, source?: string) => {
        changed: boolean;
        mode: string;
        previousMode: string;
        source: string;
    };
    rail: (event: any, source?: string) => {
        changed: boolean;
        mode: string;
        previousMode: string;
        source: string;
    };
    close: (event: any, source?: string) => {
        changed: boolean;
        mode: string;
        previousMode: string;
        source: string;
    };
    isOpen: boolean;
    isRail: boolean;
    isClosed: boolean;
};
/**
 * A three-position visibility control for a dock. It reports intent only; the
 * host decides whether rail means a tab strip, a compact inspector, or another
 * view entirely.
 */
export declare function CadWorkspaceDockModeControl({ mode, defaultMode, onModeChange, label, controls, disabled, openDisabled, railDisabled, hideDisabled, openLabel, railLabel, hideLabel, onOpenClick, onRailClick, onHideClick, className, 'aria-label': ariaLabel, 'aria-controls': ariaControls, ...props }: CadAnyProps): import("react").JSX.Element;
/**
 * Pixel-based dock separator. `edge` describes where the dock is anchored:
 * left grows rightward, right grows leftward, top grows downward, and bottom
 * grows upward. The pointer and arrow keys mirror that physical direction.
 */
export declare const CadWorkspaceDockResizeHandle: import("react").ForwardRefExoticComponent<Omit<CadAnyProps, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
/**
 * Controlled/uncontrolled temporary visibility for a collapsed dock rail.
 * This stays deliberately separate from the durable dock `mode`: a hover peek
 * should never rewrite a saved workspace layout.
 */
export declare function useCadWorkspaceDockRail({ peekOpen, defaultPeekOpen, onPeekOpenChange, edge }?: CadAnyProps): {
    edge: any;
    peekOpen: boolean;
    setPeekOpen: (nextValue: any, event: any, source?: string) => {
        changed: boolean;
        open: boolean;
        previousOpen: boolean;
        edge: any;
        source: string;
    };
    openPeek: (event: any, source?: string) => {
        changed: boolean;
        open: boolean;
        previousOpen: boolean;
        edge: any;
        source: string;
    };
    closePeek: (event: any, source?: string) => {
        changed: boolean;
        open: boolean;
        previousOpen: boolean;
        edge: any;
        source: string;
    };
};
/**
 * A compact dock rail that opens a preview while it is hovered or focused.
 * Static preview children stay mounted by default, preserving state between
 * short peeks. A render function defaults to lazy mounting so expensive
 * previews only exist while the rail is active. Clicking the rail only reports
 * `onExpand`; the host can then make its own durable open-mode/layout decision.
 */
export declare function CadWorkspaceDockRail({ edge, label, previewLabel, expandLabel, children, renderPreview, previewMount, peekOpen, defaultPeekOpen, onPeekOpenChange, onExpand, disabled, id, controls, className, railClassName, previewClassName, onPointerEnter, onPointerLeave, onFocusCapture, onBlurCapture, onKeyDown, 'aria-label': ariaLabel, ...props }: CadAnyProps): import("react").JSX.Element;
/**
 * A small layout-engine-neutral dock zone. It deliberately delegates tab ARIA,
 * keyboard selection, badges, and optional closable panels to the existing
 * CadDockTabs primitive while exposing side/bottom placement as host-readable
 * metadata. Close actions are opt-in: merely using a dock zone cannot create
 * a destructive close target.
 */
export declare function CadWorkspaceDockZone({ edge, panels, activeId, defaultActiveId, onActiveChange, onPanelClose, label, tabsLabel, compactTabs, renderPanel, children, id, className, tabsClassName, panelClassName, emptyLabel, ...props }: CadAnyProps): import("react").JSX.Element;
