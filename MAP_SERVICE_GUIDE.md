# 地图服务与可视化交互指南 (Map Service & Interaction Guide)

本文档详细说明了寻星伴侣中地图瓦片服务、坐标点选交互、全屏模式以及航天级高对比度天线指向箭头的技术实现。

---

## 📍 一、地图瓦片服务（Amap / AutoNavi）

### 1. 服务选型与优势
本项目采用 **高德地图（AutoNavi）Web 瓦片服务**，具备以下优势：
- ⚡ **国内高速响应**：无需梯子，网络延迟低；
- 🌐 **中英文标注自适应**：支持根据用户语言动态切换中英文注记；
- ⚖️ **四路服务器轮询负载均衡**：使用 `webrd01` 至 `webrd04` 多子域并发请求；
- 🌗 **深浅色主题滤镜**：深色模式下利用 CSS 硬件加速反相和色调旋转滤镜，呈现优雅科技深色地图。

### 2. 瓦片配置实现 (`src/components/MapView.vue`)

```javascript
L.tileLayer(`https://webrd0{s}.is.autonavi.com/appmaptile?lang=${props.language === 'zh' ? 'zh_cn' : 'en'}&size=1&scale=1&style=8&x={x}&y={y}&z={z}`, {
  subdomains: ['1', '2', '3', '4'],
  attribution: '&copy; <a href="https://www.amap.com/" target="_blank">高德地图</a>',
  maxZoom: 18,
  minZoom: 3,
  className: 'map-tiles'
}).addTo(map);
```

---

## 🎯 二、地图在地图上点选（Map Point Selection）

### 1. 交互设计
1. 用户点击控制栏的 **“在地图上点选”** 按钮；
2. 地图光标切换为精细十字准星（`crosshair`），顶部出现动态脉冲提示浮条；
3. 用户在地图上点击任意地点，系统捕获 `latlng` 坐标（保留 4 位高精度小数）；
4. 触发 Vue 事件 `@select-location`，自动更新主界面的小站纬度与经度，并联动重新计算卫星指向参数；
5. 界面弹出轻提示（Toast）反馈选中的坐标信息。

---

## ⛶ 三、地图全屏模式（Fullscreen Mode）

### 1. 双重全屏机制
为解决各浏览器以及 Android Webview 下全屏 API 兼容性与 CSS 层叠上下文（`backdrop-filter`/`transform` 导致的固定定位失效）问题，采用了双重全屏机制：
1. **原生 Fullscreen API**：优先调用 `container.requestFullscreen()`，由系统渲染引擎直接置于顶级 Top Layer 展现；
2. **CSS 突破层叠上下文（Fallback Mode）**：
   - 当在移动 Webview 或不支持原生全屏的环境中时，父组件 `App.vue` 会为外层卡片及地图容器添加 `.map-card-fullscreen` 与 `.fullscreen-active` 类；
   - 彻底将外层卡片的 `transform`、`animation`、`backdrop-filter` 和 `overflow` 清除，使地图以 `100vw × 100vh` 满屏覆盖视口；
3. **Esc 键监听与平滑重绘**：按 `Esc` 键或点击退出全屏按钮即可退出，退出前后多阶段触发 `map.invalidateSize()` 确保瓦片平滑自适应。

---

## 🧭 四、航天级高辨识度天线指向指示标（High-Contrast Marker）

### 1. 设计痛点解决
在浅色地图中，浅蓝色水域（江河湖海）或白色公路网往往会导致常规蓝色小箭头对比度不足、难以辨识。为此进行了全面的视觉重构：

### 2. 指示标结构
```text
┌───────────────────────────────────────────────┐
│              ▲ 箭头顶点 (指向目标经度)           │
│             /│\                               │
│            / │ \ 2.6px 高对比度立体外描边       │
│           /  │  \                             │
│          /   │   \ 渐变填充 (深海蓝->电光蓝)     │
│         /    │    \                           │
│        /_____│_____\                          │
│             ││ 高亮立体内脊线                  │
│             ││                                │
│          ───⊙─── 中心小站基准靶心 (三层同心圆)  │
│        ((   ││   )) 双层外扩动态雷达波         │
└───────────────────────────────────────────────┘
```

1. **尺寸升级**：整体 SVG 尺寸由 `50×50 px` 升级为 `70×70 px`；
2. **多层高对比度外描边**：浅色模式下增加 `2.6px 纯白高对比度外轮廓` 与立体阴影，深色模式下配备科技辉光（Glow）；
3. **中心基准定位靶心**：独立于旋转角度的三层同心靶心点（外圈+核心色+白心），准确指明小站地理经纬度原点；
4. **动态雷达脉冲**：双层由内向外扩散的波纹动画，赋予雷达探测的动感质感。
