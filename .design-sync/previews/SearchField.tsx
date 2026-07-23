import { SearchField } from '@mav/design-system';

export const Default = () => (
  <div style={{ width: 360, maxWidth: '100%' }}><SearchField placeholder="Search transactions…" /></div>
);

export const WithLabelAndClear = () => (
  <div style={{ width: 360, maxWidth: '100%' }}><SearchField label="Find a contact" value="Julio" clearable /></div>
);
