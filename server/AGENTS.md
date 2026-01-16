# SERVER/ KNOWLEDGE BASE

**Generated:** 2026-01-17
**Framework:** Nuxt 4.2.2 (H3 server)
**Type:** Server-side utilities and API routes

## OVERVIEW
Server-side code with Prisma singleton, API routes, and utilities using H3 runtime.

## STRUCTURE
```
server/
├── api/              # API route handlers (empty, to be implemented)
│   └── *.get.ts      # GET endpoints (e.g., words.get.ts)
├── middleware/       # Server middleware (to be added)
└── utils/
    └── db.ts         # Prisma Client singleton with Pg pool adapter
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| DB Access | `utils/db.ts` | Singleton with PostgreSQL pool + hot reload support |
| API Routes | `api/*.get.ts` | H3 handlers (Nuxt auto-imports prisma from utils/db.ts) |
| Server Utils | `utils/*.ts` | Shared server functions (currently only db.ts) |

## CONVENTIONS
**Prisma Singleton:**
- Export `prisma` from `utils/db.ts` (auto-imported server-wide)
- Production: Single instance per server lifecycle
- Development: Persist to `globalThis` for hot reload compatibility
- Use PostgreSQL pool adapter (`@prisma/adapter-pg`) instead of direct connection

**API Route Structure:**
- File-based routing: `api/words.get.ts` → `GET /api/words`
- H3 handler signature: `export default defineEventHandler((event) => {...})`
- Use `prisma` directly (no imports needed, auto-imported from utils/db.ts)

**Auto-Import Mechanism:**
- All `utils/*.ts` exports are auto-imported server-wide
- No manual imports needed: `prisma` available in all API routes
- Path alias `@/server/*` maps to server/ directory

## ANTI-PATTERNS
- **NEVER** create new PrismaClient instances in API routes (use singleton)
- **NEVER** import PrismaClient directly (use exported `prisma` from utils/db.ts)
- **NEVER** use `.env` values in API routes (read via `process.env` or `useRuntimeConfig`)
- **NEVER** skip validation in API routes (use zod or similar for request body validation)
- **DO NOT** mix client and server code in utils/ (server/ is server-side only)
