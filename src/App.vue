<template>
  <div class="app-wrapper" :class="isDarkTheme ? 'dark-theme' : 'light-theme'">
    <!-- HEADER -->
    <header class="header">
      <div class="header-left">
        <button v-if="showDisclaimer" class="btn-header-back" @click="showDisclaimer = false" :title="t.disclaimerBack" aria-label="返回">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div v-else class="header-icon">
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="4" stroke="var(--cyan)" stroke-width="1.5"/>
            <path d="M16 4L16 12M16 20L16 28M4 16L12 16M20 16L28 16" stroke="var(--cyan)" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M8 8L12 12M20 20L24 24M24 8L20 12M12 20L8 24" stroke="var(--cyan)" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
            <circle cx="16" cy="16" r="10" stroke="var(--cyan)" stroke-width="0.5" stroke-dasharray="3 3" opacity="0.3"/>
          </svg>
        </div>
        <span class="header-title">{{ showDisclaimer ? t.disclaimerTitle : t.title }}</span>
      </div>
      <div class="header-right">
        <span class="signal-dot"></span>
        <button class="theme-toggle" @click="toggleTheme" :title="isDarkTheme ? t.switchToLight : t.switchToDark" aria-label="主题切换">
          <div class="toggle-track"></div>
          <span class="toggle-moon">🌙</span>
          <span class="toggle-sun">☀️</span>
          <span class="toggle-knob" :class="{ 'is-light': !isDarkTheme }">
            <span class="toggle-knob-icon">{{ isDarkTheme ? '🌙' : '☀️' }}</span>
          </span>
        </button>
        <button @click="toggleLanguage" class="lang-toggle" :title="t.switchLanguage">{{ currentLang === 'zh' ? 'EN' : '中' }}</button>
      </div>
    </header>

    <div class="container main">
      <div v-if="!showDisclaimer" class="calculator-view">
        <!-- Satellite Select -->
        <div class="card stagger-1" style="z-index: 50; position: relative;">
          <div class="card-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
            {{ t.satelliteSelect }}
          </div>
          <div class="sat-selector-wrapper" ref="comboboxRef">
            <div class="sat-combobox-input-wrap" :class="{ open: dropdownOpen, focused: dropdownOpen }" @click="toggleDropdown">
              <input ref="searchInputRef" type="text" class="sat-selector" v-model="searchQuery" :placeholder="dropdownOpen ? t.searchPlaceholder : ''" @focus="openDropdown" @input="openDropdown" @keydown.down.prevent="highlightNext" @keydown.up.prevent="highlightPrev" @keydown.enter.prevent="selectHighlighted" @keydown.esc="closeDropdown" autocomplete="off" spellcheck="false" />
              <span class="sat-combobox-selected-display" v-if="!dropdownOpen" :title="selectedSatelliteName">{{ selectedSatelliteName }}</span>
              <span class="sat-selector-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </span>
            </div>
            <ul v-if="dropdownOpen && filteredSatellites.length > 0" class="sat-combobox-list" ref="listRef">
              <li v-for="(item, index) in filteredSatellites" :key="item.name" class="sat-combobox-item" :class="{ highlighted: index === highlightedIndex, selected: item.name === selectedSatelliteName }" @mousedown.prevent="selectItem(item.name)" @mousemove="highlightedIndex = index" :title="item.name">
                <span class="sat-item-name">{{ item.name }}</span>
                <span class="sat-item-pos">{{ item.pos }}</span>
              </li>
            </ul>
            <div v-if="dropdownOpen && filteredSatellites.length === 0" class="sat-combobox-empty">{{ t.noResults }}</div>
          </div>
        </div>

        <!-- Location Inputs -->
        <div class="card stagger-2">
          <div class="card-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {{ t.stationLatitude }}/{{ t.stationLongitude }}
          </div>
          <div class="input-row" style="margin-bottom:12px">
            <div class="input-group">
              <input class="input-field" type="number" v-model="latitude" :placeholder="t.latitudePlaceholder" step="any" />
              <label class="input-label">{{ t.stationLatitude }}</label>
            </div>
            <div class="input-group">
              <input class="input-field" type="number" v-model="longitude" :placeholder="t.longitudePlaceholder" step="any" />
              <label class="input-label">{{ t.stationLongitude }}</label>
            </div>
          </div>
          <button class="btn-locate" @click="getLocation">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'spin': isLocating }"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
            {{ isLocating ? t.locationSuccess : t.getLocation }}
          </button>
        </div>

        <!-- Calculate -->
        <button class="btn-calculate stagger-3" @click="handleCalculate" :disabled="isCalculating">
          <svg v-if="!isCalculating" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M21 12a9 9 0 11-18 0"/></svg>
          {{ isCalculating ? '计算中...' : t.calculate }}
        </button>

        <!-- Results -->
        <div class="card stagger-4">
          <div class="card-label">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
             {{ t.results }}
          </div>
          <div v-if="!hasCalculated" class="results-placeholder">{{ t.resultsPlaceholder }}</div>
          <div v-else class="results-grid" :class="{ 'calculating': isCalculating }">
            <div class="metric-card">
              <span class="metric-icon">🛸</span>
              <div class="metric-label">{{ t.orbitalLongitude }}</div>
              <div class="metric-value">{{ orbitalLongitude }}<span class="metric-unit"></span></div>
            </div>
            <div class="metric-card">
              <span class="metric-icon">📐</span>
              <div class="metric-label">{{ t.elevation }}</div>
              <div class="metric-value">{{ elevation }}<span class="metric-unit"></span></div>
            </div>
            <div class="metric-card">
              <span class="metric-icon">🧭</span>
              <div class="metric-label">{{ t.azimuth }}</div>
              <div class="metric-value">{{ azimuth }}<span class="metric-unit"></span></div>
            </div>
            <div class="metric-card">
              <span class="metric-icon">🔄</span>
              <div class="metric-label" style="text-transform: none;">{{ t.polarization }}</div>
              <div class="metric-value">{{ polarization }}<span class="metric-unit"></span></div>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div class="card stagger-5">
          <div class="card-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg>
            {{ t.mapTitle }}
          </div>
          <div class="map-wrapper">
            <MapView :latitude="latitude" :longitude="longitude" :azimuth="azimuthValue" :language="currentLang" :theme="isDarkTheme ? 'dark' : 'light'" />
          </div>
        </div>

        <!-- Satellite Info -->
        <div class="card" v-if="currentSatInfo">
          <div class="card-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            卫星详情
          </div>
          <div class="status-badge" v-if="currentSatInfo.status">
            <span class="status-badge-dot" :class="{ 'active': currentSatInfo.status.toLowerCase().includes('active') }"></span>
            {{ currentSatInfo.status }} · {{ currentSatInfo.orbit || 'GEO' }}
          </div>
          <div class="info-chips">
            <div class="info-chip" v-if="currentSatInfo.vehicle">
              <span class="info-chip-icon">🚀</span>
              <span class="info-chip-label">{{ t.vehicle }}</span>
              <span class="info-chip-value">{{ currentSatInfo.vehicle }}</span>
            </div>
            <div class="info-chip" v-if="currentSatInfo.platform">
              <span class="info-chip-icon">📡</span>
              <span class="info-chip-label">{{ t.platform }}</span>
              <span class="info-chip-value">{{ currentSatInfo.platform }}</span>
            </div>
            <div class="info-chip" v-if="currentSatInfo.mass">
              <span class="info-chip-icon">⚖️</span>
              <span class="info-chip-label">{{ t.mass }}</span>
              <span class="info-chip-value">{{ currentSatInfo.mass }} kg</span>
            </div>
            <div class="info-chip" v-if="currentSatInfo.launchDate">
              <span class="info-chip-icon">📅</span>
              <span class="info-chip-label">{{ t.launchDate }}</span>
              <span class="info-chip-value">{{ currentSatInfo.launchDate }}</span>
            </div>
            <div class="info-chip" v-if="currentSatInfo.lifetime">
              <span class="info-chip-icon">⏱️</span>
              <span class="info-chip-label">{{ t.lifetime }}</span>
              <span class="info-chip-value">{{ currentSatInfo.lifetime }}</span>
            </div>
            <div class="info-chip" v-if="currentSatInfo.operator">
              <span class="info-chip-icon">🏢</span>
              <span class="info-chip-label">{{ t.operator }}</span>
              <span class="info-chip-value">{{ currentSatInfo.operator }}</span>
            </div>
          </div>
          <div class="info-note" v-if="currentSatInfo.comments">
            <span>💡</span>
            <span>{{ currentLang === 'zh' ? (currentSatInfo.comments_zh || currentSatInfo.comments) : currentSatInfo.comments }}</span>
          </div>
        </div>

        <!-- 实时罗盘对准 -->
        <CompassAlignment v-if="azimuthValue > 0" :targetAzimuth="azimuthValue" :language="currentLang" :theme="isDarkTheme ? 'dark' : 'light'" />

        <!-- Disclaimer Card at the very bottom -->
        <div class="card card-interactive disclaimer-card stagger-6" @click="showDisclaimer = true">
          <div class="disclaimer-card-content">
            <div class="disclaimer-card-icon">🛡️</div>
            <div class="disclaimer-card-text-wrap">
              <div class="disclaimer-card-title">{{ t.disclaimerCardTitle }}</div>
              <div class="disclaimer-card-desc">{{ t.disclaimerCardDesc }}</div>
            </div>
            <div class="disclaimer-card-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Disclaimer Details View -->
      <div v-else class="disclaimer-view">
        <div class="card disclaimer-details-card">
          <div class="disclaimer-header">
            <span class="disclaimer-icon">🛡️</span>
            <h2>{{ t.disclaimerTitle }}</h2>
          </div>
          
          <div class="disclaimer-body">
            <div class="disclaimer-section">
              <h3>{{ t.disclaimerContent.title1 }}</h3>
              <p>{{ t.disclaimerContent.desc1 }}</p>
            </div>
            
            <div class="disclaimer-section">
              <h3>{{ t.disclaimerContent.title2 }}</h3>
              <p>{{ t.disclaimerContent.desc2 }}</p>
            </div>
            
            <div class="disclaimer-section">
              <h3>{{ t.disclaimerContent.title3 }}</h3>
              <p>{{ t.disclaimerContent.desc3 }}</p>
            </div>
            
            <div class="disclaimer-section">
              <h3>{{ t.disclaimerContent.title4 }}</h3>
              <p>{{ t.disclaimerContent.desc4 }}</p>
            </div>
          </div>
          
          <div class="disclaimer-footer">
            <p>{{ t.disclaimerContent.footer }}</p>
          </div>
        </div>

        <button class="btn-back" @click="showDisclaimer = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {{ t.disclaimerBack }}
        </button>
      </div>
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

