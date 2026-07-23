/** MaV multi-line textarea — emits `.ta` + state classes from the Input Fields page. */
export function Textarea({
  state,              // focus | error | disabled  → .is-focus / .is-error / .is-disabled
  placeholder,
  value,
  disabled,
  readOnly,
  errorMessage,       // renders the `.field-err` helper row when present
  className = '',
  ...rest
}) {
  const cls = [
    'ta',
    state === 'focus' && 'is-focus',
    state === 'error' && 'is-error',
    (state === 'disabled' || disabled) && 'is-disabled',
    className,
  ].filter(Boolean).join(' ');
  return (
    <>
      <textarea
        className={cls}
        placeholder={placeholder}
        value={value}
        disabled={state === 'disabled' || disabled}
        readOnly={readOnly}
        {...rest}
      />
      {errorMessage && (
        <div className="field-err">
          <svg className="fi" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5" /><path d="M12 16.5h.01" /></svg>
          {errorMessage}
        </div>
      )}
    </>
  );
}
