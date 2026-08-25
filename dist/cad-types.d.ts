/**
 * Compatibility shape for the deliberately open, host-extensible CAD UI prop
 * surface. Individual components can narrow this over time without breaking
 * existing integrations.
 */
export type CadAnyProps = Record<string, any>;
/** A safe boundary type for persisted or host-provided metadata. */
export type CadUnknownRecord = Record<string, unknown>;
declare global {
    type CadAnyProps = import('./cad-types.js').CadAnyProps;
    type CadUnknownRecord = import('./cad-types.js').CadUnknownRecord;
}
