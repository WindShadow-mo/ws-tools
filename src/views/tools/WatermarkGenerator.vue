<template>
  <div class="tool-page">
    <ToolHeader
      title="图片水印生成器"
      subtitle="输入文字，自定义样式，生成 PNG 透明水印图片"
    />

    <div class="container">
      <!-- 左侧控制面板 -->
      <div class="panel">
        <h2>水印设置</h2>

        <!-- 上传图片区域 -->
        <div class="form-group">
          <label>上传背景图片</label>
          <div
            v-if="!uploadedImage"
            class="upload-zone"
            :class="{ dragover }"
            @dragover.prevent="dragover = true"
            @dragleave="dragover = false"
            @drop.prevent="handleDrop"
          >
            <div class="icon">+</div>
            <div>点击或拖拽上传图片</div>
            <div class="tip">支持 JPG / PNG / WebP / BMP</div>
            <input
              type="file"
              accept="image/*"
              @change="handleFileSelect"
            />
          </div>
          <div v-else class="img-info">
            <span>{{ fileInfo }}</span>
            <button class="remove-btn" @click="removeImage">移除</button>
          </div>
        </div>

        <!-- 水印模板 -->
        <div class="template-section">
          <label>快速模板</label>
          <div class="template-grid">
            <div
              v-for="tpl in templates"
              :key="tpl.key"
              class="template-card"
              :class="{ active: currentTemplate === tpl.key }"
              @click="applyTemplate(tpl.key)"
            >
              <span class="tpl-icon">{{ tpl.icon }}</span>
              <span class="tpl-name">{{ tpl.name }}</span>
              <span class="tpl-desc">{{ tpl.desc }}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>水印文字</label>
          <textarea
            v-model="watermarkText"
            placeholder="请输入水印文字，支持多行"
          />
        </div>

        <div class="form-group">
          <label>字体</label>
          <select v-model="fontFamily">
            <option value="Microsoft YaHei">微软雅黑</option>
            <option value="SimHei">黑体</option>
            <option value="SimSun">宋体</option>
            <option value="KaiTi">楷体</option>
            <option value="FangSong">仿宋</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>

        <div class="form-group">
          <label>字体大小</label>
          <div class="range-wrap">
            <input type="range" v-model.number="fontSize" min="12" max="200" />
            <span class="range-val">{{ fontSize }}px</span>
          </div>
        </div>

        <div class="form-group">
          <label>旋转角度</label>
          <div class="range-wrap">
            <input type="range" v-model.number="rotation" min="-180" max="180" />
            <span class="range-val">{{ rotation }}°</span>
          </div>
        </div>

        <div class="form-group">
          <label>透明度</label>
          <div class="range-wrap">
            <input type="range" v-model.number="opacity" min="1" max="100" />
            <span class="range-val">{{ opacity }}%</span>
          </div>
        </div>

        <div class="form-group">
          <label>文字颜色</label>
          <div class="color-input">
            <input type="color" v-model="textColor" />
            <span>{{ textColor.toUpperCase() }}</span>
          </div>
        </div>

        <!-- 网格水印专属控件 -->
        <template v-if="isGridMode">
          <div class="form-group">
            <label>图标选择</label>
            <div class="icon-picker">
              <div
                v-for="icon in iconList"
                :key="icon.key"
                class="icon-btn"
                :class="{ active: currentIcon === icon.key }"
                :title="icon.name"
                @click="currentIcon = icon.key"
              >
                <span class="icon-tip">{{ icon.name }}</span>
                <svg viewBox="0 0 24 24">
                  <path :d="icon.path" />
                </svg>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>网格大小</label>
            <div class="range-wrap">
              <input type="range" v-model.number="gridSpacing" min="300" max="600" />
            </div>
          </div>

          <div class="form-group">
            <label>网格线条粗细</label>
            <div class="range-wrap">
              <input type="range" v-model.number="gridLineWidth" min="30" max="150" />
              <span class="range-val">{{ (gridLineWidth / 10).toFixed(1) }}px</span>
            </div>
          </div>
        </template>

        <button class="btn btn-outline" @click="resetConfig">重置配置</button>
        <button class="btn btn-download" @click="download">下载 PNG 图片</button>
      </div>

      <!-- 右侧预览区域 -->
      <div class="panel preview-area">
        <h2>预览效果</h2>
        <div class="canvas-wrapper">
          <canvas ref="canvasRef"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'

