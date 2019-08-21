<template>
  <div :class="[
    'ifbp-item-group',
    navbar && navBarData.length > 3? 'nav-bar':'',
    ]">
    <div class="ifbp-item-group-main">
      <slot></slot>
    </div>

    <ul ref="ifbpPanelGroupUl" class="ifbp-item-group-nav-bar" v-show="navbar && navbarFlag && navBarData.length > 3">
        <li v-for="(item, index) in navBarData" :class="{'selected': index === nowIndex}" :key="index" :panelId="item.id" @click="e =>{navBarClick(e,index)}">
          <el-tooltip :content="item.title" v-if="item.title.length > 6">
            <div  >{{ item.title.slice(0, 5) + '...' }}</div>
          </el-tooltip>
          <div v-else >{{item.title}}</div>
        </li>
        <span class="line" :style="ulSpanStyle"></span>
      </ul>
  </div>
</template>

<script>
import { addResizeListener } from "ifbp-element/src/utils/resize-event";
export default {
  name: "IfbpPanelGroup",

  componentName: "IfbpPanelGroup",

  props: {
    navbar: {

    },
    baseScrollTop: {
      type: [String, Number],
      default: 44
    },
    baseNavBarTop: {
      type: [String, Number],
      default: 44
    },
    scrollDom: {
      default: "ifbpScrollDom"
    }
  },
  watch: {
    navbar(){
      this.appendNavbarFun();
      this.checkRemoveUl();
    },
    baseScrollTop() {
      if (this.navbar) {
        this.bodyResize();
      }
    },
    baseNavBarTop() {
      if (this.navbar) {
        this.bodyResize();
      }
    }
  },

  data() {
    return {
      nowIndex: 0,
      realBaseNavBarTop: 150,
      navBarData: [],
      panelCompArr: [],
      resetNavBarDataTimeOut: "",
      navbarFlag: false,
      appendNavbar: false,
      clickNavbar: false
    };
  },
  created() {
    this.$on("childChange", this.childChangeFun);
    this.$router && this.$router.afterEach(this.routerAfterEach);
      // this.$router.afterEach(() => {
      //   let app =
      //     this.$context && this.$context.getApp && this.$context.getApp();
      //   if (app && app.showTabs) {
      //     if (
      //       app.tabIndex ===
      //         parseInt(
      //           $(this.$el)
      //             .closest(".main-panel")
      //             .attr("index")
      //         ) &&
      //       this.navbar
      //       && !$(this.$el).closest('.list-complete-item').hasClass('displaynone')
      //       && $(this.$el).closest('.list-complete-item').css('display') !== 'none'
      //       && $(this.$el).closest('body').length > 0
      //     ) {
      //       $(this.$refs["ifbpPanelGroupUl"]).css("display", "");
      //     } else {
      //       $(this.$refs["ifbpPanelGroupUl"]).css("display", "none");
      //     }
      //   }
      // });
  },
  beforeDestroy() {
    this.destroyUl();
    window.panelGroups = window.panelGroups || [];
    let i = window.panelGroups.indexOf(this);
    if(i  > -1){
      window.panelGroups.splice(i);
    }
    window.removeEventListener("resize", this.bodyResize);
    if (this.realScrollDom){
      this.realScrollDom.removeEventListener("scroll", this.onScroll);
    }
    if (this.$router && this.$router.afterHooks.indexOf(this.routerAfterEach) > -1){
      var index = this.$router.afterHooks.indexOf(this.routerAfterEach);
      this.$router.afterHooks.splice(index, 1);
    }
    if (window.document.body.onmouseover === this.onmouseoverFun){
      window.document.body.onmouseover = null;
    }
  },
  mounted() {
    window.panelGroups = window.panelGroups || [];
    window.panelGroups.push(this);
    let $tabs = $(".el-tabs__item");
    let headerHeight = $(".header")[0] ? $(".header")[0].offsetHeight : 0;
    this.realBaseNavBarTop = this.baseNavBarTop + ($tabs.length > 0 ? 31 : 0);
    this.appendNavbarFun();
  },

  methods: {
    routerAfterEach(){
      let app = this.$context && this.$context.getApp && this.$context.getApp();
      if (app && app.showTabs) {
        if (app.tabIndex ===parseInt($(this.$el).closest(".main-panel").attr("index")) && this.navbar && this.navBarData.length > 3
          && !$(this.$el).closest('.list-complete-item').hasClass('displaynone')
          && $(this.$el).closest('.list-complete-item').css('display') !== 'none'
          && $(this.$el).closest('body').length > 0
        ) {
          $(this.$refs["ifbpPanelGroupUl"]).css("display", "");
        } else {
          $(this.$refs["ifbpPanelGroupUl"]).css("display", "none");
        }
      }
    },
    checkRemoveUl(){
      if(this.navbar && this.navBarData.length > 3){
        if($(this.$el).closest('.list-complete-item').css('display') === 'none' || $(this.$el).closest('.list-complete-item').hasClass('displaynone')|| $(this.$el).closest('body').length < 1){
          $(this.$refs["ifbpPanelGroupUl"]).css('display','none');
        }else{
          let dom = this.$el;
          let hiddenFlag = $(dom).is(":hidden");
          if(hiddenFlag)   {
            $(this.$refs["ifbpPanelGroupUl"]).css('display','none');
          }else{
            $(this.$refs["ifbpPanelGroupUl"]).css('display','block');
          }
        }
      }else{
        $(this.$refs["ifbpPanelGroupUl"]).css('display','none');
      }
    },
    onmouseoverFun(event){
      this.el = event.target; //鼠标每经过一个元素，就把该元素赋值给变量el
      let parent = document.getElementsByClassName(
        "ifbp-item-group-nav-bar"
      )[0];
      var flag = function(obj, parentObj) {
        while (
          obj != undefined &&
          obj != null &&
          obj.tagName.toUpperCase() != "BODY"
        ) {
          if (obj == parentObj) {
            return true;
          }
          obj = obj.parentNode;
        }
        return false;
      };
      if (!flag(this.el, parent)) {
        this.clickNavbar = false;
      }
    },
    appendNavbarFun(){
      if (this.navbar && !this.appendNavbar) {
        document.body.appendChild(this.$refs["ifbpPanelGroupUl"]);
        this.$nextTick(function() {
          this.getPanelHeight();
          setTimeout(() => {
            this.bodyResize();
            let app = this.$context && this.$context.getApp && this.$context.getApp();
            // 多页签
            if (app && app.showTabs) {
              if (
                app.tabIndex ===
                  parseInt(
                    $(this.$el)
                      .closest(".list-complete-item")
                      .attr("index")
                  ) &&
                this.navbar
                && !$(this.$el).closest('.list-complete-item').hasClass('displaynone')
                && $(this.$el).closest('.list-complete-item').css('display') !== 'none'
                && $(this.$el).closest('body').length > 0
              ) {
              this.navbarFlag = true;
              }
            }else{
              //单页签
              if (
                this.navbar
                && !$(this.$el).closest('.list-complete-item').hasClass('displaynone')
                && $(this.$el).closest('.list-complete-item').css('display') !== 'none'
                && $(this.$el).closest('body').length > 0
              ) {
              this.navbarFlag = true;
              }
            }
          }, 500);
          addResizeListener(this.$el, this.getPanelHeight);
          // addResizeListener(document.body, this.bodyResize);
          window.addEventListener("resize", this.bodyResize);
          this.realScrollDom.addEventListener("scroll", this.onScroll);
        });
        this.el = window.document.body; //声明一个变量，默认值为body
        // var that = this;
        window.document.body.onmouseover = this.onmouseoverFun;
        this.appendNavbar = true;
      }
    },
    destroyUl(){
      $(this.$refs["ifbpPanelGroupUl"]).remove();
    },
    getPanelHeight() {
      for(let i = 0; i < this.navBarData.length; i++){
        var navdata = this.navBarData[i];
        if(i === 0){
          $(navdata.vnodeElm).addClass('ifbp-panel-first');
          navdata.panelHeight = navdata.vnodeElm.offsetHeight;
        }else{
          $(navdata.vnodeElm).removeClass('ifbp-panel-first');
          navdata.panelHeight = navdata.vnodeElm.offsetHeight + 8;
        }
      }
    },
    bodyResize() {
      if (this.bodyResizeTimeOut) {
        clearTimeout(this.bodyResizeTimeOut);
      }
      let vm = this;
      this.bodyResizeTimeOut = setTimeout(function() {
        vm.bodyResizeFun();
      }, 200);
    },
    bodyResizeFun() {
      if (this.navbar) {
        this.windowHeight =
          window.innerHeight || (document.body && document.body.clientHeight); // 窗口高度
        let headerDom = document.querySelector("header.header");
        this.headerHeight = headerDom ? headerDom.offsetHeight : 0; // header高度
        this.realBaseNavBarTop = this.baseNavBarTop + this.headerHeight;
        let maxHeight =
          this.windowHeight - this.headerHeight - this.baseNavBarTop - 55; // 考虑到下方存在footbar将高度降低
        if (this.$refs["ifbpPanelGroupUl"]) {
          this.$refs["ifbpPanelGroupUl"].style.top =
            this.realBaseNavBarTop + "px";
          this.$refs["ifbpPanelGroupUl"].style.maxHeight = maxHeight + "px";
        }
        // var lastChildrenPanel = $(this.$el).find(".ifbp-item-group-main").children(".ifbp-panel:last-child");
        $(this.$el)
          .find(".ifbp-panel")
          .css("margin-bottom", "");
        if (this.lastPanel) {
          var lastPanelHeight =
            this.windowHeight - this.headerHeight - this.lastPanel.offsetHeight;
        }
        $(this.lastPanel).css("margin-bottom", lastPanelHeight);
      }
    },
    navBarClick(e, index) {
      this.clickNavbar = true;
      e.preventDefault();
      const target = e.currentTarget;
      if (target) {
        const panelId = target.getAttribute("panelId");
        const toDom = document.getElementById(panelId);
        this.nowIndex = index;
        let nowScrollTop = this.baseScrollTop;
        if(index === 0){
          nowScrollTop = nowScrollTop - 8;
        }
        for(let i = 0; i < this.nowIndex; i++){
          nowScrollTop += this.navBarData[i].panelHeight;
        }
        $(this.realScrollDom).animate({scrollTop:nowScrollTop +'px'},500);
        // if (toDom) {
        //   toDom.scrollIntoView({ behavior: "smooth", block: "start" }); // 根据id找到对应DOM滚动到顶部
        // }
        this.$nextTick(function() {
          let scrollTop;
          if (this.realScrollDom === window) {
            scrollTop =
              document.documentElement.scrollTop || document.body.scrollTop;
          } else {
            scrollTop = this.realScrollDom.scrollTop;
          }

          let nowHeight = parseInt(this.baseScrollTop);

          if (this.$refs["ifbpPanelGroupUl"]) {
            if (scrollTop < parseInt(this.baseScrollTop) - 8) {
              this.$refs["ifbpPanelGroupUl"].style.top =
                parseInt(this.realBaseNavBarTop) - scrollTop + "px";
            } else {
              this.$refs["ifbpPanelGroupUl"].style.top =
                parseInt(this.realBaseNavBarTop) -
                (parseInt(this.baseScrollTop) - 8) +
                "px";
            }
          }
        });
      }
    },
    onScroll() {
      if (this.navbar) {
        let scrollTop;
        if (this.realScrollDom === window) {
          scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop;
        } else {
          scrollTop = this.realScrollDom.scrollTop;
        }

        let nowHeight = parseInt(this.baseScrollTop);

        if (this.$refs["ifbpPanelGroupUl"]) {
          if (scrollTop < parseInt(this.baseScrollTop) - 8) {
            this.$refs["ifbpPanelGroupUl"].style.top =
              parseInt(this.realBaseNavBarTop) - scrollTop + "px";
          } else {
            this.$refs["ifbpPanelGroupUl"].style.top =
              parseInt(this.realBaseNavBarTop) -
              (parseInt(this.baseScrollTop) - 8) +
              "px";
          }
        }
        if (!this.clickNavbar) {
          if (scrollTop < nowHeight) {
            this.nowIndex = 0;
            return;
          }
          for (var i = 0; i < this.navBarData.length; i++) {
            nowHeight += this.navBarData[i].panelHeight;
            if (scrollTop < nowHeight) {
              this.nowIndex = i;
              return;
            }
          }
          this.nowIndex = this.navBarData.length - 1;
        }
      }
    },
    childChangeFun() {
      this.resetNavBarData();
      this.bodyResize();
    },
    resetNavBarData() {
      if (this.resetNavBarDataTimeOut) {
        clearTimeout(this.resetNavBarDataTimeOut);
      }
      let vm = this;
      this.resetNavBarDataTimeOut = setTimeout(function() {
        vm.resetNavBarDataFun();
      }, 200);
    },
    resetNavBarDataFun() {
      let navBarDataArr = [];
      let $ifbpPanelsAll = $(this.$el).find(".ifbp-panel");
      let $ifbpPanels = $(this.$el).find(".ifbp-item-group .ifbp-panel");
      let $ifbpPanels1 = $(this.$el).find(".ifbp-panel-no-nav-bar");
      this.lastPanel = null;
      $ifbpPanelsAll.each((index, panelDom) => {
        let flag = true;
        $ifbpPanels.each((cindex, cpanelDom) => {
          if (panelDom == cpanelDom) {
            flag = false;
          }
        });
        $ifbpPanels1.each((cindex, cpanelDom) => {
          if (panelDom == cpanelDom) {
            flag = false;
          }
        });
        if (flag) {
          let vuePanel = panelDom.__vue__;
          this.lastPanel = panelDom;
          if (vuePanel) {
            let vnode = vuePanel.$vnode;
            if (
              vnode.componentOptions &&
              vnode.componentOptions.tag === "ifbp-panel"
            ) {
              let propsData =
                vnode.componentOptions && vnode.componentOptions.propsData;
              let title = propsData.title;
              let id = propsData.id;
              title = title ? title : "";
              navBarDataArr.push({
                id: id,
                title: title,
                vnodeElm: vnode.elm
              });
            }
          }
        }
      });
      this.navBarData = navBarDataArr;
      this.getPanelHeight();
    }
  },

  computed: {
    ulSpanStyle() {
      let height = (this.navBarData.length - 1) * 32;
      return "height:" + height + "px";
    },
    realScrollDom() {

        console.log(this.scrollDom )
      if (this.scrollDom === "ifbpScrollDom") {
        return $("#main-right")[0];
      } else {
        return this.scrollDom;
      }
    }
  }
};
</script>

<style>
</style>
