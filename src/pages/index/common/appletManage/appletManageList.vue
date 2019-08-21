<template lang="html">
  <ifbp-page>
    <!-- 面包屑 -->
    <ifbp-breadcrumb name="磁贴管理"></ifbp-breadcrumb>
    <!-- 按钮区 -->
    <ifbp-button-area>
        <el-button type="primary" class="legacy" @click="addApplet">新增</el-button>
        <!-- 查询模板组件 -->
        <ifbp-search  class="fr"
          :template-code="searchCode"
          @search="handleSearch">
        </ifbp-search>
    </ifbp-button-area>
    <!-- 主区域 -->
    <ifbp-main-area type="list">
      <div class="ifbp-btn-line">
        <div class="fr">
          <i class="ifbp-icon-setting"  @click="showHeaderSetting" title="设置"></i>
        </div>
      </div>

      <ifbp-template
                    ref="appletList"
                    tpl-id="appletListId"
                    :pk-temp="appletListPk"
                    :table-show-menu="false"
                    :tpl-data="appletListData"
                    show-type="table"
                    :methods="appletListMethods"
                    :tpl-reset-fun="appletListResetFun"
                    @table-click="appletListClick"
                    @tplisok="tplisok"
                    >
      </ifbp-template>
      <el-pagination
        id="applet-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
      <ifbp-del-dialog
        v-model="delDialogVisible"
        message="确认删除该数据？删除后无法恢复。"
        @click="deleteClick"
        >
      </ifbp-del-dialog>
    </ifbp-main-area>
  </ifbp-page>
</template>
<script>
export default {
  data() {
    let vm = this;
    return {
      searchCode: 'APPLET_SEARCH',
      searchData: {},
      // appOptions: [],
      appGroupOptions:[],
      arr: [],
      appletListData: {
        appletAreaOptions:[],
        appGroupOptions:[],
      },
      appletListPk: '0001PP1000000020ABCD',
      areaId: '',
      groupId: '',
      totalCount: 0,
      pageNum: 1,
      pageSize: 10,
      appletListResetFun: function($node) {
        var $table = this.getTableDom($node);
        var operateHtml = this.getTableOperateHtml([{title: "授权",icon: "grant"},{title: "编辑",icon: "edit"},{title: "删除",icon: "delete"}]);
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },
      delDialogVisible: false,
      delId: '',
      delTs:'',
      appletListMethods: {

      }
    };
  },
  methods: {
    tplisok(){
      console.log(123)
      // this.appletListRequest();
    },
    ifbpPageInit: function () {
      this.appletListRequest();
    },
    //请求数据的方法
    appletListRequest() {
      let data;
      data = {
        areaId: this.areaId,
        groupId: this.groupId,
        pageNum: this.pageNum || 0,
        pageSize: this.pageSize || 10,
        qtAggVO: '',
      };
      if(Object.keys(this.searchData).length !== 0){
        data.qtAggVO = JSON.stringify(this.searchData);
      }
      var url = '/baseapp/appMGT/pagingList';
      this.$http({
        method: 'post',
        url: url,
        dataType: 'json',
        data: data
      }).then((res) => {
        if(res.data.status === 1){
          let resData = res.data.data.content;
          this.$nextTick(() => {
            this.$refs.appletList.setData("appletAreaOptions", this.arr);
            this.$refs.appletList.setData("appGroupOptions", this.appGroupOptions);
            if(this.$refs.appletList) {
              this.$refs.appletList.setTableData(resData);
            } else {
              this.$set(this.appletListData, 'uitemplateTableData',resData);
            }
            this.totalCount = res.data.data.totalElements ;       // 总条数
            this.pageSize = res.data.data.size;
          });
        }else{
          this.$message({
            message: res.data.msg,
            type: 'error'
            });
        }
      }).catch(() => {
        this.$message({
          message: '列表信息获取失败',
          type: 'error'
        });
      });
    },
    appletListClick(icon, scope) {
      if(icon === 'edit') {
        this.$router.push("/applet/manage/detail/"+ scope.row.id);
      }
      if(icon === 'delete') {
        this.delDialogVisible = true;
        this.delId = scope.row.id;
        this.delTs = scope.row.ts;
      }
      if(icon === 'grant') {
        this.$router.push("/applet/manage/grant/"+ scope.row.id);
      }
    },
    //删除方法
    deleteClick() {
      this.$http({
        url: "/baseapp/appMGT/delete/" + this.delId + '?ts='+ this.delTs,
        method: 'get',
        dataType: 'json',
        contentType: 'application/json',
      }).then((res) => {
        if (res.data.success === true) {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.delDialogVisible = false;
          this.appletListRequest();
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
        this.delDialogVisible = false;
      }).catch(() => {
        this.$message({
          message: 'Network error',
          type: 'error'
        });
      });
    },
    //新增磁贴的方法
    addApplet() {
      this.$router.push("/applet/manage/add");
    },
    //搜索方法
    handleSearch(searchData) {
      this.pageNum = 1;
      this.searchData = searchData;
      this.appletListRequest();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.appletListRequest();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.appletListRequest();
    },
    loadList(){
      this.$http({
        url: '/baseapp/moduleMGT/listWithGroup',
        type: 'GET',
        dataType: 'json',
        // data: data,
      }).then((res) => {
        if(res.data.status == 1){
          this.arr = [];
          for (var i = 0; i < res.data.data.length; i++) {
            this.arr.push(res.data.data[i].area);
            this.arr[i].label = res.data.data[i].area.areaName;
            this.arr[i].value = res.data.data[i].area.id;
            this.appGroupOptions = this.appGroupOptions.concat(res.data.data[i].group);
          }
          for (var i = 0; i < this.appGroupOptions.length; i++) {
            this.appGroupOptions[i].label = this.appGroupOptions[i].name;
            this.appGroupOptions[i].value = this.appGroupOptions[i].id;
          }
          this.appletListRequest();
        }else{
          this.$message({
            message: res.data.msg,
            type: 'error'
            });
        }
      }).catch(() => {
        this.$message({
          message: '信息获取失败',
          type: 'error'
        });
      });
    },
    showHeaderSetting() {
      this.$refs.appletList.setTransferVisible(true);
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.loadList();
    })
  },
  created() {

  }
}
</script>

<style lang="css">
</style>
