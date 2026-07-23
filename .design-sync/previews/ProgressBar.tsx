import { ProgressBar } from '@mav/design-system';

export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 504 }}>
    {[0, 20, 40, 60, 80, 100].map((v) => (
      <div key={v} className="pbar-row">
        <span className="pbar-label">{v}%</span>
        <ProgressBar value={v} />
      </div>
    ))}
    <div className="pbar-row">
      <span className="pbar-label">Disabled</span>
      <ProgressBar disabled />
    </div>
  </div>
);

export const WithLabel = () => (
  <div className="pbar-row" style={{ maxWidth: 504 }}>
    <ProgressBar value={50} />
    <span className="pbar-label right" style={{ minWidth: 40 }}>50%</span>
  </div>
);
