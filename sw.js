const CACHE = 'harcama-v2';

self.addEventListener('install', function(e){
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});
self.addEventListener('fetch', function(e){
  // Firebase ve CDN isteklerini cache'leme, direkt ağdan al
  var url = e.request.url;
  if(url.includes('firebaseio.com') || url.includes('googleapis.com') ||
     url.includes('gstatic.com') || url.includes('unpkg.com')){
    return;
  }
  e.respondWith(
    fetch(e.request).catch(function(){
      return caches.match(e.request);
    })
  );
});
