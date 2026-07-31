/* ───────────────────────────────────────────────────────────────────────────
   POST /api/generate — MaV App Builder's LLM sitemap generator.

   Cloudflare Pages Function. Holds the Anthropic key server-side (never in the
   client). The browser posts { brief, audience, count, catalog } where catalog
   is the builder's real component vocabulary (types + descriptions + variant
   props). We ask Claude to compose a fintech sitemap using ONLY those
   components, forced through a tool schema so the reply is structured JSON.

   Enable by setting the secret:
     npx wrangler pages secret put ANTHROPIC_API_KEY --project-name mav-ver2
   Optional: LLM_MODEL (default claude-sonnet-4-6).

   Without the secret this returns 503 and the client silently falls back to
   its built-in rule-based generator — so the builder always works.
   ─────────────────────────────────────────────────────────────────────────── */

const FINTECH = /\b(fintech|bank|banking|e-?bank|neobank|wallet|pay|payment|payments|card|cards|debit|credit|transfer|transfers|remit|money|finance|financial|loan|loans|lend|lending|invest|investing|trading|stock|stocks|crypto|bitcoin|saving|savings|budget|insurance|account|accounts|transaction|transactions|billing|invoice|expense|expenses|cashflow|currency|forex|mortgage|pension|payroll|checkout|p2p|kyc|atm|deposit|withdraw|ledger|super ?app)\b/i;

function json(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

export async function onRequestGet({ env }) {
  return json(200, { ok: true, configured: !!env.ANTHROPIC_API_KEY });
}

export async function onRequestPost({ request, env }) {
  if (!env.ANTHROPIC_API_KEY) return json(503, { error: 'llm_not_configured' });

  let body;
  try { body = await request.json(); } catch (e) { return json(400, { error: 'bad_json' }); }
  const brief = String(body.brief || '').slice(0, 800);
  const audience = String(body.audience || '').slice(0, 200);
  const count = Math.max(1, Math.min(12, parseInt(body.count, 10) || 6));
  const catalog = Array.isArray(body.catalog) ? body.catalog.slice(0, 120) : [];

  if (!FINTECH.test(brief)) return json(422, { error: 'not_fintech' });
  if (!catalog.length) return json(400, { error: 'no_catalog' });

  // Build the allowed-component vocabulary for the system prompt.
  const vocab = catalog.map((c) => {
    const props = Array.isArray(c.props) ? c.props.map((p) => (p.options ? `${p.key} (one of: ${p.options.join(', ')})` : `${p.key} (text)`)).join('; ') : '';
    return `- ${c.type} — ${c.label}: ${c.desc || ''}${props ? ` | props: ${props}` : ''}`;
  }).join('\n');

  const system =
    'You are a senior product designer for FINTECH and e-banking mobile apps. ' +
    'Given a short brief and a target audience, design a realistic app sitemap: a set of pages, each broken into ordered sections. ' +
    'You MUST use ONLY the component types listed below — never invent a type. Put realistic, on-brief microcopy into each section\'s props ' +
    '(labels, amounts, titles, captions) so the screens read like the described product and audience. ' +
    'Guidelines: put an "appbar" first on most pages and a "bottomnav" last on main app pages (home/cards/activity/profile). ' +
    'Use "splash" only as its own first page if an onboarding/launch page is warranted. Keep each page to ~3–7 sections. ' +
    'Only set props whose keys are listed for that component; omit props you are unsure about.\n\n' +
    'ALLOWED COMPONENTS:\n' + vocab;

  const tool = {
    name: 'emit_sitemap',
    description: 'Return the fintech app sitemap: pages, each with ordered sections built from the allowed components.',
    input_schema: {
      type: 'object',
      properties: {
        appName: { type: 'string', description: 'Short product name inferred from the brief' },
        pages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Page name, e.g. Dashboard, Cards, Transfer' },
              sections: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', description: 'A component type from the allowed list' },
                    props: { type: 'object', description: 'Copy/config props for this component (optional)' },
                  },
                  required: ['type'],
                },
              },
            },
            required: ['name', 'sections'],
          },
        },
      },
      required: ['pages'],
    },
  };

  const payload = {
    model: env.LLM_MODEL || 'claude-sonnet-4-6',
    max_tokens: 3000,
    system,
    tools: [tool],
    tool_choice: { type: 'tool', name: 'emit_sitemap' },
    messages: [{ role: 'user', content: `Brief: ${brief}\nTarget audience: ${audience || 'general consumers'}\nGenerate exactly ${count} pages.` }],
  };

  let r;
  try {
    r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(payload),
    });
  } catch (e) { return json(502, { error: 'upstream_unreachable' }); }

  if (!r.ok) { const t = await r.text().catch(() => ''); return json(502, { error: 'upstream_error', status: r.status, detail: t.slice(0, 240) }); }

  const data = await r.json().catch(() => null);
  const block = data && Array.isArray(data.content) ? data.content.find((b) => b.type === 'tool_use') : null;
  if (!block || !block.input || !Array.isArray(block.input.pages)) return json(502, { error: 'no_structured_output' });

  return json(200, block.input);
}
