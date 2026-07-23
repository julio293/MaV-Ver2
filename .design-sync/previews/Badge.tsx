import { Badge } from '@mav/design-system';

export const Colors = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    <Badge color="primary">Active</Badge>
    <Badge color="red">Overdue</Badge>
    <Badge color="green">Paid</Badge>
    <Badge color="orange">Pending</Badge>
  </div>
);

export const Types = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    <Badge type="filled" color="primary">Filled</Badge>
    <Badge type="outline" color="primary">Outline</Badge>
    <Badge type="clear" color="primary">Clear</Badge>
  </div>
);

export const Variations = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    <Badge color="green" dot>Online</Badge>
    <Badge
      color="green"
      icon={
        <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 6l-9.5 9.5-5-5L1 18" />
          <path d="M17 6h6v6" />
        </svg>
      }
    >
      +12.4%
    </Badge>
    <Badge size="sm" color="primary">Small</Badge>
    <Badge size="xs" color="primary">XS</Badge>
  </div>
);
