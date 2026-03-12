<template>
  <div class="map-container" :class="`map-theme-${theme}`">
    <div id="map"></div>
    <div class="south-indicator">{{ southText }}</div>
    <div class="recenter-btn" @click="recenterMap" :title="recenterText">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue';
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

let map = null;
let marker = null;
let currentTheme = props.theme;

// 多语言文本
const southText = computed(() => {
  return props.language === 'zh' ? '向下为正南' : 'South ↓';
});

const recenterText = computed(() => {
  return props.language === 'zh' ? '回到小站位置' : 'Recenter Map';
});

const recenterMap = () => {
  if (!map) return;
  const lat = parseFloat(props.latitude);
  const lng = parseFloat(props.longitude);
  if (!isNaN(lat) && !isNaN(lng)) {
    map.flyTo([lat, lng], map.getZoom());
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

  updateMarker();
};

const updateMarker = () => {
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
  
  map.setView([lat, lng], map.getZoom());
};

onMounted(() => {
  initMap();
});

watch(() => [props.latitude, props.longitude, props.azimuth], () => {
  updateMarker();
});

watch(() => props.language, () => {
  initMap();
});

watch(() => props.theme, (newTheme) => {
  if (currentTheme !== newTheme) {
    currentTheme = newTheme;
    updateMarker(); // To recreate the icon with the correct tint color
  }
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 200px;
  position: relative;
  background-color: var(--map-bg-a);
}

#map { width: 100%; height: 100%; z-index: 1; }

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

.recenter-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--bg-surface-2);
  padding: 8px;
  border-radius: 6px;
  color: var(--text-primary);
  box-shadow: var(--shadow-card);
  z-index: 1000;
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.recenter-btn:hover {
  background: var(--bg-surface);
  color: var(--cyan);
  border-color: var(--border-hover);
}
.recenter-btn:active {
  transform: scale(0.95);
}

/* Override Map Tile filter for dark mode using the map-theme-dark class */
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
