/** MaV toggle — emits the `.tgl` 44×24 pill (+ on/state). With `label`, wraps in `.tgl-field`. */
export function Toggle({
  on = false,
  state,              // hover | focus | disabled  → .is-hover / .is-focus / .is-disabled
  label,
  textLeft = false,   // place the label on the left (.text-left)
  className = '',
  ...rest
}) {
  const pillCls = [
    'tgl',
    on && 'on',
    state === 'hover' && 'is-hover',
    state === 'focus' && 'is-focus',
    state === 'disabled' && 'is-disabled',
    !label && className,
  ].filter(Boolean).join(' ');

  const pill = <button type="button" className={pillCls} {...(label ? {} : rest)} />;

  if (!label) return pill;

  const fieldCls = ['tgl-field', textLeft && 'text-left', className].filter(Boolean).join(' ');
  return (
    <label className={fieldCls} {...rest}>
      <span className={pillCls} />
      <span className="nm">{label}</span>
    </label>
  );
}
