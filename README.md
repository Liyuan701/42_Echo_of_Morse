# Echo of Morse

## Introduction

Echo of Morse was originally created and accomplished as part of the 42 cursus Transcendence project by mlaurent, lifan, yren, and gustgonz.

This repository is a personal modified version of that original project. It is no longer maintained as a 42 school assignment: this fork continues the application as an independent project, with new design decisions, cleanup, and future improvements for public release.

## About

Echo of Morse is a web application for learning, practicing, and using Morse code through individual training, social features, chat, and real-time competition.

The application includes:

- user authentication and profile management;
- Morse lessons, practice, and review flows;
- friendship and private chat features;
- real-time radio lobbies and multiplayer Morse games;
- Docker-based development and deployment support.

## Test Users

Seeded local test accounts use neutral usernames instead of the original 42 logins.

Default password:

```text
MorseTest123!
```

Seed users:

| Username | Email | Notes |
| --- | --- | --- |
| A | A@test.com | Core test user |
| B | B@test.com | Core test user |
| C | C@test.com | Core test user |
| D | D@test.com | Core test user |
| E | E@test.com | Core test user |

The original relationship structure is kept:

- `A`, `B`, `C`, `D`, and `E` are all accepted friends with each other.
- The sample chat with messages exists between `A` and `B`.
- The second sample conversation exists between `A` and `C`.

Additional development/demo accounts may exist for specific flows, such as `learner` and `top_student`.

## Development

The application source now lives directly at the repository root.

Common development commands:

```bash
make dev
make db-init
make test
make check
```

This README is being rebuilt for the fork and will be expanded as the modified application evolves.
