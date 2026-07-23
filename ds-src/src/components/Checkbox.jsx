/** MaV checkbox — emits `.cbx` box (+ state). With `label`, wraps in a `.cbx-field` row. */
export function Checkbox({
  state,              // focus | selected | indeterminate | disabled
  label,
  textLeft = false,   // place the label on the left (.text-left)
  className = '',
  ...rest
}) {
  const boxCls = [
    'cbx',
    state === 'focus' && 'is-focus',
    state === 'selected' && 'is-selected',
    state === 'indeterminate' && 'is-indeterminate',
    state === 'disabled' && 'is-disabled',
    !label && className,
  ].filter(Boolean).join(' ');

  const box = (
    <span className={boxCls} {...(label ? {} : rest)}>
      <svg className="cb-check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
      <svg className="cb-minus" viewBox="0 0 24 24"><path d="M5 12h14" /></svg>
    </span>
  );

  if (!label) return box;

  const fieldCls = ['cbx-field', textLeft && 'text-left', className].filter(Boolean).join(' ');
  return (
    <label className={fieldCls} {...rest}>
      {box}
      <span className="nm">{label}</span>
    </label>
  );
}
