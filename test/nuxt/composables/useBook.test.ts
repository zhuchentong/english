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

  it('should fetch books successfully', async () => {
    registerEndpoint('/api/books', () => ({
      data: [
        { id: 1, name: 'Test Book', description: 'Test', wordCount: 10, isPublic: true, createdAt: new Date().toISOString() },
      ],
      pagination: { total: 1, page: 1, pageSize: 50, totalPages: 1 },
    }))

    const { books, refreshBooks } = useBook()
    await refreshBooks()

    expect(books.value).toHaveLength(1)
    expect(books.value[0].name).toBe('Test Book')
    expect(books.value[0].id).toBe(1)
    expect(books.value[0].wordCount).toBe(10)
  })

  it('should fetch words for a specific book', async () => {
    registerEndpoint('/api/books/1/words', () => ({
      data: [
        { id: 1, word: 'hello', phoneticUK: '/həˈləʊ/', phoneticUS: '/həˈloʊ/', difficulty: 1, viewCount: 0, definition: '你好', itemId: 1, addedAt: new Date().toISOString() },
      ],
      pagination: { total: 1, page: 1, pageSize: 50, totalPages: 1 },
    }))

    const { fetchWords } = useBook()
    const result = await fetchWords(1)

    expect(result.data).toHaveLength(1)
    expect(result.data[0].word).toBe('hello')
    expect(result.data[0].definition).toBe('你好')
  })

  it('should fetch words with pagination parameters', async () => {
    registerEndpoint('/api/books/1/words', () => ({
      data: [
        { id: 1, word: 'hello', phoneticUK: '/həˈləʊ/', phoneticUS: '/həˈloʊ/', difficulty: 1, viewCount: 0, definition: '你好', itemId: 1, addedAt: new Date().toISOString() },
      ],
      pagination: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    }))

    const { fetchWords } = useBook()
    const result = await fetchWords(1, 1, 10)

    expect(result.data).toHaveLength(1)
    expect(result.pagination.pageSize).toBe(10)
  })

  it('should handle empty books list', async () => {
    const { books, refreshBooks } = useBook()
    await refreshBooks()

    expect(books.value).toEqual([])
    expect(books.value.length).toBe(0)
  })

  it('should handle empty words list', async () => {
    registerEndpoint('/api/books/1/words', () => ({
      data: [],
      pagination: { total: 0, page: 1, pageSize: 50, totalPages: 0 },
    }))

    const { fetchWords } = useBook()
    const result = await fetchWords(1)

    expect(result.data).toEqual([])
    expect(result.pagination.total).toBe(0)
  })
})
