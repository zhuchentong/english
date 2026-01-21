import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('dashboard Pages', () => {
  const appDir = join(process.cwd(), 'app')

  it('dashboard page file should exist', () => {
    const filePath = `${appDir}/pages/index.vue`
    expect(existsSync(filePath)).toBe(true)
  })

  it('dashboard page should contain stat card elements', () => {
    const filePath = `${appDir}/pages/index.vue`
    const content = existsSync(filePath)
      ? readFileSync(filePath, 'utf-8')
      : ''

    expect(content).toContain('t-card')
    expect(content).toContain('wordCount')
    expect(content).toContain('bookCount')
  })

  it('dashboard page should use stats API', () => {
    const filePath = `${appDir}/pages/index.vue`
    const content = existsSync(filePath)
      ? readFileSync(filePath, 'utf-8')
      : ''

    expect(content).toContain('/api/stats')
    expect(content).toContain('useFetch')
  })
})
