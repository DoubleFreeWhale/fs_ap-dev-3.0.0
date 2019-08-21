import Vue from 'vue';
import App from './App';
import Router from 'vue-router';
import axios from '../../../assets/httpInter'
import '../../../fs-element/theme-default/src/index.css';
import elElement from "../../../fs-element/index-base";
import '../styles/index.css'

Vue.use(elElement);
Vue.use(Router);

function addDragEvent(el, binding, vnode) {
    el.setAttribute('draggable', 'true');
    el.addEventListener('dragstart', function (e) {
        e.target.classList.add('dragging');
        window._dragSrcEl = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text', '*');
    }, false);
}
Vue.prototype.addDragEvent=addDragEvent;
/**
 *  只能拖拽,不能放置目标
 */
Vue.directive('drag', {
    bind: function (el, binding, vnode) {
        addDragEvent(el, binding, vnode);
    }
});

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
}).$mount("#app");
