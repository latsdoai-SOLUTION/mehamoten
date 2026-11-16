/* Mehamoten (English) service worker. Scope /en/app/. Own cache namespace "mehamoten-en-",
   so it never deletes the Hebrew app caches. Navigations network-first, assets stale-while-revalidate. */
const VERSION = "2.6.6-en";
const CACHE = "mehamoten-en-" + VERSION;
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
let AUDIO = [];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS).then(() => Promise.all(AUDIO.map((u) => c.add(u).catch(() => {}))))));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("mehamoten-en-") && k !== CACHE).map((k) => caches.delete(k))))
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

  /* קבצי שמע: לא משתנים בתוך גרסה (?v=), אז מהמטמון בלבד, בלי להוריד שוב ברקע */
  if (url.origin === location.origin && url.pathname.includes("/audio/")) {
    e.respondWith(caches.match(req).then((c) => c || fetch(req).then((res) => { e.waitUntil(putCopy(req, res)); return res; })));
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
