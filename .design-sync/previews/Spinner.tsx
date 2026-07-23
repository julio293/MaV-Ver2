import { Spinner } from '@mav/design-system';

export const Sizes = () => (
  <div className="loader-grid">
    {(['lg', 'md', 'sm', 'xs'] as const).map((s) => (
      <div className="loader-cell" key={s}>
        <span className="loader-tag">{s}</span>
        <Spinner size={s} />
      </div>
    ))}
  </div>
);

export const InButton = () => (
  <button
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      background: 'var(--mav-primary,#352eff)', color: '#fff', border: 0,
      borderRadius: 8, padding: '12px 20px', fontWeight: 700, fontSize: 14,
    }}
  >
    <Spinner size="sm" /> Processing…
  </button>
);
