import { Icon } from '../icons.jsx';

/**
 * MaV inline alert. Four color variants map to the `alert/*` tokens: a 10% tint
 * background with the icon + title in the variant color and neutral body copy.
 */
export function Alert({
  variant = 'primary',   // primary | danger | success | warning
  title,                 // optional bold title (omit for the compact single-line state)
  children,              // body / description
  actions,               // optional array of { label, onClick }
  className = '',
  ...rest
}) {
  const multiline = Boolean(title);
  const cls = ['mav-alert', `alert-${variant}`, multiline && 'is-multiline', className]
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <span className="alert-icon"><Icon name="bell" /></span>
      <div className="alert-main">
        {title ? (
          <div className="alert-body">
            <div className="alert-title">{title}</div>
            <div className="alert-desc">{children}</div>
          </div>
        ) : (
          <p className="alert-single">{children}</p>
        )}
        {actions && actions.length > 0 && (
          <div className="alert-actions">
            {actions.map((a, i) => (
              <button key={i} className="alert-btn" onClick={a.onClick}>{a.label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
