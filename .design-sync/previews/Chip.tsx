import { Chip } from '@mav/design-system';

export const Colors = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    <Chip color="primary">Groceries</Chip>
    <Chip color="red">Overdue</Chip>
    <Chip color="green">Savings</Chip>
    <Chip color="orange">Travel</Chip>
    <Chip color="grey">Utilities</Chip>
    <Chip color="white">Rent</Chip>
  </div>
);

export const Types = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    <Chip type="filled" color="primary">Filled</Chip>
    <Chip type="outline" color="primary">Outline</Chip>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    <Chip size="md" color="primary">Medium</Chip>
    <Chip size="sm" color="primary">Small</Chip>
    <Chip size="xs" color="primary">Extra small</Chip>
  </div>
);
