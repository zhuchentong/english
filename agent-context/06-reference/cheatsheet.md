# 速查表

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm test` | 运行所有测试 |
| `pnpm test:watch` | 监听模式运行测试 |
| `pnpm lint` | ESLint 检查 |
| `pnpm lint:fix` | 自动修复 ESLint |
| `tsx ./scripts/prisma.ts push` | 同步数据库 |
| `tsx ./scripts/prisma.ts push --env=test` | 同步测试数据库 |

## 路径别名速查

| 别名 | 路径 | 示例 |
|------|------|------|
| `@/` | `app/` | `import X from '@/components/...'` |
| `@/server` | `server/` | `import { prisma } from '@/server/utils/db'` |
| `~/` | `app/` (测试) | `import { useBook } from '~/composables/useBook'` |

## 文件位置速查

| 任务 | 位置 |
|------|------|
| 数据库架构 | `prisma/schema.prisma` |
| Prisma 单例 | `server/utils/db.ts` |
| 页面路由 | `app/pages/` |
| 工作区组件 | `app/components/workspace/` |
| API 路由 | `server/api/` |
| 测试配置 | `vitest.config.ts` |

## 测试命令

| 命令 | 说明 |
|------|------|
| `pnpm test --project unit` | 仅 unit 测试 |
| `pnpm test --project nuxt` | 仅 nuxt 测试 |
| `pnpm test --grep "pattern"` | 运行匹配模式的测试 |
