import { serverAuth } from "@scope/better-auth/server";
import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return await serverAuth.handler(request);
      },
      POST: async ({ request }: { request: Request }) => {
        return await serverAuth.handler(request);
      },
    },
  },
});
