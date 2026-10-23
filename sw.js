/* SolidWave Tracker's offline helper (made by web.js; version 1.24.0, code 455d12b82c) */
"use strict";
const KEEP = "solidwave-455d12b82c";
const SHELL = ["./","index.html","vendor/firebase.js","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png","brand/logo-dark.png","brand/logo-light.png"];
self.addEventListener("install", ev => { ev.waitUntil(caches.open(KEEP).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", ev => { ev.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== KEEP).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", ev => {
  const req = ev.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || url.pathname.indexOf("/preview/") >= 0) return;
  if (req.mode === "navigate") {
    ev.respondWith(fetch(req).then(r => { const keep = r.clone(); caches.open(KEEP).then(c => c.put("./", keep)); return r; }).catch(() => caches.match("./")));
    return;
  }
  ev.respondWith(caches.match(req).then(r => r || fetch(req)));
});
/* a reminder tapped: the app comes forward */
self.addEventListener("notificationclick", ev => {
  ev.notification.close();
  ev.waitUntil(self.clients.matchAll({ type: "window" }).then(ws => ws.length ? ws[0].focus() : self.clients.openWindow("./")));
});
