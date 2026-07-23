import { EmptyState } from '@mav/design-system';

export const NoResults = () => (
  <EmptyState media="illustration" title="No items were found" subtitle="Please try adjusting your search." />
);

export const StatusIcon = () => (
  <EmptyState media="icon" title="Feels so empty here" subtitle="All saved transactions will show up here." />
);

export const Loading = () => (
  <EmptyState media="loader" title="Please wait…" subtitle="We are loading your list of contacts." />
);
