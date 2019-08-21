<template>
  <div v-if="!isApm" class="index-page" id="content" style="height:100%" v-show="showFlag">
    <img id="wel" class="begin_img" src="@/assets/images/1.png" alt="" v-if="noWgt">

    <div id="wdgPage" v-if="!noWgt">
      <div class="u-container-fluid u-widget-bg" id="firstPage">
        <div class="u-row bg-grey-50">
          <div class="u-col-12">
            <div class="dotNavBox" :class="ifbpNavType" v-if="pages.length>1">
              <span class="dotNav_item" v-for="(item,index) in pages" :key="index"
                    :class="{'active':activeIndex === index}" :title="item.name" :data-index="index"
                    :data-user-id="item.location" @click="activeNav(item,index)">
                <span v-if="ifbpNavType !== 'default'">{{item.name}}</span>
              </span>
            </div>
          </div>
          <div class="u-col-12">
            <div id="widgetBox" style="position: relative;">
              <div id="widgetMount"></div>
              <designer-new v-if="designerNewOrOld" :widgets="widgetData"></designer-new>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import designerNew from "./designerNew.vue";

  var RBOX = "widgetBox";
  export default {
    components: {
      designerNew
    },
    data() {
      return {
        widgetDataInit: [],
        widgetDataChange: [],
        widgetData: [],
        isApm: false,
        ifbpNavType: "default",
        pages: [],
        // activeName: 'second',
        valueTrue: true,
        valueFalse: false,
        multipleSelection: [],
        routeCards: [],
        tabActiveName: "",
        map: [],
        list: this.menuList,
        noWgt: true,
        showFlag: false,
        //新tab
        activeIndex: 0,
        showLeft: null,
        showRight: null,
        designerNewOrOld: true
      };
    },
    watch: {
      pages(val) {
        this.showLeft = val.length > 1 && this.activeIndex !== 0;
        this.showRight = val.length > 1 && this.activeIndex !== val;
      },
      activeIndex(val) {
        this.showLeft = val !== 0;
        this.showRight = val !== this.pages.length - 1;
      }
    },
    props: ["menuList"],
    // components: {
    //   newLabel
    // },
    methods: {
      //页面走缓存时 会触发此方法
      ifbpPageInit() {
        let localStorage = window.ifbpLocalCache || window.localStorage;
        var scrollTopIndex = localStorage.getItem("scrollTopIndex");
        if (scrollTopIndex && scrollTopIndex > 0) {
          this.$nextTick(() => {
            $("#main-right").scrollTop(scrollTopIndex);
          });
        }
        this.getUserTheme();
        this.$eventBus.$emit("indexPageInit");
      },
      handlePages: function (flag) {
        var index;
        if (flag === "left") {
          if (this.activeIndex === 0) {
            return;
          }
          index = this.activeIndex - 1;
          $("#widgetBox")
            .css({left: "-100%", opacity: 0})
            .animate({left: "0", opacity: 1}, 800);
        } else if (flag === "right") {
          if (this.activeIndex === this.pages.length - 1) {
            return;
          }
          index = this.activeIndex + 1;
          $("#widgetBox")
            .css({left: "100%", opacity: 0})
            .animate({left: "0", opacity: 1}, 800);
        }
        this.activeNav(this.pages[index], index);
      },
      activeNav: function (tabItem, index) {
        this.activeIndex = index;
        this.activeName = tabItem.name;
        this.renderwidgetBox(tabItem);
        vueInstance.tabItem = {item: tabItem, index: index};
      },
      renderwidgetBox: function (item) {
        let that = this;
        if (window.appDefaultConfig.designerNewOrOld) {
          this.designerNewOrOld = false;
          var vm = this;
          if (!item.urltype) return;
          if (item.urltype == "view") {
            var module = "/wbalone/data:layout/" + item.location;
            requirejs.undef(module);
            window.require([module], function (module) {
              if (vm.$context.getPlatform() === "ifbp") {
                $("#" + RBOX).html('<div id="widgetMount"></div>');
                module.init({element: RBOX, mountElement: "widgetMount"});
                $(".u-row.msg-head").find("a")[0] &&
                ($(".u-row.msg-head").find("a")[0].href = "javascript:;");
              } else {
                if (module) {
                  $("#" + RBOX).html('<div id="widgetMount"></div>');
                  module.init({element: RBOX, mountElement: "widgetMount"});
                  $(".u-row.msg-head").find("a")[0] &&
                  ($(".u-row.msg-head").find("a")[0].href = "javascript:;");
                } else {
                  window.location.replace("login.html") ;
                }
              }
            });
          }
        } else {
          //获取布局 设置数据
          this.$http({
            url: "/wbalone/wbalyout/data:layoutSource/" + item.location,
            method: "get"
          }).then(res => {
            if (res.data.success) {
              let data = JSON.parse(res.data.data.source);
              that.widgetData = JSON.parse(JSON.stringify(data));
              that.widgetDataInit = JSON.parse(JSON.stringify(data));
              that.widgetDataChange = JSON.parse(JSON.stringify(data));
              that.designerNewOrOld = true;
              that.adaptScreen();
            } else {
              this.$message.error(res.data.msg);
            }

            //   this.widgetData = res.data.source;
          });
        }
      },
      adaptScreen() {
        let that = this;
        window.onresize = function () {
          let window_width = window.innerWidth;
          if (window_width < 1000) {
            if (window_width < 798) {
              that.widgetDataChange.map(item => {
                item.x = 0;
                item.w = 12;
              });
              that.widgetData = JSON.parse(JSON.stringify(that.widgetDataChange));
            } else {
              that.widgetData = JSON.parse(JSON.stringify(that.widgetDataInit));
            }
          }
        };
      },
      handleClick(tab, event) {
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      tabClick() {
        this.$parent.$router.push(this.tabActiveName);
      },
      getRouteMap(list) {
        var tmp = {};
        var getChild = function (array) {
          array.forEach(v => {
            if (v.children) {
              getChild(v.children);
            } else {
              tmp[v.path] = v;
            }
          });
        };
        getChild(list);
        return tmp;
      },
      removeTab(targetName) {
        const tabs = this.routeCards;
        var activeName = this.tabActiveName;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.path === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.path;
              }
            }
          });
        }

        this.tabActiveName = activeName;
        this.routeCards = tabs.filter(tab => tab.path !== targetName);
        this.$parent.$router.push(this.tabActiveName);
      },
      getTheme(workspace) {
        this.pages = [];
        this.$http
          .all([this.getWidgets, this.getWidgetsForUser])
          .then(
            this.$http.spread((res, response) => {

              if (
                response.data &&
                response.data.status === 1 &&
                workspace !== "role"
              ) {
                var userPages = response.data.data;
                if (userPages.length > 0) {
                  this.noWgt = false;
                  userPages.forEach(v => {
                    var vm = v;
                    vm.displayName = "我的工作台";
                    vm.isUser = true;
                  });
                  vueInstance.tabItem = {item: userPages[0], index: 0};
                  if (userPages[0].menustatus !== "未创建该用户的用户布局") {
                    this.pages = this.pages.concat(userPages);
                  }

                  // if (this.pages[0] && this.pages[0].urltype) {
                  //   // $("#firstPage .wb-tab>a").eq(0).addClass(' wbactive');
                  //   this.activeName = this.pages[0].name;
                  //   this.renderwidgetBox(this.pages[0]);
                  // } else {
                  //   this.noWgt = true;
                  //   $("#wdgPage").css("display", "none");
                  //   $("#wel").css("display", "block");
                  // }
                }
              }
              this.showFlag = true;
              if (res.data.data && workspace !== "my") {
                var pages = res.data.data;
                let localStorage = window.ifbpLocalCache || window.localStorage;
                localStorage.setItem("roleList", JSON.stringify(pages));
                this.noWgt = false;
                $("#wdgPage").css("display", "block");
                $("#wel").css("display", "none");
                pages.forEach(v => {
                  var vm = v;
                  if (vm.displayName === undefined) {
                    vm.displayName = "";
                  }
                  vm.isUser = false;
                });
                this.pages = this.pages.concat(pages);
                if (this.pages[0] && this.pages[0].urltype) {
                  this.activeName = this.pages[0].name;
                  this.renderwidgetBox(this.pages[0]);
                } else {
                  this.noWgt = true;
                  $("#wdgPage").css("display", "none");
                  $("#wel").css("display", "block");
                }
              } else if (workspace !== "my") {
                if (res && res.data && res.data.msg) {
                  this.$message.error(res.data.msg);
                }
              }
              if (
                this.$root.$children[0].showLeftFixed &&
                this.$root.$children[0].navPosition === "leftFixed"
              ) {
                this.$nextTick(function () {
                  document.querySelector(".widget_left_btn").style.left = "228px";
                });
              }
            })
          )
          .catch(error => {
            if (error && error.data && error.data.msg) {
              this.$message.error(error.data.msg);
            }
          });
      },
      getUserTheme() {
        var workspace = "";
        this.$http({
          url: "/wbalone/wbTheme/getPresentUserTheme",
          method: "get"
        })
          .then(res => {
            if (res.data.status === 1) {
              var data = res.data.wbTheme || {};
              workspace = data["workspace"] ? data["workspace"] : "all";
              this.getTheme(workspace);
            } else {
              this.getTheme("all");
            }
          })
          .catch(e => {
            console.log(e);
          });
        $("#main-right").attr("is-reload", "");
        if (this.$root.$children[0].scrollTopIndex) {
          var scrollTopIndex = this.$root.$children[0].scrollTopIndex;
          setTimeout(() => {
            // 延迟1s重新加载,页面设置生效
            $("#main-right").scrollTop(scrollTopIndex);
          }, 300);
        }
        if (vueInstance.tabItem) {
          setTimeout(() => {
            // 延迟1s重新加载,页面设置生效
            this.activeNav(
              vueInstance.tabItem.item,
              vueInstance.tabItem.index
            );
          }, 300);
        }
      }
    },
    created() {
      if (window.appDefaultConfig.ifbpNavType) {
        this.ifbpNavType = window.appDefaultConfig.ifbpNavType;
      }
      this.isApm = window.isAPM;
      if (window.appDefaultConfig.designerNewOrOld) {
        /** 角色布局*/
        this.getWidgets = this.$http({
          url: window.ctxs.ap + "/appmenumgr/indexQuery",
          method: "get"
        });
        /** 用户布局*/
        this.getWidgetsForUser = this.$http({
          url: window.ctxs.ap + "/appmenumgr/indexQueryV2",
          method: "get"
        });
      } else {
        /** 角色布局*/
        this.getWidgets = this.$http({
          url: window.ctxs.ap + "/wbalyout/indexQuery",
          method: "get"
        });
        /** 用户布局*/
        this.getWidgetsForUser = this.$http({
          url: window.ctxs.ap + "/wbalyout/indexQueryV2",
          method: "get"
        });
      }
    },
    mounted() {

      this.getUserTheme();
    }
  };
