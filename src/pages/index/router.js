// 引入公共组件
import Vue from 'vue';
import Router from 'vue-router';
import store from "./store";

function getParam(url, paramName) {
    let paramValue = "", isFound = !1;
    if (url && url.indexOf("=") > 0) {
        let arrSource = url.split("&"), i = 0;
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
    }
    return paramValue
}

const oldGo = Router.prototype.go;
Router.prototype.go = function () {
    if (window.vueInstance && window.vueInstance.$children[0] && window.vueInstance.$children[0].showTabs) {
        var appVue = window.vueInstance.$children[0];
        if (appVue.editableTabs && appVue.editableTabs.length > 0) {
            if (appVue.tabIndex > (appVue.editableTabs.length - 1)) {
                appVue.tabIndex = (appVue.editableTabs.length - 1)
            }
            var nowRouter = appVue.editableTabsRouter[appVue.tabIndex].router;
            if (nowRouter != this) {
                nowRouter.go.apply(nowRouter, arguments);
            } else {
                oldGo.apply(this, arguments);
            }
        }
    } else {
        oldGo.apply(this, arguments);
    }
};

function genKey() {
    const t = 'xxxxxxxx'
    return t.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

/**
 * 增加系统参数： tilecode , funcode ,
 *
 */
function addSysQuery(route, currentRoute) {
    var toPath = route.path;
    if (toPath.indexOf('/appArea') === 0 || toPath.indexOf('/index') === 0) {
        return route;
    }
    if (toPath.indexOf('tilecode=') < 0 && (!route.query || !route.query.tilecode)) {
        if (currentRoute && currentRoute.query && currentRoute.query.tilecode) {
            var toTilecode = currentRoute.query.tilecode;
            route.query = route.query || {};
            route.query.tilecode = toTilecode;
        }
    }
    if (toPath.indexOf('funcode=') < 0 && (!route.query || !route.query.funcode)) {
        if (currentRoute && currentRoute.query && currentRoute.query.funcode) {
            var toFuncode = currentRoute.query.funcode;
            route.query = route.query || {};
            route.query.funcode = toFuncode;
        }
    }

    if (toPath.indexOf('keepalivekey=') < 0 && (!route.query || !route.query.keepalivekey)) {
        route.query = route.query || {};
        if (toPath.indexOf('lgc') === 0 || toPath.indexOf('lgc') === 1 || toPath.indexOf('ovp') === 0 || toPath.indexOf('ovp') === 1 || toPath.indexOf('ifr') === 0 || toPath.indexOf('ifr') === 1 || toPath.indexOf('dap') === 0 || toPath.indexOf('dap') === 1) {
        } else {
            route.query.keepalivekey = genKey();
        }
    }
    return route
}

function addQuery(route) {
    let funcode = getParam(route.path.split('?')[1], 'funcode');
    let tilecode = getParam(route.path.split('?')[1], 'tilecode');
    let keepalivekey = getParam(route.path.split('?')[1], 'keepalivekey');

    let commitObj = {
        path: route.path.split('?')[0],
        query: route.query || {}
    };
    if (funcode) {
        commitObj.query.funcode = funcode
    }
    if (tilecode) {
        commitObj.query.tilecode = tilecode
    }
    if (keepalivekey) {
        commitObj.query.keepalivekey = keepalivekey
    }
    return commitObj
}


Router.prototype.push = function (route, onComplete, onAbort) {
    if (typeof (route) === 'string') {
        route = {
            path: route,
            query: {}
        };
    }
    // 如果是单页签路由发生改变的时候要校验数据是否发生改变
    if (window.vueInstance && window.vueInstance && window.vueInstance.showTabs === false) {
        vueInstance.$context.checkPageBeforeClose(-1, () => {
            vueInstance.$context.checkTemplatesEdit(-1,
                () => {
                    vueInstance.$store.commit('pushCrumbsList', addQuery(route));
                    addSysQuery(route, this.currentRoute);
                    this.history.replace(route, onComplete, onAbort);
                },
                () => {

                }
            );
        }, () => {

        })
    } else {
        vueInstance.$store.commit('pushCrumbsList', addQuery(route));
        addSysQuery(route, this.currentRoute);
        this.history.replace(route, onComplete, onAbort);
    }
};

Router.prototype.replace = function (route, onComplete, onAbort) {
    if (typeof (route) === 'string') {
        route = {
            path: route,
            query: {}
        };
    }
    let obj = window.vueInstance.$store;
    let str='';
    if (obj.state.crumbsList[0] && route.path.indexOf(obj.state.crumbsList[0].path) === 0) {
        str='replaceCrumbsListItem';
    } else {
        str='restartCrumbsList';
    }
    // 如果是单页签路由发生改变的时候要校验数据是否发生改变
    if (window.vueInstance && window.vueInstance && window.vueInstance.showTabs === false) {
        vueInstance.$context.checkPageBeforeClose(-1, () => {
            vueInstance.$context.checkTemplatesEdit(-1,
                () => {
                    obj.commit(str, addQuery(route));
                    addSysQuery(route, this.currentRoute);
                    this.history.replace(route, onComplete, onAbort);
                },
                () => {

                }
            );
        }, () => {

        })
    } else {
        obj.commit(str, addQuery(route));
        addSysQuery(route, this.currentRoute);
        this.history.replace(route, onComplete, onAbort);
    }
};


Router.prototype.pushWidthQuery = function (url) {
    var querys = null;
    if (this.currentRoute && this.currentRoute.query) {
        for (var key in this.currentRoute.query) {
            if (!querys) {
                querys = key + '=' + this.currentRoute.query[key];
            } else {
                querys = querys + '&' + key + '=' + this.currentRoute.query[key];
            }
        }
        if (querys)
            url = url + '?' + querys;
    }
    this.push(url);
};

// 引入组件

const legacy = () => import(/* webpackChunkName: "legacy" */  './common/legacy.vue');
const index = () => import(/* webpackChunkName: "indexmain" */  './common/Index/index.vue');
const dap = () => import(/* webpackChunkName: "dap" */   './common/dap.vue');
const ovp = () => import(/* webpackChunkName: "ovp" */   './common/ovp/ovp.vue');
const messageCenter = () => import(/* webpackChunkName: "messageCenter" */   './common/messageCenter/redirectMessageCenter.vue');
const messageDetail = () => import(/* webpackChunkName: "messageDetail" */   './common/messageCenter/redirectMessageDetail.vue');
const messageSend = () => import(/* webpackChunkName: "messageSend" */   './common/fbpMessageCenter/messageSend.vue');
const approvesCenter = () => import(/* webpackChunkName: "approvesCenter" */   './common/fbpApproveCenter/approvesCenter.vue');
const baseservice = () => import(/* webpackChunkName: "baseservice" */   './common/baseservice/appArea.vue');
const setting = () => import(/* webpackChunkName: "setting" */   './common/setting/setting.vue');


//fbpdap
const statementList = () => import(/* webpackChunkName: "statementList" */   './common/fbpdap/statements/statementList.vue');
const tileStatements = () => import(/* webpackChunkName: "tileStatements" */   './common/fbpdap/statements/tileStatementList.vue');
const classificationList = () => import(/* webpackChunkName: "classificationList" */   './common/fbpdap/statements/classificationList.vue');
const inforList = () => import(/* webpackChunkName: "inforList" */   './common/fbpdap/statements/inforList.vue');
const inforListNew = () => import(/* webpackChunkName: "inforListNew" */   './common/fbpdap/statements/inforListNew.vue');
const publishReportFun = () => import(/* webpackChunkName: "publishReportFun" */   './common/fbpdap/publishReport/publishReportFun.vue');
const appletManageList = () => import(/* webpackChunkName: "appletManageList" */   './common/appletManage/appletManageList.vue');
const appletManageDetail = () => import(/* webpackChunkName: "appletManageDetail" */   './common/appletManage/appletManageDetail.vue');
const appDetailFunction = () => import(/* webpackChunkName: "appDetailFunction" */   './common/appletManage/app-detail-function.vue');
const designer = () => import(/* webpackChunkName: "designernew" */   './common/designer/src/designer.vue');
const uitemplate = () => import(/* webpackChunkName: "uitemplate" */   './common/uiTemplate/src/uitemplate.vue');


Vue.use(Router);
export default new Router({
    mode: 'hash',
    linkActiveClass: "active",
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/designerOvp',
            component: designer
        },
        {
            path: '/designerRole',
            component: designer
        },
        {
            path: '/designer',
            component: designer
        },
        {
            path: '/uitemplate',
            component: uitemplate
        },
        {
            path: '/lgc/:appcode',
            component: legacy
        },
        {
            path: '/ifr/:appcode',
            component: legacy
        },
        {
            path: '/dap/:appcode',
            component: dap
        },

        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            component: index,
        },
        {
            path: '/manage/:id',
            component: index
        },
        {
            path: '/appArea',
            component: baseservice
        },
        {
            path: "/ovp",
            component: ovp
        },
        {
            path: '/setting',
            component: setting
        },
        {
            path: "/messageCenter",
            component: messageCenter
        },
        {
            path: "/messageDetail/:id",
            component: messageDetail
        },
        {
            path: "/messageSend",
            component: messageSend
        },
        {
            path: "/messageSend/:id/:type",
            component: messageSend
        },
        {
            path: '/approveCenter/user',
            component: approvesCenter
        },
        //fbpdap
        {
            path: '/fbpdap/statements',
            component: statementList
        },
        {
            path: '/fbpdap/tileStatements',
            component: tileStatements
        },
        {
            path: '/fbpdap/classification',
            component: classificationList
        },
        {
            path: '/fbpdap/inforList',
            component: inforList
        },
        {
            path: '/fbpdap/reportCenter',
            component: inforListNew
        },
        {
            path: '/fbpdap/publishReportFun',
            component: publishReportFun
        },
        {
            path: '/appletManageList',
            component: appletManageList
        },
        {
            path: '/applet/manage/add',
            component: appletManageDetail
        },
        {
            path: '/applet/manage/detail/:id',
            component: appletManageDetail
        },
        {
            path: '/applet/manage/grant/:id',
            component: appDetailFunction
        },


    ]
});
