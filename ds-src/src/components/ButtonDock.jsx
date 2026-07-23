/** MaV sticky bottom footer — rounded-top surface with a full-width primary button, optional consent checkbox / secondary button, and iOS home indicator. */

const CheckIcon = () => <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>;

export function ButtonDock({
  primary = 'Continue',
  secondary,                 // optional secondary button label
  checkbox,                  // optional React node / string for the consent row
  checked = true,            // static checkbox state
  homeIndicator = true,
  className = '',
  children,                  // override inner content entirely if provided
  ...rest
}) {
  const cls = ['dock', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="dock-inner">
        {children ? children : (
          <>
            {checkbox && (
              <label className="dock-cbx">
                <span className={'cbx' + (checked ? ' on' : '')}><CheckIcon /></span>
                <span>{checkbox}</span>
              </label>
            )}
            {secondary ? (
              <div className="dock-btns">
                <button className="dock-btn">{primary}</button>
                <button className="dock-btn secondary">{secondary}</button>
              </div>
            ) : (
              <button className="dock-btn">{primary}</button>
            )}
          </>
        )}
      </div>
      {homeIndicator && <div className="home-ind" />}
    </div>
  );
}