const selectedSatelliteName = ref(localStorage.getItem('selectedSatelliteName') || satelliteNames[0]);
const latitude = ref(localStorage.getItem('latitude') || '31.24'); // Default to Shanghai Lujiazui
const longitude = ref(localStorage.getItem('longitude') || '121.50');
const orbitalLongitude = ref('');
const elevation = ref('');
const azimuth = ref('');
const polarization = ref('');
const azimuthValue = ref(0);

const isLocating = ref(false);
const isCalculating = ref(false);
const hasCalculated = ref(false);

const showDisclaimer = ref(false);

// Smooth scroll to top when toggling views
watch(showDisclaimer, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Watch inputs to save to localStorage
watch(selectedSatelliteName, (newVal) => {
  localStorage.setItem('selectedSatelliteName', newVal);
});
watch(latitude, (newVal) => {
  localStorage.setItem('latitude', newVal);
});
watch(longitude, (newVal) => {
  localStorage.setItem('longitude', newVal);
});

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

const setHtmlThemeAttr = (isDark) => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
};

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
  setHtmlThemeAttr(isDarkTheme.value);

  // 自动恢复上次的计算结果
  if (localStorage.getItem('latitude') || localStorage.getItem('longitude') || localStorage.getItem('selectedSatelliteName')) {
    runCalculation(false);
  }
});

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh';
  localStorage.setItem('language', currentLang.value);
};

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light');
  setHtmlThemeAttr(isDarkTheme.value);
};

