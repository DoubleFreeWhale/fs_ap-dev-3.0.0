<template>
  <div class="main-panel">
    <!--节点title-->
    <div class="title-container">
      <h2 class="name">客户-全局</h2>
    </div>
    <!--按钮区域-->
    <div class="operator-container">
      <div class="fl">
        <el-button type="primary" class="button-no-radius" @click="addCustbaseinfo">新增</el-button>
        <el-button class="button-no-radius" @click="multiDeleteDialgShow" v-show="showDeleteButton">删除</el-button>
      </div>
      <div class="fr">
        <el-input placeholder="请选择编码/客户" v-model="search_input" icon="search"  @keyup.enter.native="searchInputEnterClick" :on-icon-click="searchInputEnterClick"></el-input>
        <el-button type="text" @click="showSearch">
          高级
          <i class="el-icon-arrow-down" v-if="this.isHide"></i>
          <i class="el-icon-arrow-up" v-if="!this.isHide"></i>
        </el-button>
      </div>
    </div>

    <!--高级搜索区域-->
    <div id="advanced-search" :class="{hide: isHide}">
      <el-row>
        <el-col :span="2"><span class="search-label">客户编码:</span></el-col>
        <el-col :span="3">
          <el-input type="text" v-model="code" placeholder="请输入地点编码"></el-input>
        </el-col>
        <el-col :span="2"><span class="search-label"> 客户名称:</span></el-col>
        <el-col :span="3">
          <el-input type="text" v-model="name" placeholder="请输入地点名称"></el-input>
        </el-col>
        <el-col :span="2"><span class="search-label"> 启用状态:</span></el-col>
        <el-col :span="4">
          <el-select id="s-state" v-model="enablestate">
            <el-option
              v-for="item in search_options"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <div class="fr">
          <el-button @click="search">搜索</el-button>
        </div>
      </el-row>
    </div>

    <!-- 主体区域 -->
    <div class="list-main-container clearfix">
      <!--新模板组件:tplCode="tplCode"-->
      <el1-template ref="template-table"
                    tplId="customer-table-template"
                    :pkTemp="customerTablePk"
                    :tplData="customerTableData"
                    show-type="table"
                    :page-comp="this"
                    :tplResetFun="customerTableResetFun"
                    :tplMethods="customerTableMethods">
      </el1-template>
      <!--分页组件-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination>
    </div>
    
    <!--删除确认Dialog-->
    <el-dialog
      title="提示"
      v-model="delDialogVisible"
      @update:visible="val => delDialogVisible = val"
      :modal="true"
      size="tiny">
      <span>确认删除该数据？删除后无法恢复。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteClick">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      v-model="multiDelDialogVisible"
      @update:visible="val => multiDelDialogVisible = val"
      :modal="true"
      size="tiny">
      <span>确认删除所选数据？删除后无法恢复。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="multiDelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="multiDeleteClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--数据加载过程中页面最上端显示的层-->
    <!-- <div id="cover" ref="cover">
      <div class="el-loading-spinner">
        <svg viewBox="25 25 50 50" class="circular">
          <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
        </svg>
      </div>
    </div> -->
  </div>
</template>
<script>
import test from "../info-mock.js";
import ElTemplate from "../../../template.vue";

