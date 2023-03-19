import clear from 'clear';
import { Command } from 'commander';
import figlet from 'figlet';

import createComponent from './commands/createComponent';
import genIcons from './commands/genIcons';
import release from './commands/release';

const program = new Command();

// 初始化
clear();
console.log(
  figlet.textSync('TENON - UI', {
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true,
  }),
);

program
  .command('gen:icons')
  .description('生成Icon组件')
  .action(() => genIcons());

program
  .command('create:component')
  .description('自动创建组件相关文件')
  .argument('<name>', '组件名称')
  .action((name: string) => createComponent(name));

program
  .command('release')
  .description('发布')
  .action(() => release());

program.parse();
