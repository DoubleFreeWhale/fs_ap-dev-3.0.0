<template>
  <div id="ifbp-slide-nav" :class="{
        'hover': hoverFlag
      }" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <div class="nav-trigger">
          <i class="el-icon-pt-fenlei1"></i>
          <!-- <span>{{title}}</span> -->
      </div>
      <div id="leftNav" class="left-nav-expand">
          <div :class="['left-nav-expand-inner', {'expand-1': sndList && sndList.length, 'expand-2': trdList && trdList.length}]" @mouseleave="handleMouseLeaveNav">
              <div id="fstLeftNav" class="left-nav-group" @mouseenter="handleNavGroupEnter">
                  <ul>
                      <li :class="{'nav-actived': index === fstActiveIndex}" v-for="(fstItem, index) in menuData" :key="index" @mouseenter="handleMouseEnterFstItem(fstItem, index)" @mouseleave="mouseLeaveItem('fst', 'snd')"><a>{{fstItem.label}}</a><i v-if="fstItem.children && fstItem.children.length" class="el-icon-arrow-right"></i></li>
                  </ul>
              </div>
              <div id="sndLeftNav" :class="['left-nav-group']" @mouseenter="handleNavGroupEnter">
                  <ul>
                      <li :class="{'nav-actived': index === sndActiveIndex}" v-for="(sndItem, index) in sndList" :key="index" @mouseenter="handleMouseEnterSndItem(sndItem, index)" @mouseleave="mouseLeaveItem('snd', 'trd')"><a>{{sndItem.label}}</a><i v-if="sndItem.children && sndItem.children.length" class="el-icon-arrow-right"></i></li>
                  </ul>
              </div>
              <div id="trdLeftNav" :class="['left-nav-group']" @mouseenter="handleNavGroupEnter">
                  <ul>
                      <li v-for="(trdItem, index) in trdList" :key="index" @click="menuLinkClick(trdItem)"><a>{{trdItem.label}}</a><i v-if="trdItem.children && trdItem.children.length" class="el-icon-arrow-right"></i></li>
                  </ul>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import menu from "./allList.json";
export default {
  data() {
    return {
      sndList: [],
      trdList: [],

      hoverFlag: false,

      fstActiveIndex: -1,
      sndActiveIndex: -1,

      sndShowExpandTimer: null,
      trdShowExpandTimer: null,
      sndHideExpandTimer: null,
      trdHideExpandTimer: null,
      clearActiveIndexTimer: null,
    };
  },
  props: {
    title: {
      default: "全部分类"
    },
    menuData: {
      type: Array,
      default: []
    }
  },
  created() {
  },
  watch: {
    menuData(val) {
      console.log("watch menuData", val);
    }
  },
  methods: {
    handleMouseEnter(){
      this.hoverFlag = true;
    },
    handleMouseLeave(){
      this.hoverFlag = false;
    },
    handleMouseEnterFstItem(fstItem, index) {
      const vm = this;
      clearTimeout(this.sndHideExpandTimer);

      this.sndShowExpandTimer && clearTimeout(this.sndShowExpandTimer);
      this.sndShowExpandTimer = setTimeout(() => {
        if(Object.prototype.toString.call(fstItem.children) === "[object Array]" && fstItem.children.length) {
          vm.sndList = fstItem.children;

          var sndLeftNavDom = document.getElementById("sndLeftNav");
          if(sndLeftNavDom) {
            sndLeftNavDom.classList.add("expanded");
          }
          
          this.fstActiveIndex = index;
          // 清空二级li高亮
          if(this.sndActiveIndex > -1) {
            this.sndActiveIndex = -1;
          }

          this.sndShowExpandTimer = null;
        }
      }, 250);
    },

    handleMouseEnterSndItem(sndItem, index) {
      const vm = this;
      clearTimeout(this.trdHideExpandTimer);

      this.trdShowExpandTimer && clearTimeout(this.trdShowExpandTimer);
      this.trdShowExpandTimer = setTimeout(() => {
        if(Object.prototype.toString.call(sndItem.children) === "[object Array]" && sndItem.children.length) {
          this.trdList = sndItem.children;

          var sndTrdLeftNav = document.getElementById("trdLeftNav");
          if(sndTrdLeftNav) {
            sndTrdLeftNav.classList.add("expanded");
          }

          this.sndActiveIndex = index;

          this.trdShowExpandTimer = null;
        }
      }, 250);
    },

    mouseLeaveItem(curName, nextName) {
      if(this.trdShowExpandTimer){
        clearTimeout(this.trdShowExpandTimer);
      }
      if(this.sndShowExpandTimer){
        clearTimeout(this.sndShowExpandTimer);
      }
      this.hideExpandByItemName(nextName);
      this.clearActiveIndexTimer && clearTimeout(this.clearActiveIndexTimer);
      this.clearActiveIndexTimer = setTimeout(() => {
        if(this[curName+"ActiveIndex"] > -1) {
          this[curName+"ActiveIndex"] = -1;
        }
        this.clearActiveIndexTimer = null;
      }, 100);
    },

    menuLinkClick(item) {
      const path = item.path;
      if(path){		      		 	
      	 if (this.$context.getApp() && this.$context.getApp().showTabs === false){		
      	 	this.$context.destroyAllTiles();
      	 	this.$context.destroyTileByCode(item.code);
      	 		
      	 }
 			  if(this.$context.getPlatform() == "fbp"){
					window.vueInstance.$children[0].openNewFun(path, item);
				}else{
					window.vueInstance.$children[0].addEditableTabs(path, item);
				}	         
      }
      // 清空第三级和第二级菜单，使其隐藏
      this.trdList = [];
      this.sndList = [];
      this.hoverFlag = false;
    },

    handleNavGroupEnter(event) {
      this.clearActiveIndexTimer && clearTimeout(this.clearActiveIndexTimer);

      const targetId = event.currentTarget.getAttribute("id");
      if(targetId === "sndLeftNav") {
        clearTimeout(this.sndHideExpandTimer);
      } else if(targetId === "trdLeftNav") {
        clearTimeout(this.trdHideExpandTimer);
      }
    },

    // 鼠标移出左侧菜单 总面板
    handleMouseLeaveNav() {
      this.hideExpandByItemName("trd");
      this.hideExpandByItemName("snd");
      // 清空li高亮
      this.fstActiveIndex = -1;
      this.sndActiveIndex = -1;
    },

    // 根据名称隐藏面板
    hideExpandByItemName(name) {
      this[name+"HideExpandTimer"] && clearTimeout(this[name+"HideExpandTimer"]);
      const vm = this;
      this[name+"HideExpandTimer"] = setTimeout(() => {
        vm[name+"List"] = [];
        this[name+"HideExpandTimer"] = null;
      }, 100);
    },
  }
};
</script>
<style scoped>
#ifbp-slide-nav {
  line-height: 64px;
  position: relative;
  text-align: center;
  float: left;
  background-color: #fff;
  z-index: 1020  !important}