const getLocation = () => {
  if (navigator.geolocation) {
    isLocating.value = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude.toFixed(2);
        longitude.value = position.coords.longitude.toFixed(2);
        setTimeout(() => { isLocating.value = false; }, 1000);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(t.value.locationError);
        isLocating.value = false;
      }
    );
  } else {
    alert(t.value.locationNotSupported);
  }
};

const runCalculation = (showAlert = false) => {
  const latVal = parseFloat(latitude.value);
  const lngVal = parseFloat(longitude.value);
  
  if (isNaN(latVal) || isNaN(lngVal)) {
    if (showAlert) {
      alert(t.value.invalidInput);
    }
    return;
  }

  const result = calculateParameters(
    selectedSatelliteName.value,
    latVal,
    lngVal
  );

  if (result) {
    orbitalLongitude.value = result.orbitalLongitude;
    elevation.value = result.elevation;
    azimuth.value = result.azimuth;
    polarization.value = result.polarization;
    azimuthValue.value = result.azimuthValue;
    hasCalculated.value = true;
  } else if (showAlert) {
    alert(t.value.invalidInput);
  }
};

const handleCalculate = (e) => {
  // Add Ripple effect
  if (e && e.target) {
    const btn = e.target.closest('.btn-calculate');
    if (btn) {
      const r = btn.getBoundingClientRect();
      const sp = document.createElement('span');
      const sz = Math.max(r.width, r.height);
      sp.classList.add('ripple');
      sp.style.width = sp.style.height = sz + 'px';
      sp.style.left = (e.clientX - r.left - sz/2) + 'px';
      sp.style.top = (e.clientY - r.top - sz/2) + 'px';
      btn.appendChild(sp);
      setTimeout(() => sp.remove(), 600);
    }
  }

  isCalculating.value = true;
  
  setTimeout(() => {
    runCalculation(true);
    isCalculating.value = false;
  }, 800);
};
</script>

