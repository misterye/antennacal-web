<template>
  <div class="app-wrapper" :class="{ 'dark-theme': isDarkTheme }">
    <div class="container">
    <header class="header">
      <h1 class="title">{{ t.title }}</h1>
      <div class="header-buttons">
        <button @click="toggleLanguage" class="lang-toggle" :title="t.switchLanguage">
          <span>{{ currentLang === 'zh' ? 'EN' : '中' }}</span>
        </button>
        <button @click="toggleTheme" class="theme-toggle" :title="isDarkTheme ? t.switchToLight : t.switchToDark">
          <span v-if="isDarkTheme">☀️</span>
          <span v-else>🌙</span>
        </button>
      </div>
    </header>

    <div class="input-section">
      <div class="location-row">
        <label class="label">{{ t.satelliteSelect }}</label>
        <div class="sat-combobox" ref="comboboxRef">
          <div 
            class="sat-combobox-input-wrap" 
            :class="{ open: dropdownOpen, focused: dropdownOpen }"
            @click="toggleDropdown"
          >
            <input
              ref="searchInputRef"
              type="text"
              class="sat-combobox-input"
              v-model="searchQuery"
              :placeholder="dropdownOpen ? t.searchPlaceholder : ''"
              @focus="openDropdown"
              @input="openDropdown"
              @keydown.down.prevent="highlightNext"
              @keydown.up.prevent="highlightPrev"
              @keydown.enter.prevent="selectHighlighted"
              @keydown.esc="closeDropdown"
              autocomplete="off"
              spellcheck="false"
            />
            <span class="sat-combobox-selected-display" v-if="!dropdownOpen" :title="selectedSatelliteName">{{ selectedSatelliteName }}</span>
            <span class="sat-combobox-arrow">▾</span>
          </div>
          <ul
            v-if="dropdownOpen && filteredSatellites.length > 0"
            class="sat-combobox-list"
            ref="listRef"
          >
            <li
              v-for="(item, index) in filteredSatellites"
              :key="item.name"
              class="sat-combobox-item"
              :class="{ highlighted: index === highlightedIndex, selected: item.name === selectedSatelliteName }"
              @mousedown.prevent="selectItem(item.name)"
              @mousemove="highlightedIndex = index"
              :title="item.name"
            >
              <span class="sat-item-name">{{ item.name }}</span>
              <span class="sat-item-pos">{{ item.pos }}</span>
            </li>
          </ul>
          <div v-if="dropdownOpen && filteredSatellites.length === 0" class="sat-combobox-empty">
            {{ t.noResults }}
          </div>
        </div>
      </div>
    </div>

    <div class="input-section location-input">
      <div class="location-row">
        <label class="label">{{ t.stationLatitude }}</label>
        <input 
          type="number" 
          v-model="latitude" 
          :placeholder="t.latitudePlaceholder" 
          class="input"
        />
      </div>
      <div class="location-row">
        <label class="label">{{ t.stationLongitude }}</label>
        <input 
          type="number" 
          v-model="longitude" 
          :placeholder="t.longitudePlaceholder" 
          class="input"
        />
      </div>
      <button @click="getLocation" class="location-button enhanced-button">{{ t.getLocation }}</button>
    </div>

    <button @click="handleCalculate" class="calculate-button enhanced-button">{{ t.calculate }}</button>

    <div class="output-section">
      <div class="output-header">
        <h2 class="output-title">{{ t.results }}</h2>
      </div>
      <div class="output-item">
        <span class="output-label">{{ t.orbitalLongitude }}</span>
        <span class="output-text">{{ orbitalLongitude }}</span>
      </div>
      <div class="output-item">
        <span class="output-label">{{ t.elevation }}</span>
        <span class="output-text">{{ elevation }}</span>
      </div>
      <div class="output-item">
        <span class="output-label">{{ t.azimuth }}</span>
        <span class="output-text">{{ azimuth }}</span>
      </div>
      <div class="output-item">
        <span class="output-label">{{ t.polarization }}</span>
        <span class="output-text">{{ polarization }}</span>
      </div>
    </div>

    <div class="map-section">
      <div class="map-header">
        <h2 class="map-title">{{ t.mapTitle }}</h2>
      </div>
      <div class="map-wrapper">
        <MapView 
          :latitude="latitude" 
          :longitude="longitude" 
          :azimuth="azimuthValue"
          :language="currentLang"
        />
      </div>
    </div>

    <!-- 卫星详情信息 -->
    <div class="sat-info-section" v-if="currentSatInfo">
      <div class="sat-info-grid">
        <div class="sat-info-item" v-if="currentSatInfo.orbit">
          <span class="sat-info-label">{{ t.orbit }}</span>
          <span class="sat-info-value">{{ currentSatInfo.orbit }}</span>
        </div>
        <div class="sat-info-item" v-if="currentSatInfo.status">
          <span class="sat-info-label">{{ t.status }}</span>
          <span class="sat-info-value sat-status" :class="currentSatInfo.status">{{ currentSatInfo.status }}</span>
        </div>
        <div class="sat-info-item" v-if="currentSatInfo.operator">
          <span class="sat-info-label">{{ t.operator }}</span>
          <span class="sat-info-value">{{ currentSatInfo.operator }}</span>
        </div>
        <div class="sat-info-item" v-if="currentSatInfo.platform">
          <span class="sat-info-label">{{ t.platform }}</span>
          <span class="sat-info-value">{{ currentSatInfo.platform }}</span>
        </div>
        <div class="sat-info-item" v-if="currentSatInfo.vehicle">
          <span class="sat-info-label">{{ t.vehicle }}</span>
          <span class="sat-info-value">{{ currentSatInfo.vehicle }}</span>
        </div>
        <div class="sat-info-item" v-if="currentSatInfo.mass">
          <span class="sat-info-label">{{ t.mass }}</span>
          <span class="sat-info-value">{{ currentSatInfo.mass }} kg</span>
        </div>
        <div class="sat-info-item" v-if="currentSatInfo.launchDate">
          <span class="sat-info-label">{{ t.launchDate }}</span>
          <span class="sat-info-value">{{ currentSatInfo.launchDate }}</span>
        </div>
        <div class="sat-info-item" v-if="currentSatInfo.lifetime">
          <span class="sat-info-label">{{ t.lifetime }}</span>
          <span class="sat-info-value">{{ currentSatInfo.lifetime }}</span>
        </div>
        <div class="sat-info-item sat-info-comments" v-if="currentSatInfo.comments">
          <span class="sat-info-label">{{ t.comments }}</span>
          <span class="sat-info-value">{{ currentLang === 'zh' ? (currentSatInfo.comments_zh || currentSatInfo.comments) : currentSatInfo.comments }}</span>
        </div>
      </div>
    </div>

    <!-- 实时罗盘对准 -->
    <CompassAlignment 
      v-if="azimuthValue > 0"
      :targetAzimuth="azimuthValue"
      :language="currentLang"
    />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onBeforeUnmount } from 'vue';
