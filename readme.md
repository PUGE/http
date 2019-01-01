# Simple http serve

## 安装方法

```bash
npm install -g @puge/http
```

## 使用方法

```bash
http [options] <path>
```

### Options

通过这条命令查看可用选项:

```bash
serve help
```

### Authentication

If you set the `--auth` flag, the package will look for a username and password in the `SERVE_USER` and `SERVE_PASSWORD` environment variables.

As an example, this is how such a command could look like:

```bash
SERVE_USER=leo SERVE_PASSWORD=1234 serve --auth
```

## API

You can also use the package inside your application. Just load it:

```js
const serve = require('serve')
```

And call it with flags (run [this command](#options) for the full list):

```js
const server = serve(__dirname, {
  port: 1337,
  ignore: ['node_modules']
})
```

Later in the code, you can stop the server using this method:

```js
server.stop()
```

## Contributing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Uninstall `serve` if it's already installed: `npm uninstall -g serve`
3. Link it to the global module directory: `npm link`

After that, you can use the `serve` command everywhere. [Here](https://github.com/zeit/serve/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+for+beginners%22)'s a list of issues that are great for beginners.

## Credits

This project used to be called "list" and "micro-list". But thanks to [TJ Holowaychuk](https://github.com/tj) handing us the new name, it's now called "serve" (which is much more definite).