export default {
  components: {
    "el1-template": ElTemplate
  },
  data() {
    var oThis = this;
    return {
      customerTablePk: "033102f7-8558-421a-888c-1f91e34b28fd",
      showDeleteButton: false,
      search_input: "",
      isHide: true,
      totalElements: 0,
      currentPage: 1,
      size: 10,
      delDialogVisible: false,
      multiDelDialogVisible: false,

      customerTableData: {},
      customerTableMethods: {
        handleSelectionChange: function(selection) {
          if (selection && selection.length > 0) {
            oThis.showDeleteButton = true;
          } else {
            oThis.showDeleteButton = false;
          }
        },
        tableEditClick: function(scope) {
          location.hash = "/custbaseinfo/detail/" + scope.row.pk_customer;
        },
        tableDeleteClick: function(scope) {
          this.pageComp.delDialogVisible = true;
          this.delId = scope.row.pk_customer;
        }
      },
      customerTableResetFun: function($node) {
        var $table = this.getNodeBy_Id($node, "7ww18i3wnsf");
        var operateArr = [
          {
            title: "编辑",
            click: "tableEditClick",
            icon: "edit"
          },
          {
            title: "删除",
            click: "tableDeleteClick",
            icon: "delete"
          }
        ];
        var operateHtml = this.getTableOperateHtml(operateArr);
        $table.append(operateHtml);
        $table.attr("v-on:selection-change", "handleSelectionChange");
        return $node[0].outerHTML;
      },

      // 待删除 begin
      code: "",
      name: "",
      ts: "",
      mobile: "",
      enablestate: "",
      search_options: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "未启用",
          value: 1
        },
        {
          label: "已启用",
          value: 2
        },
        {
          label: "已停用",
          value: 3
        }
      ]
      // 待删除 end
    };
  },
  created() {
    var requestDefer = this.request();
    this.initPromise(requestDefer);
  },
  methods: {
    initPromise(request) {
      Promise.all([request]).then(() => {
        // this.$refs.cover.remove();
      });
    },
    searchInputEnterClick() {
      alert(this.search_input);
    },
    request(n, s) {
      var url;
      var search =
        "&search_LIKE_code=&search_LIKE_name=&search_LIKE_enable_state=";
      if (n === undefined) {
        url = "/uapbd/custbaseinfo/pageList?pn=1&ps=10&sortColumn=" + search;
      } else {
        url = "/uapbd/custbaseinfo/pageList?pn=" + n + "&ps=" + s + search;
      }
      this.$http({
        url: url,
        method: "get",
        dataType: "json"
      })
        .then(res => {
          this.originalValue = res.data.data.content;
          this.$refs["template-table"].setData(
            "customer_t",
            JSON.parse(JSON.stringify(this.originalValue))
          );
          this.totalElements = res.data.data.totalElements; // 总条数
          this.size = res.data.data.size; // 每页的条数
        })
        .catch(() => {
          this.$message({
            message: "信息获取失败",
            type: "error"
          });
        });
    },
    handleSizeChange(val) {
      this.request(1, val);
    },
    handleCurrentChange(val) {
      this.request(val, this.size);
    },

    // 高级搜索
    showSearch() {
      this.isHide = !this.isHide;
    },
    search() {
      this.request();
    },
    // 跳转到添加地点页面
    addCustbaseinfo() {
      location.hash = "/custbaseinfo/add";
    },
    multiDeleteDialgShow() {
      this.multiDelDialogVisible = true;
    },

    /**
       *  启用状态修改
       *
       * */
    stateTableRow(row) {
      // 操作列增加启用按钮
      this.$http({
        url: "/uapbd/addressdoc/enable/" + row.pk_customer,
        method: "post"
      })
        .then(res => {
          if (res.data.status === true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.request();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "Network error",
            type: "error"
          });
        });
    },
    deleteClick() {
      var delId = this.$refs["template-table"].comp.delId;
      console.log("delete" + delId);
      return;
      this.$http({
        url: "/uapbd/custbaseinfo/del1",
        method: "post",
        dataType: "json",
        data: {
          ts: this.ts,
          pk_customer: this.$refs["template-table"].comp.delId
        }
      })
        .then(res => {
          if (res.data.status === true) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.delDialogVisible = false;
            this.request();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "Network error",
            type: "error"
          });
        });
    },

    multiDeleteClick() {
      var tableSelections = this.$refs["template-table"].comp.$refs[
        "customer_table"
      ].getSelection();
      var delIds = [];
      if (tableSelections && tableSelections.length > 0) {
        for (var i = 0; i < tableSelections.length; i++) {
          var row = tableSelections[i];
          var id = row.pk_customer;
          delIds.push(id);
        }
      }
      console.log("multi" + delIds);
      return;
    }
  }
};
</script>
<style>

</style>
