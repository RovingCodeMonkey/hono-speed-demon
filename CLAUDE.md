# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Run with hot-reload (tsx watch)
npm run build        # Bundle + minify with esbuild → dist/index.js
npm run start        # Run production build

npm run db:generate  # Generate migrations from schema changes
npm run db:push      # Apply migrations to the database
```

## Architecture

This is a lightweight Hono API server backed by SQLite via Drizzle ORM, targeting deployment on AWS Lightsail behind CloudFront.

**Request flow:** `src/index.ts` (Hono app + routes) → `src/db/index.ts` (singleton `db` instance) → `src/db/schema.ts` (table definitions)

**Key decisions:**
- SQLite in WAL mode (`sqlite.pragma('journal_mode = WAL')`) for concurrent read performance
- Drizzle ORM for type-safe queries — define tables in `src/db/schema.ts`, then run `db:generate` + `db:push`
- `esbuild` bundles everything for production; `tsx` runs TypeScript directly in dev
- `@hono/node-server` is the Node.js adapter; `@hono/node-ws` is available for WebSockets
- TypeScript is configured with `"module": "preserve"` + `"moduleResolution": "bundler"` — extensionless imports (`./schema`) are fine

**Deployment:** Manual GitHub Actions workflow (`deploy.yml`) — builds, rsyncs to Lightsail (excluding `node_modules`, `src/`, `.db` files), runs `drizzle-kit push`, then reloads via PM2 and invalidates CloudFront cache.
