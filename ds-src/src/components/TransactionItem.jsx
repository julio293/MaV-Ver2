/**
 * MaV transaction list row — 42px icon tile, name + meta, and a right-aligned
 * amount with status line. `type` (credit | debit) colours the amount.
 */
export function TransactionItem({
  icon = 'in',
  name = 'Salary — GTBank',
  meta = 'Transfer · Feb 28 · 09:14',
  amount = '+₦ 350,000',
  type = 'credit',       // credit | debit
  status = 'Credit',
  className = '',
  ...rest
}) {
  const cls = ['txn-item', className].filter(Boolean).join(' ');
  const amtCls = ['txn-amount', type === 'credit' ? 'txn-amount-credit' : 'txn-amount-debit'].join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="txn-icon"><TxnIcon name={icon} /></div>
      <div className="txn-body">
        <div className="txn-name">{name}</div>
        <div className="txn-meta">{meta}</div>
      </div>
      <div>
        <div className={amtCls}>{amount}</div>
        <div className="txn-date">{status}</div>
      </div>
    </div>
  );
}

function TxnIcon({ name }) {
  switch (name) {
    case 'in':
      return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10h14M10 3l7 7-7 7" stroke="var(--mav-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'out':
      return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 10H3M10 3L3 10l7 7" stroke="var(--mav-danger)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'pending':
      return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="var(--mav-primary)" strokeWidth="1.5" /><path d="M10 7v3l2.5 2.5" stroke="var(--mav-primary)" strokeWidth="1.5" strokeLinecap="round" /></svg>;
    case 'check':
      return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="var(--mav-success)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    default:
      return null;
  }
}
