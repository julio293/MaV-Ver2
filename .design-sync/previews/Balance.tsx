import { Balance } from '@mav/design-system';

export const Default = () => (
  <div style={{ width: 375, maxWidth: '100%' }}>
    <Balance label="Available balance" amount="$82,758.10" trend="+24% this month" />
  </div>
);

export const WithoutActions = () => (
  <div style={{ width: 375, maxWidth: '100%' }}>
    <Balance label="Total savings" amount="$12,340.55" trend="+8% this month" actions={false} />
  </div>
);
