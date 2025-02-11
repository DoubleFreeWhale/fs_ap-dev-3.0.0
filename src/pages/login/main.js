import Vue from 'vue'
import App from './Login'
import axios from 'axios'
import '../../fs-element/theme-default/src/index.css';
import elElement from "../../fs-element/index-base";
Vue.prototype.$http=axios;
Vue.config.productionTip = false;
Vue.use(elElement);

import componentList from 'fs-element/index-laze';

Object.keys(componentList).forEach(val => {
    Vue.component(componentList[val].name, componentList[val]);
});

function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if (isEdge) {
        return 12;//edge
    } else if (isIE11) {
        return 11; //IE11
    } else {
        return 20;//不是ie浏览器
    }

}
axios.get('./configure/bessConfig.json?r=' + Math.random()).then(res=>{
    let obj=res.data
    if (obj.status ) {
        if (obj.data.loginBrowserImg) {
            var href = obj.data.loginBrowserImg;
            document.getElementById('icon').setAttribute('href', href);
        }
        if (obj.data.loginBrowserName) {
            document.title = obj.data.loginBrowserName;
        }
        if (obj.data.loginLogo) {
          document.getElementById('loginBox').style.backgroundImage='url('+obj.data.loginLogo+')'
        }
    }
});
if(IEVersion()<11){
document.getElementById('ieit11').style.display='block';
document.getElementById('Login').style.display='none';
}else{
    new Vue({
        render: h => h(App)
    }).$mount('#Login')
}

