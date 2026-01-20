import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('books Pages', () => {
  const appDir = join(process.cwd(), 'app')

  it('books list page file should exist', () => {
    const filePath = `${appDir}/pages/books/index.vue`
    expect(existsSync(filePath)).toBe(true)
  })

  it('book detail page file should exist', () => {
    const filePath = `${appDir}/pages/books/[id]/index.vue`
    expect(existsSync(filePath)).toBe(true)
  })
})
