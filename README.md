# Echo of Morse

## Introduction

Echo of Morse was originally created and accomplished as part of the 42 cursus Transcendence project by mlaurent, lifan, yren, jdu, and gustgonz.

This repository is a personal modified version of that original project. It is no longer maintained as a 42 school assignment: this fork continues the application as an independent project, with new design decisions, cleanup, and future improvements for public release.

## About

Echo of Morse is a web application for learning, practicing, and using Morse code through individual training, social features, chat, and real-time competition.

The application includes:

- user authentication and profile management;
- Morse lessons, practice, and review flows;
- friendship and private chat features;
- real-time radio lobbies and multiplayer Morse games;
- Docker-based deployment support.

## Real-time Sync

Echo of Morse uses Socket.IO for live events and regular HTTP requests for initial loading, user actions, and recovery sync. This keeps the app responsive without making every screen depend on socket payloads alone.

Current real-time events cover online presence, chat messages, friend requests, radio lobby membership, ready-state changes, game-session updates, and game invitation changes. When an invitation creates or changes lobby membership, the affected radio lobby is also notified so open lobby pages can refresh promptly.

Fallback fetches are intentionally kept for page load, reconnect, visibility restore, and direct user actions.

## Test Users

Seeded local test accounts use neutral usernames instead of the original 42 logins.

Default password:

```text
MorseTest123!
```

Seed users:

| Username | Email | Notes |
| --- | --- | --- |
| A | a@test.com | Core test user |
| B | b@test.com | Core test user |
| C | c@test.com | Core test user |
| D | d@test.com | Core test user |
| E | e@test.com | Core test user |

The original relationship structure is kept:

- `A`, `B`, `C`, `D`, and `E` are all accepted friends with each other.
- The sample chat with messages exists between `A` and `B`.
- The second sample conversation exists between `A` and `C`.

Additional demo accounts may exist for specific flows, such as `learner` and `top_student`.

## Configuration

The Docker stack reads environment variables from `.env`. Use `.env.example` as the template when preparing a new deployment environment.

Important values include:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `DATABASE_URL`
- `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
- OAuth credentials for Google and 42 login, if enabled
- `NEXT_PUBLIC_WS_URL` for the browser Socket.IO endpoint
- `WS_SHARED_SECRET` shared by the web and websocket services

## Docker Commands

The repository keeps a single production-oriented Docker Compose stack. Common commands:

```bash
make certs    # generate local HTTPS certificates
make up       # build and start the stack
make down     # stop the stack
make restart  # restart the stack
make rebuild  # rebuild images and restart the stack
make logs     # follow stack logs
make ps       # show container status
make migrate  # run Prisma migrations inside the web container
make seed     # run seed data inside the web container
make db       # open psql in the database container
```

The application is served through the WAF. With the default local certificate setup, open:

```text
https://localhost:8443
```
