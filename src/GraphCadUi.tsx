import type { CadAnyProps } from './cad-types';
import React from 'react';

const CAD_TONES = Object.freeze({
  cyan: '#00fbfb',
  blue: '#4bc8ff',
  magenta: '#ff00ff',
  violet: '#b86dff',
  green: '#80ff00',
  amber: '#ff8a00',
  neutral: '#94a3b8'
});

const cx = (...values) => values.filter(Boolean).join(' ');
const resolvedTone = tone => CAD_TONES[tone] || tone || CAD_TONES.cyan;

/**
 * Presentational primitives for CAD-like workspaces. An application owns its
 * window manager; this kit only gives panels compact, calibrated content UI.
 */
export function CadPanelShell({ as: Component = 'section', tone = 'cyan', density = 'regular', visualStrength = 'standard', scroll = true, className, style, children, ...props }: CadAnyProps) {
  return React.createElement(Component, { ...props, 'data-tone': tone, 'data-density': density, 'data-visual-strength': visualStrength, className: cx('cad-ui-panel', scroll && 'cad-ui-panel--scroll', className), style: { '--cad-ui-accent': resolvedTone(tone), ...style } }, children);
}

export function CadPanelHeader({ icon: Icon, eyebrow, title, description, status, actions, compact = false, className, children }: CadAnyProps) {
  return (
    <header className={cx('cad-ui-panel__header', compact && 'cad-ui-panel__header--compact', className)}>
      <div className="cad-ui-panel__heading">
        {Icon && <span className="cad-ui-panel__icon" aria-hidden="true"><Icon size={compact ? 12 : 14} /></span>}
        <div className="cad-ui-panel__copy">
          {eyebrow && <p className="cad-ui-panel__eyebrow">{eyebrow}</p>}
          {title && <h2 className="cad-ui-panel__title">{title}</h2>}
          {description && <p className="cad-ui-panel__description">{description}</p>}
          {children}
        </div>
      </div>
      {(status || actions) && <div className="cad-ui-panel__header-actions">{status && <span className="cad-ui-status">{status}</span>}{actions}</div>}
    </header>
  );
}

export function CadPanelSection({ as: Component = 'section', icon: Icon, eyebrow, title, description, actions, compact = false, className, children, ...props }: CadAnyProps) {
  const hasHeading = Boolean(Icon || eyebrow || title || description || actions);
  const content = <>
      {hasHeading && <header className="cad-ui-section__header">
        <div className="cad-ui-section__copy">
          {(Icon || eyebrow) && <p className="cad-ui-section__eyebrow">{Icon && <Icon size={11} aria-hidden="true" />}{eyebrow}</p>}
          {title && <h3 className="cad-ui-section__title">{title}</h3>}
          {description && <p className="cad-ui-section__description">{description}</p>}
        </div>
        {actions && <div className="cad-ui-section__actions">{actions}</div>}
      </header>}
      <div className="cad-ui-section__body">{children}</div>
    </>;
  return React.createElement(Component, { ...props, className: cx('cad-ui-section', compact && 'cad-ui-section--compact', className) }, content);
}

export function CadSegmentTabs({ items, activeId, onChange, label, className }: CadAnyProps) {
  return <div className={cx('cad-ui-segment-tabs', className)} role="tablist" aria-label={label}>
    {items.map(({ id, label: itemLabel, icon: Icon, disabled = false }: CadAnyProps) => <button key={id} type="button" role="tab" aria-selected={activeId === id} disabled={disabled} onClick={() => onChange(id)}>
      {Icon && <Icon size={11} aria-hidden="true" />}<span>{itemLabel}</span>
    </button>)}
  </div>;
}

export function CadActionButton({ icon: Icon, tone = 'inherit', compact = false, className, children, type = 'button', ...props }: CadAnyProps) {
  return <button {...props} type={type} data-tone={tone} className={cx('cad-ui-action', compact && 'cad-ui-action--compact', className)}>{Icon && <Icon size={compact ? 11 : 13} aria-hidden="true" />}<span>{children}</span></button>;
}

export function CadIconButton({ icon: Icon, label, tone = 'inherit', className, type = 'button', ...props }: CadAnyProps) {
  return <button {...props} type={type} data-tone={tone} className={cx('cad-ui-icon-action', className)} aria-label={label} title={label}>{Icon && <Icon size={13} aria-hidden="true" />}</button>;
}

export function CadDataRow({ as: Component = 'div', icon: Icon, title, detail, meta, status, actions, active = false, tone = 'inherit', className, children, ...props }: CadAnyProps) {
  const content = <>
    {Icon && <span className="cad-ui-data-row__icon" aria-hidden="true"><Icon size={13} /></span>}
    <span className="cad-ui-data-row__copy">
      {title && <strong>{title}</strong>}
      {detail && <small>{detail}</small>}
      {children}
    </span>
    {(meta || status || actions) && <span className="cad-ui-data-row__trailing">{meta && <em>{meta}</em>}{status && <span className="cad-ui-status">{status}</span>}{actions}</span>}
  </>;
  const componentProps = Component === 'button' && !props.type ? { ...props, type: 'button' } : props;
  return React.createElement(Component, { ...componentProps, 'data-active': active ? 'true' : 'false', 'data-tone': tone, className: cx('cad-ui-data-row', className) }, content);
}

export function CadStatGrid({ items, className, label = 'Summary data' }: CadAnyProps) {
  return <dl className={cx('cad-ui-stat-grid', className)} aria-label={label}>
    {items.map(item => <div key={item.id || item.label} data-tone={item.tone || 'inherit'}>
      <dt>{item.label}</dt><dd>{item.value}</dd>{item.detail && <small>{item.detail}</small>}
    </div>)}
  </dl>;
}

export function CadPanelFooter({ className, children }: CadAnyProps) {
  return <footer className={cx('cad-ui-panel__footer', className)}>{children}</footer>;
}

export function CadEmptyState({ icon: Icon, title = 'NO DATA TO DISPLAY', children, className }: CadAnyProps) {
  return <div className={cx('cad-ui-empty-state', className)}>{Icon && <Icon size={16} aria-hidden="true" />}<div><strong>{title}</strong>{children && <p>{children}</p>}</div></div>;
}
