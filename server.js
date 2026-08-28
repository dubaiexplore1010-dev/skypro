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

// Proxy function for backend API calls
function proxyApi(req, res) {
  const targetHost = 'saapipl.skyexch.art'
  const forwardHeaders = { ...req.headers }
  delete forwardHeaders['host']
  delete forwardHeaders['x-forwarded-for']
  delete forwardHeaders['x-forwarded-proto']
  delete forwardHeaders['x-forwarded-host']
  delete forwardHeaders['x-real-ip']
  delete forwardHeaders['cf-connecting-ip']
  delete forwardHeaders['cf-ray']
  delete forwardHeaders['cf-visitor']

  forwardHeaders['host'] = targetHost
  forwardHeaders['origin'] = 'https://www.skyexch.art'
  forwardHeaders['referer'] = 'https://www.skyexch.art/'
  forwardHeaders['user-agent'] =
    req.headers['user-agent'] ||
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

  const proxyReq = https.request(
    {
      hostname: targetHost,
      port: 443,
      path: req.originalUrl || req.url,
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
