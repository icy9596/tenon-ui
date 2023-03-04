const { resolve } = require('path');
const CWD = process.cwd();

const COMPONENTS_DIR = resolve(CWD, 'src');
const COMPONENTS_ENTRY = resolve(COMPONENTS_DIR, 'index.ts');

const ICONS_SVG_DIR = resolve(CWD, 'svg');
const ICONS_SOURCE_DIR = resolve(CWD, 'src');
const ICONS_COMPONENTS_DIR = resolve(ICONS_SOURCE_DIR, 'icons');
const ICONS_ENTRY = resolve(ICONS_SOURCE_DIR, 'index.ts');

module.exports = {
  COMPONENTS_DIR,
  COMPONENTS_ENTRY,
  ICONS_SVG_DIR,
  ICONS_SOURCE_DIR,
  ICONS_COMPONENTS_DIR,
  ICONS_ENTRY,
};
