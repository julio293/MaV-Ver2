# MaV — Update Log

A running record of what we build, change, and ship. Newest first.
Each entry notes the date, what changed, the commit, and (if deployed) the Cloudflare Pages deployment.

Live site: https://mav-ver2.pages.dev · Builder: https://mav-ver2.pages.dev/builder/

---

## 2026-07-28

### 3 more builder components
- Added **Pagination**, **Button Dock** (reuses real `.dock` classes), and **Number Pad** (numeric PIN/amount pad) — palette 49 → 52.
- Wired into DESC, compose ORDER, prompt cues, and VARIANTS (pagination active page; dock content + secondary-button toggle). Verified all 3 render light & dark.
- Commit `PENDING` · v23

---

## 2026-07-27

### 5 more builder components
- Added **Chart** (real `chart-bar` classes), **Menu List** (real `list-card`/`li` classes), **Article Card** (blog), **Bottom Sheet**, and **File Upload** — palette 44 → 49.
- Chart & Menu List reuse real MaV classes; Article, Bottom Sheet, Upload are compact hand-built (the design-system versions are JS-drawn / absolute-positioned). Upload is net-new (no DS component existed).
- Wired into DESC, compose ORDER, and prompt cues. Verified all 5 render light & dark.
- Commit `05516ac` · Deploy `c0b43be2` · v22

### 9 new builder components
- Added to the palette (35 → 44 components): **Avatar Group, Stat Widget, Account Selector, Loader, Coachmark, Empty State** (real MaV classes) and **Chat Bubbles, Quick Actions, Date Picker** (compact hand-built, since those are JS-drawn in the design system).
- Wired into DESC, sensible compose ORDER, inspector VARIANTS (Stat direction, Loader size, Empty-state illustration), and prompt cues so they can be generated from a prompt.
- Verified: all 9 appear in the palette + hover preview; Chat, Date Picker, Account Selector, Quick Actions render correctly light & dark.
- Commit `ce46df2` · Deploy `aba832c7` · v21

### Component hover preview (builder)
- Hovering a component in the Wireframe palette **and** the "Add a Section" library now shows a floating card with the component's name, description, and a **live render of the real component** (actual render pipeline + current style tokens).
- 110 ms hover-intent, positions beside the list, flips side when short on room, hides on scroll/leave.
- Commit `13c7df6` · Deploy `f924590c` · v20

### Save & export (builder)
- New **"Save & export"** button → format picker:
  - **HTML + CSS** — one self-contained file: real MaV markup + inlined styles as a clickable phone prototype with tap-through navigation.
  - **React Native** — a runnable Expo `App.js`: each screen a component, design tokens as a theme, ~30 mapped components + placeholder fallback, tap-through navigation.
- Verified: HTML renders standalone; RN compiles via esbuild.
- Commit `a790df4` · Deploy `00edcb84` → `74aced7f` · v19

### Figma-style variant controller (builder inspector)
- Component variants now render as proper controls: **dropdowns** (Size/Type/State), **toggles** (Text/Dropdown/Icon right/Full width), and a **text field** (Content) — replacing segmented button rows.
- Buttons honor all of it via a shared `btnMarkup()` (state hover/pressed/disabled, trailing chevron/arrow icon, icon-only mode). Content edits apply live without losing input focus.
- Commit `938a51e` · Deploy `00edcb84` · v18

### Figma-style Position / Alignment panel (builder inspector)
- Select a component in Wireframe to align (H: left/centre/right, V: top/middle/bottom), nudge X/Y, rotate, and flip H/V.
- Shared idempotent `applyPos()`; edits keep input focus and transition smoothly; persists across stages and interactive preview.
- Commit `7788824` · Deploy `62b13644` · v17

### App Builder + brand + illustrations (earlier this day)
- Shipped the MaV App Builder (Sitemap → Wireframe → Style Guide → Visual), embedded on the homepage.
- Fyscal Technologies logo swapped everywhere; animated splash/opening component; 49 illustrations gallery.
- Fixed "Describe a page" prompt generation (prompt-based naming + scroll-to + flash).
- Commit `f8bc2da`

---

## 2026-07-23

- **Autonomous bugfix-ship agent** — fixes, then commits & pushes without asking. Commit `9677c65`
- **Finance modules polish** — fixed Transaction List to a vertical stack. Commit `4a90859`
- **component-fixer / component-polisher subagents** added. Commit `536c5f5`

---

_How this log works: I append an entry here whenever we add or ship something. Ask me for "the update report" (or "what changed / what did we ship") any time and I'll summarize from this file._