// === 类型定义 ===
interface Template {
  key: string
  icon: string
  name: string
  desc: string
  text: string
  isGrid?: boolean
  iconKey?: string
}

interface IconItem {
  key: string
  name: string
  path: string
}

// === 模板配置 ===
const templates: Template[] = [
  { key: 'confidential', icon: '🔒', name: '机密文件', desc: 'CONFIDENTIAL 密级', text: '机密\nCONFIDENTIAL' },
  { key: 'internal', icon: '🏢', name: '内部文件', desc: '内部使用 严禁外传', text: '内部文件\n严禁外传' },
  { key: 'draft', icon: '📝', name: '设计评审', desc: 'DRAFT 草稿评审', text: 'DRAFT\n评审中' },
  { key: 'idcard', icon: '🪪', name: '证件用途', desc: '仅供办理业务使用', text: '仅供办理XX业务使用\n他用无效' },
  { key: 'contract', icon: '📋', name: '合同副本', desc: '合同副本 与原件一致', text: '合同副本\n与原件一致' },
  { key: 'invoice', icon: '🧾', name: '发票专用', desc: '发票专用 仅限报销', text: '发票专用\n仅限报销使用' },
  { key: 'copyright', icon: '©️', name: '版权声明', desc: 'All Rights Reserved', text: '© 2024 Your Name\nAll Rights Reserved' },
  { key: 'void', icon: '⛔', name: '已作废', desc: 'VOID 已作废', text: '已作废\nVOID' },
  { key: 'grid', icon: '◇', name: '网格水印', desc: '菱形网格线条 + 图标 + 文字', text: '138-0000-0000', isGrid: true, iconKey: 'phone' },
]

