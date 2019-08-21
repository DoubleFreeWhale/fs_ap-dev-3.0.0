<template lang="html">
  <div class="" v-if="Array.isArray(iconsAllList) && iconsAllList.length">
    <el-tabs  type="border-card" v-model="tabPath" @tab-click="tabShow" style="width:60%" class="mrtb">
      <el-tab-pane :key="index":label="item.name" :name="item.path" v-for="(item, index) in iconsAllList" style="height:150px; overflow-y:scroll;">
        <span :key="index2" :class="item2.fontClass" v-for="(item2, index2) in iconArray" @click="iconClick(item2)"></span>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
export default {
  name: 'IfbpAppletIcons',
  props: {
    iconsList: {
      type: Array,
    },
    concatDefaultConfigs: {
      type: Boolean,
      default: true
    }
  },
  data() {
    // var vm = this;
    return {
      iconsAllList: [],
      tabPath: '',
      iconArray: [],
    };
  },
  // watch: {
  //   iconsList(val) {
  //     if(val && Array.isArray(val)) {
  //       var defaultIconsList = this.$context.getFontsConfigs();
  //       if(Array.isArray(defaultIconsList)) {
  //         this.iconsAllList = val.concat(defaultIconsList);
  //       }
  //     }
  //   }
  // },
  mounted() {},
  created() {
    this.init();
    this.$eventBus.$on('fontConfigChange',this.init);
  },
  methods: {
    init(){
      if(this.initTime){
        clearTimeout(this.initTime);
      }
      this.initTime = setTimeout(() => {
        this.initFun();
      },100)
    },
    initFun(){
      this.iconsAllList = [{
        name: "平台图标",
            fontfamily: "iconfont",
            path: "/ap/trd/ifbp-element/theme-default/icon.css"
      }];
      let defaultIconsList = this.$context.getFontsConfigs();
      if (Array.isArray(defaultIconsList) && this.concatDefaultConfigs) {
        this.iconsAllList = this.iconsAllList.concat(defaultIconsList);
      }
      if (Array.isArray(this.iconsList) && this.iconsList.length) {
        this.iconsAllList = this.iconsAllList.concat(this.iconsList);
      }
      this.iconsAllList.sort(function(a,b){
        let aIndex = a.index || 1;
        let bIndex = b.index || 2;
        return aIndex > bIndex;
      });
      if(Array.isArray(this.iconsAllList) && this.iconsAllList.length) {
        this.tabShow({
          index: 0
        });
        this.tabPath = this.iconsAllList[0].path;
      }
    },
    iconClick(item) {
      this.$emit('applet-icon-click', item);
    },
    tabShow(tab) {
      // debugger;
      var item = this.iconsAllList[parseInt(tab.index, 10)];
      this.loadIconsByuri(item);
    },
    loadIconsByuri: function(iconsItem) {
      var vm = this;
      $.ajax({
        url: iconsItem.path,
        success: function(res) {
          // debugger;
          var jsonArray = [];
          var arr = res.substring(res.lastIndexOf(".",res.indexOf(":before"))).trim().replace(/[\r\n]/g, "").split("}");
          // var arr = res.substring(res.indexOf("/*icon-class*/"))
          //   .replace("/*icon-class*/", "")
          //   .trim()
          //   .replace(/[\r\n]/g, "")
          //   .split("}");
            if(iconsItem.name === "平台图标") {
              arr = ['.ifbp-icon-edit:before','.ifbp-icon-share:before','.ifbp-icon-delete:before','.el-icon-search ifbp-icon-search:before','.el-icon-caret-bottom:before','.ifbp-icon-angle-down:before','.ifbp-icon-angle-left:before','.ifbp-icon-angle-right:before','.ifbp-icon-angle-up:before','.ifbp-icon-arrow-back:before','.ifbp-icon-caret-down:before','.ifbp-icon-caret-up:before','.ifbp-icon-caret-left:before','.ifbp-icon-caret-right:before','.ifbp-icon-caret:before','.ifbp-icon-exchange-solid:before','.ifbp-icon-folder:before','.ifbp-icon-doc:before','.ifbp-icon-key:before','.ifbp-icon-linear-scale:before','.ifbp-icon-lock-open:before','.ifbp-icon-person:before','.ifbp-icon-print:before','.ifbp-icon-view-headline:before','.ifbp-icon-view-module:before','.ifbp-icon-account:before','.ifbp-icon-add:before','.ifbp-icon-apps:before','.ifbp-icon-brush:before','.ifbp-icon-call-made:before','.ifbp-icon-camera:before','.ifbp-icon-check:before','.ifbp-icon-close:before','.ifbp-icon-clouddownload:before','.ifbp-icon-copy:before','.ifbp-icon-create-square:before','.ifbp-icon-date:before','.ifbp-icon-delete:before','.ifbp-icon-download:before','.ifbp-icon-edit:before','.ifbp-icon-email:before','.ifbp-icon-explore:before','.ifbp-icon-filter:before','.ifbp-icon-home:before','.ifbp-icon-information:before','.ifbp-icon-keyboard_voice:before','.ifbp-icon-local_phone:before','.ifbp-icon-lock:before','.ifbp-icon-menu:before','.ifbp-icon-message:before','.ifbp-icon-minus:before','.ifbp-icon-more:before','.ifbp-icon-notifications:before','.ifbp-icon-page-empty:before','.ifbp-icon-page:before','.ifbp-icon-picture:before','.ifbp-icon-plus-square:before','.ifbp-icon-power-off:before','.ifbp-icon-power:before','.ifbp-icon-publish:before','.ifbp-icon-refresh:before','.ifbp-icon-save:before','.ifbp-icon-search:before','.ifbp-icon-send:before','.ifbp-icon-setting:before','.ifbp-icon-share:before','.ifbp-icon-sharing:before','.ifbp-icon-star-off:before','.ifbp-icon-star-on:before','.ifbp-icon-success:before','.ifbp-icon-upload:before','.ifbp-icon-videocam:before','.ifbp-icon-view:before','.ifbp-icon-warning:before','.ifbp-icon-watch:before','.ifbp-icon-zoomout:before','.ifbp-icon-xls:before','.ifbp-icon-ppt:before','.ifbp-icon-txt:before','.ifbp-icon-unknown:before','.ifbp-icon-pdf:before','.ifbp-icon-music:before','.ifbp-icon-zip:before','.ifbp-icon-view-quilt:before','.ifbp-icon-approve:before','.ifbp-icon-in-approve:before','.ifbp-icon-history:before','.ifbp-icon-people:before','.ifbp-icon-accounts:before','.ifbp-icon-assignment-ind:before','.ifbp-icon-assignment:before','.ifbp-icon-contract:before','.ifbp-icon-description:before','.ifbp-icon-exit-to-app:before','.ifbp-icon-find-in-page:before','.ifbp-icon-folder-shared:before','.ifbp-icon-grant:before','.ifbp-icon-organization:before','.ifbp-icon-payroll:before','.ifbp-icon-calculator:before','.ifbp-icon-duty:before','.ifbp-icon-recent-actors:before','.ifbp-icon-salary:before','.ifbp-icon-settings-applications:before','.ifbp-icon-swap-horiz:before','.ifbp-icon-wage-increase:before','.ifbp-icon-sort:before','.ifbp-icon-attachment:before','.ifbp-icon-cloud:before','.ifbp-icon-emoticon:before','.ifbp-icon-place:before','.ifbp-icon-scan:before','.ifbp-icon-star_half:before','.ifbp-icon-thumb_up:before','.ifbp-icon-work:before','.ifbp-icon-person_add:before','.ifbp-icon-group_add:before','.ifbp-icon-advance-payment:before','.ifbp-icon-business-reporting:before','.ifbp-icon-pause:before','.ifbp-icon-general-expenses:before','.ifbp-icon-image-worktable:before','.ifbp-icon-job-management-worktable:before','.ifbp-icon-job-worktable:before','.ifbp-icon-merchants-reimbursement:before','.ifbp-icon-stop:before','.ifbp-icon-performance-analysis:before','.ifbp-icon-rembursement:before','.ifbp-icon-performance-worktable:before','.ifbp-icon-travel-reimbursement:before','.ifbp-icon-travel-application:before','.ifbp-icon-travel-to-borrow:before','.ifbp-icon-through-examination-and-approval:before','.ifbp-icon-reject:before','.ifbp-icon-have-to-pay:before','.ifbp-icon-redo:before','.ifbp-icon-signed:before','.ifbp-icon-settlement-success:before','.ifbp-icon-business:before','.ifbp-icon-developer-board:before','.ifbp-icon-library-add:before','.ifbp-icon-multi-file:before','.ifbp-icon-patch:before','.ifbp-icon-person-cancel:before','.ifbp-icon-query-template:before','.ifbp-icon-restore:before','.ifbp-icon-save-alt:before','.ifbp-icon-supervised-user:before','.ifbp-icon-UI-template-management:before','.ifbp-icon-web:before','.ifbp-icon-baseline-check_box:before','.ifbp-icon-check_circle_outline:before','.ifbp-icon-highlight_off:before','.ifbp-icon-equalizer:before','.ifbp-icon-receipt:before','.ifbp-icon-visibility:before','.ifbp-icon-extension:before','.ifbp-icon-personnel-allotment:before','.ifbp-icon-personnel-management:before','.ifbp-icon-up:before','.ifbp-icon-down:before','.ifbp-icon-left:before','.ifbp-icon-right:before','.ifbp-icon-bottom:before','.ifbp-icon-ascending:before','.ifbp-icon-descending:before','.ifbp-icon-attach-file:before','.ifbp-icon-error-outline:before','.ifbp-icon-roster-design:before','.ifbp-icon-undo:before','.ifbp-icon-accident:before','.ifbp-icon-bonus--allocation:before','.ifbp-icon-chart:before','.ifbp-icon-checking-in:before','.ifbp-icon-commonality:before','.ifbp-icon-demotion:before','.ifbp-icon-flag:before','.ifbp-icon-formula:before','.ifbp-icon-gavel:before','.ifbp-icon-layers:before','.ifbp-icon-leader:before','.ifbp-icon-party:before','.ifbp-icon-position-sequence:before','.ifbp-icon-rank:before','.ifbp-icon-retired:before','.ifbp-icon-takeoff:before','.ifbp-icon-tax:before','.ifbp-icon-train:before','.ifbp-icon-transfer:before','.ifbp-icon-unarchive:before','.ifbp-icon-valirem:before','.ifbp-icon-welfare:before','.ifbp-icon-work-shift:before','.ifbp-icon-description-lock:before','.ifbp-icon-official-rank:before','.ifbp-icon-business-center:before','.ifbp-icon-account-box:before','.ifbp-icon-intelligent-answer:before','.ifbp-icon-tune:before','.ifbp-icon-credit-card:before','.ifbp-icon-have-been-hung-up:before','.ifbp-icon-playlist-add:before','.ifbp-icon-remove-shopping-cart:before','.ifbp-icon-shopping-cart:before','.ifbp-icon-cancel-signature:before','.ifbp-icon-signature:before','.el-icon-arrow-left:before','.el-icon-arrow-right:before','.el-icon-caret-top:before','.doc-icon-github elementdoc:before']
            }
          $.each(arr, (i, item) => {
            if (item.length) {
              jsonArray.push({
                category: iconsItem.name,
                name: item.substring(item.indexOf("-") + 1, item.indexOf(":")),
                fontClass: iconsItem.fontfamily + " " + item.substring(item.indexOf(".") + 1, item.indexOf(":"))
              });
            }
          });
          vm.iconArray = jsonArray;
        },
        error: function(textStatus) { //请求失败后调用的函数
          vm.iconsAllList = vm.iconsAllList.filter(item => {
            return item.path !== iconsItem.path;
          });
        }
      });
    }
  }

}
</script>

