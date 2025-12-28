-include .env.local

i:; @deno i
dev: i; @deno task dev --host
build:; @podman build -t strootje/later .
preview:; @podman run --rm -p3000:3000 localhost/strootje/later:latest
up:; @deno update
