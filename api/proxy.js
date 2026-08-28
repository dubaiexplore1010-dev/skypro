import https from 'node:https'

export default async function handler(req, res) {
  try {
    const url = req.url || '/'
    const isApi =
      url.startsWith('/verify') ||
      url.startsWith('/exchange') ||
      url.startsWith('/login') ||
      url.startsWith('/member') ||
      url.startsWith('/playerService')

    const targetHost = isApi ? 'saapipl.skyexch.art' : 'www.skyexch.art'

    const forwardHeaders = { ...req.headers }
    delete forwardHeaders['host']
    delete forwardHeaders['x-forwarded-for']
    delete forwardHeaders['x-forwarded-proto']
    delete forwardHeaders['x-forwarded-host']
    delete forwardHeaders['x-real-ip']
    delete forwardHeaders['x-vercel-id']
    delete forwardHeaders['x-vercel-ip-timezone']
    delete forwardHeaders['x-vercel-ip-city']
    delete forwardHeaders['x-vercel-ip-country']
    delete forwardHeaders['x-vercel-ip-country-region']
    delete forwardHeaders['x-vercel-ip-latitude']
    delete forwardHeaders['x-vercel-ip-longitude']
    delete forwardHeaders['cf-connecting-ip']
    delete forwardHeaders['cf-ray']
    delete forwardHeaders['cf-visitor']

    forwardHeaders['host'] = targetHost
    forwardHeaders['user-agent'] =
      req.headers['user-agent'] ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

    if (isApi) {
      forwardHeaders['origin'] = 'https://www.skyexch.art'
      forwardHeaders['referer'] = 'https://www.skyexch.art/'
    } else {
      delete forwardHeaders['origin']
      delete forwardHeaders['referer']
    }

    const proxyReq = https.request(
      {
        hostname: targetHost,
        port: 443,
        path: url,
        method: req.method,
        headers: forwardHeaders,
      },
      (proxyRes) => {
        const respHeaders = { ...proxyRes.headers }
        const reqOrigin = req.headers['origin'] || '*'
        respHeaders['access-control-allow-origin'] = reqOrigin
        respHeaders['access-control-allow-credentials'] = 'true'

        const cookies = proxyRes.headers['set-cookie']
        if (cookies) {
          respHeaders['set-cookie'] = cookies.map((cookie) =>
            cookie
              .replace(/Domain=[^;]+;?\s*/gi, '')
              .replace(/SameSite=[^;]+;?\s*/gi, 'SameSite=Lax; ')
          )
        }

        res.writeHead(proxyRes.statusCode || 200, respHeaders)
        proxyRes.pipe(res)
      }
    )

    proxyReq.on('error', (err) => {
      console.error('API proxy error:', err)
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain' })
        res.end('Bad Gateway')
      }
    })

    req.pipe(proxyReq)
  } catch (err) {
    console.error('Global proxy handler error:', err)
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Internal Server Error')
    }
  }
}
