*This project was created as part of the 42 curriculum by mlaurent, jdu, lifan, yren, and gustgonz.*

# ft_transcendence: Echo of Morse

## Description

**Echo of Morse** is a full-stack web application for learning, practising,
and competing using Morse code. It combines individual training with social
features and real-time multiplayer games.

### Key Features

- Credentials, Google, and 42 authentication
- User profiles, friendships, and online status
- Morse lessons with spaced-repetition progress
- Private chat with text and Morse transformations
- Radio lobbies, game invitations, and ready queues
- Multiplayer decoding games, scores, and rankings
- English, French, and Chinese interfaces
- WAF protection and centralized secret management

## Team Information

| Member | Assigned roles | Responsibilities |
| --- | --- | --- |
| `mlaurent` | Backend Lead, Architect | Backend architecture, Socket.IO integration |
| `jdu` | Frontend Lead | Frontend architecture, UI implementation, and user flows |
| `lifan` | Product Owner, Database Lead | Backlog priorities, database schema, Prisma integration, database APIs, and documentation |
| `yren` | Project Manager, Frontend Developer | Meetings, task coordination, frontend development, authentication, and internationalization |
| `gustgonz` | Security Lead, DevSecOps | WAF, Vault, Docker infrastructure, security testing, and Socket.IO support |

## Project Management

- **Work organization:** The team first held weekly meetings, then formed
  smaller groups around frontend, backend, database, security, and real-time
  features.
- **Task distribution:** Tasks were assigned according to each member's main
  role and adjusted during team meetings when dependencies or blockers appeared.
- **Management tools:** Notion was used for planning and documentation. GitHub
  was used for source control, branches, reviews, and issue tracking.
- **Communication:** Discord and WeChat were used for daily discussion,
  technical questions, and meeting organization.

## Technical Stack

| Area | Technologies | Reason |
| --- | --- | --- |
| Frontend | Next.js 14, React 18, TypeScript | Component-based UI, routing, server rendering, and type safety |
| Styling | CSS Modules, Tailwind CSS | Local component styles and rapid responsive layout |
| Backend | Next.js Route Handlers, Node.js | Keeps the frontend and HTTP APIs in one TypeScript application |
| Authentication | NextAuth, credentials, Google OAuth, 42 OAuth | Supports local and external authentication providers |
| Database | PostgreSQL 15 | Reliable relational storage with transactions and constraints |
| ORM | Prisma | Type-safe queries, migrations, relations, and seed support |
| Real-time layer | Socket.IO | Bidirectional events for chat, presence, invitations, and games |
| Infrastructure | Docker Compose or Podman Compose | Reproducible development and production environments |
| Security | ModSecurity, OWASP CRS, HashiCorp Vault, HTTPS | Request filtering and centralized secret management |

PostgreSQL was chosen because the application contains highly interconnected data:
users, friendships, conversations, messages, learning progress, invitations,
rooms, and game sessions. Foreign keys, unique constraints, and transactions
help keep this data consistent.

## Architecture

### Development

```text
Browser
  |-- HTTP ----------> Next.js :3000
  |-- Socket.IO -----> ws-server :3001
                         |
Next.js ----------------+-------> PostgreSQL :5432
```

### Production

```text
Browser
   |
HTTPS
   v
WAF / ModSecurity
   |-- HTTP -------> Next.js
   |-- Socket.IO -> ws-server
                         |
Next.js ----------------+-------> PostgreSQL
   |
   +----------------------------> HashiCorp Vault
```

The WAF is the public production entry point. Vault initializes and stores the
database, authentication, and OAuth secrets.

## Database Schema

The database schema is defined with Prisma in
[`Echo_of_Morse/prisma/schema.prisma`](Echo_of_Morse/prisma/schema.prisma).

### Relationship Overview

```text
User
 |-- Account / Session
 |-- Friendship <--------------------------> User
 |-- Conversation --> Message -------------> User
 |-- SystemMessage
 |-- UserLetterProgress --------------------> Letter
 |-- GameInvitation ------------------------> User
 |                         |
 |                         v
 |                     RadioRoom
 |                         |
 |-- RadioLobbyPresence ---+
 |-- RadioReadyQueue ------+
 |-- RadioSessionPlayer --> RadioGameSession
```