</script>

<style scoped>
  #firstPage {
    padding-bottom: 80px;
    margin: 0;
  }

  .content-margin {
    margin-top: 31.5px;
  }

  .content-margin2 {
    margin-top: 51.5px;
    color: #71787e;
  }

  .card-content p {
    font-size: 16px;
    line-height: 2em;
    text-align: left;
  }

  .card-content .datetime {
    color: #9fa9ba;
    font-size: 14px;
    line-height: 2em;
    text-align: left;
    font-weight: 100;
  }

  .el-tabs__nav {
    /* margin-left: 20px; */
  }

  .nav-business {
    color: #393c3e;
    font-size: 14px;
  }

  .nav-business .el-tabs__active-bar {
    background-color: #e60012;
    height: 2px;
  }

  .nav-business .el-tabs__item {
    padding: 0 24px;
    line-height: 31px;
    height: 31px;
  }

  .nav-business .is-active {
    color: #393c3e;
  }

  .nav-business .el-tabs__header {
    margin: 0;
  }

  .day-business {
    box-sizing: border-box;
    width: 1080px;
    height: 130px;
    margin-top: -12px;
    border: 1px solid rgba(230, 234, 238, 1);
    border-top: none;
    list-style: none;
    padding: 24px 30px 30px;
    color: #71787e;
    margin-bottom: 0;
  }

  .day-business i {
    font-style: normal;
    font-size: 30px;
    color: #393c3e;
  }

  .day-business li {
    text-align: center;
    display: inline-block;
    padding: 27px 50px;
    border-right: 1px solid rgba(230, 234, 238, 1);
  }

  .day-business li:last-child {
    border-right: none;
  }

  .day-business span {
    font-size: 30px;
    color: #e60012;
  }

  .el-tabs > div {
    /* margin-left: 20px !important; 不允许使用important，通过其他方式实现*/
    margin-left: 20px;
  }

  .font14 {
    font-size: 14px !important;
    color: #71787e;
  }

  .font30 {
    font-size: 30px !important;
    color: #71787e;
  }

  .begin_img {
    display: block;
    margin: 50px auto;
    width: 410px;
  }
