import { OtpEntry } from '@mav/design-system';

export const Verifying = () => (
  <div className="phone" style={{ width: 360, maxWidth: '100%' }}>
    <OtpEntry
      title="One time PIN"
      description={<>Please enter the one time PIN (OTP) that was sent to <b>+1&nbsp;223&nbsp;242&nbsp;321</b></>}
      code="1234"
      timer="00:32"
      resendDisabled
    />
  </div>
);

export const Complete = () => (
  <div className="phone" style={{ width: 360, maxWidth: '100%' }}>
    <OtpEntry
      title="One time PIN"
      description={<>Please enter the one time PIN (OTP) that was sent to <b>+1&nbsp;223&nbsp;242&nbsp;321</b></>}
      code="123456"
      timer="00:07"
      resendDisabled={false}
    />
  </div>
);
