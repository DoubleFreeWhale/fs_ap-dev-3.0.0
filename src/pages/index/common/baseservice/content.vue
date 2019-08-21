<template lang="html">
    <div class="">
        <!-- <div class="cardtitle-info" slot="media"> -->
        <div class="subtitle">{{appUrl.app_desc}}</div>
        <div class="icon-card" v-if="((!(appUrl.tileType === 'api')) && (!(appUrl.tileType === 'charts')))">
            <i :class="appUrl.appIcon + ' iconfont_form'" class="appIcon"
               v-if="(appUrl.iconContent==='') || (appUrl.iconContent === null)"></i>
            <img :src="'/ifbp-app-bd/bd/psn/psndoc/avatarImgDownLoad?avatar='+appUrl.iconContent" alt="" v-else>
        </div>
        <!-- <div class="charts-card" v-if="(appUrl.tileType === 'charts') && (!(appUrl.chartType === 'appProgress'))"> -->
        <div class="charts-card" :id="'appecharts_' + appUrl.id"
             v-if="(appUrl.tileType === 'charts') && (!(appUrl.chartType === 'appProgress')) && (appUrl.chartType !=='bulletChart') && (appUrl.chartType !=='arrowKpi')  ">
        </div>
        <!-- </div> -->
        <div class="pro-card"
             v-if="(appUrl.tileType === 'charts') && (!(appUrl.chartType === 'appProgress')) && (appUrl.chartType ==='bulletChart')">
            <ifbp-bullet-charts :bullet-data="bulletChartsData"></ifbp-bullet-charts>
        </div>
        <div class="pro-card" v-if="appUrl.chartType === 'appProgress'">
            <div class="" style="width:100%" v-if="isPercentage">
                <div class="pro-card-info" v-for="item in appProgressData">
                    <span>{{item.name}}</span>
                    <el-progress :id="'appPro_' + appUrl.id" :percentage="item.value" :stroke-width="4"></el-progress>
                </div>
            </div>
            <ifbp-tile-progress :tile-data="appProgressData" :tile-bar="4" v-if="!isPercentage"
                                style="width:100%"></ifbp-tile-progress>
        </div>
        <!-- <el-progress :id="'appPro_' + appUrl.id" :percentage="percentage" class="charts-card" v-if="appUrl.chartType === 'appProgress'" ></el-progress> -->
        <div class="api-card api" v-if="appUrl.tileType === 'api'">
            <span :class="apiColor" :id="'appApi_' +appUrl.id"></span>
            <span :class="apiColor +' '+'apiFont'" :id="'appApiUnit_'+ appUrl.id">{{appUrl.numberUnit}}</span>
            <!-- <span :class="apiColor" :id="'appApi_' +appUrl.id">{{appUrl.numberUnit}}</span> -->
        </div>
        <!-- <div class="arrow-api-card"  v-if="appUrl.chartType === 'arrowKpi'"> -->
        <ifbp-arrow-kpi :arrow-kpi-data="arrowKpiData" class="arrow-api-card"
                        v-if="appUrl.chartType === 'arrowKpi'"></ifbp-arrow-kpi>
        <!-- </div> -->
        <div class="card-footer"> {{appUrl.footer}}</div>
        <!-- </div> -->
    </div>

