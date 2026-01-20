# AI 代理开发指南

**项目**: 英语单词学习系统 (Nuxt 4 + Prisma 7)
**框架**: Nuxt 4.2.2 (Vue 3.5.26) | TypeScript 严格模式
**开发模式**: TDD (测试驱动开发)

## 核心命令

### 开发命令

```bash
pnpm dev              # 启动开发服务器 (http://localhost:3000)
pnpm build            # 生产构建
pnpm preview          # 预览生产构建
```

### 测试命令 (TDD 核心)

```bash
pnpm test                                     # 运行所有测试
pnpm test:watch                               # 监听模式 (开发时持续运行)
pnpm test:coverage                            # 覆盖率报告
pnpm test:ui                                  # 测试 UI 界面
pnpm test test/unit/api/books.test.ts         # 运行单个测试文件
pnpm test --grep "should return paginated"    # 运行匹配模式的测试
pnpm test --project unit                      # 仅运行 unit 测试
pnpm test --project nuxt                      # 仅运行 nuxt 测试
pnpm test:e2e                                 # E2E 测试
```

### 数据库命令

```bash
# 环境切换脚本 (推荐用于测试环境）
tsx ./scripts/prisma.ts push                    # 同步到开发数据库 (默认)
tsx ./scripts/prisma.ts push --env=test         # 同步到测试数据库
tsx ./scripts/prisma.ts studio --env=test        # 打开测试数据库 Studio
tsx ./scripts/prisma.ts reset --env=test         # 重置测试数据库
tsx ./scripts/prisma.ts seed --env=test         # 导入数据到测试数据库
tsx ./scripts/prisma.ts generate                # 生成 Prisma Client
tsx ./scripts/prisma.ts migrate dev             # 创建迁移 (默认: dev)
```

**环境说明**：

- `.env` → 开发数据库 `english` (NUXT_DATABASE_URL)
- `.env.test` → 测试数据库 `english_test` (NUXT_DATABASE_URL)
- 测试环境数据不会被 `beforeEach` 清除到开发数据库

### 代码质量

```bash
pnpm lint             # ESLint 检查
pnpm lint:fix         # 自动修复 ESLint 问题
```

## 代码风格指南

### 文件结构与命名

- **路由页面**: `app/pages/index.vue` (Nuxt 4 使用 `app/`)
- **布局文件**: `app/layouts/` (PascalCase: `default.vue`, `admin.vue`)
- **组件**: `app/components/` (PascalCase: `WordCard.vue`)
  - **工作区组件**: `app/components/workspace/` (前缀 `Ws`: `WsHeader.vue`, `WsSidebar.vue`, `WsFooter.vue`)
- **Composables**: `app/composables/` (camelCase 前缀 `use`: `useBook.ts`, `useWords.ts`, `useWorkspace.ts`)
- **API 路由**: `server/api/` (RESTful: `words.get.ts`, `words.post.ts`)
- **测试文件**: 统一放在 `test/` 目录，按测试类型组织：
  - `test/unit/` - 单元测试（API handlers、工具函数）
    - `test/unit/api/` - API 路由测试
    - `test/unit/utils/` - 测试工具函数（reset-db, create-mock-event, define-page-builder）
  - `test/nuxt/` - Nuxt runtime 测试（Composables、组件）
  - `test/integration/` - 集成测试（外部服务真实调用）
  - `test/e2e/` - E2E 测试
  - `test/vitest.setup.ts` - 测试环境配置（环境变量、mock、全局 polyfill）

### 导入规范

#### AutoImport 方案 (Nuxt 4)

项目采用 Nuxt 4 AutoImport 方案，优先使用自动导入：

