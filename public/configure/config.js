/**
 * chromeDownPath
 * 登录页建议使用谷歌浏览器
 * 如果不想显示,设置为空串
 */
window.appDefaultConfig = {
    htmlTitle:'新一代人力平台',
    //侧边导航栏宽度
    navSideWidth:'240px',
    //两种方式nav，default:圆点,lineTab:下划线
    navType: 'lineTab',
    //UI模板表格行展示类型，default:图标,text:文字
    iconType: 'default',
    // chrome下载路径
    chromeDownPath: '/ap/download/Chrome_69.0.3497.100_stable_windows_x64.exe',
    // 不是用前端缓存
    notUsePageCache: false,
    // uclient: 'http://10.16.51.17:8080', //默认不显示
    taskWidgetFlag: false, //针对康复的标记，有关任务小部件，康复：true，默认false
    robot: { // 机器人相关
        isRobotShow: false, // 是否显示机器人图标
        robotHostProxy: 'http://172.20.13.160:4220' // 机器人后端地址
    },
    //小部件参数两个参数：true 旧设计 false 新设计器 默认false（新设计器）
    designerNewOrOld: true,
    designerSaveReflash: true,
    // 数字组件输入过程中是否进行格式化
    numberInputFormat: true,
    // 我的收藏样式参数  "old" 旧版样式 "new" 新版样式  "new-plus" 新版放大的样式  默认值"old"
    collectionConfig: "new-plus",
    //是否使用移动端 true:使用 false:不使用
    useMobile: true,
    //是否启用 拦截重复提交 默认：false   true：启用
    useInterceptRepeat: true,
    //settingPasswordTabHide设置为true,隐藏个人设置中的密码修改tab
    settingPasswordTabHide: false,
    // tab: 多页签形式  dialog: 弹窗形势
    personalSettings: 'tab',
    // 设置localStorage的最大容量, 类型:Number,单位:MB
    localStorageMaxLength: 4.5,
    // 设置未读消息数量的接口的执行间隔的时间
    queryNumIntervalTime: 10 * 60 * 1000,
    //用于兼容ie8 ie9 是否使用ChromeFrame插件 true：使用 false：不使用 默认：false不使用
    useChromeFrame: false,
    // ChromeFrame插件下载地址
    chromeFrameDownPath: '/download/GoogleChromeframeStandaloneEnterprise.msi',
    //主题设置
    themeConfig: {
        "pageHeaderColor": "#FFFFFF",
        "workspace": "all",
        "startColorStr": "rgba(253,251,251,1)",
        "themeId": "6c55298c-8385-4e3c-bc49-67d6e87908b6",
        "endColorStr": "rgba(235,237,238,1)",
        "bgImg": "",
        "showtype": "",
        "isPellucid": false,
        "userId": "U001",
        "themeName": "",
        "themeColor": "#598DEE",
        "showTabs": true,
        "themeCode": "",
        "navPosition": "top",//  导航条位置  top 顶部居中   left 左侧浮动   leftFixed 左侧固定
        "bannerColor": "",
        hearderHeight:56
    }
};
document.title = appDefaultConfig.htmlTitle;