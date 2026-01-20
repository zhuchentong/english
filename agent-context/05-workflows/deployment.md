# 部署流程

## 环境配置

### 开发环境
- 数据库: `english`
- 配置文件: `.env`
- NUXT_DATABASE_URL: 开发数据库连接字符串

### 测试环境
- 数据库: `english_test`
- 配置文件: `.env.test`
- NUXT_DATABASE_URL: 测试数据库连接字符串

### 生产环境
- 数据库: 生产数据库
- 配置文件: 环境变量
- 迁移: 使用 Prisma Migrate

## 迁移策略

### 开发环境
```bash
# 使用 push 同步 schema（无迁移文件）
tsx ./scripts/prisma.ts push
```

### 生产环境
```bash
# 创建版本化迁移
tsx ./scripts/prisma.ts migrate dev

# 应用迁移
tsx ./scripts/prisma.ts migrate deploy
```

## 构建部署

```bash
# 构建生产版本
pnpm build

# 预览构建
pnpm preview
```

## 注意事项

- ✅ 开发与测试环境完全隔离
- ✅ 测试环境数据不会被 `beforeEach` 清除到开发数据库
- ✅ 生产环境必须使用版本化迁移
- ❌ 不要在生产环境运行 seed 脚本
