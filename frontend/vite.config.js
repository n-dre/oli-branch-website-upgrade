import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    historyApiFallback: true
<<<<<<< HEAD
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ['recharts']
        }
      }
    }
=======
>>>>>>> e9235cc2169c9dd35b28965cf0c7f9b3388f2812
  }
})