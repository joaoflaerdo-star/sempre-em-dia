// Permite instalar como aplicativo e abrir mais rápido. Os dados sempre vêm da internet.
const CACHE = 'sempre-em-dia-visual-v2';
const ARQUIVOS = ['app', 'assets/app.css', 'assets/app.js', 'config.js', 'icon.svg', 'icon-192.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // Supabase e Mercado Pago passam direto
  // Rede primeiro; se estiver sem internet, usa a cópia salva.
  e.respondWith(fetch(e.request).then((r) => {
    const copia = r.clone(); if (r.ok) caches.open(CACHE).then((c) => c.put(e.request, copia));
    return r;
  }).catch(() => caches.match(e.request)));
});
