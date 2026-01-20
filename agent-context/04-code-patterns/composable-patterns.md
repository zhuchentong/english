# Composables 编写模式

## 基本结构

Composables 位于 `app/composables/` 目录，自动导入：

```typescript
// app/composables/useBook.ts
export async function useBook(pagination: ComputedRef<PaginationData>) {
  const { data, pending, error, refresh }
    = await useFetch<PaginatedResponse<Book>>('/api/books', {
      query: computed(() => ({
        pageIndex: pagination.value.pageIndex,
        pageSize: pagination.value.pageSize,
      })),
    })

  watch(data, (value) => {
    if (value) {
      pagination.value.update({
        total: value.total,
        pageTotal: value.pageTotal,
      })
    }
  })

  return {
    data: computed(() => data.value?.content ?? []),
    pending,
    error,
    refresh,
  }
}
```

## 返回值规范

- 返回 `computed` 包装的响应式数据
- 返回 `ref` 状态（pending, error）
- 返回 `function` 方法（refresh, update）

## 状态管理示例

```typescript
// app/composables/useWorkspace.ts
export const useWorkspace = () => {
  const isCollapsed = ref(false)
  return { isCollapsed }
}
```

## 分页组合式

```typescript
// app/composables/usePage.ts
export interface PaginationData {
  pageIndex: number
  pageSize: number
  total: number
  pageTotal: number
  update: (response: Partial<{ current: number, pageSize: number, total: number, pageTotal?: number }>) => void
}

export function usePage(pageIndex: number = 0, pageSize: number = 10) {
  const data = ref({
    total: 0,
    pageIndex,
    pageSize,
    pageTotal: 0,
  })

  const pagination = computed(() => ({
    current: data.value.pageIndex + 1,
    pageIndex: data.value.pageIndex,
    pageSize: data.value.pageSize,
    total: data.value.total,
    pageTotal: data.value.pageTotal,
    update: updatePage,
  }))

  function updatePage(response: Partial<{ current: number, pageSize: number, total: number, pageTotal?: number }>) {
    data.value.pageIndex = response.current ? response.current - 1 : data.value.pageIndex
    data.value.pageSize = response.pageSize ?? data.value.pageSize
    data.value.total = response.total ?? data.value.total
    data.value.pageTotal = response.pageTotal ?? Math.ceil(data.value.total / data.value.pageSize)
  }

  return { pagination, updatePage }
}
```
