#!/usr/bin/env node
/**
 * generate-tokens.js
 * Reads all local Figma Variables from the CRM file and writes src/tokens.css
 *
 * Setup:
 *   1. Get a Figma Personal Access Token:
 *      figma.com → Account Settings → Personal access tokens → Generate
 *   2. Run:
 *      FIGMA_TOKEN=your_token node scripts/generate-tokens.js
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const FILE_KEY   = 'vvHKmF1Cx3BGO8EMSFMlnB';
const TOKEN      = process.env.FIGMA_TOKEN;
const __dirname  = dirname(fileURLToPath(import.meta.url));
const OUT_FILE   = join(__dirname, '../src/tokens.css');

if (!TOKEN) {
  console.error('❌  FIGMA_TOKEN env var is required.');
  console.error('    Run: FIGMA_TOKEN=your_token node scripts/generate-tokens.js');
  process.exit(1);
}

// ── Fetch ──────────────────────────────────────────────────────────────────

async function fetchVariables() {
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': TOKEN } });
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── Convert Figma color → hex ──────────────────────────────────────────────

function toHex({ r, g, b, a = 1 }) {
  const hex = [r, g, b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
  const alpha = a < 1 ? Math.round(a * 255).toString(16).padStart(2, '0') : '';
  return `#${hex}${alpha}`;
}

// ── Convert Figma variable name → CSS custom property name ────────────────
// Rule from CONTEXT.md: slashes and spaces → dashes, lowercase

function toCSSVar(name) {
  return '--' + name
    .toLowerCase()
    .replace(/\s*\/\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍  Fetching Figma variables…');
  const { meta } = await fetchVariables();

  const collections = meta.variableCollections;
  const variables   = meta.variables;

  // Resolve variable references recursively
  function resolveValue(variable, modeId) {
    const val = variable.valuesByMode[modeId];
    if (!val) return null;
    if (val.type === 'VARIABLE_ALIAS') {
      const ref = variables[val.id];
      if (!ref) return null;
      const refMode = Object.keys(ref.valuesByMode)[0];
      return resolveValue(ref, refMode);
    }
    if (typeof val === 'object' && 'r' in val) return toHex(val);
    return String(val);
  }

  // Group by collection
  const groups = {};
  for (const [, col] of Object.entries(collections)) {
    groups[col.name] = { collection: col, vars: [] };
  }
  for (const [, v] of Object.entries(variables)) {
    const col = collections[v.variableCollectionId];
    if (!col) continue;
    const modeId = col.defaultModeId;
    const value  = resolveValue(v, modeId);
    if (value === null) continue;
    groups[col.name].vars.push({ name: v.name, value });
  }

  // Build CSS output
  const lines = [
    '/* AUTO-GENERATED — do not edit manually.',
    ' * Run: FIGMA_TOKEN=your_token node scripts/generate-tokens.js',
    ' */',
    ':root {',
  ];

  const collectionOrder = ['Primitives', 'Semantic', 'Components'];
  const sorted = [
    ...collectionOrder.filter(n => groups[n]),
    ...Object.keys(groups).filter(n => !collectionOrder.includes(n)),
  ];

  for (const colName of sorted) {
    const { vars } = groups[colName];
    if (!vars.length) continue;
    lines.push(`\n  /* ── ${colName} ${'─'.repeat(Math.max(0, 60 - colName.length))} */`);
    for (const { name, value } of vars) {
      lines.push(`  ${toCSSVar(name)}: ${value};`);
    }
  }

  lines.push('}', '');
  writeFileSync(OUT_FILE, lines.join('\n'), 'utf8');
  console.log(`✅  Written ${vars?.length ?? '?'} tokens → src/tokens.css`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
