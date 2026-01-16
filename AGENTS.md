# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-17
**Framework:** Nuxt 4.2.2 (Vue 3.5.26)
**Type:** English vocabulary management system (development phase)

## OVERVIEW
Nuxt 4 + Prisma 7 English word learning app with PostgreSQL backend. Schema complete, infrastructure ready, UI/api pending implementation.

## STRUCTURE
```
./
├── app/                    # Nuxt 4 app dir (currently placeholder)
├── server/                 # Server-side code + Prisma singleton
├── prisma/                 # Database schema + seed/reset scripts
├── words/                  # CSV vocabulary data
├── public/                 # Static assets
└── *.config files          # Nuxt, ESLint, TypeScript, Prisma configs
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| DB Schema | `prisma/schema.prisma` | 10 models for vocabulary management |
| Prisma Client | `server/utils/db.ts` | Singleton with Pg adapter (auto-imported) |
| App Root | `app/app.vue` | Currently NuxtWelcome placeholder |
| Seed Data | `prisma/seed.ts` | CSV importer for words/新概念英语第一册.csv |
| Nuxt Config | `nuxt.config.ts` | Custom aliases: @/, @@/, @/prisma, @/server |
| DB Connection | `.env` | DATABASE_URL (gitignored) |
| Type Definitions | `app/generated/prisma/` | Auto-generated, gitignored |

## CONVENTIONS
**Path Aliases:**
- `@/` → `app/` (Nuxt 4 app directory)
- `@@/` → Root directory
- `@/prisma` → `app/generated/prisma` (Prisma Client)
- `@/server/*` → `server/*`

**Database:**
- Prisma Client output: `app/generated/prisma/` (not `node_modules/.prisma/client`)
- Connection pooling: Explicit `@prisma/adapter-pg` + `Pool` in server/utils/db.ts
- Seed runner: `tsx prisma/seed.ts` (not compiled JS)
- Migrations: `pnpm prisma:migrate` (creates files) OR `pnpm prisma:push` (dev, no files)

**Nuxt 4 Specifics:**
- App directory: `app/` (not root `pages/` like Nuxt 3)
- Pages route: `app/pages/` (empty, needs index.vue)
- Components: `app/components/` (auto-imported, doesn't exist yet)
- Composables: `app/composables/` (auto-imported, doesn't exist yet)
- API routes: `server/api/` (empty, no endpoints yet)

**Package Manager:** pnpm only (pnpm-workspace.yaml with onlyBuiltDependencies whitelist)

## ANTI-PATTERNS (THIS PROJECT)
- **NEVER** add `node_modules`, `.nuxt`, `app/generated/prisma` to git (already gitignored)
- **NEVER** use `any` type in Prisma operations (fix needed in prisma/seed.ts:40, 266)
- **NEVER** duplicate database clearing logic (exists in both seed.ts and reset.ts)
- **NEVER** hardcode database credentials (use .env, already properly gitignored)
- **NEVER** create multiple PrismaClient instances (use singleton from server/utils/db.ts)
- **DO NOT** commit .env file (already in .gitignore)
- **DO NOT** create files in root `pages/` (Nuxt 3 pattern - use `app/pages/` instead)
- **AVOID** TypeScript errors (strict mode + typeCheck enabled in nuxt.config.ts)

## UNIQUE STYLES
- **Prisma Client location:** Custom output to `app/generated/prisma/` for better Nuxt auto-import integration
- **Connection pooling:** Explicit PostgreSQL pool adapter setup (unusual for simple apps, good for production scaling)
- **Seed script:** Uses `tsx` to run TypeScript directly without compilation
- **Data import:** CSV parser in seed.ts with JSON-encoded phonetic/sentence fields
- **Reset script:** Dedicated `prisma/reset.ts` (unconventional, useful for dev)

## COMMANDS
```bash
# Development
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Build for production
pnpm preview          # Preview production build

# Database
pnpm prisma:generate  # Generate Prisma Client
pnpm prisma:push      # Sync schema to database (no migration file)
pnpm prisma:migrate   # Create migration + apply
pnpm prisma:studio    # Open Prisma Studio GUI
pnpm prisma:seed      # Import CSV from words/新概念英语第一册.csv
pnpm prisma:reset     # Clear all tables via reset.ts

# Code Quality
pnpm lint             # ESLint check
pnpm lint:fix         # Auto-fix ESLint issues
```

## NOTES
- **Missing directories:** app/pages/, app/components/, app/composables/, server/api/ are all empty or missing
- **First step:** Create `app/pages/index.vue` to establish routing
- **Replace NuxtWelcome:** Change `app/app.vue` from `<NuxtWelcome />` to `<NuxtPage />` after creating pages
- **CSV data format:** Phonetic and sentence fields are JSON-encoded in CSV (see seed.ts for parsing logic)
- **Type debt:** Fix `any` types in prisma/seed.ts and prisma/reset.ts (lines 266, 40)
- **Code duplication:** Extract identical database clearing logic to shared utility (exists in both seed.ts:271-280 and reset.ts:13-22)
- **Prisma generation:** Required after cloning (app/generated/prisma is gitignored): `pnpm prisma:generate`
- **Database sync:** Use `prisma:push` for development, `prisma:migrate` for production
- **TypeScript strict:** Both `strict: true` AND `typeCheck: true` enabled (slower builds, max type safety)
