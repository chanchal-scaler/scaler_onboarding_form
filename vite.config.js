import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Must match `base` without trailing slash (e.g. /mentee-onboarding). */
const APP_BASE_NO_SLASH = '/mentee-onboarding'

/**
 * Redirect /mentee-onboarding → /mentee-onboarding/ so Vite's base URL matches.
 * Without this, visiting the no-slash URL shows Vite's "did you mean..." page.
 */
function redirectBaseTrailingSlash() {
  function createRedirectMiddleware(statusCode) {
    return function redirectMiddleware(req, res, next) {
      const raw = req.url || ''
      const path = raw.split('?')[0]
      const search = raw.includes('?') ? raw.slice(raw.indexOf('?')) : ''
      if (path === APP_BASE_NO_SLASH) {
        res.writeHead(statusCode, {
          Location: `${APP_BASE_NO_SLASH}/${search}`,
        })
        res.end()
        return
      }
      next()
    }
  }

  return {
    name: 'redirect-base-trailing-slash',
    configureServer(server) {
      // Dev: temporary redirect is enough while iterating locally.
      server.middlewares.use(createRedirectMiddleware(302))
    },
    configurePreviewServer(server) {
      // Production (`npm run start` / Docker): permanent canonical URL.
      server.middlewares.use(createRedirectMiddleware(301))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: `${APP_BASE_NO_SLASH}/`,
  plugins: [react(), redirectBaseTrailingSlash()],
  preview: {
    allowedHosts: ['.up.railway.app', 'scaler.com', 'www.scaler.com'],
  },
})
