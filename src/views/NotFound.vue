<template>
  <div class="not-found">
    <div class="error-code">404</div>
    <div class="error-icon">🔍</div>
    <h2 class="error-title">页面不存在</h2>
    <p class="error-desc">抱歉，您访问的页面不存在或已被移除</p>
    <router-link to="/" class="back-btn">
      <span>←</span> 返回首页
    </router-link>
  </div>
</template>

<script setup lang="ts">
// 404 页面
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px 20px;
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 8px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 24px;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.error-desc {
  font-size: 15px;
  color: #888;
  margin-bottom: 32px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
}

.back-btn span {
  font-size: 18px;
}
</style>
