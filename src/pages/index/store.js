import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
let obj = sessionStorage.getItem('storeOBJ') ? JSON.parse(sessionStorage.getItem('storeOBJ')) : {
    routerConfig: {},
    routerList: [],
    userIsOnline:false,
    crumbsList:[],
    mainHeadTitle:'',
};
console.log(obj);
export default new Vuex.Store({
    state: obj,
    getters: {

    },
    mutations: {
        //更新路由队列
        upRouterList(state, arr) {
            state.routerList = [];
            state.routerList = state.routerList.concat(arr)
        },
        //自定义步骤条的一些操作
        pushCrumbsList({crumbsList},obj){
            let num=crumbsList.findIndex(val=>val.path===obj.path);
            if(num===-1){
                crumbsList.push(obj)
            }else{
                crumbsList.splice(num+1)
            }
        },
        restartCrumbsList({crumbsList},obj){
            
            crumbsList.length=0;
            crumbsList.push(obj)
        },
        upCrumbsList({crumbsList},obj){
            
            if(crumbsList.find(val=>val.path===obj.path)){
                crumbsList.find(val=>val.path===obj.path).name=obj.name
            }
        },
        replaceCrumbsListItem({crumbsList},obj){
            crumbsList[crumbsList.length-1]=obj
        },
        crumbsBack({crumbsList}) {
            let obj=Object.assign({},crumbsList[crumbsList.length - 2]);
            delete obj.name;
            vueInstance.$router.push(obj);
        },
        upMainHeadTitle(state,str){
            state.mainHeadTitle=str
        },
    },
    actions: {
        //用户注销
        logout({commit}) {
            let localStorage = window.ifbpLocalCache || window.localStorage;
            localStorage.removeItem("wbalone_isLogin");
            var protocol = window.location.protocol; // 协议
            var host = window.location.host; // ip+端口
            var currentUrl = protocol + "//" + host; // 当前URL
            window.location.replace(currentUrl + "/baseapp/logout") ;
        },
        //更新当前路由的标签
        upNowPath({ commit, state},path){
            function getLabel(arr){
                arr.forEach(val => {
                    if(val.path&& val.path.split('?')[0]===path) {
                        commit('upMainHeadTitle',val.label)
                    }
                    if(Array.isArray(val.children)){
                        getLabel(val.children)
                    }
                });
            }
            if(path==='/'||path==='/index'){
                commit('upMainHeadTitle','首页')
            }else if(path==='/appArea'){
                commit('upMainHeadTitle','应用中心')
            }else{
                getLabel(state.routerList);
            }
            console.log(state.mainHeadTitle)
        },
    }
});
