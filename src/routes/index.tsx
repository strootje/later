import { createFileRoute } from "@tanstack/solid-router";
import { onMount } from "solid-js";
import { SentryErrorBoundary } from "../comps/sentry-error-boundary.ts";

export const Route = createFileRoute("/")({
  component: () => {
    return (
      <div class="min-h-dvh bg-amber-100 p-2">
        <h1>Hello solid/tanstack</h1>

        <div class="rounded bg-white p-2 shadow-[2px_2px_0_2px] ring-2">
          this is some cool text
        </div>

        <SentryErrorBoundary fallback={<p>error.</p>}>
          <BadComponent />
        </SentryErrorBoundary>
      </div>
    );
  },
});

const BadComponent = () => {
  onMount(() => {
    setTimeout(() => {
      throw "some very extreme error";
    }, 1000);
  });

  return <p>this will throw..</p>;
};
