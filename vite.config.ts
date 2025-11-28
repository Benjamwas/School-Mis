import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['styled-components', 'react-simple-chatbot'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    rollupOptions: {
      external: ['styled-components', 'react-simple-chatbot'],
      output: {
        globals: {
          'styled-components': 'styled',
          'react-simple-chatbot': 'Chatbot',
        },
      },
    },
  },
})
