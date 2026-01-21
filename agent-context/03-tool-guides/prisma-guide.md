# Prisma 开发指南

## 单例模式

所有 API 路由使用全局单例 Prisma Client：

```typescript
// server/utils/db.ts
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import process from 'node:process'

function prismaClientSingleton() {
  const connectionString = process.env.NUXT_DATABASE_URL
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

**使用方式**（无需导入，直接使用）：

```typescript
// server/api/books.get.ts
export default defineEventHandler(async (event) => {
  const books = await prisma.book.findMany()  // 直接使用 prisma
})
```

## 事务操作

```typescript
await prisma.$transaction(async (tx) => {
  await tx.userWord.update({
    where: { id: userWordId },
    data: { masteryLevel: { increment: 1 } },
  })
})
```

## 迁移命令

| 命令                                      | 用途               |
| ----------------------------------------- | ------------------ |
| `tsx ./scripts/prisma.ts generate`        | 生成 Prisma Client |
| `tsx ./scripts/prisma.ts push`            | 同步到开发数据库   |
| `tsx ./scripts/prisma.ts push --env=test` | 同步到测试数据库   |
| `tsx ./scripts/prisma.ts migrate dev`     | 创建迁移（生产）   |

## 注意事项

- ❌ 严禁在 API 路由中创建新的 PrismaClient 实例
- ❌ 严禁使用 `any` 类型
- ✅ 所有外键使用级联删除 (`onDelete: Cascade`)

> **参考文档**：[Prisma 连接管理](https://r.jina.ai/https://www.prisma.io/docs/concepts/components/prisma-client/connection-management) | [Prisma PostgreSQL](https://r.jina.ai/https://www.prisma.io/docs/postgresql)
