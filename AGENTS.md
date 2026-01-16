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

## TDD (测试驱动开发) WORKFLOW

**开发模式**: 本项目采用 TDD (Test-Driven Development) 开发模式

### TDD 核心流程

```
RED → GREEN → REFACTOR
```

1. **RED**: 先编写失败的测试
2. **GREEN**: 编写最小代码使测试通过
3. **REFACTOR**: 重构代码，保持测试通过

### 开发步骤

```bash
# 1. 编写测试（文件名: xxx.test.ts 或 xxx.spec.ts）
# 2. 运行测试（预期失败）
pnpm test

# 3. 编写实现代码使测试通过
pnpm test

# 4. 重构代码，保持测试通过
pnpm test

# 5. 提交代码（包含测试和实现）
git add .
git commit -m "feat: add feature description"
```

### 测试文件组织

```
./
├── app/
│   ├── __tests__/              # App 测试目录
│   │   ├── components/         # 组件测试
│   │   │   └── WordCard.spec.ts
│   │   ├── pages/              # 页面测试
│   │   │   └── index.spec.ts
│   │   └── composables/        # Composables 测试
│   │       └── useWords.spec.ts
│   ├── components/
│   │   └── WordCard.vue
│   ├── pages/
│   │   └── index.vue
│   └── composables/
│       └── useWords.ts
└── server/
    ├── __tests__/              # Server 测试目录
    │   ├── api/                # API 测试
    │   │   ├── words.get.test.ts
    │   │   └── words.post.test.ts
    │   └── utils/              # 工具函数测试
    │       └── db.test.ts
    ├── api/
    │   ├── words.get.ts
    │   └── words.post.ts
    └── utils/
        └── db.ts
```

### 测试命令

```bash
# 运行所有测试
pnpm test

# 运行测试并监听变化（开发模式）
pnpm test:watch

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 运行特定测试文件
pnpm test server/api/words.get.test.ts

# 运行特定测试模式
pnpm test --grep "should create word"

# 显示测试详细输出
pnpm test --reporter=verbose
```

### TDD 约定

**测试命名规范:**
- 测试文件: `xxx.test.ts` 或 `xxx.spec.ts`
- 测试位置: 与被测文件同级或 `__tests__` 目录下
- 测试描述: 使用 `it('should do something')` 或 `test('should do something')`

**测试组织结构:**
```typescript
// ✅ 推荐：清晰的描述性测试
describe('Word API', () => {
  describe('POST /api/words', () => {
    it('should create a new word successfully', async () => { /* ... */ })
    it('should return 400 for invalid word data', async () => { /* ... */ })
    it('should handle duplicate word error', async () => { /* ... */ })
  })

  describe('GET /api/words', () => {
    it('should return paginated word list', async () => { /* ... */ })
    it('should filter words by difficulty', async () => { /* ... */ })
  })
})
```

**测试覆盖范围:**
- ✅ API 端点: 必须测试所有成功和失败场景
- ✅ 组件: 测试用户交互、props、emits
- ✅ Composables: 测试逻辑、边界条件
- ✅ 工具函数: 测试所有分支和边界值
- ✅ 数据库操作: 测试 CRUD、事务、错误处理

### 测试技术栈（推荐）

| 层级 | 框架 | 用途 |
|------|------|------|
| 测试运行器 | Vitest | 单元测试、集成测试 |
| Vue 组件测试 | @vue/test-utils | 组件渲染、交互 |
| API 测试 | H3 测试工具 | API 端点测试 |
| 数据库测试 | Prisma + Test Database | 数据库操作测试 |
| E2E 测试 | Playwright | 端到端测试 |

### TDD 最佳实践

1. **小步前进**: 每次只实现一个功能，保持测试粒度
2. **独立测试**: 测试之间不应有依赖，可独立运行
3. **测试隔离**: 使用 mock/stub 避免真实数据库/网络调用
4. **快照测试**: 对 UI 组件使用快照测试，但注意审查变化
5. **边界测试**: 测试最小值、最大值、空值、null/undefined
6. **错误处理**: 每个错误场景都应该有对应的测试
7. **测试即文档**: 测试名称应该清晰描述期望行为

### 数据库测试约定

```typescript
// ✅ 推荐：使用测试数据库隔离
import { describe, beforeEach, afterEach, it } from 'vitest'
import { prisma } from '@/server/utils/db'

describe('Word API', () => {
  beforeEach(async () => {
    // 清空测试数据或使用事务回滚
    await prisma.word.deleteMany()
  })

  afterEach(async () => {
    // 清理测试数据
    await prisma.word.deleteMany()
  })

  it('should create word', async () => {
    // 测试逻辑
  })
})
```

### ANTI-PATTERNS (THIS PROJECT)
- **NEVER** add `node_modules`, `.nuxt`, `app/generated/prisma` to git (already gitignored)
- **NEVER** use `any` type in Prisma operations (fix needed in prisma/seed.ts:40, 266)
- **NEVER** duplicate database clearing logic (exists in both seed.ts and reset.ts)
- **NEVER** hardcode database credentials (use .env, already properly gitignored)
- **NEVER** create multiple PrismaClient instances (use singleton from server/utils/db.ts)
- **DO NOT** commit .env file (already in .gitignore)
- **DO NOT** create files in root `pages/` (Nuxt 3 pattern - use `app/pages/` instead)
- **AVOID** TypeScript errors (strict mode + typeCheck enabled in nuxt.config.ts)
- **NEVER** write production code before tests (TDD violation)
- **NEVER** skip failing tests (fix or mark as expected)
- **NEVER** test implementation details (test behavior, not internals)
- **NEVER** write tests that depend on execution order
- **NEVER** use production database for tests (use test database or mocks)

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

# Testing (TDD Workflow)
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode (development)
pnpm test:coverage    # Run tests with coverage report
pnpm test:ui          # Run tests with UI interface

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
