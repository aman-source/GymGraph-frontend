import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: false, // Use existing manifest.json in public folder
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        // Exclude large reward images from precaching (they're 2+ MB each)
        globIgnores: ['**/tshirt.png', '**/hoodie.png', '**/sipper.png', '**/sleeveless.png'],
        // Don't precache index.html to ensure fresh auth state
        navigateFallback: null,
        // Runtime caching strategies
        runtimeCaching: [
          {
            // Cache static assets
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            // Cache fonts
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            // Network-first for API calls (don't cache auth or user data)
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Never cache Supabase auth requests
            urlPattern: /supabase\.co.*auth/,
            handler: 'NetworkOnly',
          },
        ],
        // Skip waiting to activate new service worker immediately
        skipWaiting: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false, // Disable in development
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-radix': [
            '@radix-ui/react-slot',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-avatar',
            '@radix-ui/react-switch',
            '@radix-ui/react-progress',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-label',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-accordion',
            '@radix-ui/react-collapsible',
          ],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
        }
      }
    }
  },
})
