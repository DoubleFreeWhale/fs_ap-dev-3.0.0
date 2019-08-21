<template>
    <div class="mdlayout-wrapper" :class="this.containerClass">
        <div class="mdlayout-aside">
            <slot name="master"></slot>               
        </div>
        <div class="mdlayout-main">
            <slot name="detail"></slot>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'MdLayout',
    data(){
      return {
        selectRowId: '',
        loading: false,
        noMoreData: false
      };
    },
    props:{
      asideWidth:{
        type:Number,
        default:280
      },
      containerClass:{
        type:Array
      }
    },
    created(){
    //   this.request();
    },
    mounted() {
      var oThis=this;
      // 判断 路由中是否有mainNoPadding,如果有，则以处理内容去高度为全屏(540)，此时由此main-right不会有滚动条。
      //      如果无，则在此给容器减少8px，使main-right无滚动条。
      var isMainPt=this.$route.query.mainNoPadding;
      var mainPt=0;
      if(!Boolean(isMainPt)){mainPt=8};
      //初始化容器高度;
      this.handleConHeight(mainPt);
      this.handleAsideWidth();
      
      var listEl = document.querySelector(".mdlayout-page-section");
      // 监听左侧list滚动条的位置，实现滚动分页加载
      listEl.addEventListener("scroll", () => {
        if(this.loading || this.noMoreData) {
          return;
        }
        var scrollTop = listEl.scrollTop;
        var clientHeight = listEl.clientHeight;
        var scrollHeight = listEl.scrollHeight;
        var toButtom = scrollHeight - scrollTop - clientHeight;
        if(toButtom === 0) {
          this.pn = this.pn + 1;
          this.requestListData(10, () => { 
            // 修复moreData加载成功后，滚动条仍停留在最底部的问题
            listEl.scrollTop = scrollTop;
            console.log("加载完成");
          });
        }
      });
      window.onresize=function(){
        oThis.handleConHeight(mainPt);
        oThis.handleAsideWidth();
      };
    },
    methods: {
      //处理容器高度;
      handleConHeight(mainPt){
        var mainPt=mainPt||0;
        let windowH=$(window).height();
        let headerH=$(".header").height();
        let contentH=windowH-headerH-mainPt;
        $(".mdlayout-wrapper,.mdlayout-aside,.mdlayout-main").css("height",contentH);        
      },
      // 点击mdlayout-master的一项
      listItemClick(row) {
        this.selectRowId = row.id;
        this.hideMdlayoutMasterList();
        if(this.selectRowId){
        // this.$router.push('/staff/detail/' +row.id);
        }
      },
      //宽度小于768时,点击显示左边栏 mdlayout-aside
      showMdlayoutMasterList(){
        let winWidth=$(window).width();
        let mdlayoutAside=$(".mdlayout-aside");
        let mdlayoutMain=$(".mdlayout-main");
        if(winWidth<768){
          if(mdlayoutAside && mdlayoutMain){
             mdlayoutAside.css("left","0");
          }
        }else{
            if(parseInt(mdlayoutAside.css("left"))<0){
              mdlayoutAside.css("left","0");
              mdlayoutMain.css("margin-left",this.asideWidth);
              $(".mdlayout-page .mdlayout-header-func .header-icon").css("display","none");
          }
        }
        this.$emit("showMastList",this);
        
      },
      // hide mdlayout-aside
      hideMdlayoutMasterList(){
        let mdlayoutAside=$(".mdlayout-aside");
        let mdlayoutMain=$(".mdlayout-main");
        
        let windowWidth = window.innerWidth ||((document.body) && (document.body.clientWidth)); // 窗口宽度
        if(mdlayoutAside && mdlayoutMain && windowWidth < 768){
          mdlayoutAside.css({"left":this.asideWidth*(-1)});
        }
      },
      //
      handleAsideWidth(){
        let winWidth=$(window).width();
        $(".mdlayout-aside").width(this.asideWidth);
        if(parseInt(winWidth)<768){
          $(".mdlayout-aside").css("left",this.asideWidth*(-1));
          $(".mdlayout-aside .ifbp-footer").css("left",this.asideWidth*(-1));
          $(".mdlayout-main").css("margin-left",0);
        }else{
          $(".mdlayout-aside").css("left",0);
          $(".mdlayout-aside .ifbp-footer").css("left",0);
          $(".mdlayout-main").css("margin-left",this.asideWidth);
        }
      },
      //
      toggleLeft(){
        // let winW=$(window).width()
        let mdlayoutAside=$(".mdlayout-aside");
        let mdlayoutMain=$(".mdlayout-main");
        if(mdlayoutAside && mdlayoutMain && mdlayoutAside<0){
            mdlayoutAside.css("left","0");
            mdlayoutMain.css("margin-left",this.asideWidth);
        }else{
            mdlayoutAside.css("left",this.asideWidth*(-1));
            mdlayoutMain.css("margin-left",0);
            $(".mdlayout-page .mdlayout-header-func .header-icon").css("display","block");
        }
      },
      requestListData(itemId,fn){
         console.log("loading data ..");
      }
    }
  };

