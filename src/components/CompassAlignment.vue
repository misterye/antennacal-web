<template>
  <div class="compass-card">
    <div class="compass-header">
      <span class="compass-title">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:6px"><circle cx="12" cy="12" r="10"/><polygon points="12 2 14.09 8.26 20.22 9 16 13.14 17.18 19.22 12 16.5 6.82 19.22 8 13.14 3.78 9 9.91 8.26"/></svg>
        {{ t.title }}
      </span>
      <button class="btn-start-compass" :class="{ active: isActive }" @click="toggleCompass">
        <svg v-if="!isActive" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="12 2 14.09 8.26 20.22 9 16 13.14 17.18 19.22 12 16.5 6.82 19.22 8 13.14 3.78 9 9.91 8.26"/></svg>
        <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        {{ !isActive ? t.start : t.stop }}
      </button>
    </div>

    <!-- Error Messages -->
    <div v-if="!isSupported" class="error-message">{{ t.notSupported }}</div>
    <div v-else-if="!hasPermission && needsPermission" class="error-message">{{ t.needPermission }}</div>

    <div v-else class="compass-wrap">
      <div class="compass-svg-container">
        <svg id="compassSvg" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="compassBg" cx="50%" cy="50%" r="50%">
              <stop id="bgStop1" offset="0%" :stop-color="theme === 'dark' ? '#0d1e35' : '#e4f0fa'"/>
              <stop id="bgStop2" offset="100%" :stop-color="theme === 'dark' ? '#0a0e1a' : '#f0f4f8'"/>
            </radialGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
            <filter id="nglow"><feGaussianBlur stdDeviation="2.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
          </defs>
          <circle cx="110" cy="110" r="105" fill="none" stroke="var(--border)" stroke-width="1"/>
          <circle cx="110" cy="110" r="100" fill="url(#compassBg)"/>
          <circle cx="110" cy="110" r="100" fill="none" stroke="var(--cyan-dim)" stroke-width="0.75"/>
          
          <g id="ticks">
            <line v-for="(tick, index) in ticks" :key="index" :x1="tick.x1" :y1="tick.y1" :x2="tick.x2" :y2="tick.y2" :stroke="theme === 'dark' ? 'rgba(0,212,255,0.4)' : 'rgba(0,152,200,0.4)'" :stroke-opacity="tick.opacity" :stroke-width="tick.width" />
          </g>
          <g id="cardinals" font-family="'JetBrains Mono',monospace" text-anchor="middle" dominant-baseline="central">
            <text x="110" y="18" font-size="11" font-weight="600" :fill="theme === 'dark' ? '#f0f4ff' : '#0d1524'" letter-spacing="0.1em">N</text>
            <text x="202" y="110" font-size="11" font-weight="600" fill="var(--cyan)" letter-spacing="0.1em">E</text>
            <text x="110" y="202" font-size="11" font-weight="600" fill="var(--cyan)" letter-spacing="0.1em">S</text>
            <text x="18" y="110" font-size="11" font-weight="600" fill="var(--cyan)" letter-spacing="0.1em">W</text>
            <text x="166" y="44" font-size="8" fill="var(--cyan-dim)">NE</text>
            <text x="166" y="176" font-size="8" fill="var(--cyan-dim)">SE</text>
            <text x="48" y="176" font-size="8" fill="var(--cyan-dim)">SW</text>
            <text x="48" y="44" font-size="8" fill="var(--cyan-dim)">NW</text>
          </g>
          
          <g v-if="targetPath" id="targetArc">
            <path :d="targetPath.d" :stroke="theme === 'dark' ? '#00d4ff' : '#0098c8'" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.75" filter="url(#glow)"/>
          </g>

          <circle cx="110" cy="110" r="72" fill="none" stroke="var(--border)" stroke-width="1"/>
          <circle cx="110" cy="110" r="50" fill="none" stroke="var(--border)" stroke-width="1" stroke-dasharray="4 6"/>
          
          <g id="needleGroup" :style="{ transform: `rotate(${-renderRotation}deg)` }">
            <polygon points="110,38 107,110 113,110" fill="var(--amber)" filter="url(#nglow)" opacity="0.9"/>
            <polygon points="110,182 107,110 113,110" :fill="theme === 'dark' ? 'rgba(0,212,255,0.45)' : 'rgba(0,152,200,0.45)'"/>
            <circle cx="110" cy="110" r="7" :fill="theme === 'dark' ? '#0d1e35' : '#e4f0fa'" :stroke="theme === 'dark' ? 'rgba(0,212,255,0.6)' : 'rgba(0,152,200,0.6)'" stroke-width="1.5"/>
            <circle cx="110" cy="110" r="3" :fill="theme === 'dark' ? 'rgba(0,212,255,0.9)' : 'rgba(0,152,200,0.9)'"/>
          </g>
          
          <g id="targetLine" :transform="`rotate(${targetAzimuth}, 110, 110)`" opacity="0.7">
            <line x1="110" y1="40" x2="110" y2="75" :stroke="theme === 'dark' ? 'rgba(0,212,255,0.8)' : 'rgba(0,152,200,0.8)'" stroke-width="1.5" stroke-dasharray="4 3"/>
            <polygon points="110,36 107.5,44 112.5,44" :fill="theme === 'dark' ? 'rgba(0,212,255,0.8)' : 'rgba(0,152,200,0.8)'"/>
          </g>
        </svg>
      </div>
    </div>

    <!-- Readings -->
    <div class="compass-readings" v-if="isActive && isSupported">
      <div class="reading-item">
        <div class="reading-label">{{ t.currentHeading }}</div>
        <div class="reading-value current">{{ Math.round(smoothedHeading) }}°</div>
      </div>
      <div class="reading-item">
        <div class="reading-label">{{ t.targetAzimuth }}</div>
        <div class="reading-value target">{{ Math.round(targetAzimuth) }}°</div>
      </div>
      <div class="reading-item">
        <div class="reading-label">{{ t.difference }}</div>
        <div class="reading-value" :class="isAligned ? 'delta-aligned' : 'delta-left'">
          <span v-if="isAligned">✓</span>
          <span v-else>{{ Math.round(Math.abs(angleDifference)) }}°</span>
        </div>
      </div>
    </div>
    
    <div class="turn-indicator" v-if="isActive && isSupported && !isAligned">
      <span class="turn-arrow" :class="{ 'turn-left': angleDifference > 0, 'turn-right': angleDifference < 0 }">←</span>
      <span>{{ angleDifference > 0 ? t.turnLeft : t.turnRight }}</span>
      <span class="turn-arrow" :class="{ 'turn-left': angleDifference > 0, 'turn-right': angleDifference < 0 }">←</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  targetAzimuth: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: 'zh'
  },
  theme: {
    type: String,
    default: 'dark'
  }
});

