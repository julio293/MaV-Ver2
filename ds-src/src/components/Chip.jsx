/** MaV chip — a compact, dismissible tag. Filled / outline type, six colors,
 *  three sizes, with a trailing close icon. */
export function Chip({
  color = 'primary',   // primary | red | green | orange | grey | white
  type = 'filled',     // filled | outline
  size = 'md',         // md | sm | xs
  onClose,             // optional dismiss handler
  showClose = true,    // render the trailing close icon
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'chip',
    size !== 'md' && `chip-${size}`,
    type === 'outline' && 'chip-outline',
    `chip-${color}`,
    className,
  ].filter(Boolean).join(' ');
  return (
    <span className={cls} onClick={onClose} {...rest}>
      {children}
      {showClose && (
        <svg
          className="chip-close"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      )}
    </span>
  );
}
