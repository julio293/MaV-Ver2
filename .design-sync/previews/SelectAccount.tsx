import { SelectAccount } from '@mav/design-system';

export const Screen = () => <SelectAccount />;

export const Dark = () => (
  <div data-theme="dark">
    <SelectAccount
      navTitle="Money Fixed Plus"
      accounts={[
        { name: 'Mr. K', balance: '฿ 10,000.00', selected: true },
        { name: 'Everyday Pot', balance: '฿ 4,250.00' },
        { name: 'Locked Pot', balance: '฿ 10,000.00', disabled: true, message: 'Locked until 12 Aug' },
      ]}
    />
  </div>
);
