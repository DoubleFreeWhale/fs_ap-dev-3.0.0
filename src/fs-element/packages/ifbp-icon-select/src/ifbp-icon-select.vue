<template>
  <div class="icon-select clearfix">
      <div class="icon-select-icon fl clearfix" :class="{'disabled':disabled,'editable':!editable}" ref="iconSelect"  @click="changeIcon('choice')">
        <div class="fl" style="margin-left: 8px;">
        <i :class="iconClass" ref="selectedIcon" style="font-size: 20px;vertical-align: middle;"></i>
        <!-- <i class="ifbp-icon-doc" ref="selectedIcon" @click="changeIcon('choice')" style="font-size: 20px;vertical-align: -webkit-baseline-middle;vertical-align: middle;"></i> -->
        </div>
        <div class="fr" style="margin-right: 8px;" v-if="editable">
            <!-- <i :class="['el-tree-node__expand-icon', iconListShow ? 'expanded' : '']" class=" common-i"  @click="changeIcon('choice')"></i> -->
            <i :class="downUp" style="color: #75787B;font-size: 16px;vertical-align: middle;"></i>
        </div>
      </div>
      <div class="icon-select-color fl" v-if="isShowColorSelect">
          <ifbp-color-picker v-model="iconColor" show-alpha @change="changeColor"></ifbp-color-picker>
          <!-- <color-piker :color="color"></color-piker> -->
      </div>
      <div ref="iconSelectJump" v-show="iconListShow" class="icon-list ">
          <!-- <ifbp-applet-icons :showType="showType"></ifbp-applet-icons> -->
          <el-tabs v-model="tabsNumber" type="card" closable @tab-click="tabClick" v-clickoutside="close">
            <el-tab-pane
                v-for="(item, index) in tabs"
                :key="index"
                :label="item.name"
                :name="index+''"
            >
                <ul class="clearfix">
                    <li v-for="(names,index) in showIconList" :key="index" @click="choiceIcon(names)"><i :class="names.fontClass"></i></li>
                </ul>
            </el-tab-pane>
          </el-tabs>
      </div>
  </div>
</template>
<script>
import Clickoutside from "ifbp-element/src/utils/clickoutside";
import colorPiker from "./color-picker.vue";

