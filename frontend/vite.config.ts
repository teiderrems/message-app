import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  clearScreen: false,
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Must match tsconfig.json paths
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Output to the package-local dist folder
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // Proxy /trpc requests to backend dev server (adjust port if needed)
      '/api': { 
        target: 'http://localhost:8000', 
        changeOrigin: true 
      },
    },
    allowedHosts:true
  },
})
