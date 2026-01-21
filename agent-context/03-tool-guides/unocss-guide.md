# UnoCSS 使用指南

## CSS Reset

项目使用 UnoCSS 提供的 CSS Reset 方案：

```vue
<!-- app/app.vue -->
<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
</script>
```

Reset 类型: `tailwind-compat`

- 兼容 TDesign 等 UI 框架
- 移除浏览器默认样式
- 确保布局高度计算正确

## 原子类使用

```vue
<template>
  <div class="p-4 m-4 bg-white rounded-lg shadow">
    <h1 class="text-xl font-bold text-gray-800">标题</h1>
    <p class="mt-2 text-gray-600">内容</p>
  </div>
</template>
```

## 常用类

| 类名        | 说明     |
| ----------- | -------- |
| `p-4`       | 内边距   |
| `m-4`       | 外边距   |
| `bg-white`  | 背景色   |
| `rounded`   | 圆角     |
| `shadow`    | 阴影     |
| `text-xl`   | 字体大小 |
| `font-bold` | 字体加粗 |
| `flex`      | 弹性布局 |

> **参考文档**：[UnoCSS 文档](https://r.jina.ai/https://unocss.dev/)
