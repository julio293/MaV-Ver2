import { BalanceCard } from '@mav/design-system';

export const Available = () => (
  <BalanceCard
    label="Available Balance"
    amount="₦ 284,500"
    amountFraction=".00"
    sub="Last updated: just now"
    actions={[
      { label: 'Add Money', icon: 'plus' },
      { label: 'Send', icon: 'arrow-left' },
      { label: 'History', icon: 'clock' },
    ]}
  />
);

export const Savings = () => (
  <BalanceCard
    dark
    label="Savings"
    amount="₦ 120,000"
    amountFraction=""
    sub="+₦5,000 this month"
    actions={[
      { label: 'Deposit', icon: 'plus' },
      { label: 'Withdraw', icon: 'arrow-right' },
    ]}
  />
);
