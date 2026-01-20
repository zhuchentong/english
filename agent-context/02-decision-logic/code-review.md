# 代码审查指南

## 反模式 (禁止)

### 通用规则
- ❌ 提交 `node_modules/`, `.nuxt/`
- ❌ 使用 `any` 类型
- ❌ 硬编码数据库凭证 (使用 .env)
- ❌ 创建多个 PrismaClient 实例

### Nuxt/Vue 规则
- ❌ 在根 `pages/` 创建文件 (使用 `app/pages/`)
- ❌ 在 app.vue 中直接渲染内容而不使用 `<NuxtLayout>`
- ❌ 显式导入 Vue API（`import { ref, computed } from 'vue'`）
- ❌ TDesign Table 组件缺少 `row-key` 属性
- ❌ 侧边栏 Menu 使用 `v-model:value` 绑定 computed 只读属性

### 测试规则
- ❌ 先写代码再写测试 (违反 TDD)
- ❌ 在源码目录（`server/`, `app/`）下创建 `__tests__` 目录
- ❌ 在 unit 测试中使用路径别名（应使用相对路径）

### 服务器端规则
- ❌ 在 API 路由中创建新的 PrismaClient 实例
- ❌ 直接导入 PrismaClient (使用 utils/db.ts 导出的 prisma)
- ❌ 跳过 API 路由中的验证
- ❌ 在 utils/ 中混合客户端和服务器代码

## 代码审查检查清单

- [ ] TypeScript 严格模式
- [ ] Prisma 单例使用
- [ ] AutoImport 规范
- [ ] 错误处理完善
- [ ] 测试覆盖
- [ ] 命名规范
