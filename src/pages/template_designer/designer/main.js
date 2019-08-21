import Vue from 'vue';
import App from './App';
import Router from 'vue-router';
import axios from '../../../assets/httpInter'
import '../../../fs-element/theme-default/src/index.css';
import elElement from "../../../fs-element/index-base";
import '../styles/editor/index.css'
import directive from "../js/editor/directives";

directive.addDirectives(Vue);
Vue.prototype.ifbp_configs = Vue.prototype.ifbp_configs || {
    mode: 'design',
    query_uitemplate_url: 'http://localhost:58080/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryTemplateByCode'
};
Vue.use(elElement);
Vue.use(Router);

Vue.prototype.$http = axios;

Vue.config.productionTip = false;

import componentList from 'fs-element/index-laze';


Object.keys(componentList).forEach(val => {
    Vue.component(componentList[val].name, componentList[val]);
});
window.Vue=Vue;
new Vue({
    router:new Router(),
    render: h => h(App)
}).$mount("#editor");
