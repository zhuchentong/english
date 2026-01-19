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
pnpm test server/__tests__/utils/db.test.ts   # 运行单个测试文件
pnpm test --grep "should create word"         # 运行匹配模式的测试
pnpm test:e2e                                 # E2E 测试
```

### 数据库命令
```bash
pnpm prisma:generate  # 生成 Prisma Client
pnpm prisma:push      # 同步架构到数据库 (开发用)
pnpm prisma:migrate   # 创建迁移文件并应用 (生产用)
pnpm prisma:studio    # 打开 Prisma Studio GUI
pnpm prisma:seed      # 从 CSV 导入数据
pnpm prisma:reset     # 清空所有表
```

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
- **Composables**: `app/composables/` (camelCase 前缀 `use`: `useWords.ts`, `useWorkspace.ts`)
- **API 路由**: `server/api/` (RESTful: `words.get.ts`, `words.post.ts`)
- **测试文件**: 与被测文件同级或 `__tests__` 目录，后缀 `.test.ts`

### 导入规范
```typescript
// ✅ 使用路径别名
import { prisma } from '@/server/utils/db'
import { Word } from '@/prisma'
import { ref, computed } from 'vue'
// ❌ 避免相对路径
import { prisma } from '../../../server/utils/db'
```

**路径别名**: `@/` → `app/`, `@@/` → 根目录, `@/prisma` → `app/generated/prisma/`, `@/server` → `server/`

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
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '@/server/utils/db'

describe('Word API', () => {
  beforeEach(async () => { await prisma.word.deleteMany() })
  it('should create a new word successfully', async () => { })
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

## TDD 约定

1. RED → GREEN → REFACTOR 循环
2. 先写测试，再写实现
3. 测试必须独立运行，无执行顺序依赖
4. 测试名称清晰描述期望行为: `should create word successfully`
5. 边界测试: 最小值、最大值、空值、null/undefined
6. 使用 beforeEach/afterEach 隔离测试数据

## 反模式 (禁止)

- ❌ 提交 `node_modules/`, `.nuxt/`, `app/generated/prisma/`
- ❌ 使用 `any` 类型
- ❌ 硬编码数据库凭证 (使用 .env)
- ❌ 创建多个 PrismaClient 实例
- ❌ 在根 `pages/` 创建文件 (使用 `app/pages/`)
- ❌ 先写代码再写测试 (违反 TDD)
- ❌ 在 app.vue 中直接渲染内容而不使用 `<NuxtLayout>` (应使用工作区布局)
- ❌ TDesign Table 组件缺少 `row-key` 属性
- ❌ 侧边栏 Menu 使用 `v-model:value` 绑定 computed 只读属性（应使用 `:value`）

## 项目独特风格

- **Prisma 输出**: 自定义到 `app/generated/prisma/` (非 node_modules)
- **连接池**: 显式 PostgreSQL pool adapter (server/utils/db.ts)
- **Seed 脚本**: 使用 `tsx` 直接运行 TypeScript
- **数据导入**: CSV 中 phonetic/sentence 字段为 JSON 编码

## 关键文件位置

| 任务 | 位置 |
|------|------|
| 数据库架构 | `prisma/schema.prisma` |
| Prisma 单例 | `server/utils/db.ts` |
| 应用入口 | `app/app.vue` |
| 布局文件 | `app/layouts/` |
| 工作区组件 | `app/components/workspace/` |
| 工作区状态 | `app/composables/useWorkspace.ts` |
| 路由页面 | `app/pages/` |
| API 端点 | `server/api/` |

## 注意事项

- 首次克隆需运行: `pnpm prisma:generate`
- 开发用 `prisma:push`，生产用 `prisma:migrate`
- TypeScript 严格模式已启用 (strict: true)
- 使用 TDD: 每次修改后运行测试
