/** MaV avatar. Image or text initials, seven sizes, rounded/squared shape,
 *  three initial-color themes, and an optional online status dot. */
export function Avatar({
  size = 'md',        // 3xl | 2xl | xl | lg | md | sm | xs (or a number/px string)
  shape = 'rounded',  // rounded | squared
  color,              // grey | primary | red (text/initials variant)
  src,                // image source (takes precedence over initials)
  alt = '',
  initials,           // fallback text initials
  status = false,     // show online status dot
  className = '',
  style,
  ...rest
}) {
  const SIZE_MAP = { '3xl': 96, '2xl': 80, xl: 64, lg: 48, md: 40, sm: 32, xs: 24 };
  const px = typeof size === 'number' ? `${size}px`
    : SIZE_MAP[size] != null ? `${SIZE_MAP[size]}px`
    : size;
  const cls = ['avatar', shape, color && `avatar-${color}`, className].filter(Boolean).join(' ');
  return (
    <span className={cls} style={{ '--sz': px, ...style }} {...rest}>
      {src
        ? <img src={src} alt={alt} />
        : <span className="avatar-inner">{initials}</span>}
      {status && <span className="avatar-status"></span>}
    </span>
  );
}

/** Avatar + name label stacked vertically (Figma "Profile"). */
export function AvatarProfile({ name, className = '', children, ...rest }) {
  const cls = ['profile', className].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {children}
      <span className="name">{name}</span>
    </span>
  );
}

/** Overlapping avatar group with an optional "+N" overflow chip. */
export function AvatarStack({ size = 48, more, className = '', style, children, ...rest }) {
  const px = typeof size === 'number' ? `${size}px` : size;
  const cls = ['avatar-stack', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ '--sz': px, ...style }} {...rest}>
      {children}
      {more != null && <span className="avatar-more">{more}</span>}
    </div>
  );
}
