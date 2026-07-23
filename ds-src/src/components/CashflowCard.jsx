import { Icon } from '../icons.jsx';

/**
 * MaV Cashflow card (Detail variant): a Main / Secondary segmented control over
 * a wallet balance with an income / expense split. `tab` selects the active
 * segment; `income` / `expense` render the colored gain / loss figures.
 */
export function CashflowCard({
  tab = 'Main',          // Main | Secondary
  amount = '$82,758.10',
  income = '+$20.000',
  expense = '−$5.200',
  className = '',
  ...rest
}) {
  const cls = ['cf', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="cf-seg">
        <div className={'s' + (tab === 'Main' ? ' active' : '')}>Main</div>
        <div className={'s' + (tab === 'Secondary' ? ' active' : '')}>Secondary</div>
      </div>
      <div className="cf-panel" style={{ borderRadius: '12px' }}>
        <div className="cf-wallet" style={{ gap: '4px' }}>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span className="bal-label">Available Balance</span>
            <Icon name="eye" className="bal-eye" width="16" height="16" />
          </div>
          <span className="w-amt">{amount}</span>
        </div>
        <button className="cf-change"><Icon name="plus" /> Top up</button>
      </div>
      <div className="cf-split">
        <div className="col"><span className="k">Income</span><span className="v gain">{income}</span></div>
        <div className="vr" />
        <div className="col"><span className="k">Expense</span><span className="v loss">{expense}</span></div>
      </div>
    </div>
  );
}
