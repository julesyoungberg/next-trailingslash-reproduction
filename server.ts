import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { ppid } from 'process'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (!pathname.startsWith('/_next')) {
      console.log({ pathname, query });
    }

    let resolvedPath: string | undefined;

    if (pathname === '/') {
      resolvedPath = '/index';
    } else if (/^\/a\/?$/.test(pathname)) {
      resolvedPath = '/a';
    } else if (/^\/b\/?$/.test(pathname)) {
      resolvedPath = '/b';
    }

    if (resolvedPath) {
      if (query.trailingSlash === 'true') {
        resolvedPath += '/';
      }

      console.log('rendering', resolvedPath);
      return app.render(req, res, resolvedPath, query);
    }

    handle(req, res, parsedUrl);
  }).listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
