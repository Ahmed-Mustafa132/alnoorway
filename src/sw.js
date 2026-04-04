/* eslint-disable no-restricted-globals */

// 1. تعريف قائمة الملفات التي ينتجها Vite تلقائياً
const precacheManifest = self.__WB_MANIFEST || [];
const CACHE_NAME = "alnoorway-v6"; // تم الرفع لـ v6 لضمان تجاوز الكاش القديم

const APP_SHELL = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/favicon.ico",
];

// 2. مرحلة التثبيت: تنظيف القائمة وتخزينها
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching Assets...");
      
      // تحويل الـ Manifest لروابط نصية
      const manifestUrls = precacheManifest.map((entry) =>
        typeof entry === "string" ? entry : entry.url
      );

      // دمج القوائم وحذف التكرار باستخدام Set (لحل خطأ InvalidStateError)
      const allAssets = [...APP_SHELL, ...manifestUrls];
      const uniqueAssets = [...new Set(allAssets)]; 

      return cache.addAll(uniqueAssets);
    })
  );
});

// 3. مرحلة التفعيل: حذف الكاش القديم فوراً
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Removing old cache:", key);
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// 4. إدارة الطلبات (Fetch Strategy)
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // أ - طلبات التنقل (التعامل مع الصفحة البيضاء)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match("/index.html") || caches.match("/offline.html");
      })
    );
    return;
  }

  // ب - الأصول الخارجية (Images & Fonts)
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
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
        );
      })
    );
    return;
  }

  // ج - طلبات Supabase (Network First مع الرجوع للكاش)
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
        .catch(() => caches.match(request))
    );
    return;
  }

  // د - الملفات الثابتة (Static Assets)
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
    })
  );
});