// === 图标配置 ===
const iconList: IconItem[] = [
  { key: 'none', name: '无图标', path: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' },
  { key: 'phone', name: '电话', path: 'M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25 1.12.37 2.32.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' },
  { key: 'email', name: '邮件', path: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' },
  { key: 'chat', name: '微信/聊天', path: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z' },
  { key: 'globe', name: '网址', path: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z' },
  { key: 'lock', name: '锁/安全', path: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z' },
  { key: 'star', name: '星星', path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' },
  { key: 'location', name: '位置', path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z' },
]

// === 响应式状态 ===
const canvasRef = ref<HTMLCanvasElement | null>(null)
const uploadedImage = ref<HTMLImageElement | null>(null)
const uploadedFileName = ref('')
const fileInfo = ref('')
const dragover = ref(false)
const currentTemplate = ref('')

let canvasW = 800
let canvasH = 600

// 水印配置
const watermarkText = ref('仅供内部使用')
const fontFamily = ref('Microsoft YaHei')
const fontSize = ref(40)
const rotation = ref(-30)
const opacity = ref(20)
const textColor = ref('#000000')
const currentIcon = ref('phone')
const gridSpacing = ref(360)
const gridLineWidth = ref(80)

// 计算属性
const isGridMode = ref(false)

// === Cookie 持久化 ===
const COOKIE_NAME = 'wm_gen_cfg'
const canUseCookie = () => location.protocol === 'http:' || location.protocol === 'https:'

function setCookie(name: string, value: string, days: number) {
  const d = new Date()
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function saveConfig() {
  if (!canUseCookie()) return
  const cfg = {
    watermarkText: watermarkText.value,
    fontFamily: fontFamily.value,
    fontSize: fontSize.value,
    rotation: rotation.value,
    opacity: opacity.value,
    textColor: textColor.value,
    gridSpacing: gridSpacing.value,
    gridLineWidth: gridLineWidth.value,
    currentIcon: currentIcon.value,
  }
  setCookie(COOKIE_NAME, JSON.stringify(cfg), 30)
}

function loadConfig() {
  if (!canUseCookie()) return
  const raw = getCookie(COOKIE_NAME)
  if (!raw) {
    saveConfig()
    return
  }
  try {
    const cfg = JSON.parse(raw)
    if (cfg.watermarkText != null) watermarkText.value = cfg.watermarkText
    if (cfg.fontFamily) fontFamily.value = cfg.fontFamily
    if (cfg.fontSize) fontSize.value = cfg.fontSize
    if (cfg.rotation != null) rotation.value = cfg.rotation
    if (cfg.opacity != null) opacity.value = cfg.opacity
    if (cfg.textColor) textColor.value = cfg.textColor
    if (cfg.gridSpacing) gridSpacing.value = cfg.gridSpacing
    if (cfg.gridLineWidth) gridLineWidth.value = cfg.gridLineWidth
    if (cfg.currentIcon) currentIcon.value = cfg.currentIcon
  } catch (e) {
    console.error('加载配置失败:', e)
  }
}

// === 图片上传 ===
function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    handleFile(input.files[0])
  }
}

function handleDrop(e: DragEvent) {
  dragover.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    handleFile(e.dataTransfer.files[0])
  }
}

function handleFile(file: File) {
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件')
    return
  }
  uploadedFileName.value = file.name.replace(/\.[^.]+$/, '')
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      uploadedImage.value = img
      canvasW = img.width
      canvasH = img.height
      fileInfo.value = `${file.name}（${img.width} × ${img.height}）`
      render()
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  uploadedImage.value = null
  uploadedFileName.value = ''
  canvasW = 800
  canvasH = 600
  render()
}

// === 模板应用 ===
function applyTemplate(key: string) {
  const tpl = templates.find(t => t.key === key)
  if (!tpl) return

  currentTemplate.value = key
  watermarkText.value = tpl.text

  if (tpl.isGrid) {
    isGridMode.value = true
    if (tpl.iconKey) currentIcon.value = tpl.iconKey
  } else {
    isGridMode.value = false
  }

  render()
}

// === 重置配置 ===
function resetConfig() {
  watermarkText.value = '仅供内部使用'
  fontFamily.value = 'Microsoft YaHei'
  fontSize.value = 40
  rotation.value = -30
  opacity.value = 20
  textColor.value = '#000000'
  currentIcon.value = 'phone'
  gridSpacing.value = 360
  gridLineWidth.value = 80
  isGridMode.value = false
  currentTemplate.value = ''

  if (canUseCookie()) {
    document.cookie = `${COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    saveConfig()
  }
  render()
}

// === 下载 ===
function download() {
  const canvas = canvasRef.value
  if (!canvas) return
  const link = document.createElement('a')
  link.download = (uploadedFileName.value || 'image') + '_watermark.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// === 渲染 ===
function render() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const W = canvasW
  const H = canvasH
  canvas.width = W
  canvas.height = H

  const text = watermarkText.value || '水印文字'
  const font = fontFamily.value
  const size = fontSize.value
  const angle = rotation.value * Math.PI / 180
  const alpha = opacity.value / 100
  const color = textColor.value

  // 绘制背景
  ctx.clearRect(0, 0, W, H)
  if (uploadedImage.value) {
    ctx.drawImage(uploadedImage.value, 0, 0, W, H)
  } else {
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#bbb'
    ctx.font = '20px "Microsoft YaHei"'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('请先上传背景图片', W / 2, H / 2)
  }

  // 网格水印模式
  if (isGridMode.value) {
    drawGridWatermark(ctx, W, H, text, font, size, alpha, color, gridSpacing.value, gridLineWidth.value / 10, angle)
    ctx.globalAlpha = 1
    return
  }

  // 普通水印模式
  const lineMul = 1.6
  const spacingMul = 1.3

  ctx.font = `${size}px "${font}"`
  ctx.fillStyle = color
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const lines = text.split('\n')
  const lineHeight = size * lineMul

  const tmpCanvas = document.createElement('canvas')
  const tmpCtx = tmpCanvas.getContext('2d')
  if (tmpCtx) {
    tmpCtx.font = `${size}px "${font}"`
    let maxW = 0
    lines.forEach(line => {
      const m = tmpCtx.measureText(line)
      if (m.width > maxW) maxW = m.width
    })
    const blockW = maxW * spacingMul + size * 2
    const blockH = lines.length * lineHeight + size * 2
    const diag = Math.ceil(Math.sqrt(blockW * blockW + blockH * blockH))

    for (let y = -diag; y < H + diag; y += blockH) {
      for (let x = -diag; x < W + diag; x += blockW) {
        ctx.save()
        ctx.translate(x + blockW / 2, y + blockH / 2)
        ctx.rotate(angle)
        drawText(ctx, lines, lineHeight)
        ctx.restore()
      }
    }
  }

  ctx.globalAlpha = 1
}

function drawText(ctx: CanvasRenderingContext2D, lines: string[], lineHeight: number) {
  const totalH = (lines.length - 1) * lineHeight
  lines.forEach((line, i) => {
    ctx.fillText(line, 0, -totalH / 2 + i * lineHeight)
  })
}

function drawGridWatermark(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  text: string,
  font: string,
  size: number,
  alpha: number,
  color: string,
  gridSpacing: number,
  gridLineWidth: number,
  angle: number
) {
  const iconGap = size * 0.4
  const iconSize = size
  const step = gridSpacing

  ctx.font = `${size}px "${font}"`
  const textWidth = ctx.measureText(text).width
  const iconPath = iconList.find(i => i.key === currentIcon.value)?.path
  const hasIcon = currentIcon.value !== 'none' && iconPath
  const totalW = (hasIcon ? iconSize + iconGap : 0) + textWidth

  // 绘制菱形网格线条
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = gridLineWidth
  ctx.globalAlpha = alpha * 0.35

  for (let c = -H - step; c <= W + step; c += step) {
    ctx.beginPath()
    ctx.moveTo(c, 0)
    ctx.lineTo(c + H, H)
    ctx.stroke()
  }
  for (let c = -step; c <= W + H + step; c += step) {
    ctx.beginPath()
    ctx.moveTo(c, 0)
    ctx.lineTo(c - H, H)
    ctx.stroke()
  }
  ctx.restore()

  // 在菱形网格中心放置 icon + 文字
  ctx.save()
  ctx.font = `${size}px "${font}"`
  ctx.fillStyle = color
  ctx.globalAlpha = alpha
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'

  const halfStep = step / 2
  const range = Math.ceil((W + H) / step) + 4

  for (let k = -range; k <= range; k++) {
    for (let m = -range; m <= range; m++) {
      if ((k + m) % 2 === 0) continue
      if (k % 2 !== 0) continue

      const cx = (m - k) * halfStep
      const cy = (k + m) * halfStep

      if (cx < -step || cx > W + step || cy < -step || cy > H + step) continue

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)

      let drawX = -totalW / 2
      if (hasIcon && iconPath) {
        drawIcon(ctx, iconPath, drawX + iconSize / 2, 0, iconSize)
        drawX += iconSize + iconGap
      }
      ctx.fillText(text, drawX, 0)
      ctx.restore()
    }
  }

  ctx.restore()
}

function drawIcon(ctx: CanvasRenderingContext2D, pathData: string, cx: number, cy: number, size: number) {
  try {
    const path = new Path2D(pathData)
    ctx.save()
    ctx.translate(cx - size / 2, cy - size / 2)
    ctx.scale(size / 24, size / 24)
    ctx.fill(path)
    ctx.restore()
  } catch (e) {
    ctx.save()
    ctx.font = `${size}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('☎', cx, cy)
    ctx.restore()
  }
}

// === 生命周期 ===
watch([watermarkText, fontFamily, fontSize, rotation, opacity, textColor, currentIcon, gridSpacing, gridLineWidth, isGridMode], () => {
  saveConfig()
  nextTick(render)
})

onMounted(() => {
  loadConfig()
  nextTick(render)
})
</script>

<style scoped>
/* 工具页面布局 */
.tool-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.tool-page .container {
  max-width: 1100px;
  margin: var(--spacing-lg) auto;
  padding: 0 var(--spacing-md);
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: var(--spacing-lg);
}

@media (max-width: 768px) {
  .tool-page .container {
    grid-template-columns: 1fr;
  }
}

/* 面板 */
.panel {
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
}

.panel h2 {
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-light);
}

/* 范围输入 */
.range-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.range-wrap input[type='range'] {
  flex: 1;
}

.range-val {
  min-width: 40px;
  text-align: right;
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

/* 颜色输入 */
.color-input {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.color-input input[type='color'] {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  padding: 2px;
}

.color-input span {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

/* 上传区域 */
.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-base);
  background: var(--bg-gray);
  position: relative;
}

.upload-zone:hover,
.upload-zone.dragover {
  border-color: var(--color-primary);
  background: var(--bg-hover);
}

.upload-zone .icon {
  font-size: 28px;
  margin-bottom: 6px;
}

.upload-zone .tip {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-top: var(--spacing-xs);
}

.upload-zone input[type='file'] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.img-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-success);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--color-danger);
  cursor: pointer;
  font-size: var(--font-size-sm);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
}

.remove-btn:hover {
  background: #fff1f0;
}

/* 模板选择 */
.template-section {
  margin-bottom: var(--spacing-lg);
}

.template-section > label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
  color: var(--text-secondary);
}