<style scoped>
/* =============================================
   LAYOUT
   ============================================= */
.app-wrapper {
  min-height: 100vh;
  padding: 0 0 48px;
  display: flex;
  flex-direction: column;
}

.main {
  position: relative;
  z-index: 1;
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.calculator-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

/* =============================================
   HEADER
   ============================================= */
.header {
  position: sticky; top: 0; z-index: 100;
  background: var(--bg-header);
  backdrop-filter: blur(var(--blur-amount)); -webkit-backdrop-filter: blur(var(--blur-amount));
  border-bottom: 1px solid var(--border);
  padding: 0 20px; height: 56px;
  display: flex; align-items: center; justify-content: space-between;
  animation: slideDown 0.5s ease both;
  transition: background 0.45s, border-color 0.35s;
}

.header-left { display: flex; align-items: center; gap: 12px; }
.header-icon { width: 32px; height: 32px; }
.header-icon svg { width: 100%; height: 100%; filter: drop-shadow(0 0 6px var(--cyan)); transition: filter 0.3s; }
.header-title {
  font-family: var(--font-display); font-size: 13px; font-weight: 700;
  letter-spacing: 0.15em; color: var(--text-primary); text-transform: uppercase;
  transition: color 0.35s;
}

.header-right { display: flex; align-items: center; gap: 12px; }

/* THEME TOGGLE */
.theme-toggle {
  position: relative; width: 58px; height: 30px;
  background: var(--bg-surface-2); border: 1px solid var(--border); border-radius: 999px; cursor: pointer;
  transition: background 0.4s, border-color 0.35s, box-shadow 0.3s;
  flex-shrink: 0; overflow: visible; display: flex; align-items: center; justify-content: center;
}
.theme-toggle:hover { border-color: var(--border-hover); box-shadow: 0 0 12px var(--cyan-dim); }
.toggle-track { position: absolute; inset: 0; border-radius: 999px; overflow: hidden; }
.toggle-moon { position: absolute; left: 7px; top: 50%; transform: translateY(-50%); font-size: 12px; transition: opacity 0.3s; pointer-events: none; line-height: 1; }
.toggle-sun { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); font-size: 12px; transition: opacity 0.3s; pointer-events: none; line-height: 1; opacity: 0.3; }

