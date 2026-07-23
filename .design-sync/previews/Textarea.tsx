import { Textarea } from '@mav/design-system';

export const Default = () => <Textarea placeholder="Your message…" />;

export const Focus = () => (
  <Textarea state="focus" value="Meeting notes from today's sync…" readOnly />
);

export const Error = () => (
  <Textarea state="error" value="Too short" readOnly errorMessage="Please enter at least 20 characters" />
);
