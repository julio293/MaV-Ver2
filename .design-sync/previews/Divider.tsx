import { Divider } from '@mav/design-system';

export const Horizontal = () => (
  <div style={{ width: 420, maxWidth: '100%' }}>
    <Divider />
  </div>
);

export const Vertical = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 48,
    fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
    <span>Overview</span>
    <Divider orientation="vertical" />
    <span>Activity</span>
    <Divider orientation="vertical" />
    <span>Settings</span>
  </div>
);
