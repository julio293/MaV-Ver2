import { Icon } from '../icons.jsx';

/**
 * MaV primary action button. Emits `.mav-btn` + variant/size classes verbatim
 * from the Buttons page. Drives radius 4px, Medium 500 weight, 20px icons.
 */
export function Button({
  variant = 'primary',   // primary | secondary | clear | swipe
  size,                  // xs | sm | lg  (default md)
  iconOnly = false,
  leadingIcon,           // icon name (e.g. "plus") rendered before the label
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'mav-btn',
    `mav-btn-${variant}`,
    size && `mav-btn-${size}`,
    iconOnly && 'mav-btn-icononly',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {leadingIcon && <Icon name={leadingIcon} />}
      {children}
    </button>
  );
}
