/** MaV mobile top navigation bar — iOS status bar + 56px row with back control, centered title, and a trailing action slot. */

const BackIcon = () => <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg>;
const CloseIcon = () => <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>;
const MoreIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle className="dots" cx="12" cy="5" r="1.6" />
    <circle className="dots" cx="12" cy="12" r="1.6" />
    <circle className="dots" cx="12" cy="19" r="1.6" />
  </svg>
);

const StatusBar = ({ time = '9:41' }) => (
  <div className="ab-status">
    <span className="ab-time">{time}</span>
    <span className="ab-levels">
      <svg width="18" height="12" viewBox="0 0 18 12">
        <rect x="0" y="8" width="3" height="4" rx=".5" /><rect x="5" y="5" width="3" height="7" rx=".5" />
        <rect x="10" y="2.5" width="3" height="9.5" rx=".5" /><rect x="15" y="0" width="3" height="12" rx=".5" />
      </svg>
      <svg width="17" height="12" viewBox="0 0 17 12">
        <path d="M8.5 2.2c2.6 0 5 1 6.8 2.7l-1.4 1.5A7.6 7.6 0 0 0 8.5 4.3 7.6 7.6 0 0 0 3.1 6.4L1.7 4.9A9.7 9.7 0 0 1 8.5 2.2Zm0 3.6c1.6 0 3.1.6 4.2 1.7l-1.5 1.5A3.9 3.9 0 0 0 8.5 9a3.9 3.9 0 0 0-2.7 1L4.3 7.5A6 6 0 0 1 8.5 5.8Zm0 3.5 1.9 2-1.9 .5-1.9-.5 1.9-2Z" />
      </svg>
      <svg width="26" height="12" viewBox="0 0 26 12">
        <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" strokeOpacity=".35" />
        <rect x="2" y="2" width="18" height="8" rx="1.5" /><rect x="23" y="4" width="1.6" height="4" rx=".8" />
      </svg>
    </span>
  </div>
);

function renderAction(a, i) {
  if (a === 'close') return <button key={i} className="ab-ico" aria-label="Close"><CloseIcon /></button>;
  if (a === 'more') return <button key={i} className="ab-ico" aria-label="More"><MoreIcon /></button>;
  if (typeof a === 'string') return <button key={i} className="ab-txt">{a}</button>;
  return <span key={i}>{a}</span>;
}

export function AppBar({
  title = 'Screen title',
  time = '9:41',
  statusBar = true,
  back = true,
  actions = [],        // 'close' | 'more' | a string (text button) | React node
  inverted = false,
  bordered = false,
  className = '',
  ...rest
}) {
  const cls = ['appbar', inverted && 'inverted', bordered && 'bordered', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {statusBar && <StatusBar time={time} />}
      <div className="ab-row">
        <div className="ab-side">
          {back && <button className="ab-ico" aria-label="Back"><BackIcon /></button>}
        </div>
        <div className="ab-title">{title}</div>
        <div className="ab-side after">{actions.map(renderAction)}</div>
      </div>
    </div>
  );
}
