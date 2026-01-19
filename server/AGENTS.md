# SERVER/ 开发指南

**用途**: 服务器端工具和 API 路由 (H3 运行时)

## 概述
服务器端代码，包含 Prisma 单例、API 路由和工具函数。

## 目录结构
```
server/
├── api/              # API 路由处理器 (待实现)
│   └── *.get.ts      # GET 端点 (如: words.get.ts)
├── middleware/       # 服务器中间件 (待添加)
└── utils/
    └── db.ts         # Prisma Client 单例 + PostgreSQL 连接池
```

## 快速定位
| 任务 | 位置 | 说明 |
|------|----------|-------|
| 数据库访问 | `utils/db.ts` | 单例 + 连接池 + 热重载支持 |
| API 路由 | `api/*.get.ts` | H3 处理器 (自动导入 prisma) |
| 服务器工具 | `utils/*.ts` | 共享服务器函数 |

## 约定规范

### Prisma 单例模式
- 从 `utils/db.ts` 导出 `prisma` (服务器全局自动导入)
- 生产环境: 每个服务器生命周期单例
- 开发环境: 持久化到 `globalThis` 支持热重载
- 使用 PostgreSQL 连接池 (`@prisma/adapter-pg`) 而非直接连接

### API 路由结构
- 文件路由: `api/words.get.ts` → `GET /api/words`
- H3 处理器签名: `export default defineEventHandler((event) => {...})`
- 直接使用 `prisma` (无需导入，从 utils/db.ts 自动导入)

### 自动导入机制
- 所有 `utils/*.ts` 导出内容自动服务器级导入
- 无需手动导入: `prisma` 在所有 API 路由中可用
- 路径别名 `@/server/*` 映射到 server/ 目录

### 错误处理
```typescript
export default defineEventHandler(async (event) => {
  try {
    const words = await prisma.word.findMany()
    return words
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch words'
    })
  }
})
```

## 反模式 (禁止行为)
- ❌ 在 API 路由中创建新的 PrismaClient 实例 (使用单例)
- ❌ 直接导入 PrismaClient (使用 utils/db.ts 导出的 `prisma`)
- ❌ 在 API 路由中使用 `.env` 值 (通过 `process.env` 或 `useRuntimeConfig` 读取)
- ❌ 跳过 API 路由中的验证 (使用 zod 等验证请求体)
- ❌ 在 utils/ 中混合客户端和服务器代码 (server/ 仅限服务器端)
