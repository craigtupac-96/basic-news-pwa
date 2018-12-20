// cache static assets - array
const staticAssets = [
    './',
    './css/styles.css',
    './js/app.js',
];

self.addEventListener('install', async event => {
    // use cache api
    const cache = await caches.open('news-static');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if(url.origin == location.origin){
        event.respondWith(cacheFirst(req));
    } else{
        event.respondWith(networkFirst(req));
    }
    event.respondWith(cacheFirst(req));
});

async function cacheFirst(req){
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req); // return cached or fallback on network
}

async function networkFirst(req){
    const cache = await caches.open('news-dynamic');

    try{
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch(error) {
        const cachedResponse = await cache.match(req);
        return cachesResponse || await caches.match('./fallback.json');
    }
}
