import type { Prisma } from '@prisma/client'
import type { PaginationData } from './usePage'

type Book = Prisma.BookGetPayload<{
  select: {
    id: true
    name: true
    description: true
    wordCount: true
    isPublic: true
    createdAt: true
  }
}>

interface PaginatedResponse<T> {
  content: T[]
  pageIndex: number
  pageSize: number
  total: number
  pageTotal: number
}

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
