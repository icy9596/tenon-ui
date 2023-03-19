import conventionalChangelog from 'conventional-changelog';
import { createWriteStream } from 'fs';
import glob from 'glob';
import inquirer from 'inquirer';
import { exec as originExec } from 'node:child_process';
import util from 'node:util';
import path from 'path';
import semver from 'semver';
import { dfd } from '../utils/helper';

const exec = util.promisify(originExec);

import {
  createSpinner,
  getVersion,
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
      })).concat([{ name: 'reset', value: '0.0.1' }]),
    },
  ]);
  return releaseType;
}

async function confirmRefs(remote = 'origin') {
  const { stdout } = await exec('git remote -v');
  const reg = new RegExp(`^${remote}\\t(.+)\\s\\(push\\)$`);
  const [pushRemote] = stdout.split('\n').filter((str) => reg.test(str));
  const name = 'confirm refs';
  if (pushRemote) {
    const [, repo] = reg.exec(pushRemote)!;
    const { stdout: branch } = await exec('git branch --show-current');

    const result = await inquirer.prompt([
      {
        type: 'confirm',
        name,
        message: `请确认当前git信息 repo=${repo} branch=${branch}`,
      },
    ]);

    return result[name];
  }

  return Promise.reject(new Error('git remote获取失败'));
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
  })
    .pipe(writable)
    .on('close', () => {
      resolve();
      spinner.stop();
    });
  return promise;
}

async function pushGit(nextVersion: string) {
  const spinner = createSpinner('git add/commit/tag/push ...', {
    color: 'blue',
  });
  try {
    await exec('git add .');
    await exec(`git commit -m 'docs: changelog for ${nextVersion}'`);
    await exec(`git tag ${nextVersion}`);
    await exec(`git push ${nextVersion}`);
    await exec('git push origin');
    successLog('完成Git工作流处理');
  } finally {
    spinner.stop();
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

    const confirmRefsFlag = await confirmRefs();
    if (!confirmRefsFlag) return;

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
