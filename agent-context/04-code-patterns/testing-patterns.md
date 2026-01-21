# 测试模式

## Unit 测试模式

```typescript
// test/unit/api/books.test.ts
import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../../server/utils/db'
import { createMockEvent } from '../utils/create-mock-event'
import { resetDB } from '../utils/reset-db'

describe('books API (GET /api/books)', () => {
  beforeEach(async () => {
    await resetDB()
  })

  it('should return paginated books with default parameters', async () => {
    // Arrange
    const event = createMockEvent('http://localhost:3000/api/books?pageIndex=0&pageSize=50')

    // Act
    const handler = (await import('../../../server/api/books.get')).default
    const result = await handler(event)

    // Assert
    expect(result).toHaveProperty('content')
    expect(result).toHaveProperty('pageIndex')
    expect(result).toHaveProperty('total')
  })
})
```

## Nuxt Runtime 测试模式

```typescript
// test/nuxt/composables/useBook.test.ts
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'
import { useBook } from '~/composables/useBook'

describe('useBook Composable', () => {
  beforeEach(() => {
    registerEndpoint('/api/books', () => ({
      content: [],
      pagination: { total: 0, page: 1, pageSize: 50, totalPages: 0 },
    }))
  })

  it('should fetch books successfully', async () => {
    const { books, refreshBooks } = useBook()
    await refreshBooks()
    expect(books.value).toEqual([])
  })
})
```

## 测试文件组织

| 类型        | 位置                | 说明                   |
| ----------- | ------------------- | ---------------------- |
| Unit        | `test/unit/`        | API handlers、工具函数 |
| Nuxt        | `test/nuxt/`        | Composables、组件      |
| Integration | `test/integration/` | 真实外部服务调用       |
| E2E         | `test/e2e/`         | 端到端测试（暂时跳过） |
