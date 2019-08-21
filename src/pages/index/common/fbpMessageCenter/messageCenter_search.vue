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
      <div class="search-panel fr">
        <div class="search-input-container">
          <el-input
            placeholder="标题"
            v-model="keyword"
            icon="search"
            style="width:calc(100% - 68px)"
            @keyup.enter.native="handleIconClick"
            :on-icon-click="handleIconClick"></el-input>
        </div>
      </div>

    </ifbp-button-area>
    <div id="messageCenter" class="advanced-search-panel advanced-search-panel-pb-16">
      <div class="handle-body">
        <el-row>
        <el-col :span="2">
          <div class="setLabel">
            <!--类型msgbox-->
            <span>消息状态:</span>
          </div>
        </el-col>
        <el-col :span="22">
          <ul>
            <template v-for="(item, index) in boxList">
              <li v-if="!item.parentcode" :id="item.boxcode" :class="item.boxcode === 'receive' ? 'active1' : ''"
                  @click="msgBoxClick(item, $event)">{{item.boxname}}</li>
            </template>
          </ul>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
          <div class="setLabel">
            <!--类型msgbox-->
            <span>类型:</span>
          </div>
          </el-col>
          <el-col :span="22">
          <ul>
            <li id="all" class="active1" @click="msgBoxClick(null,$event)">全部</li>
            <template v-for="(item, index) in boxList">
              <li v-if="item.parentcode && item.parentcode === pk_msgboxl" :id="item.boxcode"
                  @click="msgBoxTypeClick(item, $event)">{{item.boxname}}</li>
            </template>
          </ul>
          </el-col>
        </el-row>

        <el-row v-show="msgTypeShow">
          <el-col :span="2">
          <div class="setLabel">
            <!--消息来源类型-->
            <span>消息类型:</span>
          </div>
          </el-col>
          <el-col :span="22">
          <ul>
            <li id="allpkmsgtype" class="active1" @click="selectPkMsgType('',$event)">全部</li>
            <!--v-if="item.parentcode && item.parentcode === boxcode"-->
            <template v-for="(item, index) in msgtypeList">
              <li  :id="item.typecode"
                  @click="selectPkMsgType(item.typecode, $event)">{{item.typename}}</li>
            </template>
          </ul>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2">
          <div class="setLabel">
            <span>日期范围:</span>
          </div>
          </el-col>
          <el-col :span="22">
          <ul>
            <li id="nearAll" class="active1" @click="querydaysData('',$event)">全部</li>
            <li id="nearWeek" @click="querydaysData('7',$event)">一周内</li>
            <li id="nearMouth" @click="querydaysData('30',$event)">一个月内</li>
            <li id="nearMore" @click="querydaysData('90',$event)">三个月内</li>
            <li id="nearMore" @click="querydaysData('180',$event)">半年内</li>
            <li id="nearMore" @click="querydaysData('360',$event)">一年内</li>
          </ul>
          </el-col>
        </el-row>
        <el-row v-show="!(boxcode === 'send' || boxcode === 'delete')">
          <el-col :span="2">
          <div class="setLabel">
            <span>消息状态:</span>
          </div>
          </el-col>
          <el-col :span="22">
          <ul>
            <li id="unHandle" class="active1" @click="queryHandle(false,$event)">未读</li>
            <li id="allHandle" @click="queryHandle(true,$event)">已读</li>
          </ul>
          </el-col>
        </el-row>
      </div>
    </div>
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
//      searchCode: "messageSearch",
      searchCode: "messageInput",
      searchData: "",
      boxList: [],
      defaultBoxitem: '',
      msgtypeList: [],
      msgTypeShow: false,
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
        var $subject = $table.find('el-table-column[prop="subject"]');
         $subject.html(
           '<template scope="scope"><el-button ' +
           '@click="tableEditClick(scope)" ' +
           'type="text">{{scope.row.subject}}</el-button></template>'
         );
        var baseOperateArr = [
          // {
          //   title: "查看",
          //   click: "tableEditClick",
          //   icon: "edit"
          // },
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

  },
  mounted(){
    this.request();
    this.requestBox();
  },
  methods: {
    ifbpPageInit(){
      this.request();
    },
    // 请求数据
    request(curPage, size) {
      var data = {
        type: 'widget',
        pageNum: curPage || 1,
        pageSize: size || this.size,
        boxcode: this.boxcode,
        from: this.typecode,
        senddate: this.day,
        keyword: this.keyword,
        ishandle: this.ishandle,
        searchData: null
      };
      console.log(JSON.stringify(data));

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
                this.defaultBoxitem = JSON.parse(JSON.stringify(item));
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
        this.msgTypeShow = false;
        this.boxcode = this.defaultBoxitem.boxcode;
        this.pk_msgboxl = this.defaultBoxitem.pk_msgboxl;
        this.msgtypeList = this.defaultBoxitem.msgtypes;//this.selectedbox.msgtypes;
      }
      this.typecode = '';
      this.request();

    },
    msgBoxTypeClick(item,e){
      this.msgTypeShow = true;
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
              message: "操作成功",
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

      var params = {
        boxCode: this.boxcode
      };
      console.log(JSON.stringify(list));
      this.$http({
        url: this.batchDeleteUrl,
        method: "post",
        data: list,
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
  #messageCenter {
    margin: 0 auto;
    position: relative;
    /*padding: 15px 24px;*/
  }

  #messageCenter .messageheader {
    font-size: 18px;
    padding-bottom: 16px;
    /*line-height: 18px;*/
    /*padding-top: 20px;*/
    /*padding-left: 16px;*/
    /*font-family: "Microsoft YaHei", Helvetica, Arial, sans-serif;*/
  }
  #messageCenter .messageheader .sp0 {
    line-height: 18px;
    display: inline-block;
  }
  #messageCenter .handle {
    background: #fff;
    height: 70px;
    line-height: 70px;
    /*padding-left: 20px;*/
  }

  #messageCenter .handle .back,
  #messageCenter .handle .search {
    float: right;
    margin-right: 25px;
  }

  #messageCenter .handle-body {
    margin-top: 10px;
    background: #fff;
    /*padding: 15px 5px;*/
  }

  #messageCenter .handle-body {
    font-size: 14px;
    color: #666666;
  }

  #messageCenter .handle-body ul {
    display: inline-block;
  }

  #messageCenter .handle-body ul li {
    display: inline-block;
    margin: 5px 5px 5px 5px;
    padding: 2px 6px;
  }

  #messageCenter .handle-body .setLabel {
    width: 80px;
    float: right;
    display: block;
    text-align: right;
    margin: 7px 0 0 0;
  }

  #messageCenter .handle-body ul li:hover {
    cursor: pointer;
  }

  .active1 {
    background: #1baede;
    color: #fff;
    padding: 2px 6px;
  }

  #messageCenter .tableList {
    margin-top: 20px;
  }

  #messageCenter .block1 .el-pagination {
    float: right;
  }

  #messageCenter .block1 {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  #messageCenter .el-table tr {
    height: 58px !important;
    padding-top: 10px;
  }

  #messageCenter .el-table {
    border: none !important;
  }

  #messageCenter .el-table::after,
  #messageCenter .el-table::before {
    background-color: transparent!important;
  }

  #messageCenter .tableList .mdate {
    font-size: 12px;
    color: #9e9e9e;
    /*padding-top: 15px;*/
  }

  #messageCenter .tableList .content .cell {
    width: 800px;
    font-size: 14px !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    color: #262626 !important;
  }

  #messageCenter .background_grey {
    color: #9e9e9e!important;
  }

  #messageCenter .el-table__empty-block {
    background-color: #eeeff1;
  }
</style>
