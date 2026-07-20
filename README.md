# MaV Design System

A token-driven, multi-theme design system for building e-banking apps. Every
color, font, and radius routes through swappable **role tokens**, so the whole
system re-themes (blue → lime in dark) from one source of truth.

Exported from the Figma file **“Modular App Visualizer.”**

## What's inside

| Layer | Count | Where |
|-------|-------|-------|
| **Foundations** | 6 | `foundations/` — colors, typography, spacing, effects, dark mode, token architecture |
| **Components** | 23 | `components/` — buttons, inputs, OTP, forms, badges, avatars, cards, list, navigation, app bar, button dock, tabs, chat, finance, balance, divider, progress, loader, coachmark… |
| **Organisms** | 4 | `components/` — Sign In / Sign Up, OTP Verification, Select Account, Input Amount |
| **Tokens** | 820+ | `css/tokens.css` — primitive palette → role tokens → light/dark themes |

## Run it

It's static HTML/CSS/JS — no build step:

```bash
python3 -m http.server 8000
# open http://localhost:8000/index.html
```

- **`index.html`** — overview of foundations, components, and organisms
- **`customiser.html`** — ✦ Live Customiser: edit tokens (color, font, shape, theme) and see every component re-theme in real time
- **`css/tokens.css`** — the token source of truth; **`js/theme.js`** — theme toggle + nav

## Theming

Toggle light/dark on any page. The primary brand color shifts `#352eff` → lime
`#a1ff5b` in dark, and all component color/contrast follows automatically because
components reference role tokens, never raw hex.
