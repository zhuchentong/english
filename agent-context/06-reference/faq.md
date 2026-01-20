# 常见问题解答

## 项目结构

Q: 为什么使用 `app/pages/` 而不是根 `pages/`？
A: Nuxt 4 使用 `app/` 目录作为应用根目录

Q: Composables 为什么不需要导入？
A: Nuxt 4 AutoImport 自动导入 `app/composables/` 目录

## 数据库

Q: 如何添加新模型？
A: 在 `prisma/schema.prisma` 添加模型，运行 `tsx ./scripts/prisma.ts push`

Q: 测试数据会污染开发数据库吗？
A: 不会，开发和测试使用完全隔离的数据库

## 测试

Q: 为什么 E2E 测试暂时跳过？
A: @nuxt/test-utils v3.x E2E 支持仍在完善中

Q: 如何运行特定测试？
A: 使用 `pnpm test --grep "pattern"` 或 `pnpm test --project unit`

## 开发

Q: 如何切换数据库环境？
A: 使用 `--env=test` 参数，如 `tsx ./scripts/prisma.ts push --env=test`

Q: 为什么需要在组件中使用 `<NuxtLayout>`？
A: 确保工作区布局（Header + Sidebar + Content + Footer）正确渲染