</template>
<script>
    import appCharts from '../../ulit/appCharts.js';
    var colorData = ['#ff3b30', '#ff9500', '#ffcc00', '#00a753', '#5ac8fa', '#0089fa', '#5856d6', '#ff2d55'];
    export default {
        name: 'appContent',
        data() {
            return {
                percentage: 0,
                apiColor: this.appUrl.numberColor,
                appProgressData: [],
                bulletChartsData: {},
                isPercentage: true,
                tileBar: 'top',
                arrowKpiData: {},
            }
        },
        props: ['appUrl'],
        methods: {
            //请求数值的数据
            requestNumber(item) {
                if (item && !item.numberUrl) {
                    return;
                }
                this.$http({
                    url: item.numberUrl,
                    type: 'GET',
                    dataType: 'json',
                }).then((res) => {

                    if (res.data.status === 1 || res.data.status === true) {
                        this.numberData = res.data.data.numberData;
                        switch (item.numberCondition) {
                            case 1: {
                                if (this.numberData > item.numberValue) {
                                    this.apiColor = item.numberConditionColor;
                                }
                            }
                                break;
                            case 2: {
                                if (this.numberData < item.numberValue) {
                                    this.apiColor = item.numberConditionColor;
                                }
                            }
                                break;
                            case 3: {
                                if (this.numberData === item.numberValue) {
                                    this.apiColor = item.numberConditionColor;
                                }
                            }
                                break;
                            case 4: {
                                if (this.numberData >= item.numberValue) {
                                    this.apiColor = item.numberConditionColor;
                                }
                            }
                                break;
                            case 5: {
                                if (this.numberData <= item.numberValue) {
                                    this.apiColor = item.numberConditionColor;
                                }
                            }
                                break;
                            default: {
                                this.apiColor = item.numberColor;
                            }
                        }
                        this.$nextTick(() => {
                            var myApi = document.getElementById('appApi_' + item.id);
                            var myApiUnit = document.getElementById('appApiUnit_' + item.id);
                            var myApiValue = document.getElementById('appApi_' + item.id).innerHTML;
                            myApi.innerHTML = this.numberData + myApiValue;
                            if (myApi.innerHTML) {
                                if (myApi.innerHTML.length > 5 && myApi.innerHTML.length < 20) {
                                    if (myApi.innerHTML.length > 5 && myApi.innerHTML.length < 7) {
                                        myApi.style.zoom = 0.9;
                                        myApiUnit.style.zoom = 0.9;
                                    }
                                    if (myApi.innerHTML.length >= 7 && myApi.innerHTML.length <= 9) {
                                        myApi.style.zoom = 0.6;
                                        myApiUnit.style.zoom = 0.6;
                                    }
                                    if (myApi.innerHTML.length > 10 && myApi.innerHTML.length < 13) {
                                        myApi.style.zoom = 0.5;
                                        myApiUnit.style.zoom = 0.5;
                                    }
                                    if (myApi.innerHTML.length >= 13 && myApi.innerHTML.length < 16) {
                                        myApi.style.zoom = 0.4;
                                        myApiUnit.style.zoom = 0.4;
                                    }
                                    if (myApi.innerHTML.length >= 16 && myApi.innerHTML.length < 17) {
                                        myApi.style.zoom = 0.37;
                                        myApiUnit.style.zoom = 0.37;
                                    }
                                    if (myApi.innerHTML.length >= 17 && myApi.innerHTML.length < 18) {
                                        myApi.style.zoom = 0.35;
                                        myApiUnit.style.zoom = 0.35;
                                    }
                                    if (myApi.innerHTML.length >= 18 && myApi.innerHTML.length < 19) {
                                        myApi.style.zoom = 0.32;
                                        myApiUnit.style.zoom = 0.32;
                                    }
                                    if (myApi.innerHTML.length >= 19) {
                                        myApi.parentNode.style.overflow = 'hidden';
                                        myApi.parentNode.style.textOverflow = 'ellipsis';
                                    }

                                }
                            }
                            console.log(myApi);
                        });
                    }
                }).catch((res) => {
                    console.log(res);
                    this.$message({
                        message: '获取api数据失败',
                        type: 'error'
                    });
                });
            },
            //带箭头的KPI请求数据
            requestArrowKpi(item) {
                this.$http({
                    url: item.chartUrl,
                    type: 'GET',
                    dataType: 'json',
                }).then((res) => {

                    if (res.data.status === 1 || res.data.status === true) {
                        this.$nextTick(() => {
                            this.arrowKpiData = res.data.data.arrowKpiData;
                            // this.arrowKpiData = {
                            //         "num": 4.5,
                            //         "unit": "K",
                            // };
                            if (this.arrowKpiData && this.arrowKpiData.num) {
                                if (this.arrowKpiData.num >= 0) {
                                    this.arrowKpiData.color = "red";
                                } else {
                                    this.arrowKpiData.color = "green";
                                }
                            }
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: '获取箭头图表数值失败',
                        type: 'error'
                    });
                });
            },
            //请求进度条的数值
            requestProgress(item) {

                // var vm = self || this;
                this.$http({
                    url: item.chartUrl,
                    type: 'GET',
                    dataType: 'json',
                }).then((res) => {
                    if (res.data.status === 1 || res.data.status === true) {

                        this.appProgressData = res.data.data;
                        this.isPercentage = res.data.isPercentage;
                        // if(this.isPercentage === true) {
                        //   this.
                        // }
                        console.log(this.appProgressData);
                        // this.$nextTick(() => {
                        //   var myProgress = document.getElementById('appPro_' + item.id);
                        //   var myAttr=myProgress.getAttribute('percentage');
                        //   console.log("aaaa" +myProgress);
                        // });
                    }
                }).catch(() => {
                    this.$message({
                        message: '获取进度条数据失败',
                        type: 'error'
                    });
                });
            },
            requestBulletCharts(item) {
                this.$http({
                    url: item.chartUrl,
                    type: 'GET',
                    dataType: 'json',
                }).then((res) => {
                    if (res.data.status === 1 || res.data.status === true) {
                        var bulletData;
                        this.$nextTick(() => {
                            bulletData = res.data.bulletData;
                            //  bulletData =  {
                            //   maxValue: 1000,
                            //   expectedValue: 700,
                            //   targetValue: 300,
                            //   unit: "个",
                            //   color:"red"
                            // },
                            bulletData.color = appCharts.getRandomArrayElements(colorData, 1);
                            this.bulletChartsData = bulletData;
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: '图表信息获取失败',
                        type: 'error'
                    })
                });
            },
            setAppletOption(val) {
                if (val.tileType === "charts" && val.chartType !== 'appProgress' && val.chartType === "cloumnChart") {
                    appCharts.barCharts(val);
                }
                if (val.tileType === "charts" && val.chartType !== 'appProgress' && val.chartType === "lineChart") {

                    appCharts.lineCharts(val);
                }
                if (val.tileType === "charts" && val.chartType !== 'appProgress' && val.chartType === "pieChart") {
                    appCharts.pieCharts(val);
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
                    this.requestNumber(val);
                }
            }
        },
        watch: {
            appUrl(val) {
                this.setAppletOption(val);
            }
        },
        mounted() {
            this.setAppletOption(this.appUrl);
        },
        created() {

        }

    }
</script>

<style lang="css">
</style>
