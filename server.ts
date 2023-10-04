import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

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

    if (pathname === '/') {
      console.log('rendering', '/index');
      return app.render(req, res, '/index', query);
    } else if (pathname === '/a/') {
      console.log('rendering', '/a/');
      return app.render(req, res, '/a/', query);
    } else if (pathname === '/b/') {
      console.log('rendering', '/b/');
      return app.render(req, res, '/b/', query);
    }

    handle(req, res, parsedUrl);
  }).listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
