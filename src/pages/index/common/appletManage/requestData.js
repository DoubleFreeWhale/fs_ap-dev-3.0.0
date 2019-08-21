export default {
  data() {
    return {
      bulletChartsData:{},
      arrowKpiData : {},
      numberData: '',
      isPercentage: true,
      appProgressData:[]
    };
  },
  methods: {
    //请求进度条的数值
    requestProgress(item) { 
      var vm = self || this;
      this.$http({
        url: item.chartUrl,
        type: 'GET',
        dataType: 'json',
      }).then((res) => {
        if (res.data.status === 1 || res.data.status === true) {

          this.appProgressData = res.data.data;

          this.isPercentage = res.data.isPercentage;

          console.log(this.appProgressData);

        }
      }).catch(() => {
        // this.$message({
        //   message: '获取进度条数据失败',
        //   type: 'error'
        // });
      });
    },
    requestNumber(item,id) {
      this.$http({
        url: item.numberUrl,
        type: 'GET',
        dataType: 'json',
      }).then((res) => {

        if (res.data.status === 1 || res.data.status === true) {
          this.numberData = res.data.data.numberData;
          // this.numberData = 185;
          this.$nextTick(() => {
            var myApi = document.getElementById('appApi_' + id);
            var myApiUnit = document.getElementById('appApiUnit_' + id);
            if(myApi) {
              // var myApiValue = myApi ? myApi.innerHTML : '';
              myApi.innerHTML = this.numberData ;
            }

            if(myApi.innerHTML) {
              if(myApi.innerHTML.length > 5 && myApi.innerHTML.length < 20) {
                if(myApi.innerHTML.length > 5 && myApi.innerHTML.length < 7) {
                  myApi.style.zoom = 0.9;
                  myApiUnit.style.zoom = 0.9;
                }
                if(myApi.innerHTML.length >= 7 && myApi.innerHTML.length <=9) {
                  myApi.style.zoom = 0.6;
                  myApiUnit.style.zoom = 0.6;
                }
                if(myApi.innerHTML.length >10 && myApi.innerHTML.length <13) {
                  myApi.style.zoom = 0.5;
                  myApiUnit.style.zoom = 0.5;
                }
                if(myApi.innerHTML.length >=13 && myApi.innerHTML.length <16) {
                  myApi.style.zoom = 0.4;
                  myApiUnit.style.zoom = 0.4;
                }
                if(myApi.innerHTML.length >=16 && myApi.innerHTML.length <17) {
                  myApi.style.zoom = 0.37;
                  myApiUnit.style.zoom = 0.37;
                }
                if(myApi.innerHTML.length >=17 && myApi.innerHTML.length <18) {
                  myApi.style.zoom = 0.35;
                  myApiUnit.style.zoom = 0.35;
                }
                if(myApi.innerHTML.length >=18 && myApi.innerHTML.length <19) {
                  myApi.style.zoom = 0.32;
                  myApiUnit.style.zoom = 0.32;
                }
                if(myApi.innerHTML.length >=19 ) {
                  myApi.parentNode.style.overflow = 'hidden';
                  myApi.parentNode.style.textOverflow = 'ellipsis';
                }

              }
            }
      //       console.log(myApi);
          });
        }
      }).catch((res) => {
        console.log(res);
        // this.$message({
        //   message: '获取api数据失败',
        //   type: 'error'
        // });
      });
    },
    requestArrowKpi(item) {
      this.$http({
        url: item.chartUrl,
        type: 'GET',
        dataType: 'json',
      }).then((res) => {
        if (res.data.status === 1 || res.data.status === true) {
          this.$nextTick(() => {
            this.arrowKpiData = res.data.data.arrowKpiData;

            if(this.arrowKpiData && this.arrowKpiData.num) {
              if(this.arrowKpiData.num >=0) {
                this.arrowKpiData.color= "red";
              } else {
                this.arrowKpiData.color= "green";
              }
            }
          });
        }
      }).catch(() => {

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

            this.bulletChartsData = bulletData;
          });
        }
      }).catch(() => {
        // this.$message({
        //   message: '图表信息获取失败',
        //   type: 'error'
        // })
      });
    },

  },
  watch: {

  },
  mounted() {

  }
}
