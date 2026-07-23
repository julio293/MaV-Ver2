/** MaV search field — emits `.srch` with a leading magnifier + optional label / clear / error. */
export function SearchField({
  state,              // focus | error  → .is-focus / .is-error
  label,              // `.fc-flabel` above the field
  placeholder = 'Search…',
  value,
  clearable = false,  // render the `×` clear affordance
  errorMessage,       // `.fc-err` below the field
  className = '',
  ...rest
}) {
  const srchCls = [
    'srch',
    state === 'focus' && 'is-focus',
    state === 'error' && 'is-error',
  ].filter(Boolean).join(' ');

  const field = (
    <>
      <div className={srchCls} {...(label ? {} : rest)}>
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        <input placeholder={placeholder} value={value} />
        {clearable && <span className="clear">×</span>}
      </div>
      {errorMessage && <span className="fc-err">{errorMessage}</span>}
    </>
  );

  if (!label) return <div className={['fc-field', className].filter(Boolean).join(' ')}>{field}</div>;

  return (
    <div className={['fc-field', className].filter(Boolean).join(' ')} {...rest}>
      <span className="fc-flabel">{label}</span>
      {field}
    </div>
  );
}
