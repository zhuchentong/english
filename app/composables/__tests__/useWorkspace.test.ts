import { describe, it, expect } from 'vitest'
import { useWorkspace } from '@/composables/useWorkspace'

describe('useWorkspace', () => {
  it('should initialize with collapsed set to false', () => {
    const { isCollapsed } = useWorkspace()

    expect(isCollapsed.value).toBe(false)
  })

  it('should toggle sidebar collapsed state', () => {
    const { isCollapsed, toggleSidebar } = useWorkspace()

    expect(isCollapsed.value).toBe(false)

    toggleSidebar()
    expect(isCollapsed.value).toBe(true)

    toggleSidebar()
    expect(isCollapsed.value).toBe(false)
  })

  it('should set sidebar collapsed state explicitly', () => {
    const { isCollapsed, setCollapsed } = useWorkspace()

    expect(isCollapsed.value).toBe(false)

    setCollapsed(true)
    expect(isCollapsed.value).toBe(true)

    setCollapsed(false)
    expect(isCollapsed.value).toBe(false)
  })
})
