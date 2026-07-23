import { Toggle } from '@mav/design-system';

export const States = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Toggle />
    <Toggle on />
  </div>
);

export const WithLabel = () => <Toggle on label="Enable notifications" />;
