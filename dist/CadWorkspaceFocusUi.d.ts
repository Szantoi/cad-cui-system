import type { CadAnyProps } from './cad-types.js';
import React from 'react';
/**
 * Controlled/uncontrolled focus-mode intent for a CAD workspace.
 *
 * It purposefully owns no DOM layout, fullscreen API, keyboard listener, or
 * focus-trap. A host can use the serializable boolean to hide docks, expand a
 * viewport, restore its own layout, or bind the shortcut that is safe in its
 * application shell.
 */
export declare function useCadWorkspaceFocus({ active, defaultActive, onActiveChange }?: CadAnyProps): {
    active: boolean;
    setActive: (nextValue: any, event: any, source?: string) => {
        changed: boolean;
        active: boolean;
        previousActive: boolean;
        source: string;
    };
    toggle: (event: any, source?: string) => {
        changed: boolean;
        active: boolean;
        previousActive: boolean;
        source: string;
    };
};
/**
 * A compact, engine-free trigger for workspace focus mode.
 *
 * `shortcut` is deliberately an indicator only. Document-level keyboard
 * bindings stay host-owned so applications can avoid collisions with inputs,
 * dialogs, browser shortcuts, and their own command routing.
 */
export declare const CadWorkspaceFocusToggle: React.ForwardRefExoticComponent<Omit<CadAnyProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
