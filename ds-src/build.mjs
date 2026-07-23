import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const COMP_DIR = 'src/components';
const files = fs.readdirSync(COMP_DIR).filter(f => f.endsWith('.jsx')).sort();

// Heuristic TS type for a prop name (loose but gives the design agent real names).
function typeFor(name) {
  if (name === 'className') return 'string';
  if (name === 'children') return 'React.ReactNode';
  if (/^on[A-Z]/.test(name)) return '() => void';
  if (/^(is|has|show|open|active|checked|disabled|light|selected|loading|done|error|read|dim|filled|outline|muted|delivered|short)$|^(is|has|show)[A-Z]/.test(name)) return 'boolean';
  if (/^(value|count|index|percent|size|length|step|current|total|max|min|columns|rows|day|month)$/i.test(name)) return 'number | string';
  if (/^(items|options|actions|data|rows|steps|slots)$/i.test(name)) return 'any[]';
  return 'React.ReactNode';
}

const exportsLines = [];
const dtsParts = ["import * as React from 'react';\n"];

for (const file of files) {
  const name = path.basename(file, '.jsx');
  const src = fs.readFileSync(path.join(COMP_DIR, file), 'utf8');
  // export * so multi-part components (List + ListRow + ListAvatar …) all reach
  // window.<global> at runtime; the .d.ts below documents the primary export.
  exportsLines.push(`export * from './components/${file}';`);

  // leading JSDoc for the component
  const jsdoc = (src.match(/\/\*\*[\s\S]*?\*\//) || [''])[0];

  // destructured props from `export function Name({ ... })`
  const m = src.match(new RegExp(`export\\s+function\\s+${name}\\s*\\(\\s*\\{([\\s\\S]*?)\\}`));
  const props = [];
  if (m) {
    // strip nested default-object braces crudely, then split top-level commas
    let body = m[1];
    for (const raw of body.split(',')) {
      const t = raw.trim();
      if (!t || t.startsWith('...')) continue;
      const pn = t.split(/[=:]/)[0].trim();
      if (/^[A-Za-z_$][\w$]*$/.test(pn) && !props.includes(pn)) props.push(pn);
    }
  }
  const fields = props.map(p => `  ${p}?: ${typeFor(p)};`);
  if (!props.includes('className')) fields.push('  className?: string;');
  if (!props.includes('children')) fields.push('  children?: React.ReactNode;');

  dtsParts.push(`export interface ${name}Props {\n${fields.join('\n')}\n}`);
  if (jsdoc) dtsParts.push(jsdoc);
  dtsParts.push(`export declare function ${name}(props: ${name}Props): React.ReactElement;\n`);
}

fs.writeFileSync('src/index.jsx', exportsLines.join('\n') + '\n');

await esbuild.build({
  entryPoints: ['src/index.jsx'],
  outfile: 'dist/index.es.js',
  bundle: true, format: 'esm', jsx: 'automatic',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  logLevel: 'info',
});

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.d.ts', dtsParts.join('\n'));
console.log(`built dist/index.es.js + dist/index.d.ts (${files.length} components)`);
