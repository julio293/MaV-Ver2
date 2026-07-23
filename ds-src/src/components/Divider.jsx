/** MaV divider — a 1px rule separating content. Horizontal renders as an <hr>;
 *  vertical renders as a <div> that fills its row height. */
export function Divider({
  orientation = 'horizontal',  // horizontal | vertical
  className = '',
  ...rest
}) {
  const vertical = orientation === 'vertical';
  const cls = ['dv', vertical ? 'dv-v' : 'dv-h', className].filter(Boolean).join(' ');
  if (vertical) {
    return <div className={cls} role="separator" aria-orientation="vertical" {...rest} />;
  }
  return <hr className={cls} role="separator" aria-orientation="horizontal" {...rest} />;
}
