import * as Sentry from "@sentry/solid";
import { ErrorBoundary } from "solid-js";

export const SentryErrorBoundary = Sentry.withSentryErrorBoundary(ErrorBoundary);

export const SimpleErrorDisplay = (err: Error, reset: () => void) => {
  return (
    <code onclick={reset}>
      {err.message}
      <hr />
      {err.stack}
    </code>
  );
};
