// 语言配置文件
export const translations = {
    zh: {
        // 标题
        title: '寻星参数计算器',

        // 输入部分
        satelliteSelect: '卫星选择',
        stationLatitude: '小站纬度',
        stationLongitude: '小站经度',
        latitudePlaceholder: '例如: 30.00',
        longitudePlaceholder: '例如: 120.00',
        getLocation: '获取位置',
        calculate: '计算参数',

        // 输出部分
        results: '计算结果',
        resultsPlaceholder: '按下 "计算参数" 获取卫星指向数据',
        orbitalLongitude: '轨道经度：',
        elevation: '俯仰角：',
        azimuth: '方位角：',
        polarization: '极化角（正为顺时针）：',
        polarizationHint: '面对天线反馈面，正数为顺时针，负数为逆时针',

        // 地图
        mapTitle: '位置及天线方位',

        // 卫星信息
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
        switchToLight: '切换到亮主题',
        switchToDark: '切换到暗主题',

        // 语言切换
        switchLanguage: '切换语言',

        // 搜索框
        searchPlaceholder: '搜索卫星…',
        noResults: '无匹配卫星',

        // 免责声明
        disclaimerCardTitle: '免责声明',
        disclaimerCardDesc: '使用前请阅读数据精度、版权及法律责任说明',
        disclaimerTitle: '免责声明与服务条款',
        disclaimerBack: '返回计算器',
        disclaimerContent: {
            title1: '1. 数据与计算参考',
            desc1: '本应用提供的所有计算结果（包括方位角、俯仰角、极化角及相关罗盘指向）均由数学公式根据公开轨道数据估算得出，仅供学习、学术交流和业余爱好者安装调试参考，不保证其绝对精确性。请勿将本软件用于任何高风险、商业通信部署、专业导航、应急通信或生命财产安全相关的关键任务。用户因参考本应用数据而进行任何实际天线调整、设备操作所产生的风险和后果，均由用户自行承担。',
            title2: '2. 版权与数据来源说明',
            desc2: '本应用所包含的卫星名称、轨道参数及详情信息均收集自互联网公开渠道与公共数据库。卫星名称、运营商名称及商标等权利均归属于其合法所有者。本应用不对此类第三方版权内容主张任何权利。若您认为本应用展示的数据或信息侵犯了您的合法权益，请随时与我们联系，我们将在验证后及时删除或修改相关内容。',
            title3: '3. 商业免责与无担保声明',
            desc3: '本软件按“原样”（"AS IS"）提供，不附带任何形式的明示或暗示保证。在法律允许的最大范围内，开发者及版权持有者不对因使用或无法使用本软件而导致的任何直接、间接、附带、特别或后果性损失（包括但不限于硬件损坏、信号中断、商业利润损失、数据丢失或人身伤害）承担任何责任。',
            title4: '4. 第三方服务与地图',
            desc4: '本应用使用的地图及地理定位功能由第三方开源服务（如 Leaflet, OpenStreetMap 等）或您的设备浏览器/系统 API 提供。地图的准确性、完整性以及定位功能的精度和可用性受第三方服务质量的影响。本应用不承诺地图服务的连续性和精准度。',
            footer: '您使用本应用即代表您已阅读并同意上述所有条款。'
        }
    },

    en: {
        // Titles
        title: 'Satellite Finder Calculator',

        // Input section
        satelliteSelect: 'Select Satellite',
        stationLatitude: 'Station Latitude',
        stationLongitude: 'Station Longitude',
        latitudePlaceholder: 'e.g., 30.00',
        longitudePlaceholder: 'e.g., 120.00',
        getLocation: 'Get Location',
        calculate: 'Calculate',

        // Output section
        results: 'Results',
        resultsPlaceholder: 'Press "Calculate" to get satellite pointing data',
        orbitalLongitude: 'Orbital Longitude:',
        elevation: 'Elevation Angle:',
        azimuth: 'Azimuth Angle:',
        polarization: 'Polarization (+ is CW):',
        polarizationHint: 'Facing antenna feed: positive is clockwise, negative is counter-clockwise',

        // Map
        mapTitle: 'Location & Antenna Direction',

        // Satellite info
        orbit: 'Orbit:',
        status: 'Status:',
        operator: 'Operator:',
        platform: 'Platform:',
        vehicle: 'Launch Vehicle:',
        mass: 'Mass:',
        launchDate: 'Launch Date:',
        lifetime: 'Design Life:',
        comments: 'Comments:',

        // Messages
        locationSuccess: 'Location acquired successfully!',
        locationError: 'Failed to get location, please enter manually',
        locationNotSupported: 'Your browser does not support geolocation',
        invalidInput: 'Please enter valid coordinates and select a satellite',

        // Theme toggle
        switchToLight: 'Switch to Light Theme',
        switchToDark: 'Switch to Dark Theme',

        // Language toggle
        switchLanguage: 'Switch Language',

        // Search
        searchPlaceholder: 'Search satellite…',
        noResults: 'No matching satellites',

        // Disclaimer
        disclaimerCardTitle: 'Disclaimer',
        disclaimerCardDesc: 'Read data accuracy, copyright, and legal liability statements',
        disclaimerTitle: 'Disclaimer & Terms',
        disclaimerBack: 'Back to Calculator',
        disclaimerContent: {
            title1: '1. Data & Calculation Reference',
            desc1: 'All calculations provided by this application (including azimuth, elevation, polarization angle, and compass alignment) are estimated using mathematical formulas based on public orbital data. They are for educational, academic exchange, and hobbyist installation/debugging reference only. We do not guarantee their absolute accuracy. Do not use this software for high-risk operations, commercial communication deployment, professional navigation, emergency communications, or other critical missions related to life and property safety. Any risk and consequence of actual antenna adjustments or equipment operations carried out by the user in reference to this application\'s data shall be borne solely by the user.',
            title2: '2. Copyright & Data Sources',
            desc2: 'The satellite names, orbital parameters, and details included in this application are gathered from public internet channels and open databases. All rights to satellite names, operator names, and trademarks belong to their respective legal owners. This application does not claim any rights over such third-party copyrighted content. If you believe that any data or information displayed in this application infringes upon your legal rights, please contact us, and we will promptly remove or modify the relevant content upon verification.',
            title3: '3. Commercial Disclaimer & No Warranty',
            desc3: 'This software is provided "AS IS", without warranty of any kind, express or implied. To the maximum extent permitted by law, the developer and copyright holders shall not be liable for any direct, indirect, incidental, special, or consequential damages (including, but not limited to, hardware damage, signal disruption, loss of business profits, data loss, or personal injury) arising out of the use or inability to use this software.',
            title4: '4. Third-Party Services & Maps',
            desc4: 'The map and geolocation features used in this application are provided by third-party open-source services (such as Leaflet, OpenStreetMap) or your device\'s browser/system APIs. The accuracy and integrity of the maps, as well as the precision and availability of positioning functions, depend on the service quality of these third parties. This application does not guarantee the continuity and accuracy of the map services.',
            footer: 'By using this application, you acknowledge that you have read and agreed to all the above terms.'
        }
    }
};
