<template>
  <router-link :to="tool.path" class="no-underline">
    <Card class="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 group overflow-hidden relative">
      <!-- 顶部渐变条 -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader class="pb-2">
        <div class="text-4xl mb-4">{{ tool.icon || '🔧' }}</div>
        <CardTitle class="text-base font-semibold">{{ tool.name }}</CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription class="text-sm leading-relaxed line-clamp-3">
          {{ tool.description }}
        </CardDescription>

        <div class="flex gap-1.5 flex-wrap mt-3">
          <Badge
            v-for="tag in tool.tags"
            :key="tag"
            variant="secondary"
            class="text-xs px-2 py-0.5"
          >
            {{ tag }}
          </Badge>
        </div>
      </CardContent>

      <CardFooter class="justify-end pt-3 border-t">
        <span class="text-sm font-semibold text-primary">
          进入 →
        </span>
      </CardFooter>
    </Card>
  </router-link>
</template>

<script setup lang="ts">
import type { ToolConfig } from '@/types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

defineProps<{
  tool: ToolConfig
}>()
</script>
