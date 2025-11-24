import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/onboarding"!</div>;
}