### Main Tables and Fields

| Table | Key fields and types | Relationships |
| --- | --- | --- |
| `User` | `id String`, `username String`, `email String`, `passwordHash String`, `learningLevel Int`, `isOnline Boolean` | Central relation for authentication, social, learning, and game data |
| `Account` | `id String`, `userId String`, `provider String`, `providerAccountId String` | Many accounts belong to one user |
| `Session` | `id String`, `sessionToken String`, `userId String`, `expires DateTime` | Many sessions belong to one user |
| `VerificationToken` | `identifier String`, `token String`, `expires DateTime` | Stores short-lived authentication tokens |
| `Friendship` | `id Int`, `senderId String`, `receiverId String`, `status FriendshipStatus` | Connects two users; each directed pair is unique |
| `Conversation` | `id String`, `userAId String`, `userBId String`, `createdAt DateTime` | Unique one-to-one conversation between two users |
| `Message` | `id String`, `conversationId String`, `senderId String`, `rawText String`, `mode MessageMode` | Belongs to one conversation and one sender |
| `SystemMessage` | `id String`, `userId String`, `title String`, `body String`, `isRead Boolean` | Notification belonging to one user |
| `Letter` | `id Int`, `char String` | One Morse character with many progress records |
| `UserLetterProgress` | `id Int`, `userId String`, `letterId Int`, `mastery Int`, `nextReviewAt DateTime`, `easeFactor Float` | Unique progress record for one user and one letter |
| `GameInvitation` | `id String`, `fromUserId String`, `toUserId String`, `radioRoomId String?`, `status GameInviteStatus` | Connects sender, receiver, and optional radio room |
| `RadioRoom` | `id String`, `radioId String`, `name String`, `wpm Int`, `maxUsers Int` | Owns lobby, queue, invitation, and session data |
| `RadioLobbyPresence` | `id String`, `roomId String`, `userId String`, `status RadioUserStatus`, `joinedAt DateTime` | Records a user's current lobby state |
| `RadioReadyQueue` | `id String`, `roomId String`, `userId String`, `readyAt DateTime` | Records users waiting for matchmaking |
| `RadioGameSession` | `id String`, `roomId String`, `status RadioSessionStatus`, `startedAt DateTime?`, `endedAt DateTime?` | Represents one multiplayer game |
| `RadioSessionPlayer` | `id String`, `sessionId String`, `userId String`, `score Int?`, `timeMs Int?`, `completed Boolean` | Connects users to a game session |

### Enums

- `FriendshipStatus`: `PENDING`, `ACCEPTED`, `BLOCKED`
- `MessageMode`: `LANGUAGE_TO_MORSE`, `MORSE_TO_LANGUAGE`, `LANGUAGE_ONLY`
- `GameInviteStatus`: `PENDING`, `ACCEPTED`, `DECLINED`
- `RadioUserStatus`: `IDLE`, `READY`, `PLAYING`
- `RadioSessionStatus`: `WAITING`, `ACTIVE`, `FINISHED`

## Features List

| Feature | Functionality | Main contributors |
| --- | --- | --- |
| Authentication and profiles | Local login, Google and 42 OAuth, profile data, and online state | `mlaurent`, `jdu` |
| Morse learning | Character lessons, progress tracking, mastery, and spaced repetition | `mlaurent`, `lifan`, `yren` |
| Friend system | Search users and send, accept, or block friend requests | `lifan`, `jdu`, `yren` |
| Private chat | One-to-one conversations with text and Morse transformations | `lifan`, `jdu`, `mlaurent` |
| Internationalization | English, French, and Chinese interface content | `yren` |
| Game invitations | Invite a friend to a selected radio lobby and accept or decline | `lifan`, `jdu`, `mlaurent` |
| Radio lobby | Lobby presence, capacity, ready state, and matchmaking queue | `lifan`, `jdu`, `mlaurent` |
| Multiplayer game | Shared decoding sessions, player progress, scores, and results | `jdu`, `lifan`, `mlaurent` |
| Real-time events | Socket.IO events for presence, chat, invitations, and games | `mlaurent`, `gustgonz` |
| Security | WAF filtering, HTTPS, Vault secrets, and security tests | `gustgonz` |
| Containerized execution | Development and production Compose environments | `gustgonz`, `mlaurent` |

