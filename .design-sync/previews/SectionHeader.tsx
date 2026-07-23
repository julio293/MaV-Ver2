import { SectionHeader } from '@mav/design-system';

const PlusIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Default = () => (
  <div style={{ width: 375, maxWidth: '100%' }}>
    <SectionHeader
      title="Recent transactions"
      description="Your last 30 days of activity."
      seeAll
    />
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: 375, maxWidth: '100%' }}>
    <SectionHeader size="lg" title="Accounts" description="All linked wallets." seeAll />
    <SectionHeader size="md" title="Savings goals" description="3 active goals." seeAll />
    <SectionHeader size="sm" title="Cards" description="2 cards on file." icon={PlusIcon} iconLabel="Add card" />
  </div>
);

export const Skeleton = () => (
  <div style={{ width: 375, maxWidth: '100%' }}>
    <SectionHeader skeleton title="Loading" description="Please wait" seeAll />
  </div>
);
