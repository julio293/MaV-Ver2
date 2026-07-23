import { CashflowCard } from '@mav/design-system';

export const Main = () => (
  <div style={{ width: 361, maxWidth: '100%' }}>
    <CashflowCard tab="Main" amount="$82,758.10" income="+$20.000" expense="−$5.200" />
  </div>
);

export const Secondary = () => (
  <div style={{ width: 361, maxWidth: '100%' }}>
    <CashflowCard tab="Secondary" amount="$12,340.55" income="+$6.400" expense="−$2.100" />
  </div>
);
