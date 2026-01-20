# AI 代理开发指南

**项目**: 英语单词学习系统 (Nuxt 4 + Prisma 7)
**框架**: Nuxt 4.2.2 (Vue 3.5.26) | TypeScript 严格模式
**开发模式**: TDD (测试驱动开发)

---

## 智能体上下文文档索引

### 1. 项目情报（智能体必须优先阅读）
- [项目概述](./agent-context/01-project-intel/overview.md)
- [架构设计](./agent-context/01-project-intel/architecture.md)
- [技术栈说明](./agent-context/01-project-intel/tech-stack.md)
- [数据库架构](./agent-context/01-project-intel/database-schema.md)
- [关键文件位置](./agent-context/01-project-intel/key-files.md)

### 2. 决策逻辑
- [问题解决流程](./agent-context/02-decision-logic/problem-solving.md)
- [代码审查指南](./agent-context/02-decision-logic/code-review.md)
- [架构决策记录](./agent-context/02-decision-logic/architecture-decisions.md)
- [TDD 工作流程](./agent-context/02-decision-logic/tdd-workflow.md)

### 3. 工具指南
- [Nuxt 4 开发指南](./agent-context/03-tool-guides/nuxt-guide.md)
- [Prisma 开发指南](./agent-context/03-tool-guides/prisma-guide.md)
- [TDesign 使用指南](./agent-context/03-tool-guides/tdesign-guide.md)
- [UnoCSS 使用指南](./agent-context/03-tool-guides/unocss-guide.md)
- [H3 + Zod 验证指南](./agent-context/03-tool-guides/h3-zod-guide.md)
- [测试指南](./agent-context/03-tool-guides/testing-guide.md)

### 4. 代码模式
- [错误处理模式](./agent-context/04-code-patterns/error-handling.md)
- [API 设计模式](./agent-context/04-code-patterns/api-patterns.md)
- [Composables 模式](./agent-context/04-code-patterns/composable-patterns.md)
- [组件模式](./agent-context/04-code-patterns/component-patterns.md)
- [测试模式](./agent-context/04-code-patterns/testing-patterns.md)

### 5. 工作流程
- [开发流程](./agent-context/05-workflows/development.md)
- [调试流程](./agent-context/05-workflows/debugging.md)
- [部署流程](./agent-context/05-workflows/deployment.md)

### 6. 快速参考
- [速查表](./agent-context/06-reference/cheatsheet.md)
- [常见错误及解决](./agent-context/06-reference/common-errors.md)
- [常见问题解答](./agent-context/06-reference/faq.md)
- [在线参考资源](./agent-context/06-reference/resources.md)

---

## 智能体配置

**项目类型**: Nuxt 4 全栈应用 (Vue 3 + TypeScript)
**主要语言**: TypeScript 严格模式
**数据库**: PostgreSQL + Prisma 7.2.0

**文档优先级**:
1. `agent-context/01-project-intel/` - 理解项目基础
2. `agent-context/03-tool-guides/` - 掌握开发工具
3. `agent-context/04-code-patterns/` - 遵循代码规范

**特殊指令**:
- 所有代码必须符合项目编码规范
- 数据库操作使用 Prisma 单例
- API 响应使用标准化分页格式
- 遵循 TDD 开发流程
- 当需要查阅第三方库（Vitest/Prisma/H3/Zod/TDesign/UnoCSS）的具体 API 或用法时，
  必须先读取 `agent-context/06-reference/resources.md` 获取在线文档入口
- 优先访问 resources.md 中的文档链接获取最新、完整的技术细节

---

## 核心命令速查

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm test` | 运行所有测试 |
| `pnpm lint` | ESLint 检查 |
| `tsx ./scripts/prisma.ts push` | 同步数据库 |
