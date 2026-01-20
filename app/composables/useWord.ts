import type { PaginationData } from './usePage'

interface UseWordOptions {
  bookId: number
  pagination: ComputedRef<PaginationData>
}

export async function useWord({ bookId, pagination }: UseWordOptions) {
  const { data, pending, error, refresh } = await useFetch(`/api/books/${bookId}/words`, {
    method: 'GET',
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
  }, {
    immediate: true,
  })

  return {
    data: computed(() => data.value?.content ?? []),
    pending,
    error,
    refresh,
  }
}
