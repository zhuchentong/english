<script setup lang="ts">
import { useWorkspace } from '@/composables/useWorkspace'

const route = useRoute()
const { isCollapsed, toggleSidebar } = useWorkspace()

const activeMenu = computed(() => route.path)

function handleMenuChange(value: string) {
  navigateTo(value)
}
</script>

<template>
  <t-menu
    :value="activeMenu"
    theme="light"
    :collapsed="isCollapsed"
    :width="['232px', '64px']"
    @change="(value) => handleMenuChange(value as string)"
  >
    <t-menu-item value="/words" to="/words">
      <template #icon>
        <t-icon name="book" />
      </template>
      单词书列表
    </t-menu-item>

    <t-menu-item value="/word-list" to="/word-list">
      <template #icon>
        <t-icon name="list" />
      </template>
      单词列表
    </t-menu-item>

    <template #operations>
      <t-button
        variant="text"
        shape="square"
        @click="toggleSidebar"
      >
        <template #icon>
          <t-icon :name="isCollapsed ? 'chevron-right' : 'chevron-left'" />
        </template>
      </t-button>
    </template>
  </t-menu>
</template>

<style scoped>
.ws-sidebar {
  height: calc(100vh - 64px - 48px);
}
</style>
