ARG DENO_VERSION=2.8.1

FROM docker.io/denoland/deno:${DENO_VERSION} AS deps
WORKDIR /build
COPY deno.json deno.lock package.json .
RUN deno install

FROM deps AS build
COPY --parents public pkgs src .
COPY *.config.ts .
RUN deno task build

FROM docker.io/denoland/deno:alpine-${DENO_VERSION}
WORKDIR /app
COPY --from=build /build/.output .

EXPOSE 3000
CMD ["deno", "run", "start"]
