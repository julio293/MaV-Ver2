import { BottomNav } from '@mav/design-system';

const frame = { width: 390, maxWidth: '100%', border: '1px solid #efefef', borderRadius: 26, overflow: 'hidden', paddingTop: 40, background: '#fff' } as const;

export const FourWithScan = () => (
  <div className="nav" style={frame}>
    <BottomNav items={['home', 'statistic', 'cards', 'profile']} active={0} scan />
  </div>
);

export const FiveItems = () => (
  <div className="nav" style={frame}>
    <BottomNav items={['home', 'statistic', 'search', 'history', 'profile']} active={2} />
  </div>
);
