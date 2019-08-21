<template>
  <ifbp-page class="ifbp-tile-statements">

    <!-- 左侧树节点 -->
    <div class="tree-container" :class='{"multi-page":isMultiPage,"close":!showTree}'>
      <span @click="showTree = !showTree" class="flex-btn"><i :class='showTree?"ifbp-icon-angle-left":"ifbp-icon-angle-right"'></i></span>
      <ifbp-breadcrumb class="state-breadcrumb" :name="breadcrumbName"></ifbp-breadcrumb>
      <div class="tree-nav">
        <ul class="state-list" v-if="Array.isArray(treeArray) && treeArray.length">
          <li class="state-li" v-for="(column,index) in treeArray">
            <label :class="{'active':column.isCheck}" @click="labelClick(index)">
              <i class="hr-icon-folder-solid icon-folder"></i><span class="main-title">{{column.name}}</span>
              <i class="ifbp-icon-angle-up" v-if="column.isOpen"></i>
              <i class="ifbp-icon-angle-down" v-else></i>  
            </label>
            <el-collapse-transition>
              <dl v-if="Array.isArray(column.children) && column.children.length &&column.isOpen">
                <dd v-for="(childrenColumn,childrenIndex) in column.children" @click="treeClick(childrenColumn.pk_report,index,childrenIndex)" :class="{'active':column.isCheck&&childrenColumn.isChildrenCheck}">
                  <span>{{childrenColumn.name}}</span>
                </dd>
              </dl>
            </el-collapse-transition>
          </li>
        </ul>
      </div>
    </div>
    <!-- 右侧iframe -->
    <div class="statements-main-container" :class='{"close":!showTree}'>
      <div class="right-container">
        <iframe
          v-if="iframeUrl"
          class="statements-iframe"
          ref="iframe"
          :src="iframeUrl"
        ></iframe>
      </div>
    </div>
  </ifbp-page>
