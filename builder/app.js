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
    style: { accent: '#352eff', radius: 8, font: FONTS[0].v, space: 14, pad: 16 },
    device: 'iphone16',
    pv: null, smPanel: null,
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

  function applyVars(node, style, opts = {}) {
    node.style.setProperty('--btn/primary/default', style.accent);
    node.style.setProperty('--bc-primary-light', style.accent);
    node.style.setProperty('--mav-primary', style.accent);
    node.style.setProperty('--btn/textonly/default', style.accent);
    const r = (style.radius | 0) + 'px';
    node.style.setProperty('--border/border-radius/sm', r);
    node.style.setProperty('--border/border-radius/md', r);
    node.style.setProperty('--bld-radius', r);
    if (opts.font !== false) node.style.setProperty('--font-active', style.font);
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
      if (c.override) {
        applyVars(wrap, { accent: c.override.accent || S.style.accent, radius: c.override.radius ?? S.style.radius, font: S.style.font }, { font: false });
        if (c.override.mt != null) wrap.style.marginTop = c.override.mt + 'px';
        if (c.override.padx != null) { wrap.style.paddingLeft = c.override.padx + 'px'; wrap.style.paddingRight = c.override.padx + 'px'; }
      }
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
    panel.innerHTML = '<div class="panel-h">Plan · pages & sections</div>';
    const ps = el('<div class="panel-scroll"></div>');
    const gp = el('<button class="hbtn primary" style="width:100%;justify-content:center;margin-bottom:10px">✨ Describe a page</button>');
    gp.onclick = openGenModal;
    ps.appendChild(gp);
    const addp = el('<button class="hbtn" style="width:100%;justify-content:center;margin-bottom:10px">+ Add from library</button>');
    addp.onclick = () => { S.smPanel = { type: 'pages' }; render(); };
    ps.appendChild(addp);
    const gen = el('<button class="hbtn" style="width:100%;justify-content:center;margin-bottom:14px">↺ Reset to sample flow</button>');
    gen.onclick = () => { seed(); render(); };
    ps.appendChild(gen);
    ps.appendChild(el('<p class="empty-hint" style="text-align:left;margin:6px 0">Describe a page in plain words — the builder composes it from MaV components. Each block is a section: drag to reorder, ✕ to remove, or open a page in Wireframe to lay it out.</p>'));
    panel.appendChild(ps);
  }

  /* ══ Prompt → screen generator (modal) ═══════════════════════════════ */
  function openGenModal() {
    document.querySelectorAll('.genmodal-back').forEach((n) => n.remove());
    const back = el('<div class="genmodal-back"></div>');
    const m = el('<div class="genmodal"></div>');
    m.innerHTML =
      '<div class="gm-title">✨ Generate a screen from a prompt</div>' +
      '<div class="gm-sub">Describe the page and the sections it needs — the builder assembles it from your MaV design-system components.</div>' +
      '<textarea class="gm-ta" rows="3" placeholder="e.g. a sign-up screen with a phone number field, an OTP code, and a terms checkbox"></textarea>' +
      '<div class="gm-eglabel">Try one of these</div><div class="gm-chips"></div>' +
      '<div class="gm-actions"><button class="hbtn gm-cancel">Cancel</button><button class="hbtn primary gm-go">Generate page →</button></div>';
    const chips = ['Login with biometric', 'Dashboard with balance & transactions', 'KYC steps with phone number & OTP',
      'Transfer with amount & recipients', 'Payment card with settings toggles', 'Success confirmation with receipt'];
    const cw = m.querySelector('.gm-chips');
    const ta = m.querySelector('.gm-ta');
    chips.forEach((c) => { const b = el('<button class="gm-chip"></button>'); b.textContent = c; b.onclick = () => { ta.value = c; ta.focus(); }; cw.appendChild(b); });
    const close = () => back.remove();
    const go = () => { const v = ta.value.trim(); if (!v) { ta.focus(); return; } close(); addScreen(v); };
    m.querySelector('.gm-go').onclick = go;
    m.querySelector('.gm-cancel').onclick = close;
    ta.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') go(); if (e.key === 'Escape') close(); });
    back.appendChild(m);
    back.addEventListener('click', (e) => { if (e.target === back) close(); });
    document.body.appendChild(back);
    setTimeout(() => ta.focus(), 30);
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
          list.appendChild(b);
        });
      });
    };
    draw(''); head.querySelector('input').addEventListener('input', (e) => draw(e.target.value.toLowerCase()));
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
  function renderWireframe(panel, canvas) {
    panel.appendChild(promptBar('e.g. “login with biometric”', (v) => { const g = screenFromPrompt(v); const s = S.screens[S.selScreen]; s.comps = g.comps.map((c) => ({ id: nid('c'), ...c })); s.name = g.name; s.dark = g.dark; render(); }));
    panel.appendChild(el('<div class="panel-h">Components · tap to add</div>'));
    const ps = el('<div class="panel-scroll"></div>');
    GROUPS.forEach((g) => {
      ps.appendChild(el(`<div class="pick-group">${g}</div>`));
      Object.entries(CATALOG).filter(([, c]) => c.group === g).forEach(([type, c]) => {
        const b = el(`<button class="pick"><span class="pi"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/></svg></span>${c.label}</button>`);
        b.onclick = () => { const s = S.screens[S.selScreen]; s.comps.push({ id: nid('c'), type, props: {} }); render(); };
        ps.appendChild(b);
      });
    });
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
  function renderStyle(panel, canvas) {
    panel.innerHTML = '<div class="panel-h">Style guide</div>';
    const ps = el('<div class="panel-scroll"></div>');
    // accent
    ps.appendChild(el('<div class="sg-block"><div class="sg-label">Primary color</div></div>'));
    const swr = el('<div class="sw-row"></div>');
    ACCENTS.forEach((a) => { const s = el(`<div class="sw${S.style.accent === a.v ? ' on' : ''}" title="${a.n}" style="background:${a.v}"></div>`); s.onclick = () => { S.style.accent = a.v; render(); }; swr.appendChild(s); });
    ps.lastChild.appendChild(swr);
    // radius
    ps.appendChild(sgOptions('Corner radius', RADII, S.style.radius, (v) => { S.style.radius = v; render(); }));
    // font
    ps.appendChild(sgOptions('Font family', FONTS.map((f) => ({ n: f.n, v: f.v })), S.style.font, (v) => { S.style.font = v; render(); }));
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
  function renderInspector() {
    const rp = $('#rightPanel');
    const comp = S.selComp && S.screens[S.selScreen] && S.screens[S.selScreen].comps.find((c) => c.id === S.selComp);
    if (!comp) { rp.style.display = 'none'; return; }
    rp.style.display = 'flex'; rp.innerHTML = `<div class="panel-h">Customize · ${CATALOG[comp.type].label}</div>`;
    const ps = el('<div class="panel-scroll"></div>');
    comp.override = comp.override || {};
    comp.props = comp.props || {};
    // ── component variants (size / type / state / …) ──
    const vs = VARIANTS[comp.type] || [];
    if (vs.length) ps.appendChild(el('<div class="sg-label" style="margin:12px 0 2px;color:var(--e-fg)">Variants</div>'));
    vs.forEach((v) => {
      const cur = comp.props[v.key] !== undefined ? comp.props[v.key] : v.def;
      const opts = v.opts.map((o) => ({ n: o[0], v: o[1] }));
      ps.appendChild(sgOptions(v.label, opts, cur, (val) => { comp.props[v.key] = val; render(); }));
    });
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
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && S.pv) closePreview(); });
  });
})();
