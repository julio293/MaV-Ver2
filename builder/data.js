/* ══════════════════════════════════════════════════════════════════════════
   MaV App Builder — component catalog, screen presets, and the prompt engine.
   Every render() emits REAL MaV markup/classes so output is on-brand.
   ══════════════════════════════════════════════════════════════════════════ */

/* shared inline icons (stroke inherits currentColor / the component's CSS) */
const IC = {
  back:   '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  close:  '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  more:   '<svg viewBox="0 0 24 24"><circle class="dots" cx="12" cy="5" r="1.6"/><circle class="dots" cx="12" cy="12" r="1.6"/><circle class="dots" cx="12" cy="19" r="1.6"/></svg>',
  plus:   '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  eye:    '<svg class="bal-eye" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  check:  '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>',
  bell:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"/><path d="M9 17v1a3 3 0 0 0 6 0v-1"/></svg>',
  face:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V6a2 2 0 0 1 2-2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M20 16v2a2 2 0 0 1-2 2h-2"/><path d="M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M9 10h.01M15 10h.01"/><path d="M9.5 15a3.5 3.5 0 0 0 5 0"/></svg>',
  chevY:  '<span class="chev"><svg viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></svg><svg viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></svg></span>',
  arrowR: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  chevD:  '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
};
/* Fyscal Technologies logomark (currentColor, 3 paths) */
const MARK = '<svg viewBox="0 0 1024 1024"><path d="M857.946 258.305L831.569 412.58H226.896L253.468 258.305H857.946Z"/><path d="M680.165 765.692H517.289L570.089 456.822H733.08L680.165 765.692Z"/><path d="M492.872 611.911L217.705 611.202L351.506 633.936L328.929 765.695H166.053L219.277 456.824L519.444 456.493L492.872 611.911Z"/></svg>';
const STATUS = '<span class="ab-time">9:41</span><span class="ab-levels"><svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".5"/><rect x="5" y="5" width="3" height="7" rx=".5"/><rect x="10" y="2.5" width="3" height="9.5" rx=".5"/><rect x="15" y="0" width="3" height="12" rx=".5"/></svg><svg width="26" height="12" viewBox="0 0 26 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" stroke-opacity=".35"/><rect x="2" y="2" width="18" height="8" rx="1.5"/><rect x="23" y="4" width="1.6" height="4" rx=".8"/></svg></span>';
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* row helper for lists */
function txnRow(icon, name, meta, amt, cls) {
  return `<div class="li"><span class="li-avatar" style="background:${icon.bg}">${icon.t}</span>
    <div class="li-body"><span class="li-name">${esc(name)}</span><span class="li-sub">${esc(meta)}</span></div>
    <span class="bld-amt ${cls}">${esc(amt)}</span></div>`;
}

/* shared button markup — honours size / type / state / text / dropdown /
   icon-right / full-width / content, driven by the inspector's variant controls */
function btnMarkup(p, defVariant, defLabel, cta) {
  const v = p.variant || defVariant;
  const sz = p.size || 'lg';
  const szc = sz === 'sm' ? 'mav-btn-sm' : sz === 'md' ? '' : 'mav-btn-lg';
  const stc = p.state === 'hover' ? 'is-hover' : p.state === 'pressed' ? 'is-pressed' : p.state === 'disabled' ? 'is-disabled' : '';
  const cls = ['mav-btn', 'mav-btn-' + v, szc, stc, p.full !== false ? 'bld-full' : '', p.showText === false ? 'mav-btn-icon' : ''].filter(Boolean).join(' ');
  const txt = p.showText === false ? '' : esc(p.label || defLabel);
  const right = p.iconRight ? IC.arrowR : p.dropdown ? IC.chevD : '';
  const dis = p.state === 'disabled' ? ' disabled' : '';
  return `<button class="${cls}"${dis}${cta ? ' data-cta="1"' : ''}>${txt}${right ? `<span class="mav-btn-ic">${right}</span>` : ''}</button>`;
}

/* ── Component catalog ─────────────────────────────────────────────────────
   type → { label, group, bleed?, cta?, render(props) }                       */
