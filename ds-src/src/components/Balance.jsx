import { Icon } from '../icons.jsx';

/**
 * MaV available-balance hero. A large Plus Jakarta Sans amount (32px) with a
 * privacy eye, an optional success trend badge, and a Send / Request action pair.
 */
export function Balance({
  label = 'Available balance',
  amount,                // e.g. "$82,758.10"
  trend,                 // e.g. "+24% this month" (renders the success badge)
  actions = true,        // show the Send / Request pair
  className = '',
  ...rest
}) {
  const cls = ['bal-hero', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="bal-head">
        <div className="bal-label">{label}</div>
        <div className="amt-row">
          <span className="bal-amount">{amount}</span>
          <Icon name="eye" className="bal-eye" />
        </div>
        {trend && <span className="bal-badge">{trend}</span>}
      </div>
      {actions && (
        <div className="bal-actions">
          <button className="bal-btn primary"><Icon name="plus" /> Send</button>
          <button className="bal-btn secondary"><Icon name="plus" /> Request</button>
        </div>
      )}
    </div>
  );
}
