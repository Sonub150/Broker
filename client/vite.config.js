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
      '/api': process.env.Backend && process.env.Backend.startsWith('mongodb')
        ? process.env.Backend
        : (process.env.Backend || process.env.VITE_MONGO || 'http://localhost:3000'),
    },
  },
})
