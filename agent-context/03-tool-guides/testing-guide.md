# 测试指南

## 测试项目配置

Vitest 使用 multi-project 配置：

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    projects: [
      { name: 'unit', include: ['test/unit/**/*.{test,spec}.{ts,js}'], environment: 'node' },
      { name: 'nuxt', include: ['test/nuxt/**/*.{test,spec}.{ts,js}'], environment: 'nuxt' },
      { name: 'integration', include: ['test/integration/**/*.{test,spec}.{ts,js}'], environment: 'node' },
      { name: 'e2e', include: ['test/e2e/**/*.{test,spec}.{ts,js}'], environment: 'node' },
    ],
  },
})
```

## 测试工具函数

### createMockEvent

创建模拟 H3 事件对象用于 unit 测试：

```typescript
// test/unit/utils/create-mock-event.ts
import { H3Event, createError, getQuery } from 'h3'

export function createMockEvent(url: string, options?: { method?: string; body?: any; query?: any }) {
  return {
    node: { req: { url, method: options?.method || 'GET' }, res: {} },
    context: {},
    path: url,
    method: options?.method || 'GET',
    query: options?.query || {},
    body: options?.body,
  } as unknown as H3Event
}
```

### resetDB

重置测试数据库：

```typescript
// test/unit/utils/reset-db.ts
import { prisma } from '../../../server/utils/db'

export async function resetDB() {
  await prisma.userWord.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.bookItem.deleteMany()
  await prisma.book.deleteMany()
  await prisma.user.deleteMany()
  await prisma.wordTag.deleteMany()
  await prisma.exampleSentence.deleteMany()
  await prisma.definition.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.word.deleteMany()
}
```

## 测试环境隔离

| 环境 | 数据库         | 配置文件    |
| ---- | -------------- | ----------- |
| 开发 | `english`      | `.env`      |
| 测试 | `english_test` | `.env.test` |

## 运行测试

| 命令                         | 说明               |
| ---------------------------- | ------------------ |
| `pnpm test`                  | 运行所有测试       |
| `pnpm test --project unit`   | 仅 unit 测试       |
| `pnpm test --project nuxt`   | 仅 nuxt 测试       |
| `pnpm test:watch`            | 监听模式           |
| `pnpm test --grep "pattern"` | 运行匹配模式的测试 |

## Mock 外部依赖

### vi.mock

项目使用 `vi.mock` mock 外部模块：

```typescript
// test/unit/api/tts.words.test.ts
vi.mock('edge-tts-universal', () => ({
  getVoices: vi.fn().mockResolvedValue([...]),
  textToSpeech: vi.fn().mockResolvedValue('audio-url'),
}))
```

### HTTP 请求 Mock

对于 HTTP 请求，推荐 mock 外部 API 依赖模块。

### 参考文档

- [Vitest 指南](https://r.jina.ai/https://vitest.dev/guide/)
- [Nuxt 测试模块](https://r.jina.ai/https://nuxt.com/docs/getting-started/testing)