export default {
  name: "IfbpIconSelect",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    iconList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    defaultIcon: {
      type: String,
      default: function() {
        return "";
      }
    },
    isShowColorSelect: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    defaultColor: {
      type: String,
      default: function() {
        return "#000";
      }
    }
  },
  watch:{
    defaultColor(val){
      this.iconColor = val;
    }
  },
  components: {
    colorPiker
  },
  data: function() {
    return {
      color: "",
      iconListShow: false,
      iconClass: "",
      showIconList: [],
      downUp: "ifbp-icon-caret-down",
      tabsNumber: "",
      tabs: [],
      showType: "select",
      tabPath: "",
      changePositionX: false,
      changePositionY: false,
      iconColor: "#000"
    };
  },
  directives: { Clickoutside },
  methods: {
    // getMousePos(event) {
    //   var e = event || window.event;
    //   return {'x':e.clientX,'y':e.clientY}
    // },
    changeColor(val) {
      this.iconColor = val;
      this.$refs.selectedIcon.style.color = val;
      let data = {
        class: this.iconClass,
        color: this.iconColor
      };
      this.$emit("icon-select", data);
    },
    setPosition(event) {
      event = event || window.event; //鼠标、键盘事件
      let element = this.$refs.iconSelect;
      let element_change = this.$refs.iconSelectJump;
      let position_x =
        document.body.clientWidth - event.clientX + element.clientWidth;
      let position_y =
        document.body.clientHeight - event.clientY + element.clientHeight;
      if (position_x < 304) {
        element_change.style.left = element.getBoundingClientRect().left - ( 306 - element.clientWidth ) + "px";
      } else {
        element_change.style.left = element.getBoundingClientRect().left + "px";        
      }
      if (position_y < 220) {
        element_change.style.top = element.getBoundingClientRect().top - 222 - 8 +  "px";
      } else {
        element_change.style.top = element.getBoundingClientRect().top + element.clientHeight + 8 +  "px";
      }
    },
    changeIcon(flag, e) {
      if(this.disabled){
        return;
      }
      this.setPosition(e);
      window.document.body.appendChild(this.$refs.iconSelectJump);
      this.iconListShow = !this.iconListShow;
    //   if (flag == "choice") {
    //     if (this.iconListShow) {
    //       this.downUp = "ifbp-icon-caret-down";
    //       this.iconListShow = false;
    //     } else {
    //       this.downUp = "ifbp-icon-caret-up";
    //       this.iconListShow = true;
    //     }
    //   } else {
    //     this.iconListShow = true;
    //   }
    },
    choiceIcon(names) {
      this.iconClass = names.fontClass;
      this.downUp = "ifbp-icon-caret-down";
      this.iconListShow = false;
      let data = {
        class: this.iconClass,
        color: this.iconColor
      };
      this.$emit("icon-select", data);
    },
    close(e) {
      this.downUp = "ifbp-icon-caret-down";
      this.iconListShow = false;
    },
    handleIconClick() {
      this.iconClass = "";
    },
    tabClick(tab) {
      var item = this.tabs[parseInt(tab.index, 10)];
      this.loadIconsByuri(item);
    },
    loadIconsByuri(iconsItem) {
      var vm = this;
      $.ajax({
        url: iconsItem.path,
        success: function(res) {
          var jsonArray = [];
          var arr = res
            .substring(res.lastIndexOf(".", res.indexOf(":before")))
            .trim()
            .replace(/[\r\n]/g, "")
            .split("}");
          if (iconsItem.name === "默认图标") {
            arr = [
              ".ifbp-icon-edit:before",
              ".ifbp-icon-share:before",
              ".ifbp-icon-delete:before",
              ".el-icon-search ifbp-icon-search:before",
              ".el-icon-caret-bottom:before",
              ".ifbp-icon-angle-down:before",
              ".ifbp-icon-angle-left:before",
              ".ifbp-icon-angle-right:before",
              ".ifbp-icon-angle-up:before",
              ".ifbp-icon-arrow-back:before",
              ".ifbp-icon-caret-down:before",
              ".ifbp-icon-caret-up:before",
              ".ifbp-icon-caret-left:before",
              ".ifbp-icon-caret-right:before",
              ".ifbp-icon-caret:before",
              ".ifbp-icon-exchange-solid:before",
              ".ifbp-icon-folder:before",
              ".ifbp-icon-doc:before",
              ".ifbp-icon-key:before",
              ".ifbp-icon-linear-scale:before",
              ".ifbp-icon-lock-open:before",
              ".ifbp-icon-person:before",
              ".ifbp-icon-print:before",
              ".ifbp-icon-view-headline:before",
              ".ifbp-icon-view-module:before",
              ".ifbp-icon-account:before",
              ".ifbp-icon-add:before",
              ".ifbp-icon-apps:before",
              ".ifbp-icon-brush:before",
              ".ifbp-icon-call-made:before",
              ".ifbp-icon-camera:before",
              ".ifbp-icon-check:before",
              ".ifbp-icon-close:before",
              ".ifbp-icon-clouddownload:before",
              ".ifbp-icon-copy:before",
              ".ifbp-icon-create-square:before",
              ".ifbp-icon-date:before",
              ".ifbp-icon-delete:before",
              ".ifbp-icon-download:before",
              ".ifbp-icon-edit:before",
              ".ifbp-icon-email:before",
              ".ifbp-icon-explore:before",
              ".ifbp-icon-filter:before",
              ".ifbp-icon-home:before",
              ".ifbp-icon-information:before",
              ".ifbp-icon-keyboard_voice:before",
              ".ifbp-icon-local_phone:before",
              ".ifbp-icon-lock:before",
              ".ifbp-icon-menu:before",
              ".ifbp-icon-message:before",
              ".ifbp-icon-minus:before",
              ".ifbp-icon-more:before",
              ".ifbp-icon-notifications:before",
              ".ifbp-icon-page-empty:before",
              ".ifbp-icon-page:before",
              ".ifbp-icon-picture:before",
              ".ifbp-icon-plus-square:before",
              ".ifbp-icon-power-off:before",
              ".ifbp-icon-power:before",
              ".ifbp-icon-publish:before",
              ".ifbp-icon-refresh:before",
              ".ifbp-icon-save:before",
              ".ifbp-icon-search:before",
              ".ifbp-icon-send:before",
              ".ifbp-icon-setting:before",
              ".ifbp-icon-share:before",
              ".ifbp-icon-sharing:before",
              ".ifbp-icon-star-off:before",
              ".ifbp-icon-star-on:before",
              ".ifbp-icon-success:before",
              ".ifbp-icon-upload:before",
              ".ifbp-icon-videocam:before",
              ".ifbp-icon-view:before",
              ".ifbp-icon-warning:before",
              ".ifbp-icon-watch:before",
              ".ifbp-icon-zoomout:before",
              ".ifbp-icon-xls:before",
              ".ifbp-icon-ppt:before",
              ".ifbp-icon-txt:before",
              ".ifbp-icon-unknown:before",
              ".ifbp-icon-pdf:before",
              ".ifbp-icon-music:before",
              ".ifbp-icon-zip:before",
              ".ifbp-icon-view-quilt:before",
              ".ifbp-icon-approve:before",
              ".ifbp-icon-in-approve:before",
              ".ifbp-icon-history:before",
              ".ifbp-icon-people:before",
              ".ifbp-icon-accounts:before",
              ".ifbp-icon-assignment-ind:before",
              ".ifbp-icon-assignment:before",
              ".ifbp-icon-contract:before",
              ".ifbp-icon-description:before",
              ".ifbp-icon-exit-to-app:before",
              ".ifbp-icon-find-in-page:before",
              ".ifbp-icon-folder-shared:before",
              ".ifbp-icon-grant:before",
              ".ifbp-icon-organization:before",
              ".ifbp-icon-payroll:before",
              ".ifbp-icon-calculator:before",
              ".ifbp-icon-duty:before",
              ".ifbp-icon-recent-actors:before",
              ".ifbp-icon-salary:before",
              ".ifbp-icon-settings-applications:before",
              ".ifbp-icon-swap-horiz:before",
              ".ifbp-icon-wage-increase:before",
              ".ifbp-icon-sort:before",
              ".ifbp-icon-attachment:before",
              ".ifbp-icon-cloud:before",
              ".ifbp-icon-emoticon:before",
              ".ifbp-icon-place:before",
              ".ifbp-icon-scan:before",
              ".ifbp-icon-star_half:before",
              ".ifbp-icon-thumb_up:before",
              ".ifbp-icon-work:before",
              ".ifbp-icon-person_add:before",
              ".ifbp-icon-group_add:before",
              ".ifbp-icon-advance-payment:before",
              ".ifbp-icon-business-reporting:before",
              ".ifbp-icon-pause:before",
              ".ifbp-icon-general-expenses:before",
              ".ifbp-icon-image-worktable:before",
              ".ifbp-icon-job-management-worktable:before",
              ".ifbp-icon-job-worktable:before",
              ".ifbp-icon-merchants-reimbursement:before",
              ".ifbp-icon-stop:before",
              ".ifbp-icon-performance-analysis:before",
              ".ifbp-icon-rembursement:before",
              ".ifbp-icon-performance-worktable:before",
              ".ifbp-icon-travel-reimbursement:before",
              ".ifbp-icon-travel-application:before",
              ".ifbp-icon-travel-to-borrow:before",
              ".ifbp-icon-through-examination-and-approval:before",
              ".ifbp-icon-reject:before",
              ".ifbp-icon-have-to-pay:before",
              ".ifbp-icon-redo:before",
              ".ifbp-icon-signed:before",
              ".ifbp-icon-settlement-success:before",
              ".ifbp-icon-business:before",
              ".ifbp-icon-developer-board:before",
              ".ifbp-icon-library-add:before",
              ".ifbp-icon-multi-file:before",
              ".ifbp-icon-patch:before",
              ".ifbp-icon-person-cancel:before",
              ".ifbp-icon-query-template:before",
              ".ifbp-icon-restore:before",
              ".ifbp-icon-save-alt:before",
              ".ifbp-icon-supervised-user:before",
              ".ifbp-icon-UI-template-management:before",
              ".ifbp-icon-web:before",
              ".ifbp-icon-baseline-check_box:before",
              ".ifbp-icon-check_circle_outline:before",
              ".ifbp-icon-highlight_off:before",
              ".ifbp-icon-equalizer:before",
              ".ifbp-icon-receipt:before",
              ".ifbp-icon-visibility:before",
              ".ifbp-icon-extension:before",
              ".ifbp-icon-personnel-allotment:before",
              ".ifbp-icon-personnel-management:before",
              ".ifbp-icon-up:before",
              ".ifbp-icon-down:before",
              ".ifbp-icon-left:before",
              ".ifbp-icon-right:before",
              ".ifbp-icon-bottom:before",
              ".ifbp-icon-ascending:before",
              ".ifbp-icon-descending:before",
              ".ifbp-icon-attach-file:before",
              ".ifbp-icon-error-outline:before",
              ".ifbp-icon-roster-design:before",
              ".ifbp-icon-undo:before",
              ".ifbp-icon-accident:before",
              ".ifbp-icon-bonus--allocation:before",
              ".ifbp-icon-chart:before",
              ".ifbp-icon-checking-in:before",
              ".ifbp-icon-commonality:before",
              ".ifbp-icon-demotion:before",
              ".ifbp-icon-flag:before",
              ".ifbp-icon-formula:before",
              ".ifbp-icon-gavel:before",
              ".ifbp-icon-layers:before",
              ".ifbp-icon-leader:before",
              ".ifbp-icon-party:before",
              ".ifbp-icon-position-sequence:before",
              ".ifbp-icon-rank:before",
              ".ifbp-icon-retired:before",
              ".ifbp-icon-takeoff:before",
              ".ifbp-icon-tax:before",
              ".ifbp-icon-train:before",
              ".ifbp-icon-transfer:before",
              ".ifbp-icon-unarchive:before",
              ".ifbp-icon-valirem:before",
              ".ifbp-icon-welfare:before",
              ".ifbp-icon-work-shift:before",
              ".ifbp-icon-description-lock:before",
              ".ifbp-icon-official-rank:before",
              ".ifbp-icon-business-center:before",
              ".ifbp-icon-account-box:before",
              ".ifbp-icon-intelligent-answer:before",
              ".ifbp-icon-tune:before",
              ".ifbp-icon-credit-card:before",
              ".ifbp-icon-have-been-hung-up:before",
              ".ifbp-icon-playlist-add:before",
              ".ifbp-icon-remove-shopping-cart:before",
              ".ifbp-icon-shopping-cart:before",
              ".ifbp-icon-cancel-signature:before",
              ".ifbp-icon-signature:before",
              ".el-icon-arrow-left:before",
              ".el-icon-arrow-right:before",
              ".el-icon-caret-top:before",
              ".doc-icon-github elementdoc:before",
              ".ifbp-icon-Annex-management:before",
              ".ifbp-icon-Assign-users-to-roles:before",
              ".ifbp-icon-Application-page:before",
              ".ifbp-icon-Business-log:before",
              ".ifbp-icon-business-model-management:before",
              ".ifbp-icon-Coding-rule-management:before",
              ".ifbp-icon-Custom-files:before",
              ".ifbp-icon-customer-management:before",
              ".ifbp-icon-dashboard-managment:before",
              ".ifbp-icon-Data-permissions:before",
              ".ifbp-icon-Display-panel:before",
              ".ifbp-icon-Employee-management:before",
              ".ifbp-icon-Field-of-magnetic-paste:before",
              ".ifbp-icon-IFBP-demonstration:before",
              ".ifbp-icon-favorite-border:before",
              ".ifbp-icon-make-dashboard:before",
              ".ifbp-icon-Message-template-management:before",
              ".ifbp-icon-metadata-management:before",
              ".ifbp-icon-OVP-development:before",
              ".ifbp-icon-OVP-exhibition:before",
              ".ifbp-icon-Model-view:before",
              ".ifbp-icon-Topological-graph:before",
              ".ifbp-icon-Page-customization:before",
              ".ifbp-icon-Parameter-configuration:before",
              ".ifbp-icon-Parameter-management:before",
              ".ifbp-icon-patch-authorization:before",
              ".ifbp-icon-Personalized-customization:before",
              ".ifbp-icon-Process-agent-settings:before",
              ".ifbp-icon-Process-monitoring:before",
              ".ifbp-icon-Role-management:before",
              ".ifbp-icon-Scheduling-task:before",
              ".ifbp-icon-Script-upgrade:before",
              ".ifbp-icon-security-log:before",
              ".ifbp-icon-service:before",
              ".ifbp-icon-Supplier-management:before",
              ".ifbp-icon-Task-log:before",
              ".ifbp-icon-Template-management:before",
              ".ifbp-icon-Track:before",
              ".ifbp-icon-widgets-authorization:before",
              ".ifbp-icon-widgets-management:before",
              ".ifbp-icon-workbench-layout:before",
              ".ifbp-icon-Workbench-personalization:before"
            ];
          }
          $.each(arr, (i, item) => {
            if (item.length) {
              let fontClass = "";
              if (iconsItem.name === "默认图标") {
                fontClass = item.substring(
                  item.indexOf(".") + 1,
                  item.indexOf(":")
                );
              } else {
                fontClass =
                  iconsItem.fontfamily +
                  " " +
                  item.substring(item.indexOf(".") + 1, item.indexOf(":"));
              }
              jsonArray.push({
                category: iconsItem.name,
                name: item.substring(item.indexOf("-") + 1, item.indexOf(":")),
                fontClass: fontClass
              });
            }
          });
          vm.showIconList = jsonArray;
        },
        error: function(textStatus) {
          //请求失败后调用的函数
          vm.tabs = vm.tabs.filter(item => {
            return item.path !== iconsItem.path;
          });
        }
      });
    },
    initFun() {
      this.tabs = [
        {
          name: "默认图标",
          fontfamily: "iconfont",
          path: "/ap/trd/ifbp-element/theme-default/icon.css"
            // path: "/lib/theme-default/icon.css"
        }
      ];
      // let defaultIconsList = [];

        let defaultIconsList = this.$context.getFontsConfigs();
      if (Array.isArray(defaultIconsList)) {
        this.tabs = this.tabs.concat(defaultIconsList);
      }
      if (Array.isArray(this.iconList) && this.iconList.length > 0) {
        this.tabs = this.tabs.concat(this.iconsList);
      }
      this.tabs.sort(function(a, b) {
        let aIndex = a.index || 1;
        let bIndex = b.index || 2;
        return aIndex > bIndex;
      });
      if (Array.isArray(this.tabs) && this.tabs.length) {
        this.tabClick({
          index: 0
        });
        this.tabPath = this.tabs[0].path;
      }
    },
    init() {
      this.initFun();
    }
  },
  created() {
    this.init();
    // this.$eventBus.$on("fontConfigChange", this.init);
    this.iconClass = this.defaultIcon;
    this.iconColor = this.defaultColor;
  },
  mounted() {
    // $(".icon-select-icon");
  }
};
</script>
<style scoped>
.common-i {
        border: 3px solid transparent;
    border-bottom-width: 0;
    border-top-color: #97a9be;
    border-top-width: 5px;
}
.icon-select-icon-i {
    display: inline-block;
}r
.icon-select {
  position: relative;
}
.icon-select-icon {
  height: 32px;
  width: 56px;
  line-height: 28px;
  border: 1px solid #c8c8cd;
  border-radius: 4px;
  text-align: center;
  box-sizing: border-box;
}
.icon-select-icon.disabled {
  background-color: #eef1f6;
  border-color: #d1dbe5;
  color: #bbb;
  cursor: not-allowed;
}
.icon-select-icon.editable {
  border: none;
}
.icon-select-color {
  margin-left: 16px;
  width: 56px;
  height: 32px;
}
.icon-show-el,
.icon-show {
  display: inline-block;
  width: 16.7px;
  height: 16.7px;
}

.icon-list {
  position: fixed;
  background-color: #fff;
  width: 304px;
  height: 220px;
  padding: 0;
  border: 1px solid #F0F0F5;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  z-index: 9999;
}

.icon-list ul {
  padding: 5px;
  padding-top: 0;
  margin: 0;
  height: 169px;
  width: 97%;
  overflow: scroll;
}

.icon-list ul li {
  list-style: none;
  float: left;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
  color: #75787b;
  border: 0 !important;
}

.icon-list ul li:hover {
  /* background-color: #F0F0F5; */
}

.icon-list ul li i {
  font-size: 24px;
  vertical-align: middle;
}
.icon-list ul li i:hover {
  color: #2d2d2d;
}
.icon-list .el-tabs .el-tabs__header {
  margin: 0;
}
</style>

