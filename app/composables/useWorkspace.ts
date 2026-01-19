export function useWorkspace() {
  const isCollapsed = ref(false)

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
  }

  const setCollapsed = (collapsed: boolean) => {
    isCollapsed.value = collapsed
  }

  return {
    isCollapsed,
    toggleSidebar,
    setCollapsed,
  }
}
