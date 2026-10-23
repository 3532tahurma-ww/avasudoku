const VERSION = 'ava-sudoku-v6';
const SHELL = [
  './', 'index.html', 'style.css', 'app.js', 'manifest.json',
  'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
  'assets/ui/font.otf', 'assets/ui/arrow_left.webp',
  'assets/ava/smile.webp', 'assets/ava/shy.webp', 'assets/ava/normal.webp',
  ...['ava', 'ash', 'liza', 'chloe', 'scarlett', 'luna', 'mia', 'roxy', 'claire'].map((c) => `assets/avatars/${c}.webp`),
  ...['village', 'office', 'park', 'hospital', 'college', 'witch', 'evening'].map((b) => `assets/bg/${b}.webp`),
  ...['flowers', 'choco', 'potion_1', 'potion_3', 'wine', 'mushroom'].map((i) => `assets/items/${i}.webp`),
  ...['click', 'knock', 'fun_run'].map((a) => `assets/audio/${a}.ogg`),
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: stale-while-revalidate
  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('gstatic.com')) {
    e.respondWith(
      caches.open(VERSION).then(async (cache) => {
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((res) => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  if (url.origin !== location.origin) return;

  // Music is streamed with range requests; let the browser handle it
  if (req.headers.has('range')) return;

  // Page and code: network first so a new deploy shows up immediately, cache when offline
  if (req.mode === 'navigate' || /\.(js|css|json)$/.test(url.pathname)) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('index.html')))
    );
    return;
  }

  // Assets: serve from cache, refresh it in the background
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res.ok && res.status === 200) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      });
      if (cached) {
        e.waitUntil(network.catch(() => {}));
        return cached;
      }
      return network.catch(() => (req.mode === 'navigate' ? caches.match('index.html') : undefined));
    })
  );
});
