import type { CadAnyProps } from './cad-types.js';
import React from 'react';
/**
 * Compact titlebar controls for a CAD workspace shell.
 *
 * The component deliberately owns no workspace state, docking logic, keyboard
 * bindings, or persistence. It only turns declarative control records into
 * accessible buttons so a host can place the group beside its File/Edit menu.
 *
 * Each `items` record supports `{ id, label, icon, mode, active, disabled,
 * onClick, shortcut }`. `onClick` receives `(item, context, event)` and the
 * optional group-level `onItemClick` receives the same arguments after it.
 */
export declare const CadWorkspaceChromeControls: React.ForwardRefExoticComponent<Omit<CadAnyProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
