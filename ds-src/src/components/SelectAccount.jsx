/**
 * MaV "Select source of funds" organism — a mobile screen with a status bar,
 * top nav, a Standard Account tile, a radio-selectable Accounts List (with
 * disabled / locked rows + inline messages), and a bottom Button Dock.
 */

const CardIcon = () => (
  <svg className="row-ic" viewBox="0 0 24 24">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

function AccountRow({ name, balance, selected = false, disabled = false, message, onClick }) {
  const cls = ['acct-row', selected ? 'selected' : '', disabled ? 'disabled' : ''].filter(Boolean).join(' ');
  const rdo = ['rdo', selected ? 'active' : '', disabled ? 'disabled' : ''].filter(Boolean).join(' ');
  return (
    <div className={cls} onClick={disabled ? undefined : onClick}>
      <CardIcon />
      <div className="acct-info">
        <span className="acct-name">{name}</span>
        <span className="acct-bal">{balance}</span>
        {message && <span className="inline-msg"><LockIcon />{message}</span>}
      </div>
      <span className={rdo} />
    </div>
  );
}

export function SelectAccount({
  navTitle = 'Money Fixed Plus',
  standardLabel = 'Standard Account',
  standardDesc = 'Choose the account to transfer from.',
  standardAvatar = 'M',
  standardName = 'Money Saving',
  standardNumber = '***-***432-1',
  standardBalance = '฿ 10,000.00',
  listTitle = 'Accounts List',
  accounts = [
    { name: 'Mr. K', balance: '฿ 10,000.00', selected: true },
    { name: 'Everyday Pot', balance: '฿ 4,250.00' },
    { name: 'Holiday Fund', balance: '฿ 82,000.00' },
    { name: 'Locked Pot', balance: '฿ 10,000.00', disabled: true, message: 'Locked until 12 Aug' },
    { name: 'Fixed Deposit', balance: '฿ 250,000.00', disabled: true, message: 'Not available for transfer' },
  ],
  dockLabel = 'Continue',
  onPick,
  className = '',
  ...rest
}) {
  const cls = ['phone', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="statusbar">
        <span>9:41</span>
        <span className="lvl">
          <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="7" width="3" height="5" rx="1" /><rect x="5" y="4" width="3" height="8" rx="1" /><rect x="10" y="2" width="3" height="10" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" strokeWidth="1.6"><path d="M1 4a10 10 0 0 1 14 0M3.5 6.5a6 6 0 0 1 9 0M8 9.5h.01" /></svg>
          <svg width="24" height="12" viewBox="0 0 24 12"><rect x="1" y="1" width="20" height="10" rx="3" fill="none" strokeWidth="1" opacity=".5" /><rect x="3" y="3" width="15" height="6" rx="1" /><rect x="22" y="4" width="1.5" height="4" rx="1" /></svg>
        </span>
      </div>
      <div className="topnav">
        <div className="nav-ic"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" /></svg></div>
        <div className="nav-title">{navTitle}</div>
        <div style={{ width: 32 }} />
      </div>
      <div className="sof-body">
        <div className="card">
          <div>
            <div className="sec-title sm">{standardLabel}</div>
            <div className="sec-desc">{standardDesc}</div>
          </div>
          <div className="acct-tile">
            <span className="avatar">{standardAvatar}</span>
            <div className="acct-info">
              <span className="acct-name">{standardName}</span>
              <span className="acct-num">{standardNumber}</span>
              <span className="acct-bal">{standardBalance}</span>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="sec-title">{listTitle}</div>
          <div className="sof-list">
            {accounts.map((a, i) => (
              <AccountRow key={i} {...a} onClick={() => onPick && onPick(a, i)} />
            ))}
          </div>
        </div>
      </div>
      <div className="dock">
        <button className="btn-dock">{dockLabel}</button>
        <div className="home-ind" />
      </div>
    </div>
  );
}
