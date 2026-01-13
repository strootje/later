import { precacheAndRoute } from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;
console.log("precacheAndRoute", self);

precacheAndRoute(self.__WB_MANIFEST);
