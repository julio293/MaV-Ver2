import { AppBar } from '@mav/design-system';

export const Default = () => (
  <div style={{ width: 390, maxWidth: '100%' }}><AppBar title="Send Money" actions={['more']} /></div>
);

export const WithClose = () => (
  <div style={{ width: 390, maxWidth: '100%' }}><AppBar title="Payment details" actions={['close']} bordered /></div>
);
