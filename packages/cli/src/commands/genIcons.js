const { readdirSync, readFileSync, writeFileSync, rmSync } = require('fs');
const { resolve, basename } = require('path');
const { template, capitalize } = require('lodash');

const {
  ICONS_SVG_DIR,
  ICONS_SOURCE_DIR,
  ICONS_COMPONENTS_DIR,
  ICONS_ENTRY,
} = require('../utils/constants');
const { log, successLog, errorLog, cleanDirFiles } = require('../utils/helper');
const chalk = require('chalk');

function genIcons() {
  try {
    genIconsImpl();
    successLog('Icons生成完毕！');
  } catch (e) {
    errorLog('Icons生成失败！');
    console.error(e);
  }
}

function getIconsInfo(icons) {
  return icons.reduce((memo, icon) => {
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

function genIconsImpl() {
  cleanDirFiles(ICONS_COMPONENTS_DIR);

  const icons = readdirSync(ICONS_SVG_DIR);
  const iconsInfo = getIconsInfo(icons);
  genIconComponents(iconsInfo);
  genIconEnties(iconsInfo);
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

function genIconComponents(iconsInfo) {
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

function genIconEnties(iconsInfo) {
  const getExportCode = (comName) =>
    `export { default as ${comName} } from './icons/${comName}'`;
  const enties = Object.keys(iconsInfo)
    .map((icon) => {
      const { svgIconName } = iconsInfo[icon];
      return getExportCode(svgIconName);
    })
    .join('\n');
  writeFileSync(ICONS_ENTRY, enties);
}

module.exports = genIcons;
