/** MaV centred empty / status state — optional media (illustration | icon | loader) above a title + subtitle, for search or contacts panels. */
export function EmptyState({
  media,          // 'illustration' | 'icon' | 'loader' | 'none'
  icon,           // custom icon node (overrides default check for media='icon')
  title,
  subtitle,
  children,
  className = '',
  ...rest
}) {
  const cls = ['empty', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {media === 'illustration' && (
        <svg className="empty-illus" viewBox="0 0 150 120" fill="none">
          <ellipse cx="75" cy="104" rx="52" ry="9" fill="#352eff" opacity=".08" />
          <path d="M40 58l35-20 35 20-35 20z" fill="#c7d0ff" />
          <path d="M40 58v26l35 20V78z" fill="#8ea2ff" />
          <path d="M110 58v26l-35 20V78z" fill="#5b74f0" />
          <rect x="60" y="60" width="8" height="8" rx="1" fill="#fff" opacity=".8" />
          <rect x="82" y="60" width="8" height="8" rx="1" fill="#fff" opacity=".55" />
          <path d="M63 30h24v10H63z" fill="#352eff" />
        </svg>
      )}
      {media === 'icon' && (
        <span className="empty-icon">
          {icon ?? <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg>}
        </span>
      )}
      {media === 'loader' && <span className="empty-loader" />}
      {title && <span className="empty-title">{title}</span>}
      {(subtitle ?? children) && <span className="empty-sub">{subtitle ?? children}</span>}
    </div>
  );
}
