#!/usr/bin/env node
/**
 * generate-theme.js
 * Reads Figma Variables and writes src/theme.ts (MUI PureLightTheme structure).
 *
 * Run:
 *   FIGMA_TOKEN=your_token node scripts/generate-theme.js
 *
 * Output: src/theme.ts — drop into developer's project as-is.
 *
 * Mapping: Figma Variable name → themeColors key
 *   Brand/Blue/500           → primary
 *   System/Secondary/500     → secondary
 *   System/Success/500       → success
 *   System/Warning/500       → warning
 *   System/Error/500         → error
 *   System/Info/500          → info
 *   System/Black             → black
 *   Brand/Blue/900           → primaryAlt
 *   Border Radius/MD         → borderRadiusSm
 *   Border Radius/Content    → borderRadius
 *   Border Radius/LG         → borderRadiusLg
 *   Border Radius/Content-XL → borderRadiusXl
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const FILE_KEY  = 'vvHKmF1Cx3BGO8EMSFMlnB';
const TOKEN     = process.env.FIGMA_TOKEN;
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE  = join(__dirname, '../src/theme.ts');

if (!TOKEN) {
  console.error('❌  FIGMA_TOKEN env var is required.');
  process.exit(1);
}

// ── Fetch ──────────────────────────────────────────────────────────────────

async function fetchVariables() {
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': TOKEN } });
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  return res.json();
}

function toHex({ r, g, b, a = 1 }) {
  const hex = [r, g, b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
  const al  = a < 1 ? Math.round(a * 255).toString(16).padStart(2, '0') : '';
  return `#${hex}${al}`;
}

// ── Build token map: "variable/name/lowercase" → resolved value ────────────

async function buildTokenMap() {
  const { meta } = await fetchVariables();
  const { variableCollections: collections, variables } = meta;

  function resolveValue(variable, modeId) {
    const val = variable.valuesByMode[modeId];
    if (!val) return null;
    if (val.type === 'VARIABLE_ALIAS') {
      const ref = variables[val.id];
      if (!ref) return null;
      return resolveValue(ref, Object.keys(ref.valuesByMode)[0]);
    }
    if (typeof val === 'object' && 'r' in val) return toHex(val);
    return String(val);
  }

  const map = {};
  for (const [, v] of Object.entries(variables)) {
    const col = collections[v.variableCollectionId];
    if (!col) continue;
    const value = resolveValue(v, col.defaultModeId);
    if (value !== null) {
      map[v.name.toLowerCase()] = value;
    }
  }
  return map;
}

// ── Lookup with fallback ───────────────────────────────────────────────────

function get(map, key, fallback, isMissing = false) {
  const val = map[key.toLowerCase()];
  if (val) return { value: val, source: 'figma' };
  return { value: fallback, source: isMissing ? 'todo' : 'default' };
}

// ── Generate theme.ts ──────────────────────────────────────────────────────

async function main() {
  console.log('🔍  Fetching Figma variables…');
  const tokenMap = await buildTokenMap();

  // ── Resolve themeColors ────────────────────────────────────────────────
  const tc = {
    primary:    get(tokenMap, 'brand/blue/500',        '#5569ff'),
    secondary:  get(tokenMap, 'system/secondary/500',  '#6E759F', true),
    success:    get(tokenMap, 'system/success/500',    '#00a76f'),
    warning:    get(tokenMap, 'system/warning/500',    '#FFA319', true),
    error:      get(tokenMap, 'system/error/500',      '#FF1943'),
    info:       get(tokenMap, 'system/info/500',       '#33C2FF', true),
    black:      get(tokenMap, 'system/black',          '#223354', true),
    white:      { value: '#ffffff', source: 'default' },
    primaryAlt: get(tokenMap, 'brand/blue/900',        '#000C57', true),
  };

  const br = {
    sm: get(tokenMap, 'border radius/md', '6px'),
    md: get(tokenMap, 'border radius/content', '10px', true),
    lg: get(tokenMap, 'border radius/lg', '12px'),
    xl: get(tokenMap, 'border radius/content-xl', '16px', true),
  };

  const todos = Object.entries(tc)
    .filter(([, v]) => v.source === 'todo')
    .map(([k]) => k);
  const brTodos = Object.entries(br)
    .filter(([, v]) => v.source === 'todo')
    .map(([k]) => k);

  if (todos.length || brTodos.length) {
    console.warn('⚠️  Missing in Figma Variables (using PureLightTheme defaults):');
    todos.forEach(k => console.warn(`    themeColors.${k}`));
    brTodos.forEach(k => console.warn(`    borderRadius.${k}`));
    console.warn('   → Add these to Figma Variables and re-run to sync.');
  }

  // Helper: annotate line with source
  const src = (key, obj = tc) => obj[key]?.source === 'todo'
    ? ' // TODO: add to Figma Variables'
    : obj[key]?.source === 'figma'
    ? ' // from Figma'
    : '';

  const output = `// AUTO-GENERATED — do not edit manually.
// Run: FIGMA_TOKEN=your_token node scripts/generate-theme.js
// Source: Figma file vvHKmF1Cx3BGO8EMSFMlnB (Variables → MUI theme)
//
// Missing tokens (marked TODO below) → add to Figma Variables and re-run.

import { alpha, createTheme, lighten, darken } from '@mui/material';

const themeColors = {
\tprimary:    '${tc.primary.value}',${src('primary')}
\tsecondary:  '${tc.secondary.value}',${src('secondary')}
\tsuccess:    '${tc.success.value}',${src('success')}
\twarning:    '${tc.warning.value}',${src('warning')}
\terror:      '${tc.error.value}',${src('error')}
\tinfo:       '${tc.info.value}',${src('info')}
\tblack:      '${tc.black.value}',${src('black')}
\twhite:      '#ffffff',
\tprimaryAlt: '${tc.primaryAlt.value}',${src('primaryAlt')}
};

const colors = {
\tgradients: {
\t\tblue1: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
\t\tblue2: 'linear-gradient(135deg, #ABDCFF 0%, #0396FF 100%)',
\t\tblue3: 'linear-gradient(127.55deg, #141E30 3.73%, #243B55 92.26%)',
\t\tblue4: 'linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)',
\t\tblue5: 'linear-gradient(135deg, #97ABFF 10%, #123597 100%)',
\t\torange1: 'linear-gradient(135deg, #FCCF31 0%, #F55555 100%)',
\t\torange2: 'linear-gradient(135deg, #FFD3A5 0%, #FD6585 100%)',
\t\torange3: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
\t\tpurple1: 'linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)',
\t\tpurple3: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
\t\tpink1: 'linear-gradient(135deg, #F6CEEC 0%, #D939CD 100%)',
\t\tpink2: 'linear-gradient(135deg, #F761A1 0%, #8C1BAB 100%)',
\t\tgreen1: 'linear-gradient(135deg, #FFF720 0%, #3CD500 100%)',
\t\tgreen2: 'linear-gradient(to bottom, #00b09b, #96c93d)',
\t\tblack1: 'linear-gradient(100.66deg, #434343 6.56%, #000000 93.57%)',
\t\tblack2: 'linear-gradient(60deg, #29323c 0%, #485563 100%)',
\t},
\tshadows: {
\t\tsuccess: '0px 1px 4px rgba(68, 214, 0, 0.25), 0px 3px 12px 2px rgba(68, 214, 0, 0.35)',
\t\terror: '0px 1px 4px rgba(255, 25, 67, 0.25), 0px 3px 12px 2px rgba(255, 25, 67, 0.35)',
\t\tinfo: '0px 1px 4px rgba(51, 194, 255, 0.25), 0px 3px 12px 2px rgba(51, 194, 255, 0.35)',
\t\tprimary: '0px 1px 4px rgba(85, 105, 255, 0.25), 0px 3px 12px 2px rgba(85, 105, 255, 0.35)',
\t\twarning: '0px 1px 4px rgba(255, 163, 25, 0.25), 0px 3px 12px 2px rgba(255, 163, 25, 0.35)',
\t\tcard: '0px 9px 16px rgba(159, 162, 191, .18), 0px 2px 2px rgba(159, 162, 191, 0.32)',
\t\tcardSm: '0px 2px 3px rgba(159, 162, 191, .18), 0px 1px 1px rgba(159, 162, 191, 0.32)',
\t\tcardLg: '0 5rem 14rem 0 rgb(255 255 255 / 30%), 0 0.8rem 2.3rem rgb(0 0 0 / 60%), 0 0.2rem 0.3rem rgb(0 0 0 / 45%)',
\t\theader: \`rgba(159, 162, 191, 0.18) 0px 2px 3px, rgba(159, 162, 191, 0.32) 0px 1px 1px\`,
\t},
\tlayout: {
\t\tgeneral: {
\t\t\tbodyBg: '#f2f5f9',
\t\t},
\t\tsidebar: {
\t\t\tbackground: themeColors.white,
\t\t\ttextColor: themeColors.secondary,
\t\t\tdividerBg: '#f2f5f9',
\t\t\tmenuItemColor: '#242E6F',
\t\t\tmenuItemColorActive: themeColors.primary,
\t\t\tmenuItemBg: themeColors.white,
\t\t\tmenuItemBgActive: '#f2f5f9',
\t\t\tmenuItemIconColor: lighten(themeColors.secondary, 0.3),
\t\t\tmenuItemIconColorActive: themeColors.primary,
\t\t\tmenuItemHeadingColor: darken(themeColors.secondary, 0.3),
\t\t},
\t},
\talpha: {
\t\twhite: {
\t\t\t5: alpha(themeColors.white, 0.02),
\t\t\t7: alpha(themeColors.white, 0.06),
\t\t\t10: alpha(themeColors.white, 0.1),
\t\t\t30: alpha(themeColors.white, 0.3),
\t\t\t50: alpha(themeColors.white, 0.5),
\t\t\t70: alpha(themeColors.white, 0.7),
\t\t\t100: themeColors.white,
\t\t},
\t\ttrueWhite: {
\t\t\t5: alpha(themeColors.white, 0.02),
\t\t\t10: alpha(themeColors.white, 0.1),
\t\t\t30: alpha(themeColors.white, 0.3),
\t\t\t50: alpha(themeColors.white, 0.5),
\t\t\t70: alpha(themeColors.white, 0.7),
\t\t\t100: themeColors.white,
\t\t},
\t\tblack: {
\t\t\t5: alpha(themeColors.black, 0.02),
\t\t\t10: alpha(themeColors.black, 0.1),
\t\t\t30: alpha(themeColors.black, 0.3),
\t\t\t50: alpha(themeColors.black, 0.5),
\t\t\t70: alpha(themeColors.black, 0.7),
\t\t\t100: themeColors.black,
\t\t},
\t},
\tsecondary: {
\t\tlighter: lighten(themeColors.secondary, 0.85),
\t\tlight: lighten(themeColors.secondary, 0.25),
\t\tmain: themeColors.secondary,
\t\tdark: darken(themeColors.secondary, 0.2),
\t},
\tprimary: {
\t\tlighter: lighten(themeColors.primary, 0.85),
\t\tlight: lighten(themeColors.primary, 0.3),
\t\textraLight: lighten(themeColors.primary, 0.1),
\t\tmain: themeColors.primary,
\t\tdark: darken(themeColors.primary, 0.2),
\t},
\tsuccess: {
\t\tlighter: lighten(themeColors.success, 0.85),
\t\tlight: lighten(themeColors.success, 0.3),
\t\tmain: themeColors.success,
\t\tdark: darken(themeColors.success, 0.2),
\t},
\twarning: {
\t\tlighter: lighten(themeColors.warning, 0.85),
\t\tlight: lighten(themeColors.warning, 0.3),
\t\tmain: themeColors.warning,
\t\tdark: darken(themeColors.warning, 0.2),
\t},
\terror: {
\t\tlighter: lighten(themeColors.error, 0.85),
\t\tlight: lighten(themeColors.error, 0.3),
\t\tmain: themeColors.error,
\t\tdark: darken(themeColors.error, 0.2),
\t},
\tinfo: {
\t\tlighter: lighten(themeColors.info, 0.85),
\t\tlight: lighten(themeColors.info, 0.3),
\t\tmain: themeColors.info,
\t\tdark: darken(themeColors.info, 0.2),
\t},
};

export const PureLightTheme = createTheme({
\tcolors: {
\t\tgradients: {
\t\t\tblue1: colors.gradients.blue1,
\t\t\tblue2: colors.gradients.blue2,
\t\t\tblue3: colors.gradients.blue3,
\t\t\tblue4: colors.gradients.blue4,
\t\t\tblue5: colors.gradients.blue5,
\t\t\torange1: colors.gradients.orange1,
\t\t\torange2: colors.gradients.orange2,
\t\t\torange3: colors.gradients.orange3,
\t\t\tpurple1: colors.gradients.purple1,
\t\t\tpurple3: colors.gradients.purple3,
\t\t\tpink1: colors.gradients.pink1,
\t\t\tpink2: colors.gradients.pink2,
\t\t\tgreen1: colors.gradients.green1,
\t\t\tgreen2: colors.gradients.green2,
\t\t\tblack1: colors.gradients.black1,
\t\t\tblack2: colors.gradients.black2,
\t\t},
\t\tshadows: {
\t\t\tsuccess: colors.shadows.success,
\t\t\terror: colors.shadows.error,
\t\t\tprimary: colors.shadows.primary,
\t\t\tinfo: colors.shadows.info,
\t\t\twarning: colors.shadows.warning,
\t\t},
\t\talpha: {
\t\t\twhite: {
\t\t\t\t5: alpha(themeColors.white, 0.02),
\t\t\t\t7: alpha(themeColors.white, 0.06),
\t\t\t\t10: alpha(themeColors.white, 0.1),
\t\t\t\t30: alpha(themeColors.white, 0.3),
\t\t\t\t50: alpha(themeColors.white, 0.5),
\t\t\t\t70: alpha(themeColors.white, 0.7),
\t\t\t\t100: themeColors.white,
\t\t\t},
\t\t\ttrueWhite: {
\t\t\t\t5: alpha(themeColors.white, 0.02),
\t\t\t\t10: alpha(themeColors.white, 0.1),
\t\t\t\t30: alpha(themeColors.white, 0.3),
\t\t\t\t50: alpha(themeColors.white, 0.5),
\t\t\t\t70: alpha(themeColors.white, 0.7),
\t\t\t\t100: themeColors.white,
\t\t\t},
\t\t\tblack: {
\t\t\t\t5: alpha(themeColors.black, 0.02),
\t\t\t\t10: alpha(themeColors.black, 0.1),
\t\t\t\t30: alpha(themeColors.black, 0.3),
\t\t\t\t50: alpha(themeColors.black, 0.5),
\t\t\t\t70: alpha(themeColors.black, 0.7),
\t\t\t\t100: themeColors.black,
\t\t\t},
\t\t},
\t\tsecondary: {
\t\t\tlighter: alpha(themeColors.secondary, 0.1),
\t\t\tlight: lighten(themeColors.secondary, 0.3),
\t\t\tmain: themeColors.secondary,
\t\t\tdark: darken(themeColors.secondary, 0.2),
\t\t},
\t\tprimary: {
\t\t\tlighter: alpha(themeColors.primary, 0.1),
\t\t\tlight: lighten(themeColors.primary, 0.3),
\t\t\textraLight: alpha(themeColors.primary, 0.1),
\t\t\textraLightHover: alpha(themeColors.primary, 0.2),
\t\t\tmain: themeColors.primary,
\t\t\tdark: darken(themeColors.primary, 0.2),
\t\t},
\t\tsuccess: {
\t\t\tlighter: alpha(themeColors.success, 0.1),
\t\t\tlight: lighten(themeColors.success, 0.3),
\t\t\tmain: themeColors.success,
\t\t\tdark: darken(themeColors.success, 0.2),
\t\t},
\t\twarning: {
\t\t\tlighter: alpha(themeColors.warning, 0.1),
\t\t\tlight: lighten(themeColors.warning, 0.3),
\t\t\tmain: themeColors.warning,
\t\t\tdark: darken(themeColors.warning, 0.2),
\t\t},
\t\terror: {
\t\t\tlighter: alpha(themeColors.error, 0.1),
\t\t\tlight: lighten(themeColors.error, 0.3),
\t\t\tmain: themeColors.error,
\t\t\tdark: darken(themeColors.error, 0.2),
\t\t},
\t\tinfo: {
\t\t\tlighter: alpha(themeColors.info, 0.1),
\t\t\tlight: lighten(themeColors.info, 0.3),
\t\t\tmain: themeColors.info,
\t\t\tdark: darken(themeColors.info, 0.2),
\t\t},
\t},
\tgeneral: {
\t\treactFrameworkColor: '#00D8FF',
\t\tborderRadiusSm: '${br.sm.value}',${br.sm.source === 'todo' ? ' // TODO: add to Figma Variables' : ' // from Figma'}
\t\tborderRadius: '${br.md.value}',${br.md.source === 'todo' ? ' // TODO: add Border Radius/Content to Figma Variables' : ' // from Figma'}
\t\tborderRadiusLg: '${br.lg.value}',${br.lg.source === 'todo' ? ' // TODO: add to Figma Variables' : ' // from Figma'}
\t\tborderRadiusXl: '${br.xl.value}',${br.xl.source === 'todo' ? ' // TODO: add Border Radius/Content-XL to Figma Variables' : ' // from Figma'}
\t},
\tsidebar: {
\t\tbackground: colors.layout.sidebar.background,
\t\ttextColor: colors.layout.sidebar.textColor,
\t\tdividerBg: colors.layout.sidebar.dividerBg,
\t\tmenuItemColor: colors.layout.sidebar.menuItemColor,
\t\tmenuItemColorActive: colors.layout.sidebar.menuItemColorActive,
\t\tmenuItemBg: colors.layout.sidebar.menuItemBg,
\t\tmenuItemBgActive: colors.layout.sidebar.menuItemBgActive,
\t\tmenuItemIconColor: colors.layout.sidebar.menuItemIconColor,
\t\tmenuItemIconColorActive: colors.layout.sidebar.menuItemIconColorActive,
\t\tmenuItemHeadingColor: colors.layout.sidebar.menuItemHeadingColor,
\t\tboxShadow: '2px 0 3px rgba(159, 162, 191, .18), 1px 0 1px rgba(159, 162, 191, 0.32)',
\t\twidth: 'auto',
\t},
\theader: {
\t\theight: '80px',
\t\tpadding: '10px 20px 10px 70px',
\t\tbackground: colors.alpha.white[100],
\t\tboxShadow: colors.shadows.cardSm,
\t\ttextColor: colors.secondary.main,
\t},
\tpalette: {
\t\tcommon: {
\t\t\tblack: colors.alpha.black[100],
\t\t\twhite: colors.alpha.white[100],
\t\t},
\t\tmode: 'light',
\t\tprimary: {
\t\t\tlight: colors.primary.light,
\t\t\tmain: colors.primary.main,
\t\t\tdark: colors.primary.dark,
\t\t},
\t\tsecondary: {
\t\t\tlight: colors.secondary.light,
\t\t\tmain: colors.secondary.main,
\t\t\tdark: colors.secondary.dark,
\t\t},
\t\terror: {
\t\t\tlight: colors.error.light,
\t\t\tmain: colors.error.main,
\t\t\tdark: colors.error.dark,
\t\t\tcontrastText: colors.alpha.white[100],
\t\t},
\t\tsuccess: {
\t\t\tlight: colors.success.light,
\t\t\tmain: colors.success.main,
\t\t\tdark: colors.success.dark,
\t\t\tcontrastText: colors.alpha.white[100],
\t\t},
\t\tinfo: {
\t\t\tlight: colors.info.light,
\t\t\tmain: colors.info.main,
\t\t\tdark: colors.info.dark,
\t\t\tcontrastText: colors.alpha.white[100],
\t\t},
\t\twarning: {
\t\t\tlight: colors.warning.light,
\t\t\tmain: colors.warning.main,
\t\t\tdark: colors.warning.dark,
\t\t\tcontrastText: colors.alpha.white[100],
\t\t},
\t\ttext: {
\t\t\tprimary: colors.alpha.black[100],
\t\t\tsecondary: colors.alpha.black[70],
\t\t\tdisabled: colors.alpha.black[50],
\t\t},
\t\tbackground: {
\t\t\tpaper: colors.alpha.white[100],
\t\t\tdefault: colors.layout.general.bodyBg,
\t\t},
\t\taction: {
\t\t\tactive: colors.alpha.black[100],
\t\t\thover: colors.primary.lighter,
\t\t\thoverOpacity: 0.1,
\t\t\tselected: colors.alpha.black[10],
\t\t\tselectedOpacity: 0.1,
\t\t\tdisabled: colors.alpha.black[50],
\t\t\tdisabledBackground: colors.alpha.black[5],
\t\t\tdisabledOpacity: 0.38,
\t\t\tfocus: colors.alpha.black[10],
\t\t\tfocusOpacity: 0.05,
\t\t\tactivatedOpacity: 0.12,
\t\t},
\t\ttonalOffset: 0.5,
\t},
\tbreakpoints: {
\t\tvalues: {
\t\t\txs: 0,
\t\t\tsm: 600,
\t\t\tmd: 960,
\t\t\tlg: 1280,
\t\t\txl: 1840,
\t\t},
\t},
\tcomponents: {
\t\tRaSavedQueriesList: {
\t\t\tstyleOverrides: {
\t\t\t\troot: {
\t\t\t\t\tminWidth: '200px',
\t\t\t\t\t'& .MuiList-root': { marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr' },
\t\t\t\t\t'& .RaSavedQueriesList-floatingIcon': { top: '-2.5em' },
\t\t\t\t\t'& .MuiListItemButton-root.RaSavedQueryFilterListItem-listItemButton': { paddingRight: '3em' },
\t\t\t\t},
\t\t\t\tfloatingIcon: { top: '-2.5em' },
\t\t\t},
\t\t},
\t\tMuiBackdrop: {
\t\t\tstyleOverrides: {
\t\t\t\troot: {
\t\t\t\t\tbackgroundColor: alpha(darken(themeColors.primaryAlt, 0.4), 0.2),
\t\t\t\t\tbackdropFilter: 'blur(2px)',
\t\t\t\t\t'&.MuiBackdrop-invisible': { backgroundColor: 'transparent' },
\t\t\t\t},
\t\t\t},
\t\t},
\t\tMuiModal: {
\t\t\tstyleOverrides: {
\t\t\t\tbackdrop: { backdropFilter: 'none', backgroundColor: 'transparent' },
\t\t\t},
\t\t},
\t\tMuiFormHelperText: {
\t\t\tstyleOverrides: {
\t\t\t\troot: { textTransform: 'none', marginLeft: 8, marginRight: 8, fontWeight: 'bold' },
\t\t\t},
\t\t},
\t\tMuiCssBaseline: {
\t\t\tstyleOverrides: {
\t\t\t\t'html, body': { width: '100%', height: '100%' },
\t\t\t\tbody: { display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%', flex: 1 },
\t\t\t\t'#root': { width: '100%', height: '100%', display: 'flex', flex: 1, flexDirection: 'column' },
\t\t\t\thtml: { display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%', MozOsxFontSmoothing: 'grayscale', WebkitFontSmoothing: 'antialiased' },
\t\t\t\t'.child-popover .MuiPaper-root .MuiList-root': { flexDirection: 'column' },
\t\t\t\t'#nprogress': { pointerEvents: 'none' },
\t\t\t\t'#nprogress .bar': { background: colors.primary.lighter },
\t\t\t\t'#nprogress .spinner-icon': { borderTopColor: colors.primary.lighter, borderLeftColor: colors.primary.lighter },
\t\t\t\t'#nprogress .peg': { boxShadow: '0 0 15px ' + colors.primary.lighter + ', 0 0 8px' + colors.primary.light },
\t\t\t\t':root': { '--swiper-theme-color': colors.primary.main },
\t\t\t\tcode: { background: colors.info.lighter, color: colors.info.dark, borderRadius: 4, padding: 4 },
\t\t\t\t'@keyframes ripple': { '0%': { transform: 'scale(.8)', opacity: 1 }, '100%': { transform: 'scale(2.8)', opacity: 0 } },
\t\t\t\t'@keyframes float': { '0%': { transform: 'translate(0%, 0%)' }, '100%': { transform: 'translate(3%, 3%)' } },
\t\t\t},
\t\t},
\t\tMuiSelect: {
\t\t\tstyleOverrides: {
\t\t\t\ticonOutlined: { color: colors.alpha.black[50] },
\t\t\t\ticon: { top: 'calc(50% - 14px)' },
\t\t\t},
\t\t},
\t\tMuiOutlinedInput: {
\t\t\tstyleOverrides: {
\t\t\t\troot: {
\t\t\t\t\t'&::placeholder': { color: '#B8B8B8', fontSize: 16, fontWeight: 400 },
\t\t\t\t\t'& .MuiOutlinedInput-notchedOutline': { borderColor: '#808080', borderRadius: 6 },
\t\t\t\t\t'& .MuiInputAdornment-positionEnd.MuiInputAdornment-outlined': { paddingRight: 6 },
\t\t\t\t\t'&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.alpha.black[50] },
\t\t\t\t\t'&.Mui-focused:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary.main, borderWidth: 1 },
\t\t\t\t\t'&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 1 },
\t\t\t\t},
\t\t\t},
\t\t},
\t\tMuiListSubheader: {
\t\t\tstyleOverrides: {
\t\t\t\tcolorPrimary: { fontWeight: 'bold', lineHeight: '40px', fontSize: 13, background: colors.alpha.black[5], color: colors.alpha.black[70] },
\t\t\t},
\t\t},
\t\tMuiCardHeader: {
\t\t\tstyleOverrides: {
\t\t\t\taction: { marginTop: -5, marginBottom: -5 },
\t\t\t\ttitle: { fontSize: 15 },
\t\t\t},
\t\t},
\t\tMuiRadio: { styleOverrides: { root: { borderRadius: '50px' } } },
\t\tMuiChip: {
\t\t\tstyleOverrides: {
\t\t\t\tcolorSecondary: { background: colors.alpha.black[5], color: colors.alpha.black[100], '&:hover': { background: colors.alpha.black[10] } },
\t\t\t\tdeleteIcon: { color: colors.error.light, '&:hover': { color: colors.error.main } },
\t\t\t},
\t\t},
\t\tMuiAccordion: {
\t\t\tstyleOverrides: {
\t\t\t\troot: { boxShadow: 'none', '&.Mui-expanded': { margin: 0 }, '&::before': { display: 'none' } },
\t\t\t},
\t\t},
\t\tMuiAvatar: {
\t\t\tstyleOverrides: {
\t\t\t\troot: { fontSize: 14, fontWeight: 'bold' },
\t\t\t\tcolorDefault: { background: colors.alpha.black[30], color: colors.alpha.white[100] },
\t\t\t},
\t\t},
\t\tMuiAvatarGroup: {
\t\t\tstyleOverrides: {
\t\t\t\troot: { alignItems: 'center' },
\t\t\t\tavatar: { background: colors.alpha.black[10], fontSize: 13, color: colors.alpha.black[70], fontWeight: 'bold', '&:first-of-type': { border: 0, background: 'transparent' } },
\t\t\t},
\t\t},
\t\tMuiListItemAvatar: { styleOverrides: { alignItemsFlexStart: { marginTop: 0 } } },
\t\tMuiPaginationItem: {
\t\t\tstyleOverrides: {
\t\t\t\tpage: { fontSize: 13, fontWeight: 'bold', transition: 'all .2s' },
\t\t\t\ttextPrimary: {
\t\t\t\t\t'&.Mui-selected': { boxShadow: colors.shadows.primary },
\t\t\t\t\t'&.MuiButtonBase-root:hover': { background: colors.alpha.black[5] },
\t\t\t\t\t'&.Mui-selected.MuiButtonBase-root:hover': { background: colors.primary.main },
\t\t\t\t},
\t\t\t},
\t\t},
\t\tMuiButton: {
\t\t\tdefaultProps: { disableRipple: true },
\t\t\tstyleOverrides: {
\t\t\t\troot: { fontWeight: 500, textTransform: 'none', paddingLeft: 16, paddingRight: 16, borderRadius: 6, fontSize: 14, '.MuiSvgIcon-root': { transition: 'all .2s' } },
\t\t\t\toutlinedPrimary: { color: colors.primary.main, borderColor: colors.primary.main, '&:hover, &.MuiSelected': { borderWidth: 2 } },
\t\t\t\tendIcon: { marginRight: -8 },
\t\t\t\tcontained: { '&.MuiButton-colorSecondary': { backgroundColor: colors.secondary.main, color: colors.alpha.white[100], border: '1px solid ' + colors.alpha.black[30] } },
\t\t\t\toutlined: { borderWidth: 2, '&.MuiButton-colorSecondary': { backgroundColor: colors.alpha.white[100], '&:hover, &.MuiSelected': { backgroundColor: colors.alpha.black[5], color: colors.alpha.black[100] } } },
\t\t\t\tsizeSmall: { padding: '6px 16px', lineHeight: 1.5 },
\t\t\t\tsizeMedium: { padding: '5px 20px' },
\t\t\t\tsizeLarge: { padding: '11px 24px' },
\t\t\t\ttextSizeSmall: { padding: '7px 12px' },
\t\t\t\ttextSizeMedium: { padding: '9px 16px' },
\t\t\t\ttextSizeLarge: { padding: '12px 16px' },
\t\t\t},
\t\t},
\t\tMuiButtonBase: {
\t\t\tdefaultProps: { disableRipple: false },
\t\t\tstyleOverrides: { root: { borderRadius: 6 } },
\t\t},
\t\tMuiToggleButton: {
\t\t\tdefaultProps: { disableRipple: true },
\t\t\tstyleOverrides: {
\t\t\t\troot: { color: colors.primary.main, background: colors.alpha.white[100], transition: 'all .2s', '&:hover, &.Mui-selected, &.Mui-selected:hover': { color: colors.alpha.white[100], background: colors.primary.main } },
\t\t\t},
\t\t},
\t\tMuiIconButton: {
\t\t\tstyleOverrides: {
\t\t\t\troot: { borderRadius: 8, padding: 8, '& .MuiTouchRipple-root': { borderRadius: 8 } },
\t\t\t\tsizeSmall: { padding: 4 },
\t\t\t},
\t\t},
\t\tMuiListItemText: { styleOverrides: { root: { margin: 0 } } },
\t\tMuiListItemButton: { styleOverrides: { root: { '& .MuiTouchRipple-root': { opacity: 0.3 } } } },
\t\tMuiDivider: {
\t\t\tstyleOverrides: {
\t\t\t\troot: { background: colors.alpha.black[10], border: 0, height: 1 },
\t\t\t\tvertical: { height: 'auto', width: 1, '&.MuiDivider-flexItem.MuiDivider-fullWidth': { height: 'auto' }, '&.MuiDivider-absolute.MuiDivider-fullWidth': { height: '100%' } },
\t\t\t\twithChildren: { '&:before, &:after': { border: 0 } },
\t\t\t\twrapper: { background: colors.alpha.white[100], fontWeight: 'bold', height: 24, lineHeight: '24px', marginTop: -12, color: 'inherit', textTransform: 'uppercase' },
\t\t\t},
\t\t},
\t\tMuiPaper: {
\t\t\tstyleOverrides: {
\t\t\t\troot: { padding: 0 },
\t\t\t\televation0: { boxShadow: 'none' },
\t\t\t\televation: { boxShadow: colors.shadows.card },
\t\t\t\televation2: { boxShadow: colors.shadows.cardSm },
\t\t\t\televation24: { boxShadow: colors.shadows.cardLg },
\t\t\t\toutlined: { boxShadow: colors.shadows.card },
\t\t\t},
\t\t},
\t\tMuiLink: { defaultProps: { underline: 'hover' } },
\t\tMuiLinearProgress: { styleOverrides: { root: { borderRadius: 6, height: 6 } } },
\t\tMuiSlider: {
\t\t\tstyleOverrides: {
\t\t\t\troot: {
\t\t\t\t\t'& .MuiSlider-valueLabelCircle, .MuiSlider-valueLabelLabel': { transform: 'none' },
\t\t\t\t\t'& .MuiSlider-valueLabel': { borderRadius: 6, background: colors.alpha.black[100], color: colors.alpha.white[100] },
\t\t\t\t},
\t\t\t},
\t\t},
\t\tMuiList: {
\t\t\tstyleOverrides: {
\t\t\t\troot: {
\t\t\t\t\tpadding: 0,
\t\t\t\t\t'& .MuiListItem-button': { transition: 'all .2s', '& > .MuiSvgIcon-root': { minWidth: 34 }, '& .MuiTouchRipple-root': { opacity: 0.2 } },
\t\t\t\t\t'& .MuiListItem-root.MuiButtonBase-root.Mui-selected': { backgroundColor: alpha(colors.primary.lighter, 0.4) },
\t\t\t\t\t'& .MuiMenuItem-root.MuiButtonBase-root:active': { backgroundColor: alpha(colors.primary.lighter, 0.4) },
\t\t\t\t\t'& .MuiMenuItem-root.MuiButtonBase-root .MuiTouchRipple-root': { opacity: 0.2 },
\t\t\t\t},
\t\t\t\tpadding: { padding: '12px', '& .MuiListItem-button': { borderRadius: 6, margin: '1px 0' } },
\t\t\t},
\t\t},
\t\tMuiTabs: {
\t\t\tstyleOverrides: {
\t\t\t\troot: { height: 38, minHeight: 38, overflow: 'visible' },
\t\t\t\tindicator: { height: 38, minHeight: 38, borderRadius: 6, border: '1px solid ' + colors.primary.dark, boxShadow: '0px 2px 10px ' + colors.primary.light },
\t\t\t\tscrollableX: { overflow: 'visible !important' },
\t\t\t},
\t\t},
\t\tMuiTab: {
\t\t\tstyleOverrides: {
\t\t\t\troot: {
\t\t\t\t\tpadding: 0, height: 38, minHeight: 38, borderRadius: 6, transition: 'color .2s', textTransform: 'capitalize',
\t\t\t\t\t'&.MuiButtonBase-root': { minWidth: 'auto', paddingLeft: 20, paddingRight: 20, marginRight: 4 },
\t\t\t\t\t'&.Mui-selected, &.Mui-selected:hover': { color: colors.alpha.white[100], zIndex: 5 },
\t\t\t\t\t'&:hover': { color: colors.alpha.black[100] },
\t\t\t\t},
\t\t\t},
\t\t},
\t\tMuiMenu: {
\t\t\tstyleOverrides: {
\t\t\t\tpaper: { padding: 12 },
\t\t\t\tlist: {
\t\t\t\t\tpadding: 12,
\t\t\t\t\t'& .MuiMenuItem-root.MuiButtonBase-root': {
\t\t\t\t\t\tfontSize: 14, marginTop: 1, marginBottom: 1, transition: 'all .2s', color: 'black',
\t\t\t\t\t\t'& .MuiTouchRipple-root': { opacity: 0.2 },
\t\t\t\t\t\t'&:hover, &:active, &.active, &.Mui-selected': { background: alpha(colors.primary.lighter, 0.4) },
\t\t\t\t\t},
\t\t\t\t},
\t\t\t},
\t\t},
\t\tMuiMenuItem: {
\t\t\tstyleOverrides: {
\t\t\t\troot: {
\t\t\t\t\tbackground: 'transparent', transition: 'all .2s', color: colors.alpha.white[70],
\t\t\t\t\t'&:hover, &:active, &.active, &.Mui-selected': { color: colors.alpha.white[100], background: colors.alpha.white[7] },
\t\t\t\t\t'&.Mui-selected:hover': { background: alpha(colors.primary.lighter, 0.4) },
\t\t\t\t},
\t\t\t},
\t\t},
\t\tMuiListItem: {
\t\t\tstyleOverrides: {
\t\t\t\troot: {
\t\t\t\t\t'&.MuiButtonBase-root': {
\t\t\t\t\t\tcolor: colors.secondary.main,
\t\t\t\t\t\t'&:hover, &:active, &.active, &.Mui-selected': { color: colors.alpha.black[100], background: lighten(colors.primary.lighter, 0.5) },
\t\t\t\t\t},
\t\t\t\t},
\t\t\t},
\t\t},
\t\tMuiAutocomplete: {
\t\t\tstyleOverrides: {
\t\t\t\ttag: { margin: 1 },
\t\t\t\troot: { '.MuiAutocomplete-inputRoot.MuiOutlinedInput-root .MuiAutocomplete-endAdornment': { right: 14 } },
\t\t\t\tclearIndicator: { background: colors.error.lighter, color: colors.error.main, marginRight: 8, '&:hover': { background: colors.error.lighter, color: colors.error.dark } },
\t\t\t\tpopupIndicator: { color: colors.alpha.black[50], '&:hover': { background: colors.primary.lighter, color: colors.primary.main } },
\t\t\t},
\t\t},
\t\tMuiTablePagination: {
\t\t\tstyleOverrides: {
\t\t\t\ttoolbar: { '& .MuiIconButton-root': { padding: 8 } },
\t\t\t\tselect: { '&:focus': { backgroundColor: 'transparent' } },
\t\t\t},
\t\t},
\t\tMuiToolbar: { styleOverrides: { root: { minHeight: '0 !important', padding: '0' } } },
\t\tMuiTableRow: {
\t\t\tstyleOverrides: {
\t\t\t\thead: { background: colors.alpha.black[5] },
\t\t\t\troot: { transition: 'background-color .2s', '&.MuiTableRow-hover:hover': { backgroundColor: colors.alpha.black[5] } },
\t\t\t},
\t\t},
\t\tMuiTableCell: {
\t\t\tstyleOverrides: {
\t\t\t\troot: { borderBottomColor: colors.alpha.black[10], fontSize: 14 },
\t\t\t\thead: { textTransform: 'uppercase', fontSize: 13, fontWeight: 'bold', color: colors.alpha.black[70] },
\t\t\t},
\t\t},
\t\tMuiTooltip: {
\t\t\tstyleOverrides: {
\t\t\t\ttooltip: { backgroundColor: alpha(colors.alpha.black['100'], 0.95), padding: '8px 16px', fontSize: 13 },
\t\t\t\tarrow: { color: alpha(colors.alpha.black['100'], 0.95) },
\t\t\t},
\t\t},
\t\tMuiSwitch: {
\t\t\tstyleOverrides: {
\t\t\t\troot: {
\t\t\t\t\theight: 33, overflow: 'visible', padding: '12px',
\t\t\t\t\t'& .MuiButtonBase-root': { position: 'absolute', top: '2px', padding: 6, transition: 'left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms' },
\t\t\t\t\t'& .MuiIconButton-root': { borderRadius: 100 },
\t\t\t\t\t'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { opacity: 0.3 },
\t\t\t\t},
\t\t\t\tthumb: { border: '1px solid ' + colors.alpha.black[30], boxShadow: '0px 9px 14px ' + colors.alpha.black[10] + ', 0px 2px 2px ' + colors.alpha.black[10] },
\t\t\t\ttrack: { backgroundColor: colors.alpha.black[5], border: '1px solid ' + colors.alpha.black[10], boxShadow: 'inset 0px 1px 1px ' + colors.alpha.black[10], opacity: 1 },
\t\t\t\tcolorPrimary: { '& .MuiSwitch-thumb': { backgroundColor: colors.alpha.white[100] }, '&.Mui-checked .MuiSwitch-thumb': { backgroundColor: colors.primary.main } },
\t\t\t},
\t\t},
\t\tMuiStepper: { styleOverrides: { root: { paddingTop: 20, paddingBottom: 20, background: colors.alpha.black[5] } } },
\t\tMuiStepIcon: { styleOverrides: { root: { '&.MuiStepIcon-completed': { color: colors.success.main } } } },
\t\tMuiTypography: {
\t\t\tdefaultProps: {
\t\t\t\tvariantMapping: { h1: 'h1', h2: 'h2', h3: 'div', h4: 'div', h5: 'div', h6: 'div', subtitle1: 'div', subtitle2: 'div', body1: 'div', body2: 'div' },
\t\t\t},
\t\t\tstyleOverrides: {
\t\t\t\tgutterBottom: { marginBottom: 4 },
\t\t\t\tparagraph: { fontSize: 17, lineHeight: 1.7 },
\t\t\t},
\t\t},
\t},
\tshape: { borderRadius: 10 },
\ttypography: {
\t\tfontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
\t\th1: { fontWeight: 700, fontSize: 35 },
\t\th2: { fontWeight: 700, fontSize: 30 },
\t\th3: { fontWeight: 700, fontSize: 25, lineHeight: 1.4, color: colors.alpha.black[100] },
\t\th4: { fontWeight: 700, fontSize: 16 },
\t\th5: { fontWeight: 700, fontSize: 14 },
\t\th6: { fontSize: 15 },
\t\tbody1: { fontSize: 14 },
\t\tbody2: { fontSize: 14 },
\t\tbutton: { fontWeight: 600 },
\t\tcaption: { fontSize: 13, textTransform: 'uppercase', color: colors.alpha.black[50] },
\t\tsubtitle1: { fontSize: 14, color: colors.alpha.black[70] },
\t\tsubtitle2: { fontWeight: 400, fontSize: 15, color: colors.alpha.black[70] },
\t\toverline: { fontSize: 13, fontWeight: 700, textTransform: 'uppercase' },
\t},
});
`;

  writeFileSync(OUT_FILE, output, 'utf8');

  const fromFigma  = Object.values(tc).filter(v => v.source === 'figma').length;
  const withTodos  = Object.values(tc).filter(v => v.source === 'todo').length;
  console.log(`✅  Written src/theme.ts`);
  console.log(`    Colors from Figma: ${fromFigma} / ${Object.keys(tc).length}`);
  if (withTodos) console.log(`    ⚠️  ${withTodos} color(s) use PureLightTheme defaults — add to Figma Variables to sync`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