// 多语言文本
const translations = {
  zh: {
    title: '实时方位对准',
    start: '启动罗盘',
    stop: '停止',
    notSupported: '您的设备不支持方向传感器',
    needPermission: '需要授权访问设备方向传感器',
    currentHeading: '当前朝向',
    targetAzimuth: '目标方位',
    difference: '偏差',
    aligned: '已对准！',
    turnLeft: '向左转',
    turnRight: '向右转'
  },
  en: {
    title: 'Real-time Compass',
    start: 'Start',
    stop: 'Stop',
    notSupported: 'Device orientation not supported',
    needPermission: 'Permission needed for orientation sensor',
    currentHeading: 'Current',
    targetAzimuth: 'Target',
    difference: 'Offset',
    aligned: 'Aligned!',
    turnLeft: 'Turn Left',
    turnRight: 'Turn Right'
  }
};

const t = computed(() => translations[props.language]);

const isActive = ref(false);
const isSupported = ref(true);
const hasPermission = ref(true);
const needsPermission = ref(false);
const rawHeading = ref(0);
const smoothedHeading = ref(0);
const sensorType = ref('');

// 渲染旋转角度（用于平滑动画）
const renderRotation = ref(0);
let animationFrameId = null;

const animateCompass = () => {
  const diff = accumulatedRotation.value - renderRotation.value;
  if (Math.abs(diff) > 0.05) {
    // 使用 0.08 的平滑系数，数值越小越平滑但会有略微延迟，0.08 是很好的响应性平衡点
    renderRotation.value += diff * 0.08;
  } else {
    renderRotation.value = accumulatedRotation.value;
  }
  animationFrameId = requestAnimationFrame(animateCompass);
};

// Computed Ticks for SVG
const ticks = computed(() => {
  const t = [];
  for (let i = 0; i < 360; i += 5) {
    const rad = (i - 90) * Math.PI / 180;
    const maj = i % 45 === 0, med = i % 15 === 0;
    const r1 = 92, r2 = maj ? 78 : (med ? 82 : 88);
    const cx = 110, cy = 110;
    t.push({
      x1: cx + r1 * Math.cos(rad),
      y1: cy + r1 * Math.sin(rad),
      x2: cx + r2 * Math.cos(rad),
      y2: cy + r2 * Math.sin(rad),
      opacity: maj ? '0.65' : (med ? '0.38' : '0.15'),
      width: maj ? '1.5' : '0.75'
    });
  }
  return t;
});

const targetPath = computed(() => {
  if (!props.targetAzimuth) return null;
  const cx = 110, cy = 110, r = 86, half = 12;
  const az = props.targetAzimuth;
  const a1 = (az - half - 90) * Math.PI / 180;
  const a2 = (az + half - 90) * Math.PI / 180;
  const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
  return { d: `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}` };
});

