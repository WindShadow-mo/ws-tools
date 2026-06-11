/** 工具配置类型 */
export interface ToolConfig {
  /** 工具名称 */
  name: string
  /** 工具描述 */
  description: string
  /** 工具图标 (emoji) */
  icon: string
  /** 路由路径 */
  path: string
  /** 标签 */
  tags: string[]
}

/** 扩展路由 meta 类型 */
declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 是否是工具页面 */
    isTool?: boolean
    /** 工具名称 */
    name?: string
    /** 工具描述 */
    description?: string
    /** 工具图标 */
    icon?: string
    /** 工具标签 */
    tags?: string[]
  }
}