.template-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
}

.template-card {
  padding: 10px var(--spacing-sm);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: center;
  background: var(--bg-white);
}

.template-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
  transform: translateY(-1px);
}

.template-card.active {
  border-color: var(--color-primary);
  background: var(--bg-hover);
}

.tpl-icon {
  font-size: 22px;
  margin-bottom: var(--spacing-xs);
  display: block;
}

.tpl-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-color);
  display: block;
  margin-bottom: 2px;
}

.tpl-desc {
  font-size: 10px;
  color: var(--text-muted);
  display: block;
  line-height: 1.3;
}

/* 图标选择 */
.icon-picker {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-gray);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  position: relative;
}

.icon-btn:hover {
  border-color: var(--color-primary);
}

.icon-btn.active {
  border-color: var(--color-primary);
  background: var(--bg-hover);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.icon-btn svg {
  width: 20px;
  height: 20px;
  fill: var(--text-secondary);
}

.icon-btn.active svg {
  fill: var(--color-primary);
}

.icon-tip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--text-color);
  color: #fff;
  font-size: var(--font-size-xs);
  padding: 2px var(--spacing-sm);
  border-radius: var(--radius-xs);
  white-space: nowrap;
  margin-bottom: var(--spacing-xs);
  pointer-events: none;
}

.icon-btn:hover .icon-tip {
  display: block;
}

/* 下载按钮 */
.btn-download {
  background: var(--color-success);
  color: #fff;
}

.btn-download:hover {
  background: #46a817;
}

/* 预览区域 */
.preview-area {
  display: flex;
  flex-direction: column;
}

.preview-area h2 {
  margin-bottom: var(--spacing-md);
}

.canvas-wrapper {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    conic-gradient(#e8e8e8 25%, transparent 25%) 0 0 / 16px 16px,
    conic-gradient(#e8e8e8 25%, transparent 25%) 8px 8px / 16px 16px;
  background-color: var(--bg-white);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  padding: var(--spacing-md);
  min-height: 400px;
  overflow: auto;
}

.canvas-wrapper canvas {
  max-width: 100%;
  max-height: 70vh;
  border-radius: var(--radius-xs);
  box-shadow: var(--shadow-sm);
}
</style>
