# 常见错误及解决方案

## 数据库错误

### NUXT_DATABASE_URL 未定义

**错误**: `Error: NUXT_DATABASE_URL is not defined`
**解决**: 检查 `.env` 或 `.env.test` 文件配置

### 连接池耗尽

**错误**: `too many clients`
**解决**: 使用 Prisma 单例，避免创建多个连接

## TypeScript 错误

### any 类型使用

**错误**: `Forbidden any type`
**解决**: 使用明确的类型定义或 `unknown`

### 路径别名未解析

**错误**: `Module not found`
**解决**: 检查 `tsconfig.json` 别名配置

## 测试错误

### 测试数据未隔离

**错误**: `Expected 3 items, got 5`
**解决**: 确保使用 `beforeEach` 调用 `resetDB()`

### 环境变量未加载

**错误**: `process.env is not defined`
**解决**: 检查 `vitest.setup.ts` 中的 `dotenv.config()`

## API 错误

### 404 Not Found

**错误**: `Cannot GET /api/unknown`
**解决**: 检查 API 路由文件路径和命名

### 500 Internal Error

**错误**: `Failed to fetch books`
**解决**: 查看服务器日志，检查数据库查询
