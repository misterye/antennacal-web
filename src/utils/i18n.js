// 语言配置文件
export const translations = {
    zh: {
        // 标题与通用
        title: '寻星参数计算器',
        back: '返回',
        switchTheme: '主题切换',
        calculating: '计算中...',

        // 输入部分
        satelliteSelect: '卫星选择',
        stationLatitude: '小站纬度',
        stationLongitude: '小站经度',
        latitudePlaceholder: '例如: 31.2400',
        longitudePlaceholder: '例如: 121.5000',
        getLocation: '获取位置',
        calculate: '计算参数',

        // 输出部分
        results: '计算结果',
        resultsPlaceholder: '按下 "计算参数" 获取卫星指向数据',
        orbitalLongitude: '轨道经度：',
        elevation: '俯仰角：',
        azimuth: '方位角：',
        polarization: '极化角（正为顺时针）：',
        polarizationHint: '面对天线反射面，正数为顺时针，负数为逆时针',

        // 地图
        mapTitle: '地理位置与天线指向',
        fullscreen: '全屏显示',
        exitFullscreen: '退出全屏',
        recenterMap: '回到小站位置',
        southIndicator: '向下为正南',
        antennaDirection: '天线指向',

        // 卫星信息
        satelliteDetails: '卫星详情',
        orbit: '轨道类型：',
        status: '卫星状态：',
        operator: '运营商：',
        platform: '卫星平台：',
        vehicle: '运载火箭：',
        mass: '卫星质量：',
        launchDate: '发射日期：',
        lifetime: '设计寿命：',
        comments: '备注说明：',

        // 提示信息
        locationSuccess: '位置获取成功！',
        locationError: '获取位置失败，请手动输入',
        locationNotSupported: '您的浏览器不支持地理定位',
        invalidInput: '请输入有效的经纬度并选择卫星',

        // 主题切换
        switchToLight: '切换到浅色主题',
        switchToDark: '切换到深色主题',

        // 语言切换
        switchLanguage: '切换语言',

        // 搜索框
        searchPlaceholder: '搜索卫星名称或经度…',
        noResults: '无匹配卫星',

        // 行政区划选择
        regionSelect: '行政区域选择',
        searchRegionPlaceholder: '输入省/市/区县名称快速过滤…',
        noRegionResults: '无匹配行政区域',
        clearRegion: '清空已选地区',
        levelProvince: '省/直辖市',
        levelCity: '地级市/州',
        levelDistrict: '区/县/旗',
        regionSelectedToast: '已选择行政区: ',

        // 地图点选
        pickOnMap: '在地图上点选',
        pickingActive: '点选模式中：点击地图任意位置设为小站',
        exitPicking: '退出点选',
        pointSelectedToast: '已从地图选择坐标: ',

        // 免责声明
        disclaimerCardTitle: '免责声明与版权信息',
        disclaimerCardDesc: '阅读数据精度、版权归属、安全守则及开发者联系方式',
        disclaimerTitle: '免责声明与服务条款',
        disclaimerBack: '返回计算器',
        disclaimerContent: {
            title1: '1. 数据精度与计算参考',
            desc1: '本应用提供的所有计算结果（包括方位角、俯仰角、极化角及相关电子罗盘指向）均依据公开静止轨道数据与球面几何模型估算得出，仅供工程安装调试参考、业余无线电爱好与教学研讨使用，不承诺绝对精度。严禁将本软件用于生命财产安全、航空航天测控、高危特种通信等严苛任务。实际施工操作所产生的任何后果均由操作人员自行承担。',
            title2: '2. 数据来源与第三方权益',
            desc2: '本软件收录的卫星星历名称、轨道经度、卫星平台及运营商信息均汇编自公开发布的国际卫星数据库与公共互联网。卫星名称、运营商标识等商业权益均归属于其合法持有人。本应用不对第三方商标与资产主张任何专有权利。如权利人提出合理异议，请通过联系邮箱告知，我们将在核实后及时更新或移除。',
            title3: '3. 责任限制与无担保声明',
            desc3: '本软件按“现状”（"AS IS"）免费提供，不附带任何明示或暗示的商业适销性或特定用途适用性担保。在法律允许的最大限度内，开发者不对因使用、误用或无法使用本工具而导致的任何直接、间接、偶然或连带损失（包括设备损坏、信号中断、通信违约或数据丢失）承担民事责任。',
            title4: '4. 地图服务与网络环境',
            desc4: '地图底图及逆地理服务由高德地图等第三方开放平台或浏览器定位硬件接口提供。受网络环境、设备传感器精度及第三方接口稳定性影响，地图定位可能存在偏差或延迟，本应用不承担第三方基础服务波动所引起的责任。',
            title5: '5. 施工安全与电磁防护守则',
            desc5: '天线安装调试常涉及高空架设、雷雨天气防雷接地、强风环境固定以及高功率微波设备辐射。操作人员必须具备相应专业资质，穿戴防坠落护具，严格遵守高压用电与微波电磁辐射安全距离规范，严防高空坠物与人身伤害。',
            title6: '6. 无线电法规遵从',
            desc6: '用户架设和使用卫星地面接收与发射设备须严格遵守所在地国家/地区的无线电管理条例及卫星电视广播地面接收设施管理规定，按规定取得合法许可与设台核准，严禁违规占用频率或进行非法无线电发射。',
            footer: '您使用本应用即表示您已充分理解并自愿接受上述全部条款与守则。'
        },

        // 版权声明
        copyrightCardTitle: '版权声明',
        copyrightTitle: '知识产权与版权声明',
        copyrightContent: {
            allRights: '© 2026 Satelc / AntennaCal. 保留所有权利。',
            desc: '本应用的交互界面设计、参数算法封装、前端工程架构及相关视觉资产均受中华人民共和国著作权法及国际知识产权公约保护。未经开发者书面许可，任何机构或个人不得擅自复制、反向工程、二次打包或用于商业营利。',
            openSourceDesc: '本项目中使用的开源组件（Leaflet, Vue 3, Vite, Capacitor 等）均遵循其各自的开源许可协议（MIT / Apache 2.0 / BSD 等）。'
        },

        // 安卓应用下载
        androidDownloadCardTitle: '下载安卓客户端',
        androidDownloadCardDesc: '扫描二维码安装 Android 原生测试体验包',
        webVersionCardTitle: '访问 Web 在线版',
        webVersionCardDesc: 'https://sat.satelc.com',
        androidDownloadModalTitle: '安卓客户端下载',
        androidDownloadScanHint: '请使用微信或企业微信扫码下载',
        androidDownloadDisclaimerTitle: '开发阶段与免责提示',
        androidDownloadDisclaimerText: '该应用目前仍处在持续开发与内测阶段，暂未上架官方应用商店。安装与使用过程中的兼容性及相关风险由用户自行承担，开发者做全面免责声明。',
        closeModal: '关闭',

        // 导出结果
        exportResultCardTitle: '导出结果',
        exportResultCardDesc: '生成并下载包含对准参数及卫星详情的精美图片',
        exporting: '正在生成图片...',
        exportSuccess: '图片已生成并开始下载',
        exportFailed: '生成图片失败，请重试',
        
        // 开发者联系方式
        developerContactTitle: '开发者联系方式',
        developerEmailLabel: '技术支持与商务联系：',
        developerEmail: 'kevin@satelc.com',
        copyEmail: '复制邮箱',
        copied: '已复制到剪贴板！',
        footerCopyright: '© 2026 Satelc · AntennaCal'
    },

    en: {
        // Titles & General
        title: 'Satellite Finder Calculator',
        back: 'Back',
        switchTheme: 'Toggle Theme',
        calculating: 'Calculating...',

        // Input section
        satelliteSelect: 'Select Satellite',
        stationLatitude: 'Station Latitude',
        stationLongitude: 'Station Longitude',
        latitudePlaceholder: 'e.g., 31.2400',
        longitudePlaceholder: 'e.g., 121.5000',
        getLocation: 'Get GPS Location',
        calculate: 'Calculate Parameters',

        // Output section
        results: 'Calculation Results',
        resultsPlaceholder: 'Click "Calculate Parameters" to compute pointing angles',
        orbitalLongitude: 'Orbital Longitude:',
        elevation: 'Elevation Angle:',
        azimuth: 'Azimuth Angle:',
        polarization: 'Polarization Angle (+ is CW):',
        polarizationHint: 'Facing antenna feed: positive is clockwise, negative is counter-clockwise',

        // Map
        mapTitle: 'Station Location & Antenna Direction',
        fullscreen: 'Fullscreen',
        exitFullscreen: 'Exit Fullscreen',
        recenterMap: 'Recenter to Station',
        southIndicator: 'South ↓',
        antennaDirection: 'Antenna Direction',

        // Satellite info
        satelliteDetails: 'Satellite Details',
        orbit: 'Orbit Type:',
        status: 'Operational Status:',
        operator: 'Operator:',
        platform: 'Bus / Platform:',
        vehicle: 'Launch Vehicle:',
        mass: 'Launch Mass:',
        launchDate: 'Launch Date:',
        lifetime: 'Design Life:',
        comments: 'Remarks & Notes:',

        // Messages
        locationSuccess: 'GPS Location acquired successfully!',
        locationError: 'Failed to get location, please enter coordinates manually',
        locationNotSupported: 'Your browser or device does not support geolocation',
        invalidInput: 'Please enter valid station coordinates and select a satellite',

        // Theme toggle
        switchToLight: 'Switch to Light Theme',
        switchToDark: 'Switch to Dark Theme',

        // Language toggle
        switchLanguage: 'Switch Language',

        // Search
        searchPlaceholder: 'Search satellite name or longitude…',
        noResults: 'No matching satellites found',

        // Administrative Region
        regionSelect: 'Administrative Region',
        searchRegionPlaceholder: 'Search province, city, district…',
        noRegionResults: 'No matching administrative regions found',
        clearRegion: 'Clear selected region',
        levelProvince: 'Province / Municipality',
        levelCity: 'City / Prefecture',
        levelDistrict: 'District / County',
        regionSelectedToast: 'Selected Region: ',

        // Map Picking
        pickOnMap: 'Pick on Map',
        pickingActive: 'Picking mode: click anywhere on map to set station',
        exitPicking: 'Exit Picking',
        pointSelectedToast: 'Selected coordinates from map: ',

        // Disclaimer
        disclaimerCardTitle: 'Disclaimer & Copyright',
        disclaimerCardDesc: 'Read data accuracy, copyright, safety rules, and contact info',
        disclaimerTitle: 'Disclaimer & Terms of Service',
        disclaimerBack: 'Back to Calculator',
        disclaimerContent: {
            title1: '1. Data Accuracy & Engineering Reference',
            desc1: 'All pointing metrics (including azimuth, elevation, polarization angle, and electronic compass alignment) are mathematical estimations based on public geostationary orbital data and spherical trigonometry. They are provided solely for amateur radio, installation debugging reference, and educational purposes. We do not guarantee absolute precision. Do not deploy this software in mission-critical, aviation, maritime safety, emergency response, or life-safety applications. Any risk arising from antenna manipulation rests entirely with the user.',
            title2: '2. Data Sources & Third-Party Rights',
            desc2: 'Satellite names, orbital parameters, bus specifications, and operator identities are compiled from public international orbital databases and internet resources. Trademarks and brand names remain the sole property of their respective holders. If any content unintentionally infringes your rights, please reach out via our contact email for prompt verification and remediation.',
            title3: '3. Limited Liability & No Warranty',
            desc3: 'This software is provided "AS IS", without warranty of any kind, express or implied. Under no circumstances shall the developer or copyright holders be held liable for any direct, indirect, incidental, special, or consequential damages (including equipment malfunction, transmission loss, business downtime, or data corruption) arising from the use or inability to use this software.',
            title4: '4. Third-Party Map & Positioning Services',
            desc4: 'Map tiles and reverse geocoding are powered by third-party providers (such as AutoNavi / OpenStreetMap) and device hardware sensors. Map accuracy, availability, and positioning latency are subject to third-party infrastructure. The developer disclaims responsibility for third-party network outages or sensor inaccuracies.',
            title5: '5. Installation Safety & RF Radiation Guidelines',
            desc5: 'Satellite dish installation involves high-altitude rigging, lightning grounding, wind load protection, and high-power microwave RF radiation hazards. Personnel must maintain certified safety equipment, observe high-voltage electrical codes, and maintain safe exposure distances from active RF feeds to prevent severe personal injury.',
            title6: '6. Radio Regulatory Compliance',
            desc6: 'Users operating satellite ground equipment must strictly comply with local national telecommunications and radio management regulations. Ensure all necessary spectrum licenses and station approvals are held prior to receiving or transmitting satellite signals.',
            footer: 'By using this application, you acknowledge that you have read, understood, and consented to all the above terms.'
        },

        // Copyright Notice
        copyrightCardTitle: 'Copyright Notice',
        copyrightTitle: 'Intellectual Property & Copyright',
        copyrightContent: {
            allRights: '© 2026 Satelc / AntennaCal. All Rights Reserved.',
            desc: 'The user interface, algorithmic architecture, calculation models, and design assets of this application are protected under domestic and international copyright and intellectual property laws. Unauthorized duplication, reverse engineering, redistribution, or commercial use is strictly prohibited without explicit written authorization.',
            openSourceDesc: 'Third-party open source packages incorporated in this project (Leaflet, Vue 3, Vite, Capacitor, etc.) remain governed by their respective open source licenses (MIT / Apache 2.0 / BSD).'
        },

        // Android App Download
        androidDownloadCardTitle: 'Download Android App',
        androidDownloadCardDesc: 'Scan QR code to install Android native beta package',
        webVersionCardTitle: 'Open Web Version',
        webVersionCardDesc: 'https://sat.satelc.com',
        androidDownloadModalTitle: 'Android App Download',
        androidDownloadScanHint: 'Please scan the QR code with WeChat or WeCom to install',
        androidDownloadDisclaimerTitle: 'Development Phase & Disclaimer',
        androidDownloadDisclaimerText: 'This app is currently in continuous development and beta testing, and has not yet been listed on official app stores. Any compatibility risks are borne by the user, and the developer makes a full disclaimer.',
        closeModal: 'Close',

        // Export Result
        exportResultCardTitle: 'Export Result',
        exportResultCardDesc: 'Generate and download a poster image with calculation results',
        exporting: 'Generating image...',
        exportSuccess: 'Image generated and download started',
        exportFailed: 'Failed to generate image, please try again',

        // Developer Contact
        developerContactTitle: 'Developer Contact',
        developerEmailLabel: 'Support & Inquiries:',
        developerEmail: 'kevin@satelc.com',
        copyEmail: 'Copy Email',
        copied: 'Email copied to clipboard!',
        footerCopyright: '© 2026 Satelc · AntennaCal'
    }
};
