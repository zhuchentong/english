<template>
  <t-layout class="workspace-layout">
    <t-header>
      <WsHeader />
    </t-header>

    <t-layout>
      <t-aside class="ws-sidebar">
        <WsSidebar />
      </t-aside>

      <t-content class="ws-content">
        <slot />
      </t-content>
    </t-layout>

    <t-footer>
      <WsFooter />
    </t-footer>
  </t-layout>
</template>

<script setup lang="ts">
import WsHeader from '../components/workspace/WsHeader.vue'
import WsSidebar from '../components/workspace/WsSidebar.vue'
import WsFooter from '../components/workspace/WsFooter.vue'
</script>

<style scoped>
.workspace-layout {
  height: 100vh;
  overflow: hidden;
}

.ws-sidebar {
  background-color: #f5f5f5;
  border-right: 1px solid #e7e7e7;
}

.ws-content {
  overflow-y: auto;
  background-color: #f5f5f5;
}

:deep(.t-layout__footer){
  padding: 0;
}
</style>
