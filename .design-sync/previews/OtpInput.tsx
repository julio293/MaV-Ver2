import { OtpInput } from '@mav/design-system';

export const Boxed = () => <OtpInput variant="boxed" value="1234" length={6} focusIndex={4} />;

export const Boxless = () => <OtpInput variant="boxless" value="123456" />;

export const Error = () => (
  <OtpInput value="1289" length={6} state="error" errorMessage="Incorrect code, try again" />
);