.light-theme .toggle-moon { opacity: 0.3; }
.light-theme .toggle-sun { opacity: 1; }

.toggle-knob {
  position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 50%;
  background: var(--cyan); box-shadow: 0 0 10px var(--cyan-glow);
  transition: transform 0.4s cubic-bezier(0.34,1.5,0.64,1), background 0.35s, box-shadow 0.35s;
  display: flex; align-items: center; justify-content: center; pointer-events: none;
}
.toggle-knob.is-light {
  transform: translateX(28px); background: #f59e0b; box-shadow: 0 0 10px rgba(245,158,11,0.55);
}
.toggle-knob-icon { font-size: 11px; line-height: 1; }

.lang-toggle {
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em;
  color: var(--text-secondary); background: var(--bg-surface);
  border: 1px solid var(--border); border-radius: 4px; padding: 4px 10px;
  cursor: pointer; transition: all 0.25s;
}
.lang-toggle:hover { color: var(--cyan); border-color: var(--border-hover); }

.signal-dot {
  width: 8px; height: 8px; border-radius: 50%; background: var(--green);
  box-shadow: 0 0 8px var(--green); animation: pulse-signal 2s ease-in-out infinite;
}

/* =============================================
   CARD
   ============================================= */
.card {
  background: var(--bg-surface); border: 1px solid var(--border);
  border-radius: 16px; padding: 20px;
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  box-shadow: var(--shadow-card);
  transition: background 0.4s, border-color 0.3s, box-shadow 0.3s;
  animation: fadeUp 0.6s ease both;
}
.card:hover { border-color: var(--border-hover); }

.card-label {
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--text-secondary);
  margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
  transition: color 0.35s;
}
.card-label::after {
  content: ''; flex: 1; height: 1px;
  background: linear-gradient(to right, var(--border), transparent);
}

/* =============================================
   SATELLITE SELECTOR
   ============================================= */
.sat-selector-wrapper { position: relative; width: 100%; }
.sat-combobox-input-wrap {
  display: flex; align-items: center;
  width: 100%; background: var(--input-bg);
  border: 1px solid var(--border); border-radius: 10px;
  padding: 0 44px 0 16px; height: 46px;
  font-family: var(--font-body); font-size: 13px; color: var(--text-primary);
  cursor: pointer; transition: all 0.25s; overflow: hidden; position: relative;
}
.sat-combobox-input-wrap.focused { border-color: var(--input-border-focus); box-shadow: var(--input-shadow-focus); }

.sat-selector {
  flex: 1; height: 100%; border: none; outline: none; background: transparent;
  font-family: var(--font-body); font-size: 13px; color: var(--text-primary);
}
.sat-combobox-input-wrap:not(.open) .sat-selector { position: absolute; opacity: 0; pointer-events: none; width: 0; }

.sat-combobox-selected-display {
  flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; line-height: 46px;
}

.sat-selector-icon {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  color: var(--text-secondary); pointer-events: none; transition: color 0.2s, transform 0.2s;
}
.sat-combobox-input-wrap.open .sat-selector-icon { transform: translateY(-50%) rotate(180deg); }

.sat-combobox-list {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  max-height: 280px; overflow-y: auto; background: var(--bg-header);
  border: 1px solid var(--border); border-radius: 10px;
  box-shadow: var(--shadow-card); z-index: 1000; margin: 0; padding: 4px 0; list-style: none;
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
}
.sat-combobox-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 16px; cursor: pointer; gap: 8px; transition: background-color 0.1s;
}
.sat-combobox-item.highlighted { background-color: var(--border); }
.sat-combobox-item.selected { color: var(--cyan); }
.sat-item-name { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 13px; }
.sat-item-pos { flex-shrink: 0; font-size: 11px; font-family: var(--font-mono); color: var(--text-secondary); background: var(--bg-deep); border-radius: 4px; padding: 2px 6px; }
.sat-combobox-empty {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  padding: 12px; background: var(--bg-header); border: 1px solid var(--border);
  border-radius: 10px; color: var(--text-secondary); font-size: 13px; text-align: center; z-index: 1000;
}

