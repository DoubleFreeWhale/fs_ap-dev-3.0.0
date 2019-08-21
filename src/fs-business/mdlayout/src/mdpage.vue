<template>
    <div class="mdlayout-page" @click="hideMdlayoutMasterList" :class="this.containerClass">
        <div class="mdlayout-page-header">
            <div class="mdlayout-header-func" v-if="showExpandbtn">
                <i class="ifbp-icon-format-indent-increase header-icon" @click.stop="showMdlayoutMasterList"></i>
            </div>
            <slot name="title"></slot>
        </div>
        <div class="mdlayout-page-section">
            <slot name="content"></slot>
        </div>
        <div class="mdlayout-page-footer" v-if="$slots['footer-left'] || $slots['footer']">
           <div class="md-footer-left">
              <slot name="footer-left"></slot>
           </div>
           <div class="md-footer-right">
              <slot name="footer"></slot>
           </div>
        </div>
    </div>
</template>

<script>
  import {scrollBar} from "../helper/jquery.scrollbar.js";
  export default {
    name: 'MdPage',
    props:{
        showExpandbtn:{
          type:Boolean,
          default:false
        },
        containerClass:{
          type:Array
        }
    },
    data(){
      return {
      };
    },
    created(){
    },
    mounted(){
      var vm=this;
      $(window).resize(function(){
        vm.handlPageSectionHeight();
      })

      this.handlPageSectionHeight();

      if(window.isIE){
        //在IE下,初始化 scrollBar 插件;
        scrollBar(jQuery);
        $(".mdlayout-page-section").scrollBar({
          barWidth:5
        });
      };
    },
    methods: {
      hideMdlayoutMasterList(){
        if(this.$parent.hideMdlayoutMasterList){
          this.$parent.hideMdlayoutMasterList();
        }
      },
      showMdlayoutMasterList(){
        this.$parent.showMdlayoutMasterList();
      },
      //计算本组件内容器的高度;
      handlPageSectionHeight(){
        let winHeight=$(window).height();
        let headerH=$(".header").height();
        let mdTitleH=$(".mdlayout-page-header").height();
        let flag=$(this.$el).children(".mdlayout-page-footer").length;
        if(flag){
          mdTitleH+=mdTitleH;
        }

        $(this.$el).height(winHeight-headerH);
        $(this.$el).children(".mdlayout-page-section").height(winHeight-headerH-mdTitleH);
        if(this.$parent.fullscreen){
          $(this.$el).height(winHeight);
          $(this.$el).children(".mdlayout-page-section").height(winHeight-mdTitleH);
        }
      }
    }    

  };

</script>
<style scoped>
/* 分屏自适应左侧list-panel */
.mdlayout-page {
    transform: translate3d(0px, 0px, 0px);
    height:auto;
    width: 100%;
    transition: all 300ms;
    min-height:100%;
}
.mdlayout-search-box {
    width: 80%;
    margin: 6px auto;
  }
  .mdlayout-page-header {
    height: 47px;
    line-height:47px;
    border-bottom: 1px solid #E6E6EB;
    /* background: #eff4f9; */
    padding-right:10px;
    text-align:center;
  }
  .mdlayout-page-header label {
    color: #333;
    line-height: 3rem;
    font-size: 1.4rem;
    width: 100%;
    font-weight: bold;
  }
  .text-center {
    text-align: center;
  }
  .mdlayout-page-section {
    background: #fff;
    padding: 0!important;
    left:0px;
    position: absolute;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling:touch;
    width: 100%;
  }
  .mdlayout-page-header .header-title {
    font-size: 16px;
    font-weight:500;
    vertical-align:middle;
    color:#666666;
  }
  .mdlayout-page-header .header-btn {
    line-height: 3rem;
    float: right;
    padding-right: 10px;
    list-style: none;
  }
  .mdlayout-page-header .header-btn > li {
    float: left;
    line-height: 3rem;
    width: 40px;
    font-size: 16pt;
    cursor: pointer;
  }
  .header-icon {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    cursor: pointer;
    font-size: 18px;
    padding: 0 5px;

    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .mdlayout-header-func {
    font-size: 1rem; 
    vertical-align:middle;
    float:left;
    margin-top:15px;
  }
  .mdlayout-header-func i{
    font-size: 1.2rem;
    display: none;
    position: relative;
    transition: .3s all;
    margin-left:.5rem;
    color:#75787B;
  }

  .mdlayout-page-footer {
    z-index: 2;
    height: 3rem;
    width: 100%;
    line-height: 3rem;
    position: absolute;
    bottom:0;
    left:0;
    background:rgba(51, 51, 51,0.7);
    border-left:1px solid #eee;
  }
  .footer-btn {
    line-height: 3rem;
    list-style: none;
    padding-left: 0px;
    position: absolute;
    left: 0px;
    right: 0px;
    top: 3rem;
  }
  .footer-btn > li {
    float: left;
    line-height: 3rem;
    cursor: pointer;
    text-align: center;
    border-width: 1px;
    border-style: solid;
    border-color: #E0DFE3;
    color: #000;
  }
  .el-table-selected-row {
    background-color: #4F8EDC !important;
  }

  .child-view {
    position: absolute;
    width:100%;
    transition: all .3s ;
  }
  .slide-left-enter, .slide-right-leave-active {
    /*opacity: 0;*/
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    /*opacity: 0;*/
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
  }
  .md-footer-left,.md-footer-right{
     display: inline-block;
  }
  .md-footer-left{
    padding-left:16px;
  }
  .md-footer-right{
    float:right;
    line-height:inherit;
    padding-right:16px;
  }
  
  @media (max-width: 768px) {
    .mdlayout-page .mdlayout-header-func{
      margin-top:0;
    }
    .mdlayout-page .mdlayout-header-func i {
      display: inline-block !important;
      line-height:3rem;
    }
  }

  @media (max-width: 480px) {
    /* .mdlayout-master {
      position: absolute !important;
      left: -320px;
      z-index: 10;
    }
    .mdlayout-detail .mdlayout-header-func i {
      display: inline-block !important;
    }
    .tree-mdlayout-master {
      position: absolute !important;
      left: -320px;
      z-index: 10;
    }
    .tree-mdlayout-header-func i {
      display: inline-block !important;
    }     */
  }  
</style>
