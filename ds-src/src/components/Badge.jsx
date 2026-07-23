/** MaV badge — labels and categorises information. Filled / outline / clear
 *  type, four colors, three sizes, with an optional leading dot or icon. */
export function Badge({
  color = 'primary',   // primary | red | green | orange
  type = 'filled',     // filled | outline | clear
  size = 'md',         // md | sm | xs
  dot = false,         // leading colored dot
  icon,                // optional leading icon node (inline svg)
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'b',
    size !== 'md' && `b-${size}`,
    type === 'outline' && 'b-outline',
    type === 'clear' && 'b-clear',
    `b-${color}`,
    className,
  ].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {dot && <span className="b-dot"></span>}
      {icon}
      {children}
    </span>
  );
}
