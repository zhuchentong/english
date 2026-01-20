import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'
import { useBook } from '~/composables/useBook'

describe('useBook Composable', () => {
  beforeEach(() => {
    registerEndpoint('/api/books', () => ({
      data: [],
      pagination: { total: 0, page: 1, pageSize: 50, totalPages: 0 },
    }))
  })

  it('should provide selectedBookId reactive state', () => {
    const { selectedBookId } = useBook()

    expect(selectedBookId.value).toBeNull()

    selectedBookId.value = 1
    expect(selectedBookId.value).toBe(1)
  })

  it('should export fetchWords function', () => {
    const { fetchWords } = useBook()

    expect(fetchWords).toBeDefined()
    expect(typeof fetchWords).toBe('function')
  })

  it('should export books computed property', () => {
    const { books } = useBook()

    expect(books).toBeDefined()
    expect(books.value).toEqual([])
  })

  it('should export booksPending ref', () => {
    const { booksPending } = useBook()

    expect(booksPending).toBeDefined()
    expect(typeof booksPending.value).toBe('boolean')
  })

  it('should export booksError ref', () => {
    const { booksError } = useBook()

    expect(booksError).toBeDefined()
    expect(booksError.value).toBeFalsy()
  })

  it('should export refreshBooks function', () => {
    const { refreshBooks } = useBook()

    expect(refreshBooks).toBeDefined()
    expect(typeof refreshBooks).toBe('function')
  })

  it('should allow updating selectedBookId to null', () => {
    const { selectedBookId } = useBook()

    selectedBookId.value = 1
    expect(selectedBookId.value).toBe(1)

    selectedBookId.value = null
    expect(selectedBookId.value).toBeNull()
  })
})
