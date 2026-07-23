/** MaV OTP code-entry group — emits `.otp-group` of boxed (`.otp`) or boxless (`.otp2`) slots. */
export function OtpInput({
  variant = 'boxed',    // boxed | boxless
  length = 6,
  value = '',           // digits to display; blanks show placeholder
  state,                // filled | focus | error | disabled  (applied per non-empty slot)
  focusIndex,           // index of the slot to mark `.is-focus` (entering)
  errorMessage,         // renders the `.otp-err-msg` row below the group
  className = '',
  ...rest
}) {
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');
  const boxless = variant === 'boxless';

  function slotClass(i, hasDigit) {
    const c = [boxless ? 'otp2' : 'otp'];
    if (i === focusIndex) c.push('is-focus');
    else if (state === 'error') c.push('error');
    else if (state === 'disabled') c.push('disabled');
    else if (state === 'filled' || hasDigit) c.push('filled');
    return c.join(' ');
  }

  return (
    <>
      <div className={['otp-group', className].filter(Boolean).join(' ')} {...rest}>
        {digits.map((d, i) => {
          const hasDigit = d !== '';
          const display = boxless ? (hasDigit ? d : '0') : d;
          return boxless ? (
            <div key={i} className={slotClass(i, hasDigit)}>
              <span className="d">{display}</span>
              <span className="u" />
            </div>
          ) : (
            <div key={i} className={slotClass(i, hasDigit)}>{display}</div>
          );
        })}
      </div>
      {errorMessage && (
        <div className="otp-err-msg">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5" /><path d="M12 16.5h.01" /></svg>
          {errorMessage}
        </div>
      )}
    </>
  );
}
