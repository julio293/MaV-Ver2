/**
 * MaV onboarding coachmark — a dashed pointer + dot connecting to a target, with
 * white title / description / step counter. Six pointer appearances: top,
 * top-left, top-right, bottom, bottom-left, bottom-right.
 */
const POINTERS = {
  top:          { w: 12,  h: 44, viewBox: '0 0 12 44',  d: 'M6 42V4',      cx: 6,   cy: 42, full: false },
  'top-left':   { w: 240, h: 60, viewBox: '0 0 240 60', d: 'M120 56V22H8',   cx: 120, cy: 56, full: true },
  'top-right':  { w: 240, h: 60, viewBox: '0 0 240 60', d: 'M120 56V22H232', cx: 120, cy: 56, full: true },
  bottom:       { w: 12,  h: 44, viewBox: '0 0 12 44',  d: 'M6 2V40',       cx: 6,   cy: 2,  full: false },
  'bottom-left':  { w: 240, h: 60, viewBox: '0 0 240 60', d: 'M120 4V38H8',   cx: 120, cy: 4, full: true },
  'bottom-right': { w: 240, h: 60, viewBox: '0 0 240 60', d: 'M120 4V38H232', cx: 120, cy: 4, full: true },
};

function Pointer({ placement }) {
  const p = POINTERS[placement] || POINTERS.top;
  return (
    <div className="coach-ptr" style={p.full ? { width: '100%' } : undefined}>
      <svg width={p.w} height={p.h} viewBox={p.viewBox}>
        <path d={p.d} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx={p.cx} cy={p.cy} r="5" fill="currentColor" />
      </svg>
    </div>
  );
}

export function Coachmark({
  placement = 'top',
  title = 'Coach Mark Title',
  description = 'Coach mark description',
  step = 1,
  total = 5,
  className = '',
  ...rest
}) {
  const cls = ['coach', className].filter(Boolean).join(' ');
  const pointerFirst = placement.startsWith('top');
  const text = (
    <div className="coach-txt">
      <span className="coach-title">{title}</span>
      <span className="coach-desc">{description}</span>
      <span className="coach-step">( {step} / {total} )</span>
    </div>
  );
  return (
    <div className={cls} {...rest}>
      {pointerFirst ? (
        <>
          <Pointer placement={placement} />
          {text}
        </>
      ) : (
        <>
          {text}
          <Pointer placement={placement} />
        </>
      )}
    </div>
  );
}
