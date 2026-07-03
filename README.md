*This project was created as part of the 42 curriculum by mlaurent, jdu, lifan, yren, and gustgonz.*

# ft_transcendence: Echo of Morse

## 🧭 Table of Contents

- [📌 Description](#-description)
- [👥 Team Information](#-team-information)
- [🗂️ Project Management](#️-project-management)
- [🧰 Technical Stack](#-technical-stack)
- [🏗️ Architecture](#️-architecture)
- [🗄️ Database Schema](#️-database-schema)
- [✨ Features List](#-features-list)
- [🔁 Feature Flow Summary](#-feature-flow-summary)
- [🧮 Modules](#-modules)
- [🙋 Individual Contributions](#-individual-contributions)
- [🚀 Instructions](#-instructions)
- [🧪 Initial Test Data](#-initial-test-data)
- [📚 Resources](#-resources)

## 📌 Description

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

## 👥 Team Information

| Member | Assigned roles | Responsibilities |
| --- | --- | --- |
| `mlaurent` | Backend Lead, Architect | Backend architecture, Socket.IO integration |
| `jdu` | Frontend Lead | Frontend architecture, UI implementation, and user flows |
| `lifan` | Product Owner, Database Lead | Backlog priorities, database schema, Prisma integration, database APIs, and documentation |
| `yren` | Project Manager, Frontend Developer | Meetings, task coordination, frontend development, authentication, and internationalization |
| `gustgonz` | Security Lead, DevSecOps | WAF, Vault, Docker infrastructure, security testing, and Socket.IO support |

## 🗂️ Project Management

- **Work organization:** The team first held weekly meetings, then formed
  smaller groups around frontend, backend, database, security, and real-time
  features.
- **Task distribution:** Tasks were assigned according to each member's main
  role and adjusted during team meetings when dependencies or blockers appeared.
- **Management tools:** Notion was used for planning and documentation. GitHub
  was used for source control, branches, reviews, and issue tracking.
- **Communication:** Discord and WeChat were used for daily discussion,
  technical questions, and meeting organization.

## 🧰 Technical Stack

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

## 🏗️ Architecture

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
See [CYBERSECURITY.md](CYBERSECURITY.md) for the security module architecture.

## 🗄️ Database Schema

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

### Models, Keys, and Relations

**User and Auth**

- `User`: columns `id`, `username`, `email`, `passwordHash`, `image`, `bio`,
  `learningLevel`, `isOnline`, `lastSeen`, timestamps, `practiceSessions`.
  PK `id`; unique `username`, `email`; relation hub, 1 to N with auth, social,
  chat, learning, and game tables.
- `Account`: columns `id`, `userId`, provider data, OAuth tokens. PK `id`;
  FK `userId -> User.id`; unique `(provider, providerAccountId)`; `User` 1 to N
  `Account`.
- `Session`: columns `id`, `sessionToken`, `userId`, `expires`. PK `id`;
  FK `userId -> User.id`; unique `sessionToken`; `User` 1 to N `Session`.
- `VerificationToken`: columns `identifier`, `token`, `expires`; unique
  `token`, `(identifier, token)`; no FK.

**Social and Chat**

- `Friendship`: columns `id`, `status`, `createdAt`, `senderId`, `receiverId`.
  PK `id`; FKs `senderId/receiverId -> User.id`; unique `(senderId,
  receiverId)`; users N to N via friendship rows.
- `Conversation`: columns `id`, `userAId`, `userBId`, `createdAt`. PK `id`;
  FKs `userAId/userBId -> User.id`; unique `(userAId, userBId)`; user pair
  1 to 1 `Conversation`; `Conversation` 1 to N `Message`.
- `Message`: columns `id`, `conversationId`, `senderId`, `rawText`,
  `translatedText`, `mode`, `createdAt`. PK `id`; FKs
  `conversationId -> Conversation.id`, `senderId -> User.id`;
  `Conversation` 1 to N `Message`, `User` 1 to N sent `Message`.
- `SystemMessage`: columns `id`, `userId`, `title`, `body`, `isRead`, `kind`,
  invite/radio/action/i18n metadata, `createdAt`. PK `id`;
  FK `userId -> User.id`; `User` 1 to N `SystemMessage`.

**Learning**

- `Letter`: columns `id`, `char`. PK `id`; unique `char`; `Letter` 1 to N
  `UserLetterProgress`.
- `UserLetterProgress`: columns `id`, `userId`, `letterId`, `mastery`,
  counters, `nextReviewAt`, `interval`, `easeFactor`, `lastReviewed`.
  PK `id`; FKs `userId -> User.id`, `letterId -> Letter.id`; unique
  `(userId, letterId)`; users N to N letters via progress rows.

**Competition**

- `GameInvitation`: columns `id`, `fromUserId`, `toUserId`, `status`,
  `radioRoomId`, `createdAt`. PK `id`; FKs `fromUserId/toUserId -> User.id`,
  `radioRoomId -> RadioRoom.id`; `User` 1 to N sent/received invitations,
  `RadioRoom` 1 to N invitations.
- `RadioRoom`: columns `id`, `radioId`, `name`, `wpm`, `description`,
  `maxUsers`, timestamps. PK `id`; unique `radioId`; `RadioRoom` 1 to N
  presences, queue rows, sessions, invitations.
- `RadioLobbyPresence`: columns `id`, `userId`, `roomId`, `status`, timestamps.
  PK `id`; FKs `userId -> User.id`, `roomId -> RadioRoom.id`; unique
  `(userId, roomId)`; users N to N rooms via lobby presence.
- `RadioReadyQueue`: columns `id`, `userId`, `roomId`, `readyAt`. PK `id`;
  FKs `userId -> User.id`, `roomId -> RadioRoom.id`; unique `(userId, roomId)`;
  users N to N rooms via ready queue.
- `RadioGameSession`: columns `id`, `roomId`, `status`, timestamps. PK `id`;
  FK `roomId -> RadioRoom.id`; `RadioRoom` 1 to N sessions; session 1 to N
  players.
- `RadioSessionPlayer`: columns `id`, `sessionId`, `userId`, `score`,
  `correct`, `total`, `timeMs`, `completed`, `abandoned`, `joinedAt`. PK `id`;
  FKs `sessionId -> RadioGameSession.id`, `userId -> User.id`; unique
  `(sessionId, userId)`; users N to N sessions via player rows.

### Enums

- `FriendshipStatus`: `PENDING`, `ACCEPTED`, `BLOCKED`
- `MessageMode`: `LANGUAGE_TO_MORSE`, `MORSE_TO_LANGUAGE`, `LANGUAGE_ONLY`
- `GameInviteStatus`: `PENDING`, `ACCEPTED`, `DECLINED`, `EXPIRED`
- `RadioUserStatus`: `IDLE`, `READY`, `PLAYING`
- `RadioSessionStatus`: `WAITING`, `ACTIVE`, `FINISHED`

## ✨ Features List

| Feature | Functionality | Main contributors |
| --- | --- | --- |
| Authentication and profiles | Local login, Google and 42 OAuth, profile data | `yren` |
| Morse learning | Character lessons, progress tracking, mastery, and spaced repetition | `jdu`, `lifan`, `yren` |
| Friend system | Search users and send, accept friend requests | `jdu`, `lifan`, `yren` |
| Private chat | One-to-one conversations with text and Morse transformations | all |
| Internationalization | English, French, and Chinese interface content | `yren` |
| Game invitations | Invite a friend to a selected radio lobby and accept or decline | all |
| Radio lobby | Lobby presence, capacity, ready state, and matchmaking queue | all |
| Multiplayer game | Shared decoding sessions, player progress, scores, and results | all |
| Real-time events | Socket.IO events for presence, chat, invitations, and games | `mlaurent`, `gustgonz` |
| Security | WAF filtering, HTTPS, Vault secrets, and security tests | `gustgonz` |
| Containerized execution | Development and production Compose environments | `gustgonz`, `mlaurent` |

## 🔁 Feature Flow Summary

This section summarizes the main runtime flows. The common pattern is:
frontend action -> authenticated Next.js API -> Prisma/PostgreSQL write ->
optional Socket.IO signal -> frontend GETs latest authorized state.

### 1. Profile and Login

- Register: form -> validation -> bcrypt hash -> `User`.
- Credentials login: form -> NextAuth -> DB lookup -> bcrypt compare ->
  JWT session with `user.id`.
- OAuth: Google/42 -> NextAuth callback -> account check/link -> `Account`.
- Profile read: `/api/users/[id]` -> session check -> user/stats/friends.
- Profile update: edit form -> owner check -> validation -> `User` update.
- Online state: Socket.IO JWT from NextAuth session -> ws-server verifies ->
  status API -> `isOnline`, `lastSeen`.


### 2. Learning

- Level practice: level config -> mixed encode/decode questions -> answers ->
  `/api/learning/practice-result`.
- Pass rule: `correctCount >= passCount` -> `learningLevel + 1`,
  `practiceSessions + 1`.
- SRS correct: `mastery + 1`, larger `interval`, higher `easeFactor`,
  new `nextReviewAt`.
- SRS wrong: `mastery - 1`, `interval = 1 day`, lower `easeFactor`,
  new `nextReviewAt`.
- Review selection: seen chars -> due first -> low mastery -> low accuracy ->
  older `nextReviewAt` -> 20 questions.
- Review saving: raw answers -> server-side Morse check -> group by char ->
  counters per answer, SRS once per char.
- Progress display: aggregate `correctCount / totalSeen` -> accuracy card,
  weak chars, level board, per-letter bar chart.

### 3. Chat

- Friend request: search -> POST `/api/friends` -> `PENDING` -> accept/reject
  -> `ACCEPTED` or delete.
- Conversation load: `/api/conversations` + `/api/messages` -> membership
  check -> ordered history.
- Message transform: mode -> text/Morse helpers -> invalid Morse rejected.
- Message send: POST `/api/messages` -> membership check -> `Message` ->
  `chat:message:new`.
- Notifications: socket signal -> GET `/api/notifications` or messages -> DB
  truth.
- Chat game invite: friend/lobby/state checks -> `GameInvitation` +
  `SystemMessage` -> Socket.IO target notify.

### 4. Competition

- Overview: `RadioRoom` + lobby counts + online users -> live counts.
- Join lobby: POST radio -> session/capacity/state checks ->
  `RadioLobbyPresence` -> `radio:user-list-updated`.
- Ready: PATCH ready -> presence status + ready queue transaction ->
  `radio:ready-list-updated`.
- Start match: FIFO ready players -> session + player rows -> `PLAYING` ->
  clear queue -> `radio:game-created`.
- Session GET: participant check -> deterministic word list -> current user as
  `id: "me"`.
- Score correct: one attempt per sequence -> `correct + 1`, `total + 1`,
  answer-length points + speed bonus + streak.
- Score wrong: first clear mistake -> `total + 1`, streak reset, no score loss.
- Accuracy: `correct / total`; empty input and valid prefixes do not count.
- Live ranking: PATCH monotonic progress -> `RadioSessionPlayer` ->
  `game:session-updated` -> GET latest state.
- Finish/abandon: final PATCH -> completed/abandoned flags -> all done or one
  active left -> `FINISHED`, lobby back to `IDLE`.

## 🧮 Modules

### Confirmed Modules

| Module | Type | Points | Status | Justification | Implementation | Contributors |
| --- | --- | ---: | --- | --- | --- | --- |
| Use a framework for both the frontend and backend | Major | 2 | Confirmed | Build the application with a structured full-stack framework | Next.js is used for the React frontend and for backend Route Handlers/API routes | all |
| Implement real-time features using WebSockets or similar technology | Major | 2 | Confirmed | Provide real-time updates across connected clients | Socket.IO handles authenticated connections, online presence, chat delivery, game invitations, lobby updates, ready-state updates, game creation, and game-session refresh events | `mlaurent`, `gustgonz`, all |
| Allow users to interact with other users | Major | 2 | Confirmed | Provide the required social features: chat, profiles, and friends | Users can view profiles, manage friends, and send private chat messages persisted in PostgreSQL | all |
| Standard user management and authentication | Major | 2 | Confirmed | Support user accounts, profile editing, avatars, friends, and online status | NextAuth handles sessions; users can register, log in, edit profile data, upload an avatar, add friends, and see online state | `mlaurent`, `yren`, `lifan`, `gustgonz` |
| Implement a complete web-based game | Major | 2 | Confirmed | Add a playable multiplayer browser game with rules, scoring, and results | Radio sessions let at least two users join a Morse decoding match, play timed rounds, submit scores, and view rankings | all |
| Remote players | Major | 2 | Confirmed | Allow two players on separate clients to play the same game in real time | Independent authenticated users can join the same radio lobby, enter the same game session, receive Socket.IO update signals, submit scores, and see synchronized final results | all |
| Multiplayer game with more than two players | Major | 2 | Confirmed | Support three or more simultaneous players in one game | Radio rooms support multiple lobby users; the ready queue creates a shared session for all ready players up to room capacity; the concurrent-user test runs with 5 users by default | all |
| WAF and HashiCorp Vault | Major | 2 | Confirmed | Protect traffic and keep secrets outside the application code | ModSecurity with OWASP CRS filters production traffic; Vault initializes and injects database, authentication, and OAuth secrets | `gustgonz` |
| Use an ORM for the database | Minor | 1 | Confirmed | Keep database access typed and maintainable | Prisma models, migrations, seed data, and Prisma Client are used across the backend | `lifan` |
| Support multiple languages | Minor | 1 | Confirmed | Provide at least three interface languages | The app includes an i18n provider, language switcher, and English, French, and Chinese dictionaries | `yren` |
| Implement remote authentication with OAuth 2.0 | Minor | 1 | Confirmed | Allow users to connect through external identity providers | NextAuth supports Google OAuth and a custom 42 OAuth provider, with account linking | `yren` |
| Server-side rendering for improved performance and SEO | Minor | 1 | Confirmed | Render data-backed pages on the server where appropriate | Next.js App Router server components load data for learning, profile, competition, lobby, and game session pages | all |

**Implemented raw total: 20 points.**

### Candidate Evidence, Not Counted Conservatively

| Possible module | Evidence | Why not added to confirmed total |
| --- | --- | --- |
| Advanced analytics dashboard with data visualization | Learning dashboard: global accuracy, practice sessions, level progression board, weak-character detection, per-letter accuracy bar chart sorted from weakest to strongest | Strong visual analytics for learning, but not counted unless evaluators accept it as a full advanced analytics dashboard |

## 🙋 Individual Contributions

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

## 🚀 Instructions

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

## 🧪 Initial Test Data

The development initialization runs `prisma/seed.js`. It creates test data so
that the main user, learning, chat, and competition flows can be tested immediately.
These credentials are for local development only.

### Test Accounts

All seeded accounts use the password `MorseTest123!`. If the database already
contains seed data, running the seed again updates these known test accounts to
that password without deleting existing local data.

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

### Competition Test Set

The seed creates three radio rooms for competition testing:

| Radio | Name | Speed | Purpose |
| --- | --- | ---: | --- |
| `01` | `Radio Wave 01` | 5 WPM | Slower multiplayer decoding |
| `02` | `Radio Wave 02` | 10 WPM | Intermediate multiplayer decoding |
| `03` | `Radio Wave 03` | 15 WPM | Faster multiplayer decoding |

Game sessions use a deterministic shuffle of the following word bank. Each
session selects 12 words from this list based on the session id, so the order
can change between sessions but the valid answers are always from this set.

| Answer | Morse prompt |
| --- | --- |
| `HELLO` | `.... . .-.. .-.. ---` |
| `WORLD` | `.-- --- .-. .-.. -..` |
| `MORSE` | `-- --- .-. ... .` |
| `CODE` | `-.-. --- -.. .` |
| `RADIO` | `.-. .- -.. .. ---` |
| `SIGNAL` | `... .. --. -. .- .-..` |
| `READY` | `.-. . .- -.. -.--` |
| `WAVE` | `.-- .- ...- .` |
| `LEARN` | `.-.. . .- .-. -.` |
| `LISTEN` | `.-.. .. ... - . -.` |
| `DECODE` | `-.. . -.-. --- -.. .` |
| `MESSAGE` | `-- . ... ... .- --. .` |
| `FRIEND` | `..-. .-. .. . -. -..` |
| `QUICK` | `--.- ..- .. -.-. -.-` |
| `FOCUS` | `..-. --- -.-. ..- ...` |
| `TRANSMIT` | `- .-. .- -. ... -- .. -` |

### Test Scripts

The repository includes a concurrent-user regression test for the competition
flow:

```bash
cd Echo_of_Morse
make test
```

It creates independent temporary users, logs them in, opens real WebSocket
connections through the WAF, joins the same radio lobby, marks all users ready,
creates a game session, submits concurrent score updates, completes the
session, and checks that socket events were received.

To clear only transient radio test state:

```bash
make test-clean
```

Equivalent clean test sequence:

```bash
make clean test
```

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


## 📚 Resources

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
- reviewing selected code;
- suggesting debugging steps and test cases for chat and game invitations;
- generating and refining the concurrent-user regression test script;
- drafting, restructuring, and improving README and technical documentation;
- improving English and French technical documentation;

All AI-assisted output was read, adapted, and tested by team members before
being included. AI was not treated as a substitute for understanding,
implementation ownership, or manual verification.
