import { TransactionItem } from '@mav/design-system';

export const List = () => (
  <div style={{ width: '100%', maxWidth: 420 }}>
    <TransactionItem icon="in" name="Salary — GTBank" meta="Transfer · Feb 28 · 09:14" amount="+₦ 350,000" type="credit" status="Credit" />
    <TransactionItem icon="out" name="Airtime — MTN" meta="Bill payment · Feb 28 · 11:45" amount="−₦ 2,000" type="debit" status="Debit" />
    <TransactionItem icon="pending" name="P2P Transfer — James K." meta="Send money · Feb 27 · 14:33" amount="−₦ 20,000" type="debit" status="Pending" />
    <TransactionItem icon="check" name="Savings — Auto-debit" meta="Internal · Feb 27 · 08:00" amount="−₦ 5,000" type="debit" status="Completed" />
  </div>
);
