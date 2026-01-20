<script setup lang="ts">
import WsFooter from '../components/workspace/WsFooter.vue'
import WsHeader from '../components/workspace/WsHeader.vue'
import WsSidebar from '../components/workspace/WsSidebar.vue'
</script>

<template>
  <t-layout class="workspace-layout">
    <t-header>
      <WsHeader />
    </t-header>

    <t-layout>
      <t-aside class="ws-sidebar">
        <WsSidebar />
      </t-aside>

      <t-layout>
        <t-content class="ws-content">
          <div class="absolute inset-0 overflow-auto">
            <slot />
          </div>
        </t-content>
        <t-footer>
          <WsFooter />
        </t-footer>
      </t-layout>
    </t-layout>
  </t-layout>
</template>

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
  position: relative;
}

:deep(.t-layout__footer) {
  padding: 0;
}
</style>
