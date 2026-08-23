# CAD CUI System

Private, reusable React component kit for compact CAD-style command surfaces,
personalizable command registries, keyboard shortcuts, local persistence and
React Router navigation.

The public API is intentionally split into two layers:

- the package supplies the generic runtime, UI primitives and cyber-HUD CSS;
- each application supplies its own serializable command registry and runtime
  intent handlers (for example Dockview, XYFlow or backend operations).

```jsx
import {
  CadCuiProvider,
  CadCuiRibbon,
  CadCuiQuickAccess,
  CadCuiCommandPalette,
  defineCadCuiSystem
} from '@szantoi/cad-cui-system';

const registry = defineCadCuiSystem({
  id: 'my-workspace',
  tabs: [{ id: 'view', label: 'VIEW' }],
  commands: [/* serializable command declarations */]
});

<CadCuiProvider registry={registry} handlers={{
  'panel.open': ({ intent }) => openPanel(intent.panelId)
}}>
  <CadCuiRibbon iconMap={icons} />
  <CadCuiQuickAccess iconMap={icons} />
  <CadCuiCommandPalette iconMap={icons} />
</CadCuiProvider>
```

Import `@szantoi/cad-cui-system/styles.css` once in the consuming application.
The source contains a longer copy/paste integration example beside
`CadCuiProvider`.
