// Vite سيبحث عن هذه الكلمة ويستبدلها بقائمة الملفات آلياً عند الـ build
const precacheList = self.__WB_MANIFEST;
if (precacheList) {
  console.log("Assets to precache:", precacheList);
}
const CACHE_NAME = "alnoorway-v5";

// تم تعديل القائمة لضمان عدم فشل التثبيت إذا نقص ملف
const APP_SHELL = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/favicon.ico", // أضفت الملفات الأساسية التي يحتاجها المتصفح فوراً
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // استخدام cache.add لكل ملف على حدة أو التأكد من وجودهم جميعا
      return cache.addAll(APP_SHELL);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. إصلاح خطأ الطلبات الخارجية (External Assets)
  // بدلاً من عمل return (تجاهل)، سنقوم بتخزين الصور والخطوط لتعمل Offline
  if (
    url.hostname.includes("cloudinary.com") ||
    url.hostname.includes("gstatic.com")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
        );
      }),
    );
    return;
  }

  // 2. تحسين التعامل مع Supabase (Network First مع Timeout)
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

  // 3. إصلاح خطأ الـ Navigation (صفحة الأوفلاين)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match("/index.html") || caches.match("/offline.html");
      }),
    );
    return;
  }

  // 4. الملفات الثابتة العامة
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((response) => {
          // لا تخزن إلا الطلبات الناجحة فقط
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
      );
    }),
  );
});
