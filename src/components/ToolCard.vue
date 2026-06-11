<template>
  <router-link :to="tool.path" class="tool-card">
    <div class="tool-icon">{{ tool.icon || '🔧' }}</div>
    <div class="tool-name">{{ tool.name }}</div>
    <div class="tool-desc">{{ tool.description }}</div>
    <div class="tool-tags">
      <span v-for="tag in tool.tags" :key="tag" class="tool-tag">{{ tag }}</span>
    </div>
    <div class="tool-footer">
      <span class="tool-enter">进入 →</span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { ToolConfig } from '@/types'

defineProps<{
  tool: ToolConfig
}>()
</script>

<style scoped>
.tool-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 28px 24px 22px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.2s;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.18);
}

.tool-card:hover::before {
  opacity: 1;
}

.tool-icon {
  font-size: 40px;
  margin-bottom: 16px;
  line-height: 1;
}

.tool-name {
  font-size: 17px;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}

.tool-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 16px;
}

.tool-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.tool-tag {
  padding: 2px 9px;
  background: #f0f3ff;
  color: #667eea;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.tool-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.tool-enter {
  font-size: 13px;
  font-weight: 600;
  color: #667eea;
}
</style>
