<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="磁贴授权"></ifbp-breadcrumb>
    <ifbp-button-area>
      <el-button type="primary" @click="checkAll">全选</el-button>
      <el-button type="primary" @click="changeFan">反选</el-button>
      <el-button type="primary" @click="showGrandsonPage">选择新增</el-button>
      <el-button type="primary" @click="update">更新</el-button>
      <el-button type="primary" @click="multiDelete">删除</el-button>
    </ifbp-button-area>

    <!--磁贴授权功能-->
    <ifbp-main-area type="list">
      <ifbp-panel id="pageExpenseAccount" title="已授权功能" :main-title="true">
        <div class="func_box_list">
          <div class="func_box" v-for="(item, index) in list" @click="checkClick(item, $event)">
            <el-row>
              <el-col :span="4" class="func_box_col_pl_10">
                <el-checkbox v-model="item.checked" @change="checkboxChange(item)"></el-checkbox>
              </el-col>
              <el-col :span="20" align="middle">
                <div class="func_box_col_title">{{item.app_func_id?item.beanMap.app_func_id_ref[item.app_func_id]?item.beanMap.app_func_id_ref[item.app_func_id].name:'':''}}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" align="middle">
                  <span>
                    <i class="iconfont icon-tablelayout cyan func_box_icon" ></i>
                  </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20" class="func_box_col_pl_10">
                <template v-if="modeMap[item.app_func_id]">
                  <el-checkbox v-if="modeMap[item.app_func_id].globe" v-model="item.f_global" class="func_box_col_ml_0" label="全局"></el-checkbox>
                  <el-checkbox v-if="modeMap[item.app_func_id].group" v-model="item.f_group" class="func_box_col_ml_0" label="集团"></el-checkbox>
                  <el-checkbox v-if="modeMap[item.app_func_id].org" v-model="item.f_org" class="func_box_col_ml_0" label="组织"></el-checkbox>
                </template>
              </el-col>
              <el-col :span="4" class="func_box_col_fr">
                <el-button @click="del(index, item)" type="primary" class="func_box_btn"  icon="delete" size="mini"></el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </ifbp-panel>
    </ifbp-main-area>
    <!-- <div> -->
      <!--分页组件-->
      <!--<el-pagination-->
        <!--@size-change="handleSizeChange"-->
        <!--@current-change="handleCurrentChange"-->
        <!--:current-page="currentPage"-->
        <!--:page-sizes="[10, 20, 30, 40]"-->
        <!--:page-size="size"-->
        <!--layout="total, sizes, prev, pager, next, jumper"-->
        <!--:total="totalElements">-->
      <!--</el-pagination>-->
    <!-- </div> -->
  <!--<ifbp-grandson-page-->
    <!--ref="grandsonPage"-->
    <!--title="未授权功能"-->
    <!--width="1000"-->
    <!--:modal="funModal"-->
    <!--@close="handleClose">-->
    <el-dialog title="分配功能"
               :visible="addDialogVisible"
               @close="handleClose"
               size="large"
               @update:visible="val => addDialogVisible = val"
    >
    <ifbp-button-area>
      <el-button @click="checkAllDialog">全选</el-button>
      <el-button @click="fanCheckAllDialog">反选</el-button>
      <div class="search-panel fr">
      </div>
      <div class="advanced-search-panel advanced-search-panel-pb-0"
           :class="{
            'without-btns': searchOnSelect
          }"
      >
        <el-row>
          <el-col :span="8">
            <div>
              <el-ref
                ref-code="appgroupref"
                :field="field"  
                :template-value="refTemplateValue"
                @change="refChange"
              >
              </el-ref>
            </div>
          </el-col>
          <el-col :span="8"><div></div></el-col>
          <el-col :span="8"><div></div></el-col>
        </el-row>
      </div>
      
    </ifbp-button-area>

    <div class="list-main-container clearfix list-mtpt-0">
      <!--磁贴授权功能-->
      <div class="func_box_list">
        <div class="func_box" v-for="(item, index) in unrelatedList" @click="checkDialogClick(item, $event)">
          <el-row>
            <el-col :span="4" class="func_box_col_pl_10">
              <el-checkbox v-model="item.checked" @change="checkDialogChange(item)"></el-checkbox>
            </el-col>
            <el-col :span="20" align="middle">
              <div class="func_box_col_title">{{item.app_func_id?item.beanMap.app_func_id_ref[item.app_func_id]?item.beanMap.app_func_id_ref[item.app_func_id].name:'':''}}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" align="middle">
              <span>
                <i class="iconfont icon-tablelayout cyan func_box_icon" ></i>
              </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" class="func_box_col_pl_10">
              <template v-if="modeMap[item.app_func_id]">
                <el-checkbox v-if="modeMap[item.app_func_id].globe" v-model="item.f_global" class="func_box_col_ml_0" label="全局"></el-checkbox>
                <el-checkbox v-if="modeMap[item.app_func_id].group" v-model="item.f_group" class="func_box_col_ml_0" label="集团"></el-checkbox>
                <el-checkbox v-if="modeMap[item.app_func_id].org" v-model="item.f_org" class="func_box_col_ml_0" label="组织"></el-checkbox>
              </template>
            </el-col>
            <el-col :span="4" >
              <div class="func_col_empty_div"></div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmClick">保 存</el-button>
    </span>
    </el-dialog>
  </ifbp-page>
