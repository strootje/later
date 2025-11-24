i:; @deno i --allow-scripts=npm:@sentry/cli
dev: i; @deno task dev --host
build:; @podman build -t strootje/later .
preview:; @podman run --rm -p3000:3000 localhost/strootje/later:latest
