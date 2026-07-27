---
name: deploy-cloudflare-pages
description: Deploy this MaV design-system site (static HTML/CSS/JS, no build step) to Cloudflare Pages via wrangler and reply with the public URL. Use when asked to deploy/publish/host the MaV site (e.g. "deploy to cloudflare pages", "publish the site", "push this live"). Reads CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID from the environment. No build required — the repo root IS the site.
---

# Deploy the MaV site to Cloudflare Pages

This project is a **static site with no build step** — `index.html` lives at the repo
root and everything is plain HTML/CSS/JS (see `README.md`). The deployable is the repo
root itself; there is no `dist/`. This skill stages a clean copy (dropping VCS/tooling
files), deploys it to Cloudflare Pages with wrangler, auto-creates the Pages project on
first deploy, and replies with the public URL.

## HARD SAFETY RULES (never violate)

- **Never print `$CLOUDFLARE_API_TOKEN`** (or `$CLOUDFLARE_ACCOUNT_ID`). wrangler reads
  both from the environment — never echo them, log them, or put them in a URL.
- **Never upload `.git/`, `.claude/`, `node_modules/`, or `.DS_Store`** — the staging
  step (§3) exists precisely to keep VCS history, tokens, and tooling out of the public
  deploy. Deploy the *staged* dir, never the repo root directly.
- Only deploy the staged copy of **this repo** — never publish arbitrary filesystem paths.
- Keep all temp artifacts (staging dir, logs) in the scratchpad / a temp dir, never
  commit them.

## 1. Validate before doing anything

Required env — reply that Cloudflare Pages isn't configured and stop if either is empty:
```bash
set -e
: "${TMPDIR:=/tmp}"
for v in CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID; do
  [ -n "${!v}" ] || echo "MISSING: $v"
done
REPO="$(git rev-parse --show-toplevel)"
[ -f "$REPO/index.html" ] || echo "MISSING: index.html at repo root — is this the MaV repo?"
```
If anything is MISSING, report it and stop.

## 2. Pick the wrangler binary

wrangler is **not** installed globally here; `bunx` and `npx` are. Force non-interactive
mode (wrangler inherits the two env vars — no `wrangler login`):
```bash
export CI=1
if command -v wrangler >/dev/null 2>&1; then WRANGLER="wrangler"
elif command -v bunx  >/dev/null 2>&1; then WRANGLER="bunx wrangler"
else WRANGLER="npx --yes wrangler"; fi
```

## 3. Stage a clean copy of the site

Copy the repo into a temp dir, excluding VCS/tooling so nothing private ships. `dev/`,
`css/`, `js/`, `foundations/`, `components/`, `app/`, and the root `*.html` are all part
of the site and are kept.
```bash
STAGE="$(mktemp -d "$TMPDIR/mav-deploy.XXXXXX")"
rsync -a \
  --exclude='.git/' --exclude='.claude/' --exclude='node_modules/' \
  --exclude='.DS_Store' --exclude='*.log' \
  "$REPO"/ "$STAGE"/
[ -f "$STAGE/index.html" ] || { echo "stage failed: no index.html"; exit 1; }
LOG="$STAGE/wrangler-deploy.log"
```

## 4. Derive and sanitize the Pages project name

Use the user's name if they gave one; otherwise the git remote basename (`MaV-Ver2` →
`mav-ver2`). Sanitize to Pages rules (lowercase alphanumerics + dashes, no leading/trailing
dash, ≤58 chars). The remote URL can embed a token — use only the basename, never print it.
```bash
NAME="${NAME:-$(basename -s .git "$(git -C "$REPO" remote get-url origin 2>/dev/null)")}"
PROJECT="$(printf '%s' "$NAME" | tr '[:upper:]' '[:lower:]' \
  | sed -E 's/[^a-z0-9-]+/-/g; s/-{2,}/-/g; s/^-+//; s/-+$//' \
  | cut -c1-58 | sed -E 's/-+$//')"
[ -n "$PROJECT" ] || PROJECT="mav-site"
```

## 5. Ensure the project exists (idempotent create)

Attempt-create and tolerate "already exists" — one API call, more robust than grepping the
`project list` table:
```bash
FIRST_DEPLOY=false
if CREATE_OUT="$($WRANGLER pages project create "$PROJECT" --production-branch main 2>&1)"; then
  FIRST_DEPLOY=true
elif ! printf '%s' "$CREATE_OUT" | grep -qi 'already exists'; then
  printf '%s\n' "$CREATE_OUT" | tail -5   # real failure (bad token/account) → report and stop
fi
```

## 6. Deploy

```bash
$WRANGLER pages deploy "$STAGE" \
  --project-name "$PROJECT" \
  --branch main \
  --commit-dirty=true \
  > "$LOG" 2>&1
```
- `--branch main` **always**: it matches the project's production branch, so every deploy
  is a production deployment and the stable `https://<project>.pages.dev` alias serves it
  regardless of the local git branch (this repo is often on a `feature/*` branch, which
  wrangler would otherwise treat as a preview deployment).
- `--commit-dirty=true` suppresses the uncommitted-changes prompt.

On failure, reply with the last ~15 lines of the log (`401`/`403` → the token lacks the
*Cloudflare Pages: Edit* permission; a name-taken-by-another-account error surfaces here too).

## 7. Extract the URL and reply

```bash
DEPLOY_URL="$(grep -Eo 'https://[a-zA-Z0-9.-]+\.pages\.dev' "$LOG" | tail -1)"
PROD_URL="https://${PROJECT}.pages.dev"
```
Post `PROD_URL` as the headline — stable across redeploys and correct because the deploy
always targets the production branch — with the hash-prefixed `DEPLOY_URL` as the immutable
deployment link. If the grep finds nothing but wrangler exited 0, still post `PROD_URL` and
note the deployment link couldn't be parsed.

Reply format — concise:
- On success: `✅ Deployed <project> to Cloudflare Pages` — `🌐 https://<project>.pages.dev`,
  `deployment: <DEPLOY_URL>`, `source: staged from <REPO>` (file count + size). When
  `FIRST_DEPLOY=true`, add: first deploy — the pages.dev subdomain can take a few minutes to
  provision DNS/SSL; retry shortly if the first visit errors.
- On failure: the step that failed, a one-line reason, and the ≤15-line log tail — no raw dumps.

## 8. Clean up

```bash
rm -rf "$STAGE"
```
