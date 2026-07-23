# MaV Design System — how to build with it

MaV is a **class + CSS-variable design system**. Components are plain React
elements that render fixed MaV class names; all color, type, spacing, radius and
theming come from CSS custom properties (design tokens) defined in the shipped
stylesheet. There is **no theme provider and no props-based styling** — you style
your own layout with the tokens, and you never restyle the components themselves.

## Setup
1. Import the components from the bundle (e.g. `Button`, `Alert`, `Balance`).
2. Ensure the shipped `styles.css` is loaded once at the app root — it carries the
   tokens, the brand fonts (Plus Jakarta Sans + Inter, loaded remotely), and every
   component's styles. Without it, components render unstyled.
3. **Dark mode**: set `data-theme="dark"` on any ancestor (e.g. `<body>` or a
   wrapper). Tokens re-theme automatically — the primary accent flips from blue
   `#352eff` to lime `#a1ff5b`, surfaces invert. Do not hard-code colors for dark.

## Styling idiom — use the tokens, not new class names
For your own layout/containers, style with `var(--token)`. Never invent MaV class
names and never hard-code hex that a token already provides. Real tokens:

- Brand/accent: `--bc-primary-light` (#352eff), `--bc-primary-dark` (#a1ff5b),
  `--btn/primary/default`
- Text: `--main-text/default`, `--main-text/description` (muted)
- Surfaces/lines: `--bc-white`, `--bc-black` (#171717), `--mav-border`
- Status: `--bc-danger`, `--System/Success`
- Fonts: `--font-active` (Plus Jakarta Sans) for numbers/labels; body copy uses Inter

Token names come straight from Figma and **preserve slashes and typos** (e.g.
`--alert/waring/*` is spelled "waring"). Reference them verbatim.

## Where the truth lives
- Tokens + all component CSS: the bound `styles.css` and its `@import` of
  `_ds_bundle.css` — read these before styling anything custom.
- Per-component API + usage: each component's `.d.ts` (the `<Name>Props`) and its
  `.prompt.md`. Compose with the documented props; pass content via `children`
  and the named slots (e.g. List's `leading`/`trailing`).

## Idiomatic snippet
```tsx
import { Balance, Button } from '@mav/design-system';

export function WalletHeader() {
  return (
    <section style={{ padding: 20, background: 'var(--bc-white)', borderRadius: 16 }}>
      <Balance label="Available balance" amount="$82,758.10" trend="+24% this month" />
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Button variant="primary" leadingIcon="plus">Top up</Button>
        <Button variant="secondary">Statement</Button>
      </div>
    </section>
  );
}
```

Components already carry their own styling — your job is layout glue with tokens.
