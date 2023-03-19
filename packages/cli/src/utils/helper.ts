import chalk from 'chalk';
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import ora, { type Color } from 'ora';
import { join } from 'path';

import { ROOT_PKG } from './constants';

const LOG_PREFIX = '[@tenon-ui/cli]';

const readFile = (path: string) => {
  return readFileSync(path, { encoding: 'utf8' });
};

const readJsonFile = (path: string) => {
  const content = readFile(path);
  try {
    const jsonObj = JSON.parse(content);
    return jsonObj;
  } catch (err) {
    console.error(err);
  }
  return {};
};

const writeFile = (path: string, content: string) => {
  writeFileSync(path, content, { encoding: 'utf8' });
};

const writeJsonToFile = (path: string, jsonObj: Record<keyof any, any>) => {
  try {
    const json = JSON.stringify(jsonObj, null, 2);
    writeFile(path, json);
  } catch (e) {
    console.error(e);
  }
};

const log = (message: string) => {
  console.log(`${LOG_PREFIX} ${message}`);
};

const errorLog = (message: string) => {
  console.log(`${LOG_PREFIX} ❌  ${chalk.bold.red(message)}`);
};

const successLog = (message: string) => {
  console.log(`${LOG_PREFIX} ✔️  ${chalk.bold.green(message)}`);
};

const getComTemplate = (comName: string, type: 'com' | 'entry') => {
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

const cleanDirFiles = (path: string) => {
  const files = readdirSync(path);
  files.forEach((file) => {
    const filePath = join(path, file);
    const stat = statSync(filePath);
    if (stat.isFile()) {
      rmSync(filePath);
    }
  });
};

const getVersion = () => {
  return readJsonFile(ROOT_PKG).version;
};

const createSpinner = (text: string, options: { color?: Color } = {}) => {
  const { color } = options;
  const spinner = ora(text);

  if (color) {
    spinner.color = color;
  }

  spinner.start();

  return spinner;
};

// 延迟用
const dfd = () => {
  const dfd = {
    promise: null as any as Promise<void>,
    resolve: null as any as () => void,
    reject: null as any as () => void,
  };
  dfd.promise = new Promise<void>((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

export {
  readFile,
  writeFile,
  readJsonFile,
  writeJsonToFile,
  log,
  errorLog,
  successLog,
  getComTemplate,
  cleanDirFiles,
  getVersion,
  createSpinner,
  dfd,
};
