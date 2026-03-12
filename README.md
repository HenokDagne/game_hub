# GameHub

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![OAuth 2.0](https://img.shields.io/badge/OAuth_2.0-2F2F2F?style=for-the-badge&logo=oauth&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

GameHub is a full-stack game discovery platform built with Next.js App Router, Prisma, PostgreSQL, and NextAuth. It lets users browse games, manage favorites, access a personalized dashboard, and use role-based admin tools for analytics, moderation, and user management.

## Overview

GameHub combines a public game catalog with authenticated user features and an admin control surface. The app uses the FreeToGame API for catalog data, Prisma for persistence, and NextAuth for credentials and optional Google sign-in.

### Highlights

- Game discovery with search, filtering, pagination, and detail pages
- Favorite management backed by PostgreSQL
- Credentials authentication with optional Google OAuth
- User dashboard with profile and library-focused sections
- Admin dashboard with analytics, user management, content management, and moderation areas
- Role-based route protection for user-only and admin-only pages
- Zod validation and cached upstream API requests

## Screenshots

### Home

![GameHub home page](https://raw.githubusercontent.com/HenokDagne/game_hub/main/public/images/gamehub.png)

### Games Catalog

![GameHub games catalog](https://raw.githubusercontent.com/HenokDagne/game_hub/main/public/images/gamecard.png)

### Game Details

![GameHub game details page](https://raw.githubusercontent.com/HenokDagne/game_hub/main/public/images/cardDetail.png)

### Favorites

![GameHub favorites page](https://raw.githubusercontent.com/HenokDagne/game_hub/main/public/images/favorite.png)

### Admin Dashboard

![GameHub admin dashboard](https://raw.githubusercontent.com/HenokDagne/game_hub/main/public/images/adminpage.png)

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth
- Zod
- Vitest
- Tailwind CSS

## Core Features

### User Experience

- Landing page with featured gaming presentation
- Browse games by genre, platform, and search terms
- Detailed game pages with related recommendations
- Add and remove favorites from authenticated accounts
- Dashboard areas for profile, activity, library, notifications, billing, and wishlist

### Authentication and Access Control

- Credentials login with bcrypt-hashed passwords
- Optional Google OAuth sign-in
- Protected routes for dashboard, favorites, and admin features
- Admin-only role handling for platform management views

### Admin Capabilities

- User management with edit, role change, suspend, reactivate, and delete actions
- Analytics dashboards and reporting widgets
- Content and moderation sections
- Orders and payment management area

## Project Structure

```text
app/                  App Router pages and API routes
components/           Reusable UI and feature modules
lib/                  Auth, Prisma, cache, API, and server utilities
prisma/               Schema, migrations, and seed script
public/images/        README and UI screenshots/assets
tests/                Vitest test files
types/                Shared TypeScript types
```

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/game_hub?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/game_hub?schema=public"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FREETOGAME_BASE_URL="https://www.freetogame.com/api"
```

Notes:

- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are optional unless Google sign-in is enabled.
- `FREETOGAME_BASE_URL` can remain at the default shown above.
- `DIRECT_URL` is used for Prisma migrations when needed.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Generate Prisma client

```bash
npm run prisma:generate
```

### 3. Run database migrations

```bash
npm run prisma:migrate -- --name init
```

### 4. Seed initial data

```bash
npm run prisma:seed
```

### 5. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Admin Provisioning

Do not expose admin registration in the public UI. Create or promote admin users through server-side tooling only.

Create or update an admin account through the seed command:

```bash
ADMIN_NAME="biruk" \
ADMIN_EMAIL="biruk19@gmail.com" \
ADMIN_PASSWORD="pass3685" \
npm run prisma:seed
```

What this does:

- Creates the admin user if it does not already exist
- Promotes the matching user to `ADMIN`
- Replaces the stored password with the supplied admin password

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## API Examples

### Games

```bash
curl "http://localhost:3000/api/games?search=warframe&page=1&page_size=20"
curl "http://localhost:3000/api/games?genre=shooter&platform=pc&sort_by=release-date"
```

### Favorites

```bash
curl "http://localhost:3000/api/favorites" \
	-H "Cookie: next-auth.session-token=..."

curl -X POST "http://localhost:3000/api/favorites" \
	-H "Content-Type: application/json" \
	-H "Cookie: next-auth.session-token=..." \
	-d '{"gameId":"3498","title":"Grand Theft Auto V","image":"https://..."}'
```

## Quality Checks

```bash
npm run lint
npm run test
npm run build
```

## Repository Notes

- This repository is structured for local PostgreSQL development.
- Prisma migrations are committed in the repo.
- The README screenshots are stored in `public/images` so they render directly on GitHub.

## License

This project is provided for educational and portfolio use unless you define a separate license for distribution.
