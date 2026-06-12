*This project has been created as part of the 42 curriculum by mlaurent, jdu, lifan, yren, gustgonz.*

# ft_transcendence: Echo of Morse

## Description

**Echo of Morse** is a full-stack web application for learning, practising,
and competing with Morse code. It combines individual training with social
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
| `mlaurent` | Backend Lead, Architect | Backend architecture, Socket.IO integration, and learning review features |
| `jdu` | Frontend Lead, Git Workflow Manager | Frontend architecture, UI implementation, user flows, frontend review, and Git workflow |
| `lifan` | Product Owner, Database Lead | Backlog priorities, database schema, Prisma integration, database APIs, and documentation |
| `yren` | Project Manager, Frontend Developer | Meetings, task coordination, frontend development, and internationalization |
| `gustgonz` | Security Lead, DevSecOps | WAF, Vault, Docker infrastructure, security testing, and Socket.IO support |

## Project Management

- **Work organization:** the team first held weekly meetings, then formed
  smaller groups around frontend, backend, database, security, and real-time
  features.
- **Task distribution:** tasks were assigned according to each member's main
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
| Backend | Next.js Route Handlers, Node.js | Keeps frontend and HTTP APIs in one TypeScript application |
| Authentication | NextAuth, credentials, Google OAuth, 42 OAuth | Supports local and external authentication providers |
| Database | PostgreSQL 15 | Reliable relational storage with transactions and constraints |
| ORM | Prisma | Type-safe queries, migrations, relations, and seed support |
| Real-time layer | Socket.IO | Bidirectional events for chat, presence, invitations, and games |
| Infrastructure | Docker Compose or Podman Compose | Reproducible development and production environments |
| Security | ModSecurity, OWASP CRS, HashiCorp Vault, HTTPS | Request filtering and centralized secret management |

PostgreSQL was chosen because the application contains strongly related data:
users, friendships, conversations, messages, learning progress, invitations,
rooms, and game sessions. Foreign keys, unique constraints, and transactions
help protect this data from inconsistent updates.

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

The table below lists the module that is explicitly documented in the
repository as a selected curriculum module.

| Module | Type | Points | Justification | Implementation | Contributors |
| --- | --- | ---: | --- | --- | --- |
| WAF and HashiCorp Vault | Major | 2 | Protect the application from common web attacks and keep secrets outside the application code | ModSecurity with OWASP CRS filters production traffic; Vault initializes and injects database, authentication, and OAuth secrets | `gustgonz` |

**Current confirmed total: 2 points.**

Before the final evaluation, the team must add any other officially selected
Major or Minor modules to this table. Application features must not be listed
as curriculum modules unless they were formally selected in the project plan.

See [CYBERSECURITY.md](CYBERSECURITY.md) for the security module architecture,
configuration, and test commands.

## Individual Contributions

### `mlaurent`

- Designed backend architecture and service interactions.
- Worked on Socket.IO communication and real-time event delivery.
- Worked on the learning review functionality.
- Helped connect backend behavior with frontend requirements.

### `jdu`

- Designed the frontend structure and reusable components.
- Implemented main pages, user flows, chat, and competition interfaces.
- Reviewed frontend consistency and usability.
- Helped organize the Git workflow and frontend integration.

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
cd Transendence/Echo_of_Morse
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

The development entrypoint generates the Prisma client, applies migrations,
runs the seed, and starts the services.

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
the main user, learning, chat, and competition flows can be tested immediately.
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
- drafting and reviewing selected API routes and database integration code;
- suggesting debugging steps and test cases for chat and game invitations;
- improving English and French technical documentation;
- reviewing README structure against the 42 requirements.

All AI-assisted output was read, adapted, and tested by team members before
being included. AI was not treated as a substitute for understanding,
implementation ownership, or manual verification.
