/* ───────────────────────────────────────────────────────────────────────────
   POST /api/generate — MaV App Builder's LLM sitemap generator.

   Provider-agnostic. Works with Anthropic, OpenAI, Google Gemini, or
   OpenRouter — pick one with env vars; swap any time without code changes.
   Handles BOTH:
     • text prompt  -> compose a fintech sitemap (Case 3 / Figma / app-name)
     • screenshots  -> read the images, recreate the screens in MaV components
                       and extract a brand palette (Case 2, "Rebuild from app")

   ── Enable a provider (Cloudflare Pages secrets) ──
     Google Gemini (free tier, has vision — good to start with):
       npx wrangler pages secret put GEMINI_API_KEY   --project-name mav-ver2
       npx wrangler pages secret put LLM_PROVIDER      # value: gemini
     OpenAI:      OPENAI_API_KEY      + LLM_PROVIDER=openai
     OpenRouter:  OPENROUTER_API_KEY  + LLM_PROVIDER=openrouter
     Anthropic:   ANTHROPIC_API_KEY   + LLM_PROVIDER=anthropic   (or leave unset)
   Optional: LLM_MODEL overrides the per-provider default model.

   If nothing is configured the endpoint returns 503 and the client falls back
   to its built-in rule-based generator — so the builder always works.
   ─────────────────────────────────────────────────────────────────────────── */

const FINTECH = /\b(fintech|bank|banking|e-?bank|neobank|wallet|pay|payment|payments|card|cards|debit|credit|transfer|transfers|remit|money|finance|financial|loan|loans|lend|lending|invest|investing|trading|stock|stocks|crypto|bitcoin|saving|savings|budget|insurance|account|accounts|transaction|transactions|billing|invoice|expense|expenses|cashflow|currency|forex|mortgage|pension|payroll|checkout|p2p|kyc|atm|deposit|withdraw|ledger|super ?app)\b/i;

const MODELS = { anthropic: 'claude-sonnet-4-6', openai: 'gpt-4o-mini', gemini: 'gemini-2.0-flash', openrouter: 'google/gemini-2.0-flash-exp:free' };
const SCHEMA_HINT = '{"appName": string, "pages": [{"name": string, "sections": [{"type": string, "props": object}]}], "palette": [up to 5 brand colours as hex strings]}';

function json(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}
function keyFor(env, p) { return ({ anthropic: env.ANTHROPIC_API_KEY, openai: env.OPENAI_API_KEY, gemini: env.GEMINI_API_KEY, openrouter: env.OPENROUTER_API_KEY })[p]; }
function pickProvider(env) {
  const explicit = (env.LLM_PROVIDER || '').toLowerCase();
  if (explicit && keyFor(env, explicit)) return explicit;
  for (const p of ['anthropic', 'openai', 'gemini', 'openrouter']) if (keyFor(env, p)) return p;
  return null;
}
function extractJson(t) {
  if (!t) return null;
  try { return JSON.parse(t); } catch (e) {}
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {} }
  return null;
}

export async function onRequestGet({ env }) {
  const p = pickProvider(env);
  return json(200, { ok: true, configured: !!p, provider: p, model: p ? (env.LLM_MODEL || MODELS[p]) : null });
}

