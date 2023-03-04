const chalk = require('chalk');
const { join } = require('path');
const {
  readFileSync,
  writeFileSync,
  rmSync,
  readdirSync,
  statSync,
} = require('fs');

const LOG_PREFIX = '[@cui/cli]';

const readFile = (path) => {
  return readFileSync(path, { encoding: 'utf8' });
};

const writeFile = (path, content) => {
  writeFileSync(path, content, { encoding: 'utf8' });
};

const log = (message) => {
  console.log(`${LOG_PREFIX} ${message}`);
};

const errorLog = (message) => {
  console.log(`${LOG_PREFIX} ❌  ${chalk.bold.red(message)}`);
};

const successLog = (message) => {
  console.log(`${LOG_PREFIX} ✔️  ${chalk.bold.green(message)}`);
};

const getComTemplate = (comName, type) => {
  const templates = {
    com: [
      `const ${comName} = (): JSX.Element => {`,
      `\treturn <div>${comName}</div>;`,
      '};',
      '',
      `export default ${comName};`,
    ],
    entry: [
      `import ${comName} from './${comName}';`,
      '',
      `export default ${comName};`,
    ],
  };
  return templates[type].join('\n');
};

const cleanDirFiles = (path) => {
  const files = readdirSync(path);
  files.forEach((file) => {
    const filePath = join(path, file);
    const stat = statSync(filePath);
    if (stat.isFile()) {
      rmSync(filePath);
    }
  });
};

module.exports = {
  readFile,
  writeFile,
  log,
  errorLog,
  successLog,
  getComTemplate,
  cleanDirFiles,
};
