import { TextField } from '@mav/design-system';

export const Default = () => <TextField placeholder="user@example.com" />;

export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 380 }}>
    <TextField placeholder="Email address" />
    <TextField state="filled" value="julio@fyscaltech.com" inputProps={{ readOnly: true }} />
    <TextField state="focus" value="julio@fyscaltech.com" inputProps={{ readOnly: true }} />
    <TextField state="error" value="bad-email" inputProps={{ readOnly: true }} errorMessage="Enter a valid email address" />
    <TextField state="disabled" placeholder="Unavailable" />
  </div>
);

export const WithPrefix = () => (
  <TextField
    prefix="https://"
    placeholder="yoursite.com"
    leadingIcon={undefined}
  />
);
