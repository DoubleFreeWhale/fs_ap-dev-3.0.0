<template>
  <div class="card-page">
      <!-- <draggable v-model="list"@start="drag=true" @end="drag=false"> -->
        <div class="cardInfo">
         <div class="card-box-outer" v-for="(item, index) in list" :key="index">
           <header class="card-name">
             {{item.groupName}}
           </header>
           <app-tile v-for="(child, index) in item.appList" :key="index" :child="child"
                     @jumpRoute="jumpRoute(child.path, child)"></app-tile>

         </div>
         </div>
      <!-- </draggable> -->
    </div>
</template>

<script>

import appContent from './content.vue';
import APMAllList from '../apmMock/apmAllList.js';
import DPAllList from '../dpMock/dpAllList.js';
import appTile from '../appletManage/appTile.vue';



export default {
  data() {
    return {
      list: [],                       //  领域分组选择框
      groupList: [],                  //  二次菜单
      selectList: [],                 //  磁贴分组
      allList: [],                    //  全部应用
      arr: [],                        //  磁贴选择框
      value: '全部领域',
      groupValue: '选择分组',
      routeName: null,
      listChildren: null,
      options:'',
      numberData:'',
      percentage:0,
      scrollTop:0
    };
  },
  props:['menuList'],
  components: {
    // draggable,
    appContent,
    appTile
  },
  methods: {

    request(){

    },
    requestMenu(){
      this.value = '全部领域';
      this.groupList = [];
      this.selectList = [];
      this.arr = [];
      this.allList = [];
      const path = this.$route.path;
      const name = path.substring(1);
      var  url;
      var type;
      // if (this.$route.path.indexOf('appArea') > 0) {
      if(this.$context.getPlatform() === 'ifbp'){
        url = '/baseapp/appMGT/allApp';
      }else {
        url = '/wbalone/wbapp/allApp';
      }
        type = 'apparea';

        if (window.isAPM) {          
          console.log('apm apps list: ', APMAllList.data);
          this.requestMenuCallback(APMAllList.data);
          return;
        }
        if (window.isDP) {
          console.log('dp apps list: ', DPAllList.data);
          this.requestMenuCallback(DPAllList.data);
          return;
        }
        this.$http({
          url: url,
          method: 'get'
        }).then((data) => {
          if(data.data.success){
            this.requestMenuCallback(data.data.data);
          }
        });

      // });   get login
    },
    requestMenuCallback(dataList) {      
      var self = this;
      self.list = dataList;
      let localStorage = window.ifbpLocalCache || window.localStorage;
      for (var i = 0; i < self.list.length; i++) {
        for (var j = 0; j < self.list[i].appList.length; j++) {
                  var item = self.list[i].appList[j];
                  var path = item.path;
                  var urltype = item.urltype || '';
                  if (urltype == 'view'){
                    item.path = '/lgc/$wbalone$data:layout$' + path;
                    item.path = '/ovp?path=' + path;
                   }else if (urltype == 'url' && path.indexOf('/ifr') != 0 &&　path.indexOf('/lgc') != 0){
                     path = path.replace(/\//g, '$');
                     path = path.replace(/#/g, '+');
                     item.path = '/ifr/' + path;
                   }
                }
      }

      localStorage.setItem(name, JSON.stringify(this.groupList));
    },

    //页面走缓存时 会触发此方法
    ifbpPageInit(){
      let localStorage = window.ifbpLocalCache || window.localStorage;
    	var scrollTopAppArea = localStorage.getItem("scrollTopAppArea");
    	if(scrollTopAppArea || scrollTopAppArea == 0){       		
    		this.$nextTick(()=>{

    			 $("#main-right").scrollTop(scrollTopAppArea);
    		})
    	}else{
    		$("#main-right").scrollTop(this.scrollTop);
    	}
    },
    jumpRoute(path,item){
    	//对 应用中心处理  下次进来时默认滚动到上次退出的位置
      //获取当前滚动条的位置
      this.scrollTop =  $("#main-right").scrollTop();
      //TODO 临时处理，后面要考虑磁贴点击时以新浏览器页签打开
      if (path == '/ifr/pd'){
        window.open(window.location.protocol + '//' + window.location.host + '/pd');
        return;
      }
      var tmp;
      if(path.indexOf("http://") !== -1){
        tmp= '/third?url='+path;
      }else{
        tmp=path;
      }
		 if(this.$context.getPlatform() == "fbp"){
			window.vueInstance.$children[0].openNewFun(tmp, item);
		}else{
			window.vueInstance.$children[0].addEditableTabs(tmp, item);
		}
      // this.$router.push(tmp);
    }
  },
   watch: {
   },
  created(){
    $('#main-right').attr('is-reload','');
    //隐藏组织结构
    // $('#main-right').find('div#organization_page').css('display','none');
    this.requestMenu();
  },
  mounted(){
		let scrollTop = window.vueInstance && window.vueInstance.scrollTop ? window.vueInstance && window.vueInstance.scrollTop :0;
		document.getElementsByClassName("view")[0].scrollTop = this.scrollTop;
		if(scrollTop){
				var show  = false;
				var interval = setInterval(function(){
				if(document.getElementsByClassName("view")[0].scrollTop == scrollTop){
					 show = true;
				}
				document.getElementsByClassName("view")[0].scrollTop = scrollTop;
				if(show){
					clearInterval(interval);
				}
			}, 50);
		}
  }

};
</script>

<style>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .image {
    width: 50%;
    display: block;
    margin: 0 auto;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
  .dragCard {
    position: relative;
    overflow: hidden;
  }
  .cardInfo {
    margin: 0 66px 80px 66px;
  }
  .card-box {
    display: inline-block;
  }
  .card-name {
    font-size: 18px;
    color: #2D2D2D;
    position: relative;
    display: block;
    line-height: 18px;
    margin: 32px 0 8px 24px;
    box-shadow: none;
  }
  .appIcon.iconfont_form {
    /*color: #9adfef;*/
    font-size: 32px;
    vertical-align: middle;
  }
  /*p.appTitle{
    font-size: 18px;
    font-weight: 400;
    line-height: 30px;
    margin: 20px 30px 0;
  }*/
  .content-black header.card-name{
    color:#fff;
  }
  #main-right .view.card-page,.contnet-header-black #main-right .view.card-page{
    background: none;
  }
</style>
