# 架构决策记录

## 技术选型理由

### Nuxt 4
- 文件路由简化开发
- AutoImport 自动导入减少样板代码
- Nitro 服务器引擎提供更好的性能
- Vue 3 组合式 API 更好的类型推断

### Prisma + PostgreSQL
- 类型安全的 ORM
- 清晰的 schema 定义
- 强大的迁移系统
- 连接池支持高并发

### TDesign + UnoCSS
- TDesign 提供丰富的企业级组件
- UnoCSS 原子化 CSS 减少样式代码
- tailwind-compat 保持与 TDesign 兼容性

### H3 + Zod
- 轻量级 HTTP 路由
- 类型安全的请求验证
- 与 Nuxt Nitro 深度集成

## 设计权衡

### 为什么不使用传统 Vue Router？
- Nuxt 文件路由更简洁
- 自动代码分割
- 更好的 SSR 支持

### 为什么使用连接池而非直接连接？
- PostgreSQL 连接数限制
- 生产环境需要连接池管理
- 更好的资源利用

### 为什么不使用 Prisma 直接连接？
- pg 驱动性能更好
- 更细粒度的连接控制
