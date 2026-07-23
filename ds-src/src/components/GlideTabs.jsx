/** MaV underline tabs with a gliding ink bar. Static render places the ink under the active tab. */
export function GlideTabs({ items = [], active = 0, className = '', ...rest }) {
  const cls = ['gtabs', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {items.map((t, i) => (
        <button key={i} className={'gtab' + (i === active ? ' on' : '')}>{t}</button>
      ))}
      <span className="gtabs-ink" />
    </div>
  );
}
