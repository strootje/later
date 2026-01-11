ARG DENO_VERSION=2.6.4
FROM docker.io/denoland/deno:alpine-${DENO_VERSION} AS deps

WORKDIR /build
COPY deno.* package.* .
RUN deno i

FROM deps AS build
COPY *.config.ts .
COPY src/ ./src/
COPY pkgs/ ./pkgs/
RUN deno task build

FROM docker.io/denoland/deno:alpine-${DENO_VERSION}
WORKDIR /app
COPY --from=build /build/.output .

EXPOSE 3000
VOLUME /data
env DATABASE_PATH=/data

CMD ["deno", "run", "--allow-all", "server/index.mjs"]
