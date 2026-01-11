

ARG DENO_VERSION=2.5.6
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

ENV LISTMONK_API_LOGIN=later

EXPOSE 3000
VOLUME /data
CMD ["deno", "run", "--allow-all", "server/index.mjs"]