```typescript
// ✅ Vue SFC (.vue 文件) - 自动导入
<script setup lang="ts">
const count = ref(1)
const double = computed(() => count.value * 2)
const route = useRoute()
const router = useRouter()
</script>

// ✅ Composables 文件 - 自动导入
// app/composables/useWorkspace.ts
export const useWorkspace = () => {
  const isCollapsed = ref(false)
  return { isCollapsed }
}

// ✅ 路径别名导入（非自动导入的内容）
// - 源码文件中使用
import { prisma } from '@/server/utils/db'
import type { Word } from '@prisma/client'
import WsHeader from '@/components/workspace/WsHeader.vue'

// - 测试文件中使用
//   • unit 测试（test/unit/）使用 `@/` 导入 server 代码
//   • nuxt 测试（test/nuxt/）使用 `~/` 导入 app 代码
import { prisma } from '../../../server/utils/db'           // test/unit/
import { useBook } from '~/composables/useBook'        // test/nuxt/
import { createMockEvent } from '../../utils/createMockEvent'  // test/unit/

// ❌ 避免相对路径
import { prisma } from '../../../server/utils/db'

// ❌ 严禁显式导入 Vue API（已自动导入）
// import { ref, computed } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
```

**路径别名**:

- `@/` → `app/` (app 源码)
- `@@/` → 根目录 (已弃用，不要使用)
- `~/` → `app/` (Nuxt 测试环境推荐)
- `@/server` → `server/`

**测试文件路径别名使用**:

- `test/unit/` - 使用相对路径导入 server 代码（如 `../../../server/utils/db`）
- `test/unit/utils/` - 测试工具函数目录，包含 `reset-db.ts`、`create-mock-event.ts`、`define-page-builder.test.ts`
- `test/nuxt/` - 使用 `~/` 导入 app 代码（composables、组件）
- `test/integration/` - 集成测试，使用真实外部服务调用
- `test/e2e/` - E2E 测试暂时跳过（`describe.skip`），等待 @nuxt/test-utils E2E 支持完善

**自动导入列表**：

- Vue APIs: `ref`, `computed`, `watch`, `reactive`, `onMounted`, etc.
- Vue Router: `useRoute`, `useRouter`, `navigateTo`
- Nuxt Composables: `useFetch`, `useState`, `useRuntimeConfig`, etc.
- 自定义 Composables: `app/composables/` 下的所有函数自动导入

### TypeScript 类型

```typescript
// ✅ 严格类型，避免 any
const wordId: number = 1
interface WordData { word: string; difficulty: number }
// ❌ 严禁 any
const data: any = { /* ... */ }
```

### Vue 组件风格

```vue
<script setup lang="ts">
interface Props { word: Word }
const props = defineProps<Props>()
const emit = defineEmits<{ select: [wordId: number] }>()
</script>
```

### 布局与工作区

项目使用 TDesign Layout 组件构建工作区布局（Header + Sidebar + Content + Footer）：

- **布局文件**: `app/layouts/default.vue` - 使用 `<NuxtLayout>` 包裹页面
- **Header**: `WsHeader.vue` - Logo + 项目标题
- **Sidebar**: `WsSidebar.vue` - TDesign Menu 组件，支持折叠/展开
- **Footer**: `WsFooter.vue` - 版本信息和版权
- **状态管理**: `useWorkspace.ts` composable 管理侧边栏折叠状态
- **样式**: 结合 TDesign 组件和 UnoCSS 原子类

### CSS Reset

项目使用 UnoCSS 提供的 CSS Reset 方案（tailwind-compat）：

- **包**: `@unocss/reset`
- **引入位置**: `app/app.vue` - 顶部的 `<script setup>` 中
- **Reset 类型**: `tailwind-compat` - 兼容 TDesign 等UI框架
- **作用**: 移除浏览器默认样式，确保布局高度计算正确（无额外滚动条）

```typescript
// app/app.vue
<script setup lang="ts">
  import '@unocss/reset/tailwind-compat.css'
</script>
```

```vue
<!-- 使用布局 -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

### API 路由风格
```typescript
export default defineEventHandler(async (event) => {
  try {
    const words = await prisma.word.findMany()
    return words
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch words' })
  }
})
```

### 测试风格 (TDD)

#### 单元测试 (test/unit/)

```typescript
import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../../server/utils/db'
import { createMockEvent } from '../../utils/createMockEvent'

