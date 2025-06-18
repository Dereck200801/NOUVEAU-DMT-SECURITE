import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: {
    port: 3000,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    },
    headers: {
      // Set correct MIME type for service worker
      'Service-Worker-Allowed': '/'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // Use the custom base path only for production builds (command === 'build').
  // During development (command === 'serve'), keep base as root to avoid
  // Vite suggesting an alternate URL when refreshing the page.
  base: command === 'build' ? '/NOUVEAU-DMT-SECURITE/' : '/'
})) 