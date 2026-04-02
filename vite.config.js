import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "طريق النور - Alnourway",
        short_name: "طريق النور",
        description: "منصة إسلامية تعليمية شاملة لتعلم الإسلام والقرآن الكريم",
        theme_color: "#059669",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        dir: "rtl",
        lang: "ar",
        categories: ["education", "religious"],
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png", // أيقونة Maskable ضرورية لأندرويد
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // رفع الحد الأقصى لحجم الملفات ليتم كاشتها بالكامل (5 ميجا)
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff2}"],

        runtimeCaching: [
          // 1. كاش بيانات جداول Supabase (الدروس، الفتاوى، المقالات)
          // استراتيجية StaleWhileRevalidate: اعرض القديم فوراً وحَدّث في الخلفية
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "supabase-rest-data",
              expiration: {
                maxEntries: 500, // الاحتفاظ بآخر 500 طلب/سجل
                maxAgeSeconds: 60 * 60 * 24 * 30, // لمدة شهر
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          // 2. كاش ملفات الميديا من Supabase Storage (صور، أغلفة كتب)
          // استراتيجية CacheFirst: الميديا ثابتة، حملها مرة واحدة ووفر الباقة
          {
            urlPattern:
              /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "nour-media-cache",
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24 * 60, // لمدة شهرين
              },
            },
          },

          // 3. كاش الخطوط (Fonts) لضمان جمال التصميم Offline
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // لمدة سنة
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // تحسين الأداء وتجنب تكرار المكتبات
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@supabase/supabase-js"],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        // تقسيم الكود لملفات صغيرة (Manual Chunking) لسرعة التحميل الأولي
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["framer-motion", "lucide-react"],
          "supabase-vendor": ["@supabase/supabase-js"],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
