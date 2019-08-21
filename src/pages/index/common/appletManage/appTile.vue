<template lang="html">
  <div class="card-box">
    <el-tile
             :title="child.appName"
             size="sm"
             class="tile"
             @click.native="jumpRoute(child.path, child) ||''"
             :cardStyle="getAppletStyle(child)"
             >
             <!--<div class="card-subtitle" slot="media">-->
               <!--{{child.appDesc}}-->
             <!--</div>-->
             <div class="app-card-info" slot="media" v-if="(child.styleType === '1*1')">
               <div class="" v-if="(Array.isArray(child.contents) && child.contents.length)">
                 <!-- 图标处理 -->
                   <div class="icon-card" v-show="((!(child.contents[0].tileType === 'api')) && (!(child.contents[0].tileType === 'charts')))">
                     <i :class="child.contents[0].appIcon + ' iconfont_form'" class="appIcon" :style="{color:child.contents[0].appIconColor}" v-if="child.contents[0].tileType === 'fontIcon'"></i>
                     <img :src="isShowIfbpImg+child.contents[0].iconContent" alt=""  v-if="child.contents[0].tileType !== 'fontIcon'&& child.contents[0].tileType === 'imgIcon'">
                   </div>
                   <!-- 图表为柱状,折线,饼图处理 -->
                   <div class="charts-card" :id="'appecharts_' + (child.contents[0].id||child.contents[0].pk)" v-show="(child.contents[0].tileType === 'charts') && (!(child.contents[0].chartType === 'appProgress')) && (child.contents[0].chartType !=='bulletChart') && (child.contents[0].chartType !=='arrowKpi')  ">
                   </div>
                   <!-- 图表为子弹图的处理 -->
                   <div class="pro-card" v-if="(child.contents[0].tileType === 'charts') && (!(child.contents[0].chartType === 'appProgress')) && (child.contents[0].chartType ==='bulletChart')">
                     <ifbp-bullet-charts  :bullet-data="bulletChartsData"></ifbp-bullet-charts>
                   </div>
                   <!-- 图表为带箭头的api处理 -->
                   <ifbp-arrow-kpi :arrow-kpi-data="arrowKpiData" class="arrow-api-card" v-if="child.contents[0].chartType === 'arrowKpi'"></ifbp-arrow-kpi>
                   <!-- 图表为数值的处理 -->
                   <div class="api-card api"  v-if="child.contents[0].tileType === 'api'">
                     <div>
                       <span :style="{color:child.contents[0].numberColor}" :id="'appApi_' +(child.contents[0].id || child.contents[0].pk) "></span>
                       <span :style="{color:child.contents[0].numberColor}"class="apiFont" :id="'appApiUnit_'+ child.contents[0].id || child.contents[0].pk">{{child.contents[0].numberUnit}}</span>
                       <div class="card-footer" slot="media" v-if="child.footerType==='content'"> {{child.footer}}</div>
                       <div class="card-footer" :id="'footer'+(item2.id || item2.pk)" slot="media" v-if="child.footerType==='url'"></div>
                     </div>
                  </div>
                   <!-- 图表为进度条的处理 -->
                   <div  class="pro-card" v-if="child.contents[0].chartType === 'appProgress'" >
                     <div class="" style="width:100%;height:60px" v-if="isPercentage">
                       <div class="pro-card-info" v-for="item in appProgressData" >
                         <span>{{item.name}}</span>
                         <el-progress :id="'appPro_' + (child.contents[0].id || child.contents[0].pk)" :percentage="item.value" :stroke-width="4"></el-progress>
                       </div>
                     </div>
                       <ifbp-tile-progress :tile-data="appProgressData" :tile-bar="4" v-if="!isPercentage" style="width:100%;height:60px"></ifbp-tile-progress>
                   </div>
               </div>

             </div>
             <div class="app-card-info" slot="media" v-if="(child.styleType === '2*1')">
               <div :class="[index == 0 ? 'right' : 'left', leftData.length !== 0 && rightData.length !== 0 ? 'dubble-style' : 'single-style']" v-for="(item, index) in finalData">
                 <div :class="{'nochart': item2.tileType !== 'charts' && item.length == 2}" v-for="item2 in item">
                   <!-- 图标处理 -->
                   <div class="icon-card" v-if="((!(item2.tileType === 'api')) && (!(item2.tileType === 'charts')))">
                     <i :class="item2.appIcon + ' iconfont_form'" class="appIcon" v-if="item2.tileType === 'fontIcon'"></i>
                     <img :src="isShowIfbpImg+item2.iconContent" alt="" v-if="(child.contents[0].tileType !== 'fontIcon') && (child.contents[0].tileType === 'imgIcon')">
                   </div>
                   <!-- 图表为柱状,折线,饼图处理 -->
                   <div class="charts-card" :id="'appecharts_' + (item2.id || item2.pk)" v-show="(item2.tileType === 'charts') && (!(item2.chartType === 'appProgress')) && (item2.chartType !=='bulletChart') && (item2.chartType !=='arrowKpi')  ">
                   </div>
                   <!-- 图表为子弹图的处理 -->
                   <div class="pro-card" v-if="(item2.tileType === 'charts') && (!(item2.chartType === 'appProgress')) && (item2.chartType ==='bulletChart')">
                     <ifbp-bullet-charts  :bullet-data="bulletChartsData"></ifbp-bullet-charts>
                   </div>
                   <!-- 图表为带箭头的api处理 -->
                   <ifbp-arrow-kpi :arrow-kpi-data="arrowKpiData" class="arrow-api-card" v-if="item2.chartType === 'arrowKpi'"></ifbp-arrow-kpi>
                   <!-- 图表为数值的处理 -->
                   <div class="api-card api"  v-if="item2.tileType === 'api'">
                     <span :style="{color:item2.numberColor}" :id="'appApi_' + (item2.id || item2.pk)"></span>
                     <span :style="{color:item2.numberColor}"class="apiFont" :id="'appApiUnit_'+ (item2.id || item2.pk)">{{item2.numberUnit}}</span>
                   </div>
                   <!-- 图表为进度条的处理 -->
                   <div  class="pro-card" v-if="item2.chartType === 'appProgress'" >
                     <div class="" style="width:100%;height:100px" v-if="isPercentage">
                       <div class="pro-card-info" v-for="item in appProgressData" >
                         <span>{{item.name}}</span>
                         <el-progress :id="'appPro_' + (item2.id || item2.pk)" :percentage="item.value" :stroke-width="4"></el-progress>
                       </div>
                     </div>
                       <ifbp-tile-progress :tile-data="appProgressData" :tile-bar="4" v-if="!isPercentage" style="width:100%;height:100px"></ifbp-tile-progress>
                   </div>
                 </div>
               </div>
             </div>
    </el-tile>
  </div>
