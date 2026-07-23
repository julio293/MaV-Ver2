/** MaV sign-in form — labelled email + password fields, remember checkbox, primary button, "or continue with" divider and Apple / Google / Facebook social buttons. */
export function LoginForm({
  heading = 'Welcome back',
  subheading = 'Sign in to continue to MaV.',
  email = '',
  submitLabel = 'Sign in',
  socialLabels = {
    apple: 'Sign in with Apple',
    google: 'Sign in with Google',
    facebook: 'Sign in with Facebook',
  },
  footer,          // node, e.g. Don't have an account? <a>Sign up</a>
  className = '',
  ...rest
}) {
  const cls = ['screen', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="auth-head">
        <div className="auth-h1">{heading}</div>
        <div className="auth-sub">{subheading}</div>
      </div>
      <div className="f">
        <div className="f-top"><span className="f-label">Email</span></div>
        <div className="f-input">
          <svg className="f-ic" viewBox="0 0 24 24"><path d="M4 6h16v12H4z" /><path d="M4 8l8 5 8-5" /></svg>
          <input placeholder="you@example.com" defaultValue={email} />
        </div>
      </div>
      <div className="f">
        <div className="f-top"><span className="f-label">Password</span><a className="f-link" href="#">Forgot?</a></div>
        <div className="f-input">
          <svg className="f-ic" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
          <input type="password" placeholder="••••••••" />
        </div>
      </div>
      <label className="cbx-row">
        <span className="cbx on"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg></span>
        Remember me
      </label>
      <button className="btn-primary">{submitLabel}</button>
      <div className="or"><span>Or continue with</span></div>
      <div className="stack">
        <button className="social">
          <svg className="ic-apple" viewBox="0 0 24 24"><path d="M16.37 1.43c0 1.14-.42 2.2-1.13 2.98-.79.87-2.08 1.55-3.15 1.46-.13-1.1.42-2.26 1.1-3 .77-.84 2.13-1.47 3.18-1.44zM20.94 17.02c-.55 1.27-.82 1.84-1.53 2.96-.99 1.57-2.39 3.53-4.12 3.54-1.54.02-1.94-1.01-4.03-1-2.09.01-2.53 1.02-4.07 1.01-1.73-.02-3.05-1.78-4.04-3.35C-.65 15.79-.94 10.63.77 7.89 1.98 5.94 3.89 4.8 5.69 4.8c1.83 0 2.98 1.01 4.5 1.01 1.47 0 2.37-1.01 4.49-1.01 1.6 0 3.3.87 4.51 2.38-3.96 2.17-3.32 7.83.25 9.28z" /></svg>
          {socialLabels.apple}
        </button>
        <button className="social">
          <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" /><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" /></svg>
          {socialLabels.google}
        </button>
        <button className="social">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1877F2" /><path fill="#fff" d="M15.5 12.5h-2.3V20h-3v-7.5H8.5V9.8h1.7V8.3c0-2 1.2-3.3 3.2-3.3h1.9v2.6h-1.3c-.7 0-.9.4-.9.9v1.3h2.3l-.4 2.7z" /></svg>
          {socialLabels.facebook}
        </button>
      </div>
      {footer && <div className="auth-foot">{footer}</div>}
    </div>
  );
}
