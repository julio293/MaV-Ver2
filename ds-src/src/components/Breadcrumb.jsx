/** MaV page header — a breadcrumb trail + title, with an optional trailing action slot. */

const SearchIcon = () => <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>;
const InfoIcon = () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16h.01" /></svg>;

export function Breadcrumb({
  crumbs = [],   // array of strings; the last is treated as the current page
  title,
  actions = ['search', 'info'], // icon keys ('search' | 'info') or React nodes
  className = '',
  ...rest
}) {
  const cls = ['top-header', className].filter(Boolean).join(' ');
  const iconFor = (a) => (a === 'search' ? <SearchIcon /> : a === 'info' ? <InfoIcon /> : a);
  return (
    <div className={cls} {...rest}>
      <div>
        <div className="breadcrumb">
          {crumbs.map((c, i) =>
            i === crumbs.length - 1
              ? <span key={i} className="bc-current">{c}</span>
              : [<a key={'l' + i} className="bc-link">{c}</a>, <span key={'s' + i} className="bc-sep">/</span>]
          )}
        </div>
        {title && <div className="th-title">{title}</div>}
      </div>
      {actions.length > 0 && (
        <div className="th-actions">
          {actions.map((a, i) => (
            <button key={i} className="th-icon-btn">{iconFor(a)}</button>
          ))}
        </div>
      )}
    </div>
  );
}
