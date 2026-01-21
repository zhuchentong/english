# 技术栈说明

## 核心框架

| 框架       | 版本   | 用途       | 项目位置       |
| ---------- | ------ | ---------- | -------------- |
| Nuxt       | 4.2.2  | 全栈框架   | `package.json` |
| Vue        | 3.5.26 | 响应式 UI  | `package.json` |
| TypeScript | 5.x    | 类型安全   | `package.json` |
| H3         | 内置   | HTTP 路由  | `server/api/`  |
| Nitro      | 内置   | 服务器引擎 | 内置           |

## 数据库与 ORM

| 技术               | 版本    | 用途            | 项目位置               |
| ------------------ | ------- | --------------- | ---------------------- |
| PostgreSQL         | 14+     | 主数据库        | 外部服务               |
| Prisma             | 7.2.0   | ORM             | `prisma/schema.prisma` |
| @prisma/adapter-pg | 7.2.0   | 连接池          | `server/utils/db.ts`   |
| pg                 | ^8.17.1 | PostgreSQL 驱动 | `package.json`         |

## UI 框架

| 技术             | 版本   | 用途      | 项目位置                    |
| ---------------- | ------ | --------- | --------------------------- |
| TDesign Vue Next | 1.18.0 | 组件库    | `app/components/workspace/` |
| UnoCSS           | 66.6.0 | 原子 CSS  | `app/app.vue`               |
| @unocss/reset    | 66.6.0 | CSS Reset | `app/app.vue`               |

## 测试

| 技术             | 版本   | 用途          | 项目位置           |
| ---------------- | ------ | ------------- | ------------------ |
| Vitest           | 4.0.17 | 测试框架      | `vitest.config.ts` |
| @nuxt/test-utils | 3.23.0 | Nuxt 测试工具 | `test/`            |
| Playwright       | 1.57.0 | E2E 测试      | `test/e2e/`        |

## 工具库

| 技术               | 版本   | 用途     | 项目位置                            |
| ------------------ | ------ | -------- | ----------------------------------- |
| edge-tts-universal | ^1.3.3 | TTS 发音 | `server/api/tts/words/[id].get.ts`  |
| zod                | 4.3.5  | 数据验证 | `server/utils/use-safe-validate.ts` |

| tsx | 4.21.0 | 运行 TypeScript | `scripts/prisma.ts` |

## 环境配置

- **Node.js**: 18.17.0+
- **包管理器**: pnpm 9.x
- **运行时**: tsx (直接运行 TypeScript)
