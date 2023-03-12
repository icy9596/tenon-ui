const { existsSync, mkdirSync, writeFileSync } = require('fs');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const template = require('@babel/template').default;
const generate = require('@babel/generator').default;
const { join } = require('path');

const {
  readFile,
  writeFile,
  successLog,
  errorLog,
  getComTemplate,
} = require('../utils/helper');
const { COMPONENTS_DIR, COMPONENTS_ENTRY } = require('../utils/constants');

function createComponent(comName) {
  const exist = existsSync(join(COMPONENTS_DIR, comName));
  if (!exist) {
    createComponentImpl(comName);
    successLog('组件模板创建成功！');
  } else {
    errorLog('组件目录已存在，创建失败！');
  }
}

/**
 * 自动创建组件目录，并更新入口
 * @param {*} name 组件名称
 */
function createComponentImpl(comName) {
  updateEntry(comName);
  genComponent(comName);
}

function updateEntry(comName) {
  const oldCode = readFile(COMPONENTS_ENTRY);
  const ast = parse(oldCode, {
    sourceType: 'module',
    plugins: ['typescript'],
  });

  // code transform
  const vistor = {
    Program(path) {
      const { body } = path.node;
      const newExport = template.ast(`
                export { default as ${comName} } from './${comName}'; 
            `);
      body.push(newExport);
    },
  };
  traverse(ast, vistor);

  // 生成新代码
  const { code: newCode } = generate(ast);

  writeFile(COMPONENTS_ENTRY, newCode);
}

const getComPaths = (comName) => {
  const lowCaseComName = comName.toLowerCase();

  const dir = join(COMPONENTS_DIR, comName);
  const demo = join(dir, 'demo');
  const component = join(dir, `${comName}.tsx`);
  const entry = join(dir, 'index.ts');
  const less = join(dir, `${lowCaseComName}.less`);
  const md = join(dir, 'index.md');

  return {
    dir,
    demo,
    component,
    entry,
    less,
    md,
  };
};

function genComponent(comName) {
  const comPaths = getComPaths(comName);
  // 1.创建目录
  mkdirSync(comPaths.dir);
  // 2.创建组件模板
  writeFileSync(comPaths.component, getComTemplate(comName, 'com'));
  // 3.less
  writeFileSync(comPaths.less, '');
  // 4.文档
  writeFileSync(comPaths.md, `${comName}`);
  // 5.样例目录
  mkdirSync(comPaths.demo);
  // 6.创建入口文件
  writeFileSync(comPaths.entry, getComTemplate(comName, 'entry'));
}

module.exports = createComponent;