/* =============================================
   INPUTS
   ============================================= */
.input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.input-group { position: relative; }
.input-field {
  width: 100%; background: var(--input-bg);
  border: 1px solid var(--border); border-radius: 10px;
  padding: 22px 16px 8px;
  font-family: var(--font-mono); font-size: 14px; color: var(--text-primary);
  outline: none; transition: all 0.25s;
}
.input-field:focus { border-color: var(--input-border-focus); box-shadow: var(--input-shadow-focus); }
.input-label {
  position: absolute; top: 8px; left: 16px;
  font-family: var(--font-mono); font-size: 9px;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--text-secondary); pointer-events: none; transition: color 0.2s;
}
.input-field:focus + .input-label { color: var(--cyan); }
.input-field::placeholder { color: var(--text-secondary); opacity: 0.5; }

/* =============================================
   BUTTONS
   ============================================= */
.btn-locate {
  width: 100%; padding: 13px 20px;
  border: 1px solid var(--border); border-radius: 10px;
  background: var(--bg-surface); color: var(--text-secondary);
  font-family: var(--font-body); font-size: 13px; font-weight: 500;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  gap: 8px; transition: all 0.25s; position: relative; overflow: hidden;
}
.btn-locate:hover { border-color: var(--border-hover); color: var(--cyan); background: var(--cyan-dim); }
.btn-locate:active { transform: scale(0.98); }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

.btn-calculate {
  width: 100%; padding: 15px 20px; border: none; border-radius: 12px;
  background: var(--calc-btn-bg);
  color: var(--calc-btn-color);
  font-family: var(--font-display); font-size: 12px; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  gap: 10px; position: relative; overflow: hidden;
  box-shadow: 0 4px 24px var(--cyan-glow), 0 0 0 1px var(--cyan-dim);
  transition: transform 0.2s, box-shadow 0.25s, color 0.35s;
  z-index: 1;
}
.btn-calculate::before {
  content: ''; position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);
  transform: translateX(-100%); transition: transform 0s;
}
.btn-calculate:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 36px var(--cyan-glow), 0 0 0 1px var(--cyan);
}
.btn-calculate:hover::before { transform: translateX(100%); transition: transform 0.55s ease; }
.btn-calculate:active { transform: scale(0.98) translateY(0); }
.btn-calculate:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }

/* =============================================
   RESULTS
   ============================================= */
.results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.metric-card {
  background: var(--metric-bg); border: 1px solid var(--border);
  border-radius: 12px; padding: 14px 16px;
  position: relative; overflow: hidden;
  transition: background 0.4s, border-color 0.3s, box-shadow 0.3s;
}
.metric-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--cyan-dim), transparent);
}
.metric-card:hover { border-color: var(--border-hover); }

.metric-icon { font-size: 16px; margin-bottom: 8px; display: block; opacity: 0.8; }
.metric-label {
  font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.15em;
  text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px; transition: color 0.35s;
}
.metric-value {
  font-family: var(--font-mono); font-size: 22px; font-weight: 500;
  color: var(--cyan); line-height: 1;
  text-shadow: 0 0 16px var(--cyan-dim);
  transition: color 0.35s, text-shadow 0.35s;
}
.metric-unit {
  font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); margin-left: 2px;
}

.results-placeholder {
  text-align: center; padding: 24px; color: var(--text-secondary);
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em;
  border: 1px dashed var(--border); border-radius: 12px;
}

.calculating .metric-value {
  background: linear-gradient(90deg, var(--cyan), #fff, var(--cyan));
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: shimmer 1s linear infinite;
}

/* =============================================
   SATELLITE INFO
   ============================================= */
.info-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.info-chip {
  display: flex; align-items: center; gap: 4px;
  background: var(--bg-surface-2); border: 1px solid var(--border);
  border-radius: 6px; padding: 6px 10px;
  font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary);
  transition: all 0.2s;
}
.info-chip:hover { border-color: var(--border-hover); background: var(--bg-surface); }
.info-chip-icon { opacity: 0.8; font-size: 12px; margin-right: 2px; }
.info-chip-label { font-size: 10px; opacity: 0.75; letter-spacing: 0.05em; }
.info-chip-value { font-weight: 500; color: var(--text-primary); }

