/** MaV pagination — button group, clear (spaced), page count, or dots, with prev/next nav options. */

const PrevIcon = () => <svg className="ic-prev" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" /></svg>;
const NextIcon = () => <svg className="ic-next" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>;

function navBody(dir, mode) {
  if (mode === 'none') return null;
  const ico = dir === 'prev' ? <PrevIcon /> : <NextIcon />;
  const lbl = dir === 'prev' ? 'Previous' : 'Next';
  if (mode === 'icon') return ico;
  if (mode === 'label') return lbl;
  // both — icon leads for prev, trails for next
  return dir === 'prev' ? <>{ico}<span>{lbl}</span></> : <><span>{lbl}</span>{ico}</>;
}

export function Pagination({
  type = 'group',      // group | clear | count | dots
  pages,               // number, or an array (e.g. [1,2,3,'…',7,8,9]) for group/clear
  nav = 'both',        // both | icon | label | none
  active = 0,          // active page index (group/clear/dots) or current page (count, 1-based via `current`)
  current,             // count type: current page number (1-based)
  total,               // count type: total pages
  className = '',
  ...rest
}) {
  const cls = ['pg', className].filter(Boolean).join(' ');

  if (type === 'dots') {
    const n = typeof pages === 'number' ? pages : 5;
    return (
      <div className={cls} {...rest}>
        <div className="pg-dots">
          {Array.from({ length: n }, (_, d) => (
            <button key={d} className={'pg-dot' + (d === active ? ' on' : '')} data-i={d} aria-label={`Page ${d + 1}`} />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'count') {
    const tot = total || (typeof pages === 'number' ? pages : 8);
    const cur = current || 1;
    return (
      <div className={cls} {...rest}>
        <div className="pg-count">
          <button className="pg-btn nav" data-nav="prev" disabled={cur === 1}>
            {nav === 'label' ? 'Previous' : nav === 'icon' ? <PrevIcon /> : <><PrevIcon /><span>Previous</span></>}
          </button>
          <span className="pg-label">Page <span className="pg-cur mav-num">{cur}</span> of {tot}</span>
          <button className="pg-btn nav" data-nav="next" disabled={cur === tot}>
            {nav === 'label' ? 'Next' : nav === 'icon' ? <NextIcon /> : <><span>Next</span><NextIcon /></>}
          </button>
        </div>
      </div>
    );
  }

  // group / clear — numbered items with a gliding indicator
  const list = Array.isArray(pages)
    ? pages
    : Array.from({ length: typeof pages === 'number' ? pages : 7 }, (_, i) => i + 1);
  const wrapCls = type === 'group' ? 'pg-group' : 'pg-clear';
  // active index counts only numeric page items
  let numIdx = -1;
  return (
    <div className={cls} {...rest}>
      <div className={wrapCls}>
        <span className="pg-ind" />
        {nav !== 'none' && (
          <button className="pg-item nav" data-nav="prev" disabled={active === 0}>{navBody('prev', nav)}</button>
        )}
        {list.map((p, i) => {
          if (p === '…') return <span key={i} className="pg-item gap">…</span>;
          numIdx += 1;
          return (
            <button key={i} className={'pg-item pg-num' + (numIdx === active ? ' active' : '')} data-p={p}>{p}</button>
          );
        })}
        {nav !== 'none' && (
          <button className="pg-item nav" data-nav="next">{navBody('next', nav)}</button>
        )}
      </div>
    </div>
  );
}
