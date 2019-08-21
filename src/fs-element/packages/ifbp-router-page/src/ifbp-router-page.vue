<template>
  <component :is="routerComp"></component>
</template>

<script>

  export default {
    name:'IfbpRouterPage',
    props:{
      url:{
        type:String,
        default:''
      }
    },
    data:function(){
      return {
        routerComp:null
      }
    },
    watch:{
      url: function(){
        this.routerComp = null;
        this.parseUrl();
      }
    },
    created() {
      this.parseUrl();
    },
    methods:{
      parseUrl: function(){
        var oThis = this;
        if (!this.url) reutrn;
        if (window._routers){
          for (var key in window._routers){
            this.loadComp(key);
          }
        }else{
          this.$eventBus.$on('loadAppRouter', function(key){
            if (!this.routerComp){
              oThis.loadComp(key);
            }
          });
        }
      },
      loadComp: function(key){
        var oThis = this;
        var app = window._routers[key];
        var curPage;
        var curPageJs;
        var curPageCss;
        var requireMode;
        var route = app.router.match(this.url);
        if (route.matched.length > 0){
          var appInfo = app.appInfo;
          var routers = appInfo.routers;
          var matchedPath = route.matched[0].path;
          for (var j = 0; j < routers.length; j++) {
            if (routers[j].path === matchedPath) {
              curPage = routers[j].curPage;
              requireMode = key + '^' + routers[j].BaseComponent;
            }
          }
          if (curPage && requireMode) {
            var cur = appInfo[curPage];
            curPageJs = cur.js;
            curPageCss = cur.css;
            var commono = appInfo.common;
            var commonIndexJs = commono.js;
            var commonIndexCss = commono.css;
            var baseUrl = '/' + key;
            if (appInfo.curLang){
              baseUrl = baseUrl + '/' + appInfo.curLang;
            }
            var module1 = baseUrl + '/pages/' + curPageJs;
            var module2 = 'css!' + baseUrl + '/pages/' + curPageCss;
            var module3 = baseUrl + '/common/' + commonIndexJs;
            var module4 = 'css!' + baseUrl + '/common/' + commonIndexCss;
            try{
              window.require([module1, module2, module3, module4], () => {
                window.require([requireMode], (obj) => {
                  oThis.createVueComponent(obj.default, route);
                  // oThis.routerComp = Vue.extend(obj.default);
                });
              });
            }catch(e){
              console.log(e.stack);
              window.require([requireMode], (obj) => {
                  oThis.createVueComponent(obj.default, route);
              });
            }
          }          
        }
      },
      createVueComponent: function(options, route){
        var VueComp = Vue.extend(options);
        VueComp.$route = route;
          Object.defineProperty(VueComp.prototype, '$route', {
            get: function get () {
              if (this.$parent.$options._componentTag === 'ifbp-router-page'){
                return route;
              }else{
                return this.$root._route
              }
            },
            configurable: true
          });        
        this.routerComp = VueComp;
      }
    }
  }
</script>