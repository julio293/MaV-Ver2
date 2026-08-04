/* ───────────────────────────────────────────────────────────────────────────
   GET /api/figma-sync — pull the latest design tokens + component list from a
   Figma file, so the design system can diff/apply what changed.

   Reads (Cloudflare Pages):
     FIGMA_TOKEN     (secret)  — a Figma personal access token (file read scope)
     FIGMA_FILE_KEY  (env)     — the file key from figma.com/design/{KEY}/…
   You can also pass ?file=KEY to override the file per request.

     npx wrangler pages secret put FIGMA_TOKEN --project-name mav-ver2
     npx wrangler pages secret put FIGMA_FILE_KEY --project-name mav-ver2   # or plain env var

   Returns { ok, configured, file, colors[], text[], components[] }.
   Colors/text come from the file's published/local styles; components from the
   published component set. If nothing is configured it returns configured:false
   and the site shows a "connect Figma" hint (nothing breaks).
   ─────────────────────────────────────────────────────────────────────────── */

const FIGMA = 'https://api.figma.com';

function json(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}
function hex2(n) { return Math.max(0, Math.min(255, Math.round(n * 255))).toString(16).padStart(2, '0'); }
function rgbaToHex(c) { return c ? ('#' + hex2(c.r) + hex2(c.g) + hex2(c.b)) : null; }

async function fig(path, headers) {
  const r = await fetch(FIGMA + path, { headers });
  if (!r.ok) throw new Error('figma ' + r.status + ' ' + (await r.text()).slice(0, 160));
  return r.json();
}

export async function onRequestGet({ request, env }) {
  const token = env.FIGMA_TOKEN;
  const url = new URL(request.url);
  const fileKey = url.searchParams.get('file') || env.FIGMA_FILE_KEY;
  if (!token || !fileKey) return json(200, { ok: false, configured: false });
  const H = { 'X-Figma-Token': token };

  try {
    // file meta (name + lastModified) — shallow
    const meta = await fig(`/v1/files/${fileKey}?depth=1`, H);

    // published/local styles → resolve values via a batched nodes call
    const stylesRes = await fig(`/v1/files/${fileKey}/styles`, H);
    const styles = (stylesRes.meta && stylesRes.meta.styles) || [];
    const fillStyles = styles.filter((s) => s.style_type === 'FILL');
    const textStyles = styles.filter((s) => s.style_type === 'TEXT');
    const ids = styles.map((s) => s.node_id).filter(Boolean).slice(0, 120);
    let nodes = {};
    if (ids.length) { const nr = await fig(`/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(ids.join(','))}`, H); nodes = nr.nodes || {}; }

    // colours: prefer Figma Variables (needs a token with file_variables:read), else FILL styles
    let colors = [];
    let varsError = null;
    try {
      const vr = await fig(`/v1/files/${fileKey}/variables/local`, H);
      const vars = (vr.meta && vr.meta.variables) || {};
      colors = Object.keys(vars).map((id) => vars[id]).filter((v) => v && v.resolvedType === 'COLOR').map((v) => {
        const modes = v.valuesByMode || {}; const mk = Object.keys(modes)[0]; const val = mk ? modes[mk] : null;
        const hex = (val && typeof val === 'object' && typeof val.r === 'number') ? rgbaToHex(val) : null;
        return { name: v.name, hex };
      }).filter((c) => c.hex).slice(0, 300);
    } catch (e) { varsError = String(e && e.message || e).slice(0, 120); }
    if (!colors.length) {
      colors = fillStyles.map((s) => {
        const doc = nodes[s.node_id] && nodes[s.node_id].document;
        const fills = (doc && doc.fills) || [];
        const fill = fills.find((f) => f.type === 'SOLID' && f.visible !== false) || fills[0];
        return { name: s.name, hex: fill && fill.color ? rgbaToHex(fill.color) : null };
      }).filter((c) => c.hex);
    }

    const text = textStyles.map((s) => {
      const doc = nodes[s.node_id] && nodes[s.node_id].document;
      const st = doc && doc.style;
      return st ? { name: s.name, family: st.fontFamily || null, size: st.fontSize ? Math.round(st.fontSize) : null, weight: st.fontWeight || null } : null;
    }).filter((t) => t && t.family);

    // components: prefer component SETS (friendly names) over raw variants
    let components = [];
    try {
      const cs = await fig(`/v1/files/${fileKey}/component_sets`, H);
      const sets = (cs.meta && cs.meta.component_sets) || [];
      components = sets.map((s) => ({ name: s.name, key: s.key, nodeId: s.node_id, updated: s.updated_at || null }));
    } catch (e) { /* no published component sets */ }
    if (!components.length) {
      try {
        const cr = await fig(`/v1/files/${fileKey}/components`, H);
        components = ((cr.meta && cr.meta.components) || []).map((c) => ({ name: c.name, key: c.key, nodeId: c.node_id, updated: c.updated_at || null }));
      } catch (e) { /* none */ }
    }
    components = components.slice(0, 400);

    return json(200, {
      ok: true, configured: true,
      file: { name: meta.name || 'Figma file', lastModified: meta.lastModified || null, key: fileKey },
      colors, text, components,
      note: (!colors.length && varsError) ? 'No colour styles/variables readable — token may need file_variables:read scope.' : null,
    });
  } catch (e) {
    return json(502, { ok: false, configured: true, error: String(e && e.message || e).slice(0, 240) });
  }
}
