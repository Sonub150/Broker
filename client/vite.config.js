import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': process.env.VITE_BACKEND && process.env.VITE_BACKEND.startsWith('mongodb')
        ? process.env.VITE_BACKEND
        : (process.env.VITE_BACKEND || process.env.VITE_MONGO || 'http://localhost:3000'),
    },
  },
})
