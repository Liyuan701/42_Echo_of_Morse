# =========================
# Detect environment
# =========================

# Linux - 42 Fedora - podman
# Linux - Ubuntu - docker
# Others - docker


UNAME := $(shell uname)

ifeq ($(UNAME), Darwin)
	COMPOSE = docker compose
else ifneq ($(shell which podman-compose 2>/dev/null),)
	COMPOSE = podman-compose
else
	COMPOSE = docker compose
endif

# =========================
# Core (Dev)
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
# Production
# =========================

prod:
	# Génération du certificat SSL auto-signé pour localhost — aucun sudo requis
	# Les 3 lignes suivantes créent le dossier certs/ et génèrent cert.pem + key.pem via openssl
	@mkdir -p certs
	@openssl req -x509 -newkey rsa:2048 -keyout certs/key.pem -out certs/cert.pem \
		-days 365 -nodes -subj "/CN=localhost" \
		-addext "subjectAltName=DNS:localhost,IP:127.0.0.1" 2>/dev/null || true
	# chmod 644 : nginx dans le conteneur tourne sous un autre utilisateur que le host
	# Sans ces permissions, nginx ne peut pas lire la clé privée et refuse de démarrer
	@chmod 644 certs/key.pem certs/cert.pem
	$(COMPOSE) -f docker-compose.yml up -d

prod-down:
	$(COMPOSE) -f docker-compose.yml down

prod-logs:
	$(COMPOSE) -f docker-compose.yml logs -f


# =========================
# DB Init (IMPORTANT)
# =========================

db-init:
	$(COMPOSE) -f docker-compose.dev.yml exec web npx prisma migrate deploy
	$(COMPOSE) -f docker-compose.dev.yml exec web npx prisma db seed

# =========================
# Debug
# =========================

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f

seed:
	$(COMPOSE) exec web npx prisma db seed

typecheck:
	$(COMPOSE) -f docker-compose.dev.yml exec web npm run typecheck

lint:
	$(COMPOSE) -f docker-compose.dev.yml exec web npm run lint

check: typecheck lint

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
