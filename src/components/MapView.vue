<template>
  <div 
    ref="mapContainerRef" 
    class="map-container" 
    :class="[`map-theme-${theme}`, { 'is-picking-active': isPicking, 'is-fullscreen': isFullscreen }]"
  >
    <div id="map" :class="{ 'picking-crosshair': isPicking }"></div>

    <!-- 顶部状态浮条：点选模式提示 -->
    <transition name="fade">
      <div v-if="isPicking" class="map-picking-banner">
        <span class="picking-pulse-dot"></span>
        <span class="picking-text">{{ pickingActiveText }}</span>
        <button class="btn-exit-picking" @click="togglePickingMode(false)">{{ exitPickingText }}</button>
      </div>
    </transition>

    <!-- 顶部控制按钮组 -->
    <div class="map-top-controls">
      <!-- 点选模式切换按钮 -->
      <button 
        class="map-btn map-btn-picking" 
        :class="{ 'active': isPicking }" 
        @click="togglePickingMode()" 
        :title="isPicking ? exitPickingText : pickOnMapText"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="22" y1="12" x2="18" y2="12"/>
          <line x1="6" y1="12" x2="2" y2="12"/>
          <line x1="12" y1="6" x2="12" y2="2"/>
          <line x1="12" y1="22" x2="12" y2="18"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
        <span class="map-btn-text">{{ isPicking ? exitPickingText : pickOnMapText }}</span>
      </button>

      <!-- 回到小站位置按钮 -->
      <button class="map-btn map-btn-icon" @click="recenterMap" :title="recenterText">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
      </button>

      <!-- 全屏切换按钮 -->
      <button 
        class="map-btn map-btn-icon" 
        :class="{ 'active': isFullscreen }" 
        @click="toggleFullscreen" 
        :title="isFullscreen ? exitFullscreenText : fullscreenText"
      >
        <svg v-if="!isFullscreen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="4 14 10 14 10 20"></polyline>
          <polyline points="20 10 14 10 14 4"></polyline>
          <line x1="14" y1="10" x2="21" y2="3"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
      </button>
    </div>

    <!-- 南向指示标 -->
    <div class="south-indicator">{{ southText }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  latitude: {
    type: [Number, String],
    default: 0
  },
  longitude: {
    type: [Number, String],
    default: 0
  },
  azimuth: {
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

const emit = defineEmits(['select-location', 'update:location']);

const mapContainerRef = ref(null);
const isPicking = ref(false);
const isFullscreen = ref(false);
let map = null;
let marker = null;
let currentTheme = props.theme;

// 多语言文本
const southText = computed(() => {
  return props.language === 'zh' ? '向下为正南' : 'South ↓';
});

const recenterText = computed(() => {
  return props.language === 'zh' ? '回到小站位置' : 'Recenter to Station';
});

const pickOnMapText = computed(() => {
  return props.language === 'zh' ? '在地图上点选' : 'Pick on Map';
});

const pickingActiveText = computed(() => {
  return props.language === 'zh' ? '点选模式中：点击地图任意位置设为小站' : 'Click anywhere on map to set station';
});

const exitPickingText = computed(() => {
  return props.language === 'zh' ? '退出点选' : 'Exit';
});

const fullscreenText = computed(() => {
  return props.language === 'zh' ? '全屏显示' : 'Fullscreen';
});

const exitFullscreenText = computed(() => {
  return props.language === 'zh' ? '退出全屏' : 'Exit Fullscreen';
});

const togglePickingMode = (forceState) => {
  if (typeof forceState === 'boolean') {
    isPicking.value = forceState;
  } else {
    isPicking.value = !isPicking.value;
  }
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  nextTick(() => {
    if (map) {
      map.invalidateSize();
      setTimeout(() => map && map.invalidateSize(), 200);
    }
  });
};

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false;
    nextTick(() => map && map.invalidateSize());
  }
};

