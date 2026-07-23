import { Breadcrumb } from '@mav/design-system';

export const Default = () => (
  <div style={{ width: 460, maxWidth: '100%' }}>
    <Breadcrumb crumbs={['Home', 'Wallet', 'Transfer']} title="Send Money" />
  </div>
);