#ifbp-slide-nav .nav-trigger {
  color: #888888;
  width: 64px;
  height: 64px;
  font-size: 16px;
  border-right: 1px solid #efeded;
  transition: height .3s ease;
}
#ifbp-slide-nav.hover .nav-trigger {
  color: #333333;
  cursor: pointer;
  height: 64px;
  /* position: absolute; */
  border-right: 1px solid #efeded;
  background: #f5f5f5;
  transition: height .3s ease;
  z-index: 1011 !important;
}
#ifbp-slide-nav.hover #leftNav {
  left: 0;
  transition: left .2s .1s ease;
}
#leftNav {
  position: absolute;
  left: -240px;
  top: 64px;
  overflow: visible;
  transition: left .2s .1s ease;
  box-sizing: border-box;
  z-index: 1010 !important;
}
.left-nav-expand-inner {
  width: 240px;
  height: inherit;
  position: relative;
  border-top: 1px solid #efeded;
  transition: all .2s .1s ease;
  box-shadow: 0px 5px 10px 2px #d3d1d1;
}
.left-nav-expand-inner.expand-1 {
  width: 480px;
  transition: width .2s .1s ease;
}
.left-nav-expand-inner.expand-1.expand-2 {
  width: 720px;
  transition: width .2s .1s ease;
}

#fstLeftNav {
  position: absolute;
  top: 0;
  z-index: 1013 !important;
  box-sizing: border-box;
}
#sndLeftNav {
  position: absolute;
  top: 0;
  left: -5px;
  transition: left .2s .1s ease;
  box-sizing: border-box;
  z-index: 1012 !important;
}
.left-nav-expand-inner.expand-1 #sndLeftNav {
  left: 240px;
  transition: left .2s .1s ease;
}
#trdLeftNav {
  z-index: 1011 !important;
  position: absolute;
  top: 0;
  left: -5px;
  transition: left .2s .1s ease;
  box-sizing: border-box;
}
.left-nav-expand-inner.expand-1 #trdLeftNav {
  left: 235px;
  transition: left .2s .1s ease;
}
.left-nav-expand-inner.expand-2 #trdLeftNav {
  left: 480px;
  transition: left .2s .1s ease;
}
.left-nav-group {
  width: 240px;
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  border-right: 1px solid #efeded;
}
.left-nav-group ul {
  margin: 0;
}
.left-nav-group ul li {
  height: 16px;
  line-height: 16px;
  padding: 12px 16px;
  font-size: 14px;
  text-align: left;
  position: relative;
  color: #666 !important;
  cursor: pointer;
  box-sizing: content-box;
}
.left-nav-group ul li i{
  color: #C8C8CD;
}
.left-nav-group ul li:hover a,
.left-nav-group ul li:hover i,
.left-nav-group ul li.nav-actived a,
.left-nav-group ul li.nav-actived i {
  color: #00a4ff;
}
.left-nav-group ul li:hover,
.left-nav-group ul li.nav-actived {
  background: #f5f5f5;
}
.left-nav-group ul li i{
  position: absolute;
  right: 12px;
  transform: scale(.7);
  font-size: 14px;
  font-weight: bold;
}
</style>

