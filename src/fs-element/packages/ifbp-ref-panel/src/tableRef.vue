<template>
  <div>
    <el-table
      class="transition-height"
      :data="tableData"
      highlight-current-row
      empty-text="暂无数据……"
      @current-change="handleCurrentChange"
      @row-dblclick="nodeDblClick"
      @select="handleTabSelectChange"
      @select-all="handleTabSelectChange"
      :height="showPagination ? contentHeight - 46 : contentHeight"
      ref="refTable">
      <el-table-column
        type="selection"
        v-if="isMutiSelect"
        width="55">
      </el-table-column>
      <el-table-column
        v-for="(colName,index) in strFieldName"
        :key="index"
        :label="colName"
        :property="strFieldCode[index]">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="showPagination"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalElements"
    >
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'IfbpTableRef',
    props: {
      templateValue: Object,
      refInfo: Object,
      queryParams: Object,
      selected: Array,
      contentHeight: Number,
      isMutiSelect: Boolean,
      filterText: String,
      shouldFetchData: Boolean,
    },
    data() {
      return {
        tableData: null,
        strFieldCode: ['code', 'name'],
        strFieldName: ['编码', '名称'],
        showPagination: false,
        totalElements: 0,
        pageSize: 10,
        currentPage: 1,
      };
    },
    watch: {
      selected: {
        handler() {
          this.setSelected();
        },
        deep: true
      },
      shouldFetchData(val) {
        if (val) {
          this.handleCurrentPageChange(1);
        }
      },
    },
    methods: {
      // request data of frequently used ref
      getTableRef() {
        const searchStr = this.filterText;
        let requestData;
        try {
          requestData = JSON.parse(JSON.stringify(this.refInfo));
        } catch (error) {
          requestData = {};
        }
        requestData.content = searchStr;

        let queryParams_local = this.queryParams || {};
        if (queryParams_local && JSON.stringify(queryParams_local) !== '{}') {
          requestData.transmitParam = JSON.stringify(queryParams_local);
        }

        if (this.templateValue && this.templateValue['base_doc_type']) {
          requestData.condition = this.templateValue['base_doc_type'];
        }

        // 分页
        let pageInfo = {
          pageSize: this.pageSize,
          currPageIndex: this.currentPage - 1
        };
        requestData.refClientPageInfo = pageInfo;
        this.$http({
          url: '/uitemplate_web/iref_ctr/commonRefsearch',
          method: 'post',
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          this.$emit('dataFetched');
          if (!res || !res.data || !res.data.data) {
            return;
          }
          this.tableData = res.data.data;
          this.setSelected();
          const refViewModel = res.data.refViewModel;
          if (!refViewModel) {
            return;
          }
          if (refViewModel.refClientPageInfo && refViewModel.refClientPageInfo.pageCount) {
            this.totalElements = refViewModel.refClientPageInfo.pageCount;
          }
          if (refViewModel.strFieldCode) {
            this.strFieldCode = refViewModel.strFieldCode;
          }
          if (refViewModel.strFieldName) {
            this.strFieldName = refViewModel.strFieldName;
          }
        });
      },

      // set select states
      setSelected() {
        var sel = [];
        this.selected.forEach((v) => {
          if (v.id) {
            sel.push(v.id);
          }
        });
        this.$nextTick(() => {
          if (!this.$refs.refTable || !Array.isArray(this.tableData)) {
            return;
          }
          this.tableData.forEach((v) => {
            if (v.id && sel.indexOf(v.id) !== -1) {
              this.$refs.refTable.setCurrentRow(v);
              this.$refs.refTable.toggleRowSelection(v, true);
            } else {
              this.$refs.refTable.toggleRowSelection(v, false);
            }
          });
        });
      },

      initRefInfoRelated() {
        const refInfo = this.refInfo;
        this.showPagination = refInfo.isPageable === true;
        if (refInfo.strFieldName) {
          this.strFieldName = refInfo.strFieldName;
        }
        if (refInfo.strFieldCode) {
          this.strFieldCode = refInfo.strFieldCode;
        }
        if (refInfo.refClientPageInfo && refInfo.refClientPageInfo.pageCount) {
          this.totalElements = refInfo.refClientPageInfo.pageCount;
        }
      },

      /**
       * click related events
       */
      // double click evnet
      nodeDblClick(data) {
        if (this.isMutiSelect) {
          return;
        }
        this.$emit('nodeDblClick');
      },

      handleTabSelectChange(selection) {
        if (!this.isMutiSelect) {
          return;
        }
        var table = [];
        var cur = [];
        this.tableData.forEach((v) => {
          table.push(v.id);
        });
        this.selected.forEach((v) => {
          if (table.indexOf(v.id) < 0) {
            cur.push(v);
          }
        });
        this.$emit('select', cur.concat(selection));
      },

      handleCurrentChange(val) {
        if (!this.isMutiSelect && val) {
          this.$emit('select', [val]);
        }
      },

      /**
       * pagination related
       */
      handlePageSizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getTableRef();
      },
      handleCurrentPageChange(val) {
        this.currentPage = val;
        this.getTableRef();
      },
    },
    created() {
      this.initRefInfoRelated();
      this.getTableRef();
    },
  };
</script>
<style>
</style>
