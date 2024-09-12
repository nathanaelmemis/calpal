import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@emotion/styled'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend server address
        changeOrigin: true, // If you need to change the origin of the request
        rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite the path if needed
      },
    },
  },
})
