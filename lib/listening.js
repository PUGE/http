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
  // 是否为终端
  const isTTY = process.stdout.isTTY

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
  if (pathType.dir(current)) {
    console.error(
      chalk.red(`[错误] ${chalk.bold(`"${current}"`)} 不是一个目录?`)
    )
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  }

  if (process.env.NODE_ENV !== 'production') {
    let message = chalk.green('文件服务已开启!')

    if (inUse) {
      message +=
        ' ' +
        chalk.red(
          `(on port ${inUse.open}, because ${inUse.old} is already in use)`
        )
    }

    message += '\n\n'

    const localURL = `http://localhost:${details.port}`
    message += `- ${chalk.bold('本地访问: ')} ${localURL}`

    try {
      const ipAddress = ip.address()
      const url = `http://${ipAddress}:${details.port}`

      message += `\n- ${chalk.bold('网络访问: ')} ${url}`
    } catch (err) {}

    if (isTTY && clipboard) {
      try {
        yield copy(localURL)
        message += `\n\n${chalk.grey('地址已复制到粘贴板!')}`
      } catch (err) {}
    }

    if (isTTY && open) {
      try {
        opn(localURL)
      } catch (err) {}
    }

    if (!isTTY) {
      console.log(`serve: Running on port ${details.port}`)
      return
    }

    console.log(
      boxen(message, {
        padding: 1,
        borderColor: 'green',
        margin: 1
      })
    )
  }
})