describe('Word API', () => {
  beforeEach(async () => { await prisma.word.deleteMany() })
  it('should create a new word successfully', async () => {
    const event = createMockEvent('http://localhost:3000/api/words', { word: 'test' })
    const handler = (await import('../../../server/api/words.post')).default
    const result = await handler(event)
    expect(result).toBeDefined()
  })
})
```

#### Nuxt Runtime 测试 (test/nuxt/)

```typescript
import { describe, expect, it } from 'vitest'
import { useBook } from '~/composables/useBook'

describe('useBook Composable', () => {
  it('should provide selectedBookId reactive state', () => {
    const { selectedBookId } = useBook()
    expect(selectedBookId.value).toBeNull()
  })
})
```

### 数据库操作

```typescript
// ✅ 使用单例 Prisma Client
import { prisma } from '@/server/utils/db'
// ✅ 事务处理
await prisma.$transaction(async (tx) => { /* ... */ })
// ❌ 严禁创建多个实例
const client1 = new PrismaClient()
```

### 环境变量访问

Server 代码中使用 `process.env.NUXT_DATABASE_URL`：

```typescript
// server/utils/db.ts - 模块级别单例
const connectionString = process.env.NUXT_DATABASE_URL

// server/api/xxx.ts - API Handler 中可使用 runtimeConfig
const config = useRuntimeConfig(event)
const db = new PrismaClient({ datasourceUrl: config.databaseUrl })
```

**注意**: 模块级别的单例（如 `server/utils/db.ts`）无法使用 `useRuntimeConfig()`，因为缺少 event 上下文，应直接使用 `process.env`。

## TDD 约定

1. RED → GREEN → REFACTOR 循环
2. 先写测试，再写实现
3. 测试必须独立运行，无执行顺序依赖
4. 测试名称清晰描述期望行为: `should return paginated books with default parameters`
5. 边界测试: 最小值、最大值、空值、null/undefined
6. 使用 beforeEach/afterEach 隔离测试数据

## 反模式 (禁止)

- ❌ 提交 `node_modules/`, `.nuxt/`
- ❌ 使用 `any` 类型
- ❌ 硬编码数据库凭证 (使用 .env)
- ❌ 创建多个 PrismaClient 实例
- ❌ 在根 `pages/` 创建文件 (使用 `app/pages/`)
- ❌ 先写代码再写测试 (违反 TDD)
- ❌ 在 app.vue 中直接渲染内容而不使用 `<NuxtLayout>` (应使用工作区布局)
- ❌ TDesign Table 组件缺少 `row-key` 属性
- ❌ 侧边栏 Menu 使用 `v-model:value` 绑定 computed 只读属性（应使用 `:value`）
- ❌ 显式导入 Vue API（`import { ref, computed } from 'vue'` 或 `import { useRoute } from 'vue-router'`，应使用 AutoImport）
- ❌ 在源码目录（`server/`、`app/`）下创建 `__tests__` 目录（所有测试必须放在 `test/` 目录）
- ❌ 在 unit 测试中使用路径别名（如 `@/server/...`，应使用相对路径 `../../../server/...`）
- ❌ 在 test/unit/utils/ 外创建测试工具函数（应统一放在 `test/unit/utils/` 目录）

## 项目独特风格

- **Prisma**: 使用标准 `@prisma/client` (从 node_modules 导入)
- **连接池**: 显式 PostgreSQL pool adapter (server/utils/db.ts)
- **Seed 脚本**: 使用 `tsx` 直接运行 TypeScript
- **数据导入**: CSV 中 phonetic/sentence 字段为 JSON 编码
- **测试配置**: 使用 `@nuxt/test-utils/config` 的 `defineVitestConfig`，支持 multi-project 结构
- **路径别名**: Unit 测试使用相对路径导入 server 代码，Nuxt 测试使用 `~/` 导入 app 代码
- **E2E 测试**: 暂时跳过（`describe.skip`），@nuxt/test-utils v3.x E2E 支持仍在完善中
- **环境分离**: 开发与测试环境完全隔离
  - `.env` → 开发数据库 (NUXT_DATABASE_URL)
  - `.env.test` → 测试数据库 (NUXT_DATABASE_URL)
  - `scripts/prisma.ts` 统一环境切换接口
  - Nuxt 4 自动加载 `.env`，遵循 NUXT\_ 前缀约定

## 关键文件位置

| 任务            | 位置                              |
| --------------- | --------------------------------- |
| 数据库架构      | `prisma/schema.prisma`            |
| Prisma 单例     | `server/utils/db.ts`              |
| Prisma 配置     | `prisma.config.ts`                |
| Prisma 环境脚本 | `scripts/prisma.ts`               |
| 开发环境变量    | `.env` (NUXT_DATABASE_URL)        |
| 测试环境变量    | `.env.test` (NUXT_DATABASE_URL)   |
| 应用入口        | `app/app.vue`                     |
| 布局文件        | `app/layouts/`                    |
| 工作区组件      | `app/components/workspace/`       |
| 工作区状态      | `app/composables/useWorkspace.ts` |
| 路由页面        | `app/pages/`                      |
| API 端点        | `server/api/`                     |
| 测试文件        | `test/` (unit/nuxt/e2e/integration 分类） |
| 测试设置        | `test/vitest.setup.ts`            |
| 测试工具函数    | `test/unit/utils/`                |
| 集成测试        | `test/integration/`               |
| 验证工具        | `server/utils/use-safe-validate.ts` |
| TTS 验证        | `server/utils/validate-tts.ts`    |

## 注意事项

- 首次克隆需运行:
  - `tsx ./scripts/prisma.ts generate` (生成 Prisma Client)
  - `tsx ./scripts/prisma.ts push` (同步开发数据库)
  - `tsx ./scripts/prisma.ts push --env=test` (同步测试数据库)
- 开发用 `tsx ./scripts/prisma.ts push`，生产用 `tsx ./scripts/prisma.ts migrate dev`
- TypeScript 严格模式已启用 (strict: true)
- 使用 TDD: 每次修改后运行测试

## app/ 应用目录详解

**用途**: 应用根目录 - 主应用组件和页面/组件

### 概述

Nuxt 4 应用目录，使用文件路由和自动导入。包含完整的页面、组件、布局和组合式函数。

### 目录结构

```
app/
├── app.vue                          # 根组件 (引入 CSS Reset + NuxtLayout)
├── pages/                           # 页面路由
│   ├── index.vue                    # 首页 (/)
│   ├── books/
│   │   ├── index.vue                # 单词书列表页 (/books)
│   │   └── [id]/index.vue           # 单词书详情页 (/books/:id)
├── layouts/                         # 布局
│   └── default.vue                  # 默认布局 (工作区 Header + Sidebar + Content + Footer)
├── components/                      # 组件
│   └── workspace/                   # 工作区组件
│       ├── WsHeader.vue             # Header 组件 (Logo + 项目标题)
│       ├── WsSidebar.vue            # Sidebar 组件 (TDesign Menu)
│       └── WsFooter.vue             # Footer 组件 (版本信息和版权)
└── composables/                     # 组合式函数 (自动导入)
    ├── useBook.ts                   # 单词书相关逻辑
    ├── useWord.ts                   # 单词相关逻辑
    ├── usePage.ts                   # 分页相关逻辑
    └── useWorkspace.ts             # 工作区状态 (侧边栏折叠等)
