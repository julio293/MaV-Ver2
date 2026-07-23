# MaV design-sync — repo notes

## This repo is OFF-SCRIPT for design-sync
The MaV repo is a **static HTML/CSS design system** — 30+ hand-authored
`components/*.html` showcase pages, `css/tokens.css` (design tokens),
`css/shared.css` (doc chrome), `js/theme.js` (dark-mode toggle). There is **no
npm package, no build, no React, no Storybook** in the repo proper.

design-sync requires a React component library. To sync faithfully we built a
**thin wrapper package** at `ds-src/` that the converter consumes:

- `ds-src/src/components/*.jsx` — thin React wrappers that emit the **exact
  class names + markup** from the source pages (icons inlined from the pages'
  `<symbol>` defs). No restyling — structural glue only.
- `ds-src/styles/components.css` — **generated, verbatim**: Google-Fonts remote
  `@import` + `css/tokens.css` (inline) + each page's inline `<style>` block,
  concatenated. Regenerate with the extractor (see "Rebuilding" below).
- `ds-src/build.mjs` — esbuild → `dist/index.es.js` **and** hand-authored
  `dist/index.d.ts` (the converter discovers components from the `.d.ts`; the
  `types`/`exports.types` field in `package.json` MUST point at it).
- `cfg.cssEntry` points at the self-contained `components.css`; there is **no
  `tokensGlob`/`tokensPkg`** (tokens are inlined into cssEntry, so they land in
  `_ds_bundle.css`, which is in the `styles.css` @import closure).

## Rebuilding
1. Regenerate CSS from source pages (extractor script — keep it in sync with the
   page list; currently buttons, feedback, balance, badges). It must emit:
   remote font `@import` FIRST, then tokens (verbatim), then component styles.
2. `cd ds-src && node build.mjs`  (emits dist/index.es.js + dist/index.d.ts)
3. `node .ds-sync/package-build.mjs --config .design-sync/config.json \
     --node-modules ds-src/node_modules --entry ./ds-src/dist/index.es.js --out ./ds-bundle`
4. `node .ds-sync/package-validate.mjs ./ds-bundle`

## Fonts
Plus Jakarta Sans + Inter load via a **remote Google-Fonts `@import`** at the
top of `components.css` → validate reports `[FONT_REMOTE]` (informational, fonts
load at runtime; nothing to ship). `[FONT_REMOTE]` also lists Unbounded / SF Pro
Text / Poppins / JetBrains Mono referenced by token vars but not actually used by
the synced components — harmless.

## Render check
No playwright/chromium installed. Renders verified manually via system Chrome
headless against the served `ds-bundle` cards (all 5 slice components confirmed
styled + complete). Validate run with the render check skipped — if a future run
wants the automated gate, `npm i -D playwright && npx playwright install chromium`.

## Known render warns
- `tokens: 1 missing (below threshold)` — one `var(--*)` referenced without a
  definition in the shipped CSS; below the converter's warn threshold, non-blocking.

## Re-sync risks / what can go stale
- **`components.css` is generated, not the source of truth.** If someone edits a
  page's inline `<style>` in `components/*.html`, re-run the extractor + rebuild,
  or the bundle drifts from the showcase.
- **`dist/index.d.ts` is hand-authored in `build.mjs`.** Adding a component means
  adding its wrapper, its export in `src/index.jsx`, AND its interface in the
  `build.mjs` d.ts string (+ optionally `cfg.dtsPropsFor`).
- Wrappers inline icon paths — if a page's icon set changes, the wrapper icon may
  lag (cosmetic only).

## CSS extractor
`.design-sync/extract-css.mjs` regenerates `ds-src/styles/components.css` from ALL
`components/*.html` pages + `css/tokens.css` + `css/shared.css`. Run it after any
source edit, then `cd ds-src && node build.mjs`.

## Multi-export wrappers
`build.mjs` uses `export *` per file so multi-part components reach the runtime
(e.g. `List.jsx` also exports `ListRow`/`ListAvatar`/`ListButton`/`ListTag`/
`ListCheck`/`ListSoftIcon`/`ListStore`). The generated `.d.ts` documents only the
filename-primary; sub-parts are runtime-available (used by the List preview) but
not carded. Enhancement: document sub-parts explicitly if desired.

## JS-gated reveal animations (gotcha)
Some pages hide elements at `opacity:0` until JS adds a reveal class. ChatBubble
needs its preview wrapped in `.cthread.in` (not `.chat`) or bubbles render
invisible. Watch for this pattern (`@media (prefers-reduced-motion:no-preference)
{ .x{opacity:0} .parent.in .x{opacity:1} }`) on any newly-wrapped page.

## Grouping
All 43 components currently land in the "general" group (no per-component docs
with `category:` frontmatter). Enhancement: add `cfg.docsMap` stubs (`---\ncategory:
<Group>\n---`) to organize the DS pane (Actions / Inputs / Navigation / Feedback /
Data Display / Communication).

## Scope status — FIRST SYNC LOCAL BUILD COMPLETE
All **43 components** wrapped, built, and **visually verified** via Chrome-headless
against the served bundle (render check skipped — no playwright). Two bugs fixed
during verification (ChatBubble reveal gate; List multi-export). Conventions header
authored. Validate exits clean (FONT_REMOTE + RENDER_SKIPPED only).
**Upload is PENDING** — blocked on claude.ai login (`/login`, subscription). No
claude.ai/design project created yet; no `projectId` pinned. On next run after
login: create project, then incremental upload per skill §3.

Components: Alert, AmountInput, AppBar, Avatar, Badge, Balance, BalanceCard,
BlogCard, BottomNav, BottomSheet, Breadcrumb, Button, ButtonDock, CashflowCard,
ChatBubble, Checkbox, Chip, Coachmark, Datepicker, Divider, EmptyState, GlideTabs,
List, LoginForm, MessageInput, OtpEntry, OtpInput, Pagination, PaymentCard,
PillTabs, ProgressBar, Radio, SearchField, SectionHeader, SelectAccount, Spinner,
Stepper, Tabs, TextField, Textarea, Toast, Toggle, TransactionItem.
