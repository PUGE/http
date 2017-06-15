// Native
const { basename } = require('path')

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
  const isTTY = process.stdout.isTTY

  process.on('SIGINT', () => {
    server.close()
    process.exit(0)
  })

  let isDir

  try {
    isDir = yield pathType.dir(current)
  } catch (err) {
    isDir = false
  }

  if (!isDir) {
    const base = basename(current)

    console.error(
      chalk.red(`Specified directory ${chalk.bold(`"${base}"`)} doesn't exist!`)
    )

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  }

  if (process.env.NODE_ENV !== 'production') {
    let message = chalk.green('服务正在运行!')

    if (inUse) {
      message +=
        ' ' +
        chalk.red(
          `(on port ${inUse.open}, because ${inUse.old} is already in use)`
        )
    }

    message += '\n\n'

    const localURL = `http://localhost:${details.port}`
    message += `- ${chalk.bold('本机访问: ')} ${localURL}`

    try {
      const ipAddress = ip.address()
      const url = `http://${ipAddress}:${details.port}`

      message += `\n- ${chalk.bold('网络访问: ')} ${url}`
    } catch (err) {}

    if (isTTY && clipboard) {
      try {
        yield copy(localURL)
        message += `\n\n${chalk.grey('外网访问地址已经复制到粘贴板!')}`
      } catch (err) {}
    }

    if (isTTY && open) {
      try {
        opn(localURL)
      } catch (err) {}
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
