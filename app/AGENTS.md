# app/ 应用目录

**用途**: 应用根目录 - 主应用组件和页面/组件

## 概述

Nuxt 4 应用目录，使用文件路由和自动导入。目前仅包含根欢迎组件。

## 目录结构

```
app/
└── app.vue              # 根组件 (NuxtWelcome 占位符)
```

## 快速定位

| 任务       | 位置      | 说明                                 |
| ---------- | --------- | ------------------------------------ |
| 根组件     | `app.vue` | 当前为 NuxtWelcome，需替换为真实应用 |
| 页面       | (未创建)  | 创建 `pages/index.vue` 开始路由      |
| 组件       | (未创建)  | 创建 `components/` 用于 Vue 组件     |
| 组合式函数 | (未创建)  | 创建 `composables/` 用于共享逻辑     |

## 约定规范

### 文件路由

- `pages/index.vue` → `/` 路由
- `pages/about.vue` → `/about` 路由
- `pages/blog/[slug].vue` → `/blog/:slug` 动态路由

### 根组件 (app.vue)

- 应用根组件 (不是页面)
- 使用 `<NuxtPage />` 渲染页面 (而非 `<NuxtWelcome />`)
- 使用 `<NuxtLayout />` 应用布局 (创建布局后)

### 组件 (components/)

- 自动导入，无需显式引入
- PascalCase 命名: `WordCard.vue`, `SearchBar.vue`
- `components/base/` → 基础组件
- `components/features/` → 功能组件

### 组合式函数 (composables/)

- 自动导入，无需显式引入
- camelCase 命名 + `use` 前缀: `useWords.ts`, `useAuth.ts`
- 返回响应式数据和方法
- 可在组件和页面中复用

### 页面 (pages/)

- Nuxt 4 使用 `app/pages/` 而非根 `pages/`
- 文件名即路由路径
- 支持嵌套路由、动态路由、中间件

## 待办事项

1. 创建 `app/pages/index.vue` 首页
2. 修改 `app/app.vue` 移除 `<NuxtWelcome />`，添加 `<NuxtPage />`
3. 创建常用组件: WordCard, SearchBar, WordList
4. 创建 composables: useWords, useAuth, useFavorites
5. 创建 layouts/default.vue 布局
