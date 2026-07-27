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

  paycard: { label: 'Payment Card', group: 'Finance', render: (p) =>
    `<div class="pcard" style="background:linear-gradient(135deg,#2b2f6b,#0b0b12)"><div class="pcard-scrim"></div><div class="pcard-sheen"></div>
      <div class="pcard-data"><div class="pcard-number">${esc(p.number || '4539 1488 0343 6467')}</div>
        <div class="pcard-row"><div><div class="pcard-label">Card holder</div><div class="pcard-holder">${esc(p.holder || 'JULIO SANTOS')}</div></div>
        <div class="pcard-exp"><span class="lbl">Exp</span><span>${esc(p.exp || '09/27')}</span></div></div></div></div>` },

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
  bottomnav: [{ key: 'active', label: 'Active tab', def: 0, opts: [['Home', 0], ['Stats', 1], ['Cards', 2], ['Profile', 3]] }],
  tabs: [{ key: 'active', label: 'Active tab', def: 0, opts: [['1st', 0], ['2nd', 1], ['3rd', 2]] }],
  pilltabs: [{ key: 'active', label: 'Active', def: 0, opts: [['1st', 0], ['2nd', 1], ['3rd', 2]] }],
  progress: [{ key: 'value', label: 'Progress', def: 68, opts: [['25%', 25], ['50%', 50], ['75%', 75], ['100%', 100]] }],
  illustration: [{ key: 'src', label: 'Illustration', def: 'il-138.svg', opts: [['Option 1', 'il-138.svg'], ['Option 2', 'il-140.svg'], ['Option 3', 'il-166.svg'], ['Option 4', 'il-143.svg'], ['Option 5', 'il-152.svg']] }],
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
const ORDER = ['appbar', 'stepper', 'tabs', 'pilltabs', 'illustration', 'success', 'title', 'subtitle',
  'balance', 'cashflow', 'paycard', 'amount', 'chips', 'sectionheader', 'searchfield', 'textfield',
  'phone', 'password', 'otp', 'radio', 'checkbox', 'toggleRow', 'transactions', 'contacts', 'badges',
  'alert', 'toast', 'progress', 'divider', 'biometric', 'swipe', 'button', 'buttonSecondary', 'bottomnav'];

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