</template>
<script>
  export default {
    data(){
      let id = this.$root.$router.currentRoute.params.id;
      return {
        id: id,
        field: 'id',
        refTemplateValue: {
            beanMap: {
              app_groups_id_ref: {}
            },
            app_groups_id: ''
          },
        checkedAll: false,
        checkedAllDialog: false,
        checkCount: 0,
        checkDialogCount: 0,
        addDialogVisible: false,
        dialogVisible: false,
        list: '',//已授权数据
        modeMap: '',//管控模式数据
        unrelatedList: '',
        unModeMap: '',

        totalElements: 0,
        currentPage: 1,
        size: 10,
        dialogWidth: '80%',

        isHide: false,
        form:{},
        proValueFunc:'',
        appletGroupsValueFunc:'',
        appOptionsFunc2:[],
        func_class_id: '',
        input1:'',
        modclass: 'mdclass',
        // 搜索面板显示
        funModal: true,
        panelShown: false,
        searchOnSelect: false,
      };
    },
    mounted(){
      this.requestList();
    },
    methods:{
      refChange(data){
        if(data){
          this.func_class_id = data.value[0].id;//app_groups_id
          this.requestDialog();
        }

      },
      // 翻页标签改变每页显示数据
      handleSizeChange(val) {
        this.requestList(1, val);
      },

      // 翻页标签改变当前页
      handleCurrentChange(val) {
        this.requestList(val, this.size);
      },
      requestList(n, s) {
        if(!this.id) {
          return;
        }
        var url;
        var search =
          '&keyword=&search_LIKE_code=&search_LIKE_name=' +
          '&search_LIKE_enable_state=';
        if (n === undefined) {
          url = '/baseapp/appMGT/pagingListByApp/related?app_apps_id='
            + this.id +  '&pn=1&ps=10&sortColumn=' + search;
        } else {
          url = '/baseapp/appMGT/pagingListByApp/related?app_apps_id='
            + this.id +  '&pn=' + n + '&ps=' + s + search;
        }
        this.$http({
          url: url,
          method: 'get',
          dataType: 'json'
        }).then((res) => {
          this.originalValue = res.data.data.relations;
          this.originalValue.forEach((i) => {
            var node = i;
            node.checked = false;
          });
          this.list = JSON.parse(JSON.stringify(this.originalValue));
          this.originalValue = res.data.data.modemap;
          this.modeMap = JSON.parse(JSON.stringify(this.originalValue));
          this.checkedAll = false;
          this.checkCount = 0;
        }).catch(() => {
          this.$message({
            message: '信息获取失败',
            type: 'error'
          });
        });
      },
      update(){
        var funArr = [];
        this.list.forEach((item) => {
          if(item.checked === true){
            var option = JSON.parse(JSON.stringify(item));
            funArr.push(option);
          }
        });

        if(funArr.length === 0){
          this.$message({
            message: '请选择关联功能',
            type: 'error'
          });
          return;
        }
        const url= '/baseapp/appMGT/relations/update';
        this.$http({
          url: url,
          method: 'post',
          data: funArr
        }).then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });

            this.requestList();
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        }).catch(() => {
          this.$message({
            message: '授权失败',
            type: 'error'
          });
        });
      },
      del:function(index, row){
        var checkArr = [row];
        checkArr.push(row);
//      alert(JSON.stringify(checkArr));
        const url= '/baseapp/appMGT/relations/delete/';
        this.$http({
          url: url,
          method: 'post',
          data: checkArr
        }).then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.list.splice(index, 1);
            if(row && row.checked){
              this.checkCount = this.checkCount - 1;
            }
            if(this.checkCount === this.list.length){
              this.checkedAll = true;
            } else {
              this.checkedAll = false;
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        }).catch(() => {
          this.$message({
            message: '授权失败',
            type: 'error'
          });
        });
      },
      multiDelete(){
        var unCheckArr = [];
        var checkArr = [];
        this.list.forEach((item) => {
          if(item.checked){
            checkArr.push(item);
          }else {
            unCheckArr.push(item);
          }
        });
//      alert(JSON.stringify(arr));
//      alert(JSON.stringify(funArr));
        if(checkArr.length === 0){
          this.$message({
            message: '请选择关联功能',
            type: 'error'
          });
          return;
        }
        const url= '/baseapp/appMGT/relations/delete/';
        this.$http({
          url: url,
          method: 'post',
          data: checkArr
        }).then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.list = JSON.parse(JSON.stringify(unCheckArr));
            this.checkCount = 0;
            this.checkedAll = false;
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        }).catch(() => {
          this.$message({
            message: '授权失败',
            type: 'error'
          });
        });
      },

      //dialog
      requestDialog(n, s) {
        var url;
        var search =
          '&keyword=&search_LIKE_code=&search_LIKE_name=&search_LIKE_enable_state=';
        if (n === undefined) {
          url = '/baseapp/appMGT/pagingListByApp/unrelated?app_apps_id=' + this.id +  '&func_class_id=' + this.func_class_id + '&pn=1&ps=10&sortColumn=' + search;
        } else {
          url = '/baseapp/appMGT/pagingListByApp/unrelated?app_apps_id=' + this.id +  '&func_class_id=' + this.func_class_id + '&pn=' + n + '&ps=' + s + search;
        }
        this.$http({
          url: url,
          method: 'get',
          dataType: 'json'
        }).then((res) => {
          this.originalValue = res.data.data.relations;
          this.originalValue.forEach((i) => {
            var node = i;
            node.checked = false;
          });
          this.unrelatedList = JSON.parse(JSON.stringify(this.originalValue));
          this.originalValue = res.data.data.modemap;
          this.unModeMap = JSON.parse(JSON.stringify(this.originalValue));
          this.checkedAllDialog = false;
          this.checkDialogCount = 0;
        })
          .catch(() => {
            this.$message({
              message: '信息获取失败',
              type: 'error'
            });
          });
      },
      openDialogClick: function() {

        if(!this.id) {
          this.$message({
            message: '先新增磁贴',
            type: 'error'
          });
          return;
        }
        this.requestDialog();
        // this.unrelatedList = [];
        this.addDialogVisible = true;
      },
      confirmClick(){
        var funArr = [];
        var unCheck = [];
        this.unrelatedList.forEach((i) => {
          var func = JSON.parse(JSON.stringify(i));
          if(i.checked === true){
            func.app_apps_id = this.id;
            funArr.push(func);
          }else {
            unCheck.push(func);
          }
        });

        const url= '/baseapp/appMGT/relations/create';
        this.$http({
          url: url,
          method: 'post',
          data: funArr
        }).then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.unrelatedList = unCheck;
            this.checkedAllDialog = false;
            this.checkDialogCount = 0;
            this.addDialogVisible = false;
            this.requestList();
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        }).catch(() => {
          this.$message({
            message: '授权失败',
            type: 'error'
          });
        });
      },

      //dialog search
      showSearch() {
        this.isHide = !this.isHide;
      },

      loadListFunc(){
        this.$http({
          url: '/baseapp/appArea/listWithGroup',
          type: 'GET',
          dataType: 'json',
        }).then((res) => {
          for (let i = 0; i < res.data.data.length; i++) {
            this.arr.push(res.data.data[i].area);
            var forGroup = res.data.data[i].group;
            if(forGroup){
              for(var j = 0; j < forGroup.length; j++){
                this.appOptionsFunc.push(forGroup[j]);
              }
            }
          }
          this.proOptionsFunc = [{
            systypename: "全部分组",
            moduleid: ""
          }].concat(this.arr);
        }).catch(() => {
          this.$message({
            message: '信息获取失败',
            type: 'error'
          });
        });
      },
      appChangeFunc(val) {
        this.appOptionsFunc2 = [{
          areaId: "",
          groupIndex: 1,
          id: "",
          name: "选择分组"
        }].concat(this.appDetailOptions.filter(item => (item.areaId === val)));
        this.appletGroupsValueFunc = '';
      },
      appletChangeFunc(val){
        if(val){
          this.func_class_id = val;//app_groups_id
          this.requestDialog();
        }
      },
      checkClick: function(i, event){
        var checkboxLength = $(event.target).closest('.el-checkbox').length;
        var operateColumnLength = $(event.target).closest('.el-button').length;
        if(checkboxLength >= 1 || operateColumnLength >= 1){
          return;
        }else {
          var item = i;
          item.checked = !i.checked;
          this.ctrCheckedAll(item);
        }
      },
      checkboxChange:function(item){
        this.ctrCheckedAll(item);
      },
      ctrCheckedAll:function(item){
        if(item){
          if(item.checked){
            this.checkCount = this.checkCount + 1;
          }else {
            this.checkCount = this.checkCount - 1;
          }
        }

        if(this.checkCount === this.list.length){
          this.checkedAll = true;
        } else {
          this.checkedAll = false;
        }
      },
      checkAll(){
        this.list.forEach((i) => {
          var func = i;
          func.checked = true;
        });
        if(this.checkedAll) {
          this.checkCount = this.list.length;
        } else {
          this.checkCount = 0;
        }
      },
      changeFan(){
        this.list.forEach((i) => {
          var func = i;
          func.checked = !i.checked;
        });
        this.checkCount = this.list.length - this.checkCount;
        this.ctrCheckedAll();
      },

      //dialog
      checkDialogClick: function(i, event){
        var checkboxLength = $(event.target).closest('.el-checkbox').length;
        if(checkboxLength >= 1){
          return;
        }else {
          var item = i;
          item.checked = !i.checked;
          this.ctrCheckedDialogAll(item);
        }
      },
      checkDialogChange(item){
        this.ctrCheckedDialogAll(item);
      },
      ctrCheckedDialogAll(item){
        if(item){
          if(item.checked){
            this.checkDialogCount = this.checkDialogCount + 1;
          }else {
            this.checkDialogCount = this.checkDialogCount - 1;
          }
        }

        if(this.checkDialogCount === this.unrelatedList.length){
          this.checkedAllDialog = true;
        } else {
          this.checkedAllDialog = false;
        }
      },
      checkAllDialog(){
        var vm = this;
        this.unrelatedList.forEach((i) => {
          var func = i;
          func.checked = true;
        });
        if(this.checkedAllDialog) {
          this.checkDialogCount = this.unrelatedList.length;
        } else {
          this.checkDialogCount = 0;
        }
      },
      fanCheckAllDialog(){
        this.unrelatedList.forEach((i) => {
          var func = i;
          func.checked = !i.checked;
        });
        this.checkDialogCount = this.unrelatedList.length - this.checkDialogCount;
        this.ctrCheckedDialogAll();
      },
      handleClose(){
        this.requestList();
      },
      showGrandsonPage(){
        if(!this.id) {
          this.$message({
            message: '磁贴不存在',
            type: 'error'
          });
          return;
        }
        this.addDialogVisible = true;
        this.requestDialog();
      },
    }
  };

