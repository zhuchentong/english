# TDesign 使用指南

## 布局组件

项目使用 TDesign Layout 构建工作区：

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

## Menu 组件

```vue
<!-- app/components/workspace/WsSidebar.vue -->
<template>
  <t-menu :value="activeRoute" @change="handleChange">
    <t-menu-item value="index">
      <template #icon><HomeIcon /></template>
      首页
    </t-menu-item>
    <t-menu-item value="books">
      <template #icon><BookIcon /></template>
      单词书
    </t-menu-item>
  </t-menu>
</template>

<script setup lang="ts">
const route = useRoute()
const activeRoute = computed(() => route.name as string)
</script>
```

## 注意事项

- ❌ TDesign Table 组件必须设置 `row-key` 属性
- ❌ 侧边栏 Menu 禁止使用 `v-model:value` 绑定 computed 只读属性（应使用 `:value`）
- ✅ 使用 TDesign 组件时保持 PascalCase 命名

> **参考文档**：[TDesign Vue Next](https://r.jina.ai/https://tdesign.tencent.com/vue-next/overview)
