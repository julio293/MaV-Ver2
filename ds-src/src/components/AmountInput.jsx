/** MaV "enter amount" screen — stepper amount field, preset chips, nominal slider card + dock. */
export function AmountInput({
  title = 'Enter amount',
  amountLabel = 'Amount of Money',
  amount = '$150',
  presets = ['$50', '$100', '$150', '$200', '$250', '$300', '$350', '$400', '$450'],
  selectedPreset = '$150',
  sliderTitle = 'Set the nominal send',
  nominal = '$150',
  sliderValue = 150,
  sliderMin = 0,
  sliderMax = 500,
  sliderStep = 10,
  ctaLabel = 'Continue',
  className = '',
  ...rest
}) {
  return (
    <div className={['phone', className].filter(Boolean).join(' ')} {...rest}>
      <div className="statusbar">
        <span>9:41</span>
        <svg width="52" height="12" viewBox="0 0 52 12"><rect x="0" y="7" width="3" height="5" rx="1" /><rect x="5" y="4" width="3" height="8" rx="1" /><rect x="10" y="2" width="3" height="10" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /><rect x="30" y="1" width="20" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" /><rect x="32" y="3" width="15" height="6" rx="1" /></svg>
      </div>
      <div className="topnav">
        <div className="nav-ic"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" /></svg></div>
        <div className="nav-title">{title}</div>
        <div style={{ width: 32 }} />
      </div>
      <div className="body">
        <div>
          <div className="amt-title">{amountLabel}</div>
          <div className="amt-row">
            <button className="amt-btn"><svg viewBox="0 0 24 24"><path d="M5 12h14" /></svg></button>
            <div className="amt-value mav-num">{amount}</div>
            <button className="amt-btn"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg></button>
          </div>
        </div>
        <div className="chips">
          {presets.map((p) => (
            <button key={p} className={['chip', p === selectedPreset && 'on'].filter(Boolean).join(' ')}>{p}</button>
          ))}
        </div>
        <div className="slider-card">
          <div className="sc-title">{sliderTitle}</div>
          <div className="sc-row">
            <button className="sc-btn"><svg viewBox="0 0 24 24"><path d="M5 12h14" /></svg></button>
            <div className="sc-amt">{nominal}</div>
            <button className="sc-btn solid"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg></button>
          </div>
          <input type="range" className="slider" min={sliderMin} max={sliderMax} step={sliderStep} defaultValue={sliderValue} />
        </div>
      </div>
      <div className="dock">
        <button className="btn-dock">{ctaLabel}</button>
        <div className="home-ind" />
      </div>
    </div>
  );
}
