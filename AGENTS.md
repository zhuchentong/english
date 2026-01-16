# 项目知识库

**生成时间:** 2026-01-16
**框架:** Nuxt 4.2.2 (Vue 3.5.26)
**类型:** 最小化启动模板

## 概述
全新的 Nuxt 4 最小化启动模板，使用现代 app/ 目录结构。暂无自定义代码，仅默认欢迎页面。

## 目录结构
```
./
├── app/
│   └── app.vue              # 根组件 (NuxtWelcome)
├── server/
│   ├── utils/
│   │   └── db.ts           # Prisma Client 单例 (自动导入)
│   └── api/
│       └── users.get.ts      # API 路由示例
├── prisma/
│   ├── schema.prisma         # 数据库模型定义
│   ├── prisma.config.ts      # Prisma 配置
│   └── dev.db              # SQLite 数据库 (开发环境)
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── nuxt.config.ts           # 主配置 (最小化)
├── eslint.config.mjs        # ESLint 9 扁平配置
├── tsconfig.json            # TS 配置 (引用 .nuxt)
└── package.json             # pnpm, nuxt 4.2.2
```

## 快速定位
| 任务 | 位置 | 说明 |
|------|----------|-------|
| 应用入口 | `app/app.vue` | 根组件，NuxtWelcome |
| 配置 | `nuxt.config.ts` | 仅 @nuxt/eslint 模块 |
| 代码检查 | `eslint.config.mjs` | 扩展 .nuxt/eslint.config.mjs |
| 静态资源 | `public/` | favicon, robots.txt |

## 约定规范 (Nuxt 4 特有)

### 目录结构
- **app/** (Nuxt 4) - 主应用目录，不是 pages/
- 暂无 pages/、components/、composables/ (待开发者添加)
- 文件路由尚未配置

### 配置
- **ESLint 9 扁平配置**: 使用 `withNuxt()` 包装器，扩展 `.nuxt/eslint.config.mjs`
- **TypeScript**: 引用生成的 `.nuxt/tsconfig.*.json` 文件
- **路径别名** (自动配置): `~/`, `@/` → `app/`, `~~/`, `@@/` → 根目录

### 自动导入
- 完整的 Nuxt API 无需导入即可使用 (useState, useFetch, definePageMeta 等)
- `app/components/` 中的组件创建后自动导入
- `app/composables/` 中的组合式函数创建后自动导入
- `server/utils/` 中的工具函数自动导入（包括 Prisma 客户端）

### 数据库 (Prisma)
- **Provider**: PostgreSQL (远程数据库)
- **ORM**: Prisma 7.2.0
- **Prisma Client**: 自动导入，通过 `prisma` 全局可用
- **模式定义**: `prisma/schema.prisma`
- **迁移**: 使用 `pnpm prisma:migrate` 或 `pnpm prisma:push`
- **环境变量**: `DATABASE_URL` 配置在 `.env` 文件中

### 包管理器
- **pnpm** (pnpm-lock.yaml v9.0)
- 安装后自动运行: `nuxt prepare`

## 常用命令
```bash
pnpm dev          # 启动开发服务器 (http://localhost:3000)
pnpm build        # 生产环境构建
pnpm preview      # 预览生产环境构建
pnpm generate     # 静态站点生成
pnpm prisma:generate     # 生成 Prisma Client
pnpm prisma:push        # 同步 schema 到数据库
pnpm prisma:migrate     # 创建并运行迁移
pnpm prisma:studio      # 打开 Prisma Studio GUI
```
