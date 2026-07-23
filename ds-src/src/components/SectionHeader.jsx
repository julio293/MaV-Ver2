/** MaV section header — a titled row that opens a section. Title (+ optional
 *  description) with an optional trailing "See all" link or icon button.
 *  Three sizes, left/center alignment, default/subtle/inverted appearance,
 *  and a skeleton loading state. */
export function SectionHeader({
  title,
  description,
  size = 'md',          // lg | md | sm
  align = 'left',       // left | center
  appearance,           // subtle | inverted (default omitted)
  skeleton = false,
  seeAll,               // "See all" text button: string label or true
  onSeeAll,
  icon,                 // trailing icon node (inline svg) → renders an icon button
  onIconClick,
  iconLabel = 'Action',
  className = '',
  ...rest
}) {
  const cls = [
    'sh',
    size,
    align === 'center' && 'center',
    appearance,
    skeleton && 'skeleton',
    className,
  ].filter(Boolean).join(' ');

  let trailing = null;
  if (seeAll) {
    trailing = (
      <button className="sh-link" onClick={onSeeAll}>
        {typeof seeAll === 'string' ? seeAll : 'See all'}
      </button>
    );
  } else if (icon) {
    trailing = (
      <button className="sh-ico" aria-label={iconLabel} onClick={onIconClick}>
        {icon}
      </button>
    );
  }

  return (
    <div className={cls} {...rest}>
      <div className="sh-main">
        <p className="sh-title">{title}</p>
        {description != null && <p className="sh-desc">{description}</p>}
      </div>
      {trailing}
    </div>
  );
}
