<template>
  <div class="table-tree-ref-container">
    <!-- selector - tree -->
    <div
      class="tree-selector-container"
      @mouseenter="enterTreeSelector"
      @mouseleave="leaveTreeSelector">
      <div class="tree-breadcrumbs">
        <template v-if="Array.isArray(selectedTreeNodes) && selectedTreeNodes.length">
          <span
            v-for="(node, index) in selectedTreeNodes"
            :key="index">
            <span
              :class="{
                clickable: notLeafSelectable && (index < selectedTreeNodes.length - 1)
              }"
              @click="treeBreadCrumbClicked(node, index)">{{ node.name }}</span>
            <span v-if="index < selectedTreeNodes.length - 1"
              class="separator"> / </span>
          </span>
        </template>
        <span v-else>请选择</span>
        <i :class="{
          'ifbp-icon-caret-up': treeNodePanelVisible,
          'ifbp-icon-caret-down': !treeNodePanelVisible,
        }"></i>
      </div>
      <div v-if="treeNodePanelVisible" class="tree-node-panel">
        <el-tabs type="border-card" v-model="treeNodePanel">
          <el-tab-pane v-for="(node, index) in selectedNodesInPanel"
            :key="index"
            :name="node.panelName"
            :label="node.currentNodeName ? node.currentNodeName : '请选择'">
            <div
              class="tree-node-panel-content transition-height"
              :style="{
                maxHeight: contentHeight - 84 + 'px'
              }">
              <el-row class="tree-node-childnodes"
                :gutter="8">
                <el-col v-for="(childNode, childIndex) in node.children"
                  :key="childIndex"
                  class="tree-node-childnode"
                  :class="{
                    current: node.currentNodeId === childNode.id
                  }"
                  :span="6"
                  :title="childNode.refcode ? childNode.refcode + ' ' + childNode.name : childNode.name"
                  @click.native="selectTreeNode(node, childNode, index)">{{ childNode.name }}</el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- table -->
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
  import Utils from './utils.js';
  export default {
    name: 'IfbpTreeTableRef',
    props: {
      refInfo: Object,
      selected: Array,
      filterText: String,
      queryParams: Object,
      isMutiSelect: Boolean,
      notLeafSelectable: Boolean,
      contentHeight: Number,
      shouldFetchData: Boolean,
    },
    data() {
      return {
        treeNodePanelVisible: false,
        selectedTreeNodes: [],
        /**
         * [{
         *  currentNodeName: '',
         *  currentNodeId: '',
         *  children: []
         * }, {}, ...]
         */
        selectedNodesInPanel: [],
        // 当前选中panel
        treeNodePanel: null,
        // 树表的树(本地)
        local_treeTableTree: [],
        treeNodeField: 'refpk',

        // table related
        tableData: null,
        strFieldCode: ['code', 'name'],
        strFieldName: ['编码', '名称'],
        // pagination related
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
      queryParams:{
        handler(queryParams) {
          this.getTreeTableTree();
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
      // set select states
      setSelected() {
        var sel = [];
        this.selected.forEach((v) => {
          if (v.id) {
            sel.push(v.id);
          }
        });
        this.$nextTick(() => {
          if (!this.$refs.refTable) {
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
        this.treeNodeField = refInfo.cfgParam || 'refpk';
      },

      loadList() {
        const searchStr = this.filterText;
        let requestData;
        try {
          requestData = JSON.parse(JSON.stringify(this.refInfo));
        } catch (error) {
          requestData = {};
        }
        requestData.content = searchStr;
        requestData.clientParam = this.currentTreeNodePk;

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
          url: '/uitemplate_web/iref_ctr/blobRefSearch',
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

      // 设置列名
      setTableColNames() {
        this.strFieldCode = [];
        this.strFieldName = [];
        if (this.refInfo.strFieldName) {
          this.strFieldName = this.refInfo.strFieldName;
          this.strFieldCode = this.refInfo.strFieldCode;
        } else if (this.refData && this.refData.refViewModel && this.refData.refViewModel.strFieldName) {
          this.strFieldName = this.refData.refViewModel.strFieldName;
          this.strFieldCode = this.refData.refViewModel.strFieldCode;
        }
      },

      // 树表 cascader 点击
      handleCascaderItemClick(val) {
        this.currentTreeNodePk = val[this.treeNodeField];
        this.loadList();
      },

      // 获取树表的树
      getTreeTableTree() {
        let requestData;
        try {
          requestData = JSON.parse(JSON.stringify(this.refInfo));
        } catch (error) {
          requestData = {};
        }
        if (this.queryParams && JSON.stringify(this.queryParams) !== '{}') {
          requestData.transmitParam = JSON.stringify(this.queryParams);
        }
        this.$http({
          url: '/uitemplate_web/iref_ctr/blobRefClassSearch',
          method: 'post',
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (!res || !res.data || !res.data.data) {
            return;
          }
          // this.local_treeTableTree = Utils.formatTreeData(res.data.data) || [];
          this.local_treeTableTree = res.data.data || [];
          this.setTreeTableTreeDefaultNode();
          this.setTableColNames();
        });
      },

      // 格式化标签显示名
      formatTreeTableTree(dataArr) {
        dataArr.forEach(node => {
          node.label = node.refcode ? node.refcode + ' ' + node.name : node.name;
          node.value = node.refpk;
        });
        return dataArr;
      },

      // 设置树panel第一级数据(树表)
      setTreeTableTreeDefaultNode() {
        if (!Array.isArray(this.local_treeTableTree) || !this.local_treeTableTree.length) {
          // this.getTreeTableTree();
          return;
        }
        this.selectedTreeNodes = [];
        this.selectedNodesInPanel = [];
        this._addTreeNodePanel('null');
      },
      // 增加树panel, 若无子节点, 返回false
      _addTreeNodePanel(pid) {
        let children = this.local_treeTableTree.filter(node => {
          if (pid === 'null') {
            // node should be a root, when pid === null, 'null', ''
            return !node.pid || node.pid === pid;
          }
          return node.pid === pid;
        });
        if (!Array.isArray(children) || !children.length) {
          return false;
        }
        if (this.notLeafSelectable && pid !== 'null') {
          children.unshift({
            name: '全部',
            id: 'fe_all'
          });
        }
        const panelCount = this.selectedNodesInPanel.length;
        this.selectedNodesInPanel.push({
          currentNodeName: null,
          currentNodeId: null,
          currentRefcode: null,
          panelName: 'treeNodePanel_' + panelCount,
          children: children
        });
        this.treeNodePanel = 'treeNodePanel_' + panelCount;
        return true;
      },
      // handler of mouse entering tree selector
      enterTreeSelector() {
        console.log('mouse enter');
        clearTimeout(this.leaveTimer);
        this.treeNodePanelVisible = true;
      },
      // handler of mouse leaving tree selector
      leaveTreeSelector() {
        this.leaveTimer = setTimeout(() => {
          console.log('mouse leave');
          this.treeNodePanelVisible = false;
        }, 300);
      },
      bindMouseEventForGridTree() {
        /*eslint no-undef: "off"*/
        $('.panel-container').on('mouseenter', '.tree-selector-container', () => {
          console.log('mouse enter');
          clearTimeout(this.leaveTimer);
          this.treeNodePanelVisible = true;
        });
        $('.panel-container').on('mouseleave', '.tree-selector-container', () => {
          this.leaveTimer = setTimeout(() => {
            console.log('mouse leave');
            this.treeNodePanelVisible = false;
          }, 300);
        });
      },
      // 选中某节点
      selectTreeNode(node, childNode, tabIndex) {
        if (!node || !childNode) {
          return;
        }
        if (tabIndex < this.selectedNodesInPanel.length - 1) {
          this.selectedNodesInPanel = this.selectedNodesInPanel.slice(0, tabIndex + 1);
        }
        node.currentNodeName = childNode.name;
        node.currentNodeId = childNode.id;
        node.currentRefcode = childNode.refcode;
        node[this.treeNodeField] = childNode[this.treeNodeField];
        if (childNode.id === 'fe_all') {
          this.handleTreeNodeChange();
          return;
        }
        // 添加新panel, 如果没有子节点, 则触发查询
        if (!this._addTreeNodePanel(node.currentNodeId)) {
          this.handleTreeNodeChange();
        }
      },
      // 触发查询
      handleTreeNodeChange() {
        this.treeNodePanelVisible = false;
        // 设置面包屑
        this._setTreeBreadCrumb();
        if (!Array.isArray(this.selectedTreeNodes) || !this.selectedTreeNodes.length) {
          return;
        }
        // 设置当前节点id
        const lastTreeNode = this.selectedTreeNodes[this.selectedTreeNodes.length - 1];
        if (!lastTreeNode) {
          return;
        }
        this.currentTreeNodePk = lastTreeNode[this.treeNodeField];
        // 查询
        this.loadList();
      },
      // 设置面包屑
      _setTreeBreadCrumb() {
        let resultArr = [];
        for (let i = 0; i < this.selectedNodesInPanel.length; i++) {
          const node = this.selectedNodesInPanel[i];
          if (node.currentNodeName !== '全部') {
            let nodeToPush = {
              id: node.currentNodeId,
              name: node.currentNodeName,
              refcode: node.currentRefcode,
            };
            nodeToPush[this.treeNodeField] = node[this.treeNodeField];
            resultArr.push(nodeToPush);
          }
        }
        this.selectedTreeNodes = resultArr;
      },
      // 点击面包屑
      treeBreadCrumbClicked(node, index) {
        if (!Array.isArray(this.selectedTreeNodes) || !this.selectedTreeNodes.length) {
          return;
        }
        if (index === this.selectedTreeNodes.length - 1) {
          return;
        }
        if (!this.notLeafSelectable) {
          return;
        }
        let targetPanelIndex, targetPanelId;
        for (let i = 0; i < this.selectedNodesInPanel.length; i++) {
          const panel = this.selectedNodesInPanel[i];
          if (panel.currentNodeId === node.id) {
            targetPanelIndex = i;
            targetPanelId = node.id;
            break;
          }
        }
        // 截取panel数组
        this.selectedNodesInPanel = this.selectedNodesInPanel.slice(0, targetPanelIndex + 2);
        // 设置为'全部'
        let lastPanel = this.selectedNodesInPanel[this.selectedNodesInPanel.length - 1];
        lastPanel.currentNodeName = '全部';
        lastPanel.currentNodeId = 'fe_all';
        this.selectedTreeNodes = this.selectedTreeNodes.slice(0, index + 1);
        this.treeNodePanel = lastPanel.panelName;
        // this.treeNodePanelVisible = false;
        this.loadList();
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
        this.loadList();
      },
      handleCurrentPageChange(val) {
        this.currentPage = val;
        this.loadList();
      },

    },
    created() {
      this.initRefInfoRelated();
      this.getTreeTableTree();
      this.loadList();
      // this.bindMouseEventForGridTree();
    },
  }
</script>
<style scoped>
  /* 树表 */
  .tree-breadcrumbs {
    /* 溢出往左撑开 */
    position: absolute;
    right: 0;
    padding-bottom: 16px;
    padding-left: 16px;
    min-width: 98%;
    height: 14px;
    line-height: 16px;
    color: #8E8E93;
    font-size: 14px;
    white-space: nowrap;
    cursor: default;
  }
  .tree-breadcrumbs i {
    vertical-align: middle;
  }
  .tree-breadcrumbs .clickable {
    color: #5AC8FA;
    cursor: pointer;
  }
  .tree-selector-container {
    position: relative;
    height: 32px;
  }
  .tree-node-panel {
    position: absolute;
    left: 0;
    top: 32px;
    width: 484px;
    z-index: 999;
  }
  .tree-node-childnode {
    padding: 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #2D2D2D;
    cursor: pointer;
    font-size: 14px;
    line-height: 14px;
  }
  .tree-node-childnode:hover,
  .tree-node-childnode.current {
    color: #5AC8FA;;
  }
  .tree-node-panel-content {
    overflow-x: hidden;
    overflow-y: auto;
  }
  .tree-node-childnode:selection,
  .tree-breadcrumbs span::selection {
    color: inherit;
  }
</style>
<style>
  .tree-node-panel > .el-tabs__content {
    padding: 8px 16px;
  }
</style>