import { satelliteData, satelliteInfo, calculateParameters } from './utils/calculate';
import { translations } from './utils/i18n';
import MapView from './components/MapView.vue';
import CompassAlignment from './components/CompassAlignment.vue';

const satelliteNames = Object.keys(satelliteData);
// Pre-build list with position for display
const allSatellites = satelliteNames.map(name => ({ name, pos: satelliteData[name] }));

const selectedSatelliteName = ref(satelliteNames[0]);
const latitude = ref('');
const longitude = ref('');
const orbitalLongitude = ref('');
const elevation = ref('');
const azimuth = ref('');
const polarization = ref('');
const azimuthValue = ref(0);

// Combobox state
const searchQuery = ref('');
const dropdownOpen = ref(false);
const highlightedIndex = ref(-1);
const comboboxRef = ref(null);
const searchInputRef = ref(null);
const listRef = ref(null);

const filteredSatellites = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return allSatellites;
  return allSatellites.filter(s =>
    s.name.toLowerCase().includes(q) || s.pos.toLowerCase().includes(q)
  );
});

const openDropdown = () => {
  dropdownOpen.value = true;
  // Highlight current selection
  const idx = filteredSatellites.value.findIndex(s => s.name === selectedSatelliteName.value);
  highlightedIndex.value = idx >= 0 ? idx : 0;
  nextTick(() => scrollHighlightedIntoView());
};

const closeDropdown = () => {
  dropdownOpen.value = false;
  searchQuery.value = '';
  highlightedIndex.value = -1;
};

const toggleDropdown = (e) => {
  if (dropdownOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
    nextTick(() => searchInputRef.value?.focus());
  }
};

const selectItem = (name) => {
  selectedSatelliteName.value = name;
  closeDropdown();
};

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && filteredSatellites.value[highlightedIndex.value]) {
    selectItem(filteredSatellites.value[highlightedIndex.value].name);
  }
};

const highlightNext = () => {
  if (!dropdownOpen.value) { openDropdown(); return; }
  const max = filteredSatellites.value.length - 1;
  highlightedIndex.value = highlightedIndex.value < max ? highlightedIndex.value + 1 : 0;
  nextTick(() => scrollHighlightedIntoView());
};

const highlightPrev = () => {
  if (!dropdownOpen.value) { openDropdown(); return; }
  const max = filteredSatellites.value.length - 1;
  highlightedIndex.value = highlightedIndex.value > 0 ? highlightedIndex.value - 1 : max;
  nextTick(() => scrollHighlightedIntoView());
};

