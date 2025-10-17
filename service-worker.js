const CACHE_NAME = 'gestor-pro-cache-v1';
const urlsToCache = [
  '/',
  '/index.html' // Cache the main file. All scripts and styles are inline.
];

// Evento 'install': se dispara cuando el service worker se instala.
// Aquí es donde guardamos en caché los archivos principales de la app.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': se dispara cada vez que la app pide un recurso (como una página, un script, etc.).
// Primero intenta servir el recurso desde el caché. Si no lo encuentra, lo busca en la red.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en el caché, lo devolvemos
        if (response) {
          return response;
        }
        // Si no, lo pedimos a la red
        return fetch(event.request);
      }
    )
  );
});

// Evento 'activate': se dispara cuando un nuevo service worker se activa.
// Aquí se pueden limpiar los cachés antiguos para liberar espacio.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
