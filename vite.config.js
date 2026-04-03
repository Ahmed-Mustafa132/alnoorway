import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // التعديل الجوهري: استخدام injectManifest بدلاً من generateSW
      strategies: "injectManifest",
      srcDir: "public", // المكان الذي وضعت فيه ملف الـ Service Worker اليدوي
      filename: "service-worker.js", // اسم ملف الكود الذي كتبته أنت

      registerType: "autoUpdate",
      injectRegister: "auto",

      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "masked-icon.svg",
        "offline.html",
      ],

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
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      // لم نعد بحاجة لتعريف workbox هنا لأنك كتبته يدوياً في الملف الخاص بك
      injectManifest: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  // باقي الإعدادات (build, server) تبقى كما هي دون تغيير
});
