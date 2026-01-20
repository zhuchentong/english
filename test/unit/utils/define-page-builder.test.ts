import { describe, expect, it } from 'vitest'
import { definePageBuilder } from '../../../server/utils/define-page-builder'
import { createMockEvent } from './create-mock-event'

describe('definePageBuilder function', () => {
  describe('with H3Event', () => {
    it('should create PageBuilder with valid query parameters', async () => {
      const event = createMockEvent('http://localhost:3000/api/test?pageIndex=1&pageSize=20')
      const pageBuilder = await definePageBuilder(event)

      const args = pageBuilder.toPageArgs()
      expect(args).toEqual({
        skip: 20,
        take: 20,
      })
    })

    it('should handle pageIndex=0', async () => {
      const event = createMockEvent('http://localhost:3000/api/test?pageIndex=0&pageSize=10')
      const pageBuilder = await definePageBuilder(event)

      const args = pageBuilder.toPageArgs()
      expect(args).toEqual({
        skip: 0,
        take: 10,
      })
    })

    it('should handle minimum pageSize=1', async () => {
      const event = createMockEvent('http://localhost:3000/api/test?pageIndex=2&pageSize=1')
      const pageBuilder = await definePageBuilder(event)

      const args = pageBuilder.toPageArgs()
      expect(args).toEqual({
        skip: 2,
        take: 1,
      })
    })

    it('should handle maximum pageSize=100', async () => {
      const event = createMockEvent('http://localhost:3000/api/test?pageIndex=0&pageSize=100')
      const pageBuilder = await definePageBuilder(event)

      const args = pageBuilder.toPageArgs()
      expect(args).toEqual({
        skip: 0,
        take: 100,
      })
    })

    it('should throw error when pageIndex < 0', async () => {
      const event = createMockEvent('http://localhost:3000/api/test?pageIndex=-1&pageSize=10')

      await expect(definePageBuilder(event)).rejects.toThrow()
    })

    it('should throw error when pageSize = 0', async () => {
      const event = createMockEvent('http://localhost:3000/api/test?pageIndex=0&pageSize=0')

      await expect(definePageBuilder(event)).rejects.toThrow()
    })

    it('should throw error when pageSize > 100', async () => {
      const event = createMockEvent('http://localhost:3000/api/test?pageIndex=0&pageSize=101')

      await expect(definePageBuilder(event)).rejects.toThrow()
    })

    it('should throw error when pageIndex is not integer', async () => {
      const event = createMockEvent('http://localhost:3000/api/test?pageIndex=1.5&pageSize=10')

      await expect(definePageBuilder(event)).rejects.toThrow()
    })

    it('should throw error when pageSize is not integer', async () => {
      const event = createMockEvent('http://localhost:3000/api/test?pageIndex=1&pageSize=10.5')

      await expect(definePageBuilder(event)).rejects.toThrow()
    })
  })

  describe('with PageBuilderOptions', () => {
    it('should create PageBuilder with provided options', async () => {
      const options = { pageIndex: 2, pageSize: 15 }
      const pageBuilder = await definePageBuilder(options)

      const args = pageBuilder.toPageArgs()
      expect(args).toEqual({
        skip: 30,
        take: 15,
      })
    })

    it('should handle pageIndex=0', async () => {
      const options = { pageIndex: 0, pageSize: 25 }
      const pageBuilder = await definePageBuilder(options)

      const args = pageBuilder.toPageArgs()
      expect(args).toEqual({
        skip: 0,
        take: 25,
      })
    })

    it('should handle large pageIndex', async () => {
      const options = { pageIndex: 100, pageSize: 10 }
      const pageBuilder = await definePageBuilder(options)

      const args = pageBuilder.toPageArgs()
      expect(args).toEqual({
        skip: 1000,
        take: 10,
      })
    })
  })
})

describe('page builder toPageResponse method', () => {
  it('should format response correctly', async () => {
    const pageBuilder = await definePageBuilder({ pageIndex: 1, pageSize: 10 })
    const content = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const total = 25

    const response = pageBuilder.toPageResponse(content, total)

    expect(response).toEqual({
      content,
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 3,
      total: 25,
    })
  })

  it('should calculate pageTotal correctly with exact division', async () => {
    const pageBuilder = await definePageBuilder({ pageIndex: 0, pageSize: 10 })
    const content = Array.from({ length: 10 }).map((_, i) => ({ id: i + 1 }))
    const total = 10

    const response = pageBuilder.toPageResponse(content, total)

    expect(response.pageTotal).toBe(1)
  })

  it('should calculate pageTotal correctly with remainder', async () => {
    const pageBuilder = await definePageBuilder({ pageIndex: 0, pageSize: 10 })
    const content = [{ id: 1 }]
    const total = 11

    const response = pageBuilder.toPageResponse(content, total)

    expect(response.pageTotal).toBe(2)
  })

  it('should handle empty content', async () => {
    const pageBuilder = await definePageBuilder({ pageIndex: 0, pageSize: 10 })
    const content: any[] = []
    const total = 0

    const response = pageBuilder.toPageResponse(content, total)

    expect(response).toEqual({
      content: [],
      pageIndex: 0,
      pageSize: 10,
      pageTotal: 0,
      total: 0,
    })
  })

  it('should handle partial last page', async () => {
    const pageBuilder = await definePageBuilder({ pageIndex: 2, pageSize: 10 })
    const content = [{ id: 21 }, { id: 22 }, { id: 23 }]
    const total = 23

    const response = pageBuilder.toPageResponse(content, total)

    expect(response).toEqual({
      content,
      pageIndex: 2,
      pageSize: 10,
      pageTotal: 3,
      total: 23,
    })
  })
})
