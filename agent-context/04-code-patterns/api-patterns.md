# API 设计模式

## 标准 API 路由结构

```typescript
// server/api/books.get.ts
import { createError, defineEventHandler } from 'h3'
import { prisma } from '../utils/db'
import { definePageBuilder } from '../utils/define-page-builder'

export default defineEventHandler(async (event) => {
  try {
    const pageBuilder = await definePageBuilder(event)
    const pageArgs = pageBuilder.toPageArgs()

    const [data, total] = await Promise.all([
      prisma.book.findMany({
        ...pageArgs,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.book.count(),
    ])

    return pageBuilder.toPageResponse(data, total)
  }
  catch (error) {
    console.error('Failed to fetch books:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch books',
    })
  }
})
```

## 分页响应标准

所有列表 API 返回标准化格式：

```typescript
interface PaginatedResponse<T> {
  content: T[]       // 数据列表
  pageIndex: number  // 当前页码（0-based）
  pageSize: number   // 每页大小
  total: number      // 总记录数
  pageTotal: number  // 总页数
}
```

## API 端点列表

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/books` | GET | 获取单词书列表（分页） |
| `/api/books/:id` | GET | 获取单个单词书 |
| `/api/books/:id/words` | GET | 获取单词书单词列表 |
| `/api/tts/words/:id` | GET | 获取单词发音（音频） |

## 参数验证

使用 H3 内置的 `getValidated*` 函数配合 Zod 进行类型安全的请求验证：

```typescript
// server/api/tts/words/[id].get.ts
import { useSafeParams, useSafeQuery } from '@/server/utils/use-safe-validate'
import { AccentSchema, WordIdSchema } from '@/server/utils/validate-tts'

const { id } = await useSafeParams(event, WordIdSchema)
const { accent } = await useSafeQuery(event, AccentSchema)
```
