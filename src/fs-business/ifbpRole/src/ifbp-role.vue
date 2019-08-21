<template>
  <div>
    <el-dialog
      @update:visible="val => dialogRoleVisible = val"
      title="选择角色"
      :visible="dialogRoleVisible"
      custom-class="roledialog"
    >
      <ifbp-search
        class="search-demo"
        :template-code="tempalteSearchCode"
        :search-on-select="true"
        @select="handleSelect"
        @search="handleSearch"
      ></ifbp-search>
      <ifbp-template
        ref="templateTable"
        tpl-id="templateTableId"
        :pk-temp="tempalteTablePk"
        :tpl-data="tempalteTableData"
        show-type="table"
        :methods="selectionMethods"
        :tpl-reset-fun="selectionResetFun"
        @selection-change="handleTabSelectChange"
      ></ifbp-template>

      <el-pagination
        id="staff-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements"
      ></el-pagination>

      <el-collapse
        v-model="activeCollapseName_selected"
        class="selected-panel"
        @change="selectedPanelCollapse"
      >
        <el-collapse-item
          :title="'已选' + (Array.isArray(selected) && selected.length ? '(' + selected.length + ')' : '')"
          name="selected"
        >
          <el-tag
            class="selected-tag"
            v-for="(tag, index) in selected"
            :key="index"
            type="primary-outline"
            closable
            closeTransition
            @close="removeSelected(index)"
          >{{ tag.name || tag.code }}</el-tag>
          <span v-if="selected.length" class="btn-clear-selected" @click="clearSelected">清空</span>
        </el-collapse-item>
      </el-collapse>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseSelf('cancel')">取 消</el-button>
        <el-button type="primary" @click="handleCloseSelf('confirm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ifbpRole",
  props: {
    openDialog: {
      type: Boolean,
      dafault: true
    },
    roleId: {
      type: String
    },
    tempalteSearchCode: {
      type: String,
      required: true
    },
    tempalteTablePk: {
      type: String,
      required: true
    },
    searchRoleUrl: {
      type: String,
      required: true
    },
    copyRoleUrl: {
      type: String,
      required: true
    }
  },
  watch: {
    roleId(val) {
      if (val) {
        this.request(val);
      }
    },
    openDialog(val) {
      this.dialogRoleVisible = val;
    },
    selected(curVal, oldVal) {
      var sel = [];
      curVal.forEach(v => {
        if (v.id) {
          sel.push(v.id);
        }
      });

      this.$refs.templateTable.getTableData().forEach(v => {
        if (v.id && sel.indexOf(v.id) !== -1) {
          this.$refs.templateTable.getTableComp().toggleRowSelection(v, true);
        } else {
          this.$refs.templateTable.getTableComp().toggleRowSelection(v, false);
        }
      });
    }
  },
  data() {
    return {
      selectedPanelVisible: false,
      activeCollapseName_selected: [],
      dialogRoleVisible: false,
      size: 10,
      currentPage: 1,
      totalElements: 0,
      selected: [],
      tempalteTableData: {},

      strFieldName: [],
      searchData: "",
      selectionMethods: {
        getRowKeys: function(row) {
          return row.id;
        }
      },
      selectionResetFun: function($node) {
        var $table = this.getTableDom($node);
        $table.attr("v-bind:row-key", "getRowKeys");
        var $selection = $table.find('el-table-column[type="selection"]');
        $selection.attr("v-bind:reserve-selection", "true");
        return $node[0].outerHTML;
      }
    };
  },
  methods: {
    removeSelected(tagIndex) {
      this.selected.splice(tagIndex, 1);
    },
    clearSelected() {
      this.selected = [];
    },

    handleSelect(searchData) {
      if (!searchData) {
        return;
      }
      this.searchData = searchData;
      this.request();
    },
    handleSearch(searchData) {
      if (!searchData) {
        return;
      }
      this.searchData = searchData;
      this.request();
    },
    handleSizeChange(val) {
      this.size = val;
      this.request();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.request();
    },
    // 单选时, 双击节点触发选中
    nodeDblClick(val) {
      if (this.isMutiSelect) {
        return;
      }
      const childNodes = val.children;
      this.$emit("onSelectData", val);
    },
    /**
     *   获取列表请求
     **/
    request(roleid) {
      const url = this.searchRoleUrl + (roleid ? roleid : this.roleId);
      var data = {
        pageNum: this.currentPage || 1,
        pageSize: this.size || 10
      };
      if (this.searchData) {
        data.searchParams = {
          searchMap: {
            searchTemplateParam: JSON.stringify(this.searchData)
          }
        };
      }
      this.$http({
        url: url,
        method: "POST",
        data: data
      })
        .then(res => {
          if (res.data.success) {
            this.totalElements = res.data.data.totalElements;
            const _this = this;
            this.$nextTick(() => {
              if (this.$refs.templateTable) {
                this.$refs.templateTable.setTableData(res.data.data.content);
              } else {
                this.$set(
                  this.tempalteTableData,
                  "uitemplateTableData",
                  res.data.data.content
                );
              }
            });
          }
        })
        .catch(e => {});
    },
    getNewArray(arr) {
      var allArr = [];
      for (var i = 0; i < arr.length; i++) {
        var flag = true;
        for (var j = 0; j < allArr.length; j++) {
          if (arr[i].id == allArr[j].id) {
            flag = false;
          }
        }
        if (flag) {
          allArr.push(arr[i]);
        }
      }
      return allArr;
    },

    handleTabSelectChange(selection) {
      this.selected = selection;

      var sel = [];
      this.selected.forEach(v => {
        if (v.id) {
          sel.push(v.id);
        }
      });

      this.$refs.templateTable.getTableData().forEach(v => {
        if (v.id && sel.indexOf(v.id) !== -1) {
          this.$refs.templateTable.getTableComp().toggleRowSelection(v, true);
        } else {
          this.$refs.templateTable.getTableComp().toggleRowSelection(v, false);
        }
      });
    },

    selectedPanelCollapse(val) {
      if (Array.isArray(val) && val.length) {
        this.selectedPanelVisible = true;
      } else {
        this.selectedPanelVisible = false;
      }
    },
    handleCloseSelf(key) {
      if (key == "cancel") {
        this.selected = [];
        this.dialogRoleVisible = false;
      } else {
        this.copyRole();
      }
    },
    copyRole() {
      var data = [];
      this.selected.forEach(v => {
        data.push(v.id);
      });
      this.$http({
        url: this.copyRoleUrl + this.roleId,
        method: "POST",
        data: data
      })
        .then(res => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "复制成功!"
            });
            this.dialogRoleVisible = false;
          }
        })
        .catch(e => {});
    }
  },
  mounted() {}
};
</script>

<style >
.roledialog .el-dialog__body {
  overflow: auto !important;
}
.selected-panel {
  margin-top: 51px;
  border: none;
}
.selected-panel .el-collapse-item__header {
  height: 48px;
  line-height: 48px;
  border: none;
  background: #f0f5fa;
}

.selected-panel .el-collapse-item__content {
  box-sizing: border-box;
  height: 102px;
  overflow-y: auto;
  padding: 0 16px;
  background: #f0f5fa;
}

.selected-tag {
  margin-right: 16px;
  margin-bottom: 12px;
}
.search-demo {
}
.search-demo input {
  float: right;
  width: 288px;
}
</style>