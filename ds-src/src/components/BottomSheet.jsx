/** MaV bottom sheet — a drawer rising over a dimmed blanket inside a phone frame. Nav or button header, scrollable body, optional dock / keyboard / home indicator. Rendered in a static open state. */

const ArrowL = () => <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg>;
const XIco = () => <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>;

const KEYS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const Keyboard = () => (
  <div className="bs-kbd">
    <div className="accessory"><button className="done" data-kbd="done">Done</button></div>
    <div className="bs-krow">
      {KEYS[0].map((k) => <button key={k} className="bs-key" data-k={k}>{k}</button>)}
    </div>
    <div className="bs-krow pad">
      {KEYS[1].map((k) => <button key={k} className="bs-key" data-k={k}>{k}</button>)}
    </div>
    <div className="bs-krow">
      <button className="bs-key fn wide">⇧</button>
      {KEYS[2].map((k) => <button key={k} className="bs-key" data-k={k}>{k}</button>)}
      <button className="bs-key fn wide" data-kbd="back">⌫</button>
    </div>
    <div className="bs-krow">
      <button className="bs-key fn wide">123</button>
      <button className="bs-key fn">🌐</button>
      <button className="bs-key space" data-k=" ">space</button>
      <button className="bs-key fn wide" data-kbd="done">return</button>
    </div>
  </div>
);

const FauxApp = ({ heading = 'Documents', sub = 'Tap an item to preview' }) => (
  <div className="bs-app">
    <div className="bs-status"><span>9:41</span><span className="dots"><i /></span></div>
    <h4>{heading}</h4>
    <p className="sub">{sub}</p>
    <div className="bs-rows">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bs-rowi"><span className="ic" /><span className="ln"><b /><s /></span></div>
      ))}
    </div>
  </div>
);

export function BottomSheet({
  header = 'nav',       // 'nav' (back · title · close) | 'button' (title + text action)
  title = 'Title',
  actionLabel = 'Button',
  dock = false,
  dockLabel = 'Button',
  keyboard = false,
  homeIndicator = true,
  open = true,
  children,             // body content; defaults to lorem paragraphs
  className = '',
  ...rest
}) {
  const cls = ['phone', open && 'open', className].filter(Boolean).join(' ');
  const body = keyboard ? (
    <div className="bs-body">
      <h5>{title}</h5>
      <input className="bs-field" placeholder="Type a message…" data-field readOnly />
      <p>Lorem ipsum dolor sit amet consectetur. Aenean aenean mauris ultricies ullamcorper dui enim mauris pulvinar lacus.</p>
    </div>
  ) : (
    <div className="bs-body">
      {children || (
        <>
          <h5>{title}</h5>
          <p>Lorem ipsum dolor sit amet consectetur. Aenean aenean mauris ultricies ullamcorper dui enim mauris pulvinar lacus. Donec convallis lorem non aliquam in quam semper vitae sed.</p>
          <p>Egestas ac in augue risus tincidunt mauris. Massa nunc integer facilisis nisi varius nulla. Fusce a convallis sit in purus quam rhoncus nibh mauris.</p>
          <p>Euismod ut pellentesque lorem enim non viverra. Eget arcu ullamcorper curabitur commodo eu semper aliquam eu.</p>
        </>
      )}
    </div>
  );

  return (
    <div className={cls} {...rest}>
      <div className="phone-screen">
        <FauxApp />
        <div className="bs-blanket" data-close />
        <div className="bs-sheet">
          {header === 'button' ? (
            <div className="bs-head">
              <span className="bs-icon ghost" />
              <span className="ttl">{title}</span>
              <button className="bs-textbtn" data-close>{actionLabel}</button>
            </div>
          ) : (
            <div className="bs-head">
              <button className="bs-icon" data-close aria-label="Back"><ArrowL /></button>
              <span className="ttl">{title}</span>
              <button className="bs-icon" data-close aria-label="Close"><XIco /></button>
            </div>
          )}
          {body}
          {keyboard ? (
            <Keyboard />
          ) : dock ? (
            <>
              <div className="bs-dock"><button className="bs-primary">{dockLabel}</button></div>
              {homeIndicator && <div className="bs-home"><span /></div>}
            </>
          ) : (
            homeIndicator && <div className="bs-home"><span /></div>
          )}
        </div>
      </div>
    </div>
  );
}