// ========== 设备检测 ==========
const userAgent = navigator.userAgent.toLowerCase();
const isAndroid = /android/i.test(userAgent);
const isIOS = /iphone|ipad|ipod/i.test(userAgent);
const isXiaomi = /xiaomi|mi\s|redmi/i.test(userAgent);
const isHuawei = /huawei|honor/i.test(userAgent);
const isOppo = /oppo/i.test(userAgent);
const isVivo = /vivo/i.test(userAgent);

// 屏幕方向
const screenOrientation = ref(0);
const getScreenOrientation = () => {
  if (window.screen && window.screen.orientation) {
    const angle = window.screen.orientation.angle || 0;
    screenOrientation.value = angle;
    return angle;
  } else if (window.orientation !== undefined) {
    screenOrientation.value = window.orientation;
    return window.orientation;
  }
  return 0;
};

// 累积旋转角度（解决360度边界反向问题）
const accumulatedRotation = ref(0);
const lastHeading = ref(null);

// 平滑处理
const headingHistory = ref([]);
const SMOOTHING_WINDOW = 20;
const SMOOTHING_THRESHOLD = 0.5;

// 稳定对准检测
const alignedHistory = ref([]);
const STABILITY_CHECKS = 5;

// 平滑处理函数
const smoothHeading = (newHeading) => {
  if (headingHistory.value.length > 0) {
    const lastHeading = headingHistory.value[headingHistory.value.length - 1];
    let diff = Math.abs(newHeading - lastHeading);
    if (diff > 180) diff = 360 - diff;
    if (diff < SMOOTHING_THRESHOLD) return smoothedHeading.value;
  }
  
  headingHistory.value.push(newHeading);
  if (headingHistory.value.length > SMOOTHING_WINDOW) headingHistory.value.shift();
  if (headingHistory.value.length < 2) return newHeading;
  
  let sinSum = 0;
  let cosSum = 0;
  let weightSum = 0;
  
  headingHistory.value.forEach((angle, index) => {
    const weight = (index + 1) / headingHistory.value.length;
    const rad = angle * Math.PI / 180;
    sinSum += Math.sin(rad) * weight;
    cosSum += Math.cos(rad) * weight;
    weightSum += weight;
  });
  
  const avgRad = Math.atan2(sinSum / weightSum, cosSum / weightSum);
  let avgAngle = avgRad * 180 / Math.PI;
  if (avgAngle < 0) avgAngle += 360;
  return avgAngle;
};

// 更新累积旋转角度
const updateAccumulatedRotation = (newHeading) => {
  if (lastHeading.value === null) {
    lastHeading.value = newHeading;
    accumulatedRotation.value = newHeading;
    renderRotation.value = newHeading; // Initialize instantly
    return accumulatedRotation.value;
  }
  
  let delta = newHeading - lastHeading.value;
  if (delta > 180) delta -= 360;
  else if (delta < -180) delta += 360;
  
  accumulatedRotation.value += delta;
  lastHeading.value = newHeading;
  return accumulatedRotation.value;
};

// 计算角度差
const angleDifference = computed(() => {
  let diff = props.targetAzimuth - smoothedHeading.value;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
});

// 对准检测
const isAligned = computed(() => Math.abs(angleDifference.value) <= 5);

let orientationHandler = null;

const handleOrientation = (event) => {
  let heading = null;
  if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
    heading = event.webkitCompassHeading;
    sensorType.value = 'iOS Compass';
  } else if (event.absolute && event.alpha !== null) {
    heading = event.alpha;
    sensorType.value = 'Android Absolute';
    if (isXiaomi) heading = 360 - heading;
  } else if (event.alpha !== null) {
    heading = event.alpha;
    sensorType.value = 'Android Relative';
    if (isXiaomi) heading = 360 - heading;
  }
  
  if (heading !== null) {
    heading = heading % 360;
    if (heading < 0) heading += 360;
    updateAccumulatedRotation(heading);
    rawHeading.value = heading;
    smoothedHeading.value = smoothHeading(heading);
  }
};

const requestPermission = async () => {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    needsPermission.value = true;
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      hasPermission.value = permission === 'granted';
      return permission === 'granted';
    } catch (error) {
      hasPermission.value = false;
      return false;
    }
  }
  return true;
};

const toggleCompass = () => {
  if (isActive.value) {
    stopCompass();
  } else {
    startCompass();
  }
};

