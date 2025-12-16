<template>
  <div class="compass-container">
    <div class="compass-header">
      <h3>{{ t.title }}</h3>
      <button v-if="!isActive" @click="startCompass" class="start-button">
        {{ t.start }}
      </button>
      <button v-else @click="stopCompass" class="stop-button">
        {{ t.stop }}
      </button>
    </div>

    <div v-if="!isSupported" class="error-message">
      {{ t.notSupported }}
    </div>

    <div v-else-if="!hasPermission && needsPermission" class="error-message">
      {{ t.needPermission }}
    </div>

    <div v-else class="compass-display">
      <!-- 罗盘背景 -->
      <div class="compass-circle">
        <!-- 方向标记 -->
        <div class="direction-markers">
          <div class="marker north">N</div>
          <div class="marker east">E</div>
          <div class="marker south">S</div>
          <div class="marker west">W</div>
        </div>

        <!-- 目标方位角指示线 -->
        <div 
          class="target-line" 
          :style="{ transform: `rotate(${targetAzimuth}deg)` }"
        >
          <div class="target-marker">{{ t.target }}</div>
        </div>

        <!-- 当前设备方向箭头 -->
        <div 
          class="device-arrow" 
          :class="{ 'aligned': isAligned }"
          :style="{ transform: `rotate(${currentHeading}deg)` }"
        >
          <svg width="80" height="80" viewBox="0 0 80 80">
            <defs>
              <linearGradient id="arrowGradientRed" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ff4444;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#cc0000;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="arrowGradientGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#44ff44;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#00cc00;stop-opacity:1" />
              </linearGradient>
            </defs>
            <g transform="rotate(0 40 40)">
              <path 
                d="M 40 10 L 30 35 L 35 35 L 35 60 L 45 60 L 45 35 L 50 35 Z" 
                :fill="isAligned ? 'url(#arrowGradientGreen)' : 'url(#arrowGradientRed)'"
                stroke="white" 
                stroke-width="2"
              />
            </g>
          </svg>
        </div>

        <!-- 中心点 -->
        <div class="center-dot"></div>
      </div>

      <!-- 信息显示 -->
      <div class="info-panel">
        <div class="info-row">
          <span class="info-label">{{ t.currentHeading }}:</span>
          <span class="info-value">{{ Math.round(currentHeading) }}°</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ t.targetAzimuth }}:</span>
          <span class="info-value">{{ Math.round(targetAzimuth) }}°</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ t.difference }}:</span>
          <span class="info-value" :class="{ 'aligned-text': isAligned }">
            {{ Math.round(Math.abs(angleDifference)) }}°
          </span>
        </div>
        <div v-if="isAligned" class="aligned-indicator">
          ✓ {{ t.aligned }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  targetAzimuth: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: 'zh'
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
    target: '目标'
  },
  en: {
    title: 'Real-time Direction Alignment',
    start: 'Start Compass',
    stop: 'Stop',
    notSupported: 'Your device does not support orientation sensors',
    needPermission: 'Permission needed to access device orientation',
    currentHeading: 'Current',
    targetAzimuth: 'Target',
    difference: 'Offset',
    aligned: 'Aligned!',
    target: 'Target'
  }
};

const t = computed(() => translations[props.language]);

const isActive = ref(false);
const isSupported = ref(true);
const hasPermission = ref(true);
const needsPermission = ref(false);
const currentHeading = ref(0);

// 计算角度差（考虑360度循环）
const angleDifference = computed(() => {
  let diff = props.targetAzimuth - currentHeading.value;
  // 标准化到 -180 到 180 范围
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
});

// 判断是否对准（误差在±5度内）
const isAligned = computed(() => {
  return Math.abs(angleDifference.value) <= 5;
});

let orientationHandler = null;