const CATALOG = {
  appbar: { label: 'App Bar', group: 'Navigation', bleed: true, render: (p) =>
    `<div class="appbar bordered"><div class="ab-status">${STATUS}</div><div class="ab-row">
      <div class="ab-side">${p.back === false ? '' : `<button class="ab-ico">${IC.back}</button>`}</div>
      <div class="ab-title">${esc(p.title || 'Screen')}</div>
      <div class="ab-side after">${(p.action === 'more' ? `<button class="ab-ico">${IC.more}</button>` : p.action === 'close' ? `<button class="ab-ico">${IC.close}</button>` : '')}</div>
    </div></div>` },

  title:    { label: 'Heading', group: 'Content', render: (p) => `<h1 class="bld-h1">${esc(p.text || 'Welcome back')}</h1>` },
  subtitle: { label: 'Subtitle', group: 'Content', render: (p) => `<p class="bld-sub">${esc(p.text || 'Sign in to continue to your account')}</p>` },
  illustration: { label: 'Illustration', group: 'Content', render: (p) => `<div class="bld-illus"><img src="../app/assets/illustrations/${esc(p.src || 'il-138.svg')}" alt="" loading="lazy"></div>` },

  balance: { label: 'Balance Hero', group: 'Finance', render: (p) =>
    `<div class="bal-hero"><div class="bal-head"><div class="bal-label">${esc(p.label || 'Available balance')}</div>
      <div class="amt-row"><span class="bal-amount">${esc(p.amount || '$82,758.10')}</span>${IC.eye}</div>
      <span class="bal-badge">${esc(p.trend || '+24% this month')}</span></div>
      <div class="bal-actions"><button class="bal-btn primary">${IC.plus} Send</button><button class="bal-btn secondary">${IC.plus} Request</button></div></div>` },

  amount: { label: 'Amount Display', group: 'Finance', render: (p) =>
    `<div class="bld-amount"><span class="bld-amount-cur">${esc(p.cur || '$')}</span><span class="bld-amount-val mav-num">${esc(p.value || '250.00')}</span></div>
     <div class="bld-amount-cap">${esc(p.caption || 'Enter amount to send')}</div>` },

  paycard: { label: 'Payment Card', group: 'Finance', render: (p) => {
    const skin = p.skin === undefined ? 'skin-1' : p.skin;   // one of the 16 Figma card faces, or '' for the plain gradient
    const grad = skin ? '' : ' style="background:linear-gradient(135deg,#2b2f6b,#0b0b12)"';
    const skinLayer = skin ? `<div class="pcard-skins"><img class="on" src="../app/assets/cards/skins/${esc(skin)}.png" alt="" loading="lazy"></div>` : '';
    return `<div class="pcard"${grad}>${skinLayer}<div class="pcard-scrim"></div><div class="pcard-sheen"></div>
      <div class="pcard-data"><div class="pcard-number">${esc(p.number || '4539 1488 0343 6467')}</div>
        <div class="pcard-row"><div><div class="pcard-label">Card holder</div><div class="pcard-holder">${esc(p.holder || 'JULIO SANTOS')}</div></div>
        <div class="pcard-exp"><span class="lbl">Exp</span><span>${esc(p.exp || '09/27')}</span></div></div></div></div>`; } },

  textfield: { label: 'Text Field', group: 'Inputs', render: (p) => {
    const st = p.state === 'focus' ? ' is-focus' : p.state === 'error' ? ' is-error' : '';
    const err = p.state === 'error' ? `<div class="field-err"><svg class="fi" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/></svg>${esc(p.errorMessage || 'Please check this field')}</div>` : '';
    return `${p.label ? `<div class="bld-flabel">${esc(p.label)}</div>` : ''}<div class="field${st}"><input placeholder="${esc(p.placeholder || 'Enter value')}" value="${esc(p.value || '')}"></div>${err}`; } },

  password: { label: 'Password Field', group: 'Inputs', render: (p) =>
    `<div class="bld-flabel">${esc(p.label || 'Password')}</div><div class="field"><input type="password" value="••••••••"><span style="opacity:.5">${IC.eye}</span></div>` },

  searchfield: { label: 'Search Field', group: 'Inputs', render: (p) =>
    `<div class="fc-field"><div class="srch">${IC.search}<input placeholder="${esc(p.placeholder || 'Search…')}"></div></div>` },

  otp: { label: 'OTP Input', group: 'Inputs', render: (p) => {
    const v = (p.value || '1234'); let s = '';
    for (let i = 0; i < 6; i++) s += `<div class="otp${v[i] ? ' filled' : (i === v.length ? ' is-focus' : '')}">${v[i] || ''}</div>`;
    return `<div class="otp-group">${s}</div>`; } },

  toggleRow: { label: 'Toggle Row', group: 'Inputs', render: (p) =>
    `<div class="li"><div class="li-body"><span class="li-name">${esc(p.label || 'Enable notifications')}</span></div><span class="tgl${p.on === false ? '' : ' on'}"></span></div>` },

  button: { label: 'Primary Button', group: 'Actions', cta: true, render: (p) => btnMarkup(p, p.variant || 'primary', 'Continue', true) },
  buttonSecondary: { label: 'Secondary Button', group: 'Actions', render: (p) => btnMarkup(p, 'secondary', 'Cancel', false) },
  biometric: { label: 'Biometric Sign-in', group: 'Actions', cta: true, render: (p) =>
    `<button class="mav-btn mav-btn-secondary mav-btn-lg bld-full bld-bio" data-cta="1">${IC.face} ${esc(p.label || 'Sign in with Face ID')}</button>` },
  swipe: { label: 'Swipe to Complete', group: 'Actions', cta: true, bleed: true, render: (p) =>
    `<div class="bld-dock"><button class="swipe-complete-btn" data-cta="1">${IC.chevY}${esc(p.label || 'Swipe up to complete')}</button></div>` },

  sectionheader: { label: 'Section Header', group: 'Content', render: (p) =>
    `<div class="sh md"><div class="sh-main"><p class="sh-title">${esc(p.title || 'Recent activity')}</p></div><button class="sh-link">See all</button></div>` },

  transactions: { label: 'Transaction List', group: 'Finance', render: () => {
    const row = (dir, name, meta, amt, kind) => `<div class="txn-item">
      <div class="txn-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none">${dir === 'in'
        ? '<path d="M3 10h14M10 3l7 7-7 7" stroke="var(--mav-success)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
        : '<path d="M17 10H3M10 3L3 10l7 7" stroke="var(--mav-danger)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'}</svg></div>
      <div class="txn-body"><div class="txn-name">${name}</div><div class="txn-meta">${meta}</div></div>
      <div><div class="txn-amount txn-amount-${kind}">${amt}</div><div class="txn-date">${kind === 'credit' ? 'Credit' : 'Debit'}</div></div></div>`;
    return `<div class="txn-list">
      ${row('in', 'Salary — GTBank', 'Transfer · 09:14', '+₦350,000', 'credit')}
      ${row('out', 'Airtime — MTN', 'Bill payment · 11:45', '−₦2,000', 'debit')}
      ${row('out', 'P2P — James K.', 'Send money · 14:33', '−₦20,000', 'debit')}
    </div>`; } },

  cashflow: { label: 'Cashflow Card', group: 'Finance', render: (p) =>
    `<div class="cf">
      <div class="cf-seg"><div class="s${p.tab === 'Secondary' ? '' : ' active'}">Main</div><div class="s${p.tab === 'Secondary' ? ' active' : ''}">Secondary</div></div>
      <div class="cf-panel" style="border-radius:12px"><div class="cf-wallet" style="gap:4px">
        <div style="display:flex;gap:4px;align-items:center"><span class="bal-label">Available Balance</span>${IC.eye.replace('bal-eye', 'bal-eye').replace('<svg', '<svg style="width:16px;height:16px"')}</div>
        <span class="w-amt">${esc(p.amount || '$82,758.10')}</span></div>
        <button class="cf-change">${IC.plus} Top up</button></div>
      <div class="cf-split"><div class="col"><span class="k">Income</span><span class="v gain">${esc(p.income || '+$20.000')}</span></div>
        <div class="vr"></div><div class="col"><span class="k">Expense</span><span class="v loss">${esc(p.expense || '−$5.200')}</span></div></div>
    </div>` },

  contacts: { label: 'Contact List', group: 'Content', render: () =>
    `<div class="list">
      <div class="li"><span class="li-avatar" style="background:linear-gradient(135deg,#6b8af7,#3a5fd9)">J</span><div class="li-body"><span class="li-name">Julio Santos</span><span class="li-sub">•••• 6467</span></div><span class="li-tag">Recent</span></div>
      <div class="li"><span class="li-avatar" style="background:linear-gradient(135deg,#f76b8a,#c9457a)">M</span><div class="li-body"><span class="li-name">Mom</span><span class="li-sub">•••• 2210</span></div></div>
      <div class="li"><span class="li-avatar" style="background:linear-gradient(135deg,#8fe36b,#4f9b2a)">A</span><div class="li-body"><span class="li-name">Amara N.</span><span class="li-sub">•••• 8891</span></div></div>
    </div>` },

  chips: { label: 'Filter Chips', group: 'Content', render: () =>
    `<div class="bld-chiprow"><span class="chip chip-primary">All</span><span class="chip chip-outline chip-grey">Income</span><span class="chip chip-outline chip-grey">Expense</span></div>` },

  alert: { label: 'Alert', group: 'Feedback', render: (p) =>
    `<div class="mav-alert alert-${p.variant || 'primary'} is-multiline"><span class="alert-icon">${IC.bell}</span>
      <div class="alert-main"><div class="alert-body"><div class="alert-title">${esc(p.title || 'Heads up')}</div><div class="alert-desc">${esc(p.desc || 'Your statement is ready to view.')}</div></div></div></div>` },

  toast: { label: 'Toast', group: 'Feedback', render: (p) =>
    `<div class="mav-toast toast-${p.status || 'success'}"><div class="toast-icon">${IC.check}</div><div class="toast-body"><div class="toast-title">${esc(p.title || 'Transfer complete')}</div><div class="toast-desc">${esc(p.desc || 'Rp 50,000 sent to James K.')}</div></div><span class="toast-action">View</span></div>` },

  success: { label: 'Success State', group: 'Feedback', render: (p) =>
    `<div class="bld-success"><div class="bld-check">${IC.check}</div><div class="bld-success-title">${esc(p.title || 'Successful!')}</div><div class="bld-success-sub">${esc(p.sub || 'Your transfer has been completed')}</div></div>` },

  bottomnav: { label: 'Bottom Nav', group: 'Navigation', bleed: true, render: (p) => {
    const items = [['home', 'Home'], ['statistic', 'Stats'], ['cards', 'Cards'], ['profile', 'Profile']];
    const paths = { home: '<path d="M4 10.5 12 4l8 6.5"/><path d="M6 9.5V20h12V9.5"/>', statistic: '<path d="M4 19V5"/><path d="M4 15l4.5-4.5 3.5 3 5-6"/><path d="M4 19h16"/>', cards: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>', profile: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.4a6 6 0 0 1 11 0"/>' };
    const act = p.active ?? 0; const n = items.length;
    // gliding top-indicator centered over the active item (static position)
    const inkLeft = `calc(${((act + 0.5) / n * 100).toFixed(3)}% - 12px)`;
    return `<div class="bnav"><span class="bnav-ink" style="left:${inkLeft};width:24px"></span>${items.map(([k, l], i) =>
      `<button class="bnav-item${i === act ? ' on' : ''}"><svg viewBox="0 0 24 24">${paths[k]}</svg><span class="lbl">${l}</span></button>`).join('')}</div>
      <div class="nav-home"><span></span></div>`; } },

  /* ── more MaV components (added on request) ── */
  phone: { label: 'Phone Field', group: 'Inputs', render: (p) =>
    `<div class="bld-flabel">${esc(p.label || 'Phone number')}</div><div class="field"><span class="field-prefix">${esc(p.code || '🇳🇬 +234')}</span><span class="field-vline"></span><input inputmode="tel" placeholder="${esc(p.placeholder || '801 234 5678')}" value="${esc(p.value || '')}"></div>` },

  checkbox: { label: 'Checkbox', group: 'Inputs', render: (p) =>
    `<label class="bld-optrow"><span class="cbx${p.checked === false ? '' : ' is-selected'}"><svg class="cb-check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg><svg class="cb-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></span><span class="bld-optlabel">${esc(p.label || 'I agree to the terms & conditions')}</span></label>` },

  radio: { label: 'Radio Options', group: 'Inputs', render: (p) =>
    `<div class="bld-opts"><label class="bld-optrow"><span class="rdo is-active"></span><span class="bld-optlabel">${esc(p.a || 'Standard account')}</span></label>
      <label class="bld-optrow"><span class="rdo"></span><span class="bld-optlabel">${esc(p.b || 'Savings account')}</span></label></div>` },

  tabs: { label: 'Tabs (underline)', group: 'Navigation', render: (p) => {
    const items = p.items || ['Overview', 'Transactions', 'Analytics']; const act = p.active ?? 0; const n = items.length;
    return `<div class="gtabs"><span class="gtabs-ink" style="left:${(act / n * 100).toFixed(2)}%;width:${(100 / n).toFixed(2)}%"></span>${items.map((t, i) =>
      `<button class="gtab${i === act ? ' on' : ''}">${esc(t)}</button>`).join('')}</div>`; } },

  pilltabs: { label: 'Pill Tabs', group: 'Navigation', render: (p) => {
    const items = p.items || ['Monthly', 'Weekly', 'Daily']; const act = p.active ?? 0;
    return `<div class="gpills">${items.map((t, i) =>
      `<button class="gpill${i === act ? ' on' : ''}"${i === act ? ' style="background:var(--mav-bg,#fff);border-radius:999px;box-shadow:0 1px 3px rgba(0,0,0,.14)"' : ''}>${esc(t)}</button>`).join('')}</div>`; } },

  stepper: { label: 'Progress Stepper', group: 'Navigation', render: () =>
    `<div class="step-row"><div class="step-item"><div class="step-circle step-done">✓</div><span class="step-lbl">Identity</span></div>
      <div class="step-conn done"></div><div class="step-item"><div class="step-circle step-active">2</div><span class="step-lbl on">Address</span></div>
      <div class="step-conn"></div><div class="step-item"><div class="step-circle step-todo">3</div><span class="step-lbl">Review</span></div></div>` },

  progress: { label: 'Progress Bar', group: 'Feedback', render: (p) => {
    const v = p.value ?? 68;
    return `<div class="pbar-row"><span class="pbar-label">${esc(p.label || 'Uploading…')}</span><span class="pbar-label">${v}%</span></div><div class="pbar"><div class="pbar-fill" style="width:${v}%"></div></div>`; } },

  badges: { label: 'Status Badges', group: 'Content', render: () =>
    `<div class="bld-chiprow"><span class="b b-green">Active</span><span class="b b-orange">Pending</span><span class="b b-red">Failed</span><span class="b b-primary">New</span></div>` },

  divider: { label: 'Divider', group: 'Content', render: () => `<div class="bld-divider"></div>` },

  spacer: { label: 'Spacer', group: 'Content', bleed: true, render: (p) => `<div class="bld-spacer" style="height:${p.size ?? 24}px"></div>` },

  /* ── extra MaV components ── */
  avatar: { label: 'Avatar Group', group: 'Content', render: (p) =>
    `<div class="avatar-stack" style="--sz:44px">
      <span class="avatar rounded avatar-primary"><span class="avatar-inner">JS</span></span>
      <span class="avatar rounded avatar-grey"><span class="avatar-inner">M</span></span>
      <span class="avatar rounded avatar-red"><span class="avatar-inner">A</span></span>
      <span class="avatar-more">+${esc(p.more || '3')}</span></div>` },

  stat: { label: 'Stat Widget', group: 'Finance', render: (p) => {
    const down = p.dir === 'down';
    const ic = down ? 'stat-icon-loss' : 'stat-icon-gain';
    const vv = down ? 'stat-value-loss' : 'stat-value-gain';
    const ch = down ? 'stat-change-down' : 'stat-change-up';
    const path = down ? 'M4 7l5 5 4-4 5 7' : 'M4 16l5-5 4 4 5-7';
    const col = down ? '--mav-danger' : '--mav-success';
    return `<div class="stat-widget"><div class="stat-icon ${ic}"><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="${path}" stroke="var(${col})" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div><div class="stat-label">${esc(p.label || (down ? 'Total Spent' : 'Total Income'))}</div><div class="stat-value ${vv}">${esc(p.value || (down ? '₦ 197K' : '₦ 482K'))}</div><div class="stat-change ${ch}">${down ? '▼' : '▲'} ${esc(p.change || (down ? '3.1% vs last month' : '12.4% vs last month'))}</div></div></div>`; } },

  accountselect: { label: 'Account Selector', group: 'Finance', render: (p) => {
    const rows = [['Mr. K', '฿ 10,000.00', true], ['Everyday Pot', '฿ 4,250.00', false], ['Holiday Fund', '฿ 82,000.00', false]];
    const rowIc = '<svg class="row-ic" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>';
    return `<div style="display:flex;flex-direction:column;gap:8px">${rows.map(([n, b, sel]) =>
      `<div class="acct-row${sel ? ' selected' : ''}">${rowIc}<div class="acct-info"><span class="acct-name">${esc(n)}</span><span class="acct-bal">${esc(b)}</span></div><span class="rdo${sel ? ' active' : ''}"></span></div>`).join('')}</div>`; } },

  loader: { label: 'Loader', group: 'Feedback', render: (p) => {
    const sz = p.size === 'sm' ? 'loader-sm' : p.size === 'md' ? 'loader-md' : 'loader-lg';
    return `<div style="display:flex;justify-content:center;padding:18px 0"><span class="loader ${sz}"></span></div>`; } },

  coachmark: { label: 'Coachmark', group: 'Feedback', render: (p) =>
    `<div class="coach"><div class="coach-ptr"><svg width="12" height="40" viewBox="0 0 12 40"><path d="M6 38V4" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/><circle cx="6" cy="38" r="5" fill="currentColor"/></svg></div>
      <div class="coach-txt"><span class="coach-title">${esc(p.title || 'Coach Mark Title')}</span><span class="coach-desc">${esc(p.desc || 'A short tip explaining this part of the screen.')}</span><span class="coach-step">( 1 / 5 )</span></div></div>` },

  emptystate: { label: 'Empty State', group: 'Feedback', render: (p) =>
    `<div class="empty"><img class="empty-illus" src="../app/assets/illustrations/${esc(p.src || 'il-140.svg')}" alt="" loading="lazy"><span class="empty-title">${esc(p.title || 'No items were found')}</span><span class="empty-sub">${esc(p.sub || 'Please try adjusting your search.')}</span></div>` },

  chat: { label: 'Chat Bubbles', group: 'Content', render: (p) =>
    `<div class="bld-chat">
      <div class="bld-msg in">Hey! Did the transfer go through?</div>
      <div class="bld-msg out">Yes — just sent ₦20,000 ✅</div>
      <div class="bld-msg in">Perfect, thank you 🙏</div>
      <div class="bld-msg out">Anytime!</div></div>` },

  quickactions: { label: 'Quick Actions', group: 'Finance', render: (p) => {
    const items = [['Send', 'M5 12h14M13 6l6 6-6 6'], ['Request', 'M19 12H5M11 18l-6-6 6-6'], ['Top up', 'M12 5v14M5 12h14'], ['Scan', 'M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3']];
    return `<div class="bld-qa">${items.map(([l, d]) => `<button class="bld-qa-item"><span class="bld-qa-ic"><svg viewBox="0 0 24 24"><path d="${d}"/></svg></span><span class="bld-qa-lbl">${l}</span></button>`).join('')}</div>`; } },

  datepicker: { label: 'Date Picker', group: 'Inputs', render: (p) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let cells = '';
    for (let d = 1; d <= 30; d++) cells += `<span class="bld-dp-day${d === 14 ? ' sel' : ''}${d <= 3 ? ' dim' : ''}">${d}</span>`;
    return `<div class="bld-dp"><div class="bld-dp-head"><button class="bld-dp-nav">‹</button><span class="bld-dp-month">${esc(p.month || 'August 2026')}</span><button class="bld-dp-nav">›</button></div>
      <div class="bld-dp-wd">${days.map((x) => `<span>${x}</span>`).join('')}</div><div class="bld-dp-grid">${cells}</div></div>`; } },

  chart: { label: 'Chart', group: 'Finance', render: (p) => {
    const bars = [46, 62, 38, 82, 54, 70, 48]; const act = 3; const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return `<div class="chart"><div class="chart-card bld-chart">
      <div class="bld-chart-hd"><div><div class="bld-chart-lbl">${esc(p.label || 'Spending this week')}</div><div class="bld-chart-amt">${esc(p.amount || '$1,248.30')}</div></div><span class="b b-green">${esc(p.trend || '▲ 8.2%')}</span></div>
      <div class="chart-bar-wrap">${bars.map((h, i) => `<span class="chart-bar ${i === act ? 'chart-bar-active' : 'chart-bar-inactive'}" style="height:${h}%"></span>`).join('')}</div>
      <div class="bld-chart-x">${labels.map((l) => `<span>${l}</span>`).join('')}</div></div></div>`; } },

  list: { label: 'Menu List', group: 'Content', render: (p) => {
    const chev = '<svg class="li-chev" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>';
    const row = (ic, name, sub) => `<div class="li"><span class="li-softic"><svg viewBox="0 0 24 24">${ic}</svg></span><div class="li-body"><span class="li-name">${esc(name)}</span>${sub ? `<span class="li-sub">${esc(sub)}</span>` : ''}</div>${chev}</div>`;
    return `<div class="list-card bld-menu"><div class="list">
      ${row('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5a6 6 0 0 1 11 0"/>', 'Personal details', 'Name, email, phone')}
      ${row('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>', 'Cards & accounts', '2 linked')}
      ${row('<path d="M12 2a7 7 0 0 0-7 7v3l-2 3h18l-2-3V9a7 7 0 0 0-7-7z"/><path d="M9 18a3 3 0 0 0 6 0"/>', 'Notifications', 'On')}
      ${row('<circle cx="12" cy="12" r="3"/><path d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V20a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 18.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.3 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 19 4.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H23a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>', 'Settings', '')}
    </div></div>`; } },

  blog: { label: 'Article Card', group: 'Content', render: (p) =>
    `<div class="bld-article"><div class="bld-article-thumb"><img src="../app/assets/illustrations/${esc(p.src || 'il-166.svg')}" alt="" loading="lazy"><span class="bld-article-badge">${esc(p.badge || 'Blog')}</span></div>
      <div class="bld-article-body"><div class="bld-article-date">${esc(p.date || 'Jul 27')} ・ ${esc(p.meta || '4 min read')}</div>
        <h4 class="bld-article-title">${esc(p.title || 'AI-driven fraud detection in modern banking')}</h4>
        <span class="bld-article-more">Read more →</span></div></div>` },

  bottomsheet: { label: 'Bottom Sheet', group: 'Feedback', bleed: true, cta: true, render: (p) => {
    const rows = [['Amount', '$250.00'], ['To', 'James K.'], ['Fee', '$0.00']];
    return `<div class="bld-sheet"><span class="bld-sheet-grab"></span>
      <div class="bld-sheet-title">${esc(p.title || 'Confirm payment')}</div>
      <div class="bld-sheet-rows">${rows.map(([k, v]) => `<div class="bld-sheet-row"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>
      <button class="mav-btn mav-btn-primary mav-btn-lg bld-full" data-cta="1">${esc(p.cta || 'Confirm')}</button></div>`; } },

  upload: { label: 'File Upload', group: 'Inputs', render: (p) =>
    `<div class="bld-upload"><div class="bld-upload-drop">
        <span class="bld-upload-ic"><svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg></span>
        <span class="bld-upload-t">${esc(p.title || 'Upload your document')}</span>
        <span class="bld-upload-s">${esc(p.hint || 'Drag & drop or tap to browse · PDF, JPG up to 10MB')}</span></div>
      <div class="bld-upload-file"><span class="bld-upload-fic"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></span>
        <div class="bld-upload-meta"><span class="bld-upload-fn">${esc(p.file || 'passport.pdf')}</span><span class="bld-upload-fs">2.4 MB · Uploaded</span></div>
        <span class="bld-upload-ok"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></span></div></div>` },

  pagination: { label: 'Pagination', group: 'Navigation', render: (p) => {
    const act = p.active == null ? 1 : p.active; const pages = [1, 2, 3, 4, 5];
    return `<div class="bld-pg"><button class="bld-pg-nav">‹</button>${pages.map((n) => `<button class="bld-pg-n${n === act ? ' on' : ''}">${n}</button>`).join('')}<button class="bld-pg-nav">›</button></div>`; } },

  buttondock: { label: 'Button Dock', group: 'Actions', bleed: true, cta: true, render: (p) => {
    const sec = p.secondary ? `<button class="mav-btn mav-btn-secondary mav-btn-lg bld-full">${esc(p.secondaryLabel || 'Cancel')}</button>` : '';
    return `<div class="dock"><div class="dock-inner" style="gap:12px"><button class="mav-btn mav-btn-primary mav-btn-lg bld-full" data-cta="1">${esc(p.label || 'Continue')}</button>${sec}</div><div class="home-ind"></div></div>`; } },

  keypad: { label: 'Number Pad', group: 'Inputs', render: (p) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
    return `<div class="bld-keypad">${keys.map((k) => k === '' ? '<span class="bld-key ghost"></span>' : `<button class="bld-key${k === '⌫' ? ' fn' : ''}">${k}</button>`).join('')}</div>`; } },

  splash: { label: 'Splash / Opening', group: 'Navigation', bleed: true, fullscreen: true, render: (p) =>
    `<div class="bld-splash bld-sp-${p.bg || 'a'}"><div class="bld-sp-bg"></div><div class="bld-sp-sheen"></div>
      <div class="bld-sp-mid"><span class="bld-sp-glow"></span><span class="bld-sp-mark">${MARK}</span></div>
      <div class="bld-sp-foot">${esc(p.foot || '© 2025 Fyscal Technologies PTE LTD.')}<br>All rights reserved.</div></div>` },

  qr: { label: 'QR / Scan to Pay', group: 'Finance', render: (p) => {
    const N = 21, c = 7; const size = N * c; let mod = '';
    const finder = (x, y) => `<rect x="${x * c}" y="${y * c}" width="${c * 7}" height="${c * 7}" rx="4"/><rect x="${(x + 1) * c}" y="${(y + 1) * c}" width="${c * 5}" height="${c * 5}" rx="3" fill="#fff"/><rect x="${(x + 2) * c}" y="${(y + 2) * c}" width="${c * 3}" height="${c * 3}" rx="2"/>`;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      if ((x < 7 && y < 7) || (x > N - 8 && y < 7) || (x < 7 && y > N - 8)) continue;
      if (((x * 7 + y * 13 + (x & y) + x) % 3) === 0) mod += `<rect x="${x * c}" y="${y * c}" width="${c}" height="${c}"/>`;
    }
    return `<div class="bld-qr"><div class="bld-qr-card"><svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${mod}${finder(0, 0)}${finder(N - 7, 0)}${finder(0, N - 7)}</svg></div>
      <div class="bld-qr-cap">${esc(p.label || 'Scan to pay')}</div><div class="bld-qr-sub">${esc(p.sub || 'Show this code at the merchant terminal')}</div></div>`; } },

  txndetail: { label: 'Transaction Detail', group: 'Finance', render: (p) => {
    const rec = p.dir === 'in';
    const rows = [['To', 'James K. · •••• 8891'], ['Reference', 'TRX-9F2A81C4'], ['Date', '27 Jul 2026, 14:33'], ['Fee', '₦0.00'], ['Method', 'Instant transfer']];
    return `<div class="bld-txnd"><div class="bld-txnd-top">
        <span class="bld-txnd-ic ${rec ? 'in' : 'out'}"><svg viewBox="0 0 24 24">${rec ? '<path d="M17 10H3M10 3L3 10l7 7"/>' : '<path d="M3 10h14M10 3l7 7-7 7"/>'}</svg></span>
        <div class="bld-txnd-amt ${rec ? 'in' : ''}">${esc(p.amount || (rec ? '+₦350,000' : '−₦20,000'))}</div>
        <div class="bld-txnd-name">${esc(p.name || 'James K.')}</div><span class="bld-txnd-badge">Completed</span></div>
      <div class="bld-txnd-rows">${rows.map(([k, v]) => `<div class="bld-txnd-row"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div></div>`; } },

  donut: { label: 'Donut Chart', group: 'Finance', render: (p) => {
    const C = 326.726; const data = [['Bills', 38], ['Food', 27], ['Shopping', 20], ['Other', 15]]; let off = 0, segs = '';
    data.forEach((d, i) => { const len = d[1] / 100 * C; segs += `<circle class="bld-dn-seg s${i}" cx="60" cy="60" r="52" fill="none" stroke-width="16" stroke-dasharray="${len.toFixed(1)} ${(C - len).toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}"/>`; off += len; });
    const legend = data.map((d, i) => `<div class="bld-dn-li"><span class="bld-dn-dot s${i}"></span><span class="bld-dn-name">${d[0]}</span><span class="bld-dn-pct">${d[1]}%</span></div>`).join('');
    return `<div class="bld-donut"><div class="bld-dn-chart"><svg viewBox="0 0 120 120"><circle class="bld-dn-track" cx="60" cy="60" r="52" fill="none" stroke-width="16"/>${segs}</svg><div class="bld-dn-center"><span class="v">${esc(p.total || '$1,248')}</span><span class="k">spent</span></div></div><div class="bld-dn-legend">${legend}</div></div>`; } },

  linechart: { label: 'Line Chart', group: 'Finance', render: (p) => {
    const line = 'M0,88 L50,70 L100,78 L150,46 L200,54 L250,26 L300,34';
    return `<div class="bld-line"><div class="bld-line-hd"><div><div class="bld-line-lbl">${esc(p.label || 'Balance trend')}</div><div class="bld-line-amt">${esc(p.amount || '$82,758.10')}</div></div><span class="b b-green">${esc(p.trend || '▲ 12.4%')}</span></div>
      <svg class="bld-line-svg" viewBox="0 0 300 110" preserveAspectRatio="none"><defs><linearGradient id="bldLineG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="bld-line-g0"/><stop offset="1" class="bld-line-g1"/></linearGradient></defs>
        <path class="bld-line-area" d="${line} L300,110 L0,110 Z"/><path class="bld-line-path" d="${line}"/></svg>
      <div class="bld-line-x"><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span></div></div>`; } },

  pindots: { label: 'PIN Dots', group: 'Inputs', render: (p) => {
    const n = 6, f = p.filled == null ? 3 : p.filled;
    let dots = ''; for (let i = 0; i < n; i++) dots += `<span class="bld-pin-dot${i < f ? ' on' : ''}"></span>`;
    return `<div class="bld-pin"><div class="bld-pin-label">${esc(p.label || 'Enter your PIN')}</div><div class="bld-pin-dots">${dots}</div></div>`; } },

  slider: { label: 'Amount Slider', group: 'Inputs', render: (p) => {
    const pct = p.value == null ? 62 : p.value;
    return `<div class="bld-slider"><div class="bld-slider-top"><span class="bld-slider-lbl">${esc(p.label || 'Loan amount')}</span><b class="bld-slider-val">${esc(p.amount || '$3,100')}</b></div>
      <div class="bld-slider-track"><div class="bld-slider-fill" style="width:${pct}%"></div><span class="bld-slider-knob" style="left:${pct}%"></span></div>
      <div class="bld-slider-ends"><span>${esc(p.min || '$0')}</span><span>${esc(p.max || '$5,000')}</span></div></div>`; } },

  map: { label: 'Map / Locator', group: 'Content', render: (p) =>
    `<div class="bld-map"><div class="bld-map-canvas">
        <svg class="bld-map-roads" viewBox="0 0 300 160" preserveAspectRatio="none"><path d="M-10 40 H310"/><path d="M-10 110 H310"/><path d="M70 -10 V170"/><path d="M200 -10 V170"/><path d="M0 130 L120 60 L300 90"/></svg>
        <span class="bld-map-pin main"><svg viewBox="0 0 24 24"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5" fill="#fff"/></svg></span>
        <span class="bld-map-dot d1"></span><span class="bld-map-dot d2"></span></div>
      <div class="bld-map-card"><span class="bld-map-ic"><svg viewBox="0 0 24 24"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg></span>
        <div class="bld-map-meta"><span class="bld-map-name">${esc(p.name || 'Fyscal Branch — Downtown')}</span><span class="bld-map-sub">${esc(p.sub || '0.4 km away · Open until 6:00 PM')}</span></div>
        <span class="bld-map-go">›</span></div></div>` },
};

const GROUPS = ['Navigation', 'Content', 'Finance', 'Inputs', 'Actions', 'Feedback'];

/* one-line section descriptions (banking-appropriate, from our components) */
const DESC = {
  appbar: 'Top bar — title, back, actions', title: 'Screen heading', subtitle: 'Supporting subtitle',
  balance: 'Balance with Send / Request', amount: 'Amount entry display', paycard: 'Card visual — number, holder',
  cashflow: 'Wallet — Main/Secondary + I/E', illustration: 'Isometric brand illustration',
  phone: 'Country code + number', checkbox: 'Checkbox with label', radio: 'Single-choice options',
  tabs: 'Underline tab bar', pilltabs: 'Segmented pill tabs', stepper: 'Multi-step progress',
  progress: 'Progress bar', badges: 'Status badges', divider: 'Section divider', spacer: 'Adjustable vertical gap',
  textfield: 'Labelled input field', password: 'Masked password field', searchfield: 'Search input',
  otp: '6-digit code entry', toggleRow: 'Setting row with switch',
  button: 'Primary call-to-action', buttonSecondary: 'Secondary action', biometric: 'Face / Touch ID sign-in',
  swipe: 'Swipe-to-complete confirm', sectionheader: 'Titled list header',
  transactions: 'Recent transaction list', contacts: 'Recipient / contact list', chips: 'Filter chips',
  alert: 'Inline alert banner', toast: 'Toast notification', success: 'Success confirmation state',
  bottomnav: 'Bottom tab navigation',
  avatar: 'Stacked avatar group', stat: 'Income / spend stat card', accountselect: 'Choose an account',
  loader: 'Loading spinner', coachmark: 'Onboarding coach tip', emptystate: 'Empty / no-results state',
  chat: 'Chat message bubbles', quickactions: 'Quick action shortcuts', datepicker: 'Calendar date picker',
  chart: 'Bar chart / spending graph', list: 'Menu / settings list', blog: 'Article / blog card',
  bottomsheet: 'Bottom sheet dialog', upload: 'File upload / dropzone',
  pagination: 'Page indicator / pager', buttondock: 'Docked CTA bar', keypad: 'Numeric PIN / amount pad',
  splash: 'App launch / opening screen',
  qr: 'QR code / scan to pay', txndetail: 'Transaction detail / receipt', donut: 'Spend-by-category donut',
  linechart: 'Balance-over-time line chart', pindots: 'PIN entry indicator', slider: 'Amount / range slider',
  map: 'Map / branch & ATM locator',
};
/* e-banking screens offered in the "Add a Page" library */
const PAGE_LIBRARY = ['Onboarding', 'Login', 'Verify OTP', 'Dashboard', 'Transfer', 'Confirmation', 'Cards', 'Statements', 'Beneficiaries', 'Notifications', 'Settings', 'Profile'];

/* Per-component variant controls surfaced in the inspector.
   { key: prop name, label, def: render default, opts: [[label, value], …] } */
const VARIANTS = {
  button: [
    { key: 'size', label: 'Size', def: 'lg', opts: [['sm', 'sm'], ['md', 'md'], ['lg', 'lg']] },
    { key: 'variant', label: 'Type', def: 'primary', opts: [['Primary', 'primary'], ['Secondary', 'secondary'], ['Clear', 'clear']] },
    { key: 'state', label: 'State', def: '', opts: [['Default', ''], ['Hover', 'hover'], ['Pressed', 'pressed'], ['Disabled', 'disabled']] },
    { key: 'showText', label: 'Text', def: true, ctrl: 'toggle' },
    { key: 'dropdown', label: 'Dropdown', def: false, ctrl: 'toggle' },
    { key: 'iconRight', label: 'Icon right', def: false, ctrl: 'toggle' },
    { key: 'full', label: 'Full width', def: true, ctrl: 'toggle' },
    { key: 'label', label: 'Content', def: 'Continue', ctrl: 'text' },
  ],
  buttonSecondary: [
    { key: 'size', label: 'Size', def: 'lg', opts: [['sm', 'sm'], ['md', 'md'], ['lg', 'lg']] },
    { key: 'state', label: 'State', def: '', opts: [['Default', ''], ['Hover', 'hover'], ['Pressed', 'pressed'], ['Disabled', 'disabled']] },
    { key: 'iconRight', label: 'Icon right', def: false, ctrl: 'toggle' },
    { key: 'full', label: 'Full width', def: true, ctrl: 'toggle' },
    { key: 'label', label: 'Content', def: 'Cancel', ctrl: 'text' },
  ],
  appbar: [
    { key: 'back', label: 'Back button', def: true, opts: [['Show', true], ['Hide', false]] },
    { key: 'action', label: 'Trailing action', def: '', opts: [['None', ''], ['More', 'more'], ['Close', 'close']] },
  ],
  alert: [{ key: 'variant', label: 'Type', def: 'primary', opts: [['Primary', 'primary'], ['Danger', 'danger'], ['Success', 'success'], ['Warning', 'warning']] }],
  toast: [
    { key: 'status', label: 'Status', def: 'success', opts: [['Success', 'success'], ['Error', 'error'], ['Info', 'info'], ['Warning', 'warning']] },
    { key: 'light', label: 'Theme', def: false, opts: [['Dark', false], ['Light', true]] },
  ],
  textfield: [{ key: 'state', label: 'State', def: '', opts: [['Default', ''], ['Focus', 'focus'], ['Error', 'error']] }],
  otp: [
    { key: 'variant', label: 'Style', def: 'boxed', opts: [['Boxed', 'boxed'], ['Boxless', 'boxless']] },
    { key: 'state', label: 'State', def: '', opts: [['Default', ''], ['Error', 'error']] },
  ],
  cashflow: [{ key: 'tab', label: 'Active tab', def: 'Main', opts: [['Main', 'Main'], ['Secondary', 'Secondary']] }],
  stat: [{ key: 'dir', label: 'Direction', def: 'up', opts: [['Gain', 'up'], ['Loss', 'down']] }],
  loader: [{ key: 'size', label: 'Size', def: 'lg', opts: [['sm', 'sm'], ['md', 'md'], ['lg', 'lg']] }],
  emptystate: [{ key: 'src', label: 'Illustration', def: 'il-140.svg', opts: [['Option 1', 'il-140.svg'], ['Option 2', 'il-138.svg'], ['Option 3', 'il-166.svg'], ['Option 4', 'il-143.svg'], ['Option 5', 'il-152.svg']] }],
  pagination: [{ key: 'active', label: 'Active page', def: 1, opts: [['1', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5]] }],
  splash: [{ key: 'bg', label: 'Background', def: 'a', opts: [['Squares', 'a'], ['Brand gradient', 'b'], ['Beam', 'c']] }],
  txndetail: [{ key: 'dir', label: 'Direction', def: 'out', opts: [['Sent', 'out'], ['Received', 'in']] }],
  pindots: [{ key: 'filled', label: 'Digits entered', def: 3, opts: [['0', 0], ['2', 2], ['4', 4], ['6', 6]] }],
  slider: [{ key: 'value', label: 'Position', def: 62, opts: [['25%', 25], ['50%', 50], ['75%', 75], ['100%', 100]] }],
  buttondock: [
    { key: 'label', label: 'Content', def: 'Continue', ctrl: 'text' },
    { key: 'secondary', label: 'Secondary button', def: false, ctrl: 'toggle' },
  ],
  bottomnav: [{ key: 'active', label: 'Active tab', def: 0, opts: [['Home', 0], ['Stats', 1], ['Cards', 2], ['Profile', 3]] }],
  tabs: [{ key: 'active', label: 'Active tab', def: 0, opts: [['1st', 0], ['2nd', 1], ['3rd', 2]] }],
  pilltabs: [{ key: 'active', label: 'Active', def: 0, opts: [['1st', 0], ['2nd', 1], ['3rd', 2]] }],
  progress: [{ key: 'value', label: 'Progress', def: 68, opts: [['25%', 25], ['50%', 50], ['75%', 75], ['100%', 100]] }],
  illustration: [{ key: 'src', label: 'Illustration', def: 'il-138.svg', opts: [['Option 1', 'il-138.svg'], ['Option 2', 'il-140.svg'], ['Option 3', 'il-166.svg'], ['Option 4', 'il-143.svg'], ['Option 5', 'il-152.svg']] }],

  /* ── content / text-driven components ── */
  title: [{ key: 'text', label: 'Content', def: 'Welcome back', ctrl: 'text' }],
  subtitle: [{ key: 'text', label: 'Content', def: 'Sign in to continue to your account', ctrl: 'text' }],
  sectionheader: [{ key: 'title', label: 'Title', def: 'Recent activity', ctrl: 'text' }],
  success: [
    { key: 'title', label: 'Title', def: 'Successful!', ctrl: 'text' },
    { key: 'sub', label: 'Subtitle', def: 'Your transfer has been completed', ctrl: 'text' },
  ],
  coachmark: [
    { key: 'title', label: 'Title', def: 'Coach Mark Title', ctrl: 'text' },
    { key: 'desc', label: 'Description', def: 'A short tip explaining this part of the screen.', ctrl: 'text' },
  ],
  avatar: [{ key: 'more', label: 'Overflow count', def: '3', ctrl: 'text' }],
  blog: [
    { key: 'badge', label: 'Badge', def: 'Blog', ctrl: 'text' },
    { key: 'title', label: 'Title', def: 'AI-driven fraud detection in modern banking', ctrl: 'text' },
    { key: 'meta', label: 'Meta', def: '4 min read', ctrl: 'text' },
    { key: 'src', label: 'Thumbnail', def: 'il-166.svg', opts: [['Option 1', 'il-166.svg'], ['Option 2', 'il-138.svg'], ['Option 3', 'il-140.svg'], ['Option 4', 'il-143.svg'], ['Option 5', 'il-152.svg']] },
  ],

  /* ── finance ── */
  balance: [
    { key: 'label', label: 'Label', def: 'Available balance', ctrl: 'text' },
    { key: 'amount', label: 'Amount', def: '$82,758.10', ctrl: 'text' },
    { key: 'trend', label: 'Trend', def: '+24% this month', ctrl: 'text' },
  ],
  amount: [
    { key: 'cur', label: 'Currency', def: '$', ctrl: 'text' },
    { key: 'value', label: 'Value', def: '250.00', ctrl: 'text' },
    { key: 'caption', label: 'Caption', def: 'Enter amount to send', ctrl: 'text' },
  ],
  paycard: [
    { key: 'skin', label: 'Card design', def: 'skin-1', opts: [['Gradient', '']].concat([1, 2, 3, 4, 5, 6, 7, 8, 11, 13, 14, 15, 16, 17, 25, 27].map((n, i) => ['Design ' + (i + 1), 'skin-' + n])) },
    { key: 'number', label: 'Card number', def: '4539 1488 0343 6467', ctrl: 'text' },
    { key: 'holder', label: 'Card holder', def: 'JULIO SANTOS', ctrl: 'text' },
    { key: 'exp', label: 'Expiry', def: '09/27', ctrl: 'text' },
  ],
  qr: [
    { key: 'label', label: 'Caption', def: 'Scan to pay', ctrl: 'text' },
    { key: 'sub', label: 'Sub-caption', def: 'Show this code at the merchant terminal', ctrl: 'text' },
  ],
  donut: [{ key: 'total', label: 'Centre total', def: '$1,248', ctrl: 'text' }],
  linechart: [
    { key: 'label', label: 'Label', def: 'Balance trend', ctrl: 'text' },
    { key: 'amount', label: 'Amount', def: '$82,758.10', ctrl: 'text' },
    { key: 'trend', label: 'Trend', def: '▲ 12.4%', ctrl: 'text' },
  ],
  map: [
    { key: 'name', label: 'Place', def: 'Fyscal Branch — Downtown', ctrl: 'text' },
    { key: 'sub', label: 'Detail', def: '0.4 km away · Open until 6:00 PM', ctrl: 'text' },
  ],

  /* ── inputs ── */
  password: [{ key: 'label', label: 'Label', def: 'Password', ctrl: 'text' }],
  searchfield: [{ key: 'placeholder', label: 'Placeholder', def: 'Search…', ctrl: 'text' }],
  phone: [
    { key: 'label', label: 'Label', def: 'Phone number', ctrl: 'text' },
    { key: 'code', label: 'Country code', def: '🇳🇬 +234', ctrl: 'text' },
    { key: 'placeholder', label: 'Placeholder', def: '801 234 5678', ctrl: 'text' },
  ],
  datepicker: [{ key: 'month', label: 'Month', def: 'August 2026', ctrl: 'text' }],
  toggleRow: [
    { key: 'label', label: 'Label', def: 'Enable notifications', ctrl: 'text' },
    { key: 'on', label: 'On', def: true, ctrl: 'toggle' },
  ],
  checkbox: [
    { key: 'label', label: 'Label', def: 'I agree to the terms & conditions', ctrl: 'text' },
    { key: 'checked', label: 'Checked', def: true, ctrl: 'toggle' },
  ],
  radio: [
    { key: 'a', label: 'Option 1', def: 'Standard account', ctrl: 'text' },
    { key: 'b', label: 'Option 2', def: 'Savings account', ctrl: 'text' },
  ],
  upload: [
    { key: 'title', label: 'Title', def: 'Upload your document', ctrl: 'text' },
    { key: 'hint', label: 'Hint', def: 'Drag & drop or tap to browse · PDF, JPG up to 10MB', ctrl: 'text' },
    { key: 'file', label: 'File name', def: 'passport.pdf', ctrl: 'text' },
  ],

  /* ── actions ── */
  biometric: [{ key: 'label', label: 'Content', def: 'Sign in with Face ID', ctrl: 'text' }],
  swipe: [{ key: 'label', label: 'Content', def: 'Swipe up to complete', ctrl: 'text' }],
  bottomsheet: [
    { key: 'title', label: 'Title', def: 'Confirm payment', ctrl: 'text' },
    { key: 'cta', label: 'Button', def: 'Confirm', ctrl: 'text' },
  ],
  spacer: [{ key: 'size', label: 'Height', def: 24, opts: [['S', 12], ['M', 24], ['L', 40], ['XL', 64]] }],
};

/* ── Screen presets (prompt keyword → component list) ────────────────────── */
function comp(type, props) { return { type, props: props || {} }; }

const PRESETS = [
  { keys: ['onboard', 'welcome', 'get started', 'intro'], name: 'Onboarding', build: () => [
    comp('appbar', { title: 'Welcome', back: false }), comp('illustration', { src: 'il-138.svg' }),
    comp('title', { text: 'Bank smarter,\nmove faster' }),
    comp('subtitle', { text: 'Send, save and spend — all in one place.' }), comp('button', { label: 'Get started' }),
    comp('buttonSecondary', { label: 'I already have an account' }) ] },
  { keys: ['login', 'sign in', 'signin', 'log in'], name: 'Login', build: (t) => {
    const c = [comp('appbar', { title: 'Sign in' }), comp('title', { text: 'Welcome back' }), comp('subtitle', { text: 'Sign in to continue to your account' }),
      comp('textfield', { label: 'Email', placeholder: 'you@example.com', value: 'julio@fyscaltech.com' }), comp('password', { label: 'Password' })];
    if (/bio|face|finger|touch/.test(t)) c.push(comp('biometric', {}));
    c.push(comp('button', { label: 'Sign in' }), comp('buttonSecondary', { label: 'Forgot password?' }));
    return c; } },
  { keys: ['otp', 'verify', 'code', '2fa', 'verification'], name: 'Verify', build: () => [
    comp('appbar', { title: 'Verification' }), comp('title', { text: 'Enter the code' }), comp('subtitle', { text: 'We sent a 6-digit code to •••• 5678' }),
    comp('otp', { value: '1234' }), comp('button', { label: 'Verify' }), comp('buttonSecondary', { label: 'Resend code' }) ] },
  { keys: ['dashboard', 'home', 'overview', 'account'], name: 'Dashboard', build: () => [
    comp('appbar', { title: 'Home', action: 'more' }), comp('balance', {}), comp('chips', {}),
    comp('sectionheader', { title: 'Recent activity' }), comp('transactions', {}), comp('bottomnav', { active: 0 }) ] },
  { keys: ['transfer', 'send money', 'send', 'pay'], name: 'Transfer', build: () => [
    comp('appbar', { title: 'Send money' }), comp('amount', { value: '250.00', caption: 'Available: $82,758.10' }),
    comp('sectionheader', { title: 'Recipient' }), comp('contacts', {}), comp('button', { label: 'Continue' }) ] },
  { keys: ['confirm', 'success', 'receipt', 'done', 'complete'], name: 'Confirmation', build: () => [
    comp('appbar', { title: 'Confirmation', action: 'close' }), comp('illustration', { src: 'il-166.svg' }), comp('success', {}),
    comp('sectionheader', { title: 'Details' }), comp('transactions', {}), comp('button', { label: 'Done' }) ] },
  { keys: ['card', 'wallet'], name: 'Cards', build: () => [
    comp('appbar', { title: 'My Cards' }), comp('paycard', {}), comp('sectionheader', { title: 'Card settings' }),
    comp('toggleRow', { label: 'Freeze card', on: false }), comp('toggleRow', { label: 'Online payments', on: true }), comp('bottomnav', { active: 2 }) ] },
  { keys: ['statement', 'history', 'activity'], name: 'Statements', build: () => [
    comp('appbar', { title: 'Statements' }), comp('chips', {}), comp('sectionheader', { title: 'This month' }),
    comp('transactions', {}), comp('bottomnav', { active: 1 }) ] },
  { keys: ['beneficiar', 'recipient', 'payee'], name: 'Beneficiaries', build: () => [
    comp('appbar', { title: 'Beneficiaries' }), comp('searchfield', { placeholder: 'Search saved payees' }),
    comp('sectionheader', { title: 'Saved' }), comp('contacts', {}), comp('button', { label: 'Add beneficiary' }) ] },
  { keys: ['notification', 'inbox', 'alerts'], name: 'Notifications', build: () => [
    comp('appbar', { title: 'Notifications' }), comp('sectionheader', { title: 'Today' }),
    comp('alert', { variant: 'success', title: 'Payment received', desc: 'Rp 350,000 from GTBank' }),
    comp('alert', { variant: 'warning', title: 'Card expiring', desc: 'Your card ends 09/27' }), comp('bottomnav', { active: 3 }) ] },
  { keys: ['setting', 'profile'], name: 'Settings', build: () => [
    comp('appbar', { title: 'Settings' }), comp('sectionheader', { title: 'Preferences' }),
    comp('toggleRow', { label: 'Face ID login', on: true }), comp('toggleRow', { label: 'Push notifications', on: true }),
    comp('toggleRow', { label: 'Email receipts', on: false }), comp('bottomnav', { active: 3 }) ] },
];

/* canonical top-to-bottom order for composed screens */
const ORDER = ['splash', 'appbar', 'stepper', 'tabs', 'pilltabs', 'illustration', 'success', 'title', 'subtitle', 'coachmark',
  'balance', 'quickactions', 'stat', 'chart', 'donut', 'linechart', 'cashflow', 'paycard', 'qr', 'amount', 'slider', 'chips', 'sectionheader', 'emptystate',
  'searchfield', 'textfield', 'phone', 'password', 'otp', 'pindots', 'keypad', 'datepicker', 'upload', 'radio', 'checkbox', 'toggleRow',
  'accountselect', 'list', 'transactions', 'txndetail', 'contacts', 'avatar', 'map', 'blog', 'chat', 'badges', 'pagination',
  'alert', 'toast', 'progress', 'loader', 'divider', 'biometric', 'swipe', 'bottomsheet', 'button', 'buttonSecondary', 'buttondock', 'bottomnav'];

function titleFrom(text) {
  const t = (text || '').replace(/[^a-z0-9 ]/gi, ' ')
    .replace(/\b(a|an|the|screen|page|with|that|has|have|for|of|and|to|my|new|create|make|build|add|design|shows?|containing|include[sd]?)\b/gi, ' ').trim();
  const w = t.split(/\s+/).filter(Boolean).slice(0, 2);
  return w.length ? w.map((x) => x[0].toUpperCase() + x.slice(1)).join(' ') : 'Screen';
}
function ctaLabel(t) {
  if (/sign ?up|register|create account/.test(t)) return 'Create account';
  if (/sign ?in|log ?in/.test(t)) return 'Sign in';
  if (/\bpay\b|payment/.test(t)) return 'Pay now';
  if (/\bsend\b|transfer/.test(t)) return 'Send';
  if (/verify|\botp\b|\bcode\b/.test(t)) return 'Verify';
  if (/get started|onboard|welcome/.test(t)) return 'Get started';
  if (/submit|save/.test(t)) return 'Submit';
  if (/done|complete|confirm|receipt/.test(t)) return 'Done';
  return 'Continue';
}

/* Compose a bespoke screen from free text: start from the closest preset (if any),
   then ADD every section the prompt explicitly asks for, and order it sensibly. */
function screenFromPrompt(text) {
  const t = (text || '').toLowerCase().trim();
  const dark = /\bdark( ?mode| theme)?\b/.test(t);
  const base = PRESETS.find((p) => p.keys.some((k) => t.includes(k)));
  const comps = base ? base.build(t).slice() : [];
  const have = new Set(comps.map((c) => c.type));
  const add = (type, props) => { if (!have.has(type)) { comps.push(comp(type, props)); have.add(type); } };

  const CUES = [
    [/splash|opening screen|launch screen|loading screen|brand intro/, () => add('splash', {})],
    [/app ?bar|top bar|nav header|header bar/, () => add('appbar', { title: titleFrom(text) })],
    [/stepper|kyc|multi[- ]?step|progress steps?|wizard/, () => add('stepper', {})],
    [/pill tabs|segmented/, () => add('pilltabs', {})],
    [/\btabs?\b/, () => add('tabs', {})],
    [/illustration|graphic|hero image|artwork|picture/, () => add('illustration', {})],
    [/success|confirmation|completed?|receipt|thank you/, () => add('success', {})],
    [/welcome|greeting|\btitle\b|headline|heading/, () => add('title', {})],
    [/subtitle|tagline|description text|subheading/, () => add('subtitle', {})],
    [/\bbalance\b/, () => add('balance', {})],
    [/cashflow|wallet card/, () => add('cashflow', {})],
    [/payment card|\bcard\b|debit card|credit card/, () => add('paycard', {})],
    [/\bamount\b|enter amount|money input/, () => add('amount', {})],
    [/filter chips|\bchips\b|filters?\b/, () => add('chips', {})],
    [/recent|section header|list header/, () => add('sectionheader', {})],
    [/\bsearch\b/, () => add('searchfield', {})],
    [/\bemail\b/, () => add('textfield', { label: 'Email', placeholder: 'you@example.com' })],
    [/phone|mobile|contact number|phone number/, () => add('phone', {})],
    [/password|passcode/, () => add('password', {})],
    [/\botp\b|one[- ]?time|verification code|\bpin\b|verify code/, () => add('otp', {})],
    [/radio|account type|choose (?:an )?option|single choice/, () => add('radio', {})],
    [/checkbox|terms|agree|consent|remember me|accept/, () => add('checkbox', {})],
    [/toggle|switch|preferences?|settings?/, () => add('toggleRow', {})],
    [/transactions?|activity|history/, () => { add('sectionheader', { title: 'Recent activity' }); add('transactions', {}); }],
    [/quick actions?|shortcuts?/, () => add('quickactions', {})],
    [/donut|pie chart|by category|spending breakdown|category breakdown/, () => add('donut', {})],
    [/line chart|balance (?:over time|trend)|trend line|growth chart/, () => add('linechart', {})],
    [/\bchart\b|graph|spending (?:graph|trend)|bar chart/, () => add('chart', {})],
    [/\bqr\b|scan to pay|scan code|qr code|show.*code/, () => add('qr', {})],
    [/transaction detail|receipt detail|payment detail|transfer receipt/, () => add('txndetail', {})],
    [/pin dots|pin indicator|enter (?:your )?pin/, () => add('pindots', {})],
    [/slider|range|adjust amount|loan amount|choose amount/, () => add('slider', {})],
    [/\bmap\b|branch|atm|locator|nearby|find.*branch/, () => add('map', {})],
    [/stat|statistic|income.*(spend|expense)|analytics/, () => add('stat', {})],
    [/menu list|settings? list|list of options|options list|preferences list/, () => add('list', {})],
    [/blog|article|news|read more|feed/, () => add('blog', {})],
    [/upload|dropzone|attach|document upload|\bkyc\b.*document|file picker|choose a file/, () => add('upload', {})],
    [/bottom sheet|action sheet|confirm(?:ation)? sheet|slide.?up (?:panel|sheet)/, () => add('bottomsheet', {})],
    [/pagination|pager|page indicator|carousel dots|onboarding dots/, () => add('pagination', {})],
    [/keypad|number ?pad|pin ?pad|numeric (?:pad|keyboard)|enter (?:your )?pin/, () => add('keypad', {})],
    [/button dock|docked (?:button|cta)|sticky (?:cta|button)|footer button/, () => add('buttondock', {})],
    [/choose|select|pick.*account|account selector|from which account/, () => add('accountselect', {})],
    [/avatars?|members?|participants?|group photo/, () => add('avatar', {})],
    [/\bchat\b|messages?|conversation|inbox thread/, () => add('chat', {})],
    [/calendar|date ?picker|pick a date|choose a date|schedule/, () => add('datepicker', {})],
    [/coachmark|coach mark|tooltip|walkthrough|onboarding tip/, () => add('coachmark', {})],
    [/empty state|no results|nothing here|no items/, () => add('emptystate', {})],
    [/\bloading\b|loader|spinner|please wait/, () => add('loader', {})],
    [/contacts?|recipients?|beneficiar|payees?/, () => add('contacts', {})],
    [/badges?|status pills?/, () => add('badges', {})],
    [/\balert\b|notice|banner/, () => add('alert', {})],
    [/\btoast\b|snackbar/, () => add('toast', {})],
    [/progress bar|loading|uploading/, () => add('progress', {})],
    [/\bdivider\b|separator/, () => add('divider', {})],
    [/biometric|face ?id|touch ?id|fingerprint/, () => add('biometric', {})],
    [/swipe to (?:pay|confirm|complete)|swipe button/, () => add('swipe', {})],
    [/bottom nav|tab bar|navigation bar|\bnavbar\b/, () => add('bottomnav', {})],
    [/sign ?in|log ?in|sign ?up|register|\bpay\b|\bsend\b|transfer|submit|continue|get started|verify|confirm|\bnext\b|\bdone\b|\bsave\b|\badd\b|\bapply\b|button/, () => add('button', { label: ctaLabel(t) })],
  ];
  CUES.forEach(([re, fn]) => { if (re.test(t)) fn(); });

  if (!comps.some((c) => c.type === 'appbar')) comps.unshift(comp('appbar', { title: titleFrom(text) }));
  if (comps.length <= 1) { add('title', {}); add('textfield', { label: 'Field', placeholder: 'Value' }); add('button', { label: 'Continue' }); }

  comps.sort((a, b) => (ORDER.indexOf(a.type) + 1 || 99) - (ORDER.indexOf(b.type) + 1 || 99));
  // short input (page-library name / single keyword) keeps the preset name;
  // a descriptive multi-word prompt is named from the prompt itself
  const wordCount = t.split(/\s+/).filter(Boolean).length;
  const name = (base && wordCount <= 2) ? base.name : titleFrom(text);
  return { name, comps, dark };
}

/* default e-banking sitemap */
const DEFAULT_FLOW = ['Onboarding', 'Login', 'Dashboard', 'Transfer', 'Confirmation'];

/* ── Project → multi-page sitemap ──────────────────────────────────────────
   From a plain-language brief + target audience + page count, choose a
   sensible set of e-banking pages and compose each from MaV components. */
function projectFromPrompt(desc, audience, count) {
  const t = ((desc || '') + ' ' + (audience || '')).toLowerCase();
  const dark = /\bdark( ?mode| theme)?\b/.test(t);
  const want = [];
  const add = (n) => { if (!want.includes(n)) want.push(n); };

  // essentials every banking app opens with
  add('Onboarding'); add('Login'); add('Dashboard');
  // feature-driven pages, pulled in when the brief mentions them
  const FEAT = [
    [/\botp\b|verif|2fa|two[- ]factor|security code/, ['Verify OTP']],
    [/card|debit|credit|visa|master/, ['Cards']],
    [/transfer|send money|\bsend\b|\bpay\b|remit|top ?up/, ['Transfer', 'Confirmation']],
    [/hist|transaction|statement|activity|spending/, ['Statements']],
    [/benefic|payee|recipient|contact/, ['Beneficiaries']],
    [/notif|alert|inbox|message/, ['Notifications']],
    [/setting|preferenc|manage/, ['Settings']],
    [/profile|kyc|identit|onboard/, ['Profile']],
  ];
  FEAT.forEach(([re, pages]) => { if (re.test(t)) pages.forEach(add); });
  // pad toward the requested count with a sensible default order
  ['Verify OTP', 'Cards', 'Transfer', 'Confirmation', 'Statements', 'Beneficiaries', 'Notifications', 'Settings', 'Profile'].forEach(add);

  const n = Math.max(1, Math.min(12, count || 6));
  const names = want.slice(0, n);
  return names.map((name) => { const g = screenFromPrompt(name); return { name: g.name, dark, comps: g.comps }; });
}
