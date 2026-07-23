/** MaV progress stepper — circle + label per step, connectors between. Each step is done | active | todo. */
export function Stepper({ steps = [], active = 0, className = '', ...rest }) {
  const cls = ['step-row', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {steps.map((s, i) => {
        const label = typeof s === 'string' ? s : s.label;
        const state = i < active ? 'done' : i === active ? 'active' : 'todo';
        return (
          <div key={i} style={{ display: 'contents' }}>
            <div className="step-item">
              <div className={'step-circle step-' + state}>{state === 'done' ? '✓' : i + 1}</div>
              <span className={'step-lbl' + (state === 'active' ? ' on' : '')}>{label}</span>
            </div>
            {i < steps.length - 1 && <div className={'step-conn' + (i < active ? ' done' : '')} />}
          </div>
        );
      })}
    </div>
  );
}
