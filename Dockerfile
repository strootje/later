

ARG DENO_VERSION=2.5.6
FROM docker.io/denoland/deno:alpine-${DENO_VERSION} AS deps

WORKDIR /build
COPY deno.* package.* .
RUN deno i --allow-scripts=npm:@sentry/cli

FROM deps AS build
COPY *.config.ts .
COPY src/ ./src/
COPY pkgs/ ./pkgs/
RUN --mount=type=secret,id=sentry_token,env=SENTRY_TOKEN \
   && deno task build

FROM docker.io/denoland/deno:alpine-${DENO_VERSION}
WORKDIR /app
COPY --from=build /build/.output .
CMD ["deno", "run", "--allow-all", "server/index.mjs"]
