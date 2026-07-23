/** MaV message composer — emits `.msg` textarea + toolbar (attach/emoji/mention + send). */
export function MessageInput({
  state,              // focus | error | disabled  → .is-focus / .is-error / .is-disabled
  placeholder = 'Your message…',
  value,
  rows = 2,
  sendEnabled = false,
  disabled,
  className = '',
  ...rest
}) {
  const cls = [
    'msg',
    state === 'focus' && 'is-focus',
    state === 'error' && 'is-error',
    (state === 'disabled' || disabled) && 'is-disabled',
    className,
  ].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <textarea className="msg-text" rows={rows} placeholder={placeholder} value={value} disabled={state === 'disabled' || disabled} />
      <div className="msg-bar">
        <div className="msg-tools">
          <button className="msg-icon" title="Attach"><svg className="fi" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg></button>
          <span className="msg-vline" />
          <button className="msg-icon" title="Emoji"><svg className="fi" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M8 14.5s1.5 2 4 2 4-2 4-2" /><path d="M9 9.5h.01M15 9.5h.01" /></svg></button>
          <button className="msg-icon" title="Mention"><svg className="fi" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" /></svg></button>
        </div>
        <button className={['msg-send', sendEnabled && 'on'].filter(Boolean).join(' ')} title="Send">
          <svg className="fi" viewBox="0 0 24 24"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" /></svg>
        </button>
      </div>
    </div>
  );
}