```

### 快速定位

| 任务       | 位置                         | 说明                        |
| ---------- | ---------------------------- | --------------------------- |
| 根组件     | `app.vue`                    | CSS Reset + NuxtLayout      |
| 首页       | `pages/index.vue`            | 应用首页                    |
| 单词书列表 | `pages/books/index.vue`      | 单词书列表页                |
| 单词书详情 | `pages/books/[id]/index.vue` | 单词书详情页                |
| 布局       | `layouts/default.vue`        | 默认工作区布局              |
| 工作区组件 | `components/workspace/`      | Header, Sidebar, Footer 组件 |
| 组合式函数 | `composables/`               | useBook, useWord, usePage, useWorkspace |

### 约定规范

#### 文件路由

- `pages/index.vue` → `/` 路由
- `pages/about.vue` → `/about` 路由
- `pages/blog/[slug].vue` → `/blog/:slug` 动态路由

#### 根组件 (app.vue)

- 应用根组件 (不是页面)
- 使用 `<NuxtPage />` 渲染页面 (而非 `<NuxtWelcome />`)
- 使用 `<NuxtLayout />` 应用布局 (创建布局后)

#### 组件 (components/)

- 自动导入，无需显式引入
- PascalCase 命名: `WordCard.vue`, `SearchBar.vue`
- `components/base/` → 基础组件
- `components/features/` → 功能组件

#### 组合式函数 (composables/)

- 自动导入，无需显式引入
- camelCase 命名 + `use` 前缀: `useWords.ts`, `useAuth.ts`
- 返回响应式数据和方法
- 可在组件和页面中复用

#### 页面 (pages/)

- Nuxt 4 使用 `app/pages/` 而非根 `pages/`
- 文件名即路由路径
- 支持嵌套路由、动态路由、中间件

## server/ 服务器端详解

**用途**: 服务器端工具和 API 路由 (H3 运行时)

### 概述

服务器端代码，包含 Prisma 单例、API 路由和工具函数。

### 目录结构

```
server/
├── api/              # API 路由处理器
│   ├── books.get.ts                  # GET /api/books - 获取单词书列表
│   ├── books/[id].get.ts             # GET /api/books/:id - 获取单个单词书
│   ├── books/[id]/words.get.ts       # GET /api/books/:id/words - 获取单词书单词列表
│   └── tts/words/[id].get.ts         # GET /api/tts/words/:id - 获取单词发音
├── middleware/                       # 服务器中间件 (待添加)
└── utils/
    ├── db.ts                         # Prisma Client 单例 + PostgreSQL 连接池
    ├── use-safe-validate.ts          # Zod 验证工具 (useSafeBody/Query/Params)
    ├── validate-tts.ts               # TTS API 参数验证 Schema
    └── define-page-builder.ts        # 页面构建器工具函数
