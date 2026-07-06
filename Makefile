# Use Docker Compose only.
# This Makefile keeps the common project commands short and documented.

COMPOSE := docker compose

# Development stack uses .env.dev and docker-compose.dev.yml.
DEV_ENV := .env.dev
DEV_FILE := docker-compose.dev.yml
DEV := $(COMPOSE) --env-file $(DEV_ENV) -f $(DEV_FILE)

# Production stack uses .env.prod and docker-compose.yml.
PROD_ENV := .env.prod
PROD_FILE := docker-compose.yml
PROD := $(COMPOSE) --env-file $(PROD_ENV) -f $(PROD_FILE)

.PHONY: help dev dev-logs down rebuild db-init db db-prod typecheck lint check certs prod prod-down prod-logs ps logs seed

# Show the available commands.
help:
	@echo "Development:"
	@echo "  make dev        Start the development stack"
	@echo "  make dev-logs   Start dev stack and follow logs"
	@echo "  make down       Stop the development stack"
	@echo "  make rebuild    Rebuild and start the development stack"
	@echo "  make db-init    Run Prisma migrations and seed in dev"
	@echo "  make db         Open psql inside the dev database container"
	@echo "  make typecheck  Run TypeScript checks in the dev web container"
	@echo "  make lint       Run ESLint in the dev web container"
	@echo "  make check      Run typecheck and lint"
	@echo ""
	@echo "Production:"
	@echo "  make certs      Generate a local self-signed HTTPS certificate"
	@echo "  make prod       Build and start the production stack"
	@echo "  make prod-down  Stop the production stack"
	@echo "  make prod-logs  Follow production logs"
	@echo "  make ps         Show production container status"
	@echo "  make logs       Follow production logs"
	@echo "  make seed       Run Prisma seed in production"
	@echo "  make db-prod    Open psql inside the production database container"

# Start the local development stack in the background.
dev:
	$(DEV) up -d

# Start the local development stack and keep logs attached.
dev-logs:
	$(DEV) up

# Stop the local development stack.
down:
	$(DEV) down

# Rebuild and start the local development stack.
rebuild:
	$(DEV) up -d --build

# Apply database migrations and load seed data in development.
db-init:
	$(DEV) exec web npx prisma migrate deploy
	$(DEV) exec web npx prisma db seed

# Open an interactive psql shell in the development database.
# Exit with \q.
db:
	$(DEV) exec db sh -lc 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

# Run TypeScript checks inside the development web container.
typecheck:
	$(DEV) exec web npm run typecheck

# Run ESLint inside the development web container.
lint:
	$(DEV) exec web npm run lint

# Run all local code checks.
check: typecheck lint

# Generate a local self-signed HTTPS certificate for the WAF.
certs:
	mkdir -p certs
	openssl req -x509 -newkey rsa:2048 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
	chmod 644 certs/key.pem certs/cert.pem

# Build and start the production stack in the background.
prod: certs
	$(PROD) up -d --build

# Stop the production stack.
prod-down:
	$(PROD) down

# Follow production logs.
prod-logs:
	$(PROD) logs -f

# Show production container status.
ps:
	$(PROD) ps

# Alias for production logs.
logs: prod-logs

# Run seed data in production.
seed:
	$(PROD) exec web npx prisma db seed

# Open an interactive psql shell in the production database.
# Exit with \q.
db-prod:
	$(PROD) exec db sh -lc 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'
