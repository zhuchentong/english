import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../prisma/client'

/**
 * Prisma 客户端数据库连接测试
 * 验证数据库连接建立和基本查询功能
 */
describe('prisma 客户端数据库连接 (prisma-client)', () => {
  beforeEach(async () => {
    await prisma.$disconnect()
  })

  afterEach(async () => {
    await prisma.$disconnect()
  })

  it('应该成功建立数据库连接', async () => {
    await expect(prisma.$connect()).resolves.not.toThrow()
  })

  it('应该能在连接后执行简单查询', async () => {
    await prisma.$connect()
    const result = await prisma.$queryRaw`SELECT 1 as test`
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toHaveProperty('test')
  })

  it('应该正确处理多次连接和断开调用', async () => {
    await prisma.$connect()
    await prisma.$connect()
    await prisma.$disconnect()
    await prisma.$disconnect()
    expect(true).toBe(true)
  })
})
