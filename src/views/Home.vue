<template>
  <div class="container">
    <div class="section-title">全部工具</div>

    <div v-if="tools.length > 0" class="tool-grid">
      <ToolCard v-for="tool in tools" :key="tool.path" :tool="tool" />
    </div>

    <div v-else class="placeholder">
      <div class="ph-icon">📂</div>
      <p>暂无工具</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTools } from '@/composables/useTools'
import ToolCard from '@/components/ToolCard.vue'

const { tools } = useTools()
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 32px auto;
  padding: 0 20px 60px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #888;
  letter-spacing: 2px;
  margin-bottom: 20px;
  padding-left: 4px;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.placeholder {
  text-align: center;
  padding: 80px 20px;
  color: #aaa;
}

.ph-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.placeholder p {
  font-size: 14px;
  line-height: 1.8;
}

.placeholder code {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
  color: #555;
}
</style>