</template>

<script>
import appCharts from '../../ulit/appCharts.js';
import requestData from './requestData.js';
import appStyle from './style2.js';
var colorData = ['#ff3b30', '#ff9500', '#ffcc00', '#00a753', '#5ac8fa', '#0089fa', '#5856d6', '#ff2d55'];
export default {
  props:['child'],
  mixins: [requestData, appStyle, appCharts],
  data() {
   return {
     // child: {
     //   id:'aff771',
     //   appName: 'ovp开发',
     //   path:'',
     //   styleType: '2*1',
     //   desc: 'ovp开发ovp开发ovp开发ovp开发ovp开发ovp开发ovp开发ovp开发ovp开发ovp开发',
     //   footer: '123',
     //   contents: [
         // {
         //   "id": '1',
         //   "tileType": "charts",
         //   "chartType": "cloumnChart",
         //   "chartUrl": "",
         //   "appIcon": "",
         //   "numberUrl":"",
         //   "numberUnit":"",
         //   "numberColor":"",
         //   "iconContent":"",
         // },
         // {
         //   "id": '2',
         //   "tileType": "charts",
         //   "chartType": "lineChart",
         //   "chartUrl": "",
         //   "appIcon": "",
         //   "numberUrl":"",
         //   "numberUnit":"",
         //   "numberColor":"",
         //   "iconContent":"",
         // },
         // {
         //   "id": '3',
         //   "tileType": "charts",
         //   "chartType": "pieCharts",
         //   "chartUrl": "",
         //   "appIcon": "",
         //   "numberUrl":"",
         //   "numberUnit":"",
         //   "numberColor":"",
         //   "iconContent":"",
         // },
     //     {
     //       "id": '4',
     //       "tileType": "fontIcon",
     //       "chartType": "",
     //       "chartUrl": "",
     //       "appIcon": "iconfont ifbp-icon-edit light-blue",
     //       "numberUrl":"",
     //       "numberUnit":"",
     //       "numberColor":"",
     //       "iconContent":"",
     //       "appIconColor":""
     //     },
     //     {
     //       "id": '5',
     //       "tileType": "imgIcon",
     //       "chartType": "",
     //       "chartUrl": "",
     //       "appIcon": "iconfont ifbp-icon-edit light-blue",
     //       "numberUrl":"",
     //       "numberUnit":"",
     //       "numberColor":"",
     //       "iconContent":"",
     //       "appIconColor":""
     //     },
     //     {
     //       "id": '6',
     //       "tileType": "api",
     //       "chartType": "",
     //       "appIcon": "",
     //       "chartUrl":"",
     //       "numberUrl":"/test",
     //       "numberUnit":"",
     //       "numberColor":"",
     //       "iconContent":"",
     //       "appIconColor":""
     //     },
     //     {
     //       "id": '7',
     //       "tileType": "api",
     //       "chartType": "",
     //       "appIcon": "",
     //       "chartUrl":"",
     //       "numberUrl":"/test1",
     //       "numberUnit":"",
     //       "numberColor":"",
     //       "iconContent":"",
     //       "appIconColor":""
     //     }
     //   ],
     //
     // },
     cardStyle1: {
       cursor: 'pointer',
       width: '146px',
       height: '146px',
       fontSize: '16px'
     },
     cardStyle2: {
       cursor: 'pointer',
       width: '308px',
       height: '146px',
       fontSize: '16px'
     },
     isShowIfbpImg:''
     // bulletChartsData:{},
     // arrowKpiData : {},
     // numberData: '',
     // isPercentage: true,
     // appProgressData:[]
   };
  },
  methods: {
    // 磁贴样式赋值
    getAppletStyle (child) {
      let cardStyle;
      let cardStyleData1;
      let cardStyleData2;
      if(child.styleType === '1*1') {
        cardStyleData1 = JSON.parse(JSON.stringify(this.cardStyle1));
        if(child.backgroundImg !== null && child.backgroundImg !== "") {
          // cardStyleData1.backgroundImage = 'url('+this.isShowIfbpImg+child.backgroundImg+')';
          cardStyleData1.backgroundImage = 'url('+this.isShowIfbpImg+child.backgroundImg+')';
          cardStyleData1.backgroundSize = '100% 100%';
          cardStyleData1.backgroundRepeat = 'no-repeat';
          cardStyleData1.color = "#fff";
        }
        cardStyle = cardStyleData1;
      } else if(child.styleType === '2*1'){
        cardStyleData2 = JSON.parse(JSON.stringify(this.cardStyle2));
        if(child.backgroundImg !== null && child.backgroundImg !== "") {
          // cardStyleData2.backgroundImage = 'url('+this.isShowIfbpImg+child.backgroundImg+')';
          cardStyleData2.backgroundImage = 'url('+this.isShowIfbpImg+child.id+')';
          cardStyleData2.backgroundSize = '100% 100%';
          cardStyleData2.backgroundRepeat = 'no-repeat';
          cardStyleData2.color = "#fff";
        }
        cardStyle = cardStyleData2;
      }
      return cardStyle;
    },
    //路由跳转处理
    jumpRoute(path, child) {
      this.$emit('jumpRoute',path, child);
    },
    //页脚处理
    requestFooter(item) {
      this.$http({
        url: item.footerUrl,
        type: 'GET',
        dataType: 'json',
      }).then((res) => {

        if (res.data.status === 1 || res.data.status === true) {
          this.$nextTick(() => {
            var a = item.id || item.pk;
            var myFooter = document.getElementById('footer' + a);
            myFooter.innerHTML = res.data.footerData;
          });
        }
      }).catch(() => {
        this.$message({
          message: '获取footer数值失败',
          type: 'error'
        });
      });
    },
    //处理各种请求
    setAppletOption(val, valId) {
      if(val.tileType) {
        if (val.tileType === "charts" && val.chartType !== 'appProgress' && val.chartType === "cloumnChart") {
          appCharts.barCharts(val, valId);
        }
        if (val.tileType === "charts" && val.chartType !== 'appProgress' && val.chartType === "lineChart") {
          appCharts.lineCharts(val, valId);
        }
        if (val.tileType === "charts" && val.chartType !== 'appProgress' && val.chartType === "pieChart") {
          appCharts.pieCharts(val, valId);
        }
        if (val.tileType === "charts" && val.chartType !== 'appProgress' && val.chartType === "bulletChart") {
          this.requestBulletCharts(val);
        }
        if (val.tileType === "charts" && val.chartType !== 'appProgress' && val.chartType === "arrowKpi") {
          this.requestArrowKpi(val);
        }
        if (val.tileType === "charts" && val.chartType === 'appProgress') {
          this.requestProgress(val);
        }
        if (val.tileType === "api") {
          this.requestNumber(val, valId);
        }
      }

    }

  },
  watch: {
    child(val) {
      this.getData2();
      var newArr = [];
      this.$nextTick(() => {
        if(window.lineChart) {
          window.lineChart.dispose();
        }
        if(window.pieChart) {
          window.pieChart.dispose();
        }
        if(window.barChart) {
          window.barChart.dispose();
        }
        if(val.styleType === '1*1') {

          // console.log(val);
          if(Array.isArray(val.contents) && val.contents.length>0 && val.contents[0].tileType) {
            var b = val.contents[0].id || val.contents[0].pk;
            this.setAppletOption(val.contents[0],b);
          }
        } else if(val.styleType === '2*1'){

          newArr = [...this.finalData[0], ...this.finalData[1]];
          for(var i = 0; i < newArr.length; i++) {
            if(newArr[i]) {
              var c = newArr[i].id || newArr[i].pk
              this.setAppletOption(newArr[i], c);
            }
          }
        }
      });

    }
  },
  mounted() {
      this.isShowIfbpImg = '/baseapp/appMGT/iconDownload?app_img_id=';
    // this.setAppletOption(this.child.contents[0], this.child);
    // console.log(this.child);

    this.getData2();
    // console.log('ssss',this.finalData);
    // this.$nextTick(() => {
      var newArr = [];
      if (!this.child) {
        return;
      }
      if(this.child.footerType === "url") {
        this.requestFooter(child);
      }
      if(this.child.styleType === '1*1') {

        if(Array.isArray(this.child.contents) && this.child.contents.length>0 && this.child.contents[0].tileType) {
          var a= this.child.contents[0].id || this.child.contents[0].pk
          this.setAppletOption(this.child.contents[0],a);
        }
      } else if(this.child.styleType === '2*1') {
        newArr = [...this.finalData[0], ...this.finalData[1]];
        for(var i = 0; i < newArr.length; i++) {

          if(newArr[i]) {
            var c = newArr[i].id || newArr[i].pk
            this.setAppletOption(newArr[i], c);
          }
        }
      }
    // });

  },

}
</script>
<style>
  .card-box > .card {
  padding: 16px !important;
  box-shadow: none;
  margin: 14px 0 0 16px !important;
  border: 1px solid transparent;
    border-radius: 12px;
}
.card:hover {
  border: 1px solid #6bcaea;
  cursor: pointer;
  background-color: #e9f7fc;
}
.card-box .card-title {
  font-size: 16px;
  font-weight: normal;
  line-height: 16px;
  color: #333;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.card-box .card-subtitle {
  margin-top: 4px;
  font-size: 14px;
  text-align: left;
  font-weight: normal;
  line-height: 20px;
  height:40px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
   /* autoprefixer: off */
  -webkit-box-orient: vertical;
   /* autoprefixer: on */
  color: #666;
}
.card-box .app-card-info {
  text-align: right;
  height:60px;
  margin-top: 4px;
  color:#333;
}
.card-box .icon-card {
  text-align: right;
  height:94px;
  position: relative;
  /*line-height: 60px;*/
}
  .icon-card .appIcon.iconfont_form{
    position: absolute;
    right: 0px;
    bottom: 0px;
  }