</template>
<script>
export default {
  data() {
    var funcode = window.vueInstance.$route.query.funcode;
    return {
      iframeUrl: null,
      iframeUrlShow:false,
      breadcrumbName: null,
      treeArray:null,
      treeProps: {
        id: 'id',
        pid: 'pid',
        label: 'label',
        children: 'children'
      },
      showTree: true,
      treeStructure:{},
      tilecode: window.vueInstance.$route.query.tilecode,
      isMultiPage:true
    };
  },
  watch:{
    $route(val, oldVal) {
      if(val.path=='/fbpdap/tileStatements'){
        this.tilecode = window.vueInstance.$route.query.tilecode;
        this.getTreeData();
      }
    },
    deep: true,
    immediate: true
  },
  created(){
    if($('header.header').height()<=64){
      this.isMultiPage=false;
    }
    this.getTreeData();
  },
  mounted() {
    let vm = this;
    window.onresize = () => {
      this.$nextTick(()=>{
        $('.ifbp-tile-statements .right-container').height(window.innerHeight-$('header.header').height());
      });
    }
  },
  methods: {
    // 获取树数据
    getTreeData() {
      // ajax 获取树数据
      const requestUrl = '/dap/reportbrowse/getreports?type=tile&code='+this.tilecode;
      this.$http.get(requestUrl).then(res => {
        if (res.data.status && res.data.reports.length>0) {
          let fotmated  = {
            'reportclass':res.data.reportclass,
            'reports':res.data.reports
          };
          // 树结构
          let reportData=res.data.reportclass;
          for (let parentValue of reportData) {
            let childrenArray=[];
            for (let childValue of res.data.reports) {
              if(childValue.pk_report_class==parentValue.pk_report_class){
                childrenArray.push(childValue);
              }
            }
            parentValue.children=childrenArray;
            parentValue.isOpen=true;
          }
          this.treeArray=reportData;
          this.$nextTick(()=>{
            $('.ifbp-tile-statements .right-container').height(window.innerHeight-$('header.header').height());
          });
          //2018.7.13
          if(this.treeArray && this.treeArray[0].children.length>0){
            this.treeClick(this.treeArray[0].children[0].pk_report,0,0);
          }
        }else if (res.data.error && res.data.error.errorMessage) {
          this.$message.error('信息获取失败: ' + res.data.error.errorMessage);
        }
      })
      .catch(() => {
        this.$message.error('请求失败');
      });
    },
    // 获取公钥
    getPublicKey() {},
    //获取iframeUrl
    getUrl(reportKey,nodeName){
      // ajax 获取 iframeUrl
      this.iframeUrl = null;
      const requestUrl = '/dap/reportbrowse/geturl?type=tile&code='+ this.tilecode+'&pk_report='+reportKey;
      this.$http.get(requestUrl).then(res => {
        if (res.data.status) {
          this.iframeUrlShow = true;
          this.iframeUrl = res.data.data;
        } else if (res.data.error && res.data.error.errorMessage) {
          this.$message.error('信息获取失败: ' + res.data.error.errorMessage);
        }
      })
      .catch(() => {
        this.$message.error('请求失败');
      });
    },
    //一级菜单点击
    labelClick(index){
      this.$set(this.treeArray[index],'isOpen',!this.treeArray[index].isOpen);
    },
    //二级菜单点击
    treeClick(pk_report,index,childrenIndex){
      this.treeArray.forEach((item,i)=>{
        if(index==i){
          this.$set(item,'isCheck',true);
        }else{
          this.$set(item,'isCheck',false);
        }
      });
      this.treeArray[index].children.forEach((item,i)=>{
        if(childrenIndex==i){
          this.$set(item,'isChildrenCheck',true);
        }else{
          this.$set(item,'isChildrenCheck',false);
        }
      });
      this.getUrl(pk_report);
    },
  }
}
</script>
<style>
  dl, dt, dd, ul, ol, li{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .state-breadcrumb .el-breadcrumb__item__inner{
    color: #2D2D2D;
    font-size: 16px;
  }
</style>
<style scoped>
  .statements-main-container {
    display: flex;
    flex: 1;
    margin: -24px 0 -16px 256px;
    height: calc(100% + 36px);
    transition: all  0.25s  ease-in;
    -moz-transition: all  0.25s  ease-in;
    -webkit-transition: all  0.25s  ease-in; 
  }
  .statements-main-container.close {
    margin: -24px 0 -24px 8px;
  }
  .tree-container {
    position: absolute;
    width: 256px;
    min-width:256px;
    left: 0;
    background: #fff;
    height: 100%;
    z-index: 10;
    top:auto;
    margin-top:24px;
    transition: all  0.25s  ease-in;
    -moz-transition: all  0.25s  ease-in;
    -webkit-transition: all  0.25s  ease-in; 
  }
  .tree-container.multi-page{
    margin-top:0;
  }
  .tree-container.close{
    left:-256px;
  }
  .tree-nav{
    position: absolute;
    width: 100%;  
    top: 67px;
    bottom:0;
    padding-bottom:32px;
    overflow: hidden;
  }
  .tree-nav .state-list{
    overflow: auto;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 64px;
  }
  .right-container{
    position: relative;
    min-width:800px;
    flex:1;
    flex-wrap: wrap;
  }
  .statements-iframe {
    flex: 1;
    width:100%;
  }
   /* 菜单样式 */
  .state-list .state-li{
    display: inline-block;
    min-width: 100%;
  }
  .state-list .state-li .ifbp-icon-angle-down,.state-list .state-li .ifbp-icon-angle-up{
    position: absolute;
    color: #8E8E93;
    vertical-align: sub;
    font-size: 24px;
    top:5px;
    right:24px;
    margin:0;
  }
  .state-list .state-li label:hover,.state-list .state-li dl dd:hover{
    cursor: pointer;
    background:#F0F5FA;
  }
  .state-list .state-li dl dd{
    color: #75787B;
    padding-left: 55px;
    display: inline-block;
    min-width: calc(100% - 55px);
  }
  .state-list .state-li dl dd:hover{
    color: #2d2d2d;
  }
  .state-list .state-li span{
    display: inline-block;
    min-width: 135px;
    line-height: 32px;
    font-size: 14px;
    box-sizing: border-box;
    padding-right: 5px;
    white-space:nowrap; 
    /* overflow:hidden;  */
    text-overflow:ellipsis; 
  }
  .state-list .state-li span.main-title{
    margin-right:24px;
  }
  .state-list .state-li label{
    position: relative;
    display: inline-block;
    color: #2D2D2D;
    font-weight: bold;
    padding: 0 24px;
    min-width: calc(100% - 48px);
  }
  .state-list .state-li .icon-folder{
    color: #75787B;
    font-size: 16px;
    vertical-align: text-bottom;
    margin: 0 16px 0 0;
  }
  .state-list .state-li label.active .icon-folder,.state-list .state-li label.active,.state-list .state-li dl dd.active{
    cursor: pointer;
    color: #5AC8FA;
  }
  .state-breadcrumb{
    margin-bottom: 0;
    border-bottom: 1px solid #F0F0F5;
    height: 18px;
    min-height: 18px;
    line-height: 18px;  
    padding: 18px 24px;
    margin-bottom:16px;
  }
  .ifbp-tile-statements .flex-btn{
    position: absolute;
    width: 16px;
    height: 80px;
    line-height:80px;
    background: #FFFFFF;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    left: 256px;
    top: calc(50% - 40px);
  }
  .ifbp-tile-statements .flex-btn:hover{
    background: #EAF9FF;
  }
  .ifbp-tile-statements .flex-btn i{
    font-size:16px;
    color:#8E8E93;
    vertical-align: -moz-middle-with-baseline;
  }
  .ifbp-tile-statements.main-panel{
    padding:0;
  }
</style>