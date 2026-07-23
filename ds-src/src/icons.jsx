// Inline icon paths lifted from the source pages' <symbol> defs, so wrappers
// render standalone (the pages rely on <use href="#ic-*">, unavailable in the bundle).
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
export const Icon = ({ name, ...rest }) => {
  const P = {
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="M5 13l4 4L19 7" />,
    'chevrons-right': <path d="m6 17 5-5-5-5M13 17l5-5-5-5" />,
    eye: <><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></>,
    'alert-tri': <><path d="M12 7v6" /><path d="M12 16.5h.01" /></>,
    info: <><path d="M12 11v5" /><path d="M12 8h.01" /></>,
    bell: <><path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" /></>,
  }[name] || null;
  return <svg {...base} {...rest}>{P}</svg>;
};
