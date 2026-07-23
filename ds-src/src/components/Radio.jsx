/** MaV radio — emits the `.rdo` ring (+ state). With `label`, wraps in a `.rdo-field` row. */
export function Radio({
  state,              // active | focus | disabled  → .is-active / .is-focus / .is-disabled
  label,
  className = '',
  ...rest
}) {
  const ringCls = [
    'rdo',
    state === 'active' && 'is-active',
    state === 'focus' && 'is-focus',
    state === 'disabled' && 'is-disabled',
    !label && className,
  ].filter(Boolean).join(' ');

  const ring = <span className={ringCls} {...(label ? {} : rest)} />;

  if (!label) return ring;

  const fieldCls = ['rdo-field', className].filter(Boolean).join(' ');
  return (
    <label className={fieldCls} {...rest}>
      <span className={ringCls} />
      <span className="nm">{label}</span>
    </label>
  );
}
