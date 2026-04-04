/* eslint-disable no-restricted-globals */

// 1. تعريف قائمة الملفات التي ينتجها Vite تلقائياً
// ستقوم أداة Build باستبدال self.__WB_MANIFEST بمصفوفة الملفات الحقيقية
const precacheManifest = self.__WB_MANIFEST || [];
const CACHE_NAME = "alnoorway-v5"; // تحديث الإصدار لإجبار متصفح أسامة على التحديث

const APP_SHELL = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/favicon.ico",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
];

// 2. مرحلة التثبيت: تخزين ملفات الـ Shell الأساسية
self.addEventListener("install", (event) => {
  self.skipWaiting(); // إجبار النسخة الجديدة على التثبيت فوراً
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching App Shell and Manifest Assets...");
      // تخزين قائمة Vite + ملفات الـ Shell اليدوية
      const assetsToCache = [
        ...APP_SHELL,
        ...precacheManifest.map((entry) =>
          typeof entry === "string" ? entry : entry.url,
        ),
      ];
      return cache.addAll(assetsToCache);
    }),
  );
});

// 3. مرحلة التفعيل: تنظيف الكاش القديم
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("Removing old cache:", key);
              return caches.delete(key);
            }
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// 4. إدارة الطلبات (Fetch Strategy)
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // أ - طلبات التنقل (Navigation) لمنع الصفحة البيضاء
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match("/index.html") || caches.match("/offline.html");
      }),
    );
    return;
  }

  // ب - الأصول الخارجية (Images & Fonts) من Cloudinary أو Google
  if (
    url.hostname.includes("cloudinary.com") ||
    url.hostname.includes("gstatic.com") ||
    url.hostname.includes("googleapis.com")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(request, clone));
            }
            return response;
          })
        );
      }),
    );
    return;
  }

  // ج - طلبات Supabase (Network First)
  if (url.hostname.includes("supabase.co")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // د - الملفات الثابتة الأخرى (Static Assets)
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((response) => {
          if (response.ok && request.method === "GET") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
      );
    }),
  );
});
