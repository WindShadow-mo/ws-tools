<template>
  <header class="header">
    <router-link to="/" class="header-link">
      <h1>{{ site.name }}</h1>
      <p class="subtitle">{{ site.description }}</p>
    </router-link>
    <p class="author">author: {{ site.author }}</p>
    <span class="tool-count">共 {{ toolCount }} 个工具</span>
  </header>
</template>

<script setup lang="ts">
import { useTools } from '@/composables/useTools'
import site from '@/config/site'

const { toolCount } = useTools()
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 48px 24px 40px;
  text-align: center;
}

.header-link {
  text-decoration: none;
  color: inherit;
}

.header h1 {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 2px;
}

.subtitle {
  margin-top: 10px;
  font-size: 15px;
  opacity: 0.85;
  line-height: 1.7;
}

.author {
  margin-top: 14px;
  font-size: 13px;
  opacity: 0.7;
  letter-spacing: 1px;
}

.tool-count {
  display: inline-block;
  margin-top: 18px;
  padding: 5px 16px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  font-size: 13px;
  letter-spacing: 1px;
}
</style>