const recenterMap = () => {
  if (!map) return;
  const lat = parseFloat(props.latitude);
  const lng = parseFloat(props.longitude);
  if (!isNaN(lat) && !isNaN(lng)) {
    map.flyTo([lat, lng], Math.max(map.getZoom(), 11));
  }
};

// 创建带动画脉冲的箭头图标
const createArrowIcon = (rotation) => {
  const color = props.theme === 'dark' ? '#00d4ff' : '#0098c8';
  const shadowCss = props.theme === 'dark' 
    ? `drop-shadow(0px 0px 4px rgba(0, 212, 255, 0.7))`
    : `drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.4))`;
  
  const arrowSvg = `
    <div class="map-pulse-container">
      <div class="map-pulse" style="border-color: ${color}"></div>
      <div class="map-pulse" style="border-color: ${color}; animation-delay: 0.8s"></div>
      <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="position:relative; z-index:2; filter: ${shadowCss};">
        <g transform="rotate(${rotation} 25 25)">
          <path d="M 25 5 L 12 25 L 22 20 L 22 45 L 28 45 L 28 20 L 38 25 Z" fill="${color}"/>
        </g>
      </svg>
    </div>
  `;
  
  return L.divIcon({
    className: 'custom-map-marker',
    html: arrowSvg,
    iconSize: [50, 50],
    iconAnchor: [25, 25]
  });
};

const handleMapClick = (e) => {
  if (!isPicking.value) return;
  const rawLat = e.latlng.lat;
  const rawLng = e.latlng.lng;
  const lat = parseFloat(rawLat.toFixed(4));
  const lng = parseFloat(rawLng.toFixed(4));

  emit('select-location', { lat, lng });
  emit('update:location', { lat, lng });
};

const initMap = () => {
  if (!document.getElementById('map')) return;

  const lat = parseFloat(props.latitude) || 31.24;
  const lng = parseFloat(props.longitude) || 121.50;

  if (map) {
    map.remove();
    map = null;
    marker = null;
  }

  map = L.map('map', { zoomControl: false }).setView([lat, lng], 13);
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer(`https://webrd0{s}.is.autonavi.com/appmaptile?lang=${props.language === 'zh' ? 'zh_cn' : 'en'}&size=1&scale=1&style=8&x={x}&y={y}&z={z}`, {
    subdomains: ['1', '2', '3', '4'],
    attribution: '&copy; <a href="https://www.amap.com/" target="_blank">高德地图</a>',
    maxZoom: 18,
    minZoom: 3,
    className: 'map-tiles'
  }).addTo(map);

  map.on('click', handleMapClick);

  updateMarker();
};

const updateMarker = (shouldFly = false) => {
  if (!map) return;
  const lat = parseFloat(props.latitude);
  const lng = parseFloat(props.longitude);
  if (isNaN(lat) || isNaN(lng)) return;

  const rotation = props.azimuth;
  const tooltipText = props.language === 'zh' 
    ? `方位角: ${Math.round(props.azimuth)}°` 
    : `Azimuth: ${Math.round(props.azimuth)}°`;

  if (marker) {
    marker.setLatLng([lat, lng]);
    marker.setIcon(createArrowIcon(rotation));
    marker.setTooltipContent(tooltipText);
    marker.options.title = props.language === 'zh' ? '天线指向' : 'Antenna Direction';
  } else {
    marker = L.marker([lat, lng], { 
      icon: createArrowIcon(rotation),
      title: props.language === 'zh' ? '天线指向' : 'Antenna Direction'
    }).addTo(map);
    
    marker.bindTooltip(tooltipText, { permanent: false, direction: 'top' });
  }
  
  if (shouldFly) {
    map.flyTo([lat, lng], map.getZoom());
  } else {
    map.setView([lat, lng], map.getZoom());
  }
};

