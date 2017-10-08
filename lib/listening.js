// Packages
const { write: copy } = require('clipboardy')
const ip = require('ip')
const pathType = require('path-type')
const chalk = require('chalk')
const boxen = require('boxen')
const { coroutine } = require('bluebird')
const opn = require('opn')

module.exports = coroutine(function*(server, current, inUse, clipboard, open) {
  const details = server.address()
  const shutdown = () => {
    server.close()
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0)
  }
  // 程序终止(interrupt)信号事件
  process.on('SIGINT', shutdown)
  // 程序结束(terminate)信号事件
  process.on('SIGTERM', shutdown)

  // 判断工作环境是否为目录
  if (!pathType.dir(current)) {
    console.error(
      chalk.red(`[错误] ${chalk.bold(`"${current}"`)} 不是一个目录?`)
    )
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  }
  const URL = `http://${ip.address()}:${details.port}`
  console.log(chalk.green(`访问链接: \r\n${URL}`))
  // 是否为终端
  if (process.stdout.isTTY) {
    opn(URL)
  }
})
