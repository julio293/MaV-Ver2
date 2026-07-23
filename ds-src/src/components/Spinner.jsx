/** MaV comet spinner (loader) — CSS-only ring in --loader/spin. Sizes lg / md / sm / xs. */
export function Spinner({ size = 'lg', className = '', ...rest }) {
  const cls = ['loader', `loader-${size}`, className].filter(Boolean).join(' ');
  return <span className={cls} {...rest} />;
}
