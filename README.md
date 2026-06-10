# ws-tools

在线工具集合，提供各类实用的前端小工具，开箱即用，无需安装。

## 工具列表

| 工具 | 文件 | 说明 |
|------|------|------|
| 图片水印生成器 | `watermark-generator.html` | 上传图片，添加平铺水印或菱形网格水印，支持模板、图标、旋转、透明度等自定义配置，一键导出 PNG |

> 图片水印生成器详细功能说明见 [`doc/watermark-generator-doc.md`](./doc/watermark-generator-doc.md)

## 使用方式

直接双击对应的 `.html` 文件，在浏览器中打开即可使用，无需部署、无需后端服务。
首页 `index.html` 双击即可打开（工具数据从 `tools.js` 加载，`<script>` 标签在 `file://` 下无限制）。

## 目录结构

```
ws-tools/
├── README.md
├── index.html                     # 首页（从 tools.js 读取工具列表）
├── tools.js                       # 工具配置文件（新增工具时在此添加）
├── watermark-generator.html       # 图片水印生成器
└── doc/
    └── watermark-generator-doc.md # 水印生成器功能文档
```

## 新增工具

1. 将工具 HTML 文件放在项目根目录
2. 在 `tools.js` 的 `tools` 数组中追加一条配置
3. 双击 `index.html` 刷新即可看到新工具卡片
