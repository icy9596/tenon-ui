import { resolve } from 'path';

export const CWD = process.cwd();

export const COMPONENTS_DIR = resolve(CWD, 'src');
export const COMPONENTS_ENTRY = resolve(COMPONENTS_DIR, 'index.ts');

export const ICONS_SVG_DIR = resolve(CWD, 'svg');
export const ICONS_SOURCE_DIR = resolve(CWD, 'src');
export const ICONS_COMPONENTS_DIR = resolve(ICONS_SOURCE_DIR, 'icons');
export const ICONS_ENTRY = resolve(ICONS_SOURCE_DIR, 'index.ts');

export const ROOT_PKG = resolve(CWD, 'package.json');
