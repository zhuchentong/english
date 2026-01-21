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

## 测试用例命名规范

### 中文命名要求

测试文件的 `describe.name` 和 `it.name` 必须使用**中文**，并**以中文开头**，遵循以下规则：

**describe 命名规范：**

- 必须以中文开头
- 模块/功能名称，使用中文
- 可在中文后补充英文说明
- 示例：`'书籍 API (GET /api/books)'`、`'useBook 组合式函数'`

**it 命名规范：**

- 必须以中文开头
- 使用 "应该" 或 "当...时，应该" 开头，描述期望行为
- 明确测试的边界条件和输入输出
- 示例：`'应该返回默认分页参数的书籍列表'`、`'当没有书籍时应该返回空数组'`

```typescript
// test/unit/api/books.test.ts
import { beforeEach, describe, expect, it } from 'vitest'

describe('书籍 API (GET /api/books)', () => {
  beforeEach(async () => {
    await resetDB()
  })

  it('应该返回默认分页参数的书籍列表', async () => {
    const event = createMockEvent('http://localhost:3000/api/books?pageIndex=0&pageSize=50')
    const handler = (await import('../../../server/api/books.get')).default
    const result = await handler(event)

    expect(result).toHaveProperty('content')
    expect(result).toHaveProperty('pageIndex')
    expect(result).toHaveProperty('total')
  })

  it('应该正确处理自定义分页参数', async () => {
    const event = createMockEvent('http://localhost:3000/api/books?pageIndex=2&pageSize=20')
    const handler = (await import('../../../server/api/books.get')).default
    const result = await handler(event)

    expect(result.pageIndex).toBe(2)
    expect(result.pageSize).toBe(20)
  })
})

// test/nuxt/composables/useBook.test.ts
describe('useBook Composable', () => {
  beforeEach(() => {
    registerEndpoint('/api/books', () => ({
      content: [],
      pagination: { total: 0, page: 1, pageSize: 50, totalPages: 0 },
    }))
  })

  it('应该成功获取书籍列表', async () => {
    const { books, refreshBooks } = useBook()
    await refreshBooks()
    expect(books.value).toEqual([])
  })
})
```

### 命名原则

| 场景       | 命名模式                        | 示例                             |
| ---------- | ------------------------------- | -------------------------------- |
| 默认行为   | 应该 + 返回/实现 + 默认 + 参数  | '应该返回默认分页参数的书籍列表' |
| 边界条件   | 应该 + 处理/返回 + 边界 + 情况  | '当没有书籍时应该返回空数组'     |
| 自定义参数 | 应该 + 正确处理 + 自定义 + 参数 | '应该正确处理自定义分页参数'     |
| 错误处理   | 应该 + 抛出/处理 + 错误 + 情况  | '应该抛出参数验证错误'           |
| 空状态     | 当 + 没有/为空 + 时，应该 + ... | '当没有书籍时应该返回空数组'     |
| 异步操作   | 应该 + 成功 + 执行 + 异步操作   | '应该成功获取书籍列表'           |
