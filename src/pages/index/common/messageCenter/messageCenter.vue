<template>
<ifbp-page class="message-center">
  <ifbp-breadcrumb name="消息中心"></ifbp-breadcrumb>
  <ifbp-button-area>
    <!-- 高级搜索 -->
    <p
      class="advanced-search fr"
      @click="handleShowContent">
      <span v-if="isShow">高级</span>
      <span v-if="!isShow" style="color: #666;">高级</span>
      <i class="ifbp-icon-angle-up" v-if="isShow" style="color: #5CB0E6"></i>
      <i class="ifbp-icon-angle-down" v-if="!isShow"></i>
    </p>
    <!-- 搜索框 -->
    <el-input
      placeholder="消息标题 / 发送人"
      icon="search"
      v-model="searchStr"
      class="search-function fr"
      @keyup.enter.native="handleIconClick"
      :on-icon-click="handleIconClick">
    </el-input>
  </ifbp-button-area>

  <!-- 高级搜索下拉部分 -->
  <div class="handle-body" v-show="isShow">
    <div class="category">
      <div class="setLabel fl">
        <span>消息类别：</span>
      </div>
      <ul class="taskUl">
        <li v-for="item in showCount" :key="item.type">
          <span @click="queryType(item.type, $event)">{{item.type + ' ' + item.count}}</span>
        </li>
      </ul>
    </div>
    <div class="category">
      <div class="setLabel fl">
        <span>时间范围：</span>
      </div>
      <ul class="dayUl">
        <li>
          <span @click="querydaysData('1',$event)">今日</span>
        </li>
        <li>
          <span @click="querydaysData('7',$event)">本周</span>
        </li>
        <li>
          <span @click="querydaysData('30',$event)">本月</span>
        </li>
        <li>
          <span @click="querydaysData('',$event)">全部</span>
        </li>
      </ul>
    </div>
  </div>

  <ifbp-main-area type="list">
    <div class="ifbp-btn-line">
      <div class="fr">
        <i class="ifbp-icon-setting"  @click="showHeaderSetting" title="设置"></i>
      </div>
    </div>
    <!-- UI模板 -->
    <ifbp-template 
      ref="mCenter"
      tpl-id="mCenterTplId"
      :pk-temp="mCenterTplPkTemp"
      :tpl-data="mCenterTplTableData"
      :table-show-menu="false"
      show-type="table"
      :tpl-reset-fun="mCenterTplResetFun"
      :methods="mCenterTplMethods"
      @table-click="mCenterTplTableClick"
      v-show="showTable">
    </ifbp-template>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalElements">
    </el-pagination>
  </ifbp-main-area>
