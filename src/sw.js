/* eslint-disable no-restricted-globals */

const CACHE_NAME = "alnoorway-pro-v1"; // اسم جديد لضمان النظافة

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  // ضيف هنا أهم المسارات اللي المستخدم بيحتاجها أوفلاين
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // تخزين الهيكل الأساسي للتطبيق
      return cache.addAll(APP_SHELL);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. التعامل مع صفحات الملاحة (Offline Mode)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // 2. استراتيجية Stale-While-Revalidate لبيانات Supabase والمحتوى الثابت
  // دي بتخلي التطبيق يفتح فوراً بالبيانات القديمة ويحدثها في الخلفية
  if (url.hostname.includes("supabase.co") || url.pathname.includes("/assets/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchedResponse = fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse); // لو مفيش نت خالص يرجع الكاش

          return cachedResponse || fetchedResponse;
        });
      })
    );
    return;
  }

  // 3. أي طلبات أخرى (Cache First للملفات المحلية)
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});