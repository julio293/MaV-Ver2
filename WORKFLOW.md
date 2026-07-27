# MaV Design System — Full Working Flow

How this project works end-to-end: a hand-authored static design-system site, an
agent-driven quality loop, a design-sync pipeline into Claude Design, and a
Cloudflare Pages deploy. All four share one Git backbone (`origin/main`).

```mermaid
flowchart TD
    %% ─────────────── SOURCE (the repo IS the site) ───────────────
    subgraph SRC["① Source — static site (no build step)"]
        TOK["css/tokens.css<br/>Figma design tokens (verbatim names)"]
        SH["css/shared.css<br/>doc chrome (sidebar / topbar / preview cards)"]
        THEME["js/theme.js<br/>dark-mode toggle (data-theme)"]
        PAGES["components/*.html<br/>33 self-contained showcase pages<br/>(inline style + script + markup)"]
        IDX["index.html · foundations/ · dev/ · customiser.html"]
        TOK --> PAGES
        SH --> PAGES
        THEME --> PAGES
        PAGES --> IDX
    end

    %% ─────────────── QUALITY LOOP (agents) ───────────────
    subgraph QA["② Quality loop — custom subagents"]
        REPORT["Bug report / polish request"]
        FIX["component-fixer (opus)<br/>correctness bugs"]
        POL["component-polisher (sonnet)<br/>visual polish + microinteractions"]
        SHIP["bugfix-ship (opus)<br/>fix + AUTO commit & push"]
        VERIFY{"Verify loop<br/>python http.server + headless Chrome<br/>light + dark + 390px"}
        REPORT --> FIX
        REPORT --> POL
        REPORT --> SHIP
        FIX --> VERIFY
        POL --> VERIFY
        SHIP --> VERIFY
    end

    PAGES <-->|"agents read & edit"| QA
    VERIFY -->|"pass"| COMMIT["git commit<br/>(Co-Authored-By)"]
    VERIFY -.->|"fail / regression"| REPORT
    SHIP -.->|"autonomous"| COMMIT
    COMMIT --> GH["GitHub · origin/main"]

    %% ─────────────── DESIGN-SYNC (to Claude Design) ───────────────
    subgraph DS["③ Design-sync — into Claude Design"]
        EXTRACT["extract-css.mjs"]
        MIRROR["ds-src/styles/components.css<br/>verbatim CSS mirror"]
        WRAP["ds-src/ React wrappers<br/>+ build.mjs (esbuild)"]
        DIST["dist/index.es.js + index.d.ts<br/>43 components"]
        CONV["package-build.mjs<br/>converter"]
        BUNDLE["ds-bundle/<br/>_ds_bundle.js · styles.css · previews · _ds_sync.json"]
        VAL["package-validate.mjs<br/>+ graded previews (headless)"]
        CLAUDE["claude.ai/design project<br/>⛔ blocked: needs Claude Design access"]
        MIRROR --> CONV
        WRAP --> DIST --> CONV --> BUNDLE --> VAL
        VAL -->|"clean"| CLAUDE
    end

    PAGES -->|"extract-css.mjs"| MIRROR

    %% ─────────────── DEPLOY (public site) ───────────────
    subgraph DEP["④ Deploy — Cloudflare Pages"]
        SKILL["/deploy-cloudflare-pages"]
        STAGE["rsync clean copy<br/>drop .git/.claude/node_modules + ds-src/ds-bundle/.design-sync"]
        WR["wrangler pages deploy<br/>--branch main"]
        CF["Cloudflare Pages"]
        LIVE["🌐 https://mav-ver2.pages.dev"]
        SKILL --> STAGE --> WR --> CF --> LIVE
    end

    IDX -->|"deployable = repo root"| SKILL
    GH -.->|"source of truth"| SKILL

    classDef blocked fill:#ffecec,stroke:#ff0000,color:#171717;
    classDef live fill:#eaffea,stroke:#629c28,color:#171717;
    class CLAUDE blocked;
    class LIVE live;
```

## Walkthrough

**① Source.** The repo *is* the site — no build step. `css/tokens.css` holds the
Figma design tokens (names kept verbatim, slashes/typos preserved);
`css/shared.css` is doc-page chrome; `js/theme.js` drives dark mode via
`[data-theme]`. Each `components/*.html` is a self-contained showcase page with
inline `<style>`/`<script>`, plus `index.html`, `foundations/`, `dev/`, and
`customiser.html`.

**② Quality loop.** A bug or polish request routes to one of three project
subagents (`.claude/agents/`): **component-fixer** (opus) for correctness bugs,
**component-polisher** (sonnet) for visual polish/microinteractions, and
**bugfix-ship** (opus) which fixes *and* commits/pushes autonomously. Every fix
passes the same gate — reproduce and verify with headless Chrome in light, dark,
and phone width — before it's committed with a co-author line and pushed to
`origin/main`. (Agents load at Claude Code startup.)

**③ Design-sync.** To make the system usable inside Claude Design, `extract-css.mjs`
mirrors every page's CSS verbatim into `ds-src/styles/components.css`; thin React
wrappers in `ds-src/` compile via esbuild to `dist/` (43 components + `.d.ts`); the
`package-build.mjs` converter emits `ds-bundle/` (`_ds_bundle.js`, `styles.css`,
graded preview cards, `_ds_sync.json`); `package-validate.mjs` gates it. Upload to
a `claude.ai/design` project is the final step — currently **blocked** pending
Claude Design access on the account.

**④ Deploy.** `/deploy-cloudflare-pages` stages a clean copy (dropping VCS,
tooling, and design-sync build artifacts), then `wrangler pages deploy --branch main`
publishes to Cloudflare Pages at **https://mav-ver2.pages.dev**.
