# 关键文件位置

## 目录结构速查

| 任务 | 位置 |
|------|------|
| 数据库架构 | `prisma/schema.prisma` |
| Prisma 单例 | `server/utils/db.ts` |
| Prisma 配置 | `prisma.config.ts` |
| Prisma 环境脚本 | `scripts/prisma.ts` |
| 开发环境变量 | `.env` (NUXT_DATABASE_URL) |
| 测试环境变量 | `.env.test` (NUXT_DATABASE_URL) |

## 应用目录

| 任务 | 位置 |
|------|------|
| 应用入口 | `app/app.vue` |
| 布局文件 | `app/layouts/` |
| 页面路由 | `app/pages/` |
| 工作区组件 | `app/components/workspace/` |
| 组合式函数 | `app/composables/` |

## 服务器端

| 任务 | 位置 |
|------|------|
| API 端点 | `server/api/` |
| 服务器工具 | `server/utils/` |
| 验证工具 | `server/utils/use-safe-validate.ts` |
| TTS 验证 | `server/utils/validate-tts.ts` |
| 分页构建器 | `server/utils/define-page-builder.ts` |

## 测试

| 任务 | 位置 |
|------|------|
| 测试文件 | `test/` (unit/nuxt/e2e/integration) |
| 测试设置 | `test/vitest.setup.ts` |
| 测试工具函数 | `test/unit/utils/` |
| 测试配置 | `vitest.config.ts` |
