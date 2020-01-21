importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`)
} else {
  console.log(`Boo! Workbox didn't load 😬`)
}

var precacheArr = [
  { url: '/index.html', revision: 1 },
  { url: '/nav.html', revision: 1 },
  { url: '/team.html', revision: 1 },
  { url: '/css/style.css', revision: 1 },
  { url: '/js/nav.js', revision: 1 },
  { url: '/js/api.js', revision: 1 },
  { url: '/js/db.js', revision: 1 },
  { url: '/js/script.js', revision: 1 },
  { url: '/manifest.json', revision: 1 },
  '/default.jpg',
  '/images/icon-infootball.png',
  '/images/icon-infootball-128.png',
  '/images/icon-infootball-192.png',
  '/images/apple-icon-infootball-192.png',
  '/register-sw.js',
  '/pages/klasemen.html',
  '/css/materialize.min.css',
  '/js/materialize.min.js',
  '/js/idb.js',
]

workbox.precaching.precacheAndRoute(precacheArr, {
  ignoreUrlParametersMatching: [/.*/]
})

workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages'
  })
)

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate({
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 7,
      }),
    ],
  })
)

self.addEventListener('push', function (event) {
  var body
  if (event.data) {
    body = event.data.text()
  } else {
    body = 'Push message no payload'
  }

  var options = {
    body: body,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  }

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  )
})
