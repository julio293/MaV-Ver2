import { Checkbox } from '@mav/design-system';

export const States = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Checkbox />
    <Checkbox state="selected" />
    <Checkbox state="indeterminate" />
    <Checkbox state="disabled" />
  </div>
);

export const WithLabel = () => <Checkbox state="selected" label="Remember this device" />;
