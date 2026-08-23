# 罗盘Bug修复说明

## 修复日期
2025-12-17

## 修复的Bug

### Bug 1: 指针顺时针旋转到N时停止

**问题描述**：
当手机顺时针旋转时，罗盘上的指针转到N（北）就停止了，即使手机继续顺时针转动，指针也停在N不动。

**根本原因**：
1. 传感器返回的 `heading` 值永远在 0-360 度范围内
2. `updateAccumulatedRotation` 函数通过计算delta来累积旋转
3. 问题在于当从 359° 跨越到 0° 时：
   - delta = 0 - 359 = -359
   - 经过修正：delta = -359 + 360 = 1（正确✓）
4. 但当从 0° 跨越到 359°（逆时针）时：
   - delta = 359 - 0 = 359
   - 经过修正：delta = 359 - 360 = -1（正确✓）

原始代码的问题是使用了经过 `smoothHeading` 函数平滑处理后的值来更新累积旋转。`smoothHeading` 函数使用三角函数平均角度，在360度边界附近可能产生不准确的值，导致delta计算错误。

**解决方案**：
1. **直接使用原始标准化的heading值**来更新累积旋转，避免平滑处理引入的误差
2. 确保heading在传入 `updateAccumulatedRotation` 之前已被标准化到0-360范围
3. `smoothedHeading` 仅用于显示目的，不参与累积旋转计算

**修改代码**（第351-361行）：
```javascript
if (heading !== null) {
  // 标准化heading到0-360范围（处理设备特定转换后可能出现的边界值）
  heading = heading % 360;
  if (heading < 0) heading += 360;
  
  // 更新累积旋转 - 使用标准化后的原始heading值
  updateAccumulatedRotation(heading);
  
  rawHeading.value = heading;
  smoothedHeading.value = smoothHeading(heading);
}
```

**调试支持**：
启用了调试模式（`showDebug = true`），在界面上显示：
- Raw Heading: 原始罗盘读数
- Smoothed Heading: 平滑后的读数
- **Accumulated Rotation: 累积旋转角度**（可以超过360度或小于0度）
- 传感器类型、设备信息等

这样用户可以实时查看累积旋转值，确认指针是否持续旋转。

**⚠️ 关键修复 - CSS Transform 双重负号问题**：

在实际测试中发现，即使 `accumulatedRotation` 正确变为负数，指针仍然停在0度位置。

**问题原因**：
CSS transform 使用了错误的语法（第51行）：
```vue
:style="{ transform: `rotate(-${accumulatedRotation}deg)` }"
```

当 `accumulatedRotation = -30` 时，这个模板字符串会生成：
```css
rotate(--30deg)  /* 双重负号！ */
```

CSS 解析器会将 `--30deg` 解析为 **正数** `+30deg`，导致：
- 逆时针旋转时（accumulated为负）指针反而顺时针旋转
- 指针无法正确通过0度边界，停在N的位置

**修复代码**（第51行）：
```vue
:style="{ transform: `rotate(${-accumulatedRotation}deg)` }"
```

改为在 JavaScript 表达式中计算负值（`${-accumulatedRotation}`），而不是在模板字符串中使用 `-${accumulatedRotation}`。

现在当 `accumulatedRotation = -30` 时，正确生成：
```css
rotate(30deg)  /* 正确！ */
```

这样无论 `accumulatedRotation` 是正数还是负数，都能正确处理：
- `accumulatedRotation = 90` → `rotate(-90deg)`
- `accumulatedRotation = -30` → `rotate(30deg)`

---

### Bug 2: 接近目标时数值抖动，向左/向右提示不够友好

**问题描述**：
1. 指针接近目标方位时，在绿色区域内数值变化抖动
2. 下方的"向左转"/"向右转"提示区域只有精准指向具体度数才变绿
3. 用户无法知道自己已经在绿色区域了

**根本原因**：
- 对准检测的阈值太严格（3度），导致在临界值附近频繁切换状态
- 视觉提示没有渐进式反馈，用户体验不够友好

**解决方案**：
1. 将对准检测阈值从3度放宽到5度，减少抖动
2. 新增 `isVisuallyAligned` 计算属性，使用8度的更宽范围用于视觉提示
3. 当用户接近目标（8度范围内）时，提示区域颜色从橙色变为绿色，让用户知道已经接近目标

**修改代码**：

1. 放宽对准检测阈值（第285-293行）：
```javascript
// 对准检测 - 使用更宽松的阈值减少抖动
const isAligned = computed(() => {
  return Math.abs(angleDifference.value) <= 5;
});

// 视觉提示的对准检测 - 使用更宽的范围
const isVisuallyAligned = computed(() => {
  return Math.abs(angleDifference.value) <= 8;
});
```

2. 在模板中使用视觉提示（第89行）：
```vue
<div v-else class="hint" :class="{ 'hint-close': isVisuallyAligned }">
  <span v-if="angleDifference > 0">
    ← {{ t.turnLeft }}
  </span>
  <span v-else>
    → {{ t.turnRight }}
  </span>
</div>
```

