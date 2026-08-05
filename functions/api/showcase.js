/* ───────────────────────────────────────────────────────────────────────────
   /api/showcase — store & list published builder concepts for the Showcase.

   GET            → { stored, items:[{id,name,brief,device,screens,createdAt}] }
   GET ?id=ID     → { item: <full project> | null }
   POST <project> → { stored:true, id }   (saves the project)

   Persistence: a Cloudflare **KV** namespace bound as `SHOWCASE`. When it's not
   bound, GET returns stored:false / empty and POST returns stored:false — the
   client then uses localStorage so the feature still works per-browser.

   ── Enable shared storage (one-time) ──
     npx wrangler kv namespace create SHOWCASE      # note the id
     # bind it to the Pages project (dashboard: Settings → Functions → KV
     # bindings → variable "SHOWCASE" → the namespace), then redeploy.
   ─────────────────────────────────────────────────────────────────────────── */

function json(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}
const INDEX = 'index';

export async function onRequestGet({ request, env }) {
  const kv = env.SHOWCASE;
  const id = new URL(request.url).searchParams.get('id');
  if (id) {
    if (!kv) return json(200, { item: null, stored: false });
    const raw = await kv.get('sc:' + id);
    return json(200, { item: raw ? JSON.parse(raw) : null, stored: true });
  }
  if (!kv) return json(200, { stored: false, items: [] });
  const idx = await kv.get(INDEX);
  return json(200, { stored: true, items: idx ? JSON.parse(idx) : [] });
}

export async function onRequestPost({ request, env }) {
  const kv = env.SHOWCASE;
  let p;
  try { p = await request.json(); } catch (e) { return json(400, { error: 'bad_json' }); }
  if (!p || !p.screens || !Array.isArray(p.order)) return json(400, { error: 'invalid_project' });
  if (!kv) return json(200, { stored: false });

  const id = (crypto.randomUUID && crypto.randomUUID()) || ('id' + Date.now().toString(36));
  const createdAt = Date.now();
  const item = Object.assign({ id, createdAt }, p);
  await kv.put('sc:' + id, JSON.stringify(item));

  const summary = { id, name: String(p.name || 'Untitled concept').slice(0, 80), brief: String(p.brief || '').slice(0, 160), device: p.device || null, screens: p.order.length, createdAt };
  let idx = [];
  try { idx = JSON.parse((await kv.get(INDEX)) || '[]'); } catch (e) {}
  idx.unshift(summary);
  await kv.put(INDEX, JSON.stringify(idx.slice(0, 200)));

  return json(200, { stored: true, id });
}
