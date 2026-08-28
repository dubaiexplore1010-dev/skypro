import express from 'express'
import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Read the complete static index.html from disk
const indexPath = path.join(__dirname, 'index.html')
let cachedHtml = ''
if (fs.existsSync(indexPath)) {
  cachedHtml = fs.readFileSync(indexPath, 'utf8')
}

// Proxy function with strict clean headers for saapipl.skyexch.art
function proxyApi(req, res) {
  const targetHost = 'saapipl.skyexch.art'
  const headers = {
    host: targetHost,
    referer: 'https://www.skyexch.art/',
    'user-agent':
      req.headers['user-agent'] ||
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    accept: req.headers['accept'] || 'application/json, text/plain, */*',
    'accept-language': req.headers['accept-language'] || 'en-US,en;q=0.9',
  }

  if (req.headers['cookie']) {
    headers['cookie'] = req.headers['cookie']
  }
  if (req.headers['content-type']) {
    headers['content-type'] = req.headers['content-type']
  }
  if (req.headers['authorization']) {
    headers['authorization'] = req.headers['authorization']
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    headers['origin'] = 'https://www.skyexch.art'
  }

  const proxyReq = https.request(
    {
      hostname: targetHost,
      port: 443,
      path: req.originalUrl || req.url,
      method: req.method,
      headers: headers,
    },
    (proxyRes) => {
      const respHeaders = { ...proxyRes.headers }
      const reqOrigin = req.headers['origin'] || '*'
      respHeaders['access-control-allow-origin'] = reqOrigin
      respHeaders['access-control-allow-credentials'] = 'true'

      const cookies = proxyRes.headers['set-cookie']
      if (cookies) {
        respHeaders['set-cookie'] = cookies.map((c) =>
          c
            .replace(/Domain=[^;]+;?\s*/gi, '')
            .replace(/SameSite=[^;]+;?\s*/gi, 'SameSite=Lax; ')
        )
      }

      res.writeHead(proxyRes.statusCode || 200, respHeaders)
      proxyRes.pipe(res)
    }
  )

  proxyReq.on('error', (err) => {
    console.error('API Proxy Error:', err)
    if (!res.headersSent) {
      res.status(502).send('Bad Gateway')
    }
  })

  req.pipe(proxyReq)
}

// 1. API Endpoints (Proxied to saapipl.skyexch.art with cookie rewriting)
app.use((req, res, next) => {
  const url = req.url || '/'
  if (
    url.startsWith('/verify') ||
    url.startsWith('/exchange') ||
    url.startsWith('/login') ||
    url.startsWith('/member') ||
    url.startsWith('/playerService')
  ) {
    return proxyApi(req, res)
  }
  next()
})

// 2. Serve static assets directly from local public/ directory
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }))

// 3. Fallback for SPA routing: Serve index.html directly from disk
app.use((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  if (cachedHtml) {
    res.send(cachedHtml)
  } else {
    res.sendFile(indexPath)
  }
})

app.listen(PORT, () => {
  console.log(`SkyPro Server running on port ${PORT}`)
})
