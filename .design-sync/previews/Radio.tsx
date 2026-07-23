import { Radio } from '@mav/design-system';

export const States = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Radio />
    <Radio state="active" />
    <Radio state="disabled" />
  </div>
);

export const Options = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <Radio state="active" label="Standard account" />
    <Radio label="Savings account" />
  </div>
);