const scrollHighlightedIntoView = () => {
  if (!listRef.value) return;
  const items = listRef.value.querySelectorAll('.sat-combobox-item');
  const el = items[highlightedIndex.value];
  if (el) el.scrollIntoView({ block: 'nearest' });
};

// Reset highlight when filter changes
watch(searchQuery, () => { highlightedIndex.value = 0; });

// Close on outside click
const handleOutsideClick = (e) => {
  if (comboboxRef.value && !comboboxRef.value.contains(e.target)) {
    closeDropdown();
  }
};
onMounted(() => document.addEventListener('mousedown', handleOutsideClick));
onBeforeUnmount(() => document.removeEventListener('mousedown', handleOutsideClick));

const currentSatInfo = computed(() => satelliteInfo[selectedSatelliteName.value] || null);

// 语言管理
const currentLang = ref('zh');
const t = computed(() => translations[currentLang.value]);

// 主题管理
const isDarkTheme = ref(false);

// 初始化
onMounted(() => {
  // 初始化语言
  const savedLang = localStorage.getItem('language');
  if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
    currentLang.value = savedLang;
  }
  
  // 初始化主题
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDarkTheme.value = true;
  } else if (savedTheme === 'light') {
    isDarkTheme.value = false;
  } else {
    // 检测系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkTheme.value = prefersDark;
  }
});

// 切换语言
const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh';
  localStorage.setItem('language', currentLang.value);
};

// 切换主题
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light');
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude.toFixed(2);
        longitude.value = position.coords.longitude.toFixed(2);
        alert(t.value.locationSuccess);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(t.value.locationError);
      }
    );
  } else {
    alert(t.value.locationNotSupported);
  }
};

const handleCalculate = () => {
  const result = calculateParameters(
    selectedSatelliteName.value,
    parseFloat(latitude.value),
    parseFloat(longitude.value)
  );

  if (result) {
    orbitalLongitude.value = result.orbitalLongitude;
    elevation.value = result.elevation;
    azimuth.value = result.azimuth;
    polarization.value = result.polarization;
    azimuthValue.value = result.azimuthValue;
  } else {
    alert(t.value.invalidInput);
  }
};
</script>

<style scoped>
/* 全屏背景容器 */
.app-wrapper {
  min-height: 100vh;
  background-color: #ffffff;
  color: #333;
  transition: background-color 0.3s ease, color 0.3s ease;
  padding: 20px 0;
}

.container {
  font-family: sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

/* 头部按钮容器 */
.header-buttons {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
}

/* 语言切换按钮 */
.lang-toggle {
  background: none;
  border: 2px solid #ddd;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #333;
}

.lang-toggle:hover {
  transform: scale(1.1);
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

/* 主题切换按钮 */
.theme-toggle {
  background: none;
  border: 2px solid #ddd;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  transform: scale(1.1);
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.input-section {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.location-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
}

.label {
  width: 100%;
  margin-bottom: 8px;
  font-weight: bold;
  transition: color 0.3s ease;
}

.input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: #ffffff;
  color: #333;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* ---- Searchable Combobox ---- */
.sat-combobox {
  width: 100%;
  position: relative;
  font-size: 15px;
}

.sat-combobox-input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  padding: 0 6px 0 0;
  height: 36px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.sat-combobox-input-wrap.focused {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.12);
}

.sat-combobox-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0 6px;
  font-size: 15px;
  color: #333;
  min-width: 0;
  height: 100%;
}

/* When closed show selected satellite name over the input */
.sat-combobox-input-wrap:not(.open) .sat-combobox-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
}

.sat-combobox-selected-display {
  flex: 1;
  padding: 0 6px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #333;
  font-size: 15px;
  line-height: 36px;
  cursor: pointer;
}

.sat-combobox-arrow {
  flex-shrink: 0;
  color: #888;
  font-size: 12px;
  padding: 0 2px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s;
}

.sat-combobox-input-wrap.open .sat-combobox-arrow {
  transform: rotate(180deg);
}

.sat-combobox-list {
  position: absolute;
  top: calc(100% + 3px);
  left: 0;
  right: 0;
  max-height: 280px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  z-index: 1000;
  margin: 0;
  padding: 4px 0;
  list-style: none;
}

.sat-combobox-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 12px;
  cursor: pointer;
  gap: 8px;
  transition: background-color 0.1s;
}

.sat-combobox-item.highlighted {
  background-color: #e8f0fe;
}

.sat-combobox-item.selected {
  font-weight: bold;
}

.sat-item-name {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
  color: #222;
  font-size: 14px;
}

.sat-item-pos {
  flex-shrink: 0;
  font-size: 12px;
  color: #888;
  background: #f0f0f0;
  border-radius: 3px;
  padding: 1px 5px;
  margin-left: 4px;
  white-space: nowrap;
}

