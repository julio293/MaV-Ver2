/** MaV determinate progress bar — 6px track (--brand/primary/200), fill (--shade/primary/900), 8px radius. */
export function ProgressBar({ value = 60, disabled = false, className = '', ...rest }) {
  const cls = ['pbar', disabled ? 'is-disabled' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {!disabled && <div className="pbar-fill" style={{ width: `${value}%` }} />}
    </div>
  );
}
