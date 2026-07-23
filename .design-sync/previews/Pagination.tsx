import { Pagination } from '@mav/design-system';

export const Group = () => <Pagination type="group" pages={[1, 2, 3, '…', 7, 8, 9]} active={0} />;

export const Count = () => <Pagination type="count" current={2} total={8} />;

export const Dots = () => <Pagination type="dots" pages={5} active={1} />;
