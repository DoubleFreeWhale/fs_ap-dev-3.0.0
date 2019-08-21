// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store.js';
import axios from '../../assets/httpInter'
import Context from "./ulit/context.js";
import diff from "./ulit/diff.js";
import _page from "./ulit/page.js";
import logger from "./ulit/logger.js";
import '../../fs-element/theme-default/src/index.css';
import elElement from "../../fs-element/index-base";
import '../../assets/css/pageStyle.css'


Vue.use(elElement);
Vue.prototype.$context = new Context();
Vue.prototype.$diff = diff;
Vue.prototype.$logger = logger;
Vue.prototype.$pageMgr = _page.pageMgr;
Vue.prototype.$http = axios;
Vue.prototype.$eventBus = new Vue();
Vue.config.productionTip = false;

import componentList from 'fs-element/index-laze';
import dsBusiness from 'fs-business';

Object.keys(componentList).forEach(val => {
    Vue.component(componentList[val].name, componentList[val]);
});
Object.keys(dsBusiness).forEach(val => {
    Vue.component(dsBusiness[val].name, dsBusiness[val]);
});

window.getCookie = function (cname) {
    let name = cname + "=";

    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(name) !== -1) {
            return decodeURIComponent(c.substring(name.length, c.length));
        }
    }
    return "";
};

router.beforeEach((to, from, next) => {
    store.dispatch('upNowPath', to.path);
    debugger
    window.ifbpRouterShowTabs = false;
    if (to.fullPath.indexOf('/setting') < 0 && window.vueInstance && window.vueInstance.$children[0] && window.vueInstance.$children[0].$context && window.vueInstance.$children[0].$context.getIsChangePassword() === 'Y') {
        next(false);
        window.vueInstance.passwordDialogMessage = '初次登陆，请修改密码';
        if (window.vueInstance.$children[0].$context.getPlatform() === 'fbp') {
            if (!!window.ifbpConfig.settingPasswordTabHide) {
                return;
            }
            if (window.vueInstance.$children[0].$context.getUserStatus() === '3') {
                window.vueInstance.$children[0].passwordDialogMessage = '当前用户所用密码为系统重置的密码，请修改密码';
            }
        }
        window.vueInstance.$children[0].passwordDialogVisible = true;
        return;
    }
    if (to.fullPath.indexOf('/setting') < 0 && window.vueInstance && window.vueInstance.$children[0] && window.vueInstance.$children[0].$context && window.vueInstance.$children[0].$context.getDisabledate() === 'disable') {
        next(false);
        // window.vueInstance.$children[0].$message("密码已失效，请修改密码");
        window.vueInstance.$children[0].passwordDialogVisible = true;
        window.vueInstance.$children[0].passwordDialogMessage = '密码已失效，请修改密码';
        return;
    }
    let toPath = to.fullPath;
    if (toPath === window.notFoundPath) {
        window.notFoundPath = null;
    }
    debugger
    if (to.matched.length === 0) {
        let obj = store.state.routerConfig;
        let appObj, baseUrl, appKey;
        let curPage;
        let curPageJs;
        let curPageCss;
        let requireMode;
        let realPath;
        Object.keys(obj).forEach(key => {
            let nowObj = obj[key].routers.find(val => {
                    let buuu = null;
                    if (val.path.split(':').length > 1) {
                        buuu = to.path.indexOf(val.path.split(':')[0]) === 0
                    } else {
                        buuu = to.path === val.path || to.path === val.path + '/'
                    }
                    return buuu
                }
            );
            if (nowObj) {
                let curLang = obj[key].curLang || '';
                let component = nowObj.realComponent || nowObj.component;
                baseUrl = '/' + key + curLang;
                appObj = obj[key];
                appKey = key;
                curPage = nowObj.curPage;
                requireMode = appKey + "^" + component;
                realPath = nowObj.path;
                console.log(requireMode);
            }
        });
        if (curPage && requireMode) {
            let cur = appObj[curPage];
            curPageJs = cur.js;
            curPageCss = cur.css;
            let commono = appObj.common;
            let commonIndexJs = commono.js;
            let commonIndexCss = commono.css;
            let module1 = baseUrl + "/pages/" + curPageJs;
            let module2 = "css!" + baseUrl + "/pages/" + curPageCss;
            let module3 = baseUrl + "/common/" + commonIndexJs;
            let module4 = "css!" + baseUrl + "/common/" + commonIndexCss;
            let indexModule = appKey + "^/src/apps/common/ifbp-index";
            let appRequireModules = appObj.requireModules || [];
            let depsArr = [];
            let dependencies = null;
            if (dependencies) {
                const deps = dependencies[curPage];
                if (Array.isArray(deps) && deps.length) {
                    deps.forEach(dep => {
                        const depObj = appObj[dep];
                        if (!depObj) {
                            return;
                        }
                        const depPageJs = depObj.js;
                        const depPageCss = depObj.css;
                        if (depPageJs) {
                            depsArr.push(baseUrl + "/pages/" + depPageJs);
                        }
                        if (depPageCss) {
                            depsArr.push("css!" + baseUrl + "/pages/" + depPageCss);
                        }
                    });
                }
            }
            let requireModules = [module1, module2, module3, module4].concat(
                depsArr
            ).concat(appRequireModules);
            try {
                window.require(requireModules, (obj) => {
                    console.log(obj);
                    window.require(
                        [indexModule],
                        () => {
                            window.require([requireMode], obj => {
                                router.addRoutes([
                                    {
                                        name: to.name,
                                        path: realPath,
                                        component: Vue.extend(obj.default)
                                    }
                                ]);
                                if (router.getMatchedComponents(to.path).length > 0) {
                                    next({
                                        replace: true,
                                        path: to.fullPath,
                                    })
                                }
                            });
                        },
                        e => {
                            window.require([requireMode], obj => {
                                router.addRoutes([
                                    {
                                        name: to.name,
                                        path: realPath,
                                        component: Vue.extend(obj.default)
                                    }
                                ]);
                                if (router.getMatchedComponents(to.path).length > 0) {
                                    next({
                                        replace: true,
                                        path: to.fullPath,
                                    })
                                }
                            });
                        }
                    );
                });
            } catch (e) {
                console.log(e.stack);

                window.require([requireMode], obj => {
                    router.addRoutes([
                        {
                            name: to.name,
                            path: realPath,
                            component: Vue.extend(obj.default)
                        }
                    ]);
                    if (router.getMatchedComponents(to.path).length > 0) {
                        next(true);
                    }
                });
            }
        } else {
            next(false);
        }
    } else {
        next(true);
    }

});


window.ctxs = {
    ap: '/wbalone',
    fin: '/fin-ifbp-base'
};
window.Vue = Vue;
window.addEventListener('beforeunload', e => {
    sessionStorage.setItem('storeOBJ', JSON.stringify(vueInstance.$store.state));
});

new Vue({
    el: '#app',
    store,
    router,
    data: {
        isLogin: false,
        authKey: '5b039d04-ddd4-4fef-bcc7-524ea381dc3d'
    },
    render: h => h(App)
}).$mount("#app");