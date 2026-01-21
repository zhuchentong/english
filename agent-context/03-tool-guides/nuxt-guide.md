# Nuxt 4 开发指南

## 文件路由

Nuxt 4 使用 `app/pages/` 目录实现基于文件的路由：

| 文件路径                         | 路由路径     | 说明       |
| -------------------------------- | ------------ | ---------- |
| `app/pages/index.vue`            | `/`          | 首页       |
| `app/pages/books/index.vue`      | `/books`     | 单词书列表 |
| `app/pages/books/[id]/index.vue` | `/books/:id` | 单词书详情 |

> **参考文档**：[Nuxt 4 文档](https://nuxt.com/llms-full.txt)

## AutoImport 自动导入

Nuxt 4 自动导入以下内容：

### Vue APIs

```vue
<script setup lang="ts">
// 以下无需导入，直接使用
const count = ref(1)
const doubled = computed(() => count.value * 2)
const route = useRoute()
const router = useRouter()

onMounted(() => {
  console.log('mounted')
})
</script>
```

### Composables

`app/composables/` 目录下的所有函数自动导入：

```typescript
// useBook.ts
export const useBook = () => {
  const books = ref([])
  return { books }
}

// 在组件中使用
const { books } = useBook()
```

### 路径别名

| 别名       | 路径      | 使用场景     |
| ---------- | --------- | ------------ |
| `@/`       | `app/`    | 源码导入     |
| `~/`       | `app/`    | 测试环境推荐 |
| `@/server` | `server/` | 服务器代码   |

## 布局系统

```vue
<!-- app/app.vue -->
<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

```vue
<!-- app/layouts/default.vue -->
<template>
  <t-layout>
    <t-header><WsHeader /></t-header>
    <t-layout>
      <t-aside><WsSidebar /></t-aside>
      <t-content><slot /></t-content>
    </t-layout>
    <t-footer><WsFooter /></t-footer>
  </t-layout>
</template>
```
