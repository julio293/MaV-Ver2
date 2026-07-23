/** MaV pill tabs with a gliding pill highlight over a track. Static render highlights the active pill. */
export function PillTabs({ items = [], active = 0, className = '', ...rest }) {
  const cls = ['gpills', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <span className="gpills-ink" />
      {items.map((t, i) => (
        <button key={i} className={'gpill' + (i === active ? ' on' : '')}>{t}</button>
      ))}
    </div>
  );
}
