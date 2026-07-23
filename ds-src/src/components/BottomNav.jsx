/** MaV bottom nav bar with a gliding top-indicator, per-item icon+label, and an optional floating Scan button. */

const ICON = {
  home:      <><path d="M4 10.5 12 4l8 6.5" /><path d="M6 9.5V20h12V9.5" /></>,
  statistic: <><path d="M4 19V5" /><path d="M4 15l4.5-4.5 3.5 3 5-6" /><path d="M4 19h16" /></>,
  cards:     <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></>,
  profile:   <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="3" /><path d="M6.5 18.4a6 6 0 0 1 11 0" /></>,
  search:    <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  history:   <><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" /><path d="M3 4v4h4" /><path d="M12 8v4l3 2" /></>,
};

const LABELS = { home: 'Home', statistic: 'Statistic', cards: 'Cards', profile: 'Profile', search: 'Search', history: 'History' };

const ScanIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M4 8V6a2 2 0 0 1 2-2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" />
    <path d="M20 16v2a2 2 0 0 1-2 2h-2" /><path d="M8 20H6a2 2 0 0 1-2-2v-2" /><path d="M4 12h16" />
  </svg>
);

export function BottomNav({
  items = ['home', 'statistic', 'cards', 'profile'], // keys of ICON, or {key,label} objects
  active = 0,
  scan = false,
  className = '',
  ...rest
}) {
  const cls = ['bnav', className].filter(Boolean).join(' ');
  const spacerAt = scan ? Math.ceil(items.length / 2) : -1;
  return (
    <div className={cls} {...rest}>
      <span className="bnav-ink" />
      {items.flatMap((it, i) => {
        const key = typeof it === 'string' ? it : it.key;
        const label = typeof it === 'string' ? LABELS[it] : it.label;
        const btn = (
          <button key={i} className={'bnav-item' + (i === active ? ' on' : '')} data-i={i}>
            <svg viewBox="0 0 24 24">{ICON[key]}</svg>
            <span className="lbl">{label}</span>
          </button>
        );
        return i === spacerAt
          ? [<span key={'sp' + i} className="bnav-item spacer" />, btn]
          : [btn];
      })}
      {scan && <button className="bnav-scan" aria-label="Scan"><ScanIcon /></button>}
    </div>
  );
}