```

### 快速定位

| 任务       | 位置                              | 说明                        |
| ---------- | --------------------------------- | --------------------------- |
| 数据库访问 | `utils/db.ts`                     | 单例 + 连接池 + 热重载支持  |
| 单词书 API | `api/books.get.ts`                | 获取单词书列表（分页）      |
| 单词 API   | `api/books/[id]/words.get.ts`     | 获取单词书单词列表（分页）  |
| TTS API    | `api/tts/words/[id].get.ts`       | 获取单词发音音频            |
| 服务器工具 | `utils/*.ts`                      | 共享服务器函数              |
| 验证工具   | `utils/use-safe-validate.ts`      | Zod 验证工具                |
| TTS 验证   | `utils/validate-tts.ts`           | TTS 参数验证 Schema         |

### 约定规范

#### Prisma 单例模式

- 从 `utils/db.ts` 导出 `prisma` (服务器全局自动导入)
- 生产环境: 每个服务器生命周期单例
- 开发环境: 持久化到 `globalThis` 支持热重载
- 使用 PostgreSQL 连接池 (`@prisma/adapter-pg`) 而非直接连接

#### API 路由结构

- 文件路由: `api/words.get.ts` → `GET /api/words`
- H3 处理器签名: `export default defineEventHandler((event) => {...})`
- 直接使用 `prisma` (无需导入，从 utils/db.ts 自动导入)

#### 自动导入机制

- 所有 `utils/*.ts` 导出内容自动服务器级导入
- 无需手动导入: `prisma` 在所有 API 路由中可用
- 路径别名 `@/server/*` 映射到 server/ 目录

#### 错误处理

```typescript
export default defineEventHandler(async (event) => {
  try {
    const words = await prisma.word.findMany()
    return words
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch words'
    })
  }
})
```

### 反模式 (禁止行为)

- ❌ 在 API 路由中创建新的 PrismaClient 实例 (使用单例)
- ❌ 直接导入 PrismaClient (使用 utils/db.ts 导出的 `prisma`)
- ❌ 在 API 路由中使用 `.env` 值 (通过 `process.env` 或 `useRuntimeConfig` 读取)
- ❌ 跳过 API 路由中的验证 (使用 zod 等验证请求体)
- ❌ 在 utils/ 中混合客户端和服务器代码 (server/ 仅限服务器端)

## Prisma 数据库层详解

**用途**: 数据库架构、种子脚本和迁移工具

### 概述

英语单词学习系统的数据库架构、数据导入和管理工具。

### 目录结构

```
prisma/
├── schema.prisma          # 10 个模型，词汇管理架构
├── seed.ts                # CSV 导入器 + JSON 解析逻辑
└── reset.ts               # 数据库清空工具
```

### 快速定位

| 任务       | 位置            | 说明                                                 |
| ---------- | --------------- | ---------------------------------------------------- |
| 架构模型   | `schema.prisma` | User, Word, Definition, ExampleSentence, UserWord 等 |
| CSV 导入   | `seed.ts`       | 解析 words/新概念英语第一册.csv (JSON 字段)          |
| 数据库重置 | `reset.ts`      | 通过 deleteMany 清空所有表                           |

### 约定规范

#### 架构模型

- 10 个模型分 3 大类: 用户管理、单词管理、用户学习
- 所有外键级联删除 (onDelete: Cascade)
- 索引字段: word, difficulty, userId, wordId, nextReviewAt
- 唯一约束: User.email, Word.word, UserWord(userId, wordId)

#### CSV 数据格式

- `phonetic`: JSON 对象 `{uk: "...", us: "..."}`
- `sentence`: JSON 数组 `[{cn_sentence: "...", origin_sentence: "..."}]`
- `translation`: 分号分隔，带词性前缀 (如: "v.原谅；n.借口")
- CSV 字段中的双引号需转义

#### 种子导入流程

- 运行器: `tsx prisma/seed.ts` (直接执行 TypeScript)
- 数据源: `words/新概念英语第一册.csv`
- 自动创建系统用户和单词本
- 解析多部分定义和每个单词的多个例句

#### 迁移策略

- 开发环境: `tsx ./scripts/prisma.ts push` (无迁移文件)
- 生产环境: `tsx ./scripts/prisma.ts migrate dev` (版本化迁移)

#### 连接模式

- 使用 `@prisma/adapter-pg` + 显式 `Pool` 实例
- 与 server/utils/db.ts 中的单例模式一致

### 反模式 (禁止行为)

- ❌ Prisma 操作使用 `any` 类型
- ❌ 提交 `prisma/migrations/` 直到生产就绪 (开发用 push)
- ❌ 创建后手动编辑迁移文件
- ❌ 在生产环境运行 seed 脚本 (使用适当的数据管理)
- ❌ 重复数据库清空逻辑 (seed.ts:271-280 和 reset.ts:13-22 重复)

## 参考文档

- [Vitest 文档](https://r.jina.ai/https://vitest.dev/guide/)
- [Vitest 配置](https://r.jina.ai/https://vitest.dev/config/)
- [TypeScript 文档](https://r.jina.ai/https://www.typescriptlang.org/docs/)
- [TDesign Vue Next 文档 - 组件库](https://r.jina.ai/https://tdesign.tencent.com/vue-next/overview)
- [Nuxt 4 文档](https://nuxt.com/llms-full.txt)
- [H3 文档 - 路由](https://r.jina.ai/https://h3.unjs.io/guide/routing)
- [Prisma 文档 - 数据库连接](https://r.jina.ai/https://www.prisma.io/docs/concepts/components/prisma-client/connection-management)
- [Zod 文档 - 验证](https://zod.dev/llms.txt)
- [Prisma 文档 - PostgreSQL 数据库](https://r.jina.ai/https://www.prisma.io/docs/postgresql)
