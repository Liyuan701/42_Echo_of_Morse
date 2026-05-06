# =========================
# Detect environment
# =========================

UNAME := $(shell uname)

ifeq ($(UNAME), Linux)
	COMPOSE = podman-compose
else
	COMPOSE = docker compose
endif

# =========================
# Core
# =========================

dev:
	$(COMPOSE) -f docker-compose.dev.yml up -d

dev-logs:
	$(COMPOSE) -f docker-compose.dev.yml up

down:
	$(COMPOSE) -f docker-compose.dev.yml down

up:
	$(COMPOSE) up -d

stop:
	$(COMPOSE) down

# =========================
# Debug
# =========================

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f

# =========================
# Dev reset
# =========================

reset-db:
	$(COMPOSE) -f docker-compose.dev.yml down -v
	$(COMPOSE) -f docker-compose.dev.yml up -d db

rebuild:
	$(COMPOSE) -f docker-compose.dev.yml up -d --build

re:
	$(COMPOSE) -f docker-compose.dev.yml down -v
	$(COMPOSE) -f docker-compose.dev.yml up -d --build

# =========================
# FULL CLEAN (IMPORTANT)
# =========================

fclean:
	$(COMPOSE) -f docker-compose.dev.yml down -v --remove-orphans || true
	$(COMPOSE) down -v --remove-orphans || true
	@echo "Clean done"

# =========================
# Ports (dev only helper)
# =========================

kill-port:
	fuser -k 3001/tcp || true
	fuser -k 3000/tcp || true
	fuser -k 5432/tcp || true

# =========================
# FULL RESET (SAFE + CLEAN)
# =========================

reset:
	@echo "🧨 Stopping compose..."
	-$(COMPOSE) -f docker-compose.dev.yml down -v --remove-orphans || true
	-$(COMPOSE) down -v --remove-orphans || true

	@echo "🧹 Killing ports..."
	-fuser -k 3000/tcp || true
	-fuser -k 3001/tcp || true
	-fuser -k 5432/tcp || true

	@echo "🧽 Cleaning podman state..."
	-podman-compose -f docker-compose.dev.yml down -v --remove-orphans || true
	-podman pod rm -f --all || true
	-podman rm -af || true
	-podman network prune -f || true
	-podman volume prune -f || true
	-podman system prune -f || true

	@echo "✨ Done. Environment is clean."

	
.PHONY: dev dev-logs down up stop ps logs rebuild re fclean kill-port reset-db
