import { Icon } from '../icons.jsx';

const ICON = { success: 'check', error: 'alert-tri', info: 'info', warning: 'alert-tri' };

/**
 * MaV floating toast. Dark surface (#191919) by default with a colored status
 * icon; pass `light` for the white variant. Anchored to screen bottom in use.
 */
export function Toast({
  status = 'success',    // success | error | info | warning
  title,
  description,
  action,                // optional label for the trailing text action
  light = false,
  onClose,
  className = '',
  ...rest
}) {
  const cls = ['mav-toast', light && 'toast-light', `toast-${status}`, className]
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="toast-icon"><Icon name={ICON[status]} width="12" height="12" /></div>
      <div className="toast-body">
        <div className="toast-title">{title}</div>
        {description && <div className="toast-desc">{description}</div>}
      </div>
      {action && <span className="toast-action">{action}</span>}
      <span className="toast-close" onClick={onClose}>×</span>
    </div>
  );
}
