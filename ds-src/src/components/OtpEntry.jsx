/** MaV OTP verification entry — header (title + description), six code slots, a reset countdown with Resend, and a Verify button that enables when complete. */
export function OtpEntry({
  title = 'One time PIN',
  description,          // node, e.g. Please enter the OTP sent to <b>+1 223 …</b>
  code = '',           // current entered digits, e.g. '123'
  length = 6,
  timer = '00:32',
  resendLabel = 'Resend Code',
  resendDisabled = true,
  verifyLabel = 'Verify',
  className = '',
  ...rest
}) {
  const digits = Array.from({ length }, (_, i) => code[i] ?? '');
  const complete = code.length === length;
  const cls = ['screen', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="otp-header">
        <div className="otp-title">{title}</div>
        {description && <div className="otp-desc">{description}</div>}
      </div>
      <div className="otp-field">
        <div className="otp-slots">
          {digits.map((d, i) => (
            <input
              key={i}
              className={['otp', d !== '' && 'filled'].filter(Boolean).join(' ')}
              value={d}
              readOnly
            />
          ))}
        </div>
        <div className="otp-resend">
          <div className="otp-timer"><span className="lbl">Reset in</span><span className="t">{timer}</span></div>
          <button className="otp-resend-btn" disabled={resendDisabled}>{resendLabel}</button>
        </div>
      </div>
      <button className={['verify', complete && 'on'].filter(Boolean).join(' ')}>{verifyLabel}</button>
    </div>
  );
}