## Modules

The subject defines Major modules as 2 points and Minor modules as 1 point.
The first table lists modules that are already implemented or close enough to
be defended with the current repository. The second table lists modules that
the team intends to finish before evaluation.

### Confirmed Modules

| Module | Type | Points | Status | Justification | Implementation | Contributors |
| --- | --- | ---: | --- | --- | --- | --- |
| Use a framework for both the frontend and backend | Major | 2 | Confirmed | Build the application with a structured full-stack framework | Next.js is used for the React frontend and for backend Route Handlers/API routes | `jdu`, `mlaurent`, `lifan`, `yren` |
| Allow users to interact with other users | Major | 2 | Confirmed | Provide the required social features: chat, profiles, and friends | Users can view profiles, manage friends, and send private chat messages persisted in PostgreSQL | `lifan`, `jdu`, `mlaurent`, `yren` |
| Standard user management and authentication | Major | 2 | Confirmed | Support user accounts, profile editing, avatars, friends, and online status | NextAuth handles sessions; users can register, log in, edit profile data, upload an avatar, add friends, and see online state | `mlaurent`, `jdu`, `yren`, `lifan` |
| Implement a complete web-based game | Major | 2 | Confirmed | Add a playable multiplayer browser game with rules, scoring, and results | Radio sessions let at least two users join a Morse decoding match, play timed rounds, submit scores, and view rankings | `jdu`, `lifan`, `mlaurent` |
| WAF and HashiCorp Vault | Major | 2 | Confirmed | Protect traffic and keep secrets outside the application code | ModSecurity with OWASP CRS filters production traffic; Vault initializes and injects database, authentication, and OAuth secrets | `gustgonz` |
| Use an ORM for the database | Minor | 1 | Confirmed | Keep database access typed and maintainable | Prisma models, migrations, seed data, and Prisma Client are used across the backend | `lifan`, `mlaurent` |
| Support multiple languages | Minor | 1 | Confirmed | Provide at least three interface languages | The app includes an i18n provider, language switcher, and English, French, and Chinese dictionaries | `yren`, `jdu`, `lifan` |
| Implement remote authentication with OAuth 2.0 | Minor | 1 | Confirmed | Allow users to connect through external identity providers | NextAuth supports Google OAuth and a custom 42 OAuth provider, with account linking | `yren`, `mlaurent` |
| Server-side rendering for improved performance and SEO | Minor | 1 | Confirmed | Render data-backed pages on the server where appropriate | Next.js App Router server components load data for learning, profile, competition, lobby, and game session pages | `jdu`, `lifan`, `mlaurent` |

**Confirmed total: 14 points.**

### Candidate Modules To Finish

