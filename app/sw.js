/* מהמותן — Service Worker
   VERSION חייב להיות זהה ל-?v= בקובץ index.html (update_site.bat בודק את זה).
   ניווטים: network-first (תמיד הגרסה החדשה, אופליין → מטמון).
   קבצי האפליקציה (css/js/אייקונים): stale-while-revalidate (מהיר, ומתעדכן ברקע).
   גופני Google: stale-while-revalidate. */
const VERSION = "2.1.0";
const CACHE = "mehamoten-" + VERSION;
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./privacy.html",
  "./css/app.css?v=" + VERSION,
  "./js/data.js?v=" + VERSION,
  "./js/app.js?v=" + VERSION,
  "./icons/favicon.svg",
  "./icons/app-icon.svg",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png"
];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("mehamoten-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (e) => { if (e.data === "SKIP_WAITING") self.skipWaiting(); });

function timeoutFetch(req, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    fetch(req).then((r) => { clearTimeout(t); resolve(r); }, (err) => { clearTimeout(t); reject(err); });
  });
}

function putCopy(req, res) {
  if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); return caches.open(CACHE).then((c) => c.put(req, copy)); }
  return Promise.resolve();
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (req.mode === "navigate") {
    e.respondWith(
      timeoutFetch(req, 4000).then((res) => { e.waitUntil(putCopy(req, res)); return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((c) => c || caches.match("./index.html")))
    );
    return;
  }

  if (url.origin === location.origin || FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(req).then((cached) => {
        const net = fetch(req).then((res) => { e.waitUntil(putCopy(req, res)); return res; }).catch(() => cached || Response.error());
        return cached || net;
      })
    );
  }
});