3. 添加CSS样式实现颜色渐变（第753-768行）：
```css
.hint {
  margin-top: 10px;
  padding: 8px;
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  transition: all 0.3s ease; /* 添加过渡效果 */
}

/* 接近目标时的绿色样式 */
.hint.hint-close {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
  font-weight: 700;
}
```

---

## 修复日期：2026-08-23

### Bug 3: 地图点击全屏后显示异常、未铺满屏幕且被其他卡片遮挡

**问题描述**：
点击地图卡片右上角“全屏”按钮后，地图被限制在原卡片高度内，且下方卡片内容覆盖在地图之上，无法真正实现全屏覆盖。

**根本原因**：
1. **CSS 层叠上下文包含块陷阱**：外层卡片 `.card` 拥有 `backdrop-filter: blur(14px)` 以及 `animation: fadeUp`（包含 `transform` 动画）。根据 W3C CSS 规范，具有 `backdrop-filter` 或 `transform` 的父容器会强制成为包含块（Containing Block），使得子元素的 `position: fixed` 无法脱离父容器定位到浏览器视口（Viewport）；
2. **固定高度与溢出裁剪**：地图容器 `.map-wrapper` 设置了 `height: 240px; overflow: hidden;`，裁剪了固定定位的内容。

**解决方案**：
1. **双重全屏机制**：在 `MapView.vue` 中优先调用现代浏览器原生 `requestFullscreen()` API（由渲染引擎直接提升到 Top Layer 渲染）；
2. **CSS 突破层叠上下文（Fallback 方案）**：在 `App.vue` 中监听全屏状态，全屏时为外层卡片动态绑定 `.map-card-fullscreen` 与 `.fullscreen-active`，将外层卡片的 `transform`、`animation`、`backdrop-filter`、`padding` 和 `overflow` 清除并置为视口满屏（`100vw × 100vh`，`z-index: 999995`）；
3. **多阶段自适应重绘**：进入与退出全屏时多阶段触发 Leaflet `map.invalidateSize()`，确保地图瓦片与坐标标记平滑自适应。

---

### Bug 4: 浅色模式下地图天线指向箭头不够醒目

**问题描述**：
在浅色地图模式下，天线指向箭头（蓝色）在河流、湖泊等蓝色水系区域或密集白色道路网中对比度较低，视觉上不够清晰。

**解决方案**：
1. **尺寸升级**：标记尺寸由 `50×50 px` 升级为 `70×70 px`；
2. **多层高对比度立体描边**：为 SVG 箭头添加 `2.6px 纯白高对比度外描边` 与加深立体投影，深色模式下配备电光蓝辉光（Glow）；
3. **小站中心基准靶心**：在天线旋转中心独立绘制三层同心靶心圆点（高对比度外圈 + 核心色 + 白色中心原点），无论天线如何旋转，小站实际坐标基准点始终清晰可见；
4. **渐变天线体与内脊线**：采用高饱和度渐变并添加白色高亮内脊线，显著增强立体感与视觉权重。

---

### Bug 5: 全国行政区划数据拼音排序与多关键字快速检索

**问题描述**：
原行政区划数据默认显示排在 CSV 前列的河南地区，且搜索在处理空格与多关键字时不够灵活。

**解决方案**：
1. 将 `public/china_administrative_coordinates.csv` 全量 3,637 条省市区县数据预先按中文拼音字母（A-Z）排序，默认展示拼音靠前地区（如安徽省等）；
2. 优化 `searchAdminRegions()` 检索算法，支持以空格分隔的多个拼音/汉字关键字快速模糊过滤与坐标回填。

---

## 用户体验改进

### 改进前：
- ❌ 指针旋转到360度会卡住
- ❌ 指针无法旋转到负数角度（双重负号bug）
- ❌ 接近目标时状态频繁跳变，产生抖动
- ❌ 只有精确对准才显示绿色，用户无法判断是否接近目标

### 改进后：
- ✅ 指针可以连续旋转，不会在360度边界停止
- ✅ 修复CSS transform双重负号问题，支持正负角度旋转
- ✅ 使用5度的对准阈值，减少状态切换抖动
- ✅ 提供8度的视觉反馈范围，当用户接近目标时提示变绿
- ✅ 平滑的颜色过渡（橙色→绿色），提供更好的视觉反馈

---

## 测试建议

1. **测试累积旋转（顺时针）**：
   - 启动罗盘
   - 顺时针连续旋转手机超过360度
   - 观察 Accumulated 值：0° → 90° → 180° → 270° → 360° → 450° → ...
   - 确认指针持续旋转，不会在N处停止

2. **测试累积旋转（逆时针）**：
   - 启动罗盘
   - 逆时针连续旋转手机
   - 观察 Accumulated 值：0° → -90° → -180° → -270° → -360° → ...
   - 确认指针持续旋转，不会停在0度

3. **测试对准提示**：
   - 将手机对准任意目标方位
   - 从远离目标开始慢慢转向目标
   - 观察：
     - 当偏差 > 8度：提示为橙色
     - 当偏差 <= 8度：提示变为绿色
     - 当偏差 <= 5度：显示"已对准！"

4. **测试稳定性**：
   - 在目标方位附近小幅度晃动手机
   - 确认数值不会频繁跳变（抖动减少）

## 相关文件
- `src/components/CompassAlignment.vue` - 罗盘组件主文件
