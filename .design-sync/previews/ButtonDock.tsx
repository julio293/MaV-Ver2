import { ButtonDock } from '@mav/design-system';

const frame = { width: 390, maxWidth: '100%', border: '1px solid #efefef', borderRadius: 16, overflow: 'hidden' as const };

export const Primary = () => <div style={frame}><ButtonDock primary="Continue" /></div>;

export const WithConsent = () => (
  <div style={frame}><ButtonDock primary="Agree & Continue" checkbox="I accept the terms and privacy policy" /></div>
);

export const Pair = () => <div style={frame}><ButtonDock primary="Confirm" secondary="Cancel" /></div>;