onMounted(() => {
  initMap();
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

watch(() => [props.latitude, props.longitude], () => {
  updateMarker();
});

watch(() => props.azimuth, () => {
  updateMarker();
});

watch(() => props.language, () => {
  initMap();
});

watch(() => props.theme, (newTheme) => {
  if (currentTheme !== newTheme) {
    currentTheme = newTheme;
    updateMarker();
  }
});

defineExpose({
  togglePickingMode,
  toggleFullscreen,
  isPicking,
  isFullscreen
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 240px;
  position: relative;
  background-color: var(--map-bg-a);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 全屏模式样式 */
.map-container.is-fullscreen {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  min-height: 100vh !important;
  z-index: 99999 !important;
  border-radius: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
}

#map { 
  width: 100%; 
  height: 100%; 
  z-index: 1; 
  transition: cursor 0.2s ease;
}

#map.picking-crosshair,
.map-container.is-picking-active :deep(.leaflet-grab),
.map-container.is-picking-active :deep(.leaflet-interactive) {
  cursor: crosshair !important;
}

/* 顶部控制栏 */
.map-top-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
}

.map-btn {
  background: var(--bg-surface-2);
  padding: 6px 12px;
  border-radius: 8px;
  color: var(--text-primary);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.map-btn-icon {
  padding: 7px;
}

.map-btn:hover {
  background: var(--bg-surface);
  color: var(--cyan);
  border-color: var(--border-hover);
  box-shadow: 0 0 12px var(--cyan-dim);
}

.map-btn:active {
  transform: scale(0.96);
}

.map-btn-picking.active,
.map-btn.active {
  background: var(--cyan);
  color: #050b14;
  border-color: var(--cyan);
  box-shadow: 0 0 14px var(--cyan-glow);
  font-weight: 600;
}

.map-btn-picking.active {
  animation: pulse-border 2s infinite;
}

@keyframes pulse-border {
  0% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.6); }
  70% { box-shadow: 0 0 0 8px rgba(0, 212, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0); }
}

.map-btn-text {
  line-height: 1;
}

/* 点选模式顶部提示条 */
.map-picking-banner {
  position: absolute;
  top: 50px;
  left: 10px;
  right: 10px;
  z-index: 1000;
  background: rgba(10, 25, 47, 0.92);
  color: var(--cyan);
  border: 1px solid var(--cyan);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px rgba(0, 212, 255, 0.25);
  animation: slideDown 0.25s ease-out;
}

:global(.light-theme) .map-picking-banner {
  background: rgba(240, 249, 255, 0.95);
  color: #0284c7;
  border-color: #0284c7;
  box-shadow: 0 4px 16px rgba(2, 132, 199, 0.2);
}

.picking-pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan);
  animation: pulse-signal 1.2s infinite;
  margin-right: 6px;
  flex-shrink: 0;
}

:global(.light-theme) .picking-pulse-dot {
  background: #0284c7;
  box-shadow: 0 0 8px #0284c7;
}

.picking-text {
  flex: 1;
  font-size: 11.5px;
  font-weight: 500;
  margin-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-exit-picking {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid currentColor;
  color: inherit;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-exit-picking:hover {
  background: var(--cyan);
  color: #050b14;
}

/* 南向指示标 */
.south-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--bg-surface-2);
  padding: 5px 10px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  box-shadow: var(--shadow-card);
  z-index: 1000;
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* 动效过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Map Tile Dark Filter */
.map-container.map-theme-dark :deep(.map-tiles) {
  filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(90%);
}
.map-container.map-theme-dark :deep(.leaflet-control-zoom-in),
.map-container.map-theme-dark :deep(.leaflet-control-zoom-out),
.map-container.map-theme-dark :deep(.leaflet-control-attribution) {
  filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(90%);
}

/* Custom Marker CSS Animation */
:deep(.map-pulse-container) {
  position: relative; width: 50px; height: 50px;
}
:deep(.map-pulse) {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: 40px; height: 40px; border-radius: 50%; border: 2px solid; opacity: 0;
  animation: map-ping 2.5s ease-out infinite;
}
:deep(.custom-map-marker) {
  background: transparent !important;
  border: none !important;
}

@keyframes map-ping {
  0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
}
</style>