</style>


<style>
  .ui-grid div[data-ul*="file:"] {
    margin-bottom: 24px;
  }

  .u-row.bg-grey-50 {
    background-color: transparent !important;
  }

  .u-row {
    padding: 0 !important;
  }

  .u-row .widgetBox {
    /* margin-top: 16px; */
    /* margin-right: 16px;     */
  }

  .u-row .ui-grid:last-child .widgetBox {
    margin-right: 0;
  }

  .u-row .el-tabs__header {
    margin: 0 !important;
  }

  /****新导航
    ****/
  .dotNavBox.default {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }

  .dotNavBox.default .dotNav_item {
    vertical-align: middle;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    border-radius: 16px;
    background: rgba(0, 0, 0, 0.25);
    display: inline-block;
    cursor: pointer;
  }

  .dotNavBox.default .dotNav_item:hover {
    background: #2D2D2D;
  }

  .dotNavBox.default .active {
    background: rgba(0, 0, 0, 0.5);
  }

  .content-black .dotNavBox.default .dotNav_item {
    background: rgba(255, 255, 255, 0.58);
  }

  .content-black .dotNavBox.default .dotNav_item:hover, .content-black .dotNavBox.default .active {
    background: #F0F0F5;
  }

  .dotNavBox.lineTab {
    text-align: center;
    font-size: 0;
  }

  .dotNavBox.lineTab .dotNav_item {
    vertical-align: text-bottom;
    padding: 16px;
    display: inline-block;
    cursor: pointer;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    line-height: 14px;
  }

  .dotNavBox.lineTab .dotNav_item:hover, .dotNavBox.lineTab .active {
    color: #00B6A4;
  }

  .content-black .dotNavBox.lineTab .dotNav_item {
    color: rgba(255, 255, 255, 0.58);
  }

  .content-black .dotNavBox.lineTab .dotNav_item:hover, .content-black .dotNavBox.lineTab .active {
    color: #F0F0F5;
  }

  #widgetBox {
    padding: 0 72px 0 72px;
  }

  .toggleBtn {
    position: fixed;
    display: inline-block;
    top: 50%;
    width: 48px;
    height: 48px;
    text-align: center;
    line-height: 48px;
  }

  .toggleBtn:hover > i {
    color: #2D2D2D;
  }

  .widget_left_btn {
    left: 8px;
    transition: all .5s ease;
  }

  .widget_right_btn {
    right: 8px;
  }

  .widget_left_btn > i, .widget_right_btn > i {
    color: #C8C8CD;
    font-size: 48px;
    cursor: pointer;
  }

  #main-right .view.index-page {
    background: none;
  }
</style>
