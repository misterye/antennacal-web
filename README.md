# 寻星伴侣 (AntennaCal) - 卫星天线参数计算器

![Vue 3](https://img.shields.io/badge/Vue-3.5-brightgreen.svg)
![Vite](https://img.shields.io/badge/Vite-7.2-blue.svg)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green.svg)
![Capacitor](https://img.shields.io/badge/Capacitor-8.1-blueviolet.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

一个基于 Web 与 Android 跨平台的现代化专业卫星天线参数计算工具，帮助工程师、技术人员与业余无线电爱好者快速计算静止轨道通信卫星天线的指向参数（俯仰角、方位角、极化角），并提供沉浸式地图可视化、电子罗盘对准与全国行政区划快速检索。

---

## 📖 项目简介

**寻星伴侣（AntennaCal）** 专为卫星地面站工程安装、应急通信保障、车载/便携动中通调试及航天科普设计。通过输入或自动获取小站经纬度坐标，并选择目标卫星，系统根据精确的球面三角几何模型即时计算出天线的安装对准参数，并提供直观的地图方位射线、小站基准靶心与电子罗盘实景对齐。

### 适用场景
- 🛰️ **地面站天线安装与校准**：大型抛物面天线、VSAT 小站的方位角/俯仰角/极化角初始对准
- 📡 **移动与应急通信保障**：便携式卫星终端、车载动中通/静中通的快速寻星对齐
- 🗺️ **多地点参数规划**：内置全国 3,637 条省/市/区县经纬度数据库，快速规划各地参数
- 🎓 **航天与微波教学演示**：直观展示静止轨道几何关系与天线指向投影

---

## ✨ 核心特性

### 1. 卫星数据库与多维信息
- **收录常用通信卫星**：涵盖亚太、中星、亚洲、欧洲通信卫星系列（如 Apstar-6D/6C/5C/7/9, ChinaSat-6D/16/26, AsiaSat-7/9, EutelSat-172B 等数十颗主流静止轨道卫星）；
- **卫星详情展示**：包括卫星平台（Bus）、运载火箭、发射质量、发射日期、设计寿命、运营机构、线极化/圆极化类型及技术备注；
- **即时模糊搜索**：支持按卫星名称或轨道经度快速过滤。

### 2. 多元化小站坐标输入
- 📍 **GPS 实时定位**：一键获取当前设备的高精度地理坐标；
- 🏛️ **全国行政区划检索**：内置全国 **3,637 个省/市/区县** 经纬度全量数据，按 **拼音字母 A-Z 顺序** 排列，支持拼音与汉字即时模糊过滤，点击自动回填坐标；
- 🎯 **地图任意点选**：在地图上开启点选模式，点击任意位置即可将该点设为小站并联动重新计算；
- ⌨️ **手动高精度输入**：支持手动键入经纬度数值。

### 3. 高精度参数计算
- **方位角（Azimuth Angle）**：以正北为 0°，顺时针 0°~360°；
- **俯仰角（Elevation Angle）**：天线仰角；
- **极化角（Polarization Angle）**：馈源顺时针（+）或逆时针（-）旋转角度，并提供清晰的馈源调试指引；
- **轨道经度（Orbital Longitude）**：目标卫星赤道上空定点经度。

### 4. 航天级地图可视化与全屏模式
- 🗺️ **高德地图瓦片服务**：国内高速加载，支持中英文地名标注动态切换；
- 🧭 **高辨识度天线指向指示标**：
  - 醒目加粗渐变箭头搭配 **2.6px 高对比度立体描边**，在江河湖泊（蓝色水系）与白色复杂道路网中均能清晰辨识；
  - 独立中心 **小站定位靶心（Station Center Dot）**，精准标注实际经纬度；
  - 双层向外扩散的动态雷达脉冲光波与指向射线；
- ⛶ **沉浸式地图全屏（Fullscreen）**：
  - 支持调用系统原生 Fullscreen API 及 CSS 突破包含块回退机制，自适应满屏展现；
  - 支持键盘 **`Esc` 键** 快捷退出全屏。

### 5. 实时电子罗盘辅助对准
- 基于设备磁力计与陀螺仪传感器，提供实时罗盘刻度盘与目标方位角偏角指示。

### 6. 专业双语与合规声明
- 🌐 **全功能中英文国际化（i18n）**：包括专业航天力学与微波通信术语；
- 🌓 **深色 / 浅色主题** 一键无缝切换；
- 🛡️ **6 维度免责声明体系**：涵盖数据精度、第三方权益、商业免责、地图服务、施工安全电磁防护与无线电法规合规；
- ⚖️ **知识产权与版权声明**；
- ✉️ **开发者技术支持**：提供开发者联系邮箱（`kevin@satelc.com`）及一键复制功能。

---

## 🚀 快速开始

### 环境依赖
- **Node.js** >= 18.0.0
- **npm** 或 **yarn** / **pnpm**
- *(可选 Android 打包)* **Android Studio** (含 Android SDK 与 JDK 17/21+)

### 1. 克隆与安装

```bash
git clone https://github.com/misterye/antennacal-web.git
cd antennacal-web
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```
打开浏览器访问控制台输出的本地地址（通常为 `http://localhost:5173`）。

### 3. 构建生产版本 Web 资源

```bash
npm run build
```
编译产物将输出至 `dist/` 目录。

---

## 📱 Android 客户端构建

本项目基于 **Capacitor 8** 实现了 Android 原生客户端的封装：

```bash
# 1. 编译 Web 资源并同步至 Android 工程
npm run cap:sync

# 2. 一键打包并编译生成 Debug APK
npm run build:android
```

生成的安装包位于：
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📐 算法原理与公式

### 参数定义
| 符号 | 物理含义 | 单位 |
|:---|:---|:---|
| $\phi_e$ | 地面站纬度 | 弧度 |
| $\lambda_e$ | 地面站经度 | 弧度 |
| $\lambda_s$ | 卫星轨道经度 | 弧度 |
| $R$ | 地球平均半径 (6,371 km) | km |
| $H$ | 静止轨道高度 (35,786 km) | km |

### 1. 地心角（Geocentric Angular Distance）
$$\cos(\Delta\theta) = \cos(\phi_e) \cdot \cos(\lambda_s - \lambda_e)$$

### 2. 俯仰角（Elevation Angle, $E$）
$$E = \arctan\left( \frac{\cos(\Delta\theta) - \frac{R}{R+H}}{\sqrt{1 - \cos^2(\Delta\theta)}} \right)$$

### 3. 方位角（Azimuth Angle, $A$）
$$A = \text{arctan2}\left(\sin(\lambda_s - \lambda_e),\; -\sin(\phi_e)\cos(\lambda_s - \lambda_e)\right) \pmod{360^\circ}$$

### 4. 极化角（Polarization Angle, $P$）
$$P = \arctan\left(\frac{\sin(\lambda_s - \lambda_e)}{\tan(\phi_e)}\right)$$
*(注：面对天线反射面馈源，正值为顺时针旋转，负值为逆时针旋转；圆极化卫星无需调整极化角)*。

---

## 📂 项目结构

```text
antennacal-web/
├── public/
│   ├── china_administrative_coordinates.csv # 全国 3,637 条行政区划数据库
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CompassAlignment.vue             # 实时电子罗盘对准组件
│   │   └── MapView.vue                      # 交互式地图/全屏/高对比度箭头/点选组件
│   ├── utils/
│   │   ├── calculate.js                     # 寻星三角函数几何算法与卫星数据库
│   │   ├── chinaAdminData.js                # 行政区划拼音排序与高效模糊检索
│   │   └── i18n.js                          # 中英双语专业术语国际化字典
│   ├── App.vue                              # 根组件（主界面、免责与版权、开发者联系）
│   ├── main.js                              # 入口文件
│   └── style.css                            # 全局设计规范与主题配色变量
├── android/                                 # Capacitor Android 原生工程
├── capacitor.config.json                    # Capacitor 配置文件
├── package.json                             # 依赖配置与构建脚本
└── vite.config.js                           # Vite 构建配置
```

---

## 📄 许可证与版权

- **版权所有**：© 2026 Satelc / AntennaCal. All Rights Reserved.
- **开源许可证**：本项目采用 [MIT License](LICENSE) 授权。
- **技术支持与商务联系**：[kevin@satelc.com](mailto:kevin@satelc.com)
