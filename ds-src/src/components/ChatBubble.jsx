/** MaV chat message bubble — incoming (grey + avatar/name) or outgoing (tinted, ✓✓ delivery); supports short/multi-line, quoted reply and a reaction pill. */
export function ChatBubble({
  side = 'in',            // 'in' | 'out'
  text,                   // message body (or use children)
  children,
  name,                   // sender name (incoming)
  avatar,                 // avatar initial (incoming)
  time,                   // timestamp string, e.g. '09:24'
  short = false,          // inline time on one row
  delivered = false,      // show green ✓✓ (outgoing)
  reply,                  // { who, qt } quoted reply
  react,                  // reaction pill content (string or node)
  className = '',
  ...rest
}) {
  const out = side === 'out';
  const body = text ?? children;
  const check = delivered ? (
    <svg className="ccheck" viewBox="0 0 26 14"><path d="M1 8l4.5 4.5L14 3" /><path d="M12 10.5l1.5 1.5L24 3" /></svg>
  ) : null;
  const meta = <span className="cmeta">{time && <span className="ctime">{time}</span>}{check}</span>;
  const cls = ['cmsg', out ? 'out' : 'in', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {!out && avatar != null && <span className="cavatar">{avatar}</span>}
      <div className="col">
        <div className="cbubble">
          {reply && (
            <span className="cquote">
              <span className="who">{reply.who}</span>
              <span className="qt">{reply.qt}</span>
            </span>
          )}
          {name && <div className="cname">{name}</div>}
          {short ? (
            <span className="cshortrow">{body}{meta}</span>
          ) : (
            <>{body}<div className="cmeta">{time && <span className="ctime">{time}</span>}{check}</div></>
          )}
          {react != null && <span className="creact">{react}</span>}
        </div>
      </div>
    </div>
  );
}
