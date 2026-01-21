import type { PageBuilderOptions } from '../../../server/utils/define-page-builder'
import { describe, expect, it } from 'vitest'
import { PageBuilder, PageLikeSchema } from '../../../server/utils/define-page-builder'

/**
 * 分页构建器测试
 * 测试 PageLikeSchema 验证逻辑和 PageBuilder 类的功能
 */
describe('分页构建器 (define-page-builder)', () => {
  describe('pageLikeSchema 验证逻辑', () => {
    it('应该使用正确的默认值', () => {
      const result = PageLikeSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.pageIndex).toBe(0)
        expect(result.data.pageSize).toBe(10)
      }
    })

    it('应该正确转换 pageIndex 字符串为数字', () => {
      const result = PageLikeSchema.safeParse({ pageIndex: '5' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.pageIndex).toBe(5)
      }
    })

    it('应该正确转换 pageSize 字符串为数字', () => {
      const result = PageLikeSchema.safeParse({ pageSize: '25' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.pageSize).toBe(25)
      }
    })

    it('应该拒绝负数的 pageIndex', () => {
      const result = PageLikeSchema.safeParse({ pageIndex: -1 })
      expect(result.success).toBe(false)
    })

    it('应该拒绝小于 1 的 pageSize', () => {
      const result = PageLikeSchema.safeParse({ pageSize: 0 })
      expect(result.success).toBe(false)
    })

    it('应该拒绝大于 100 的 pageSize', () => {
      const result = PageLikeSchema.safeParse({ pageSize: 101 })
      expect(result.success).toBe(false)
    })

    it('应该接受最大有效值 pageSize=100', () => {
      const result = PageLikeSchema.safeParse({ pageSize: 100 })
      expect(result.success).toBe(true)
    })

    it('应该接受最小有效值 pageIndex=0', () => {
      const result = PageLikeSchema.safeParse({ pageIndex: 0 })
      expect(result.success).toBe(true)
    })
  })

  describe('pageBuilder.toPageArgs() 分页参数计算', () => {
    it('应该正确计算第一页的 skip 值', () => {
      const builder = new PageBuilder({ pageIndex: 0, pageSize: 10 })
      expect(builder.toPageArgs()).toEqual({ skip: 0, take: 10 })
    })

    it('应该正确计算第五页的 skip 值', () => {
      const builder = new PageBuilder({ pageIndex: 5, pageSize: 20 })
      expect(builder.toPageArgs()).toEqual({ skip: 100, take: 20 })
    })

    it('应该正确处理大页码', () => {
      const builder = new PageBuilder({ pageIndex: 100, pageSize: 50 })
      expect(builder.toPageArgs()).toEqual({ skip: 5000, take: 50 })
    })

    it('应该正确处理最大 pageSize=100', () => {
      const builder = new PageBuilder({ pageIndex: 10, pageSize: 100 })
      expect(builder.toPageArgs()).toEqual({ skip: 1000, take: 100 })
    })

    it('应该正确处理 pageIndex=1', () => {
      const builder = new PageBuilder({ pageIndex: 1, pageSize: 10 })
      expect(builder.toPageArgs()).toEqual({ skip: 10, take: 10 })
    })
  })

  describe('pageBuilder.toPageResponse() 分页响应构建', () => {
    it('应该构建正确的分页响应结构', () => {
      const builder = new PageBuilder({ pageIndex: 1, pageSize: 10 })
      const content = [{ id: 1, title: 'Book 1' }, { id: 2, title: 'Book 2' }]
      const response = builder.toPageResponse(content, 25)
      expect(response).toEqual({
        content,
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 3,
        total: 25,
      })
    })

    it('应该正确计算整除时的总页数', () => {
      const builder = new PageBuilder({ pageIndex: 0, pageSize: 10 })
      const response = builder.toPageResponse([], 100)
      expect(response.pageTotal).toBe(10)
    })

    it('应该正确计算非整除时的总页数', () => {
      const builder = new PageBuilder({ pageIndex: 0, pageSize: 10 })
      const response = builder.toPageResponse([], 95)
      expect(response.pageTotal).toBe(10)
    })

    it('应该正确处理单页数据', () => {
      const builder = new PageBuilder({ pageIndex: 0, pageSize: 10 })
      const response = builder.toPageResponse([], 5)
      expect(response.pageTotal).toBe(1)
    })

    it('应该正确处理空数据且 total=0', () => {
      const builder = new PageBuilder({ pageIndex: 0, pageSize: 10 })
      const response = builder.toPageResponse([], 0)
      expect(response).toEqual({
        content: [],
        pageIndex: 0,
        pageSize: 10,
        pageTotal: 0,
        total: 0,
      })
    })

    it('应该正确处理大量数据', () => {
      const builder = new PageBuilder({ pageIndex: 999, pageSize: 100 })
      const response = builder.toPageResponse([], 100000)
      expect(response.pageTotal).toBe(1000)
    })

    it('应该保留原始内容引用', () => {
      const builder = new PageBuilder({ pageIndex: 0, pageSize: 10 })
      const content = [{ id: 1 }]
      const response = builder.toPageResponse(content, 1)
      expect(response.content).toBe(content)
    })
  })

  describe('pageBuilderOptions 类型定义', () => {
    it('应该接受有效的选项对象', () => {
      const options: PageBuilderOptions = { pageIndex: 2, pageSize: 20 }
      expect(options.pageIndex).toBe(2)
      expect(options.pageSize).toBe(20)
    })

    it('应该允许自定义选项值', () => {
      const options: PageBuilderOptions = { pageIndex: 0, pageSize: 50 }
      expect(options.pageIndex).toBe(0)
      expect(options.pageSize).toBe(50)
    })

    it('应该具有正确的类型', () => {
      const options: PageBuilderOptions = { pageIndex: 0, pageSize: 10 }
      expect(typeof options.pageIndex).toBe('number')
      expect(typeof options.pageSize).toBe('number')
    })
  })

  describe('pageBuilder 类结构', () => {
    it('应该正确存储配置选项', () => {
      const options: PageBuilderOptions = { pageIndex: 3, pageSize: 15 }
      const builder = new PageBuilder(options)
      expect(builder).toBeDefined()
    })

    it('应该具有 toPageArgs 方法', () => {
      const builder = new PageBuilder({ pageIndex: 0, pageSize: 10 })
      expect(typeof builder.toPageArgs).toBe('function')
    })

    it('应该具有 toPageResponse 方法', () => {
      const builder = new PageBuilder({ pageIndex: 0, pageSize: 10 })
      expect(typeof builder.toPageResponse).toBe('function')
    })
  })
})
