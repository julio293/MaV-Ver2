// Regenerate ds-src/styles/components.css — self-contained, verbatim.
// fonts @import  +  css/tokens.css (verbatim)  +  css/shared.css (verbatim)
// +  every components/*.html inline <style> block (verbatim).
import fs from 'node:fs';
const FONT = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');";
const tokens = fs.readFileSync('css/tokens.css','utf8').replace(/^\s*@import[^;]+;\s*/,'').trim();
const shared = fs.readFileSync('css/shared.css','utf8').trim();
const pages = fs.readdirSync('components').filter(f=>f.endsWith('.html') && f!=='all.html').map(f=>f.replace('.html',''));
let comp='';
for (const p of pages){
  const m = fs.readFileSync(`components/${p}.html`,'utf8').match(/<style>([\s\S]*?)<\/style>/);
  if(m) comp += `\n/* ══════════ ${p}.html ══════════ */\n` + m[1].trim() + '\n';
}
const out=[FONT,'/* MaV — self-contained: fonts + tokens + shared + all component page styles (verbatim). */','',
  '/* ═══ TOKENS ═══ */',tokens,'','/* ═══ SHARED ═══ */',shared,'','/* ═══ COMPONENTS ═══ */',comp].join('\n');
fs.writeFileSync('ds-src/styles/components.css', out);
console.log('wrote components.css', out.length, 'bytes,', pages.length, 'pages');
