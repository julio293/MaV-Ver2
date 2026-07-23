/**
 * MaV finance balance card — 343px gradient card with a label, large amount,
 * sub-line, a trailing glyph, and a row of action buttons. `dark` swaps to the
 * dark gradient / lime-tinted buttons.
 */
export function BalanceCard({
  label = 'Available Balance',
  amount = '₦ 284,500',
  amountFraction = '.00',
  sub = 'Last updated: just now',
  actions = [
    { label: 'Add Money', icon: 'plus' },
    { label: 'Send', icon: 'arrow-left' },
    { label: 'History', icon: 'clock' },
  ],
  dark = false,
  className = '',
  ...rest
}) {
  const cls = ['balance-card', dark ? 'balance-card-dk' : '', className].filter(Boolean).join(' ');
  const stroke = dark ? 'var(--mav-primary-dark)' : 'white';
  return (
    <div className={cls} {...rest}>
      <div className="bal-row">
        <div>
          <div className="bal-label">{label}</div>
          <div className="bal-amount">{amount}{amountFraction && <span>{amountFraction}</span>}</div>
          <div className="bal-sub">{sub}</div>
        </div>
        {dark ? (
          <div>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3v12M3 9l6-6 6 6" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        ) : (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" opacity=".4"><circle cx="18" cy="18" r="17" stroke="white" strokeWidth="2" /><path d="M11 18h14M18 11l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
      </div>
      <div className="bal-actions">
        {actions.map((a, i) => (
          <button className="bal-btn" key={i}>
            <ActionIcon name={a.icon} stroke={stroke} />
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ActionIcon({ name, stroke }) {
  switch (name) {
    case 'plus':
      return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3v12M3 9h12" stroke={stroke} strokeWidth="2" strokeLinecap="round" /></svg>;
    case 'arrow-left':
      return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M15 9H3M9 3l-6 6 6 6" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'arrow-right':
      return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M9 3l6 6-6 6" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'clock':
      return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6" stroke={stroke} strokeWidth="2" /><path d="M9 6v3l2 2" stroke={stroke} strokeWidth="2" strokeLinecap="round" /></svg>;
    default:
      return null;
  }
}
