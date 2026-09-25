import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Dev-only: forward API calls to the Django backend.
      // Set VITE_API_URL to an absolute URL to bypass the proxy (CORS is enabled).
      '/api': 'http://127.0.0.1:8000',
    },
  },
})