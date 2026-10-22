import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import viteImagemin from 'vite-plugin-imagemin';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo.png'],
      manifest: {
        name: 'Bharat Office Setu',
        short_name: 'BOS Portal',
        description: 'Digital Infrastructure & Compliance Portal for the New India',
        theme_color: '#1B6B2F',
        background_color: '#F4F3EE',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }) ,
    viteImagemin({
      // Optimize PNG, JPEG and JPG images
      include: [
        'src/assets/**/*.png',
        'src/assets/**/*.jpg',
        'src/assets/**/*.jpeg',
        'public/**/*.png',
        'public/**/*.jpg',
        'public/**/*.jpeg'
      ],
      png: {
        quality: [0.8, 0.9]
      },
      jpeg: {
        quality: 80
      },
      jpg: {
        quality: 80
      },
      // Optionally handle other formats
      // svgo: { plugins: [{ removeViewBox: false }] }
    })
  ],
})
