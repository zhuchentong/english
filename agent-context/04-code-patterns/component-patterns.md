# 组件编写模式

## Props 定义

使用 TypeScript 接口定义 Props：

```vue
<script setup lang="ts">
interface Props {
  word: Word
  isSelected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
})
</script>
```

## Emits 定义

使用类型化 emits：

```vue
<script setup lang="ts">
const emit = defineEmits<{
  select: [wordId: number]
  delete: [wordId: number]
}>()
</script>

<template>
  <button @click="emit('select', props.word.id)">选择</button>
</template>
```

## 完整示例

```vue
<script setup lang="ts">
interface Props {
  book: {
    id: number
    name: string
    description: string
    wordCount: number
    isPublic: boolean
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{ click: [id: number] }>()
</script>

<template>
  <div class="book-card" @click="emit('click', props.book.id)">
    <h3>{{ props.book.name }}</h3>
    <p>{{ props.book.description }}</p>
  </div>
</template>
```

## 注意事项

- ✅ 使用 `withDefaults` 提供默认值
- ✅ 使用类型化 `defineEmits`
- ❌ 避免使用 `any` 类型
- ❌ 不要在 props 中使用箭头函数
