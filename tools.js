/**
 * ws-tools 工具配置文件
 * 新增工具：在 tools 数组中追加一条配置即可
 */
const WS_TOOLS = {
  project: "ws-tools",
  description: "在线工具集合，提供各类实用的小工具，开箱即用",
  author: "WindShadow（风的影子）",
  tools: [
    {
      name: "图片水印生成器",
      description: "上传图片，添加平铺水印或菱形网格水印，支持多种预设模板、图标、旋转、透明度等自定义配置，一键导出 PNG",
      icon: "🖼️",
      href: "./tools/watermark-generator.html",
      tags: ["图片处理", "水印", "PNG"],
    },
  ],
};
