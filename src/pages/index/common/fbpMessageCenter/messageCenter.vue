<template>
  <ifbp-page>
    <ifbp-breadcrumb name="消息中心"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area>
        <el-button type="primary" @click="addBtn">新建</el-button>
        <el-button type="primary" @click="receive">接收</el-button>
        <el-button type="primary" @click="answerMsg" v-show="showRowButton">回复</el-button>
        <el-button type="primary" @click="forwardMsg" v-show="showRowButton">转发</el-button>
        <el-button @click="multiSetRead" v-show="showDeleteButton">标记为已读</el-button>
        <el-button @click="multiDeleteDialgShow" v-show="showDeleteButton">删除</el-button>
       <!--&lt;!&ndash; 查询模板组件 &ndash;&gt;-->
      <ifbp-search
        class="fr"
        ref="searchRef"
        conditions-before-advance="4"
        :search-template="searchData"
        :template-code="searchCode"
        @search="handleSearch">
      </ifbp-search>
    </ifbp-button-area>
    <!-- 主体区域 -->
    <ifbp-main-area type="list">
    <!-- <div class="list-main-container clearfix"> -->
      <!-- UI模板组件 -->
      <ifbp-template ref="tableRef"
                    tpl-id="tableId"
                    :pk-temp="tablePkTemp"
                    :tpl-data="tableData"
                    show-type="table"
                    :methods="tableMethods"
                    :tplResetFun="tableResetFun"
                    highlight-current-row="true"
                    @row-click="tableRowClick"
                    @selection-change="tableSelectionChange">
      </ifbp-template>
      <!--分页组件-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements"
        >
      </el-pagination>
    </ifbp-main-area>
    <!-- </div> -->

    <!--删除确认Dialog-->
    <ifbp-del-dialog
      v-model="delDialogVisible"
      message="确认删除该数据？删除后无法恢复。"
      @click="deleteClick"
      >
    </ifbp-del-dialog>
    <ifbp-del-dialog
      v-model="multiDelDialogVisible"
      message="确认删除所选数据？删除后无法恢复。"
      @click="multiDeleteClick"
      >
    </ifbp-del-dialog>
  </ifbp-page>
