import { Alert } from '@mav/design-system';

export const Primary = () => (
  <Alert variant="primary" title="Heads up" actions={[{ label: 'Details' }, { label: 'Dismiss' }]}>
    Your statement for June is ready to view.
  </Alert>
);

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 460, maxWidth: '100%' }}>
    <Alert variant="success" title="Payment sent">Rp 9,998 was transferred successfully.</Alert>
    <Alert variant="danger" title="Transaction failed">Insufficient balance in your wallet.</Alert>
    <Alert variant="warning" title="Session expiring">You will be signed out in 2 minutes.</Alert>
  </div>
);

export const Compact = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 460, maxWidth: '100%' }}>
    <Alert variant="success">Your profile has been updated.</Alert>
    <Alert variant="danger">Please enter a valid email address.</Alert>
  </div>
);
