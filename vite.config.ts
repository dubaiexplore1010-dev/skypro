import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, type Plugin } from 'vite'
import https from 'https'
import fs from 'fs'
import path from 'path'

const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0'
const INSTAGRAM_NAME = 'lionexch99'
const INSTAGRAM_URL = 'https://www.instagram.com/lionexch99'

function createApiProxy(target = 'https://saapipl.skyexch.art') {
  return {
    target,
    changeOrigin: true,
    secure: true,
    xfwd: false,
    cookieDomainRewrite: '',
    cookiePathRewrite: '/',
    configure: (proxy: any) => {
      proxy.on('proxyReq', (proxyReq: any) => {
        proxyReq.setHeader('origin', 'https://www.skyexch.art')
        proxyReq.setHeader('referer', 'https://www.skyexch.art/')
        proxyReq.setHeader('host', 'saapipl.skyexch.art')

        // Remove proxy/tunnel tracking headers that trigger "Invalid IP" WAF check
        proxyReq.removeHeader('x-forwarded-for')
        proxyReq.removeHeader('x-forwarded-proto')
        proxyReq.removeHeader('x-forwarded-host')
        proxyReq.removeHeader('x-real-ip')
        proxyReq.removeHeader('cf-connecting-ip')
        proxyReq.removeHeader('cf-ray')
        proxyReq.removeHeader('cf-visitor')
      })
      proxy.on('proxyRes', (proxyRes: any, req: any) => {
        const reqOrigin = req.headers['origin'] || '*'
        proxyRes.headers['access-control-allow-origin'] = reqOrigin
        proxyRes.headers['access-control-allow-credentials'] = 'true'

        const cookies = proxyRes.headers['set-cookie']
        if (cookies) {
          proxyRes.headers['set-cookie'] = cookies.map((cookie: string) => {
            return cookie
              .replace(/Domain=[^;]+;?\s*/gi, '')
              .replace(/SameSite=[^;]+;?\s*/gi, 'SameSite=Lax; ')
          })
        }
      })
    },
  }
}

