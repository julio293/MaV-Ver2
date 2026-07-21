---
name: mav-export-component
description: Export a Figma node from the "Modular App Visualizer" file into the MaV design system as a faithful, token-driven, light+dark component or organism page — branch, pull, build, register in the nav/overview, verify headless, and commit. Use when the user shares a Figma link/node and asks to export/add it as a MaV component or organism.
---

# Export a Figma node into the MaV design system

The repeatable loop for turning a Figma node into a MaV component/organism page.
Keep it faithful to Figma, token-driven, light+dark, and consistent with the
existing pages. Work autonomously end-to-end, then report + offer to merge/push.

## Inputs
- **Figma URL or node-id** (file key is always `8dGEq5WuFEitIQxYUmezTr`).
- Target repo = the current MaV repo (this project). Component/organism pages
  live in `components/`, foundations in `foundations/`.

## Pipeline

### 1. Branch
```bash
git checkout main -q && git checkout -b <kebab-name> -q
```
(If stacking related work, branch off the previous branch instead of main.)

### 2. Pull from Figma
Invoke the **figma-design-to-code** skill first (pass `skillNames: "figma-design-to-code"`).
- `get_screenshot` + `get_metadata` on the node to identify it.
- **Big spec sheets fail `get_design_context` ("nothing selected" / timeout).**
  Use `get_metadata` to find the real component sub-node (look for a `❖ Name`
  symbol/component set), then `get_design_context` on ONE representative variant.
- `get_variable_defs` on the component node to read exact token names/values.
- Screenshot each distinct variant (states/sizes/types) at small `maxDimension`,
  download with curl, and Read them so the build matches pixels.

### 3. Classify
- **Component** = a reusable building block → `components/`, "Components" nav group.
- **Organism** = a full assembled screen → `components/`, "Organisms" nav group.
- Keep the current split; App Bar / Button Dock / Balance are components, not organisms.

### 4. Build `components/<name>.html`
Mirror an existing page (`components/app-bar.html`, `balance.html`,
`section-header.html`, `datepicker.html`, `pagination.html`) exactly:
- `<head>`: link `../css/tokens.css` then `../css/shared.css`; a scoped `<style>`.
- Header comment citing the Figma node id.
- `.doc-layout > .doc-sidebar (empty) + .doc-main`; `.topbar` with `data-theme-toggle`;
  `.page-header` (breadcrumb + title + desc); `.section` blocks with `.preview-card`
  > `.preview-canvas` + `.preview-meta`; a **Token Reference** `.token-table`.
- `<script src="../js/theme.js"></script>` at the end.
- Prefer a small inline `<script>` generator for repetitive grids (see datepicker/pagination).

**Tokens (`css/tokens.css`) — critical rules:**
- Names match Figma verbatim; escape in CSS: slash `\/`, ampersand `\&`, space `\ `.
- **Case-sensitive**: `--Checkbox/*` ≠ `--checkbox/*`, `--Balance/*` ≠ `--balance/*`.
- Reference with the escaped form + a fallback: `var(--btn\/primary\/default,#352eff)`.
- Reuse existing tokens. If a token is missing, add it in BOTH the light `:root`
  and the `[data-theme="dark"]` block.
- **Theming**: primary `#352eff` → lime `#a1ff5b` in dark. Use `--btn/primary/default`
  or `--main-text/brand` for anything that should re-theme. Provide `[data-theme=dark]`
  overrides for hard-coded surfaces.
- Fonts: **Plus Jakarta Sans** (titles/numbers), **Inter** (labels/body).
- Icons: inline SVG (`stroke="currentColor"`, `fill="none"`, 1.7–2 stroke), matching the set.

**Motion**: a global motion layer already lives in `shared.css` (press, reveal,
theme cross-fade). Add component-specific transitions with
`cubic-bezier(.34,1.1,.35,1)` for slides/stretches; gate anything heavy behind
`@media (prefers-reduced-motion: no-preference)`.

### 5. Register everywhere (3 spots)
- **`js/theme.js`** — add a `{ href, label, ic }` entry to the `NAV` array in the
  right group. If the icon key is new, add it to the `ICONS` map (else it falls
  back to a dot).
- **`index.html`** — add the item to the `SECTIONS` manifest, add the icon to the
  page's `IC` map if new, and **bump the count stat** (`<b>NN</b> Components`).

### 6. Verify (headless Chrome, light + dark)
Server runs at the repo root (e.g. `python3 -m http.server 8001`).
```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=1500,1700 \
  --screenshot=/tmp/x.png "http://localhost:8001/components/<name>.html"
sips -c <H> <W> --cropOffset <top> <left> /tmp/x.png --out /tmp/x_crop.png   # zoom in
```
Then **Read** the PNG and check faithfulness vs the Figma screenshots.
- **Headless Chrome defaults to `prefers-color-scheme: dark`.** To force a theme,
  seed localStorage before `theme.js` runs:
  ```bash
  sed 's#<link rel="stylesheet" href="../css/tokens.css">#<script>localStorage.setItem("mav-theme","light")</script>&#' \
    components/<name>.html > components/__tmp.html
  # render http://localhost:8001/components/__tmp.html, then: rm components/__tmp.html
  ```
- Verify BOTH light and dark. Confirm primary re-themes to lime in dark.

### 7. Commit
```bash
git add components/<name>.html js/theme.js index.html css/tokens.css
git commit -q -m "Export <Name> component (Figma <node-id>)

<one-paragraph what + variants + tokens used>

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
Then report and **offer to merge to `main` + push** (fast-forward keeps history linear).

## Gotchas checklist (learned the hard way)
- [ ] `<button>` cells inherit browser/shared button styling → reset `background:none;border:0;padding:0` on custom button-based cells (was the datepicker grey-box bug).
- [ ] New nav/index icon key added, or it renders as a dot.
- [ ] `index.html` count stat bumped.
- [ ] Dark verified, not just light (headless is dark by default — force light explicitly).
- [ ] New tokens added to BOTH light and dark blocks.
- [ ] Escaping/case correct in `var(--…)` references.
- [ ] Large node → drilled via `get_metadata` before `get_design_context`.
- [ ] Cleaned up any `__tmp.html` render files.
