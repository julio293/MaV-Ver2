/**
 * MaV calendar card — emits `.dp` with month pager, weekday row and a 7-col day grid
 * (type "day"/"range"), or a 4-col year grid (type "year"). Faithful to the Datepicker page.
 */
const WD = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const chL = <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" /></svg>;
const chR = <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>;
const chD = <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>;
const chU = <svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" /></svg>;

const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();
const mondayOffset = (y, m) => (new Date(y, m, 1).getDay() + 6) % 7;
const keyOf = (d) => (d ? d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate() : 0);
const same = (a, b) => a && b && keyOf(a) === keyOf(b);

function Head({ label, hideArrows, caretUp }) {
  return (
    <div className="dp-head">
      <button className={['dp-nav', hideArrows && 'hidden'].filter(Boolean).join(' ')} aria-label="Previous">{chL}</button>
      <button className="dp-month">{label} {caretUp ? chU : chD}</button>
      <button className={['dp-nav', hideArrows && 'hidden'].filter(Boolean).join(' ')} aria-label="Next">{chR}</button>
    </div>
  );
}

export function Datepicker({
  type = 'day',        // day | range | year
  viewYear = 2022,
  viewMonth = 1,       // 0-indexed (1 = February)
  selected = new Date(2022, 1, 11),
  rangeStart = new Date(2022, 1, 11),
  rangeEnd = new Date(2022, 1, 16),
  selectedYear = 2022,
  yearBase = 2022,
  className = '',
  ...rest
}) {
  const root = ['dp', className].filter(Boolean).join(' ');

  if (type === 'year') {
    const years = [];
    for (let y = yearBase; y < yearBase + 28; y++) years.push(y);
    return (
      <div className={root} data-cal="year" {...rest}>
        <Head label={`${MONTHS[viewMonth]} ${viewYear}`} hideArrows caretUp />
        <div className="dp-years">
          {years.map((y) => (
            <button key={y} className={['dp-year', y === selectedYear && 'sel'].filter(Boolean).join(' ')}>{y}</button>
          ))}
        </div>
      </div>
    );
  }

  const off = mondayOffset(viewYear, viewMonth);
  const dim = daysIn(viewYear, viewMonth);
  const rows = Math.ceil((off + dim) / 7);
  const end = type === 'range' ? rangeEnd : null;

  const cells = [];
  for (let i = 0; i < rows * 7; i++) {
    const date = new Date(viewYear, viewMonth, i - off + 1);
    const col = i % 7;
    const out = date.getMonth() !== viewMonth;
    const cell = [];
    const day = [];
    if (out) day.push('out');
    if (type === 'day') {
      if (same(date, selected)) day.push('sel');
    } else {
      const isS = same(date, rangeStart);
      const isE = same(date, end);
      if (isS && isE) { day.push('sel'); }
      else if (isS) { day.push('sel'); if (end) { cell.push('r', 'rs'); if (col === 6) cell.push('edge-r'); } }
      else if (isE) { day.push('sel'); cell.push('r', 're'); if (col === 0) cell.push('edge-l'); }
      else if (rangeStart && end && keyOf(date) > keyOf(rangeStart) && keyOf(date) < keyOf(end)) {
        cell.push('r'); if (col === 0) cell.push('edge-l'); if (col === 6) cell.push('edge-r');
      }
    }
    cells.push(
      <div key={i} className={['dp-cell', ...cell].join(' ').trim()}>
        <button className={['dp-day', ...day].join(' ').trim()}>{date.getDate()}</button>
      </div>
    );
  }

  return (
    <div className={root} data-cal={type} {...rest}>
      <Head label={`${MONTHS[viewMonth]} ${viewYear}`} caretUp={false} />
      <div className="dp-grid">
        {WD.map((w) => (
          <div key={w} className="dp-cell"><span className="dp-wd">{w}</span></div>
        ))}
        {cells}
      </div>
    </div>
  );
}