.status-badge {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);
  border-radius: 20px; padding: 3px 10px;
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em;
  color: var(--green); text-transform: uppercase; margin-bottom: 12px;
}
.status-badge-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--green); opacity: 0.5;
}
.status-badge-dot.active {
  opacity: 1;
  animation: pulse-signal 2s ease-in-out infinite;
}

.info-note {
  margin-top: 12px; padding: 10px 12px;
  background: var(--info-note-bg); border: 1px solid var(--info-note-border);
  border-radius: 8px; font-size: 11px; color: var(--info-note-color);
  display: flex; gap: 8px; align-items: flex-start;
  transition: background 0.4s, border-color 0.35s, color 0.35s;
}

/* =============================================
   MAP
   ============================================= */
.map-wrapper {
  height: 200px; border-radius: 12px; overflow: hidden;
  border: 1px solid var(--border); transition: border-color 0.35s;
}

/* =============================================
   ANIMATION DELAYS
   ============================================= */
.stagger-1 { animation-delay: 0.05s; }
.stagger-2 { animation-delay: 0.10s; }
.stagger-3 { animation-delay: 0.15s; }
.stagger-4 { animation-delay: 0.20s; }
.stagger-5 { animation-delay: 0.25s; }
.stagger-6 { animation-delay: 0.30s; }

/* =============================================
   DISCLAIMER CARD & BACK BUTTON
   ============================================= */
.card-interactive {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.card-interactive:hover {
  border-color: var(--cyan);
  box-shadow: 0 8px 24px var(--cyan-dim), var(--shadow-card);
  transform: translateY(-2px);
}
.card-interactive:active {
  transform: translateY(0);
}

.disclaimer-card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}
.disclaimer-card-icon {
  font-size: 20px;
  background: var(--cyan-dim);
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--border);
  transition: border-color 0.3s;
}
.card-interactive:hover .disclaimer-card-icon {
  border-color: var(--cyan);
}
.disclaimer-card-text-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.disclaimer-card-title {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.05em;
}
.disclaimer-card-desc {
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.disclaimer-card-arrow {
  color: var(--text-secondary);
  transition: transform 0.3s, color 0.3s;
  display: flex;
  align-items: center;
}
.card-interactive:hover .disclaimer-card-arrow {
  transform: translateX(4px);
  color: var(--cyan);
}

.btn-header-back {
  background: none;
  border: none;
  color: var(--cyan);
  cursor: pointer;
  padding: 6px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s, background-color 0.25s;
  border-radius: 50%;
}
.btn-header-back:hover {
  transform: translateX(-2px);
  background-color: var(--cyan-dim);
}
.btn-header-back:active {
  transform: translateX(-4px);
}

/* =============================================
   DISCLAIMER VIEW
   ============================================= */
.disclaimer-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeUp 0.6s ease both;
}
.disclaimer-details-card {
  padding: 24px;
}
.disclaimer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.disclaimer-icon {
  font-size: 28px;
}
.disclaimer-header h2 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.05em;
  margin: 0;
}
.disclaimer-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.disclaimer-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.disclaimer-section h3 {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--cyan);
  letter-spacing: 0.05em;
  margin: 0;
  text-shadow: 0 0 10px var(--cyan-dim);
}
.disclaimer-section p {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
  text-align: justify;
}
.disclaimer-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px dashed var(--border);
}
.disclaimer-footer p {
  font-size: 11px;
  line-height: 1.5;
  color: var(--text-secondary);
  opacity: 0.8;
  font-style: italic;
}

.btn-back {
  width: 100%;
  padding: 13px 20px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-surface);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s;
}
.btn-back:hover {
  border-color: var(--cyan);
  color: var(--cyan);
  background: var(--cyan-dim);
}
.btn-back:active {
  transform: scale(0.98);
}
</style>