.sat-combobox-empty {
  position: absolute;
  top: calc(100% + 3px);
  left: 0;
  right: 0;
  padding: 12px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  color: #888;
  font-size: 14px;
  text-align: center;
  z-index: 1000;
}

.enhanced-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.enhanced-button:hover {
  background-color: #0056b3;
}

.location-button {
  background-color: #28a745;
  margin-top: 5px;
  margin-bottom: 10px;
}

.location-button:hover {
  background-color: #218838;
}

.output-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.output-header, .map-header {
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
  transition: border-color 0.3s ease;
}

.output-title, .map-title {
  font-size: 18px;
  color: #333;
  margin: 0;
  transition: color 0.3s ease;
}

.output-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.output-label {
  color: #666;
  transition: color 0.3s ease;
}

.output-text {
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;
}

.map-section {
  margin-top: 20px;
}

.map-wrapper {
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
}

.sat-info-section {
  margin-top: 12px;
  padding: 12px 15px;
  background-color: #f8f9fa;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.sat-info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 0;
}

.sat-info-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 50%;
  flex: 1 1 50%;
  padding-right: 12px;
  box-sizing: border-box;
  flex-wrap: wrap;
}

.sat-info-label {
  color: #666;
  font-size: 13px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.sat-info-value {
  font-weight: bold;
  font-size: 13px;
  color: #333;
  word-break: break-word;
  transition: color 0.3s ease;
}

.sat-status.active {
  color: #28a745;
}

.sat-info-comments {
  min-width: 100%;
  flex: 1 1 100%;
  padding-top: 4px;
  border-top: 1px solid #e9e9e9;
  margin-top: 4px;
}

/* ========== 暗主题样式 ========== */
.app-wrapper.dark-theme {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

.dark-theme .title {
  color: #e0e0e0;
}

.dark-theme .lang-toggle {
  border-color: #444;
  background-color: #2a2a2a;
  color: #e0e0e0;
}

.dark-theme .lang-toggle:hover {
  border-color: #007bff;
  background-color: #333;
}

.dark-theme .theme-toggle {
  border-color: #444;
  background-color: #2a2a2a;
}

.dark-theme .theme-toggle:hover {
  border-color: #007bff;
  background-color: #333;
}

.dark-theme .input-section {
  background-color: #2a2a2a;
}

.dark-theme .label {
  color: #e0e0e0;
}

/* 重点：暗主题下输入框的文本为白色 */
.dark-theme .input {
  background-color: #333;
  color: #ffffff;
  border-color: #555;
}

.dark-theme .input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
}

/* Dark theme: combobox */
.dark-theme .sat-combobox-input-wrap {
  background-color: #333;
  border-color: #555;
}

.dark-theme .sat-combobox-input {
  color: #ffffff;
  background: transparent;
}

.dark-theme .sat-combobox-selected-display {
  color: #e0e0e0;
}

.dark-theme .sat-combobox-arrow {
  color: #aaa;
}

.dark-theme .sat-combobox-list {
  background: #2a2a2a;
  border-color: #555;
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
}

.dark-theme .sat-combobox-item {
  color: #e0e0e0;
}

.dark-theme .sat-combobox-item.highlighted {
  background-color: #1e3a5f;
}

.dark-theme .sat-item-name {
  color: #e0e0e0;
}

.dark-theme .sat-item-pos {
  color: #aaa;
  background: #3a3a3a;
}

.dark-theme .sat-combobox-empty {
  background: #2a2a2a;
  border-color: #555;
  color: #aaa;
}

/* 占位符文本在暗主题下也要可见 */
.dark-theme .input::placeholder {
  color: #999;
  opacity: 1;
}

.dark-theme .enhanced-button {
  background-color: #0d6efd;
}

.dark-theme .enhanced-button:hover {
  background-color: #0b5ed7;
}

.dark-theme .location-button {
  background-color: #198754;
}

.dark-theme .location-button:hover {
  background-color: #157347;
}

.dark-theme .output-section {
  background-color: #2a2a2a;
  border-color: #444;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.dark-theme .output-header,
.dark-theme .map-header {
  border-bottom-color: #444;
}

.dark-theme .output-title,
.dark-theme .map-title {
  color: #e0e0e0;
}

.dark-theme .output-label {
  color: #aaa;
}

.dark-theme .output-text {
  color: #e0e0e0;
}

.dark-theme .map-wrapper {
  border-color: #555;
}

.dark-theme .sat-info-section {
  background-color: #2a2a2a;
  border-color: #444;
}

.dark-theme .sat-info-label {
  color: #aaa;
}

.dark-theme .sat-info-value {
  color: #e0e0e0;
}

.dark-theme .sat-status.active {
  color: #4caf50;
}
</style>

<style>
/* 确保应用容器占满整个视口 */
#app {
  margin: 0;
  padding: 0;
}
</style>
