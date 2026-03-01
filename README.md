# GameHub

GameHub is a Next.js App Router app for discovering games via FreeToGame, authenticating users with NextAuth, and saving favorites with Prisma + PostgreSQL.

## Features

- FreeToGame proxy API: `GET /api/games` with search, pagination, category/genre, platform, sort, year
- Auth: NextAuth credentials login + optional Google OAuth
- RBAC: protected `/favorites`, `/dashboard`, `/admin`
- Favorites API: `GET/POST /api/favorites`, `DELETE /api/favorites/:gameId`
- Core pages: home, games list, game detail, favorites, login, register, dashboard, admin
- Validation with Zod, in-memory caching for FreeToGame responses
- Vitest sample test + GitHub Actions CI (lint/test/build)

## Environment Variables

Create `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/game_hub"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FREETOGAME_BASE_URL="https://www.freetogame.com/api"
```

FreeToGame does not require authentication. Google vars are optional.

## Setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

## Test and Build

```bash
npm run lint
npm run test
npm run build
```

## API Examples

```bash
curl "http://localhost:3000/api/games?search=warframe&page=1&page_size=20"
curl "http://localhost:3000/api/games?genre=shooter&platform=pc&sort_by=release-date"
```

Authenticated favorites examples:

```bash
curl "http://localhost:3000/api/favorites" -H "Cookie: next-auth.session-token=..."
curl -X POST "http://localhost:3000/api/favorites" \
	-H "Content-Type: application/json" \
	-H "Cookie: next-auth.session-token=..." \
	-d '{"gameId":"3498","title":"Grand Theft Auto V","image":"https://..."}'
```
