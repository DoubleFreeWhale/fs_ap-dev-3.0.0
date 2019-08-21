<template>
  <div class="" style="height:100%">
    <div id="wdgPage">
      <div class="u-container-fluid u-widget-bg" id="firstPage">
        <div class="u-row bg-grey-50">
          <div class="u-col-12">
            <div ref="widgetBox" :id="id" class="widgetBox">
              <div id="widgetMount">
                <designer-new v-if="designerNewOrOld" :widgets="widgetData"></designer-new>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var RBOX = "widgetBox";
import designerNew from "../Index/designerNew.vue";

export default {
  data() {
    return {
      widgetDataInit: [],
      widgetDataChange: [],
      widgetData: [],
      designerNewOrOld: false,
      valueTrue: true,
      valueFalse: false,
      multipleSelection: [],
      routeCards: [],
      tabActiveName: "",
      map: [],
      id: new Date().getTime()
    };
  },
  props: ["indexa"],
  components: {
    designerNew
  },
  methods: {
    adaptScreen() {
      let that = this;
      window.onresize = function() {
        let window_width = window.innerWidth;
        if (window_width < 798) {
          that.widgetDataChange.map(item => {
            item.x = 0;
            item.w = 12;
          });
          that.widgetData = JSON.parse(JSON.stringify(that.widgetDataChange));
        } else {
          that.widgetData = JSON.parse(JSON.stringify(that.widgetDataInit));
        }
      };
    },
    renderwidgetBox: function() {
      let that = this;
      if (window.appDefaultConfig.designerNewOrOld) {
        if (
          !(this.indexa > -1) ||
          (this.indexa > -1 &&
            window.vueInstance.$children[0].tabIndex === this.indexa)
        ) {
          if (window.location.href.split("path=")[1]) {
            var path = window.location.href.split("path=")[1].split("&")[0];
            var module = "/wbalone/data:layout/" + path;
            requirejs.undef(module);
            var vm = this;
            window.require([module], function(module) {
              if (module) {
                $(vm.$refs.widgetBox).html('<div id="widgetMount"></div>');
                module.init({ element: vm.id, mountElement: "widgetMount" });
                $(".u-row.msg-head").find("a")[0] &&
                  ($(".u-row.msg-head").find("a")[0].href = "javascript:;");
              } else {
                window.location.replace("/login.html");
              }
            });
          }
        }
      } else {
        //获取布局 设置数据
        var path = window.location.href.split("path=")[1].split("&")[0];
        this.$http({
          url: "/wbalone/wbalyout/data:layoutSource/" + path,
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
    }
  },
  watch: {
    $route: {
      handler: "renderwidgetBox",
      immediate: true
    }
  },
  created() {
    // this.renderwidgetBox();
  },
  mounted() {
    var oThis = this;
    // let vm = this;
    this.$eventBus.$on("tabchange", (i)=>{
      if(oThis.$vnode && oThis.$vnode.data && oThis.$vnode.data.attrs && oThis.$vnode.data.attrs.index === i && $(oThis.$el).parent().length > 0){
        this.renderwidgetBox();
      } else {
        this.$destroy();
      }
    })
  }
};
</script>

<style>
#firstPage {
  padding-bottom: 80px;
  margin: 0 48px;
}

.widgetBox .page_content > .el-row {
  margin: 0 !important;
}

.widgetBox .el-row .el-col-6,
.widgetBox .el-row .el-col-md-6,
.widgetBox .el-row .el-col-sm-6,
.widgetBox .el-row .el-col-12,
.widgetBox .el-row .el-col-md-12,
.widgetBox .el-row .el-col-sm-12,
.widgetBox .el-row .el-col-18,
.widgetBox .el-row .el-col-md-18,
.widgetBox .el-row .el-col-sm-18 {
  /*width: calc(25% - 12px) !important;*/
  /*margin-right: 16px !important;*/
  padding-right: 16px;
}

.widgetBox .el-row .el-col-6:last-child,
.widgetBox .el-row .el-col-md-6:last-child,
.widgetBox .el-row .el-col-sm-6:last-child,
.widgetBox .el-row .el-col-12:last-child,
.widgetBox .el-row .el-col-md-12:last-child,
.widgetBox .el-row .el-col-sm-12:last-child,
.widgetBox .el-row .el-col-18:last-child,
.widgetBox .el-row .el-col-md-18:last-child,
.widgetBox .el-row .el-col-sm-18:last-child {
  padding-right: 0;
  margin: 0 !important;
}

.widgetBox .el-row .el-col-6:nth-child(4n + 4) {
  margin: 0 !important;
}

#widgetBox .page_content > .el-row {
  margin: 0 !important;
}

#widgetBox .el-row .el-col-6,
#widgetBox .el-row .el-col-md-6,
#widgetBox .el-row .el-col-sm-6,
#widgetBox .el-row .el-col-12,
#widgetBox .el-row .el-col-md-12,
#widgetBox .el-row .el-col-sm-12,
#widgetBox .el-row .el-col-18,
#widgetBox .el-row .el-col-md-18,
#widgetBox .el-row .el-col-sm-18 {
  /*width: calc(25% - 12px) !important;*/
  /*margin-right: 16px !important;*/
  padding-right: 16px;
}

#widgetBox .el-row .el-col-6:last-child,
#widgetBox .el-row .el-col-md-6:last-child,
#widgetBox .el-row .el-col-sm-6:last-child,
#widgetBox .el-row .el-col-12:last-child,
#widgetBox .el-row .el-col-md-12:last-child,
#widgetBox .el-row .el-col-sm-12:last-child,
#widgetBox .el-row .el-col-18:last-child,
#widgetBox .el-row .el-col-md-18:last-child,
#widgetBox .el-row .el-col-sm-18:last-child {
  padding-right: 0;
  margin: 0 !important;
}

#widgetBox .el-row .el-col-6:nth-child(4n + 4) {
  margin: 0 !important;
}

#firstPage > .u-row > .u-col-12 .row > .col-md-6:first-of-type {
  padding-right: 0;
}

#firstPage > .u-row > .u-col-12 .row > .col-md-6:nth-of-type(2) {
  padding-left: 0;
}

/*#firstPage .u-col-12 {*/
/*padding: 0 !important;*/
/*}*/

/*.widgetBox .ui-grid:nth-child(odd) {*/
/*padding: 0 !important;*/
/*}*/

/*.widgetBox .ui-grid:nth-child(2n) {*/
/*padding: 0 !important;*/
/*}*/

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
  /* margin-left: -16px !important;  不允许使用important，通过其他方式实现*/
  /* margin-left: -16px; */
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
}
</style>
