import { Button } from '@mav/design-system';

export const Primary = () => <Button variant="primary">Send money</Button>;

export const Secondary = () => <Button variant="secondary">Request</Button>;

export const Variants = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="clear">Clear</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button size="sm">Small</Button>
    <Button>Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const WithIcon = () => <Button variant="primary" leadingIcon="plus">Top up</Button>;