function skyExchProxyPlugin(): Plugin {
  return {
    name: 'skyexch-portal-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''

        // 0. Serve custom banner.jpeg for promo banners
        if (
          url.includes('/banner.jpeg') ||
          url.includes('/images.jpeg') ||
          url.includes('/promo/02.jpg') ||
          url.includes('/promo/01.jpg') ||
          url.endsWith('02.jpg') ||
          url.endsWith('01.jpg')
        ) {
          const customBannerPath = path.join(process.cwd(), 'public', 'banner.jpeg')
          if (fs.existsSync(customBannerPath)) {
            res.setHeader('Content-Type', 'image/jpeg')
            res.end(fs.readFileSync(customBannerPath))
            return
          }
        }

        // 1. Serve full first-party white-label HTML on root / and /portal
        if (
          url === '/' ||
          url === '/index.html' ||
          url.startsWith('/#') ||
          url === '/portal' ||
          url.startsWith('/portal?') ||
          url.startsWith('/portal#')
        ) {
          try {
            const html = await new Promise<string>((resolve, reject) => {
              https
                .get(
                  'https://www.skyexch.art/',
                  { headers: { 'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0' } },
                  (proxyRes) => {
                    let data = ''
                    proxyRes.on('data', (chunk) => (data += chunk))
                    proxyRes.on('end', () => resolve(data))
                  }
                )
                .on('error', reject)
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

                /* Hide all default/extra promo slides (03.jpg, 04.jpg, 05.jpg... and slide index > 1) */
                .swiper-slide:has(img[src*="03.jpg"]),
                .swiper-slide:has(img[src*="04.jpg"]),
                .swiper-slide:has(img[src*="05.jpg"]),
                .swiper-slide:has(img[src*="06.jpg"]),
                .swiper-slide[data-swiper-slide-index="2"],
                .swiper-slide[data-swiper-slide-index="3"],
                .swiper-slide[data-swiper-slide-index="4"],
                .swiper-slide[data-swiper-slide-index="5"],
                img[src*="03.jpg"],
                img[src*="04.jpg"],
                img[src*="05.jpg"],
                img[src*="06.jpg"] {
                  display: none !important;
                  visibility: hidden !important;
                  width: 0 !important;
                  height: 0 !important;
                }
              </style>
              <script>
                (function() {
                  let WA_LINK = ${JSON.stringify(WHATSAPP_URL)};
                  let IG_LINK = ${JSON.stringify(INSTAGRAM_URL)};
                  let IG_NAME = ${JSON.stringify(INSTAGRAM_NAME)};
                  let FOOTER_DOMAIN = 'www.skyexchangepro.com';
                  let BANNER_1 = '/banner.jpeg';
                  let BANNER_2 = '/images.jpeg';

                  // Realtime Sync with Supabase Database
                  function syncSupabaseSettings() {
                    fetch('https://ompmgysuoisdyiateovg.supabase.co/rest/v1/site_settings?id=eq.config&select=*', {
                      headers: {
                        'apikey': 'sb_publishable_XQ2t2Fs2CjNjS3f9JrXLpA_IZE6O2W6',
                        'Authorization': 'Bearer sb_publishable_XQ2t2Fs2CjNjS3f9JrXLpA_IZE6O2W6'
                      }
                    })
                    .then(function(res) { return res.json(); })
                    .then(function(data) {
                      if (data && data[0]) {
                        const conf = data[0];
                        if (conf.whatsapp_url) WA_LINK = conf.whatsapp_url;
                        if (conf.instagram_url) IG_LINK = conf.instagram_url;
                        if (conf.instagram_name) IG_NAME = conf.instagram_name;
                        if (conf.footer_domain) FOOTER_DOMAIN = conf.footer_domain;
                        BANNER_1 = conf.banner_1_url || '';
                        BANNER_2 = conf.banner_2_url || '';
                      }
                    })
                    .catch(function(err) { console.warn('Supabase sync warning:', err); });
                  }
                  syncSupabaseSettings();
                  setInterval(syncSupabaseSettings, 30000); // Re-sync every 30 seconds

                  // Show ONLY Admin configured banners, otherwise hide/empty
                  function fixCustomBanners() {
                    // 1. Process Slide 1
                    document.querySelectorAll('.swiper-slide[data-swiper-slide-index="0"], .swiper-slide:first-child').forEach(function(slide) {
                      const img = slide.querySelector('img');
                      if (BANNER_1 && BANNER_1.trim()) {
                        slide.style.display = '';
                        slide.style.visibility = '';
                        if (img && img.src !== BANNER_1 && !img.src.endsWith(BANNER_1)) {
                          img.src = BANNER_1;
                        }
                      } else {
                        // Empty: hide slide 1
                        slide.style.display = 'none';
                        slide.style.visibility = 'hidden';
                      }
                    });

                    // 2. Process Slide 2
                    document.querySelectorAll('.swiper-slide[data-swiper-slide-index="1"], .swiper-slide:nth-child(2)').forEach(function(slide) {
                      const img = slide.querySelector('img');
                      if (BANNER_2 && BANNER_2.trim()) {
                        slide.style.display = '';
                        slide.style.visibility = '';
                        if (img && img.src !== BANNER_2 && !img.src.endsWith(BANNER_2)) {
                          img.src = BANNER_2;
                        }
                      } else {
                        // Empty: hide slide 2
                        slide.style.display = 'none';
                        slide.style.visibility = 'hidden';
                      }
                    });

                    // 3. Hide all other promo slides (Slide 3, 4, 5...)
                    document.querySelectorAll('.swiper-slide').forEach(function(slide) {
                      const idx = slide.getAttribute('data-swiper-slide-index');
                      const img = slide.querySelector('img');
                      if (idx && parseInt(idx, 10) > 1) {
                        slide.style.display = 'none';
                        slide.style.visibility = 'hidden';
                      }
                      if (img && (img.src.includes('03.jpg') || img.src.includes('04.jpg') || img.src.includes('05.jpg') || img.src.includes('06.jpg'))) {
                        slide.style.display = 'none';
                        slide.style.visibility = 'hidden';
                      }
                    });
                  }

                  // 1. Fix Captcha Image src to use origin instead of invalid saapipl subdomain
                  function fixCaptchaImages() {
                    document.querySelectorAll('img').forEach(function(img) {
                      if (img.src && (img.src.includes('queryValidationCode') || img.alt === 'verify code')) {
                        if (img.src.includes('saapipl.')) {
                          img.src = img.src.replace(/https?:\\/\\/saapipl\\.[^\\/]+/, window.location.origin);
                        }
                      }
                    });
                  }

                  // 2. Click Interceptor for Sign Up, WhatsApp, Customer Support, and Instagram
                  document.addEventListener('click', function(e) {
                    const el = e.target.closest('button, a, div, span, li, img');
                    if (!el) return;

                    // If captcha image clicked, fix src after click
                    if (el.tagName === 'IMG' && (el.src.includes('queryValidationCode') || el.alt === 'verify code')) {
                      setTimeout(fixCaptchaImages, 100);
                      setTimeout(fixCaptchaImages, 300);
                    }

                    const text = (el.innerText || el.textContent || '').trim().toLowerCase();

                    // Sign up
                    if (text === 'sign up' || text === 'signup' || text === 'register' || text.includes('get online id')) {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(WA_LINK, '_blank', 'noopener,noreferrer');
                      return false;
                    }

                    // WhatsApp & Customer Support Links
                    if (
                      text.includes('whatsapp') ||
                      text.includes('customer support') ||
                      text.includes('support1') ||
                      text.includes('support2') ||
                      text.includes('support 1') ||
                      text.includes('support 2') ||
                      el.classList.contains('icon-support-whatsapp') ||
                      el.querySelector('.icon-support-whatsapp') ||
                      el.classList.contains('icon-support-customer') ||
                      el.querySelector('.icon-support-customer')
                    ) {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(WA_LINK, '_blank', 'noopener,noreferrer');
                      return false;
                    }

                    // Instagram
                    if (text.includes('skyexchindia') || text.includes(IG_NAME) || el.classList.contains('icon-support-instagram') || el.querySelector('.icon-support-instagram')) {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(IG_LINK, '_blank', 'noopener,noreferrer');
                      return false;
                    }
                  }, true);

                  // 3. Periodic DOM Watcher for Captcha Images, Custom Banners, Instagram text, and Domain Footer
                  setInterval(function() {
                    fixCaptchaImages();
                    fixCustomBanners();
                    document.querySelectorAll('span, div, p, a').forEach(function(node) {
                      if (node.children.length === 0 && node.textContent) {
                        if (node.textContent.includes('skyexchindia')) {
                          node.textContent = node.textContent.replace(/skyexchindia/g, IG_NAME);
                        }
                        if (node.textContent.includes('skyexch.vip')) {
                          node.textContent = node.textContent.replace(/skyexch\.vip/g, FOOTER_DOMAIN);
                        }
                      }
                    });
                  }, 250);
                })();
              </script>
            `

            const modifiedHtml = html.replace('</head>', injectedScript + '</head>')
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(modifiedHtml)
            return
          } catch (err) {
            console.error('Portal proxy error:', err)
          }
        }

        // 2. Intercept ALL JS asset files to patch saapipl baseURL logic and footer domain
        if (url.includes('/assets/') && url.endsWith('.js')) {
          try {
            const jsContent = await new Promise<string>((resolve, reject) => {
              https
                .get(`https://www.skyexch.art${url}`, (proxyRes) => {
                  let data = ''
                  proxyRes.on('data', (chunk) => (data += chunk))
                  proxyRes.on('end', () => resolve(data))
                })
                .on('error', reject)
            })

            // Patch saapipl logic so API & Captcha images point to origin (proxied locally with cookies)
            const patchedJs = jsContent
              .replace(
                /window\.location\.host\.replace\(\/\^\[\^\.\]\*\/\s*,\s*["']saapipl["']\)/g,
                'window.location.host'
              )
              .replace(
                /\.replace\(\/\^\[\^\.\]\*\/\s*,\s*["']saapipl["']\)/g,
                ''
              )
              .replace(/www\.skyexch\.vip/g, 'www.skyexchangepro.com')
              .replace(/skyexch\.vip/g, 'skyexchangepro.com')

            res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
            res.end(patchedJs)
            return
          } catch (err) {
            console.error('Asset patch error:', err)
          }
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    skyExchProxyPlugin(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/assets': {
        target: 'https://www.skyexch.art',
        changeOrigin: true,
        headers: {
          referer: '',
        },
      },
      '/plugins': {
        target: 'https://www.skyexch.art',
        changeOrigin: true,
        headers: {
          referer: '',
        },
      },
      '/source': {
        target: 'https://www.skyexch.art',
        changeOrigin: true,
        headers: {
          referer: '',
        },
      },
      '/themes': {
        target: 'https://www.skyexch.art',
        changeOrigin: true,
        headers: {
          referer: '',
        },
      },
      '/image-manifest.json': {
        target: 'https://www.skyexch.art',
        changeOrigin: true,
        headers: {
          referer: '',
        },
      },
      '/submodules': {
        target: 'https://www.skyexch.art',
        changeOrigin: true,
        headers: {
          referer: '',
        },
      },
      '/verify': createApiProxy(),
      '/exchange': createApiProxy(),
      '/login': createApiProxy(),
      '/member': createApiProxy(),
      '/playerService': createApiProxy(),
    },
  },
})
