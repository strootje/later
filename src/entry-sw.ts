import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

cleanupOutdatedCaches();
declare const self: ServiceWorkerGlobalScope;
precacheAndRoute(self.__WB_MANIFEST);

const handler = createHandlerBoundToURL("/_shell.html");
const navigationRoute = new NavigationRoute(handler, {
  denylist: [
    /^\/_serverFn\//,
    /^\/api\//,
  ],
});
registerRoute(navigationRoute);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// self.skipWaiting();
// clientsClaim();
