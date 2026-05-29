import { clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

cleanupOutdatedCaches();
declare const self: ServiceWorkerGlobalScope;
precacheAndRoute(self.__WB_MANIFEST);

const handler = createHandlerBoundToURL("/_shell.html");
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);

self.skipWaiting();
clientsClaim();
