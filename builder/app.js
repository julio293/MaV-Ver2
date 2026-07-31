/* ══════════════════════════════════════════════════════════════════════════
   MaV App Builder — Sitemap → Wireframe → Style Guide → Visual
   Vanilla JS. State-driven. Every screen is composed of real MaV components.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  let uid = 0; const nid = (p) => `${p}${++uid}`;

  const ACCENTS = [
    { n: 'Indigo', v: '#352eff' }, { n: 'Blue', v: '#0053ff' }, { n: 'Lime', v: '#a1ff5b' },
    { n: 'Periwinkle', v: '#7c9dff' }, { n: 'Green', v: '#629c28' }, { n: 'Magenta', v: '#ff00ff' },
  ];
  const RADII = [{ n: 'Sharp', v: 0 }, { n: 'Subtle', v: 4 }, { n: 'Default', v: 8 }, { n: 'Soft', v: 12 }, { n: 'Round', v: 18 }];
  const FONTS = [{ n: 'Plus Jakarta', v: "'Plus Jakarta Sans',sans-serif" }, { n: 'Inter', v: "'Inter',sans-serif" }];
  /* typography pairings — heading + body */
  const TYPE_PAIRS = [
    { n: 'Jakarta · Inter', head: "'Plus Jakarta Sans',sans-serif", body: "'Inter',sans-serif" },
    { n: 'Sora · Inter', head: "'Sora',sans-serif", body: "'Inter',sans-serif" },
    { n: 'Grotesk · DM Sans', head: "'Space Grotesk',sans-serif", body: "'DM Sans',sans-serif" },
    { n: 'Fraunces · Manrope', head: "'Fraunces',serif", body: "'Manrope',sans-serif" },
    { n: 'Manrope', head: "'Manrope',sans-serif", body: "'Manrope',sans-serif" },
  ];
  /* one-click design concepts (accent + radius + typography [+ dark]) */
  const STYLE_CONCEPTS = [
    { n: 'Indigo', accent: '#352eff', radius: 8, head: TYPE_PAIRS[0].head, body: TYPE_PAIRS[0].body },
    { n: 'Ocean', accent: '#0053ff', radius: 12, head: TYPE_PAIRS[1].head, body: TYPE_PAIRS[1].body },
    { n: 'Emerald', accent: '#1f9d55', radius: 10, head: TYPE_PAIRS[4].head, body: TYPE_PAIRS[4].body },
    { n: 'Grape', accent: '#7c3aed', radius: 14, head: TYPE_PAIRS[2].head, body: TYPE_PAIRS[2].body },
    { n: 'Sunset', accent: '#ff6a3d', radius: 16, head: TYPE_PAIRS[3].head, body: TYPE_PAIRS[3].body },
    { n: 'Midnight', accent: '#a1ff5b', radius: 12, head: TYPE_PAIRS[1].head, body: TYPE_PAIRS[1].body, dark: true },
  ];
  const GAPS = [{ n: 'Compact', v: 8 }, { n: 'Normal', v: 14 }, { n: 'Roomy', v: 20 }, { n: 'Spacious', v: 28 }];
  const PADS = [{ n: 'None', v: 0 }, { n: 'Tight', v: 12 }, { n: 'Default', v: 16 }, { n: 'Wide', v: 24 }];
  const MARGINS = [{ n: 'None', v: 0 }, { n: 'S', v: 12 }, { n: 'M', v: 24 }, { n: 'L', v: 40 }];
  const DEVICE_GROUPS = [
    { group: 'Phone', frame: 'iphone', items: [
      ['iphone17', 'iPhone 17', 402, 874], ['iphone16pro', 'iPhone 16 & 17 Pro', 402, 874],
      ['iphone16', 'iPhone 16', 393, 852], ['iphone16promax', 'iPhone 16 & 17 Pro Max', 440, 956],
      ['iphone16plus', 'iPhone 16 Plus', 430, 932], ['iphoneair', 'iPhone Air', 420, 912],
      ['iphone15promax', 'iPhone 14 & 15 Pro Max', 430, 932], ['iphone15pro', 'iPhone 14 & 15 Pro', 393, 852],
      ['iphone14', 'iPhone 13 & 14', 390, 844], ['iphone14plus', 'iPhone 14 Plus', 428, 926],
    ] },
    { group: 'Android', frame: 'android', items: [
      ['androidc', 'Android Compact', 412, 917], ['androidm', 'Android Medium', 700, 840],
    ] },
    { group: 'Tablet', frame: 'tablet', items: [
      ['ipadmini', 'iPad mini', 744, 1024], ['ipadpro', 'iPad Pro 11"', 834, 1120],
    ] },
  ];
  const DEVICES = {};
  DEVICE_GROUPS.forEach((g) => g.items.forEach(([k, name, w, h]) => { DEVICES[k] = { name, w, h, frame: g.frame }; }));

  const S = {
    stage: 'sitemap',
    screens: {}, order: [], edges: [],
    selScreen: null, selComp: null,
    style: { accent: '#352eff', radius: 8, font: FONTS[0].v, fontHead: FONTS[0].v, space: 14, pad: 16 },
    device: 'iphone16',
    pv: null, smPanel: null, genPalette: null,
  };

  /* ── seed the default e-banking flow ─────────────────────────────────── */
  function seed() {
    S.screens = {}; S.order = []; S.edges = [];
    DEFAULT_FLOW.forEach((name) => {
      const g = screenFromPrompt(name);
      const id = nid('s');
      S.screens[id] = { id, name: g.name, dark: g.dark, comps: g.comps.map((c) => ({ id: nid('c'), ...c })) };
      S.order.push(id);
    });
    S.selScreen = S.order[0];
  }

  /* ── helpers ─────────────────────────────────────────────────────────── */
  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const $ = (s, r = document) => r.querySelector(s);
  /* the builder is fintech-only — accept a prompt only if it reads like a finance product */
  function isFintech(t) {
    return /\b(fintech|bank|banking|e-?bank|neobank|wallet|pay|payment|payments|card|cards|debit|credit|transfer|transfers|remit|money|finance|financial|loan|loans|lend|lending|invest|investing|trading|stock|stocks|crypto|bitcoin|saving|savings|budget|insurance|account|accounts|transaction|transactions|billing|invoice|expense|expenses|cashflow|currency|forex|mortgage|pension|payroll|checkout|p2p|kyc|atm|deposit|withdraw|ledger|super ?app)\b/i.test(t || '');
  }

  function applyVars(node, style, opts = {}) {
    node.style.setProperty('--btn/primary/default', style.accent);
    node.style.setProperty('--bc-primary-light', style.accent);
    node.style.setProperty('--mav-primary', style.accent);
    node.style.setProperty('--btn/textonly/default', style.accent);
    const r = (style.radius | 0) + 'px';
    node.style.setProperty('--border/border-radius/sm', r);
    node.style.setProperty('--border/border-radius/md', r);
    node.style.setProperty('--bld-radius', r);
    if (opts.font !== false) { node.style.setProperty('--font-active', style.font); node.style.setProperty('--font-head', style.fontHead || style.font); }
    if (opts.space) { node.style.setProperty('--bld-space', style.space + 'px'); node.style.setProperty('--bld-pad', (style.pad ?? 16) + 'px'); }
  }

  /* build a screen DOM. mode: 'view' | 'edit'.
     App bar pins to the top, bottom nav pins to the bottom; the rest scrolls. */
  function buildScreen(screen, mode, styled) {
    const scr = el(`<div class="bxscreen"${screen.dark ? ' data-theme="dark"' : ''}></div>`);
    if (styled) applyVars(scr, S.style, { space: true });
    scr.style.setProperty('--bld-space', S.style.space + 'px');
    scr.style.setProperty('--bld-pad', (S.style.pad ?? 16) + 'px');
    const body = el('<div class="bxbody"></div>');
    let bottomWrap = null;
    screen.comps.forEach((c, i) => {
      const cat = CATALOG[c.type]; if (!cat) return;
      const wrap = el(`<div class="bxcomp${cat.bleed ? ' bxbleed' : ''}"></div>`);
      wrap.dataset.cid = c.id;
      wrap.innerHTML = cat.render(c.props || {});
      const isPinned = c.type === 'appbar' || c.type === 'bottomnav';
      if (c.override) {
        applyVars(wrap, { accent: c.override.accent || S.style.accent, radius: c.override.radius ?? S.style.radius, font: S.style.font }, { font: false });
        if (c.override.padx != null) { wrap.style.paddingLeft = c.override.padx + 'px'; wrap.style.paddingRight = c.override.padx + 'px'; }
      }
      applyPos(wrap, c.override || {}, isPinned);
      if (mode === 'edit') {
        if (c.id === S.selComp) wrap.classList.add('sel');
        const tools = el('<div class="bxcomptools"></div>');
        tools.innerHTML = '<button data-a="up">↑</button><button data-a="down">↓</button><button data-a="del">✕</button>';
        tools.querySelector('[data-a=up]').onclick = (e) => { e.stopPropagation(); moveComp(screen, i, -1); };
        tools.querySelector('[data-a=down]').onclick = (e) => { e.stopPropagation(); moveComp(screen, i, 1); };
        tools.querySelector('[data-a=del]').onclick = (e) => { e.stopPropagation(); screen.comps.splice(i, 1); if (S.selComp === c.id) S.selComp = null; render(); };
        wrap.appendChild(tools);
        wrap.addEventListener('click', (e) => { if (e.target.closest('.bxcomptools')) return; S.selComp = (S.selComp === c.id ? null : c.id); render(); });
      }
      if (c.type === 'appbar') { wrap.classList.add('bxpin'); scr.appendChild(wrap); }        // pinned top
      else if (c.type === 'bottomnav') { wrap.classList.add('bxpin'); bottomWrap = wrap; }      // pinned bottom
      else if (cat.fullscreen) { wrap.classList.add('bxfull'); scr.appendChild(wrap); }         // fills the whole screen
      else body.appendChild(wrap);
    });
    scr.appendChild(body);
    if (bottomWrap) scr.appendChild(bottomWrap);
    return scr;
  }

  function moveComp(screen, i, d) {
    const j = i + d; if (j < 0 || j >= screen.comps.length) return;
    [screen.comps[i], screen.comps[j]] = [screen.comps[j], screen.comps[i]];
    render();
  }

  /* apply position/alignment overrides to a component wrap (fully idempotent —
     resets every prop it owns each call so live edits & clears behave). */
  function applyPos(wrap, ov, pinned) {
    const po = ov.pos || {};
    wrap.style.transform = ''; wrap.style.textAlign = '';
    wrap.style.display = ''; wrap.style.flexDirection = ''; wrap.style.alignItems = '';
    wrap.style.marginTop = ''; wrap.style.marginBottom = '';
    // vertical placement — flex auto-margins win over the spacing "margin above" token
    if (!pinned && (po.ay === 'bottom' || po.ay === 'middle')) {
      wrap.style.marginTop = 'auto';
      if (po.ay === 'middle') wrap.style.marginBottom = 'auto';
    } else if (ov.mt != null) {
      wrap.style.marginTop = ov.mt + 'px';
    }
    // horizontal alignment — box becomes a column so intrinsic-width content aligns
    if (po.ax) {
      wrap.style.display = 'flex'; wrap.style.flexDirection = 'column';
      wrap.style.alignItems = po.ax === 'center' ? 'center' : po.ax === 'right' ? 'flex-end' : 'flex-start';
      wrap.style.textAlign = po.ax;
    }
    // free nudge + rotation + flips
    const tf = [];
    if (po.x) tf.push(`translateX(${po.x}px)`);
    if (po.y) tf.push(`translateY(${po.y}px)`);
    if (po.rot) tf.push(`rotate(${po.rot}deg)`);
    if (po.flipH) tf.push('scaleX(-1)');
    if (po.flipV) tf.push('scaleY(-1)');
    wrap.style.transform = tf.join(' ');
  }
  // live-apply to the on-canvas wrap without a full re-render (keeps input focus)
  function livePos(comp, pinned) {
    document.querySelectorAll(`.bxcomp[data-cid="${comp.id}"]`).forEach((w) => applyPos(w, comp.override, pinned));
  }

  function phone(screen, { wf, styled, cap }) {
    const dv = DEVICES[S.device] || DEVICES.iphone16;
    const p = el(`<div class="bxphone ${dv.frame}${wf ? ' wf' : ''}"></div>`);
    p.style.setProperty('--dw', dv.w + 'px'); p.style.setProperty('--dh', dv.h + 'px');
    p.style.width = dv.w + 'px';                       // explicit — avoids var() height collapse
    if (cap) p.appendChild(el(`<div class="bxcap">${screen.name}</div>`));
    p.appendChild(el('<div class="bxnotch"></div>'));
    const holder = el('<div class="bxholder"></div>');
    holder.style.height = dv.h + 'px';                 // explicit device height (correct portrait ratio)
    holder.appendChild(buildScreen(screen, S.stage === 'wireframe' ? 'edit' : 'view', styled));
    p.appendChild(holder);
    return p;
  }

  /* ══ STEPPER ══════════════════════════════════════════════════════════ */
  const STAGES = [['sitemap', 'Sitemap', 'Plan'], ['wireframe', 'Wireframe', 'Structure'], ['style', 'Style Guide', 'Conceptualize'], ['visual', 'Visual', 'Look & Feel']];
  function renderStepper() {
    const wrap = $('#steps'); wrap.innerHTML = '';
    const cur = STAGES.findIndex((s) => s[0] === S.stage);
    STAGES.forEach((s, i) => {
      if (i) wrap.appendChild(el('<div class="step-sep"></div>'));
      const b = el(`<button class="step${i === cur ? ' on' : ''}${i < cur ? ' done' : ''}"><span class="n">${i < cur ? '✓' : i + 1}</span>${s[1]}</button>`);
      b.onclick = () => { S.stage = s[0]; S.selComp = null; S.smPanel = null; render(); };
      wrap.appendChild(b);
    });
  }

  /* ══ SITEMAP — hierarchical page/section tree (Relume-style) ══════════ */
  function renderSitemap(panel, canvas) {
    if (S.smPanel && S.smPanel.type === 'pages') renderPageLibrary(panel);
    else if (S.smPanel && S.smPanel.type === 'section') renderSectionLibrary(panel);
    else renderSitemapTools(panel);

    const board = el('<div class="sm-board"></div>');
    board.appendChild(el('<div class="sm-root"><span class="ico"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></span>Project · e-banking app</div>'));
    board.appendChild(el('<div class="sm-spine"></div>'));
    const col = el('<div class="sm-col"></div>');
    S.order.forEach((id) => col.appendChild(screenCard(S.screens[id])));
    const addBtn = el('<button class="sm-addscreen">+ Add page</button>');
    addBtn.onclick = () => { S.smPanel = { type: 'pages' }; render(); };
    col.appendChild(addBtn);
    board.appendChild(col);
    canvas.appendChild(board);
  }

  function renderSitemapTools(panel) {
    panel.innerHTML = '<div class="panel-h">Plan · project & sitemap</div>';
    const ps = el('<div class="panel-scroll"></div>');
    const gp = el('<button class="hbtn primary" style="width:100%;justify-content:center;margin-bottom:10px">✨ Describe your project</button>');
    gp.onclick = openGenModal;
    ps.appendChild(gp);
    const addp = el('<button class="hbtn" style="width:100%;justify-content:center;margin-bottom:10px">+ Add a page from library</button>');
    addp.onclick = () => { S.smPanel = { type: 'pages' }; render(); };
    ps.appendChild(addp);
    const gen = el('<button class="hbtn" style="width:100%;justify-content:center;margin-bottom:14px">↺ Reset to sample flow</button>');
    gen.onclick = () => { seed(); render(); };
    ps.appendChild(gen);
    ps.appendChild(el('<p class="empty-hint" style="text-align:left;margin:6px 0">Describe your whole project — the builder maps out the pages and breaks each into logical sections built from MaV components. Then edit, reorder (drag), remove (✕), or add pages/sections before moving to Wireframe.</p>'));
    panel.appendChild(ps);
  }

  /* ══ Standalone hero landing — describe your fintech app, then generate ═ */
  const SPARK = '<svg viewBox="0 0 24 24"><path d="M12 2.5l1.9 5.4L19 9.8l-5.1 1.9L12 17l-1.9-5.3L5 9.8l5.1-1.9z"/><path d="M18.5 14.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></svg>';
  function openWelcome() {
    document.querySelectorAll('.hero-back, .wc-back').forEach((n) => n.remove());
    const recos = ['Mobile bank with cards & instant transfers', 'Digital wallet with QR payments', 'Neobank onboarding with KYC', 'Savings app with goals & insights', 'Credit & debit card management', 'Peer-to-peer payments & split bills'];
    const example = 'A mobile banking app for young professionals — debit & credit cards, instant transfers, spending insights and bill payments.';
    const back = el('<div class="hero-back"></div>');
    const h = el('<div class="hero"></div>');
    h.innerHTML =
      '<div class="hero-eyebrow"><span class="hero-mark">' + MARK + '</span> MaV App Builder · Fintech</div>' +
      '<h1 class="hero-title">Describe your fintech app<br>and watch it take shape</h1>' +
      '<p class="hero-sub">One sentence is enough — the builder maps out the pages and the sections each one needs, from your MaV design-system components.</p>' +
      '<div class="hero-bar-wrap"><div class="hero-bar"><input class="hero-input" placeholder="Describe your fintech app in a sentence or two…" spellcheck="false"><button class="hero-go">' + SPARK + 'Generate</button></div></div>' +
      '<div class="hero-belowbar"><span class="hero-err">The builder specialises in <strong>fintech &amp; e-banking</strong> apps — try a banking, payments, wallet, cards, savings or investing product.</span>' +
        '<button class="hero-example">Take it for a spin with an <b>example</b></button></div>' +
      '<div class="hero-reco-label">Or start from a recommendation</div><div class="hero-recos"></div>' +
      '<div class="hero-opts"><label class="hero-opt"><span>Audience</span><input class="gm-aud" placeholder="e.g. young professionals" spellcheck="false"></label>' +
        '<label class="hero-opt"><span>Pages</span><select class="gm-count"></select></label>' +
        '<button class="hero-skip">Skip — use a sample</button></div>';
    back.appendChild(h); document.body.appendChild(back);
    const inp = h.querySelector('.hero-input'), err = h.querySelector('.hero-err'), wrap = h.querySelector('.hero-bar-wrap');
    const rw = h.querySelector('.hero-recos');
    recos.forEach((r) => { const b = el('<button class="hero-reco"></button>'); b.textContent = r; b.onclick = () => { inp.value = r; inp.focus(); err.classList.remove('on'); }; rw.appendChild(b); });
    const sel = h.querySelector('.gm-count');
    [3, 4, 5, 6, 7, 8, 10].forEach((nn) => { const o = document.createElement('option'); o.value = nn; o.textContent = nn + ' pages'; if (nn === 6) o.selected = true; sel.appendChild(o); });
    const close = () => back.remove();
    const go = () => {
      const v = inp.value.trim(); if (!v) { inp.focus(); return; }
      if (!isFintech(v)) { err.classList.add('on'); wrap.classList.add('shake'); setTimeout(() => wrap.classList.remove('shake'), 450); inp.focus(); return; }
      close(); generateProject(v, h.querySelector('.gm-aud').value.trim(), parseInt(sel.value, 10) || 6);
    };
    h.querySelector('.hero-go').onclick = go;
    h.querySelector('.hero-example').onclick = () => { inp.value = example; inp.focus(); err.classList.remove('on'); };
    h.querySelector('.hero-skip').onclick = close;
    inp.addEventListener('input', () => err.classList.remove('on'));
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    setTimeout(() => inp.focus(), 40);
  }

  /* ══ Project prompt → full sitemap (modal) ═══════════════════════════ */
  function openGenModal() {
    document.querySelectorAll('.genmodal-back').forEach((n) => n.remove());
    const back = el('<div class="genmodal-back"></div>');
    const m = el('<div class="genmodal"></div>');
    m.innerHTML =
      '<div class="gm-title">✨ Describe your project</div>' +
      '<div class="gm-sub">Tell the builder what you\'re making. It generates a structured sitemap — the key pages and the sections each one needs — from your MaV components.</div>' +
      '<textarea class="gm-ta" rows="3" placeholder="e.g. An e-banking app with standard features plus debit &amp; credit card management"></textarea>' +
      '<div class="wc-err gm-err">The builder specialises in <strong>fintech &amp; e-banking</strong> apps — try a banking, payments, wallet, cards, savings or investing product.</div>' +
      '<div class="gm-eglabel">Try one of these</div><div class="gm-chips"></div>' +
      '<div class="gm-row2">' +
        '<label class="gm-field"><span class="gm-k">Target audience</span><input class="gm-aud" placeholder="e.g. young professionals" spellcheck="false"></label>' +
        '<label class="gm-field gm-field-sm"><span class="gm-k">Pages</span><select class="gm-count"></select></label>' +
      '</div>' +
      '<div class="gm-actions"><button class="hbtn gm-cancel">Cancel</button><button class="hbtn primary gm-go">Generate sitemap →</button></div>';
    const chips = ['E-banking app with debit & credit cards', 'Digital wallet with transfers & QR pay',
      'Neobank: onboarding, KYC & dashboard', 'Savings app with goals & statements'];
    const cw = m.querySelector('.gm-chips');
    const ta = m.querySelector('.gm-ta');
    const err = m.querySelector('.gm-err');
    chips.forEach((c) => { const b = el('<button class="gm-chip"></button>'); b.textContent = c; b.onclick = () => { ta.value = c; ta.focus(); err.classList.remove('on'); }; cw.appendChild(b); });
    const sel = m.querySelector('.gm-count');
    [3, 4, 5, 6, 7, 8, 10].forEach((nn) => { const o = document.createElement('option'); o.value = nn; o.textContent = nn + ' pages'; if (nn === 6) o.selected = true; sel.appendChild(o); });
    const close = () => back.remove();
    const go = () => {
      const v = ta.value.trim(); if (!v) { ta.focus(); return; }
      if (!isFintech(v)) { err.classList.add('on'); m.classList.add('shake'); setTimeout(() => m.classList.remove('shake'), 450); ta.focus(); return; }
      close(); generateProject(v, m.querySelector('.gm-aud').value.trim(), parseInt(sel.value, 10) || 6);
    };
    ta.addEventListener('input', () => err.classList.remove('on'));
    m.querySelector('.gm-go').onclick = go;
    m.querySelector('.gm-cancel').onclick = close;
    ta.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') go(); if (e.key === 'Escape') close(); });
    back.appendChild(m);
    back.addEventListener('click', (e) => { if (e.target === back) close(); });
    document.body.appendChild(back);
    setTimeout(() => ta.focus(), 30);
  }

  /* build the whole sitemap from a project brief (replaces current screens) */
  function generateProject(desc, audience, count) {
    const pages = projectFromPrompt(desc, audience, count);
    S.screens = {}; S.order = []; S.smPanel = null;
    pages.forEach((g) => {
      const id = nid('s');
      S.screens[id] = { id, name: g.name, dark: g.dark, comps: g.comps.map((c) => ({ id: nid('c'), ...c })) };
      S.order.push(id);
    });
    S.selScreen = S.order[0];
    S.stage = 'sitemap';
    render();
  }

  function renderPageLibrary(panel) {
    panel.innerHTML = '<div class="panel-h">Add a Page</div>';
    const head = el('<div class="prompt"><input placeholder="Search e-banking pages…"><button title="Close">✕</button></div>');
    head.querySelector('button').onclick = () => { S.smPanel = null; render(); };
    panel.appendChild(head);
    const ps = el('<div class="panel-scroll"></div>'); const list = el('<div style="padding-top:10px"></div>'); ps.appendChild(list);
    const draw = (q) => {
      list.innerHTML = '';
      PAGE_LIBRARY.filter((n) => n.toLowerCase().includes(q)).forEach((n) => {
        const b = el(`<button class="pick"><span class="pi"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg></span><span style="flex:1">${n}</span><span style="color:var(--e-accent);font-weight:800">+</span></button>`);
        b.onclick = () => addScreen(n);
        list.appendChild(b);
      });
    };
    draw(''); head.querySelector('input').addEventListener('input', (e) => draw(e.target.value.toLowerCase()));
    panel.appendChild(ps);
  }

  function renderSectionLibrary(panel) {
    const screen = S.screens[S.smPanel.sid];
    panel.innerHTML = `<div class="panel-h">Add a Section · ${screen ? screen.name : ''}</div>`;
    const head = el('<div class="prompt"><input placeholder="Search sections…"><button title="Close">✕</button></div>');
    head.querySelector('button').onclick = () => { S.smPanel = null; render(); };
    panel.appendChild(head);
    const ps = el('<div class="panel-scroll"></div>'); const list = el('<div style="padding-top:6px"></div>'); ps.appendChild(list);
    const draw = (q) => {
      list.innerHTML = '';
      GROUPS.forEach((g) => {
        const items = Object.entries(CATALOG).filter(([t, c]) => c.group === g && (c.label.toLowerCase().includes(q) || (DESC[t] || '').toLowerCase().includes(q)));
        if (!items.length) return;
        list.appendChild(el(`<div class="pick-group">${g}</div>`));
        items.forEach(([t, c]) => {
          const b = el(`<button class="pick"><span class="pi"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/></svg></span><span style="flex:1;text-align:left"><span style="display:block">${c.label}</span><span style="display:block;font-size:10.5px;color:var(--e-muted);font-weight:500">${DESC[t] || ''}</span></span><span style="color:var(--e-accent);font-weight:800">+</span></button>`);
          b.onclick = () => { screen.comps.push({ id: nid('c'), type: t, props: {} }); render(); };
          attachPreview(b, t);
          list.appendChild(b);
        });
      });
    };
    draw(''); head.querySelector('input').addEventListener('input', (e) => draw(e.target.value.toLowerCase()));
    ps.addEventListener('scroll', () => { clearTimeout(palTimer); hidePalettePreview(); });
    panel.appendChild(ps);
  }

  function screenCard(screen) {
    const card = el(`<div class="sm-card${screen.id === S.selScreen ? ' sel' : ''}"></div>`);
    const h = el('<div class="sm-h"><span class="ico"><svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M9 18h6"/></svg></span></div>');
    const nm = el('<input class="nm">'); nm.value = screen.name;
    nm.onchange = () => { screen.name = nm.value || 'Screen'; };
    nm.onkeydown = (e) => { if (e.key === 'Enter') nm.blur(); };
    nm.onclick = (e) => e.stopPropagation();
    h.appendChild(nm);
    const menu = el('<button class="sm-menu">⋯</button>');
    menu.onclick = (e) => { e.stopPropagation(); screenMenu(e, screen); };
    h.appendChild(menu);
    h.onclick = () => { S.selScreen = screen.id; S.selComp = null; render(); };
    card.appendChild(h);

    const secs = el('<div class="sm-sections"></div>');
    if (!screen.comps.length) secs.appendChild(el('<div class="sm-empty">No sections yet — add one below</div>'));
    screen.comps.forEach((c) => secs.appendChild(secBlock(screen, c)));
    card.appendChild(secs);
    makeSortable(secs, screen);

    const foot = el('<div class="sm-foot"></div>');
    const addSec = el('<button>+ Section</button>');
    addSec.onclick = () => { S.selScreen = screen.id; S.smPanel = { type: 'section', sid: screen.id }; render(); };
    const genC = el('<button class="gen">✦ Generate content</button>');
    genC.onclick = () => { const g = screenFromPrompt(screen.name); screen.comps = g.comps.map((x) => ({ id: nid('c'), ...x })); render(); };
    foot.appendChild(addSec); foot.appendChild(genC);
    card.appendChild(foot);
    return card;
  }

  function secBlock(screen, c) {
    const cat = CATALOG[c.type]; const label = cat ? cat.label : c.type;
    const b = el(`<div class="sm-sec${c.id === S.selComp ? ' sel' : ''}" data-cid="${c.id}"></div>`);
    b.appendChild(el('<span class="grip" title="Drag to reorder">⠿</span>'));
    const st = el('<div class="st"></div>');
    st.appendChild(el(`<div class="t"></div>`)); st.lastChild.textContent = label;
    st.appendChild(el(`<div class="d"></div>`)); st.lastChild.textContent = DESC[c.type] || '';
    b.appendChild(st);
    const x = el('<button class="x">✕</button>');
    x.onclick = (e) => { e.stopPropagation(); const i = screen.comps.indexOf(c); if (i >= 0) screen.comps.splice(i, 1); if (S.selComp === c.id) S.selComp = null; render(); };
    b.appendChild(x);
    b.onclick = () => { S.selScreen = screen.id; S.selComp = (S.selComp === c.id ? null : c.id); render(); };
    return b;
  }

  function makeSortable(listEl, screen) {
    listEl.querySelectorAll('.sm-sec').forEach((sec) => {
      const grip = sec.querySelector('.grip'); if (!grip) return;
      grip.addEventListener('pointerdown', (e) => {
        e.preventDefault(); e.stopPropagation();
        const secs = [...listEl.querySelectorAll('.sm-sec')];
        const startIdx = secs.indexOf(sec); let curIdx = startIdx;
        sec.classList.add('dragging'); grip.setPointerCapture(e.pointerId);
        const move = (ev) => {
          secs.forEach((s) => s.classList.remove('over'));
          let t = 0;
          secs.forEach((s) => { const r = s.getBoundingClientRect(); if (ev.clientY > r.top + r.height / 2) t += 1; });
          curIdx = Math.max(0, Math.min(secs.length - 1, t > startIdx ? t - 1 : t));
          if (curIdx !== startIdx && secs[curIdx]) secs[curIdx].classList.add('over');
        };
        const up = () => {
          grip.removeEventListener('pointermove', move); grip.removeEventListener('pointerup', up);
          if (curIdx !== startIdx) { const [m] = screen.comps.splice(startIdx, 1); screen.comps.splice(curIdx, 0, m); }
          render();
        };
        grip.addEventListener('pointermove', move); grip.addEventListener('pointerup', up);
      });
    });
  }

  function screenMenu(e, screen) {
    popMenu(e.clientX, e.clientY, [
      { label: 'Open in Wireframe', fn: () => { S.selScreen = screen.id; S.stage = 'wireframe'; render(); } },
      { label: screen.dark ? 'Light theme' : 'Dark theme', fn: () => { screen.dark = !screen.dark; render(); } },
      { label: 'Duplicate', fn: () => { const id = nid('s'); const i = S.order.indexOf(screen.id); S.screens[id] = { id, name: screen.name + ' copy', dark: screen.dark, comps: screen.comps.map((c) => ({ ...JSON.parse(JSON.stringify(c)), id: nid('c') })) }; S.order.splice(i + 1, 0, id); S.selScreen = id; render(); } },
      { label: 'Delete', danger: true, fn: () => { delete S.screens[screen.id]; S.order = S.order.filter((x) => x !== screen.id); if (S.selScreen === screen.id) S.selScreen = S.order[0] || null; render(); } },
    ]);
  }

  function popMenu(x, y, items) {
    document.querySelectorAll('.pop').forEach((p) => p.remove());
    const m = el('<div class="pop"></div>'); m.style.left = Math.min(x, innerWidth - 170) + 'px'; m.style.top = y + 'px';
    items.forEach((it) => { const b = el(`<button${it.danger ? ' class="danger"' : ''}></button>`); b.textContent = it.label; b.onclick = () => { m.remove(); it.fn(); }; m.appendChild(b); });
    document.body.appendChild(m);
    setTimeout(() => document.addEventListener('pointerdown', function off(ev) { if (!m.contains(ev.target)) { m.remove(); document.removeEventListener('pointerdown', off, true); } }, true), 0);
  }

  function addScreen(prompt) {
    const g = screenFromPrompt(prompt);
    const id = nid('s');
    S.screens[id] = { id, name: g.name, dark: g.dark, comps: g.comps.map((c) => ({ id: nid('c'), ...c })) };
    S.order.push(id); S.selScreen = id; S.smPanel = null; render();
    // make the new screen obvious: scroll it into view + flash it
    requestAnimationFrame(() => {
      const c = document.querySelector('.sm-card.sel');
      if (c) { c.scrollIntoView({ behavior: 'smooth', block: 'center' }); c.classList.add('sm-flash'); setTimeout(() => c.classList.remove('sm-flash'), 1300); }
    });
  }

  /* ══ shared prompt bar ════════════════════════════════════════════════ */
  function promptBar(ph, onSubmit) {
    const w = el('<div></div>');
    const bar = el(`<div class="prompt"><input placeholder="${ph}"><button>Generate</button></div>`);
    const go = () => { const v = bar.querySelector('input').value.trim(); if (v) { onSubmit(v); } };
    bar.querySelector('button').onclick = go;
    bar.querySelector('input').addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    w.appendChild(bar);
    w.appendChild(el('<div class="hint">Prompt-based · builds from MaV components (rule-based in this prototype)</div>'));
    return w;
  }

  /* ══ WIREFRAME ════════════════════════════════════════════════════════ */
  /* ── palette hover preview — renders the real component in a mini card ── */
  let palTimer = null;
  function hidePalettePreview() { document.querySelectorAll('.pal-prev').forEach((n) => n.remove()); }
  function showPalettePreview(type, anchor) {
    hidePalettePreview();
    const c = CATALOG[type]; if (!c) return;
    const pop = el('<div class="pal-prev"></div>');
    pop.innerHTML = '<div class="pal-prev-h"><span class="t">' + esc(c.label) + '</span><span class="d">' + esc(DESC[type] || '') + '</span></div>';
    const scr = el('<div class="bxscreen pal-prev-scr' + (c.bleed ? ' pal-bleed' : '') + '"></div>');
    applyVars(scr, S.style, { space: true, font: true });
    const wrap = el('<div class="bxcomp' + (c.bleed ? ' bxbleed' : '') + '"></div>');
    try { wrap.innerHTML = c.render({}); } catch (e) { wrap.textContent = c.label; }
    scr.appendChild(wrap); pop.appendChild(scr);
    document.body.appendChild(pop);
    const r = anchor.getBoundingClientRect();
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    let left = r.right + 12; if (left + pw > innerWidth - 8) left = Math.max(8, r.left - pw - 12);
    const top = Math.max(8, Math.min(r.top - 6, innerHeight - ph - 8));
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
  }
  function attachPreview(btn, type) {
    btn.addEventListener('mouseenter', () => { clearTimeout(palTimer); palTimer = setTimeout(() => showPalettePreview(type, btn), 110); });
    btn.addEventListener('mouseleave', () => { clearTimeout(palTimer); hidePalettePreview(); });
  }

  function renderWireframe(panel, canvas) {
    hidePalettePreview();
    panel.appendChild(promptBar('e.g. “login with biometric”', (v) => { const g = screenFromPrompt(v); const s = S.screens[S.selScreen]; s.comps = g.comps.map((c) => ({ id: nid('c'), ...c })); s.name = g.name; s.dark = g.dark; render(); }));
    panel.appendChild(el('<div class="panel-h">Components · tap to add</div>'));
    const ps = el('<div class="panel-scroll"></div>');
    GROUPS.forEach((g) => {
      ps.appendChild(el(`<div class="pick-group">${g}</div>`));
      Object.entries(CATALOG).filter(([, c]) => c.group === g).forEach(([type, c]) => {
        const b = el(`<button class="pick"><span class="pi"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/></svg></span>${c.label}</button>`);
        b.onclick = () => { const s = S.screens[S.selScreen]; s.comps.push({ id: nid('c'), type, props: {} }); render(); };
        attachPreview(b, type);
        ps.appendChild(b);
      });
    });
    ps.addEventListener('scroll', () => { clearTimeout(palTimer); hidePalettePreview(); });
    panel.appendChild(ps);

    S.order.forEach((id) => {
      const s = S.screens[id];
      const p = phone(s, { wf: true, cap: true });
      if (id === S.selScreen) { p.style.outline = '3px solid var(--e-accent)'; p.style.outlineOffset = '6px'; }
      p.addEventListener('pointerdown', () => { if (S.selScreen !== id) { S.selScreen = id; S.selComp = null; render(); } }, true);
      canvas.appendChild(p);
    });
    renderInspector();
  }

  /* ══ STYLE GUIDE ══════════════════════════════════════════════════════ */
  /* palette helpers — generate harmonious accents on demand */
  function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    const to = (x) => Math.round(255 * x).toString(16).padStart(2, '0');
    return '#' + to(f(0)) + to(f(8)) + to(f(4));
  }
  function generatePalette() {
    const base = Math.floor(Math.random() * 360);
    S.genPalette = [0, 1, 2, 3, 4].map((i) => hslToHex((base + i * 54) % 360, 70, 54));
    render();
  }
  function applyConcept(c) {
    S.style.accent = c.accent; S.style.radius = c.radius;
    S.style.font = c.body; S.style.fontHead = c.head;
    Object.keys(S.screens).forEach((id) => { S.screens[id].dark = !!c.dark; });
    render();
  }

  function renderStyle(panel, canvas) {
    panel.innerHTML = '<div class="panel-h">Style guide</div>';
    const ps = el('<div class="panel-scroll"></div>');
    // ── design concepts (one-click visual directions) ──
    ps.appendChild(el('<div class="sg-block"><div class="sg-label">Design concept</div><div class="sg-hint2">Pitch a visual direction — sets colour, corners &amp; type together</div></div>'));
    const cc = el('<div class="sg-concepts"></div>');
    STYLE_CONCEPTS.forEach((c) => {
      const on = S.style.accent === c.accent && S.style.radius === c.radius && S.style.font === c.body;
      const b = el(`<button class="sg-concept${on ? ' on' : ''}"><span class="sg-concept-sw" style="background:${c.accent}"></span>${c.n}</button>`);
      b.onclick = () => applyConcept(c); cc.appendChild(b);
    });
    ps.lastChild.appendChild(cc);
    // ── primary color + generate ──
    const col = el('<div class="sg-block"><div class="sg-label" style="display:flex;justify-content:space-between;align-items:center">Primary color<button class="sg-gen">✨ Generate</button></div></div>');
    col.querySelector('.sg-gen').onclick = generatePalette;
    const swr = el('<div class="sw-row"></div>');
    ACCENTS.forEach((a) => { const s = el(`<div class="sw${S.style.accent === a.v ? ' on' : ''}" title="${a.n}" style="background:${a.v}"></div>`); s.onclick = () => { S.style.accent = a.v; render(); }; swr.appendChild(s); });
    col.appendChild(swr);
    if (S.genPalette && S.genPalette.length) {
      const gp = el('<div class="sw-row" style="margin-top:9px"></div>');
      S.genPalette.forEach((hex) => { const s = el(`<div class="sw${S.style.accent === hex ? ' on' : ''}" title="${hex}" style="background:${hex}"></div>`); s.onclick = () => { S.style.accent = hex; render(); }; gp.appendChild(s); });
      col.appendChild(el('<div class="sg-hint2" style="margin-top:9px">Generated palette · click to apply</div>'));
      col.appendChild(gp);
    }
    ps.appendChild(col);
    // radius
    ps.appendChild(sgOptions('Corner radius', RADII, S.style.radius, (v) => { S.style.radius = v; render(); }));
    // typography pairings
    ps.appendChild(sgOptions('Typography', TYPE_PAIRS.map((p) => ({ n: p.n, v: p.body })), S.style.font, (v) => {
      const p = TYPE_PAIRS.find((x) => x.body === v); S.style.font = v; if (p) S.style.fontHead = p.head; render();
    }));
    // spacing
    ps.appendChild(sgOptions('Gap (between components)', GAPS, S.style.space, (v) => { S.style.space = v; render(); }));
    ps.appendChild(sgOptions('Screen padding', PADS, S.style.pad, (v) => { S.style.pad = v; render(); }));
    // live sample
    const sample = el('<div class="sg-block"><div class="sg-label">Live sample</div><div class="sg-sample"></div></div>');
    const smp = sample.querySelector('.sg-sample'); applyVars(smp, S.style, { font: true });
    smp.style.fontFamily = S.style.font;
    smp.innerHTML = `<div class="bld-flabel">Amount</div><div class="field is-focus" style="margin-bottom:12px"><input value="$250.00" readonly></div>
      <button class="mav-btn mav-btn-primary mav-btn-lg" style="width:100%">Send money</button>
      <div style="margin-top:12px"><span class="chip chip-primary">Primary</span> <span class="b b-green">Success</span></div>`;
    ps.appendChild(sample);
    panel.appendChild(ps);

    S.order.forEach((id) => canvas.appendChild(phone(S.screens[id], { styled: true, cap: true })));
  }
  function sgOptions(label, opts, cur, on) {
    const b = el(`<div class="sg-block"><div class="sg-label">${label}</div><div class="opt-row"></div></div>`);
    const row = b.querySelector('.opt-row');
    opts.forEach((o) => { const btn = el(`<button class="opt${cur === o.v ? ' on' : ''}">${o.n}</button>`); btn.onclick = () => on(o.v); row.appendChild(btn); });
    return b;
  }

  /* ══ VISUAL ═══════════════════════════════════════════════════════════ */
  function renderVisual(panel, canvas) {
    panel.appendChild(promptBar('Generate another screen…', (v) => addScreen(v)));
    panel.appendChild(el('<div class="panel-h">Prototype</div>'));
    const ps = el('<div class="panel-scroll"></div>');
    const pv = el('<button class="hbtn primary" style="width:100%;justify-content:center">▶  Play interactive preview</button>');
    pv.onclick = () => openPreview(S.selScreen || S.order[0]);
    ps.appendChild(pv);
    ps.appendChild(el('<p class="empty-hint" style="text-align:left;margin:14px 0">Pick a device frame from the top bar. Tap the primary action on a screen to move to the next screen; use the app-bar back arrow to go back.</p>'));
    panel.appendChild(ps);

    S.order.forEach((id) => {
      const p = phone(S.screens[id], { styled: true, cap: true });
      p.style.cursor = 'pointer';
      p.addEventListener('click', () => openPreview(id));
      canvas.appendChild(p);
    });
  }

  /* ══ INSPECTOR (component customization) ══════════════════════════════ */
  /* ── Position / Alignment (Figma-style) ─────────────────────────────── */
  const POS_ICON = {
    left:   '<svg viewBox="0 0 24 24"><path d="M4 3v18"/><rect x="8" y="6" width="11" height="4.6" rx="1.2"/><rect x="8" y="13.4" width="7" height="4.6" rx="1.2"/></svg>',
    center: '<svg viewBox="0 0 24 24"><path d="M12 3v18"/><rect x="6.5" y="6" width="11" height="4.6" rx="1.2"/><rect x="8.5" y="13.4" width="7" height="4.6" rx="1.2"/></svg>',
    right:  '<svg viewBox="0 0 24 24"><path d="M20 3v18"/><rect x="5" y="6" width="11" height="4.6" rx="1.2"/><rect x="9" y="13.4" width="7" height="4.6" rx="1.2"/></svg>',
    top:    '<svg viewBox="0 0 24 24"><path d="M3 4h18"/><rect x="6" y="8" width="4.6" height="11" rx="1.2"/><rect x="13.4" y="8" width="4.6" height="7" rx="1.2"/></svg>',
    middle: '<svg viewBox="0 0 24 24"><path d="M3 12h18"/><rect x="6" y="6.5" width="4.6" height="11" rx="1.2"/><rect x="13.4" y="8.5" width="4.6" height="7" rx="1.2"/></svg>',
    bottom: '<svg viewBox="0 0 24 24"><path d="M3 20h18"/><rect x="6" y="5" width="4.6" height="11" rx="1.2"/><rect x="13.4" y="9" width="4.6" height="7" rx="1.2"/></svg>',
    flipH:  '<svg viewBox="0 0 24 24"><path d="M12 3v18" stroke-dasharray="2 2.4"/><path d="M9.5 7.5 5 12l4.5 4.5z" style="fill:currentColor"/><path d="M14.5 7.5 19 12l-4.5 4.5"/></svg>',
    flipV:  '<svg viewBox="0 0 24 24"><path d="M3 12h18" stroke-dasharray="2 2.4"/><path d="M7.5 9.5 12 5l4.5 4.5z" style="fill:currentColor"/><path d="M7.5 14.5 12 19l4.5-4.5"/></svg>',
    rot:    '<svg viewBox="0 0 24 24"><path d="M5 20v-6"/><path d="M5 14 20 20"/></svg>',
  };
  function positionPanel(comp, pinned) {
    comp.override.pos = comp.override.pos || {};
    const po = comp.override.pos;
    const sec = el('<div class="pos-sec"></div>');
    sec.innerHTML = '<div class="pos-head"><span class="sg-label" style="margin:0;color:var(--e-fg)">Position</span><button class="pos-reset">Reset</button></div>';
    sec.querySelector('.pos-reset').onclick = () => { comp.override.pos = {}; render(); };

    // alignment groups
    const aln = el('<div class="pos-aln"></div>');
    const grp = (items, key) => {
      const g = el('<div class="pos-grp"></div>');
      items.forEach(([val, title]) => {
        const b = el(`<button class="pos-btn${po[key] === val ? ' on' : ''}" title="${title}">${POS_ICON[val]}</button>`);
        b.onclick = () => { if (po[key] === val) delete po[key]; else po[key] = val; render(); };
        g.appendChild(b);
      });
      return g;
    };
    aln.appendChild(grp([['left', 'Align left'], ['center', 'Align horizontal centre'], ['right', 'Align right']], 'ax'));
    aln.appendChild(grp([['top', 'Align top'], ['middle', 'Align vertical centre'], ['bottom', 'Align bottom']], 'ay'));
    sec.appendChild(aln);
    if (pinned) sec.appendChild(el('<p class="pos-hint">This block is pinned to the screen edge — vertical alignment is limited; nudge & rotation still apply.</p>'));

    // numeric field helper (live-applies, keeps focus)
    const field = (k, prop, unit) => {
      const f = el(`<label class="pos-field"><span class="k">${k}</span><input type="text" inputmode="numeric" value="${po[prop] || 0}">${unit ? `<span class="k">${unit}</span>` : ''}</label>`);
      const inp = f.querySelector('input');
      inp.addEventListener('input', () => {
        const n = parseInt(inp.value, 10);
        if (!n || isNaN(n)) delete po[prop]; else po[prop] = n;
        livePos(comp, pinned);
      });
      return f;
    };
    const xy = el('<div class="pos-fields"></div>');
    xy.appendChild(field('X', 'x')); xy.appendChild(field('Y', 'y'));
    sec.appendChild(xy);

    // rotation + flips
    const rr = el('<div class="pos-rotrow"></div>');
    const rf = el('<label class="pos-field" style="flex:0 0 42%"></label>');
    rf.innerHTML = `<span class="k">${POS_ICON.rot}</span><input type="text" inputmode="numeric" value="${po.rot || 0}"><span class="k">°</span>`;
    rf.querySelector('.k').classList.add('pos-k-ico');
    const rinp = rf.querySelector('input');
    rinp.addEventListener('input', () => { const n = parseInt(rinp.value, 10); if (!n || isNaN(n)) delete po.rot; else po.rot = n; livePos(comp, pinned); });
    rr.appendChild(rf);
    const fg = el('<div class="pos-grp"></div>');
    const fh = el(`<button class="pos-btn${po.flipH ? ' on' : ''}" title="Flip horizontal">${POS_ICON.flipH}</button>`);
    fh.onclick = () => { if (po.flipH) delete po.flipH; else po.flipH = true; render(); };
    const fv = el(`<button class="pos-btn${po.flipV ? ' on' : ''}" title="Flip vertical">${POS_ICON.flipV}</button>`);
    fv.onclick = () => { if (po.flipV) delete po.flipV; else po.flipV = true; render(); };
    fg.appendChild(fh); fg.appendChild(fv);
    rr.appendChild(fg);
    sec.appendChild(rr);
    return sec;
  }

  /* ── variant controls: infer control type, render a Figma-style row ──── */
  function ctrlType(v) {
    if (v.ctrl) return v.ctrl;
    if (v.opts && v.opts.length === 2 && v.opts.every((o) => typeof o[1] === 'boolean')) return 'toggle';
    if (v.opts) return 'select';
    return 'text';
  }
  // live-update a component's rendered markup in-canvas without a full re-render
  function liveProps(comp) {
    const cat = CATALOG[comp.type]; if (!cat) return;
    document.querySelectorAll(`.bxcomp[data-cid="${comp.id}"]`).forEach((w) => {
      const tools = w.querySelector('.bxcomptools');
      w.innerHTML = cat.render(comp.props || {});
      if (tools) w.appendChild(tools);
    });
  }
  function variantRow(comp, v) {
    const cur = comp.props[v.key] !== undefined ? comp.props[v.key] : v.def;
    const type = ctrlType(v);
    const row = el(`<div class="vc-row"><span class="vc-lbl">${v.label}</span></div>`);
    if (type === 'toggle') {
      const t = el(`<span class="ctl-tgl${cur ? ' on' : ''}" role="switch" tabindex="0"></span>`);
      const flip = () => { comp.props[v.key] = !cur; render(); };
      t.onclick = flip;
      t.onkeydown = (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } };
      row.appendChild(t);
    } else if (type === 'text') {
      const wrap = el('<div class="vc-ctl"></div>');
      const inp = el(`<input class="vc-text" type="text" value="${esc(cur == null ? '' : cur)}" placeholder="${esc(v.def || '')}">`);
      inp.addEventListener('input', () => { comp.props[v.key] = inp.value; liveProps(comp); });
      wrap.appendChild(inp); row.appendChild(wrap);
    } else { // select dropdown — value stored by index to preserve type (bool/num/str)
      const wrap = el('<div class="vc-ctl"></div>');
      const sel = el('<select class="vc-select"></select>');
      v.opts.forEach((o, i) => {
        const opt = document.createElement('option');
        opt.textContent = o[0]; opt.value = String(i);
        if (o[1] === cur) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.onchange = () => { comp.props[v.key] = v.opts[+sel.value][1]; render(); };
      wrap.appendChild(sel); row.appendChild(wrap);
    }
    return row;
  }

  function renderInspector() {
    const rp = $('#rightPanel');
    const comp = S.selComp && S.screens[S.selScreen] && S.screens[S.selScreen].comps.find((c) => c.id === S.selComp);
    if (!comp) { rp.style.display = 'none'; return; }
    rp.style.display = 'flex'; rp.innerHTML = `<div class="panel-h">Customize · ${CATALOG[comp.type].label}</div>`;
    const ps = el('<div class="panel-scroll"></div>');
    comp.override = comp.override || {};
    comp.props = comp.props || {};
    const isPinned = comp.type === 'appbar' || comp.type === 'bottomnav';
    ps.appendChild(positionPanel(comp, isPinned));
    // ── component variants — Figma-style controls (dropdown / toggle / text) ──
    const vs = VARIANTS[comp.type] || [];
    if (vs.length) {
      ps.appendChild(el('<div class="sg-label" style="margin:14px 0 8px;color:var(--e-fg)">Properties</div>'));
      const vc = el('<div class="vc-sec"></div>');
      vs.forEach((v) => vc.appendChild(variantRow(comp, v)));
      ps.appendChild(vc);
    }
    ps.appendChild(el('<div class="sg-label" style="margin:16px 0 2px;color:var(--e-fg)">Style &amp; spacing</div>'));
    ps.appendChild(el('<div class="sg-block"><div class="sg-label">Accent override</div></div>'));
    const swr = el('<div class="sw-row"></div>');
    const none = el(`<div class="sw${!comp.override.accent ? ' on' : ''}" title="Use style guide" style="background:repeating-linear-gradient(45deg,#333,#333 4px,#555 4px,#555 8px)"></div>`);
    none.onclick = () => { delete comp.override.accent; render(); }; swr.appendChild(none);
    ACCENTS.forEach((a) => { const s = el(`<div class="sw${comp.override.accent === a.v ? ' on' : ''}" style="background:${a.v}"></div>`); s.onclick = () => { comp.override.accent = a.v; render(); }; swr.appendChild(s); });
    ps.lastChild.appendChild(swr);
    ps.appendChild(sgOptions('Corner radius', [{ n: 'Inherit', v: undefined }].concat(RADII), comp.override.radius, (v) => { if (v === undefined) delete comp.override.radius; else comp.override.radius = v; render(); }));
    ps.appendChild(sgOptions('Margin (space above)', MARGINS, comp.override.mt ?? 0, (v) => { if (!v) delete comp.override.mt; else comp.override.mt = v; render(); }));
    ps.appendChild(sgOptions('Padding (sides)', [{ n: 'Inherit', v: undefined }, { n: 'Flush', v: 0 }, { n: 'Inset', v: 28 }], comp.override.padx, (v) => { if (v === undefined) delete comp.override.padx; else comp.override.padx = v; render(); }));
    const th = el('<div class="sg-block"><div class="sg-label">Screen theme</div></div>');
    const opt = el('<div class="opt-row"></div>');
    const scr = S.screens[S.selScreen];
    [['Light', false], ['Dark', true]].forEach(([n, val]) => { const b = el(`<button class="opt${!!scr.dark === val ? ' on' : ''}">${n}</button>`); b.onclick = () => { scr.dark = val; render(); }; opt.appendChild(b); });
    th.appendChild(opt); ps.appendChild(th);
    rp.appendChild(ps);
  }

  /* ══ PREVIEW (interactive prototype) ══════════════════════════════════ */
  function nextOf(id) { const i = S.order.indexOf(id); return S.order[i + 1]; }
  function openPreview(id) { S.pv = { id, hist: [] }; drawPreview('in'); $('#preview').classList.add('on'); }
  function closePreview() { S.pv = null; $('#preview').classList.remove('on'); }
  function navPreview(to, dir) { if (!to) return; if (dir !== 'back') S.pv.hist.push(S.pv.id); S.pv.id = to; drawPreview(dir); }
  function drawPreview(dir) {
    const stage = $('#pvStage'); stage.innerHTML = '';
    const s = S.screens[S.pv.id];
    const p = phone(s, { styled: true, cap: false });
    p.classList.add('pv-stage');
    const holder = p.querySelector('.bxholder'); holder.classList.add('pv-screen-anim'); if (dir === 'back') holder.classList.add('back');
    // hotspots
    p.querySelectorAll('[data-cta]').forEach((btn) => { btn.style.cursor = 'pointer'; btn.addEventListener('click', (e) => { ripple(e, btn); setTimeout(() => navPreview(nextOf(S.pv.id), 'in'), 90); }); });
    const back = p.querySelector('.ab-ico'); if (back) { back.style.cursor = 'pointer'; back.onclick = () => { const prev = S.pv.hist.pop(); navPreview(prev, 'back'); }; }
    p.querySelectorAll('.bnav-item').forEach((b, i) => { b.style.cursor = 'pointer'; b.onclick = (e) => { ripple(e, b); const nx = nextOf(S.pv.id); if (nx) setTimeout(() => navPreview(nx, 'in'), 90); }; });
    stage.appendChild(p);
    $('#pvName').textContent = s.name + (nextOf(S.pv.id) ? '  →  tap the action to continue' : '  ·  end of flow');
  }
  function ripple(e, host) {
    const r = document.createElement('span'); r.className = 'ripple';
    const b = host.getBoundingClientRect(); const d = Math.max(b.width, b.height);
    r.style.width = r.style.height = d + 'px'; r.style.left = (e.clientX - b.left - d / 2) + 'px'; r.style.top = (e.clientY - b.top - d / 2) + 'px';
    host.style.position = host.style.position || 'relative'; host.appendChild(r); setTimeout(() => r.remove(), 520);
  }

  /* ══ device / frame picker (header) ══════════════════════════════════ */
  function renderDeviceCtl() {
    const host = $('#deviceCtl'); if (!host) return;
    host.innerHTML = '';
    if (!['wireframe', 'style', 'visual'].includes(S.stage)) return;
    const dv = DEVICES[S.device] || DEVICES.iphone16;
    const btn = el(`<button class="dev-btn"><svg viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5.5h4"/></svg>${dv.name} <span class="dim">${dv.w}×${dv.h}</span><span class="cv">▾</span></button>`);
    btn.onclick = (e) => { e.stopPropagation(); framesPopover(btn); };
    host.appendChild(btn);
  }
  function framesPopover(anchor) {
    document.querySelectorAll('.pop').forEach((p) => p.remove());
    const r = anchor.getBoundingClientRect();
    const m = el('<div class="pop frames"></div>');
    m.style.left = Math.max(8, Math.min(r.left, innerWidth - 324)) + 'px'; m.style.top = (r.bottom + 6) + 'px';
    DEVICE_GROUPS.forEach((g) => {
      m.appendChild(el(`<div class="fg">${g.group}</div>`));
      g.items.forEach(([k, name, w, h]) => {
        const row = el(`<div class="fr${k === S.device ? ' on' : ''}"><span>${name}</span><span class="dim">${w}×${h}</span></div>`);
        row.onclick = () => { S.device = k; m.remove(); render(); };
        m.appendChild(row);
      });
    });
    document.body.appendChild(m);
    setTimeout(() => document.addEventListener('pointerdown', function off(ev) { if (!m.contains(ev.target)) { m.remove(); document.removeEventListener('pointerdown', off, true); } }, true), 0);
  }

  /* ══ SAVE / EXPORT ════════════════════════════════════════════════════
     Hands off a functional build: a self-contained HTML prototype (real MaV
     markup + styles, tap-through nav) or a runnable Expo React-Native App.js. */
  function download(name, text, mime) {
    const blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 500);
  }
  async function fetchText(u) { try { const r = await fetch(u); return r.ok ? await r.text() : ''; } catch (e) { return ''; } }

  /* Static React-Native UI library emitted into every RN export. Theme-aware
     via context; every screen composes these. NB: no backticks / ${} inside. */
  const RN_LIB = `
/* ── UI library (generated from your MaV design system) ─────────────── */
const lightT = { bg: '#ffffff', card: '#f6f7f9', text: '#171717', sub: '#71757f', line: '#ececec' };
const darkT  = { bg: '#141414', card: '#1e1e1e', text: '#ededed', sub: '#9aa0aa', line: '#2a2a2a' };
const ThemeCtx = React.createContext(lightT);
const useT = () => React.useContext(ThemeCtx);

function Screen({ dark, children }) {
  const c = dark ? darkT : lightT;
  return (
    <ThemeCtx.Provider value={c}>
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>{children}</SafeAreaView>
    </ThemeCtx.Provider>
  );
}
function AppBar({ title, back, action, onBack }) {
  const c = useT();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 52, borderBottomWidth: 1, borderColor: c.line, backgroundColor: c.bg }}>
      <View style={{ width: 40 }}>{back ? <Text onPress={onBack} style={{ fontSize: 30, color: c.text, marginTop: -6 }}>‹</Text> : null}</View>
      <Text style={{ flex: 1, textAlign: 'center', fontWeight: '700', fontSize: 16, color: c.text }}>{title}</Text>
      <View style={{ width: 40, alignItems: 'flex-end' }}>{action ? <Text style={{ fontSize: 20, color: c.text }}>{action === 'close' ? '×' : '⋯'}</Text> : null}</View>
    </View>
  );
}
function H1({ text }) { const c = useT(); return <Text style={{ color: c.text, fontSize: 26, fontWeight: '800', letterSpacing: -0.4 }}>{text}</Text>; }
function Sub({ text }) { const c = useT(); return <Text style={{ color: c.sub, fontSize: 15, lineHeight: 22 }}>{text}</Text>; }
function Btn({ label, variant, size, full, iconRight, disabled, onPress }) {
  const c = useT(); variant = variant || 'primary';
  const primary = variant === 'primary';
  const bg = primary ? T.accent : 'transparent';
  const fg = primary ? T.onAccent : (variant === 'clear' ? T.accent : c.text);
  const h = size === 'sm' ? 42 : size === 'md' ? 48 : 54;
  return (
    <TouchableOpacity activeOpacity={0.85} disabled={disabled} onPress={onPress}
      style={{ height: h, borderRadius: T.radius + 4, backgroundColor: bg, borderWidth: variant === 'secondary' ? 1 : 0, borderColor: c.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: full === false ? 'flex-start' : 'stretch', paddingHorizontal: full === false ? 24 : 0, opacity: disabled ? 0.45 : 1 }}>
      {label ? <Text style={{ color: fg, fontSize: 16, fontWeight: '700' }}>{label}</Text> : null}
      {iconRight ? <Text style={{ color: fg, fontSize: 17, fontWeight: '700', marginLeft: 8 }}>→</Text> : null}
    </TouchableOpacity>
  );
}
function Field({ label, placeholder, value, secure, prefix }) {
  const c = useT();
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={{ color: c.sub, fontSize: 13, fontWeight: '600' }}>{label}</Text> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 52, borderRadius: T.radius + 2, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, paddingHorizontal: 14, gap: 8 }}>
        {prefix ? <Text style={{ color: c.text, fontWeight: '600' }}>{prefix}</Text> : null}
        <TextInput style={{ flex: 1, color: c.text, fontSize: 15 }} placeholder={placeholder} placeholderTextColor={c.sub} defaultValue={value} secureTextEntry={!!secure} />
      </View>
    </View>
  );
}
function Otp({ value }) {
  const c = useT(); const arr = [0, 1, 2, 3, 4, 5];
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {arr.map(function (i) { const ch = (value || '')[i]; return (
        <View key={i} style={{ flex: 1, height: 54, borderRadius: T.radius + 2, borderWidth: 1, borderColor: ch ? T.accent : c.line, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: c.text, fontSize: 20, fontWeight: '700' }}>{ch || ''}</Text>
        </View>); })}
    </View>
  );
}
function Balance({ label, amount, trend, onPress }) {
  const c = useT();
  return (
    <View style={{ gap: 14 }}>
      <View style={{ gap: 6 }}>
        <Text style={{ color: c.sub, fontSize: 13, fontWeight: '600' }}>{label}</Text>
        <Text style={{ color: c.text, fontSize: 34, fontWeight: '800', letterSpacing: -0.5 }}>{amount}</Text>
        <Text style={{ color: T.success, fontSize: 12, fontWeight: '700' }}>{trend}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}><Btn label="+  Send" onPress={onPress} /></View>
        <View style={{ flex: 1 }}><Btn label="+  Request" variant="secondary" onPress={onPress} /></View>
      </View>
    </View>
  );
}
function Amount({ cur, value, caption }) {
  const c = useT();
  return (
    <View style={{ alignItems: 'center', gap: 6, paddingVertical: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Text style={{ color: c.sub, fontSize: 22, fontWeight: '700', marginTop: 6 }}>{cur}</Text>
        <Text style={{ color: c.text, fontSize: 46, fontWeight: '800' }}>{value}</Text>
      </View>
      <Text style={{ color: c.sub, fontSize: 13 }}>{caption}</Text>
    </View>
  );
}
function SectionHeader({ title }) {
  const c = useT();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
      <Text style={{ color: c.text, fontSize: 16, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: T.accent, fontSize: 13, fontWeight: '600' }}>See all</Text>
    </View>
  );
}
function Txns() {
  const c = useT();
  const rows = [['Salary — GTBank', 'Transfer · 09:14', '+₦350,000', true], ['Airtime — MTN', 'Bill payment · 11:45', '−₦2,000', false], ['P2P — James K.', 'Send money · 14:33', '−₦20,000', false]];
  return (
    <View>
      {rows.map(function (r, i) { return (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: r[3] ? T.success : T.danger, fontSize: 18, fontWeight: '700' }}>{r[3] ? '↓' : '↑'}</Text></View>
          <View style={{ flex: 1 }}><Text style={{ color: c.text, fontSize: 14, fontWeight: '600' }}>{r[0]}</Text><Text style={{ color: c.sub, fontSize: 12 }}>{r[1]}</Text></View>
          <Text style={{ color: r[3] ? T.success : c.text, fontSize: 14, fontWeight: '700' }}>{r[2]}</Text>
        </View>); })}
    </View>
  );
}
function Contacts() {
  const c = useT();
  const rows = [['J', 'Julio Santos', '•••• 6467'], ['M', 'Mom', '•••• 2210'], ['A', 'Amara N.', '•••• 8891']];
  return (
    <View>
      {rows.map(function (r, i) { return (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: T.accent, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontWeight: '700' }}>{r[0]}</Text></View>
          <View style={{ flex: 1 }}><Text style={{ color: c.text, fontSize: 14, fontWeight: '600' }}>{r[1]}</Text><Text style={{ color: c.sub, fontSize: 12 }}>{r[2]}</Text></View>
        </View>); })}
    </View>
  );
}
function ToggleRow({ label, on }) {
  const c = useT(); const [val, setVal] = useState(!!on);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: c.line }}>
      <Text style={{ color: c.text, fontSize: 15 }}>{label}</Text>
      <Switch value={val} onValueChange={setVal} trackColor={{ true: T.accent }} />
    </View>
  );
}
function Success({ title, sub }) {
  const c = useT();
  return (
    <View style={{ alignItems: 'center', gap: 12, paddingVertical: 20 }}>
      <View style={{ width: 66, height: 66, borderRadius: 33, backgroundColor: T.success, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: 30, fontWeight: '800' }}>✓</Text></View>
      <Text style={{ color: c.text, fontSize: 20, fontWeight: '800' }}>{title}</Text>
      <Text style={{ color: c.sub, fontSize: 14, textAlign: 'center' }}>{sub}</Text>
    </View>
  );
}
function Banner({ kind, title, desc }) {
  const c = useT();
  const map = { primary: T.accent, success: T.success, error: T.danger, danger: T.danger, warning: T.warning, info: T.accent };
  const col = map[kind] || T.accent;
  return (
    <View style={{ flexDirection: 'row', gap: 12, padding: 14, borderRadius: T.radius + 4, backgroundColor: c.card, borderLeftWidth: 3, borderLeftColor: col }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: col, marginTop: 6 }} />
      <View style={{ flex: 1 }}><Text style={{ color: c.text, fontSize: 14, fontWeight: '700' }}>{title}</Text>{desc ? <Text style={{ color: c.sub, fontSize: 13, marginTop: 2 }}>{desc}</Text> : null}</View>
    </View>
  );
}
function Progress({ label, value }) {
  const c = useT(); const v = Math.max(0, Math.min(100, value || 0));
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: c.sub, fontSize: 13 }}>{label}</Text><Text style={{ color: c.sub, fontSize: 13 }}>{v + '%'}</Text></View>
      <View style={{ height: 8, borderRadius: 4, backgroundColor: c.line }}><View style={{ height: 8, borderRadius: 4, width: (v + '%'), backgroundColor: T.accent }} /></View>
    </View>
  );
}
function Badges() {
  const items = [['Active', T.success], ['Pending', T.warning], ['Failed', T.danger], ['New', T.accent]];
  return (<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{items.map(function (b, i) { return (<View key={i} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: b[1] + '22' }}><Text style={{ color: b[1], fontSize: 12, fontWeight: '700' }}>{b[0]}</Text></View>); })}</View>);
}
function Chips() {
  const c = useT(); const items = ['All', 'Income', 'Expense'];
  return (<View style={{ flexDirection: 'row', gap: 8 }}>{items.map(function (t, i) { const on = i === 0; return (<View key={i} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: on ? T.accent : 'transparent', borderWidth: on ? 0 : 1, borderColor: c.line }}><Text style={{ color: on ? '#fff' : c.sub, fontSize: 13, fontWeight: '600' }}>{t}</Text></View>); })}</View>);
}
function Divider() { const c = useT(); return <View style={{ height: 1, backgroundColor: c.line, marginVertical: 4 }} />; }
function Illustration({ src }) { return <View style={{ alignItems: 'center', paddingVertical: 12 }}><Image source={{ uri: src }} style={{ width: 210, height: 168 }} resizeMode="contain" /></View>; }
function PayCard({ number, holder, exp }) {
  return (
    <View style={{ borderRadius: 18, padding: 20, backgroundColor: '#1b1f45', aspectRatio: 311 / 197, justifyContent: 'flex-end', gap: 14 }}>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 2 }}>{number}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View><Text style={{ color: '#9aa0c0', fontSize: 10 }}>Card holder</Text><Text style={{ color: '#fff', fontWeight: '600' }}>{holder}</Text></View>
        <View><Text style={{ color: '#9aa0c0', fontSize: 10 }}>Exp</Text><Text style={{ color: '#fff', fontWeight: '600' }}>{exp}</Text></View>
      </View>
    </View>
  );
}
function Cashflow({ amount, income, expense }) {
  const c = useT();
  return (
    <View style={{ borderRadius: T.radius + 6, backgroundColor: c.card, padding: 16, gap: 14 }}>
      <View><Text style={{ color: c.sub, fontSize: 13 }}>Available Balance</Text><Text style={{ color: c.text, fontSize: 26, fontWeight: '800' }}>{amount}</Text></View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}><Text style={{ color: c.sub, fontSize: 12 }}>Income</Text><Text style={{ color: T.success, fontSize: 15, fontWeight: '700' }}>{income}</Text></View>
        <View style={{ flex: 1 }}><Text style={{ color: c.sub, fontSize: 12 }}>Expense</Text><Text style={{ color: T.danger, fontSize: 15, fontWeight: '700' }}>{expense}</Text></View>
      </View>
    </View>
  );
}
function CheckRow({ label, checked }) {
  const c = useT(); const [on, setOn] = useState(!!checked);
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={function () { setOn(!on); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: on ? T.accent : c.line, backgroundColor: on ? T.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>{on ? <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}>✓</Text> : null}</View>
      <Text style={{ color: c.text, fontSize: 14, flex: 1 }}>{label}</Text>
    </TouchableOpacity>
  );
}
function RadioGroup({ a, b }) {
  const c = useT(); const [sel, setSel] = useState(0); const opts = [a, b];
  return (
    <View style={{ gap: 10 }}>
      {opts.map(function (o, i) { return (
        <TouchableOpacity key={i} activeOpacity={0.7} onPress={function () { setSel(i); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: sel === i ? T.accent : c.line, alignItems: 'center', justifyContent: 'center' }}>{sel === i ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: T.accent }} /> : null}</View>
          <Text style={{ color: c.text, fontSize: 14 }}>{o}</Text>
        </TouchableOpacity>); })}
    </View>
  );
}
function Tabs({ items, active }) {
  const c = useT(); const [sel, setSel] = useState(active || 0);
  return (
    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: c.line }}>
      {items.map(function (t, i) { const on = i === sel; return (
        <TouchableOpacity key={i} onPress={function () { setSel(i); }} style={{ flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderColor: on ? T.accent : 'transparent' }}>
          <Text style={{ color: on ? c.text : c.sub, fontWeight: on ? '700' : '500', fontSize: 14 }}>{t}</Text>
        </TouchableOpacity>); })}
    </View>
  );
}
function Pills({ items, active }) {
  const c = useT(); const [sel, setSel] = useState(active || 0);
  return (
    <View style={{ flexDirection: 'row', backgroundColor: c.card, borderRadius: 999, padding: 4 }}>
      {items.map(function (t, i) { const on = i === sel; return (
        <TouchableOpacity key={i} onPress={function () { setSel(i); }} style={{ flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 999, backgroundColor: on ? T.accent : 'transparent' }}>
          <Text style={{ color: on ? '#fff' : c.sub, fontWeight: '600', fontSize: 13 }}>{t}</Text>
        </TouchableOpacity>); })}
    </View>
  );
}
function Stepper() {
  const c = useT(); const steps = [['Identity', 'done'], ['Address', 'active'], ['Review', 'todo']];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {steps.map(function (s, i) { const st = s[1]; return (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: st === 'todo' ? 'transparent' : T.accent, borderWidth: st === 'todo' ? 1 : 0, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: st === 'todo' ? c.sub : '#fff', fontWeight: '700' }}>{st === 'done' ? '✓' : (i + 1)}</Text></View>
            <Text style={{ color: st === 'active' ? c.text : c.sub, fontSize: 11, marginTop: 4 }}>{s[0]}</Text>
          </View>
          {i < steps.length - 1 ? <View style={{ flex: 1, height: 2, backgroundColor: st === 'todo' ? c.line : T.accent, marginHorizontal: 6, marginBottom: 16 }} /> : null}
        </View>); })}
    </View>
  );
}
function BottomNav({ active, go }) {
  const c = useT(); const items = ['Home', 'Stats', 'Cards', 'Profile'];
  return (
    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: c.line, paddingTop: 10, paddingBottom: 20, backgroundColor: c.bg }}>
      {items.map(function (t, i) { const on = i === (active || 0); return (
        <TouchableOpacity key={i} onPress={go} style={{ flex: 1, alignItems: 'center', gap: 3 }}>
          <View style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: on ? T.accent : c.line }} />
          <Text style={{ color: on ? T.accent : c.sub, fontSize: 11, fontWeight: on ? '700' : '500' }}>{t}</Text>
        </TouchableOpacity>); })}
    </View>
  );
}
function Placeholder({ name }) {
  const c = useT();
  return (<View style={{ padding: 16, borderRadius: T.radius + 2, borderWidth: 1, borderStyle: 'dashed', borderColor: c.line, alignItems: 'center' }}><Text style={{ color: c.sub, fontSize: 13, fontWeight: '600' }}>{name}</Text></View>);
}
`;

  function openExportModal() {
    document.querySelectorAll('.genmodal-back').forEach((n) => n.remove());
    const back = el('<div class="genmodal-back"></div>');
    const m = el('<div class="genmodal"></div>');
    let fmt = 'html';
    const htmlIco = '<svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M10 18h4"/></svg>';
    const rnIco = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="12" rx="10" ry="4.3"/><ellipse cx="12" cy="12" rx="10" ry="4.3" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.3" transform="rotate(120 12 12)"/></svg>';
    m.innerHTML =
      '<div class="gm-title">Export your project</div>' +
      '<div class="gm-sub">Your work isn\'t trapped — take all ' + S.order.length + ' screen(s) out. Pick how you want to continue:</div>' +
      '<div class="exp-cards">' +
        '<button class="exp-card on" data-fmt="html"><span class="tag">Recommended</span><span class="ico">' + htmlIco + '</span><span class="t">Prototype</span><span class="d">Experience the app first — one self-contained HTML file with the real MaV screens. Opens in any browser; tap actions to move between screens.</span></button>' +
        '<button class="exp-card" data-fmt="rn"><span class="tag">Expo</span><span class="ico">' + rnIco + '</span><span class="t">React Native</span><span class="d">Copy the components &amp; structure straight into a React Native canvas — a runnable <code>App.js</code> with your design tokens as a theme.</span></button>' +
      '</div>' +
      '<label class="exp-fname"><span class="k">File name</span><input id="expName" value="mav-app" spellcheck="false"></label>' +
      '<div class="exp-note"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg><span>Images &amp; fonts link to your live design system so the export renders straight away — your frontend can vendor them locally later.</span></div>' +
      '<div class="gm-actions"><button class="hbtn gm-cancel">Cancel</button><button class="hbtn primary gm-export">Download build →</button></div>';
    m.querySelectorAll('.exp-card').forEach((c) => { c.onclick = () => { fmt = c.dataset.fmt; m.querySelectorAll('.exp-card').forEach((x) => x.classList.toggle('on', x === c)); }; });
    const close = () => back.remove();
    m.querySelector('.gm-cancel').onclick = close;
    back.addEventListener('click', (e) => { if (e.target === back) close(); });
    m.querySelector('.gm-export').onclick = async () => {
      const btn = m.querySelector('.gm-export'); btn.textContent = 'Building…'; btn.disabled = true;
      const base = (m.querySelector('#expName').value || 'mav-app').trim().replace(/[^a-z0-9-_]+/gi, '-').replace(/^-+|-+$/g, '') || 'mav-app';
      try {
        if (fmt === 'html') download(base + '.html', await buildHTMLExport(), 'text/html;charset=utf-8');
        else download('App.js', buildRNExport(), 'text/javascript;charset=utf-8');
        close();
      } catch (e) { console.error(e); btn.textContent = 'Error — retry'; btn.disabled = false; }
    };
    back.appendChild(m); document.body.appendChild(back);
    setTimeout(() => { const i = m.querySelector('#expName'); if (i) { i.focus(); i.select(); } }, 40);
  }

  /* ── HTML export — reuse the real render pipeline, inline the real CSS ── */
  async function buildHTMLExport() {
    const origin = location.origin;
    let css = (await fetchText('mav-kit.css') + '\n\n' + await fetchText('builder.css')).replace(/\.\.\//g, origin + '/');
    let body = '';
    S.order.forEach((id, i) => {
      const p = phone(S.screens[id], { styled: true, cap: false });
      p.classList.add('exp-screen'); if (i === 0) p.classList.add('active');
      p.setAttribute('data-name', S.screens[id].name || ('Screen ' + (i + 1)));
      body += p.outerHTML + '\n';
    });
    body = body.replace(/\.\.\//g, origin + '/');
    const extra = 'html,body{margin:0}.exp-body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:radial-gradient(120% 120% at 50% 0,#161a22,#0c0e13);font-family:"Plus Jakarta Sans",system-ui,sans-serif;padding:30px 16px;box-sizing:border-box}.exp-name{color:#e6e8ee;font-size:14px;font-weight:700;letter-spacing:.02em}.exp-stage{position:relative}.exp-screen{display:none}.exp-screen.active{display:block;animation:expIn .34s cubic-bezier(.32,.72,0,1)}@keyframes expIn{from{opacity:0;transform:translateX(22px)}to{opacity:1;transform:none}}.exp-hint{color:#767c8a;font-size:12px;max-width:340px;text-align:center}.exp-dots{display:flex;gap:6px}.exp-dots i{width:7px;height:7px;border-radius:50%;background:#333a48;transition:.22s}.exp-dots i.on{background:#fff;width:18px;border-radius:4px}[data-cta],.bnav-item,.ab-ico{cursor:pointer}';
    const nav = '(' + exportNavFn.toString() + ')();';
    return '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n' +
      '<title>' + esc(document.title.replace(/ Builder$/, '')) + ' — prototype</title>\n<style>' + css + '\n' + extra + '</style></head>\n' +
      '<body class="exp-body"><div class="exp-name" id="expName"></div><div class="exp-stage">' + body + '</div>' +
      '<div class="exp-dots" id="expDots"></div><div class="exp-hint">Tap the primary action or a nav item to go forward · tap the back arrow to go back</div>' +
      '<script>' + nav + '</script></body></html>';
  }
  function exportNavFn() {
    var screens = [].slice.call(document.querySelectorAll('.exp-screen'));
    var cur = 0, hist = [];
    var dots = document.getElementById('expDots'), name = document.getElementById('expName');
    screens.forEach(function () { dots.appendChild(document.createElement('i')); });
    function show(i) {
      if (i == null || i < 0 || i >= screens.length) return;
      screens[cur].classList.remove('active'); cur = i; screens[cur].classList.add('active');
      [].forEach.call(dots.children, function (d, k) { d.className = k === cur ? 'on' : ''; });
      if (name) name.textContent = screens[cur].getAttribute('data-name') || '';
    }
    var fwd = function () { if (cur + 1 < screens.length) { hist.push(cur); show(cur + 1); } };
    screens.forEach(function (sc) {
      sc.querySelectorAll('[data-cta]').forEach(function (b) { b.addEventListener('click', fwd); });
      sc.querySelectorAll('.bnav-item').forEach(function (b) { b.addEventListener('click', fwd); });
      var bk = sc.querySelector('.ab-ico'); if (bk) bk.addEventListener('click', function () { if (hist.length) show(hist.pop()); });
    });
    show(0);
  }

  /* ── React-Native export — a runnable Expo App.js scaffold ───────────── */
  function buildRNExport() {
    const st = S.style;
    const illURL = (s) => location.origin + '/app/assets/illustrations/' + s;
    const A = (v) => '{' + JSON.stringify(v == null ? '' : String(v)) + '}';   // JSX string attr as expression
    const rnComp = (c) => {
      const p = c.props || {};
      switch (c.type) {
        case 'appbar': return '<AppBar title=' + A(p.title || 'Screen') + ' back={' + (p.back === false ? 'false' : 'true') + '} action=' + A(p.action || '') + ' onBack={back} />';
        case 'title': return '<H1 text=' + A(p.text || 'Welcome back') + ' />';
        case 'subtitle': return '<Sub text=' + A(p.text || 'Sign in to continue to your account') + ' />';
        case 'button': return '<Btn label=' + A(p.showText === false ? '' : (p.label || 'Continue')) + ' variant=' + A(p.variant || 'primary') + ' size=' + A(p.size || 'lg') + ' full={' + (p.full === false ? 'false' : 'true') + '} iconRight={' + (p.iconRight ? 'true' : 'false') + '} disabled={' + (p.state === 'disabled' ? 'true' : 'false') + '} onPress={go} />';
        case 'buttonSecondary': return '<Btn label=' + A(p.label || 'Cancel') + ' variant="secondary" size=' + A(p.size || 'lg') + ' full={' + (p.full === false ? 'false' : 'true') + '} onPress={go} />';
        case 'biometric': return '<Btn label=' + A(p.label || 'Sign in with Face ID') + ' variant="secondary" onPress={go} />';
        case 'swipe': return '<Btn label=' + A(p.label || 'Swipe up to complete') + ' onPress={go} />';
        case 'textfield': return '<Field label=' + A(p.label || '') + ' placeholder=' + A(p.placeholder || 'Enter value') + ' value=' + A(p.value || '') + ' />';
        case 'password': return '<Field label=' + A(p.label || 'Password') + ' placeholder="********" secure />';
        case 'phone': return '<Field label=' + A(p.label || 'Phone number') + ' prefix=' + A(p.code || '+234') + ' placeholder=' + A(p.placeholder || '801 234 5678') + ' />';
        case 'searchfield': return '<Field placeholder=' + A(p.placeholder || 'Search') + ' />';
        case 'otp': return '<Otp value=' + A(p.value || '1234') + ' />';
        case 'balance': return '<Balance label=' + A(p.label || 'Available balance') + ' amount=' + A(p.amount || '$82,758.10') + ' trend=' + A(p.trend || '+24% this month') + ' onPress={go} />';
        case 'amount': return '<Amount cur=' + A(p.cur || '$') + ' value=' + A(p.value || '250.00') + ' caption=' + A(p.caption || 'Enter amount to send') + ' />';
        case 'sectionheader': return '<SectionHeader title=' + A(p.title || 'Recent activity') + ' />';
        case 'transactions': return '<Txns />';
        case 'contacts': return '<Contacts />';
        case 'toggleRow': return '<ToggleRow label=' + A(p.label || 'Enable notifications') + ' on={' + (p.on === false ? 'false' : 'true') + '} />';
        case 'success': return '<Success title=' + A(p.title || 'Successful!') + ' sub=' + A(p.sub || 'Your transfer has been completed') + ' />';
        case 'alert': return '<Banner kind=' + A(p.variant || 'primary') + ' title=' + A(p.title || 'Heads up') + ' desc=' + A(p.desc || 'Your statement is ready to view.') + ' />';
        case 'toast': return '<Banner kind=' + A(p.status || 'success') + ' title=' + A(p.title || 'Transfer complete') + ' desc=' + A(p.desc || 'Rp 50,000 sent to James K.') + ' />';
        case 'progress': return '<Progress label=' + A(p.label || 'Uploading…') + ' value={' + (p.value == null ? 68 : p.value) + '} />';
        case 'badges': return '<Badges />';
        case 'chips': return '<Chips />';
        case 'divider': return '<Divider />';
        case 'spacer': return '<View style={{height:' + (p.size == null ? 24 : p.size) + '}} />';
        case 'bottomnav': return '<BottomNav active={' + (p.active == null ? 0 : p.active) + '} go={go} />';
        case 'illustration': return '<Illustration src=' + A(illURL(p.src || 'il-138.svg')) + ' />';
        case 'paycard': return '<PayCard number=' + A(p.number || '4539 1488 0343 6467') + ' holder=' + A(p.holder || 'JULIO SANTOS') + ' exp=' + A(p.exp || '09/27') + ' />';
        case 'cashflow': return '<Cashflow amount=' + A(p.amount || '$82,758.10') + ' income=' + A(p.income || '+$20.000') + ' expense=' + A(p.expense || '-$5.200') + ' />';
        case 'checkbox': return '<CheckRow label=' + A(p.label || 'I agree to the terms & conditions') + ' checked={' + (p.checked === false ? 'false' : 'true') + '} />';
        case 'radio': return '<RadioGroup a=' + A(p.a || 'Standard account') + ' b=' + A(p.b || 'Savings account') + ' />';
        case 'tabs': return '<Tabs items={' + JSON.stringify(p.items || ['Overview', 'Transactions', 'Analytics']) + '} active={' + (p.active == null ? 0 : p.active) + '} />';
        case 'pilltabs': return '<Pills items={' + JSON.stringify(p.items || ['Monthly', 'Weekly', 'Daily']) + '} active={' + (p.active == null ? 0 : p.active) + '} />';
        case 'stepper': return '<Stepper />';
        default: return '<Placeholder name=' + A((CATALOG[c.type] && CATALOG[c.type].label) || c.type) + ' />';
      }
    };
    const screenFns = S.order.map((id, i) => {
      const s = S.screens[id]; const comps = s.comps;
      const ab = comps.find((c) => c.type === 'appbar');
      const bn = comps.find((c) => c.type === 'bottomnav');
      const bodyC = comps.filter((c) => c !== ab && c !== bn);
      const bodyJSX = bodyC.map(rnComp).join('\n        ') || '<View />';
      return 'function Screen' + i + '({ go, back }) {\n  return (\n    <Screen dark={' + (s.dark ? 'true' : 'false') + '}>\n      ' +
        (ab ? rnComp(ab) : '') + '\n      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: T.pad, paddingBottom: 28, gap: T.gap }} showsVerticalScrollIndicator={false}>\n        ' +
        bodyJSX + '\n      </ScrollView>\n      ' + (bn ? rnComp(bn) : '') + '\n    </Screen>\n  );\n}';
    }).join('\n\n');
    const list = S.order.map((id, i) => 'Screen' + i).join(', ');
    const head = '/* ────────────────────────────────────────────────────────────────────────\n' +
      '   MaV App Builder — React Native export (Expo-ready)\n' +
      '   ' + S.order.length + ' screen(s). Drop into an Expo project or paste into snack.expo.dev.\n' +
      '   Design tokens come from your builder Style Guide. A tap-through prototype:\n' +
      '   the primary action / nav advances; the app-bar back arrow goes back.\n' +
      '   ──────────────────────────────────────────────────────────────────────── */\n' +
      "import React, { useState } from 'react';\n" +
      "import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Image, Switch } from 'react-native';\n\n" +
      'const T = { accent: ' + JSON.stringify(st.accent) + ', onAccent: "#ffffff", radius: ' + (st.radius | 0) + ', pad: ' + (st.pad == null ? 16 : st.pad) + ', gap: ' + (st.space == null ? 14 : st.space) + ', success: "#1f9d55", danger: "#e5484d", warning: "#f5a524" };\n';
    return head + RN_LIB + '\n' + screenFns + '\n\nconst SCREENS = [' + list + '];\n\n' +
      'export default function App() {\n  const [i, setI] = useState(0);\n  const [hist, setHist] = useState([]);\n' +
      '  const go = () => setI((p) => { if (p + 1 < SCREENS.length) { setHist((h) => [...h, p]); return p + 1; } return p; });\n' +
      '  const back = () => setHist((h) => { if (h.length) { const n = h.slice(); setI(n.pop()); return n; } return h; });\n' +
      '  const Cur = SCREENS[i];\n  return <Cur go={go} back={back} />;\n}\n';
  }

  /* ══ MAIN RENDER ══════════════════════════════════════════════════════ */
  function render() {
    renderStepper();
    renderDeviceCtl();
    const panel = $('#leftPanel'), canvas = $('#canvas'), rp = $('#rightPanel');
    panel.innerHTML = ''; canvas.innerHTML = ''; rp.style.display = 'none';
    canvas.className = S.stage === 'sitemap' ? 'sm-wrap'
      : ('canvas' + (S.stage === 'wireframe' ? ' bxedit' : ''));
    if (S.stage === 'sitemap') renderSitemap(panel, canvas);
    else if (S.stage === 'wireframe') renderWireframe(panel, canvas);
    else if (S.stage === 'style') renderStyle(panel, canvas);
    else if (S.stage === 'visual') renderVisual(panel, canvas);
  }

  /* ── boot ────────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    seed(); render();
    $('#pvClose').onclick = closePreview;
    const sb = $('#saveBtn'); if (sb) sb.onclick = openExportModal;
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (S.pv) closePreview(); document.querySelectorAll('.genmodal-back').forEach((n) => n.remove()); } });
    // opened as its own page (via "Open Builder" from the design system) → ask what to build.
    // when embedded as a homepage preview (in an iframe) stay silent and just show the sample.
    let topLevel = true; try { topLevel = window.self === window.top; } catch (e) { topLevel = false; }
    if (topLevel) openWelcome();
  });
})();