</template>
<script>
export default {
  data() {
    var vm = this;
    return {
      listUrl: '/baseapp/messagecenter/pagelist',
      boxUrl: '/baseapp/messagecenter/msgbox',
      setReadUrl: '/baseapp/messagecenter/batchread',
      batchDeleteUrl: '/baseapp/messagecenter/batchdelete',
      // 查询模板传入参数
      searchCode: "messageSearch",
//      searchCode: "messageInput",
      searchData: null,
      boxList: [],
      msgtypeList: [],
      //查询区域字段
      selectedbox: {},
      pk_msgboxl: '',
      boxcode: 'receive',
      typecode: '',
      day: '',
      keyword: '',
      ishandle: false,

      // UI模板传入参数
      tablePkTemp: '0001AA100000002L46B6',
      tableData: {},
      tableMethods: {
        tableEditClick: function(scope) {
          vm.$router.push('/messageDetail/' + scope.row.pk_message);
        },
        tableDelClick: function(scope) {
          vm.delDialogVisible = true;
          vm.delRow = scope.row;
        },
      },
      tableResetFun: function($node) {
        // 增加默认的新增删除按钮
        var $table = this.getTableDom($node);
        var baseOperateArr = [
//          {
//            title: "查看",
//            click: "tableEditClick",
//            icon: "view"
//          },
          {
            title: "删除",
            click: "tableDelClick",
            icon: "delete"
          }];
        var operateHtml = this.getTableOperateHtml(baseOperateArr);
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },

      // 分页组件传入参数
      totalElements: 0,
      currentPage: 1,
      size: 10,
      // 是否显示批量删除按钮
      showRowButton: false,
      // 是否显示表行操作按钮
      showDeleteButton: false,
      // 是否显示删除dialog
      delDialogVisible: false,
      multiDelDialogVisible: false
    };
  },
  created() {
//    this.request();
//    console.log(JSON.stringify(this.boxList));
//    console.log(JSON.stringify(this.msgtypeList));

  },
  mounted(){
    this.request();
    this.requestBox();
    this.setConditionListDefaultSelect();
  },
  methods: {
    // 请求数据
    request(curPage, size) {
      var data = {
        type: 'app',
        pageNum: curPage || 1,
        pageSize: size || this.size,
        boxcode: this.boxcode,
        from: this.typecode,
        senddate: this.day,
        keyword: this.keyword,
        ishandle: this.ishandle,
        searchData: this.searchData ? JSON.stringify(this.searchData): null,
      };
      console.log(JSON.stringify(data));

//      if (pn === undefined) {
//        url = "/ifbp-app-sm/sm/messageCenter/pageList?timePeriod=" + this.day + "&type="+this.type+"&messageType=" + this.read + "&pn=1&ps=5&title_creator=" + this.keyword;
//      } else {
//        url = "/ifbp-app-sm/sm/messageCenter/pageList?timePeriod=" + this.day + "&type="+this.type+"&messageType=" + this.read + "&pn=" + pn + "&ps=5&title_creator=" + this.keyword;
//      }
//      url = "/ifbp-app-sm/sm/messageCenter/pageList";

      this.$http({
        url: this.listUrl,
        method: "post",
        data: data,
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json"
      })
        .then(res => {
          this.$refs.tableRef.setTableData(res.data.data.content);
          this.totalElements = res.data.data.totalElements;
//          this.size = res.data.data.size;
        })
        .catch(() => {
          this.$message({
            message: "信息获取失败",
            type: "error"
          });
        });
    },

    requestBox() {
      this.$http({
        url: this.boxUrl,
        method: "get",
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json"
      })
        .then(res => {
          if(res.data.success){
            this.boxList = res.data.data;
            for(var i = 0; i < this.boxList.length; i++ ){
              var item = this.boxList[i];
              if(item.boxcode === this.boxcode){
                this.msgtypeList = item.msgtypes;
                this.pk_msgboxl = item.pk_msgboxl;
                break;
              }
            }
          }
        })
        .catch((e) => {
          this.$message({
            message: "信息获取失败1" + e,
            type: "error"
          });
        });
    },

    handleIconClick() {
      this.request();
    },
    msgBoxClick(item, e){
      var ta=e.currentTarget;
      var children = ta.parentNode.children;
      for (let i = 0; i < children.length; i++) {
        $(children[i]).removeClass("active1");
      }
      $(ta).addClass("active1");
      //重置到全部选项
      $('#allpkmsgtype').siblings().removeClass("active1");
      $('#allpkmsgtype').addClass("active1");
      $('#all').addClass("active1");
      if(item){
        this.selectedbox = item;
        this.boxcode = item.boxcode;
        this.pk_msgboxl = item.pk_msgboxl;
        this.msgtypeList = item.msgtypes;
      }else {
        this.boxcode = this.selectedbox.boxcode;
        this.pk_msgboxl = '';
        this.msgtypeList = this.selectedbox.msgtypes;
      }
      this.typecode = '';
      this.request();

    },
    msgBoxTypeClick(item,e){
      var ta=e.currentTarget;
      var children = ta.parentNode.children;
      for (let i = 0; i < children.length; i++) {
        $(children[i]).removeClass("active1");
      }
      $(ta).addClass("active1");
      //重置到全部选项
      $('#allpkmsgtype').siblings().removeClass("active1");
      $('#allpkmsgtype').addClass("active1");
      this.boxcode = item.boxcode;
      this.msgtypeList = item.msgtypes;
      this.typecode = '';
      this.request();
    },
    selectPkMsgType(typecode, e){
      var ta=e.currentTarget;
      var children = ta.parentNode.children;
      for (let i = 0; i < children.length; i++) {
        $(children[i]).removeClass("active1");
      }
      $(ta).addClass("active1");
      this.typecode = typecode;
      this.request();
    },
    querydaysData(day, event) {
      var target = event.currentTarget;
      var children = target.parentNode.children;
      for (let i = 0; i < children.length; i++) {
        $(children[i]).removeClass("active1");
      }
      $(target).addClass("active1");
      this.day = day;
      this.request();
    },
    queryHandle(ishandle, ev) {
      var tar = ev.currentTarget;
      var children = tar.parentNode.children;
      for (let i = 0; i < children.length; i++) {
        $(children[i]).removeClass("active1");
      }
      $(tar).addClass("active1");
      this.ishandle = ishandle;
      this.request();
    },
    // 查询区点击搜索后的处理
    handleSearch(searchData) {
      if (!searchData) {
        return;
      }
      this.searchData = searchData;
      this.request();
    },

    // 跳转到添加地点页面
    addBtn() {
        this.$router.push('/messageSend');
    },
    receive() {
      this.request();
    },
    answerMsg() {
      var tableSelections = this.$refs.tableRef.getTableComp().getSelection();
      if(tableSelections && tableSelections.length === 1){
        this.$router.push('/messageSend/' + tableSelections[0].pk_message + '/reply');
      }else {
        this.$router.push('/messageSend');
      }
    },

    forwardMsg() {
      var tableSelections = this.$refs.tableRef.getTableComp().getSelection();
      if(tableSelections && tableSelections.length === 1){
        this.$router.push('/messageSend/' + tableSelections[0].pk_message + '/forward');
      }else {
        this.$router.push('/messageSend');
      }
    },

    // 删除处理
    deleteClick() {
      var vm = this;
      var data = [this.delRow.pk_message];
      var params = {
        boxCode: this.boxcode
      };
      console.log(JSON.stringify(data));
      this.$http({
        url: this.batchDeleteUrl,
        method: "post",
        data: data,
        params: params,
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json"
      })
        .then(res => {
          if (res.data.success === true) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.delDialogVisible = false;
            this.request();
          } else {
            this.$message({
              message: res.data.error.errorMessage,
              type: "error"
            });
          }
        })
        .catch(e => {
          this.$message({
            message: "删除失败",
            type: "error"
          });
        });
    },

    // table选中改变
    tableSelectionChange(selection) {
      if (selection && selection.length > 0) {
        this.showDeleteButton = true;
        if(selection.length === 1){
            this.showRowButton = true;
        } else {
            this.showRowButton = false;
        }
      } else {
        this.showDeleteButton = false;
        this.showRowButton = false;
      }
    },
    //单击一行
    tableRowClick(row, event, column){
      var checkboxLength = $(event.target).closest('.el-checkbox').length;
      var operateColumnLength = $(event.target).closest('.table-operate-column').length;
      if(checkboxLength >= 1 || operateColumnLength >= 1){
          return;
      }else{
        this.$router.push('/messageDetail/' + row.pk_message);
      }
    },

    // 批量删除点击处理
    multiDeleteDialgShow() {
      this.multiDelDialogVisible = true;
    },
    multiSetRead() {
      var tableSelections = this.$refs.tableRef
        .getTableComp()
        .getSelection();
      var list = [];
      tableSelections.forEach(function(item){
        list.push(item.pk_message);
      });
      console.log(JSON.stringify(list));

      this.$http({
        url: this.setReadUrl,
        method: "post",
        data: list,
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json"
      })
        .then(res => {
          if (res.data.success === true) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.multiDelDialogVisible = false;
            this.request();
          } else {
            this.$message({
              message: res.data.error.errorMessage,
              type: "error"
            });
          }
        })
        .catch(e => {
          this.$message({
            message: "删除失败",
            type: "error"
          });
        });
    },

    // 批量删除处理
    multiDeleteClick() {
      var tableSelections = this.$refs.tableRef
        .getTableComp()
        .getSelection();
      var list = [];
      tableSelections.forEach(function(item){
        list.push(item.pk_message);
      });

      console.log(JSON.stringify(list));
      this.$http({
        url: this.batchDeleteUrl,
        method: "post",
        data: list,
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json"
      })
        .then(res => {
          if (res.data.success === true) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.multiDelDialogVisible = false;
            this.request();
          } else {
            this.$message({
              message: res.data.error.errorMessage,
              type: "error"
            });
          }
        })
        .catch(e => {
          this.$message({
            message: "删除失败",
            type: "error"
          });
        });
    },

    setConditionListDefaultSelect(){
//      var conditionList = this.$refs.searchRef.conditionList;
//      conditionList[3].optionList.options[0].selected = true;
//      conditionList[3].optionList.feOptionSelected = true;
//      this.$refs.searchRef.$set(this.$refs.searchRef.conditionList[3].optionList.options[0],'selected', true);
//      this.$refs.searchRef.$set(this.$refs.searchRef.conditionList[3].optionList,'feOptionSelected', true);
    },
    // 翻页标签改变每页显示数据
    handleSizeChange(val) {
      this.request(1, val);
    },

    // 翻页标签改变当前页
    handleCurrentChange(val) {
      this.request(val, this.size);
    }
  }
};
</script>
<style>
</style>
