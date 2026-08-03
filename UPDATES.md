# MaV — Update Log

A running record of what we build, change, and ship. Newest first.
Each entry notes the date, what changed, the commit, and (if deployed) the Cloudflare Pages deployment.

Live site: https://mav-ver2.pages.dev · Builder: https://mav-ver2.pages.dev/builder/

---

## 2026-07-31

### Multi-screenshot upload (Rebuild-from-app door)
- Replaced the single native file input with a proper **multi-file dropzone**: click or drag & drop, **accumulate across picks**, dedupe, a live count ("N screenshots added"), a **thumbnail grid**, and per-file remove. Users can now add as many app screens as they like.
- Commit `22c7cd4` · Deploy `a216dc8c` · v37

### 3-door onboarding entry (from the journey diagram)
- Opening the builder now shows **"How do you want to start?"** with the three doors from the onboarding-journey diagram: **Describe it** (Ready — full prompt flow), **I have a Figma** (Preview), **I have an existing app** (Preview).
- Describe = the existing hero prompt. Figma/App doors present their intake (Figma link · app name + screenshot upload · one-line description) with an honest "import coming — generates a starting sitemap for now" note, then run the build. Back-navigation between chooser and sub-views; sample-skip retained.
- Commit `2eed676` · Deploy `9590f853` · v36

### Homepage embed shows the prompt
- The App Builder embedded on the design-system homepage now shows the **hero prompt** ("Describe your fintech app") instead of the live builder UI — users can't build from the preview, so it presents the prompt; "Open full screen" opens the real builder. (Removed the earlier iframe-silence gate.)
- Commit `35715ae` · Deploy `99da08b3` · v35

### Payment Card design/skin variants
- The Payment Card now exposes a **Card design** dropdown in the inspector — the 16 real Figma card faces (`app/assets/cards/skins/skin-*.png`) plus a plain Gradient — with the number/holder/expiry data layer riding over a legibility scrim, exactly like the design system.
- Commit `29ab2d8` · Deploy `9e8da735` · v34

### Floating prev / next stage control
- Added a bottom-centre floating pill inside the builder — **‹ Prev · N/4 · Stage · Next ›** — to move through Sitemap → Wireframe → Style Guide → Visual.
- Mirrors and stays in sync with the top stepper (both now route through `gotoStage`, which also plays the reveal transition); Prev disabled on the first stage, Next on the last.
- Commit `57a9e12` · Deploy `094a32c3` · v33

### Provider-agnostic LLM/vision + screenshot rebuild
- Rewrote the Pages Function to be **provider-agnostic**: Anthropic, OpenAI, **Google Gemini (free tier + vision)**, or OpenRouter — chosen via `LLM_PROVIDER` + the matching key env, swappable any time. Health GET reports the active provider/model.
- The **Rebuild-from-app** door now downscales the uploaded screenshots and sends them to the vision model; the reply rebuilds the screens in MaV components and returns a **brand palette** that's applied as the accent. Strict catalog validation + rule-based fallback preserved.
- Verified: graceful fallback (image scaling runs, generates from text when no provider). Enable a free provider with a Gemini key + `LLM_PROVIDER=gemini`; switch to Anthropic later by changing the env.
- Commit `cca4027` · Deploy `545b474d` · v38

### LLM sitemap generation (with rule-based fallback)
- New Cloudflare **Pages Function** `functions/api/generate.js` calls the Anthropic API (key stays server-side) to compose the sitemap from the brief + audience, constrained to the real component catalog via a tool schema.
- Client (`llmProject`/`composeProject`) sends the live catalog vocabulary, **validates the reply against `CATALOG`/`VARIANTS`** (drops unknown types/props), and **falls back to the rule engine** if the function is missing, unconfigured, or errors — so the builder always works.
- `runBuild` now runs the compose in parallel with the loader animation (last step keeps spinning until the model returns), then commits + reveals.
- **Enable:** `npx wrangler pages secret put ANTHROPIC_API_KEY --project-name mav-ver2` (optional `LLM_MODEL`, default claude-sonnet-4-6). Until set, endpoint returns 503 and the client uses rules.
- Verified: graceful fallback with no function (6 pages, exact brief in root).
- Commit `e97b908` · Deploy `ab90c297` · v32

### Dark hero + build animation + exact-brief reflection
- **Dark hero:** flipped the standalone landing to a dark variant (same animated gradient-border bar) to match the builder chrome.
- **Building animation:** Generate now shows a "Building your app…" loader — the user's exact brief quoted, an animated step checklist (read → map → compose → apply → finish) and a gradient progress bar — then fades out and the sitemap reveals with a transition.
- **Exact input:** the typed brief is stored (`S.brief`) and shown verbatim as the sitemap root label (+ audience in the tooltip); feature words drive which pages appear.
- Applies to both the hero and the in-app "Describe your project" modal.
- Commit `f3eb64d` · Deploy `98abafbc` · v31

