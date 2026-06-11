<template>
  <div id="app-wrapper">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import site from '@/config/site'

// 全局 SEO meta
useHead({
  title: `${site.name} · ${site.tagline}`,
  meta: [
    { name: 'description', content: site.description },
    { name: 'keywords', content: site.keywords.join(',') },
    { name: 'author', content: site.author },

    // Open Graph（分享到社交平台）
    { property: 'og:title', content: `${site.name} · ${site.tagline}` },
    { property: 'og:description', content: site.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: site.name },

    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: `${site.name} · ${site.tagline}` },
    { name: 'twitter:description', content: site.description },
  ],
})
</script>

<style scoped>
#app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
