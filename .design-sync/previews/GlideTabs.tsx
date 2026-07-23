import { GlideTabs } from '@mav/design-system';

export const Underline = () => (
  <div style={{ width: 520, maxWidth: '100%' }}>
    <GlideTabs items={['Overview', 'Transactions', 'Analytics', 'Settings']} active={0} />
  </div>
);
