import { LoginForm } from '@mav/design-system';

export const SignIn = () => (
  <div className="phone" style={{ width: 360, maxWidth: '100%' }}>
    <LoginForm
      heading="Welcome back"
      subheading="Sign in to continue to MaV."
      email="julio@fyscaltech.com"
      submitLabel="Sign in"
      footer={<>Don't have an account? <a href="#">Sign up</a></>}
    />
  </div>
);

export const Dark = () => (
  <div className="phone" data-theme="dark" style={{ width: 360, maxWidth: '100%' }}>
    <LoginForm
      heading="Welcome back"
      subheading="Sign in to continue to MaV."
      email="julio@fyscaltech.com"
      footer={<>Don't have an account? <a href="#">Sign up</a></>}
    />
  </div>
);
