/*
 * Chidiya Udd service worker: lets single player and Leader Mode load and
 * play with no internet. Multiplayer and login still need a connection.
 *
 * - Pages: network first, falling back to the cached copy when offline.
 * - App files, images, sounds, fonts: served from cache, refreshed in the background.
 * - Anything else (Supabase): never touched.
 *
 * Bump VERSION to force every visitor to rebuild their cache.
 */
const VERSION = 'v2';
const CACHE = `chidiya-${VERSION}`;
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

const STATIC_FILES = [
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/apple-touch-icon.png',
  '/assets/emojis/ChidiyaUdd.gif',
  '/assets/emojis/heart.png',
  '/assets/emojis/heartless.png',
  '/assets/emojis/02.png',
  '/assets/emojis/google.jpg',
  '/assets/emojis/google2.png',
  '/assets/sounds/CHICKEN.m4a',
  '/assets/sounds/MEOW01.m4a',
  '/assets/sounds/MEOW02.m4a',
  '/assets/sounds/chicken.mp3',
  '/assets/sounds/meow.mp3',
  '/assets/sounds/Meoww.mp3',
];

async function precache() {
  const cache = await caches.open(CACHE);
  await cache.addAll(STATIC_FILES);

  // The page plus the hashed JS/CSS it loads (names change every build).
  const page = await fetch('/', { cache: 'no-store' });
  const html = await page.clone().text();
  await cache.put('/', page);
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]);
  await cache.addAll(assets);

  // Retro fonts (best effort: the game falls back to system fonts without them).
  try {
    const fontCss = [...html.matchAll(/href="(https:\/\/fonts\.googleapis\.com\/[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
    for (const url of fontCss) {
      const res = await fetch(url);
      const css = await res.clone().text();
      await cache.put(url, res);
      const fontFiles = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map((m) => m[1]);
      await cache.addAll(fontFiles);
    }
  } catch {
    /* fonts are optional */
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('chidiya-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !FONT_HOSTS.includes(url.hostname)) return; // e.g. Supabase

  // Pages: try the network so new deploys show up, fall back to the cached game.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put('/', copy));
          }
          return response;
        })
        .catch(() => caches.match('/', { ignoreVary: true }))
    );
    return;
  }

  // Everything else: cache first, refresh in the background.
  // ignoreVary: Vite's <script crossorigin> sends an Origin header that the
  // precache request didn't, and a `Vary` response header would make them miss.
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request, { ignoreVary: true });
      const fresh = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
