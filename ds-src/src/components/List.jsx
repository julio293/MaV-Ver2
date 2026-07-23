/** MaV list container — a vertical stack of rows divided by a 1px subtle rule. */
export function List({ className = '', children, ...rest }) {
  const cls = ['list', className].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}

/** A single list row: optional leading media, a name (+ optional subtitle),
 *  and an optional trailing action. Any slot is optional. */
export function ListRow({
  name,
  subtitle,
  leading,     // node rendered in the leading slot (flag / icon / avatar / etc.)
  trailing,    // node rendered in the trailing slot (check / button / tag)
  className = '',
  children,
  ...rest
}) {
  const cls = ['li', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {leading}
      <div className="li-body">
        {name != null && <span className="li-name">{name}</span>}
        {subtitle != null && <span className="li-sub">{subtitle}</span>}
        {children}
      </div>
      {trailing}
    </div>
  );
}

/** A soft-tinted icon chip for the row's leading slot. */
export function ListSoftIcon({ children, className = '', ...rest }) {
  const cls = ['li-softic', className].filter(Boolean).join(' ');
  return <span className={cls} {...rest}>{children}</span>;
}

/** A circular initial avatar for the row's leading slot. */
export function ListAvatar({ initials, background, className = '', style, ...rest }) {
  const cls = ['li-avatar', className].filter(Boolean).join(' ');
  return <span className={cls} style={{ background, ...style }} {...rest}>{initials}</span>;
}

/** A small square store-logo tile for the row's leading slot. */
export function ListStore({ label, background, className = '', style, ...rest }) {
  const cls = ['li-store', className].filter(Boolean).join(' ');
  return <span className={cls} style={{ background, ...style }} {...rest}>{label}</span>;
}

/** Trailing ghost button. */
export function ListButton({ className = '', children, ...rest }) {
  const cls = ['li-btn', className].filter(Boolean).join(' ');
  return <button className={cls} {...rest}>{children}</button>;
}

/** Trailing neutral tag pill. */
export function ListTag({ className = '', children, ...rest }) {
  const cls = ['li-tag', className].filter(Boolean).join(' ');
  return <span className={cls} {...rest}>{children}</span>;
}

/** Trailing check mark. */
export function ListCheck({ className = '', ...rest }) {
  const cls = ['li-check', className].filter(Boolean).join(' ');
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
