/** 
 *  处理列表页面中Table高度的Mixins; 
 *  
*/
export default{
  data(){
      return{
          advancePanelH:0,
          otherHeight:0
      }
  },
  mounted(){
      this.handleTableHeight();
      this.$eventBus.$on('windowResize',()=>{
          this.handleTableHeight(this.advancePanelH);
      });
  },
  beforeDestroy(){
  this.$eventBus.$off("windowResize");
},
  methods:{
      //计算tBody的高度;
      handleTableHeight(searchPanelH){
          var searchPanelH=searchPanelH ||0;
          var mainRightH = window.vueInstance["$children"][0].mainRightHeight;
          var tableH=mainRightH - this.otherHeight - searchPanelH;
          this.resetTableHeight(tableH);
      },
      //点击高级搜索切换时,重新计算高度;
      toggleSearchPanel(obj){
          setTimeout(()=>{
              var searchPanelH=0;
              if(obj){
                  var advanceSearchPanel=obj.$refs["searchPanel"];
                  searchPanelH=advanceSearchPanel.clientHeight+advanceSearchPanel.clientTop;
                  this.advancePanelH=searchPanelH;
              }
              this.handleTableHeight(searchPanelH);
          },100)
      }
  }

}
