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
        <select v-model="selectedSatelliteName" class="picker-view">
          <option v-for="name in satelliteNames" :key="name" :value="name">
            {{ name }}
          </option>
        </select>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { satelliteData, calculateParameters } from './utils/calculate';
import { translations } from './utils/i18n';
import MapView from './components/MapView.vue';

const satelliteNames = Object.keys(satelliteData);
const selectedSatelliteName = ref(satelliteNames[0]);
const latitude = ref('');
const longitude = ref('');
const orbitalLongitude = ref('');
const elevation = ref('');
const azimuth = ref('');
const polarization = ref('');
const azimuthValue = ref(0);

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
  align-items: center;
  margin-bottom: 10px;
}

.label {
  width: 100px;
  font-weight: bold;
  transition: color 0.3s ease;
}

.picker-view, .input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: #ffffff;
  color: #333;
  transition: all 0.3s ease;
}

.picker-view:focus, .input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
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

/* 重点：暗主题下输入框和选择框的文本为白色 */
.dark-theme .picker-view,
.dark-theme .input {
  background-color: #333;
  color: #ffffff;
  border-color: #555;
}

.dark-theme .picker-view option {
  background-color: #333;
  color: #ffffff;
}

.dark-theme .picker-view:focus,
.dark-theme .input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
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
</style>

<style>
/* 确保应用容器占满整个视口 */
#app {
  margin: 0;
  padding: 0;
}
</style>
