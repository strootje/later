import { serverAuth } from "@scope/auth/server";
import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => serverAuth.handler(request),
      POST: ({ request }) => serverAuth.handler(request),
    },
  },
});
