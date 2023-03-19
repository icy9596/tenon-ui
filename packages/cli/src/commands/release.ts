import conventionalChangelog from 'conventional-changelog';
import { createWriteStream } from 'fs';
import glob from 'glob';
import inquirer from 'inquirer';
import { exec as originExec } from 'node:child_process';
import util from 'node:util';
import path from 'path';
import semver from 'semver';
import { simpleGit } from 'simple-git';
import { dfd, getVersion } from '../utils/helper';

const exec = util.promisify(originExec);
const git = simpleGit();

import {
  createSpinner,
  readJsonFile,
  successLog,
  writeJsonToFile,
} from '../utils/helper';

enum ReleaseType {
  major = 'major',
  minor = 'minor',
  patch = 'patch',
}
const RELEASE_TYPE = [ReleaseType.major, ReleaseType.minor, ReleaseType.patch];

async function confirmVersion(version: string) {
  const typeToVersion = RELEASE_TYPE.reduce<{
    [key: string]: string;
  }>((memo, type) => {
    memo[type] = semver.inc(version, type) || '';
    return memo;
  }, {});
  const { releaseType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'releaseType',
      message: '请选择发布类型',
      choices: RELEASE_TYPE.map((type: string) => ({
        name: `${type} - ${typeToVersion[type]}`,
        value: typeToVersion[type],
      })),
    },
  ]);
  return releaseType;
}

async function confirmRefs(remote = 'origin') {
  const name = 'confirm refs';
  const [ref] = await git.getRemotes(true);

  if (ref.name !== remote) {
    return Promise.reject('获取 Git Remote 异常');
  }

  const {
    refs: { push },
  } = ref;
  const { current: branch } = await git.branchLocal();
  const result = await inquirer.prompt([
    {
      type: 'confirm',
      name,
      message: `请确认当前 Git 信息 repo=${push} branch=${branch}`,
    },
  ]);

  return result[name];
}

async function buildPackages() {
  const spinner = createSpinner('打包编译各子包 ...', { color: 'blue' });
  try {
    const { stdout, stderr } = await exec('pnpm -r build');
    if (stderr) {
      console.error(stderr);
      return Promise.reject(new Error('打包编译失败'));
    } else {
      console.log(stdout);
      successLog('打包编译完成');
    }
  } finally {
    spinner.stop();
  }
}

function updatePkgsVersion(newVersion: string) {
  const paths = glob.globSync('packages/*/package.json');
  paths.push('package.json');
  paths.forEach((path) => {
    const pkg = readJsonFile(path);
    pkg.version = newVersion;
    writeJsonToFile(path, pkg);
  });
  successLog(`完成更新版本号:${newVersion}`);
}

async function generateChangeLog(filename: string = 'CHANGELOG.md') {
  const spinner = createSpinner('生成changelog ...', { color: 'blue' });
  const { promise, resolve } = dfd();
  const filePath = path.resolve(process.cwd(), filename);
  const writable = createWriteStream(filePath);
  // 可读流 可监听close事件 在读取完毕时
  conventionalChangelog({
    preset: 'angular',
    releaseCount: 0,
  })
    .pipe(writable)
    .on('close', () => {
      resolve();
      spinner.stop();
      successLog('完成 changelog 生成');
    });
  return promise;
}

async function pushGit(nextVersion: string) {
  let spinner;
  try {
    const { modified } = await git.status();
    console.log(`Modified files:\n${modified
      .map((fileId) => `\tmodified:\t${fileId}`)
      .join('\n')}
    `);

    const flag = await confirmRefs();
    if (!flag) {
      await git.checkout('.');
      return Promise.reject(new Error('中止 Git 推送'));
    }

    await git.add('.');
    await git.commit(`docs: changelog for ${nextVersion}`);

    await exec(`git tag ${nextVersion}`);

    spinner = createSpinner('Git Push ...', {
      color: 'blue',
    });
    await exec(`git push origin ${nextVersion}`);
    await exec('git push origin');
    successLog('完成 Git 工作流处理');
  } finally {
    spinner?.stop();
  }
}

/* async function publish() {
  const spinner = createSpinner('发布各子包 ...', { color: 'blue' });
  try {
    const { stdout, stderr } = await exec('pnpm -r publish');
    if (stderr) {
      console.error(stderr);
      return Promise.reject(new Error('发布失败'));
    } else {
      console.log(stdout);
      successLog('完成发布');
    }
  } finally {
    spinner.stop();
  }
} */

async function release() {
  try {
    const version = getVersion();
    const nextVersion = await confirmVersion(version);

    await buildPackages();

    // 工作流程
    // 1.修改版本号
    updatePkgsVersion(nextVersion);

    // 2.生成changelog
    await generateChangeLog();

    // 3.git add/commit
    // 4.git tag
    // 5.git push
    await pushGit(nextVersion);

    // 6.npm publish
    // await publish();
  } catch (err) {
    console.error(err);
  }
}

export default release;