.icon-card img {
  width: 32px;
  height: 32px;
  vertical-align: middle;
}
.appIcon.iconfont_form {
  /*color: #9adfef;*/
  font-size: 32px;
  vertical-align: middle;
}
.charts-card{
  height: 94px;
  text-align: left;
  line-height: 94px;
}
.pro-card{
  height: 94px;
  text-align: left;
  font-size: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
}
.pro-card span {
  font-size: 12px !important;
}
.pro-card-info {
  height: 20px !important;
}
.pro-card .el-progress{
  line-height: 0 !important;
  height: 4px;
  margin: -6px 0 -2px 0;
}
.api-card{
  height: 94px;
  line-height: 94px;
  width: 114px;
  text-align: center;
  /* overflow: hidden; */
  white-space: nowrap;
  /* text-overflow: ellipsis; */
}
.api-card>div{
  line-height: 1;
  display: inline-block;
  vertical-align: middle;
}
.api-card span{
  font-size: 36px;
}
.api span {
  font-weight: 300;
}
.api .apiFont {
font-size: 20px;
}
/* 2*1的样式 */
.dubble-style {
  width: 44.3%;
  display: inline-block;
  /* padding: 0px 10px; */
  box-sizing:  border-box;
  vertical-align: middle;
  float: right;
}
.dubble-style.right {
  margin-left: 18px;
}
.dubble-style.left {
  margin-right: 18px;
}
.single-style {
  width: 100%;
  /* display: inline-block; */
  padding: 0px 0px;
  box-sizing:  border-box;
  vertical-align: middle;
  float: right;
}
.dubble-style .nochart,
.single-style .nochart{
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.dubble-style .nochart .api-card,
.single-style .nochart .api-card {
  width: 100% !important;
}
.card-footer {
  /*text-align: right;*/
  color:#666;
  font-size: 10px;
  line-height: 16px;
  margin-top: 4px;
}

</style>
