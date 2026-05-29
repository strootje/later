build:; podman build -t strootje/later .
preview: build; podman run --rm -it -p3000:3000 strootje/later
enter: build; podman run --rm -it -p3000:3000 strootje/later sh

compose: compose/down; podman-compose up --build --no-cache
compose/down:; podman-compose down -v
