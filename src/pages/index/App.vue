<template>
    <div id="app">
        <header class="header"
                :style="{background:themeConfig.pageHeaderColor,color:heradercolor,height:themeConfig.hearderHeight+'px'}">
            <img :src="logoImgUrl" class="logoImg" :style="{height: themeConfig.hearderHeight/2+'px',
                lineHeight:themeConfig.hearderHeight/2+'px',marginTop:themeConfig.hearderHeight/4+'px'}">

            <span>
                <i class="el-icon-arrow-left pointerStyle"
                   v-if="crumbsList.length>1"
                   title="返回"
                   @click.stop="crumbsBack"></i>
                <i class="el-icon-pt-shouye"  :class="isHome===1?'active':''"   title="首页"  @click=" $router.replace('/index')"></i>
                <i class="el-icon-pt-leimu"  :class="isHome===2?'active':''"  title="应用中心" @click=" $router.replace('/appArea')"></i>
            </span>
            <headerMenu ref="headerMenu"
                        class="headerMenu"
            />
            <el-user
                    :isCollected="isCollected"
                    :isCollect="isCollect"
                    :collections="collections"
                    :collection-config="collectionConfig"
                    :userimg="avatarurl"
                    :showDefaultImg="!showAvatar"
                    :username="username"
                    msgcenter="/messageCenter"
                    :msgcount="unreadcnt"
                    :isRobot="isRobotShow"
                    :show-message="false"
                    :settings-data="sysSettings"
                    @collectClick="collectClick"
                    @removeCollect="removeCollect"
                    @saveClickColl="saveClickColl"
                    @updateCollectMessage="dragDialog = true"
                    @messageClick='messageClick'
                    @robotClick='robotClick'
                    @showApmTime="showApms"
                    :showTime="showApmDurationTime"
                    @logout="logout"
                    @handleCommand='handleCommand'
                    @showSetting='showSetting'
                    class="eluser">
                <div v-if="showSettingsflag == 'tab'" slot="item">
                    <el-dropdown-item style='height: 64px;' slot="item">
                        <div>
                            <ifbp-table-image id="userInfo-default-img" v-if="!showAvatar"
                                              :name="username"></ifbp-table-image>
                            <img v-else :src='avatarurl' @error="imgError"/>
                            <div style="display: inline-block; vertical-align: top">
                                <span>{{username}}</span><br/>
                                <span style='color: #75787B;'>{{loginName}}</span>
                            </div>
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item command='personalSetting' slot="item"><i
                            class='ifbp-icon-person el-icon-pt-yonghu1'></i><span>个人设置</span></el-dropdown-item>
                    <el-dropdown-item command='personalDesign' slot="item"><i
                            class='ifbp-icon-setting el-icon-setting el-icon-pt-shezhi'></i><span>工作台设置</span>
                    </el-dropdown-item>
                    <el-dropdown-item command='personalUCline' slot="item" v-if="uclientUrl"><i
                            class='ifbp-icon-NC'></i><a
                            :href="uclientUrl" target="_blank">客户端</a></el-dropdown-item>
                    <el-dropdown-item v-for="(item,index) in userSetting" :key="index" :command="item" slot="item">
                        <i :class="item.icon"></i>
                        <a v-if="item.url" :href="item.url" target="_blank">{{item.text}}</a>
                        <span v-else>{{item.text}}</span>
                    </el-dropdown-item>
                </div>
            </el-user>
        </header>
        <div :style="{height:'calc(100% - '+(parseInt(themeConfig.hearderHeight) +8)+'px)'}"
             class="appbox"
             @mousemove="isShowAside"
        >
            <appAside @upWidth="function(val) {asideConfig.width=val }"
                      ref="appAside"
                      v-if="themeConfig.navPosition!=='top'"
                      :navPosition="themeConfig.navPosition"/>
            <div :style="{marginLeft:asideConfig.width}"
                 :class="isIndexPage?'':'fs-main'"
                 ref="mainRight"
                 id="main-right">
                <div>
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import appAside from './components/appAside/appAside';
    import headerMenu from "./common/header-menu/menu.vue";
    import commonUtils from './ulit/commonUtils'
    import {mapActions, mapMutations} from 'vuex'

    export default {
        name: "app",
        data() {
            return {
                logoImgUrl: 'static/img/logo.svg',
                themeConfig: {
                    pageHeaderColor: "#598DEE",
                    workspace: "all",
                    startColorStr: "rgba(253,251,251,1)",
                    themeId: "6c55298c-8385-4e3c-bc49-67d6e87908b6",
                    endColorStr: "rgba(235,237,238,1)",
                    bgImg: "",
                    showtype: "",
                    isPellucid: false,
                    userId: "U001",
                    themeName: "",
                    themeColor: "#598DEE",
                    showTabs: false,
                    themeCode: "",
                    navPosition: "top",//  导航条位置  top 顶部居中   left 左侧浮动   leftFixed 左侧固定
                    bannerColor: "",
                    hearderHeight: '48px'
                },
                asideConfig: {
                    width: '0'
                },
                userConfig: {
                    isRobotShow: false,
                    robotHostProxy: '',
                    avatarurl: '',
                    showAvatar: false
                },
                routerConfig: {},
                activeFuncOther: 'first',
                showPersonSetDialog: false,
                personInfo: {
                    name: '',
                    email: ''
                },
                showSettingsflag: 'tab',
                showTransparentDialog: false,
                userSetting: [],
                showApmDurationTime: "Last 15 minutes",
                showApm: false,
                apm: {
                    reloadTime: "",
                    reloadTimes: [
                        {
                            key: "0",
                            value: "off"
                        },
                        {
                            key: "5",
                            value: "5s"
                        },
                        {
                            key: "10",
                            value: "10s"
                        },
                        {
                            key: "30",
                            value: "30s"
                        }
                    ],
                    start: "",
                    end: "",
                    step: ""
                },
                timesLeft: [
                    {
                        value: "Last 2 days",
                        type: "day",
                        number: 2
                    },
                    {
                        value: "Last 7 days",
                        type: "day",
                        number: 7
                    },
                    {
                        value: "Last 14 days",
                        type: "day",
                        number: 14
                    },
                    {
                        value: "Last 30 days",
                        type: "day",
                        number: 30
                    },
                    {
                        value: "Last 6 months",
                        type: "month",
                        number: 6
                    },
                    {
                        value: "Last 12 months",
                        type: "month",
                        number: 12
                    }
                ],
                timesRight: [
                    {
                        value: "Last 15 minutes",
                        type: "minute",
                        number: 15
                    },
                    {
                        value: "Last 30 minutes",
                        type: "minute",
                        number: 30
                    },
                    {
                        value: "Last 1 hours",
                        type: "hour",
                        number: 1
                    },
                    {
                        value: "Last 6 hours",
                        type: "hour",
                        number: 6
                    },
                    {
                        value: "Last 12 hours",
                        type: "hour",
                        number: 12
                    },
                    {
                        value: "Last 24 hours",
                        type: "hour",
                        number: 24
                    }
                ],
                apmDuration: "",
                indexFlag: true,
                mainNoPadding: false,
                userThemeFlag: false,
                allListFlag: false,
                mainRightHeight: null, //main-right高度
                iframeStyle: "",
                isChatRobot: false, //是否显示机器人页面
                chatbotMounted: false, //机器人是否已经执行mounted
                isRobotShow: false, //机器人显示
                robotHostProxy: "", //机器人服务器
                rootPath: "/index",
                headerOpacity: false,
                appIdStyle: "",
                headerStyle: "",
                mainDivStyle: "",
                appBgImg: false,
                mainBgImg: false,
                bgImg: "",
                headerColorCheck: "white",
                contentColorCheck: "white",
                contentDefaultBg: "",
                // logoutUrl: '',
                loadingMain: false,
                loadingMainFlag: false,
                sysSettings: {
                    // 系统设置
                    themeCode: "", // 主题
                    themeName: "",
                    showTabs: false, // 是否显示多页签
                    userId: ""
                },
                showTitle: false,
                imgUrl: "",
                chartShow: false,
                unreadcnt: 0,
                active: true,
                style: "ifr",
                type: "click",
                collapse: "false",
                showTabs: false, // 是否显示多页签, 默认不显示
                showTabsRequestReturn: false,
                navPosition: "top", // 导航菜单的位置，默认top
                headerFixed: true,
                leftFixed: true,
                avatarurl: "",
                addCard: false,
                resetShow: false,
                themeColor: "",
                menuList: [
                    {
                        id: "/index",
                        name: "首页",
                        icon: "el-icon-pt-shouye"
                    }
                ],
                gList: [],
                username: "",
                loginName: "",
                intervalid1: "",
                list: [
                    {
                        src: require("@/assets/images/1.png")
                    },
                    {
                        src: require("@/assets/images/2.png")
                    },
                    {
                        src: require("@/assets/images/1.png")
                    },
                    {
                        src: require("@/assets/images/3.png")
                    },
                    {
                        src: require("@/assets/images/2.png")
                    },
                    {
                        src: require("@/assets/images/3.png")
                    }
                ],
                showMenu: false,
                showBack: false,
                showAvatar: false,
                sysTabs: [
                    {
                        path: "/index",
                        label: "首页",
                        icon: "el-icon-pt-shouye",
                        component: this.$router.getMatchedComponents("/index")[0]
                    },
                    {
                        path: "/appArea",
                        label: "应用中心",
                        icon: "el-icon-pt-leimu",
                        component: this.$router.getMatchedComponents("/appArea")[0]
                    },
                    {
                        path: "/messageCenter",
                        label: "消息中心",
                        appIcon: "el-icon-pt-daohang-xiaoxi",
                        component: this.$router.getMatchedComponents("/messageCenter")[0]
                    },
                    {
                        path: "/approveCenter",
                        label: "我的审批",
                        appIcon: "el-icon-pt-daohang-xiaoxi",
                        component: this.$router.getMatchedComponents("/approveCenter")[0]
                    },
                    {
                        path: "/messageDetail",
                        label: "信息详情",
                        appIcon: "el-icon-pt-daohang-xiaoxi",
                        component: this.$router.getMatchedComponents("/messageCenter")[0]
                    },
                    {
                        path: "/setting",
                        label: "个人设置",
                        appIcon: "el-icon-pt-daohang-xiaoxi",
                        component: this.$router.getMatchedComponents("/setting")[0]
                    }
                ],
                sysComponent: {
                    path: "",
                    component: null
                },
                editableTabsValue: "",
                editableTabs: [],
                editableTabsRouter: [],
                tabIndex: -1,
                allList: [
                    {
                        path: "/index",
                        label: "首页",
                        appIcon: "el-icon-pt-shouye"
                    },
                    {
                        path: "/appArea",
                        label: "应用中心",
                        appIcon: "el-icon-pt-leimu"
                    },
                    {
                        path: "/messageCenter",
                        label: "消息中心",
                        appIcon: "el-icon-pt-daohang-xiaoxi"
                    },
                    {
                        path: "/messageDetail",
                        label: "信息详情",
                        appIcon: "el-icon-pt-daohang-xiaoxi"
                    },
                    {
                        path: "/setting",
                        label: "个人设置",
                        appIcon: "el-icon-pt-daohang-xiaoxi"
                    }
                ],
                tabTransition: "list-complete",
                passwordDialogVisible: false,
                passwordDialogMessage: "初次登陆，请修改密码",
                showLeftFixed: true,
                pageIndex: 0,
                collections: [],
                collectionCopy: [],
                dragDialog: false,
                isCollected: false,
                isCollect: true,
                collectionConfig: "new",
                // 消息中心的侧栏
                isShowNotification: false
            };
        },
        components: {
            appAside,
            headerMenu
        },
        computed: {
            isHome(){
                let num=0;
                if(this.$route.path==='/'||this.$route.path==='/index'){
                    num=1
                }
                if(this.$route.path==='/appArea'){
                    num=2
                }
                return num
            },
            crumbsList() {
                return this.$store.state.crumbsList
            },
            heradercolor() {
                let colorCheck = function (color) {
                    if (color) {
                        var RgbValue = color.replace("rgba(", "").replace(")", "");
                        var RgbValueArry = RgbValue.split(",");
                        var $grayLevel =
                            RgbValueArry[0] * 0.299 +
                            RgbValueArry[1] * 0.587 +
                            RgbValueArry[2] * 0.114;
                        if ($grayLevel >= 100) {
                            return "white";
                        } else {
                            return "#666666";
                        }
                    }
                    return "white";
                };
                return colorCheck(this.themeConfig.pageHeaderColor)
            },
            uclientUrl() {
                let uclient = window.appDefaultConfig.uclient;
                if (typeof window.appDefaultConfig.uclient === "undefined") {
                    uclient = window.uclient;
                }
                if (uclient) {
                    return "uclient://start/" + uclient;
                } else {
                    return "";
                }
            },
            isIndexPage(){
                console.log(this.$route);
                console.log(this.$router);
                return this.$route.path==='/'||this.$route.path==='/index'
            },
        },
        created() {
            if (appDefaultConfig.themeConfig) { //去配置文件中读取个性化设置
                this.themeConfig = Object.assign(this.themeConfig, appDefaultConfig.themeConfig)
            }
            window.apm = {
                timeType: "minute",
                timeNumber: 15,
                start: "",
                end: "",
                reloadTime: ""
            };
            this.userConfig.isRobotShow = appDefaultConfig.robot.isRobotShow || false;
            this.userConfig.robotHostProxy = appDefaultConfig.robot.robotHostProxy || '';
            this.username =
                this.$context.getPlatform() === "ifbp"
                    ? getCookie("_A_P_userName")
                    : getCookie("username");
            this.loginName = getCookie("usercode");
            // this.getTheme();
            // this.getImgUrl();
            this.getAllApp();
            this.$context.setApp(this);
        },
        methods: {
            ...mapActions([
                'logout',
            ]),
            ...mapMutations([
                'crumbsBack',
            ]),
            back(){
              this.crumbsBack()
            },
            isShowAside(e) {
                if (e.pageX < 2 && this.themeConfig.navPosition === 'left') {
                    this.$refs.appAside.asideHover()
                }
            },
            //获取个人设置wbalone/wbTheme/getPresentUserTheme
            getTheme() {

                this.$http.get("/wbalone/wbTheme/getPresentUserTheme").then(({data}) => {
                    console.log(data)
                    if (data.status === 1) {
                        Object.keys(this.themeConfig).forEach((key) => {
                            if (data.wbTheme[key]) {
                                this.themeConfig[key] = data.wbTheme[key]
                            }
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            //获取logo及title等
            getImgUrl() {
                this.$http({
                    url: "/wbalone/tenantMGT/getTenantInfo",
                    type: "get"
                }).then(res => {
                    console.log(res.data);
                    if (res.data.seccess) {
                        if (res.data.maskerMeta) {
                            this.$context.setMaskerMeta(res.data.maskerMeta);
                        }
                        if (res.data.ncSession) {
                            let ncSession = res.data.ncSession;
                            var ncSessionObj = {
                                userID: ncSession.userID,
                                userCode: ncSession.userCode,
                                userName: ncSession.userName,
                                groupPK: ncSession.groupPK,
                                dsName: ncSession.dsName
                            };
                            var ncSessionString = JSON.stringify(ncSessionObj);
                            localStorage.setItem('ncSession', ncSessionString);
                        }
                    }

                    if (res.data.success === true && res.data.data.length !== 0) {
                        var resData = res.data.data[0];
                        let darkLogoimg = '';
                        if (resData.json) {
                            darkLogoimg = JSON.parse(resData.json).darkLogoimgUrl;
                        }
                        let themeLogo = self.headerColorCheck === "black" ? darkLogoimg : resData.logoimg;
                        let ifbpDefaultLogo = self.headerColorCheck === "black" ? '/ap/static/img/logo_FESCO.svg' : '/ap/static/img/logo_FESCO.svg';
                        let otherDefaultLogo = self.headerColorCheck === "black" ? '/ap/static/img/logo_FESCO.svg' : '/ap/static/img/logo_FESCO.svg';
                        if (themeLogo) {
                            self.imgUrl =
                                this.$context.getPlatform() === "ifbp"
                                    ? "/ifbp-app-bd/bd/psn/psndoc/avatarImgDownLoad?avatar=" +
                                    themeLogo
                                    : themeLogo;
                        } else {
                            self.imgUrl =
                                this.$context.getPlatform() === "ifbp"
                                    ? ifbpDefaultLogo
                                    : otherDefaultLogo;
                        }
                        if (resData.browserimg) {
                            var href =
                                this.$context.getPlatform() === "ifbp"
                                    ? "/ifbp-app-bd/bd/psn/psndoc/avatarImgDownLoad?avatar=" +
                                    resData.browserimg
                                    : resData.browserimg;
                            document.getElementById("icon").setAttribute("href", href);
                        } else {
                            var href = "./static/img/FESCOicon.ico";
                            document.getElementById("icon").setAttribute("href", href);
                        }
                        if (resData.browserName) {
                            document.title = resData.browserName;
                        } else {
                            document.title = "新一代人力自助平台";
                        }
                    } else {
                        this.resetImgUrl();
                    }
                }).catch((err) => {
                    console.log(err)
                    // this.resetImgUrl();
                });
            },
            getAllApp() {
                let url = "";
                if (this.$context.getPlatform() === 'ifbp') {
                    url = '/baseapp/appMGT/allApp';
                } else {
                    url = '/wbalone/wbapp/allApp';
                }
                window.appRouterArr = [];
                this.$http.get(url).then(({data}) => {
                    console.log(data);
                    var copyListData1 = [];
                    var copyListData2 = [];
                    var arrList1 = [];
                    var arrList2 = [];
                    for (var i = 0; i < data.data.length; i++) {
                        var option = {
                            label: data.data[i].areaName,
                            value: data.data[i].areaName,
                            areaIcon: data.data[i].areaIcon,
                            areaKey: data.data[i].areaKey,
                            areaUrl: data.data[i].areaUrl,
                            areaId: data.data[i].areaId
                        };
                        arrList1.push(option);
                    }
                    if (arrList1.length > 0) {
                        copyListData1 = this.uniqueArray(arrList1, "label");
                    }
                    for (var i = 0; i < copyListData1.length; i++) {
                        copyListData1[i].children = [];
                        for (var j = 0; j < data.data.length; j++) {
                            if (copyListData1[i].areaId === data.data[j].areaId) {
                                var options = {
                                    value: data.data[j].groupName,
                                    label: data.data[j].groupName,
                                    id: data.data[j].groupId,
                                    path: ""
                                };
                                copyListData1[i].children.push(options);
                            }
                        }
                    }
                    for (var i = 0; i < copyListData1.length; i++) {
                        for (var j = 0; j < copyListData1[i].children.length; j++) {
                            copyListData1[i].children[j].children = [];
                            for (var k = 0; k < data.data.length; k++) {
                                if (
                                    copyListData1[i].children[j].id === data.data[k].groupId
                                ) {
                                    var allListOption = [];
                                    for (var n = 0; n < data.data[k].appList.length; n++) {
                                        data.data[k].appList[n].label =
                                            data.data[k].appList[n].appName;
                                        data.data[k].appList[n].value =
                                            data.data[k].appList[n].appName;
                                        data.data[k].appList[n].id =
                                            data.data[k].appList[n].areaId;
                                    }
                                    copyListData1[i].children[j].children =
                                        data.data[k].appList;
                                }
                            }
                        }
                    }
                    console.log(copyListData1)
                    this.$store.commit('upRouterList', copyListData1);
                    this.requestMenuCallback(copyListData1);
                })
            },
            uniqueArray(array, key) {
                var result = [array[0]];
                for (var i = 1; i < array.length; i++) {
                    var item = array[i];
                    var repeat = false;
                    for (var j = 0; j < result.length; j++) {
                        if (item[key] == result[j][key]) {
                            repeat = true;
                            break;
                        }
                    }
                    if (!repeat) {
                        result.push(item);
                    }
                }
                return result;
            },
            requestMenuCallback(data) {
                var localStorage = window.ifbpLocalCache || window.localStorage;
                if (!data) {
                    data = [];
                }
                var arr = [];
                if (Object.prototype.toString.call(data) === "[object Array]") {
                    for (let i = 0; i < data.length; i++) {
                        let nowAreaKey = data[i].areaKey;
                        if (nowAreaKey && nowAreaKey !== "webalone") {
                            //
                            if (nowAreaKey.indexOf(",") > 0) {
                                let nowAreaKeys = nowAreaKey.split(",");
                                for (let j = 0; j < nowAreaKeys.length; j++) {
                                    this.addAreaKey(nowAreaKeys[j]);
                                }
                            } else {
                                this.addAreaKey(nowAreaKey);
                            }
                        }
                    }
                    data.forEach(list => {
                        list.children.forEach(item => {
                            item.children.forEach(v => {
                                if (v.urltype === "view") {
                                    v.path = "/ovp?path=" + v.path + "&tilecode=" + v.code;
                                }
                            });
                        });
                    });
                    /* 循环收集所有路由到一个allList数组里,后面对应mainHeaderTitle需要 */
                    var self = this;
                    this.allList = [
                        {path: "/index", label: "首页", appIcon: "el-icon-pt-shouye"},
                        {path: "/appArea", label: "应用中心", appIcon: "el-icon-pt-leimu"},
                        {
                            path: "/messageCenter",
                            label: "消息中心",
                            appIcon: "el-icon-pt-daohang-xiaoxi",
                            code: "messageCenter"
                        },
                        {
                            path: "/approveCenter/user",
                            label: "我的审批",
                            appIcon: "el-icon-pt-daohang-xiaoxi",
                            code: "approveCenter"
                        },
                        {
                            path: "/messageDetail",
                            label: "信息详情",
                            appIcon: "el-icon-pt-daohang-xiaoxi"
                        },
                        {
                            path: "/setting",
                            label: "个人设置",
                            appIcon: "el-icon-pt-daohang-xiaoxi"
                        }
                    ];
                    if (data.length) {
                        data.forEach(item => {
                            if (item.children && item.children.length) {
                                item.children.forEach(item1 => {
                                    if (item1.children && item1.children.length) {
                                        item1.children.forEach(item2 => {
                                            self.allList.push(item2);
                                        });
                                    } else {
                                        self.allList.push(item);
                                    }
                                });
                            }
                        });
                    }
                    var selfDefTiles = commonUtils.getTempLocalItem("self_def_tiles");
                    if (selfDefTiles && selfDefTiles.length > 0) {
                        for (var i = 0; i < selfDefTiles.length; i++) {
                            this.allList.push(selfDefTiles[i]);
                        }
                    }
                    var currentPath = this.$route.fullPath;
                    if (window.toFullPath) {
                        currentPath = window.toFullPath;
                    }
                    // var list = this.findTitleToReset(currentPath, this.allList);
                    if (currentPath === "/index" || currentPath === "/appArea") {
                        this.showBack = false;
                    }
                    const u_logints =
                        window.getCookie("u_logints") || window.getCookie("login_ts");
                    const windowName = commonUtils.getWindowName();
                    const tempItems = JSON.parse(localStorage.getItem("temp_item"));
                    if (
                        tempItems &&
                        tempItems[u_logints] &&
                        tempItems[u_logints][windowName]
                    ) {
                        var appList = this.$context.getSortableTiles();
                        var i = 0;
                        var activeRouter = null;
                        for (var key = 0; key < appList.length; key++) {
                            appList[key].index = i;
                            let jumpPath = appList[key].path;
                            let pathStack = appList[key].pathStack;
                            if (pathStack && pathStack.length > 1) {
                                jumpPath = pathStack[pathStack.length - 1].path;
                            }
                            const list1 = this.findTitleToReset(jumpPath, this.allList);
                            this.addEditableTabs(jumpPath, list1, undefined, undefined, {
                                appRouterNotPush: true
                            });
                            if (currentPath == jumpPath) {
                                activeRouter = appList[key];
                            }
                            i++;
                        }
                        var _this = this;
                        setTimeout(function () {
                            if (
                                currentPath.indexOf("/index") != 0 &&
                                currentPath !== "/index" &&
                                currentPath !== "/appArea" &&
                                currentPath !== "/"
                            ) {
                                if (activeRouter) {
                                    _this.changeTabs(activeRouter);
                                }
                            } else {
                                _this.tabIndex = -1;
                            }
                        }, 200);
                    } else {
                        if (
                            currentPath.indexOf("/index") != 0 &&
                            currentPath !== "/index" &&
                            currentPath !== "/appArea" &&
                            currentPath !== "/"
                        ) {
                            // this.addEditableTabs(currentPath, list);
                        }
                    }
                }
                // this.menuList = this.menuList.concat(arr);
                this.allListFlag = true;
            },
            addAreaKey(areaKey) {
                if (!window["configAreakey" + areaKey]) {
                    window["configAreakey" + areaKey] = true;
                    var baseUrl = "/" + areaKey;
                    var noLangBaseUrl = "/" + areaKey;
                    var curLang = this.$context.getCurrentLang();
                    if (curLang) {
                        baseUrl = "/" + areaKey + "/" + curLang;
                    }
                    var noLangConfigUrl =
                        noLangBaseUrl + "/config.js?v=" + new Date().getTime();
                    const vm = this;
                    $.ajax({
                        type: "get",
                        url: noLangConfigUrl,
                        dataType: "json",
                        async: true,
                        success: function (conf) {
                            vm.$store.state.routerConfig = Object.assign(vm.$store.state.routerConfig, conf);
                            vm.configSuccessFunWithDep(conf)
                        }
                    });
                }
            },
            configSuccessFunWithDep(conf) {
                var appKey;
                for (var key in conf) {
                    appKey = key;
                }
                var baseUrl = "/" + appKey;
                var appObj = conf[appKey];
                var appCurLang = "";
                if (appObj.curLang) {
                    appCurLang = "/" + appObj.curLang;
                }
                baseUrl = baseUrl + appCurLang;
                var routers = appObj.routers;
                // 业务部门 fonts
                if (appObj.fonts && appObj.fonts.length > 0) {
                    for (var i = 0; i < appObj.fonts.length; i++) {
                        let nowFont = appObj.fonts[i];
                        const moduleFonts = "css!" + nowFont.fontsPath;
                        try {
                            window.require([moduleFonts], () => {
                                const fontConfig = {
                                    name: nowFont.fontsName,
                                    fontfamily: nowFont.fontFamilyName,
                                    path: nowFont.fontsPath,
                                    index: nowFont.index
                                };
                                this.$context.addFontsConfigs(fontConfig);
                                console.log(fontConfig)
                            });
                        } catch (err) {
                            console.log(moduleFonts, " not loaded.");
                        }
                    }
                }

                for (var k = 0; k < routers.length; k++) {
                    routers[k].BaseComponent = routers[k].realComponent || routers[k].component;
                }
                console.log(routers);
                if (!Array.isArray(window.appRouterArr)) {
                    window.appRouterArr = [];
                }
                window._routers = window._routers || {};
            },
            //点击收藏的木一项按钮 跳转
            collectClick(coll) {
                this.$root.$children[0].addEditableTabs(coll.url, coll);
            },
            removeCollect(coll) {
                if (!coll) {
                    var route = this.$router.currentRoute;
                    coll = this.collections.filter(
                        item => route.path == item.url || route.fullPath == item.url
                    )[0];
                    this.deleteCollect(coll);
                } else {
                    this.$confirm("是否取消此收藏?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.deleteCollect(coll);
                        })
                        .catch(e => {
                            this.$message({
                                type: "info",
                                message: "已取消删除"
                            });
                        });
                }
            },
            //点击收藏按钮
            saveClickColl() {
                //获取当前的路由信息
                var router = this.$router.currentRoute;
                let path = router.fullPath ? router.fullPath : router.path;
                var currentRoute = this.findTitleToReset(path, this.allList);
                var subtitle = "";
                var tilesItem = this.$context.getCurrentTile();
                if (
                    tilesItem &&
                    tilesItem["pathStack"] &&
                    tilesItem["pathStack"].length > 1
                ) {
                    var len = tilesItem["pathStack"].length - 1;
                    subtitle = tilesItem["pathStack"][len].name;
                }
                var collData = {
                    appid: currentRoute.id,
                    icon: currentRoute.appIcon,
                    subtitle: subtitle,
                    title: currentRoute.label,
                    url: path ? path : currentRoute.path,
                    userid: this.getCookie("_A_P_id")
                };
                this.$http({
                    url: "/ifbp-app-sm/favorite/create",
                    method: "POST",
                    data: collData
                }).then(res => {
                    if (res.data.success) {
                        this.$message({
                            type: "success",
                            message: "收藏成功!"
                        });
                        this.findCollectionMessage();
                    } else {
                        this.$message({
                            type: "error",
                            message: "收藏失败!"
                        });
                    }
                });

                //将路由信息保存到后台
                //保存成功之后重新查询路由信息
            },
            messageClick() {
                // this.isShowNotification = !this.isShowNotification;
                let messageCenter = {
                    path: "/messageCenter",
                    label: "消息中心",
                    appIcon: "el-icon-pt-daohang-xiaoxi",
                    code: "messageCenter"
                };
                this.addEditableTabs("/messageCenter", messageCenter);
            },
            robotClick() {
                if (!this.isChatRobot) {
                    this.isChatRobot = true;
                    const userId =
                        this.$context.getPlatform() === "ifbp"
                            ? this.getCookie("_A_P_id")
                            : this.$context.getFbpUserId();
                    //判断是否有缓存的用户信息，没有则强制刷新页面
                    if (userId) {
                        let inter = setInterval(() => {
                            if (this.chatbotMounted) {
                                const userInfo = {
                                    authKey: "5b039d04-ddd4-4fef-bcc7-524ea381dc3d",
                                    userId: userId,
                                    userIdName: this.username,
                                    userImg: this.avatarurl,
                                    ip: this.robotHostProxy
                                };
                                document
                                    .getElementById("robotIframe")
                                    .contentWindow.postMessage(userInfo, location.origin);
                                if (inter) {
                                    window.clearInterval(inter);
                                }
                            }
                        });
                    } else {
                        location.reload();
                    }
                }
            },
            personalDesign() {
                if (window.appDefaultConfig.designerNewOrOld) {
                    window.open(
                        "designer/index.html?type=dashboard&flag=workbench"
                    );
                } else {
                    this.$router.push({
                        path: "/designer?useCache=false&flag=workbench"
                    })
                }
            },
            handleCommand(command) {
                if (command == "personalSetting") {
                    this.personalSetting();
                } else if (command == "personalDesign") {
                    this.personalDesign();
                } else {
                    command.event();
                }
            },
            personalSetting() {
                let setting = {
                    path: "/setting",
                    label: "个人设置",
                    appIcon: "el-icon-pt-daohang-xiaoxi",
                    code: "setting"
                };
                let oThis = this;
                this.$router.replace("/setting");
            },
            showSetting() {
                if (this.showSettingsflag == 'dialog') {

                }
            },
            imgError() {
                this.showAvatar = false;
            },
            showApms() {
                this.showApm = !this.showApm;
            },
            resize(){
                    this.mainRightHeight=this.$refs.mainRight.clientHeight
            },
        },
        mounted() {
            window.vueInstance=this;
            this.resize();
            this.$nextTick(()=>{
                window.addEventListener("resize", () => {
                    this.resize();
                });
                window.onbeforeunload = event => {
                    this.$context.checkPageBeforeClose(
                        -1,
                        () => {
                            let templates = this.$context.getAllTemplates(-1);
                            let flag = false;
                            for (var i = 0; i < templates.length; i++) {
                                flag = flag || templates[i].editChange;
                            }
                            if (flag) {
                                event.returnValue = "数据已发生改变，如您离开将不会保存当前操作";
                            }
                        },
                        () => {
                            event.returnValue = "页面内部逻辑不允许关闭";
                        }
                    );
                };
            });
        }
    };
</script>

<style scoped lang="less">
    #app{
        height: 100%;
        background: #ffffff;
    }
    .fs-main{
        /*background: #f0f0f5!important;*/
    }
    .header {
        position: relative;
        z-index: 100;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.08);
    }

    #main-right {
        /*background: #F0F0F5;*/
        height: 100%;
        overflow: auto;
        transition: margin-left 0.5s;
    }

    .logoImg {
        margin: 0 32px 0 48px;
    }

    .logoImg + span {
        display: inline-block;
        line-height: 28px;
        cursor: pointer;
        position: relative;
    }

    .logoImg + span > i {
        font-size: 24px;
        margin-right: 26px;
    }
    .logoImg + span > .active {
        color:@myDefaultColor ;
    }
    .logoImg + span > i:hover{
        color: @myDefaultColor;
    }
    #userInfo-default-img {
        display: inline-block;
        width: 48px;
        height: 48px;
        line-height: 48px;
        border-radius: 50%;
        vertical-align: top;
    }

    .headerMenu {
        position: absolute;
        width: 400px;
        margin-left: -200px;
        left: 50%;
        height: 40px;
        top: 50%;
        margin-top: -20px
    }
    .eluser {
        right: 48px;
        position: absolute;
        top:50%;
        margin-top: -20px;
    }
    .appbox{
        position: relative;
    }
</style>
