# 开发流程

## 环境配置

### 首次设置
```bash
# 生成 Prisma Client
tsx ./scripts/prisma.ts generate

# 同步开发数据库
tsx ./scripts/prisma.ts push

# 同步测试数据库
tsx ./scripts/prisma.ts push --env=test
```

## 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 (http://localhost:3000) |
| `pnpm build` | 生产构建 |
| `pnpm preview` | 预览生产构建 |
| `pnpm lint` | ESLint 检查 |
| `pnpm lint:fix` | 自动修复 ESLint |

## 测试命令

| 命令 | 说明 |
|------|------|
| `pnpm test` | 运行所有测试 |
| `pnpm test:watch` | 监听模式 |
| `pnpm test:coverage` | 覆盖率报告 |
| `pnpm test:ui` | 测试 UI 界面 |

## 数据库命令

| 命令 | 说明 |
|------|------|
| `tsx ./scripts/prisma.ts push` | 同步开发数据库 |
| `tsx ./scripts/prisma.ts push --env=test` | 同步测试数据库 |
| `tsx ./scripts/prisma.ts studio --env=test` | 打开测试数据库 Studio |
| `tsx ./scripts/prisma.ts reset --env=test` | 重置测试数据库 |
| `tsx ./scripts/prisma.ts migrate dev` | 创建迁移（生产） |

## TDD 流程

1. **RED**: 编写失败的测试
2. **GREEN**: 编写最小代码使测试通过
3. **REFACTOR**: 重构代码，保持测试通过

## 每次修改后
- 运行 `pnpm test` 确保所有测试通过
- 运行 `pnpm lint` 确保代码质量
