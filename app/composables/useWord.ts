import type { Pagination } from './usePage'

interface Word {
  id: number
  word: string
  phoneticUK: string | null
  phoneticUS: string | null
  difficulty: number
  viewCount: number
  definition: string
  itemId: number
  addedAt: string
}

interface PaginatedResponse<T> {
  content: T[]
  pageIndex: number
  pageSize: number
  total: number
  pageTotal: number
}

interface UseWordOptions {
  bookId: number
  pagination: Ref<Pagination>
}

export function useWord({ bookId, pagination }: UseWordOptions) {
  const wordsUrl = computed(() => `/api/books/${bookId}/words`)

  const { data, pending, error, refresh }
    = useFetch<PaginatedResponse<Word>>(wordsUrl, {
      query: {
        pageIndex: pagination.value.pageIndex,
        pageSize: pagination.value.pageSize,
      },
      default: () => ({ content: [], pageIndex: 0, pageSize: 9, total: 0, pageTotal: 0 }),
      immediate: false,
      transform: (response) => {
        if (response) {
          pagination.value.pageTotal = response.pageTotal
        }
        return response
      },
    })

  watch(() => [pagination.value.pageIndex, pagination.value.pageSize], async () => {
    refresh()
  })

  return {
    data: computed(() => data.value?.content ?? []),
    pending,
    error,
    refresh,
  }
}