| Module | Type | Points | Current status | Work needed before evaluation |
| --- | --- | ---: | --- | --- |
| Implement real-time features using WebSockets or similar technology | Major | 2 | In progress | Socket.IO is present, but chat, invitation, lobby, and game updates still need reliable event delivery without polling fallbacks |
| Remote players | Major | 2 | In progress | The radio game can be played by separate users, but gameplay synchronization, reconnection, latency handling, and disconnection behavior need to be reliable |
| Multiplayer game with more than two players | Major | 2 | In progress | The radio session model supports several ready players, but it must be tested and demonstrated with 3+ simultaneous players |
| Public API to interact with the database | Major | 2 | Partially implemented | The app has many API routes, but this module still needs API-key protection, rate limiting, public documentation, and a clean external API surface |
| Complete notification system | Minor | 1 | In progress | Notifications exist for system messages, chat, and invitations, but all creation/update/deletion actions should trigger consistent notifications |
| Advanced chat features | Minor | 1 | Partially implemented | Chat already has persistence, user profile access, and game invitations; blocking, typing indicators, and read receipts still need to be added |
| Game statistics and match history | Minor | 1 | Partially implemented | Scores and session players are stored, but user-facing match history, wins/losses, rankings, and achievements need final UI/API work |
| Game customization options | Minor | 1 | Partially implemented | Radio rooms already provide different WPM settings; this should be expanded into explicit customizable game settings with defaults |
| Custom-made design system | Minor | 1 | Partially implemented | Shared UI components exist, but the subject requires at least 10 reusable components plus a documented palette, typography, and icon usage |
| Advanced search | Minor | 1 | Not complete | User search exists, but the module requires filters, sorting, and pagination |
| File upload and management system | Minor | 1 | Not complete | Avatar upload exists, but the module requires managed uploads with validation, preview, access control, progress, and deletion |
| Support for additional browsers | Minor | 1 | Needs validation | The app should be tested and documented on at least two additional browsers such as Firefox, Safari, or Edge |
| Progressive Web App | Minor | 1 | Not complete | Add manifest, installability, service worker behavior, and offline support |
| Gamification system | Minor | 1 | Partially implemented | Learning levels and progress exist; add at least three explicit reward mechanics such as badges, XP, achievements, leaderboards, or daily challenges |
| Complete accessibility compliance | Major | 2 | Needs audit | Requires WCAG 2.1 AA work: keyboard navigation, screen-reader support, focus states, semantic checks, and accessibility testing |

**Potential additional total if all candidate modules are completed: 21 points.**

**Potential raw total: 35 points.** The subject's bonus section says extra
modules beyond the required 14 points may be considered up to a maximum of 5
bonus points, so the practical evaluated total may be capped at **19 points**
depending on how the evaluation applies that bonus limit.

See [CYBERSECURITY.md](CYBERSECURITY.md) for the security module architecture,
configuration, and test commands.

## Individual Contributions

### `mlaurent`

- Designed backend architecture and service interactions.
- Worked on Socket.IO communication and real-time event delivery.
- Helped connect backend behavior with frontend requirements.

### `jdu`

- Designed the frontend structure and reusable components.
- Implemented main pages, user flows, chat, and competition interfaces.
- Reviewed frontend consistency and usability.

### `lifan`

- Designed and maintained the Prisma database schema.
- Implemented database-backed APIs for users, chat, invitations, and games.
- Connected frontend mock-data flows to persistent PostgreSQL data.
- Maintained seed data and project documentation.

### `yren`

- Organized meetings, planning, and task follow-up.
- Implemented frontend pages and components.
- Added and maintained English, French, and Chinese translations.
- Helped integrate frontend features across modules.
- Implemented authentication flows within the Node.js and Next.js application.

### `gustgonz`

- Implemented the ModSecurity WAF with OWASP Core Rule Set.
- Integrated HashiCorp Vault for production secret management.
- Worked on Docker infrastructure and security testing.
- Supported Socket.IO configuration and debugging.

### Challenges and Solutions

| Challenge | Solution |
| --- | --- |
| Connecting frontend mock data to the real database | Added Prisma-backed API routes and frontend service functions |
| Keeping related lobby, queue, and game data consistent | Used database constraints and Prisma transactions |
| Unstable real-time delivery during integration | Added temporary database polling for testing while Socket.IO events are corrected |
| Supporting several development environments | Used Make targets that select Docker Compose or Podman Compose |
| Protecting production traffic and secrets | Routed traffic through ModSecurity and loaded secrets from Vault |
| Maintaining three interface languages | Centralized translated content and language selection |

## Instructions

### Prerequisites

- Docker with Docker Compose, or Podman with `podman-compose`
- GNU Make
- OpenSSL for the production self-signed certificate
- Git

Node.js, npm, and PostgreSQL do not need to be installed on the host because
they run inside containers.

### Environment Configuration

```bash
git clone <repository-url>
cd Transcendence/Echo_of_Morse
cp .env.example .env
```

Complete these variables in `.env`:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `DATABASE_URL`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `NEXT_PUBLIC_WS_URL`
- Google and 42 OAuth client IDs and secrets when OAuth is enabled

