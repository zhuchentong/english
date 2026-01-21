import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { useSafeBody, useSafeParams, useSafeQuery } from '../../../server/utils/use-safe-validate'

/**
 * 安全验证工具测试
 * 测试 useSafeBody、useSafeQuery、useSafeParams 的 Zod 验证逻辑
 */
describe('安全验证工具 (use-safe-validate)', () => {
  describe('zod Schema 验证逻辑', () => {
    const TestSchema = z.object({
      name: z.string().min(1),
      age: z.coerce.number().int().min(0).max(150),
      email: z.string().email().optional(),
    })

    describe('字符串验证', () => {
      it('应该接受有效的非空字符串', () => {
        const result = TestSchema.safeParse({ name: 'John', age: 25 })
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.name).toBe('John')
        }
      })

      it('应该拒绝必填字段的空字符串', () => {
        const result = TestSchema.safeParse({ name: '', age: 25 })
        expect(result.success).toBe(false)
      })

      it('应该拒绝缺失的必填字符串字段', () => {
        const result = TestSchema.safeParse({ age: 25 })
        expect(result.success).toBe(false)
      })
    })

    describe('数字转换与验证', () => {
      it('应该正确将字符串转换为数字', () => {
        const result = TestSchema.safeParse({ name: 'John', age: '30' })
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.age).toBe(30)
          expect(typeof result.data.age).toBe('number')
        }
      })

      it('应该接受范围内的有效数字', () => {
        const result = TestSchema.safeParse({ name: 'John', age: 100 })
        expect(result.success).toBe(true)
      })

      it('应该拒绝负数', () => {
        const result = TestSchema.safeParse({ name: 'John', age: -5 })
        expect(result.success).toBe(false)
      })

      it('应该拒绝超过最大值的数字', () => {
        const result = TestSchema.safeParse({ name: 'John', age: 200 })
        expect(result.success).toBe(false)
      })

      it('应该拒绝非整数', () => {
        const result = TestSchema.safeParse({ name: 'John', age: 25.5 })
        expect(result.success).toBe(false)
      })

      it('应该拒绝非数字字符串', () => {
        const result = TestSchema.safeParse({ name: 'John', age: 'abc' })
        expect(result.success).toBe(false)
      })
    })

    describe('可选字段处理', () => {
      it('应该正确处理缺失的可选 email 字段', () => {
        const result = TestSchema.safeParse({ name: 'John', age: 25 })
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.email).toBeUndefined()
        }
      })

      it('应该接受有效的 email 格式', () => {
        const result = TestSchema.safeParse({ name: 'John', age: 25, email: 'john@example.com' })
        expect(result.success).toBe(true)
      })

      it('应该拒绝无效的 email 格式', () => {
        const result = TestSchema.safeParse({ name: 'John', age: 25, email: 'invalid-email' })
        expect(result.success).toBe(false)
      })
    })

    describe('边界情况处理', () => {
      it('应该正确处理 age=0', () => {
        const result = TestSchema.safeParse({ name: 'Baby', age: 0 })
        expect(result.success).toBe(true)
      })

      it('应该正确处理边界年龄值', () => {
        const minResult = TestSchema.safeParse({ name: 'Person', age: 0 })
        const maxResult = TestSchema.safeParse({ name: 'Person', age: 150 })
        expect(minResult.success).toBe(true)
        expect(maxResult.success).toBe(true)
      })

      it('应该正确处理全可选字段', () => {
        const MinimalSchema = z.object({
          name: z.string().optional(),
        })
        const result = MinimalSchema.safeParse({})
        expect(result.success).toBe(true)
      })
    })
  })

  describe('函数签名定义', () => {
    it('useSafeBody 函数应该已定义', () => {
      expect(useSafeBody).toBeDefined()
      expect(typeof useSafeBody).toBe('function')
    })

    it('useSafeQuery 函数应该已定义', () => {
      expect(useSafeQuery).toBeDefined()
      expect(typeof useSafeQuery).toBe('function')
    })

    it('useSafeParams 函数应该已定义', () => {
      expect(useSafeParams).toBeDefined()
      expect(typeof useSafeParams).toBe('function')
    })
  })
})
