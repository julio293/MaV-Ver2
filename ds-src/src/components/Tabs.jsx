/** MaV 48px tab bar. Selected tab shows the active indicator over a full-width rail. Supports icon, notify dot, disabled, and scrollable. */

export function Tabs({
  items = [],          // string | { label, icon?, dot?, disabled? }
  active = 0,
  scroll = false,
  className = '',
  ...rest
}) {
  const cls = ['tabs', scroll && 'tabs-scroll', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {items.map((it, i) => {
        const o = typeof it === 'string' ? { label: it } : it;
        const tabCls = ['tab', i === active && 'selected', o.disabled && 'disabled'].filter(Boolean).join(' ');
        return (
          <button key={i} className={tabCls}>
            <span className="tab-label">
              {o.icon}
              {o.label}
              {o.dot && <span className="tab-dot" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
