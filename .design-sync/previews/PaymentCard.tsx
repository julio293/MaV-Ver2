import { PaymentCard } from '@mav/design-system';

export const Default = () => (
  <div className="cardx-stage" style={{ width: 400, maxWidth: '100%' }}>
    <PaymentCard
      number="6037 9975 9598 3090"
      holder="Julio Santos"
      expiry="09/24"
    />
  </div>
);

export const AnotherHolder = () => (
  <div className="cardx-stage" style={{ width: 400, maxWidth: '100%' }}>
    <PaymentCard
      number="4539 1488 0343 6467"
      holder="Amara Okafor"
      expiry="11/27"
    />
  </div>
);