</script>

<style scoped="scope">
  .advanced-search-panel-pb-0{
    padding-bottom: 16px;
  }
  .list-mtpt-0 {
    margin-top: 0px;
    padding-top: 0px;
    height:300px;
    overflow:auto;
  }
  .func_box_list .func_box{
    margin-right: 10px;
    width: 220px;
    background-color: #e9f7fc;
    border-radius: 4px;
    display: inline-block;
    cursor: pointer;
  }
  .func_box_list .func_box .func_box_col_pl_10{
    padding-left: 10px;
  }
  .func_box_list .func_box .func_box_col_ml_0{
    margin-left: 0px;
  }
  .func_box_list .func_box .func_box_col_title{
    width:150px;
    overflow:hidden;
    text-overflow:ellipsis;
    line-height:32px !important;
    white-space:nowrap;
    color:#666;
    font-weight:normal;
  }

  .func_box_list .func_box .func_box_icon{
    font-size:40px;
  }
  .func_box_list .func_box .func_box_btn{
    float:right;
    margin-right:10px;
    min-width:28px;
    height:28px;
    margin-bottom: 5px;
  }
  .func_box_list .func_box .func_box_col_fr{
    float: right;
  }
  .func_box_list .func_box .func_col_empty_div{
    height:33px;
    width:100%;
  }
</style>
