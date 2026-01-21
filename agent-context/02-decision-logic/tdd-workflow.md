# TDD 工作流程

## TDD 三步循环

### 1. RED (红)

编写失败的测试

```typescript
// test/unit/api/books.test.ts
it('should return paginated books with default parameters', async () => {
  // 测试代码
})
```

### 2. GREEN (绿)

编写最小代码使测试通过

```typescript
// server/api/books.get.ts
export default defineEventHandler(async () => {
  return { content: [], pageIndex: 0, pageSize: 10, total: 0, pageTotal: 0 }
})
```

### 3. REFACTOR (重构)

重构代码，保持测试通过

```typescript
// 添加实际业务逻辑
export default defineEventHandler(async (event) => {
  const pageBuilder = await definePageBuilder(event)
  const [data, total] = await Promise.all([
    prisma.book.findMany(pageBuilder.toPageArgs()),
    prisma.book.count(),
  ])
  return pageBuilder.toPageResponse(data, total)
})
```

## 测试隔离原则

- 每个测试使用 `beforeEach` 清理数据
- 测试之间无执行顺序依赖
- 使用 `resetDB()` 工具函数

## 测试命名规范

- 描述期望行为: `should return paginated books with default parameters`
- 边界测试: `should handle custom pagination parameters`
- 空状态测试: `should return empty array when no books exist`

## 运行测试

| 命令                         | 说明               |
| ---------------------------- | ------------------ |
| `pnpm test`                  | 运行所有测试       |
| `pnpm test:watch`            | 监听模式           |
| `pnpm test --grep "pattern"` | 运行匹配模式的测试 |
