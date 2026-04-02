import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { VitePWA } from 'vite-plugin-pwa'
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: "autoUpdate",
    //   includeAssets: ["favicon.ico", "icon-192.png", "icon-512.png"],
    //   manifest: {
    //     name: "طريق النور - Alnourway",
    //     short_name: "طريق النور",
    //     description: "منصة إسلامية تعليمية شاملة لتعلم الإسلام والقرآن الكريم",
    //     theme_color: "#059669",
    //     background_color: "#ffffff",
    //     display: "standalone",
    //     orientation: "portrait",
    //     dir: "rtl",
    //     lang: "ar",
    //     icons: [
    //       {
    //         src: "icon-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //         purpose: "any maskable",
    //       },
    //       {
    //         src: "icon-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //         purpose: "any maskable",
    //       },
    //     ],
    //   },
    //   workbox: {
    //     globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
    //         handler: "NetworkFirst",
    //         options: {
    //           cacheName: "supabase-data",
    //           expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 1 week
    //         },
    //       },
    //     ],
    //   },
    // }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["framer-motion", "lucide-react"],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
