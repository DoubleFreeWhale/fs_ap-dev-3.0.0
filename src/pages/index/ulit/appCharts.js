// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/grid');
var barChart;
var lineChart;
var pieChart;
var this_ = Vue.prototype;
function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0),
    i = arr.length,
    min = i - count,
    temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
var colorData = ['#ff3b30', '#ff9500', '#ffcc00', '#00a753', '#5ac8fa', '#0089fa', '#5856d6', '#ff2d55'];
//柱状图的方法
var barCharts = function(item, id) {
  Vue.prototype.$http({
    url: item.chartUrl,
    type: 'GET',
    dataType: 'json',
  }).then((res) => {
    if (res.data.status === 1 || res.data.status === true) {
      var seriesData;
      var xData;
      Vue.prototype.$nextTick(() => {
        seriesData = res.data.data.seriesData;
        xData = res.data.data.xData;
        // if(!barChart) {
        //   return
        // }
        if(barChart) {
          barChart.dispose();
        }
        echarts.dispose(document.getElementById('appecharts_' + id));
        //柱状图

        window.barChart = echarts.init(document.getElementById('appecharts_' + id));
        // var xData = ['三月', '六月', '九月', '12月'];
        // var picType = 'bar';
        if (item.chartType === "cloumnChart") {
          picType = "bar";
        }

        if (seriesData && seriesData.length > 0) {
          for (var i = 0; i < seriesData.length; i++) {
            if (seriesData.length === 1) {
              seriesData[i].barWidth = '80%';
            }
            if (seriesData.length === 2) {
              seriesData[i].barWidth = '34%';
            }
            if (seriesData.length === 3) {
              seriesData[i].barWidth = '24%';
            }
            seriesData[i].type = picType;
            // seriesData[i].barWidth = 8;
          }
        }
        var colors = getRandomArrayElements(colorData, seriesData.length);
        this_.option = {
          grid: {
            y: 0,
            y2: 0,
            x: 0,
            x2: 0
          },
          color: colors,
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            position: function (pos, params, dom, rect, size) {
              let yPos = '20%';
              let xPos = 0;
              if (pos[0] < size.viewSize[0] / 2) {
                xPos = pos[0] + 10;
              } else {
                xPos = pos[0] - dom.offsetWidth - 10;
              }
              return [xPos, yPos];
            }
          },
          xAxis: [{
            type: 'category',
            show: false,
            data: xData,
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            show: false,
          }],
          series: seriesData
        };
        window.barChart.setOption(this_.option);
      });
    }
  }).catch(() => {
    Vue.prototype.$message({
      message: '图表信息获取失败',
      type: 'error'
    });
  });
};
// 折线图的方法
var lineCharts = function(item, id) {
  Vue.prototype.$http({
    url: item.chartUrl,
    type: 'GET',
    dataType: 'json',
  }).then((res) => {
    if (res.data.status === 1 || res.data.status === true) {
      var seriesData;
      var lineType ='line';
      var xData;
      Vue.prototype.$nextTick(() => {
        seriesData = res.data.data.seriesData;
        xData = res.data.data.xData;
        // seriesData = [{
        //   name: '离职',
        //   data: [10, 132, 501, 64, 900, 230]
        // }];
        if (item.chartType === "lineChart") {
          lineType = "line";
        }
        // xData = ["1月", "2月", "3月", "4月", "5月", "6月"];
        if (seriesData && seriesData.length > 0) {
          var lineColor = getRandomArrayElements(colorData, seriesData.length);
          for (var i = 0; i < seriesData.length; i++) {
            seriesData[i].type = lineType;
            seriesData[i].areaStyle = {
              normal: {
                color: lineColor[i]
              }
            };
            seriesData[i].lineStyle = {
              normal: {
                color: lineColor[i]
              }
            };
            seriesData[i].itemStyle = {
              normal: {
                color: lineColor[i]
              }
            };
          }
        }
        if(lineChart) {
          lineChart.dispose();
        }
        echarts.dispose(document.getElementById('appecharts_' + id));
        //折线图

        window.lineChart = echarts.init(document.getElementById('appecharts_' + id));
        // console.log(lineChart);
        this_.option = {
          // backgroundColor: "#c8c8cd",
          grid: {
            y: 0,
            y2: 0,
            x: -13,
            x2: -13
          },
          tooltip: {
            trigger: 'axis',
            position: function (pos, params, dom, rect, size) {
              let yPos = '20%';
              let xPos = 0;
              if (pos[0] < size.viewSize[0] / 2) {
                xPos = pos[0] + 10;
              } else {
                xPos = pos[0] - dom.offsetWidth - 10;
              }
              return [xPos, yPos];
            }
          },
          xAxis: [{
            type: 'category',
            // boundaryGap: false,
            data: xData,
            // color: '#c8c8cd',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }],
          yAxis: [{
            type: 'value',
            show: true,
            splitLine: {
              show: false
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ['#f0f0f5'],

              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }],
          series: seriesData
        };
        window.lineChart.setOption(this_.option);
      });
    }
  }).catch(() => {
    Vue.prototype.$message({
      message: '图表信息获取失败',
      type: 'error'
    })
  });
};
var pieCharts = function(item, id) {
  Vue.prototype.$http({
    url: item.chartUrl,
    type: 'GET',
    dataType: 'json',
  }).then((res) => {
    if (res.data.status === 1 || res.data.status === true) {
        Vue.prototype.$nextTick(() => {
        var seriesData = [];
        seriesData = res.data.data.seriesData;
        if(pieChart) {
          pieChart.dispose();
        }
        window.pieChart = echarts.init(document.getElementById('appecharts_' + id));
        var pieColorData = getRandomArrayElements(colorData, seriesData[0].data.length);
        if (seriesData && seriesData.length > 0) {
          for (var i = 0; i < seriesData.length; i++) {
            seriesData[i].type = "pie";
            seriesData[i].radius = ['50%', '90%'];
            seriesData[i].selectedOffset = 5;
            seriesData[i].hoverOffset = 3;
            // seriesData[i].
            seriesData[i].label = {
              normal: {
                textStyle: {
                  fontSize: 8
                }
              }
            };
            seriesData[i].labelLine = {
              normal: {
                show: true,
                length: 1,
                length2: 6,
                center: ['70%', '50%']
              }
            };

          }
        }
        this_.option = {
          color: pieColorData,
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c}",
            position: function (pos, params, dom, rect, size) {
              let yPos = '20%';
              let xPos = 0;
              if (pos[0] < size.viewSize[0] / 2) {
                xPos = pos[0] + 10;
              } else {
                xPos = pos[0] - dom.offsetWidth - 10;
              }
              return [xPos, yPos];
            },
            textStyle: {
              fontSize: 8
            }
          },
          series: seriesData
        };
        window.pieChart.setOption(this_.option);
      });
    }
  }).catch(() => {
    Vue.prototype.$message({
      message: '图表信息获取失败',
      type: 'error'
    })
  });
}
export default {
  barCharts: barCharts,
  lineCharts: lineCharts,
  getRandomArrayElements: getRandomArrayElements,
  pieCharts: pieCharts,
  barChart: barChart,
  lineChart: lineChart,
  pieChart: pieChart
}