For development, use the database service name inside Docker:

```env
DATABASE_URL=postgresql://USER:PASSWORD@db:5432/DATABASE
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

A secret can be generated with:

```bash
openssl rand -base64 32
```

### Run the Development Environment

```bash
make dev
```

The development entry point generates the Prisma client, applies migrations,
seeds the database, and starts the services.

- Web application: `http://localhost:3000`
- Socket.IO server: `http://localhost:3001`

Useful commands:

```bash
make dev-logs    # Run development services and display logs
make down        # Stop development services
make rebuild     # Rebuild and restart development services
make db-init     # Apply migrations and run the seed
make typecheck   # Run the TypeScript type check in Docker
make lint        # Run ESLint in Docker
make check       # Run typecheck and lint
```

### Reset the Development Database

```bash
make reset-db
make dev
make db-init
```

`make reset-db` removes the local development database volume.

### Run the Production Environment

```bash
make prod
```

This generates a self-signed certificate and starts the WAF, Next.js
application, Socket.IO server, PostgreSQL, and Vault services.

Production entry point: `https://localhost:8443`

See [MAKEGUIDE.md](MAKEGUIDE.md) for the complete command reference.

## Initial Test Data

The development initialization runs `prisma/seed.js`. It creates test data so
that the main user, learning, chat, and competition flows can be tested immediately.
These credentials are for local development only.

### Test Accounts

All seeded accounts use the password `mdp`.

| Username | Email | Level | Purpose |
| --- | --- | ---: | --- |
| `lifan` | `lifan@test.com` | 3 | General testing |
| `yren` | `yren@test.com` | 4 | General testing |
| `jdu` | `jdu@test.com` | 2 | General testing |
| `mlaurent` | `mlaurent@test.com` | 5 | General testing |
| `gustgonz` | `gustgonz@test.com` | 3 | General testing |
| `nobody` | `nobody@test.com` | 1 | Account outside the seeded friend group |
| `top_student` | `top_student@test.com` | 12 | Advanced progress testing |
| `learner` | `learner@test.com` | 1 | Learning and review testing |

### Seeded Content

- `lifan`, `yren`, `jdu`, `mlaurent`, and `gustgonz` are accepted friends.
- `lifan` and `yren` have a conversation with example messages.
- `lifan` and `jdu` have an empty conversation.
- Supported Morse characters are inserted into `Letter`.
- `learner` receives randomized normal learning progress.
- `top_student` receives randomized high-mastery progress.
- Three radio rooms are created at 5, 10, and 15 WPM.

The seed is designed to avoid duplicate users. Randomized learning counters may
change after a database reset.

## Known Limitations

- Some chat, invitation, and lobby updates currently use database polling as a
  temporary fallback while Socket.IO delivery is being stabilized.
- Polling is for integration testing and should be removed after the related
  real-time events are reliable.
- The production certificate is self-signed for local evaluation.

## Resources

### References

- [Next.js documentation](https://nextjs.org/docs)
- [React documentation](https://react.dev/)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [Prisma documentation](https://www.prisma.io/docs)
- [PostgreSQL documentation](https://www.postgresql.org/docs/)
- [NextAuth documentation](https://next-auth.js.org/)
- [Socket.IO documentation](https://socket.io/docs/v4/)
- [Docker Compose documentation](https://docs.docker.com/compose/)
- [OWASP Core Rule Set](https://coreruleset.org/docs/)
- [HashiCorp Vault documentation](https://developer.hashicorp.com/vault/docs)
- [Morse code overview](https://www.itu.int/rec/R-REC-M.1677/)

### AI Usage

AI tools were used as development support for:

- explaining unfamiliar TypeScript, Prisma, Docker, Socket.IO, and database
  concepts;
- drafting and reviewing selected code;
- suggesting debugging steps and test cases for chat and game invitations;
- improving English and French technical documentation;

All AI-assisted output was read, adapted, and tested by team members before
being included. AI was not treated as a substitute for understanding,
implementation ownership, or manual verification.
