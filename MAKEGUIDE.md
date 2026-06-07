# Makefile Usage Guide

This project uses Makefile to manage Docker environments and database operations.

##  Dev Environment

- Start dev environment
Starts all services in detached mode using docker-compose.dev.yml.
```
make dev
```
- View logs
Runs containers in foreground and shows logs.
```
make dev-logs
```
- Stop dev environment
```
make down
```


##  Database
- Initialize database (migrate + seed)
Prisma migrations and Seed script
Use only when database needs to be initialized or reset.
```
make db-init
```

- Seed only
```
make seed
```

## Reset
- Reset database volume (dev only)
```
make reset-db
```
- Full reset (containers + volumes + ports)
```
make reset
```

## Production
- Start production environment
Uses docker-compose.yml.
```
make prod
```
- Stop production
```
make prod-down
```
- View production logs
```
make prod-logs
```

## Code Quality

- Typecheck
Checks TypeScript types without running the program.
```
make typecheck
```
- Lint
Checks code style and potential issues using ESLint.
```
make lint
```
- check
Runs both typecheck and lint
```
make check
```

## Utilities
- Kill local ports
Stops processes using: 3000/3001/5432
```
make kill-port
```

## Clean all containers and volumes
make fclean