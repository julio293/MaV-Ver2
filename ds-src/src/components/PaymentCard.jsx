/** MaV payment card — a data layer (number · holder · expiry) rides over a
 *  swappable background skin on a legibility scrim. 311×200 ISO ratio. */
export function PaymentCard({
  number = '',        // card number (spaces preserved as given)
  holder = '',        // card holder name
  expiry = '',        // expiry e.g. "09/24"
  skin,               // background image src for the skin layer
  holderLabel = 'Card holder',
  expiryLabel = 'Exp',
  className = '',
  ...rest
}) {
  const cls = ['pcard', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="pcard-skins">
        {skin && <img className="on" src={skin} alt="" />}
      </div>
      <div className="pcard-scrim"></div>
      <div className="pcard-sheen"></div>
      <div className="pcard-data">
        <div className="pcard-number">{number}</div>
        <div className="pcard-row">
          <div>
            <div className="pcard-label">{holderLabel}</div>
            <div className="pcard-holder">{holder}</div>
          </div>
          <div className="pcard-exp">
            <span className="lbl">{expiryLabel}</span>
            <span>{expiry}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
