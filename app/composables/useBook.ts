interface Book {
  id: number
  name: string
  description: string | null
  wordCount: number
  isPublic: boolean
  createdAt: string
}

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
  data: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export function useBook() {
  const selectedBookId = ref<number | null>(null)

  const { data: booksData, pending: booksPending, error: booksError, refresh: refreshBooks }
    = useFetch<PaginatedResponse<Book>>('/api/books', {
      default: () => ({ data: [], pagination: { total: 0, page: 1, pageSize: 50, totalPages: 0 } }),
    })

  async function fetchWords(bookId: number, page = 1, pageSize = 10) {
    try {
      const response = await $fetch<PaginatedResponse<Word>>(`/api/books/${bookId}/words`, {
        query: { page, pageSize },
      })
      return response
    }
    catch {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch words',
      })
    }
  }

  return {
    selectedBookId,
    books: computed(() => booksData.value?.data ?? []),
    booksPending,
    booksError,
    refreshBooks,
    fetchWords,
  }
}
