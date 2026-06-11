<template>
  <div class="tool-header">
    <router-link to="/" class="back-link">← 返回首页</router-link>
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<style scoped>
.tool-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 24px 0;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.back-link {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;
}

.back-link:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.tool-header {
  position: relative;
}

.tool-header h1 {
  font-size: 26px;
  font-weight: 600;
}

.tool-header p {
  margin-top: 6px;
  font-size: 14px;
  opacity: 0.85;
}
</style>