const handleOrientation = (event) => {
  if (event.webkitCompassHeading) {
    // iOS
    currentHeading.value = event.webkitCompassHeading;
  } else if (event.alpha !== null) {
    // Android 和其他设备
    // alpha 是设备绕 Z 轴的旋转角度（0-360）
    // 需要转换为罗盘方向（北为0）
    currentHeading.value = 360 - event.alpha;
  }
};

const requestPermission = async () => {
  if (typeof DeviceOrientationEvent !== 'undefined' && 
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    needsPermission.value = true;
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      hasPermission.value = permission === 'granted';
      return permission === 'granted';
    } catch (error) {
      console.error('Permission request failed:', error);
      hasPermission.value = false;
      return false;
    }
  }
  return true;
};

const startCompass = async () => {
  // 检查设备支持
  if (typeof DeviceOrientationEvent === 'undefined') {
    isSupported.value = false;
    return;
  }

  // 请求权限（iOS 13+需要）
  const hasPermissionNow = await requestPermission();
  if (!hasPermissionNow) {
    return;
  }

  // 启动监听
  orientationHandler = handleOrientation;
  window.addEventListener('deviceorientation', orientationHandler);
  
  // 同时监听 deviceorientationabsolute 事件（某些Android设备）
  window.addEventListener('deviceorientationabsolute', orientationHandler);
  
  isActive.value = true;
};

const stopCompass = () => {
  if (orientationHandler) {
    window.removeEventListener('deviceorientation', orientationHandler);
    window.removeEventListener('deviceorientationabsolute', orientationHandler);
    orientationHandler = null;
  }
  isActive.value = false;
};

onMounted(() => {
  // 检查设备支持
  if (typeof DeviceOrientationEvent === 'undefined') {
    isSupported.value = false;
  }
});

onUnmounted(() => {
  stopCompass();
});

// 监听目标方位角变化
watch(() => props.targetAzimuth, () => {
  // 可以在这里添加提示或动画
});
</script>

<style scoped>
.compass-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.compass-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.compass-header h3 {
  color: white;
  margin: 0;
  font-size: 18px;
}

.start-button, .stop-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-button {
  background: #4caf50;
  color: white;
}

.start-button:hover {
  background: #45a049;
  transform: scale(1.05);
}

.stop-button {
  background: #f44336;
  color: white;
}

.stop-button:hover {
  background: #da190b;
  transform: scale(1.05);
}

.error-message {
  color: #ffeb3b;
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  font-size: 14px;
}

.compass-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.compass-circle {
  position: relative;
  width: 280px;
  height: 280px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.direction-markers {
  position: absolute;
  width: 100%;
  height: 100%;
}

.marker {
  position: absolute;
  font-weight: bold;
  font-size: 18px;
  color: #333;
}

.marker.north {
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: #f44336;
  font-size: 22px;
}

.marker.east {
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.marker.south {
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.marker.west {
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.target-line {
  position: absolute;
  width: 4px;
  height: 140px;
  background: linear-gradient(to bottom, #ff9800 0%, transparent 100%);
  top: 0;
  left: 50%;
  margin-left: -2px;
  transform-origin: 50% 140px;
  transition: transform 0.3s ease;
}

.target-marker {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff9800;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
}

.device-arrow {
  position: absolute;
  width: 80px;
  height: 80px;
  top: 50%;
  left: 50%;
  margin-left: -40px;
  margin-top: -40px;
  transform-origin: 50% 50%;
  transition: transform 0.1s ease-out;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.device-arrow.aligned {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1) rotate(var(--rotation, 0deg));
  }
  50% {
    transform: scale(1.1) rotate(var(--rotation, 0deg));
  }
}

.center-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #333;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

.info-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 15px;
  width: 280px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #333;
  font-weight: 700;
  font-size: 16px;
}

.info-value.aligned-text {
  color: #4caf50;
}

.aligned-indicator {
  margin-top: 10px;
  padding: 10px;
  background: #4caf50;
  color: white;
  border-radius: 6px;
  text-align: center;
  font-weight: 700;
  animation: success-pulse 0.5s ease-in-out;
}

@keyframes success-pulse {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
