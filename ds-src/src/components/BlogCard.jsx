/** MaV Blog Card — full-bleed hero image, primary badge, date, two-line title and a "Read more ›" affordance, with an Active/Read state. */
export function BlogCard({
  badge = 'Course',
  date,
  title,
  image,          // hero image src
  read = false,   // Read (desaturated / muted) state
  moreLabel = 'Read more',
  className = '',
  ...rest
}) {
  const cls = ['blog-card', read && 'read', className].filter(Boolean).join(' ');
  return (
    <button className={cls} type="button" {...rest}>
      <div className="thumb"><img src={image} alt="" /></div>
      <span className="blog-badge">{badge}</span>
      <span className="blog-check">
        <svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-11" /></svg>
      </span>
      <div className="body">
        <p className="blog-date">{date} ・</p>
        <div className="sh"><h4 className="blog-title">{title}</h4></div>
        <span className="blog-more">{moreLabel}
          <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
        </span>
      </div>
    </button>
  );
}
