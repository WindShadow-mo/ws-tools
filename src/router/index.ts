import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

/** 工具页面 meta 信息 */
export interface ToolMeta {
  /** 工具名称 */
  name: string
  /** 工具描述 */
  description: string
  /** 工具图标 */
  icon: string
  /** 工具标签 */
  tags: string[]
}

// 扩展路由 meta 类型（命名空间方式，避免属性冲突）
declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 工具相关配置 */
    tool?: ToolMeta
    // 将来可扩展其他命名空间：
    // auth?: AuthMeta
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/tools/watermark',
    name: 'WatermarkGenerator',
    component: () => import('@/views/tools/WatermarkGenerator.vue'),
    meta: {
      title: '图片水印生成器',
      tool: {
        name: '图片水印生成器',
        description: '上传图片，添加平铺水印或菱形网格水印，支持多种预设模板、图标、旋转、透明度等自定义配置，一键导出 PNG',
        icon: '🖼️',
        tags: ['图片处理', '水印', 'PNG'],
      },
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, _from, next) => {
  const title = to.meta.title
  if (title) {
    document.title = `${title}`
  } else {
    document.title = 'WindShadow · 在线工具集'
  }
  next()
})

export default router