### Standalone hero landing for the builder
- Replaced the welcome modal with a **standalone hero** (Relume-style): a soft light landing with an **animated gradient-border prompt bar** + **Generate**, a **"Take it for a spin with an example"** link, and **6 fintech recommendation chips** — all on MaV tokens (mav-primary, Plus Jakarta).
- Fintech-only guard + audience/pages controls + "skip — use a sample" retained. Generate → sitemap → flow. Stays silent in the homepage iframe preview.
- Commit `ca42b4a` · Deploy `db856133` · v30

### Fintech welcome gate on builder open
- Opening the builder as its own page (via **Open Builder** from the design system) now greets the user with **"What fintech app are you building?"** — a describe-your-project prompt (brief + audience + page count) that generates the sitemap and drops them into the flow.
- **Fintech-only:** prompts are validated (`isFintech`); non-finance ideas are rejected with a nudge. The same guard applies to the in-app "Describe your project" modal.
- Includes a "Start from a sample instead" escape. Stays **silent when embedded** as the homepage preview (iframe) via a `window.self===window.top` check.
- Verified: welcome shows top-level, rejects non-fintech, generates on fintech, hidden in iframe.
- Commit `cc6e5db` · Deploy `09fc0f55` · v29

### Builder feedback pass — project prompt, style concepts, export reframe
- **Stage 1 (project-first):** the Sitemap prompt is now **"Describe your project"** — a brief + target audience + page count that generates a full **multi-page sitemap** (each page broken into sections). Replaces the old single-page "Describe a page"; "Add a page from library" stays for manual pages.
- **Stage 2 (wireframe):** unchanged, as requested.
- **Stage 3 (style guide):** added **6 one-click design concepts** (accent + radius + typography, incl. Midnight = dark), a **✨ Generate** button that produces a fresh harmonious palette, and **typography pairings** (5 heading·body pairs; new `--font-head` applied to headings/amounts; extra Google fonts loaded).
- **Stage 4 (export):** reframed to **Prototype** (interactive HTML — experience the app) + **React Native**. Figma export deferred per decision.
- Verified end-to-end: brief → 7-page sitemap matching features; concepts/generate/pairings apply globally; export shows the two cards.
- Commit `9f09d54` · Deploy `65e90668` · v28

---

## 2026-07-28

### Variant controls on every component with variants
- Extended the inspector's Figma-style controls (already generic for the 22 components that had variant schemas) to **48 components** by adding variant definitions to the ~26 that lacked them — headings, balance, payment card, amount, charts, map, inputs, receipts, toggles, etc.
- Each now exposes its editable content as **text fields / dropdowns / toggles** (Content, Label, Amount, etc.), matching the button. Text edits apply live.
- Commit `6fb9c35` · Deploy `8e2d2032` · v27



### Finance Widgets — design-system page
- New `components/finance-widgets.html` documents the 7 new finance widgets (QR, Transaction Detail, Donut, Line Chart, PIN Dots, Amount Slider, Map) in the design system, each in light + dark.
- Renders live from the builder catalog (`builder/data.js`) so docs stay 1:1 with the builder; added to the sidebar NAV and the homepage grid.
- Commit `a816829` · Deploy `a74cb1d7`

### 7 finance UI components
- Added **QR / Scan-to-Pay**, **Transaction Detail**, **Donut Chart**, **Line Chart**, **PIN Dots**, **Amount Slider**, and **Map / Branch Locator** — palette 53 → 60.
- Hand-built on MaV tokens with scoped light/dark CSS; wired into DESC, compose ORDER, VARIANTS (txn direction, PIN digits, slider position), and prompt cues. All 7 verified light & dark.
- Commit `b019406` · Deploy `0258488b` · v26

### Splash fills the whole screen (fix)
- Splash now renders as a full-screen `inset:0` layer (new `fullscreen` catalog flag routed in buildScreen like the app-bar/nav pinning) so it fits any device frame edge-to-edge instead of sitting in the padded body.
- Commit `1c3f177` · Deploy `4646ad0c` · v25

### Splash / Opening component
- Added the **Splash / Opening** screen to the builder (palette 52 → 53) — real exported background SVGs (squares / brand gradient / beam), centred Fyscal logomark, 2-line footer, and the full drift/sheen/glow/mark-in/breathe animation set (reduced-motion gated).
- Background variant selectable in the inspector; wired into DESC, ORDER (first), and prompt cues. Verified render.
- Commit `cf99266` · Deploy `ea37ec5c` · v24

### 3 more builder components
- Added **Pagination**, **Button Dock** (reuses real `.dock` classes), and **Number Pad** (numeric PIN/amount pad) — palette 49 → 52.
- Wired into DESC, compose ORDER, prompt cues, and VARIANTS (pagination active page; dock content + secondary-button toggle). Verified all 3 render light & dark.
- Commit `d95b2a4` · Deploy `13372c54` · v23

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