const startCompass = async () => {
  if (typeof DeviceOrientationEvent === 'undefined') {
    isSupported.value = false;
    return;
  }
  const hasPermissionNow = await requestPermission();
  if (!hasPermissionNow) return;

  headingHistory.value = [];
  rawHeading.value = 0;
  smoothedHeading.value = 0;
  accumulatedRotation.value = 0;
  renderRotation.value = 0;
  lastHeading.value = null;
  
  getScreenOrientation();
  orientationHandler = handleOrientation;
  
  window.addEventListener('deviceorientationabsolute', orientationHandler, true);
  window.addEventListener('deviceorientation', orientationHandler, true);
  
  if (window.screen && window.screen.orientation) {
    window.screen.orientation.addEventListener('change', getScreenOrientation);
  }
  window.addEventListener('orientationchange', getScreenOrientation);
  
  isActive.value = true;
  if (!animationFrameId) {
    animateCompass();
  }
};

const stopCompass = () => {
  if (orientationHandler) {
    window.removeEventListener('deviceorientationabsolute', orientationHandler, true);
    window.removeEventListener('deviceorientation', orientationHandler, true);
    orientationHandler = null;
  }
  
  if (window.screen && window.screen.orientation) {
    window.screen.orientation.removeEventListener('change', getScreenOrientation);
  }
  window.removeEventListener('orientationchange', getScreenOrientation);
  
  isActive.value = false;
  headingHistory.value = [];
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

onMounted(() => {
  if (typeof DeviceOrientationEvent === 'undefined') {
    isSupported.value = false;
  }
  getScreenOrientation();
});

onUnmounted(() => {
  stopCompass();
});
</script>

<style scoped>
.compass-card {
  background: linear-gradient(160deg, var(--reading-bg) 0%, var(--bg-surface) 65%);
  border: 1px solid var(--border); border-radius: 20px; padding: 24px 20px;
  position: relative; overflow: hidden;
  box-shadow: var(--shadow-card);
  animation: fadeUp 0.6s ease 0.3s both;
  transition: background 0.45s, border-color 0.35s, box-shadow 0.35s;
}
.compass-card::before {
  content: ''; position: absolute; top:-40%; left:50%; transform:translateX(-50%);
  width:80%; height:80%;
  background: radial-gradient(ellipse, var(--compass-glow) 0%, transparent 70%);
  pointer-events: none; transition: background 0.45s;
}

.error-message {
  color: var(--amber); text-align: center; padding: 20px;
  background: var(--bg-surface-2); border-radius: 8px; font-size: 14px;
}

.compass-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }

.compass-title {
  font-family: var(--font-display); font-size: 11px; letter-spacing: 0.18em;
  color: var(--text-secondary); text-transform: uppercase; transition: color 0.35s;
}

.btn-start-compass {
  display: flex; align-items: center; gap: 6px;
  background: var(--cyan-dim); border: 1px solid var(--border-hover);
  border-radius: 8px; padding: 6px 12px;
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em;
  color: var(--cyan); cursor: pointer; text-transform: uppercase;
  transition: all 0.25s;
}
.btn-start-compass:hover { box-shadow: 0 0 16px var(--cyan-dim); border-color: var(--cyan); }
.btn-start-compass.active { background: var(--cyan); color: var(--calc-btn-color); font-weight: 700; }

.compass-wrap { display: flex; justify-content: center; margin: 10px 0 20px; }
.compass-svg-container { width: 220px; height: 220px; }
#compassSvg { width: 100%; height: 100%; filter: drop-shadow(0 0 20px var(--compass-glow)); transition: filter 0.4s; }
#needleGroup { transform-origin: 110px 110px; }

.compass-readings { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 4px; }
.reading-item {
  background: var(--reading-bg); border: 1px solid var(--border);
  border-radius: 10px; padding: 10px 12px; text-align: center;
  transition: background 0.4s, border-color 0.35s;
}
.reading-label {
  font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.15em;
  color: var(--text-secondary); text-transform: uppercase; margin-bottom: 5px; transition: color 0.35s;
}
.reading-value { font-family: var(--font-mono); font-size: 18px; font-weight: 500; line-height: 1; }
.reading-value.target { color: var(--cyan); text-shadow: 0 0 12px var(--cyan-dim); }
.reading-value.current { color: var(--text-primary); }
.reading-value.delta-left { color: var(--amber); }
.reading-value.delta-aligned { color: var(--green); text-shadow: 0 0 12px rgba(16,185,129,0.4); }

.turn-indicator {
  margin-top: 14px; display: flex; align-items: center; justify-content: center; gap: 8px;
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em;
  color: var(--amber); animation: pulse-amber 1.5s ease-in-out infinite; text-transform: uppercase;
}
.turn-arrow { font-size: 18px; animation: bounce-horiz 1s ease-in-out infinite; }
.turn-arrow.turn-right { transform: scaleX(-1); animation: bounce-horiz-rev 1s ease-in-out infinite; }

@keyframes pulse-amber { 0%,100%{opacity:1} 50%{opacity:0.45} }
@keyframes bounce-horiz { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-4px)} }
@keyframes bounce-horiz-rev { 0%,100%{transform:translateX(0) scaleX(-1)} 50%{transform:translateX(4px) scaleX(-1)} }
</style>
