# PRISMA DATABASE LAYER

## OVERVIEW
Database schema, seed script, and migration utilities for the English vocabulary learning system.

## STRUCTURE
```
prisma/
├── schema.prisma          # 10 models for vocabulary management
├── seed.ts                # CSV importer with JSON parsing logic
└── reset.ts               # Database clearing utility
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Schema Models | `schema.prisma` | User, Word, Definition, ExampleSentence, UserWord, etc. |
| CSV Import | `seed.ts` | Parses words/新概念英语第一册.csv with JSON-encoded fields |
| Database Reset | `reset.ts` | Clears all tables via deleteMany |

## CONVENTIONS
**Schema Models:**
- 10 models across 3 categories: User, Word Management, User Learning
- Cascading deletes on all foreign keys (onDelete: Cascade)
- Indexed fields: word, difficulty, userId, wordId, nextReviewAt
- Unique constraints: User.email, Word.word, UserWord(userId, wordId)

**CSV Data Format:**
- `phonetic`: JSON object `{uk: "...", us: "..."}`
- `sentence`: JSON array `[{cn_sentence: "...", origin_sentence: "..."}]`
- `translation`: Semicolon-separated, with POS prefix (e.g., "v.原谅；n.借口")
- Escaped double quotes in CSV fields

**Seeding Process:**
- Runner: `tsx prisma/seed.ts` (direct TypeScript execution)
- Data source: `words/新概念英语第一册.csv`
- Auto-creates system user and WordList
- Parses multi-part definitions and multiple example sentences per word

**Migration Strategy:**
- Development: `pnpm prisma:push` (no migration files)
- Production: `pnpm prisma:migrate` (versioned migrations)

**Connection Pattern:**
- Uses `@prisma/adapter-pg` + explicit `Pool` instance (seed.ts, reset.ts)
- Same pattern as singleton in server/utils/db.ts

## ANTI-PATTERNS
- **NEVER** use `any` type for Prisma operations (fix needed in seed.ts:266, reset.ts:40)
- **DO NOT** commit `prisma/migrations/` until production-ready (use push for dev)
- **NEVER** manually edit migration files after creation
- **DO NOT** run seed script on production (use proper seed management)
- **AVOID** duplicate database clearing logic (exists in both seed.ts:271-280 and reset.ts:13-22)
