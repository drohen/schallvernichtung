const SchallvernichtungServiceWorker2 = class {
  static run() {
    self.addEventListener(`install`, SchallvernichtungServiceWorker2.onInstalled);
    self.addEventListener(`fetch`, SchallvernichtungServiceWorker2.onFetched);
  }
};
let SchallvernichtungServiceWorker = SchallvernichtungServiceWorker2;
SchallvernichtungServiceWorker.cacheName = `schallvernichtung-v1`;
SchallvernichtungServiceWorker.onInstalled = (_event) => {
  const pathsSearch = new URL(window.location.href).searchParams.get(`paths`);
  if (!pathsSearch) {
    throw Error(`Null data passed to service worker`);
  }
  const paths = JSON.parse(pathsSearch);
  if (!Array.isArray(paths)) {
    throw Error(`Invalid data passed to service worker`);
  }
  const event = _event;
  event.waitUntil(caches.open(SchallvernichtungServiceWorker2.cacheName).then((cache) => cache.addAll(paths)));
};
SchallvernichtungServiceWorker.onFetched = (_event) => {
  const event = _event;
  event.respondWith(caches.match(event.request, {ignoreSearch: true}).then((matchResponse) => matchResponse || fetch(event.request)).then((fetchResponse) => caches.open(SchallvernichtungServiceWorker2.cacheName).then((cache) => ({cache, fetchResponse}))).then(({cache, fetchResponse}) => {
    cache.put(event.request, fetchResponse.clone());
    return fetchResponse;
  }));
};
SchallvernichtungServiceWorker.run();
