# app/ 目录

**用途:** 应用根目录 - 主应用组件和未来的页面/组件

## 概述
Nuxt 4 应用目录，使用文件路由和自动导入。目前仅包含根欢迎组件。

## 目录结构
```
app/
└── app.vue              # 根组件 (NuxtWelcome 占位符)
```

## 快速定位
| 任务 | 位置 | 说明 |
|------|----------|-------|
| 根组件 | `app.vue` | 当前为 NuxtWelcome，替换为真实应用 |
| 页面 | (未创建) | 创建 `pages/index.vue` 开始路由 |
| 组件 | (未创建) | 创建 `components/` 用于 Vue 组件 |
| 组合式函数 | (未创建) | 创建 `composables/` 用于共享逻辑 |

## 约定规范

### 文件路由
- `pages/index.vue` → `/` 路由
- `pages/about.vue` → `/about` 路由
- `pages/blog/[slug].vue` → `/blog/:slug` 动态路由

### 根组件
- `app.vue` = 应用根 (不是页面)
- 使用 `<NuxtPage />` 渲染页面 (不是 `<NuxtWelcome />`)
- 使用 `<NuxtLayout />` 应用布局 (创建后)