export async function onRequestPost({ request, env }) {
  const provider = pickProvider(env);
  if (!provider) return json(503, { error: 'llm_not_configured' });
  const model = env.LLM_MODEL || MODELS[provider];

  let body;
  try { body = await request.json(); } catch (e) { return json(400, { error: 'bad_json' }); }
  const brief = String(body.brief || '').slice(0, 800);
  const audience = String(body.audience || '').slice(0, 200);
  const count = Math.max(1, Math.min(12, parseInt(body.count, 10) || 6));
  const catalog = Array.isArray(body.catalog) ? body.catalog.slice(0, 120) : [];
  const images = (Array.isArray(body.images) ? body.images : []).slice(0, 10)
    .filter((im) => im && typeof im.data === 'string')
    .map((im) => ({ mime: String(im.mime || 'image/jpeg'), data: im.data }));

  if (!catalog.length) return json(400, { error: 'no_catalog' });
  // text prompts must read as fintech; screenshot imports skip the text guard
  if (!images.length && !FINTECH.test(brief)) return json(422, { error: 'not_fintech' });

  const vocab = catalog.map((c) => {
    const props = Array.isArray(c.props) ? c.props.map((p) => (p.options ? `${p.key} (one of: ${p.options.join(', ')})` : `${p.key} (text)`)).join('; ') : '';
    return `- ${c.type} — ${c.label}: ${c.desc || ''}${props ? ` | props: ${props}` : ''}`;
  }).join('\n');

  const common =
    'You are a senior product designer for FINTECH and e-banking mobile apps. ' +
    'You MUST use ONLY the component types listed below — never invent a type. ' +
    'Only set props whose keys are listed for that component; omit props you are unsure about. ' +
    'Put realistic, on-brief microcopy into props. Put an "appbar" first on most pages and a "bottomnav" last on main app pages. ' +
    'Keep each page to ~3-7 sections.';
  const system = images.length
    ? common + '\n\nYou are shown SCREENSHOTS of an existing app. Identify each distinct screen and its sections, mapping every UI element to the closest allowed component, and recreate the same screens and flow. Also extract the app\'s dominant brand colours into "palette" (hex). ' +
      'Return ONLY a JSON object of shape: ' + SCHEMA_HINT + '\n\nALLOWED COMPONENTS:\n' + vocab
    : common + '\n\nReturn ONLY a JSON object of shape: ' + SCHEMA_HINT + '\n\nALLOWED COMPONENTS:\n' + vocab;

  const userText = images.length
    ? `Rebuild this app in the MaV design system. Context: ${brief || 'an existing fintech app'}. Audience: ${audience || 'general'}. Produce up to ${count} pages from the screenshots.`
    : `Brief: ${brief}\nTarget audience: ${audience || 'general consumers'}\nGenerate exactly ${count} pages.`;

  let out;
  try {
    if (provider === 'anthropic') out = await callAnthropic(env, model, system, userText, images);
    else if (provider === 'gemini') out = await callGemini(env, model, system, userText, images);
    else out = await callOpenAICompat(provider, env, model, system, userText, images); // openai | openrouter
  } catch (e) {
    return json(502, { error: 'upstream_error', provider, detail: String(e && e.message || e).slice(0, 260) });
  }
  if (!out || !Array.isArray(out.pages)) return json(502, { error: 'no_structured_output', provider });
  return json(200, { pages: out.pages, palette: Array.isArray(out.palette) ? out.palette.slice(0, 6) : null, provider });
}

/* ── provider adapters ─────────────────────────────────────────────────── */
async function callAnthropic(env, model, system, userText, images) {
  const content = [{ type: 'text', text: userText }];
  images.forEach((im) => content.push({ type: 'image', source: { type: 'base64', media_type: im.mime, data: im.data } }));
  const tool = {
    name: 'emit_sitemap',
    description: 'Return the fintech app sitemap.',
    input_schema: { type: 'object', properties: {
      appName: { type: 'string' },
      pages: { type: 'array', items: { type: 'object', properties: {
        name: { type: 'string' },
        sections: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, props: { type: 'object' } }, required: ['type'] } },
      }, required: ['name', 'sections'] } },
      palette: { type: 'array', items: { type: 'string' } },
    }, required: ['pages'] },
  };
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model, max_tokens: 3200, system, tools: [tool], tool_choice: { type: 'tool', name: 'emit_sitemap' }, messages: [{ role: 'user', content }] }),
  });
  if (!r.ok) throw new Error('anthropic ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const d = await r.json();
  const b = (d.content || []).find((x) => x.type === 'tool_use');
  if (!b) throw new Error('no tool_use');
  return b.input;
}

async function callGemini(env, model, system, userText, images) {
  const parts = [{ text: userText }];
  images.forEach((im) => parts.push({ inlineData: { mimeType: im.mime, data: im.data } }));
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent?key=' + env.GEMINI_API_KEY;
  const r = await fetch(url, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts }], generationConfig: { responseMimeType: 'application/json', temperature: 0.4, maxOutputTokens: 3200 } }),
  });
  if (!r.ok) throw new Error('gemini ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const d = await r.json();
  const txt = d && d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts && d.candidates[0].content.parts[0] && d.candidates[0].content.parts[0].text;
  const obj = extractJson(txt);
  if (!obj) throw new Error('gemini no json');
  return obj;
}

async function callOpenAICompat(provider, env, model, system, userText, images) {
  const base = provider === 'openrouter' ? 'https://openrouter.ai/api/v1' : 'https://api.openai.com/v1';
  const key = provider === 'openrouter' ? env.OPENROUTER_API_KEY : env.OPENAI_API_KEY;
  const userContent = [{ type: 'text', text: userText }];
  images.forEach((im) => userContent.push({ type: 'image_url', image_url: { url: 'data:' + im.mime + ';base64,' + im.data } }));
  const headers = { 'content-type': 'application/json', authorization: 'Bearer ' + key };
  if (provider === 'openrouter') { headers['HTTP-Referer'] = 'https://mav-ver2.pages.dev'; headers['X-Title'] = 'MaV App Builder'; }
  const r = await fetch(base + '/chat/completions', {
    method: 'POST', headers,
    body: JSON.stringify({ model, max_tokens: 3200, temperature: 0.4, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: system }, { role: 'user', content: userContent }] }),
  });
  if (!r.ok) throw new Error(provider + ' ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const d = await r.json();
  const txt = d && d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content;
  const obj = extractJson(txt);
  if (!obj) throw new Error(provider + ' no json');
  return obj;
}
