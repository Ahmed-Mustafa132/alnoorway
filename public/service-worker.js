// 1. استدعاء قائمة الملفات (مرة واحدة فقط)
const precacheManifest = self.__WB_MANIFEST;

// 2. إعدادات الكاش
const CACHE_NAME = 'alnoorway-v6'; // رفع الإصدار لضمان التحديث

const APP_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico'
];

// ... باقي كود الـ install و activate و fetch كما هو دون تغيير ...