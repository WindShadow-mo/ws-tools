import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ToolConfig } from '@/types'

/**
 * 从路由配置中自动提取工具列表
 * 工具页面需要在路由 meta 中配置 tool 字段
 */
export function useTools() {
  const router = useRouter()

  const tools = computed<ToolConfig[]>(() => {
    return router
      .getRoutes()
      .filter(route => route.meta?.tool)  // 有 meta.tool 的就是工具页面
      .map(route => ({
        name: route.meta.tool!.name,
        description: route.meta.tool!.description,
        icon: route.meta.tool!.icon,
        path: route.path,
        tags: route.meta.tool!.tags,
      }))
  })

  const toolCount = computed(() => tools.value.length)

  return {
    tools,
    toolCount,
  }
}
