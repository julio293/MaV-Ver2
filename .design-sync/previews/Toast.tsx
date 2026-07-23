import { Toast } from '@mav/design-system';

export const Success = () => (
  <Toast status="success" title="Transfer complete" description="Rp 50,000 sent to James K." action="View" />
);

export const Statuses = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Toast status="success" title="Transfer complete" description="Rp 50,000 sent to James K." action="View" />
    <Toast status="error" title="Transaction failed" description="Insufficient funds in account" action="Retry" />
    <Toast status="info" title="OTP sent" description="Check your SMS for the code" />
  </div>
);

export const Light = () => (
  <Toast light status="success" title="Profile saved" description="Your changes have been applied" action="Undo" />
);
