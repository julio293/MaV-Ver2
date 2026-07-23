/** MaV input field — emits `.field` + size/state classes from the Input Fields page. */
export function TextField({
  size,               // sm | lg  (default md)
  state,              // filled | focus | error | disabled  → .is-filled / .is-focus / .is-error / .is-disabled
  placeholder,
  value,
  type = 'text',
  disabled,
  leadingIcon,        // React node rendered before the input
  trailingIcon,       // React node rendered after the input
  prefix,             // leading text chunk (e.g. "https://") + divider line
  errorMessage,       // renders the `.field-err` helper row when present
  inputProps = {},
  className = '',
  ...rest
}) {
  const cls = [
    'field',
    size && `field-${size}`,
    state === 'filled' && 'is-filled',
    state === 'focus' && 'is-focus',
    state === 'error' && 'is-error',
    (state === 'disabled' || disabled) && 'is-disabled',
    className,
  ].filter(Boolean).join(' ');
  return (
    <>
      <div className={cls} {...rest}>
        {leadingIcon}
        {prefix && (
          <>
            <span className="field-prefix">{prefix}</span>
            <span className="field-vline" />
          </>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={state === 'disabled' || disabled}
          {...inputProps}
        />
        {trailingIcon}
      </div>
      {errorMessage && (
        <div className="field-err">
          <svg className="fi" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5" /><path d="M12 16.5h.01" /></svg>
          {errorMessage}
        </div>
      )}
    </>
  );
}