</ifbp-page>
</template>
<script>
export default {
  data() {
    var vm = this;
    return {
      // UI模板
      mCenterTplPkTemp: "a13f2132-099e-45b0-9f36-1f1e126b6527",
      mCenterTplTableData: {},
      mCenterTplResetFun: function($node) {
        var $mCenterTplTable = this.getTableDom($node);
        $mCenterTplTable[0].children[0].outerHTML =
          '<el-table-column _id="qmgvpau60d" render-type="default" render-template="default" separator="," symbol="￥" align="left" header-align="left" prop="title" v-if="tableCoulmnVIf" label="消息标题" format="" :sortable="true"><template scope="scope"><i v-if="scope.row.read_flag === \'0\'" style="width: 6px; height: 6px; border-radius: 50%; background-color: #5AC8FA; display: inline-block; margin-right: 8px;"></i><el-tooltip effect="normal" :content="scope.row.title" placement="top"><a @click="messDetail(scope)" v-if="scope.row.read_flag === \'0\'">{{scope.row.title}}</a><a @click="messDetail(scope)" v-if="scope.row.read_flag === \'1\'" style="color: #9e9e9e;">{{scope.row.title}}</a></el-tooltip></template></el-table-column>';
        $mCenterTplTable[0].children[1].outerHTML =
          '<el-table-column _id="axv9wj6me4h" :sortable="true" render-type="default" render-template="default" separator="," symbol="￥" align="left" header-align="left" prop="creataor_name" v-if="tableCoulmnVIf" label="发送人" width="120" format=""><template scope="scope"><span v-if="scope.row.read_flag === \'1\'" style="color: #9e9e9e;">{{scope.row.creataor_name}}</span><span v-if="scope.row.read_flag === \'0\'">{{scope.row.creataor_name}}</span></template></el-table-column>';
        $mCenterTplTable[0].children[2].outerHTML =
          '<el-table-column _id="14ucscivp2t" :sortable="true" render-type="default" render-template="default" separator="," symbol="￥" align="left" header-align="left" prop="type" v-if="tableCoulmnVIf" label="消息类别" width="120" format=""><template scope="scope"><span v-if="scope.row.read_flag === \'1\'" style="color: #9e9e9e;">{{scope.row.type}}</span><span v-if="scope.row.read_flag === \'0\'">{{scope.row.type}}</span></template></el-table-column>';
        $mCenterTplTable[0].children[3].outerHTML =
          '<el-table-column _id="x3mx7tiaow9" :sortable="true" render-type="default" render-template="default" separator="," symbol="￥" align="left" header-align="left" prop="content" v-if="tableCoulmnVIf" label="描述" format=""><template scope="scope"><el-tooltip effect="normal" :content="scope.row.content" placement="top"><span v-if="scope.row.read_flag === \'1\'" style="color: #9e9e9e;">{{scope.row.content}}</span><span v-if="scope.row.read_flag === \'0\'">{{scope.row.content}}</span></el-tooltip></template></el-table-column>';
        $mCenterTplTable[0].children[4].outerHTML =
          '<el-table-column _id="4nzziq9k2i4" :sortable="true" render-type="default" render-template="default" separator="," symbol="￥" align="right" header-align="right" prop="send_time" v-if="tableCoulmnVIf" label="发送时间" width="166" format=""><template scope="scope"><span v-if="scope.row.read_flag === \'1\'" style="color: #9e9e9e;">{{scope.row.send_time}}</span><span v-if="scope.row.read_flag === \'0\'">{{scope.row.send_time}}</span></template></el-table-column>';
        return $node[0].outerHTML;
      },
      mCenterTplMethods: {
        messDetail(scope) {
          // 路由跳转
          $(".tooltip-normal").remove();
          vm.$router.push("/messageDetail/" + scope.row.pk_message);
        }
      },
      showTable: true,
      // 搜索
      searchStr: "",
      // table数据
      tableData: [],
      // 分页
      currentPage: 1,
      totalElements: 0,
      size: 10,
      // 时间
      day: "",
      // 时间类别
      type: "",
      // 搜索默认显示下拉内容
      isShow: true,
      showCount: [],
    };
  },
  created() {
    // 获取列表数据
    this.dataSearch();
    // 获取审批数量和预期数量
    this.countSearch();
  },
  methods: {
    // 刷新页面
    ifbpPageInit() {
      // 获取列表数据
      this.dataSearch(this.currentPage, this.size);
      // 获取审批数量和预期数量
      this.countSearch();
    },
    // 搜索框点击事件
    handleIconClick() {
      this.currentPage = 1;
      this.pageSize = 10;
      this.dataSearch(this.currentPage, this.size);
    },
    // 高级搜索点击事件
    handleShowContent() {
      this.isShow = !this.isShow;
    },
    // 时间范围的点击事件
    querydaysData(day, event) {
      this.day = day;

      var target = event.currentTarget;
      var children = target.parentNode.parentNode.children;
      for (let i = 0; i < children.length; i++) {
        $(children[i].children).removeClass("active1");
      }
      $(target).addClass("active1");
      this.dataSearch(this.currentPage, this.size);
    },
    // 消息类别的点击事件
    queryType(type, e) {
      this.type = type;
      this.searchStr = "";
      this.currentPage = 1;

      var ta = e.currentTarget;
      var children = ta.parentNode.parentNode.children;
      for (let i = 0; i < children.length; i++) {
        $(children[i].children).removeClass("active1");
      }
      $(ta).addClass("active1");

      // 清空日期选中状态
      let dayUlChildren = $(".dayUl")[0].children;
      for (let i = 0; i < dayUlChildren.length; i++) {
        $(dayUlChildren[i].children).removeClass("active1");
      }
      this.day = "";
      // 调获取列表的接口
      this.dataSearch(this.currentPage, this.size);
    },
    // 审批数量,预警数量的接口
    countSearch() {
      var url = "/ifbp-app-sm/sm/messageCenter/queryNum";
      this.$http({
        url: url,
        noLoading: true,
        method: "get"
      })
        .then(res => {
          if (res.data.success === true) {
            this.showCount = res.data.data.data;
          }
        })
        .catch(e => {});
    },
    // 获取列表
    dataSearch(pn, ps) {
      this.tableData = [];
      var url = "/ifbp-app-sm/sm/messageCenter/pageList";
      if (pn === undefined) {
        pn = 1;
        ps = 10;
      }
      let data = {
        timePeriod: this.day,
        type: this.type == "全部" ? "" : this.type,
        messageType: "",
        pn: pn,
        ps: ps,
        title_creator: this.searchStr
      };
      this.$http({
        url: url,
        method: "post",
        data: data
      }).then(res => {
        if (res.data.success) {
          var data = JSON.parse(JSON.stringify(res.data.data.content));
          data.forEach(v => {
            if (v.creataor_name === "null") {
              v.creataor_name = "系统";
            }
            // 处理时间
            if (v.send_time) {
              v.send_time = this.handleTime(v.send_time);
            }
          });
          this.tableData = data;
          this.totalElements = res.data.data.totalElements;
          this.$nextTick(() => {
            if (this.$refs.mCenter) {
              this.$refs.mCenter.setTableData(this.tableData);
            } else {
              this.$set(
                this.mCenterTplTableData,
                "uitemplateTableData",
                this.tableData
              );
            }
          });
        } else {
          this.$message({
            message: res.data.data,
            type: "error"
          });
        }
      });
    },
    // 分页
    handleSizeChange(val) {
      this.size = val;
      this.dataSearch(this.currentPage, val);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.dataSearch(val, this.size);
    },
    // table点击事件
    mCenterTplTableClick() {},
    // table行的点击事件
    mCenterTplRowClick(row) {},
    // table设置按钮
    showHeaderSetting() {
      this.$refs.mCenter.setTransferVisible(true);
    },
    // 时间处理
    handleTime(obj) {
      // 将时间戳转化格式
      var date, Y, M, D, h, m, s;
      date = new Date(obj);
      Y = date.getFullYear() + "-";
      M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return Y + M + D + h + m;
    }
  }
};
</script>
<style scoped>
/* 搜索框样式 */
.message-center .search-function.el-input {
  width: 288px;
}
/* 高级搜索 */
.message-center .advanced-search {
  font-size: 14px;
  line-height: 16px;
  color: #5cb0e6;
  margin-left: 16px;
  margin-top: 8px;

  /* 解决点击文字出现背景色的问题 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.message-center .advanced-search:hover {
  cursor: pointer;
}
.message-center .advanced-search i {
  color: #c8c8cd;
  vertical-align: sub;
  font-size: 16px;
  margin-left: -4px;
}
.message-center .advanced-search .ifbp-icon-angle-down {
  margin-right: 0;
}
/* 高级搜索下拉 */
.message-center .handle-body {
  font-size: 14px;
  color: #666666;
  border-top: 1px solid #F0F0F5;
  background: #fff;
  padding: 8px 16px;
}
.message-center .handle-body .category {
  height: 40px;
  line-height: 40px;
  width: 100%;
}

.message-center .handle-body .setLabel {
  color: #888;
  /* width: 80px; */
  text-align: right;
}

.message-center .handle-body ul {
  margin-left: 78px;
}

.message-center .handle-body ul li {
  display: inline-block;
  margin-right: 8px;
  /* padding: 0 8px; */
}

.message-center .handle-body ul li span {
  padding: 4px 8px;
  background-color: #fff;
}
.message-center .handle-body ul li span:hover {
  cursor: pointer;
  background-color: #5cb0e6;
  color: #fff;
}

.message-center .handle-body ul li span.active1 {
  background: #5cb0e6;
  color: #fff;
  padding: 4px 8px;
}

.el-table tr {
  height: 58px !important;
  padding-top: 10px;
}

.el-table {
  border: none !important;
}

.el-table::after,
.el-table::before {
  background-color: transparent !important;
}

/* 列表中发送时间样式 */
.mdate {
  font-size: 12px;
  color: #9e9e9e;
  /*padding-top: 15px;*/
}
.mdate .el-table .cell {
  padding-right: 24px !important;
}
/* 列表中消息标题的样式 */
.content .cell {
  width: 800px;
  font-size: 14px !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  color: #262626 !important;
}

.background_grey {
  color: #9e9e9e !important;
}

.el-table__empty-block {
  background-color: #eeeff1;
}
</style>
