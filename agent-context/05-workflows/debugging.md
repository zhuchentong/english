# 调试流程

## 常见问题诊断

### 数据库连接问题
```bash
# 检查环境变量
echo %NUXT_DATABASE_URL%

# 测试数据库连接
tsx ./scripts/prisma.ts studio --env=test
```

### API 调试
```bash
# 启动开发服务器
pnpm dev

# 使用 curl 测试 API
curl http://localhost:3000/api/books
```

### 前端调试
- 打开浏览器开发者工具 (F12)
- 查看 Network 面板检查 API 调用
- 查看 Console 面板检查错误

## 日志输出

### 服务器端日志
```typescript
// server/api/books.get.ts
export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching books...')
    const books = await prisma.book.findMany()
    return books
  }
  catch (error) {
    console.error('Failed to fetch books:', error)
    throw error
  }
})
```

## 错误排查清单

- [ ] 检查环境变量配置
- [ ] 验证数据库连接
- [ ] 确认 API 路由正确
- [ ] 检查前端请求参数
- [ ] 查看浏览器控制台错误