</script>
<style>
  .mdlayout-wrapper{
    min-height:100%;
    height:auto;
    display:block;
    overflow: hidden;
    position: relative;
    background-color:#fff;
  }
  .mdlayout-wrapper::before,
  .mdlayout-wrapper::after{
    content: "";
    display: table;
  }

  .mdlayout-wrapper::after{
    clear: both;
  }
  .mdlayout-aside {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    border-right:1px solid #E6E6EB;
    transition: transform 0.3s ease-in-out, left 0.3s ease-in-out;
    background:white;
    z-index:2;
  }
  .mdlayout-main{ 
    transition: transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    background:white;
  }
  .mdlayout-aside-footer{
    z-index: 2;
    height: 3rem;
    line-height: 3rem;
    width: 100%;
    background: rgba(51,51,51,0.80);
    position: absolute;
    bottom:0;
    left:0;
  }
  /* 左侧样式 */
  .aside-title{
    height:47px;
    line-height:47px;
    font-weight: bold;
    text-indent:1rem;
    border-bottom:1px solid #E6E6EB;
  }
  .md-child-header{
    height: 47px;
    line-height:47px;    
    border-bottom: 1px solid #E6E6EB;
  }
  .md-header-func{
      font-size: 1rem;
      float: left;
      margin-top: 4px;
  }
  .md-header-func .header-icon{
      display: inline-block;
      font: normal normal normal 14px/1 FontAwesome;
      cursor: pointer;
      font-size: 18px;
      padding: 0 0 0 12px;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
  }
  .md-header-title{
      font-size: 16px;
      font-weight: 500;
      vertical-align: middle;
      color: #666666;
  }
  .md-child-section{
      width:100%;
      overflow:scroll;
  }
  .mdlayout-page{
    padding:0 !important;
  }
  .header-title .toggle-icon{
    float:right;
    cursor:pointer;
    color:#75787B;
  }
  .mdlayout-wrapper .ifbp-footer{
    position:absolute;
  }
  @media (max-width: 768px) {
    .mdlayout-aside .ifbp-footer{
      transition: transform 0.3s ease-in-out, left 0.3s ease-in-out;
    }
  }
  .zl-scrollBarBox{
      height:100%;
      position:absolute;
      background:#f3f3f3;
  }
  .zl-scrollBar{
      position:absolute;
      left:0;
      top:0;
      background:#848484;
      transition:background 0.3s;
  }
  .zl-scrollBar.zl-verticalBar{
      min-height:10px;
  }

  .zl-scrollBar.zl-horizontalBar{
      min-width:10px;
  }
  .zl-scrollBar:hover{
      background:#000;
  }
  .zl-scrollContentDiv{
      position:relative !important;
      width:100% !important;
      height:100% !important;
      padding:0 !important;
      margin:0 !important;
      top:0;
      left:0;
  }
</style>
