export default {
  data() {
    return {
      isfirstChat: true,
      leftData: [], // 左半边显示内容
      rightData: [], // 右半边显示内容
      finalData: [],
      styleChartsData: [], // 暂存图表数组
      styleNoChartsData: [], // 暂存非图表类型的icon/api
      // styleChartsData2: {},
      styleIconData: {},
      styleApiData: {},

    };
  },
  methods: {
    getData2() {
      if(this.child && this.child.contents && this.child.contents.length > 0 ){
        this.styleIconData ={};
        this.styleChartsData = [];
        this.styleApiData = {};
        this.styleNoChartsData = [];
        this.rightData = [];
        this.leftData = [];
        this.finalData = [];
        for (var i = 0; i < this.child.contents.length; i++) {
          if(i === 0){
            this.isfirstChat = this.child.contents[i].tileType === "charts";
          }
          if((this.child.contents[i].tileType === "fontIcon" || this.child.contents[i].tileType === "imgIcon") && !this.styleIconData.tileType ){
            this.styleIconData = this.child.contents[i];
            this.styleNoChartsData.push(this.styleIconData);
          }
          if((this.child.contents[i].tileType === "charts") && this.styleChartsData.length < 2){
            this.styleChartsData.push(this.child.contents[i]);
          }
          if((this.child.contents[i].tileType === "api") && !this.styleApiData.tileType ){
            this.styleApiData = this.child.contents[i];
            this.styleNoChartsData.push(this.styleApiData);
          }
        }
          if(this.styleChartsData.length === 2) {
            this.rightData.push(this.styleChartsData[0]);
            this.leftData.push(this.styleChartsData[1]);
          } else if(this.styleChartsData.length === 1){
            if(this.isfirstChat) {
              this.rightData.push(this.styleChartsData[0]);
              this.leftData = this.styleNoChartsData;
            } else {
              this.leftData.push(this.styleChartsData[0]);
              this.rightData = this.styleNoChartsData;
            }
          } else {
            this.rightData = this.styleNoChartsData;
          }
          this.finalData.push(this.rightData);
          this.finalData.push(this.leftData);
        // console.log("11111",this.styleIconData);
        // console.log(this.styleChartsData);
        // console.log(this.styleApiData);
        // console.log('finalData',this.finalData);
        // console.log('rightData',this.rightData);
        // console.log('leftData',this.leftData);
      }
    }
  },
  mounted() {


  },


}
