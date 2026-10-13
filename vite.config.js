import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],

    // Test configuration (Vitest)
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
    },

    // Build configuration for Vercel production deployment
    build: {
      // Target modern browsers - Vercel CDN supports them
      target: 'es2020',
      // Disable source maps in production to reduce bundle size
      sourcemap: false,
      // Warn if chunks exceed 500KB
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          // Vite 8 (Rolldown) requires manualChunks as a function, not an object
          manualChunks: (id) => {
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/react-router')) {
              return 'vendor-router';
            }
            if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-') || id.includes('node_modules/victory-')) {
              return 'vendor-charts';
            }
            if (id.includes('node_modules/axios')) {
              return 'vendor-axios';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
          },
        },
      },
    },

    // Ensure environment variables are properly typed
    define: {
      // Fallback API URL when VITE_API_URL is not set (local dev)
      __API_URL__: JSON.stringify(env.VITE_API_URL || 'http://localhost:8080/api/v1'),
    },
  }
})

