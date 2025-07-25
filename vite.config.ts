import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { imageOptimizerPlugin } from './plugins/imageOptimizerPlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), imageOptimizerPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Enable gzip compression reporting
    reportCompressedSize: true,
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        // Create separate chunks for better caching strategy
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'store-vendor': ['pinia'],
        },
        // Optimize chunk file naming for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId && facadeModuleId.includes('node_modules')) {
            return 'vendor/[name]-[hash].js'
          }
          return 'js/[name]-[hash].js'
        },
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Production optimizations
    minify: 'esbuild', // Use esbuild for faster minification
    // Optimize source maps for production
    sourcemap: false, // Set to true if you need source maps in production
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia'],
  },
})
