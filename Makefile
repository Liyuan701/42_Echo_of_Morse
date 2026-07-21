# Docker Compose commands for Echo of Morse.
# This repository now keeps a single production-oriented Docker stack.

COMPOSE := docker compose
ENV_FILE := .env
COMPOSE_FILE := docker-compose.yml
APP := $(COMPOSE) --env-file $(ENV_FILE) -f $(COMPOSE_FILE)

.PHONY: help certs up start down stop restart build rebuild logs ps migrate seed db

# Show the available commands.
help:
	@echo "Echo of Morse commands:"
	@echo "  make certs    Generate a local self-signed HTTPS certificate"
	@echo "  make up       Build and start the stack"
	@echo "  make start    Alias for up"
	@echo "  make down     Stop the stack"
	@echo "  make stop     Alias for down"
	@echo "  make restart  Restart the stack"
	@echo "  make build    Build Docker images"
	@echo "  make rebuild  Rebuild images and restart the stack"
	@echo "  make logs     Follow stack logs"
	@echo "  make ps       Show container status"
	@echo "  make migrate  Run Prisma migrations inside the web container"
	@echo "  make seed     Run Prisma seed inside the web container"
	@echo "  make db       Open psql inside the database container"

# Generate a local self-signed HTTPS certificate for the WAF.
certs:
	mkdir -p certs
	openssl req -x509 -newkey rsa:2048 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
	chmod 644 certs/key.pem certs/cert.pem

# Build and start the stack in the background.
up: certs
	$(APP) up -d --build

# Alias for up.
start: up

# Stop the stack.
down:
	$(APP) down

# Alias for down.
stop: down

# Restart the stack.
restart: down up

# Build Docker images without starting containers.
build:
	$(APP) build

# Rebuild and restart the stack.
rebuild: certs
	$(APP) up -d --build --force-recreate

# Follow stack logs.
logs:
	$(APP) logs -f

# Show container status.
ps:
	$(APP) ps

# Run Prisma migrations inside the web container.
migrate:
	$(APP) exec web node node_modules/prisma/build/index.js migrate deploy

# Run seed data inside the web container.
seed:
	$(APP) exec web node prisma/seed.js

# Open an interactive psql shell in the database container.
# Exit with \q.
db:
	$(APP) exec db sh -lc 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'
