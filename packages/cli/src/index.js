const { program } = require('commander');
const genIcons = require('./commands/genIcons');
const createComponent = require('./commands/createComponent');
const clear = require('clear');
const figlet = require('figlet');

// 初始化
clear();
console.log(
  figlet.textSync('C - UI!', {
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
  .action((name) => createComponent(name));

program.parse();
