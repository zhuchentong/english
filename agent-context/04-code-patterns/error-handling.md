# 错误处理模式

## API 错误处理

```typescript
// server/api/books.get.ts
export default defineEventHandler(async (event) => {
  try {
    const books = await prisma.book.findMany()
    return books
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

## 错误响应标准

```typescript
// 400 Bad Request
throw createError({
  statusCode: 400,
  statusMessage: 'Invalid pagination parameters',
})

// 404 Not Found
throw createError({
  statusCode: 404,
  statusMessage: 'Word not found',
})

// 500 Internal Server Error
throw createError({
  statusCode: 500,
  statusMessage: 'Failed to synthesize audio',
})
```

## 错误码对应表

| 状态码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
