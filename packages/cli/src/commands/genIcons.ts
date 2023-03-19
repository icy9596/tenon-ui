import chalk from 'chalk';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { capitalize, template } from 'lodash';
import { basename, resolve } from 'path';

import {
  ICONS_COMPONENTS_DIR,
  ICONS_ENTRY,
  ICONS_SVG_DIR,
} from '../utils/constants';
import { cleanDirFiles, errorLog, log, successLog } from '../utils/helper';

console.log('log');

interface IconInfo {
  iconFileName: string;
  iconName: string;
  svgIconName: string;
  svgIconFileName: string;
}
type IconsInfo = {
  [key: string]: IconInfo;
};

function getIconsInfo(icons: string[]) {
  return icons.reduce<IconsInfo>((memo, icon) => {
    const iconName = basename(icon, '.svg');
    const svgIconName = capitalize(iconName);
    const svgIconFileName = `${svgIconName}.tsx`;

    memo[icon] = {
      iconFileName: icon,
      iconName, // Svg名称
      svgIconName, // Svg组件名称
      svgIconFileName, // Svg组件文件名称
    };
    return memo;
  }, {});
}

const svgIconTpl = `import Icon from '../components/Icon';

const <%= svgIconName %> = (): JSX.Element => {
    return (
        <Icon>
            <%= svg %>
        </Icon>
    );
};

export default <%= svgIconName %>;`;

function genIconComponents(iconsInfo: IconsInfo) {
  Object.keys(iconsInfo).forEach((icon) => {
    const { iconFileName, svgIconName, svgIconFileName } = iconsInfo[icon];
    // 1.遍历文件，拿到文件内容
    const svg = readFileSync(resolve(ICONS_SVG_DIR, icon), 'utf8');
    // 2.把SvgIcon组件模板渲染
    const render = template(svgIconTpl);
    const svgIcon = render({ svgIconName, svg });
    // 3.写入组件文件
    writeFileSync(resolve(ICONS_COMPONENTS_DIR, svgIconFileName), svgIcon);
    log(
      chalk.blue(`🔧 generate [${iconFileName}] -> [${svgIconFileName}] done.`),
    );
  });
}

function genIconEnties(iconsInfo: IconsInfo) {
  const getExportCode = (comName: string) =>
    `export { default as ${comName} } from './icons/${comName}'`;
  const enties = Object.keys(iconsInfo)
    .map((icon) => {
      const { svgIconName } = iconsInfo[icon];
      return getExportCode(svgIconName);
    })
    .join('\n');
  writeFileSync(ICONS_ENTRY, enties);
}

function genIconsImpl() {
  cleanDirFiles(ICONS_COMPONENTS_DIR);

  const icons = readdirSync(ICONS_SVG_DIR);
  const iconsInfo = getIconsInfo(icons);
  genIconComponents(iconsInfo);
  genIconEnties(iconsInfo);
}

function genIcons() {
  try {
    genIconsImpl();
    successLog('Icons生成完毕！');
  } catch (e) {
    errorLog('Icons生成失败！');
    console.error(e);
  }
}

export default genIcons;
