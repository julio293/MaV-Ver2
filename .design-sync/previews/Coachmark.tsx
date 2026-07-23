import { Coachmark } from '@mav/design-system';

export const Top = () => (
  <div className="blanket">
    <Coachmark placement="top" title="Find anything fast" description="Search across all your transactions here." step={1} total={4} />
  </div>
);

export const Bottom = () => (
  <div className="blanket">
    <Coachmark placement="bottom" title="Track your spend" description="Your weekly totals live here." step={2} total={4} />
  </div>
);

export const TopRight = () => (
  <div className="blanket">
    <Coachmark placement="top-right" title="Quick actions" description="Send, request, and top up in one tap." step={3} total={4} />
  </div>
);
