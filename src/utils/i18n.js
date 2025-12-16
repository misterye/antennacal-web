// 语言配置文件
export const translations = {
    zh: {
        // 标题
        title: '卫星天线参数计算器',

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
        orbitalLongitude: '轨道经度：',
        elevation: '俯仰角：',
        azimuth: '方位角：',
        polarization: '极化角：',

        // 地图
        mapTitle: '位置及天线方位',

        // 提示信息
        locationSuccess: '位置获取成功！',
        locationError: '获取位置失败，请手动输入',
        locationNotSupported: '您的浏览器不支持地理定位',
        invalidInput: '请输入有效的经纬度并选择卫星',

        // 主题切换
        switchToLight: '切换到亮主题',
        switchToDark: '切换到暗主题',

        // 语言切换
        switchLanguage: '切换语言'
    },

    en: {
        // Titles
        title: 'Satellite Antenna Calculator',

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
        orbitalLongitude: 'Orbital Longitude:',
        elevation: 'Elevation Angle:',
        azimuth: 'Azimuth Angle:',
        polarization: 'Polarization Angle:',

        // Map
        mapTitle: 'Location & Antenna Direction',

        // Messages
        locationSuccess: 'Location acquired successfully!',
        locationError: 'Failed to get location, please enter manually',
        locationNotSupported: 'Your browser does not support geolocation',
        invalidInput: 'Please enter valid coordinates and select a satellite',

        // Theme toggle
        switchToLight: 'Switch to Light Theme',
        switchToDark: 'Switch to Dark Theme',

        // Language toggle
        switchLanguage: 'Switch Language'
    }
};
