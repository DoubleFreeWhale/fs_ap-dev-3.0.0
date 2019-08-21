<template>
  <div>
    <el-tree
      v-if="lazyTree"
      class="tree-ref-tree"
      :data="treeData"
      :props="treeProps"
      lazy
      :load="getTreeRef"
      :nodeKey="lazyTreeField"
      :checkStrictly="!childAutoCheck"
      :showCheckbox="isMutiSelect"
      ref="refTree"
      :highlightCurrent="true"
      :filterNodeMethod="filterNode"
      :currentNodeKey="currentTreeNodeKeys"
      :style="{
        height: contentHeight + 'px',
      }"
      @check-change="handleCheckChange"
      @node-click="handleNodeClick"
      @node-dblclick="nodeDblClick">
    </el-tree>
    <el-tree
      v-else
      class="tree-ref-tree"
      :data="treeData"
      :props="treeProps"
      nodeKey="id"
      :checkStrictly="!childAutoCheck"
      :showCheckbox="isMutiSelect"
      ref="refTree"
      :highlightCurrent="true"
      :filterNodeMethod="filterNode"
      :currentNodeKey="currentTreeNodeKeys"
      :style="{
        height: contentHeight + 'px',
      }"
      @check-change="handleCheckChange"
      @node-click="handleNodeClick"
      @node-dblclick="nodeDblClick">
    </el-tree>
  </div>
</template>

<script>
  import Utils from './utils.js';
  export default {
    name: 'IfbpTreeRef',
    props: {
      refInfo: Object,
      selected: Array,
      filterText: String,
      queryParams: Object,
      isMutiSelect: Boolean,
      notLeafSelectable: Boolean,
      contentHeight: Number,
      shouldFetchData: Boolean,
      childAutoCheck: Boolean,
    },
    data() {
      return {
        treeData: null,
        currentTreeNodeKeys: '',
        treeProps: {
          children: 'children',
          label: 'reflabel',
          id: 'id'
        },
        lazyTreeField: 'id',
        notLeafClicked: false,
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
          this.treeData = []
          this.getTreeRef();
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
          if (this.refInfo.refUIType === 'RefTree') {
            if (this.isMutiSelect) {
              if (!this.$refs.refTree) {
                return;
              }
              this.$refs.refTree.setCheckedKeys(sel);
            } else {
              this.currentTreeNodeKeys = (Array.isArray(sel) && sel.length) ? sel[0] : '';
            }
          }
        });
      },

      /**
       * click related events
       */
      // multiple ref check change event
      handleCheckChange(data, checked) {
        if (this.isMutiSelect) {
          // this.selected = this.$refs.reftree.getCheckedNodes();
          let dataId = data.id;
          let currentSelected = Array.isArray(this.selected) ? this.selected.slice() : [];
          if (checked && currentSelected.every(ref => ref.id !== dataId)) {
            currentSelected.push(data);
          }
          if (!checked && currentSelected.some(ref => ref.id === dataId)) {
            currentSelected = currentSelected.filter(ref => ref.id !== dataId);
          }
          this.$emit('select', currentSelected);
        }
      },

      // node click event
      handleNodeClick(data, node) {
        if (this.isMutiSelect) {
          return;
        }
        // table ref or table tree ref
        if (this.refInfo.refUIType !== 'RefTree') {
          this.$emit('select', [data]);
        }
        // tree ref
        if (this.notLeafSelectable || data.isLeaf === 'true') {
          this.notLeafClicked = false;
          this.$emit('select', [data]);
          return;
        }
        if (!this.notLeafSelectable && data.isLeaf === 'false') {
          this.notLeafClicked = true;
          return;
        }
        if (this.lazyTree && node && node.isLeaf === false) {
          this.notLeafClicked = true;
          return;
        }
        const childNodes = data.children;
        if (Array.isArray(childNodes) && childNodes.length) {
          this.notLeafClicked = true;
          return;
        }
        this.notLeafClicked = false;
        this.$emit('select', [data]);
      },

      // double click evnet
      nodeDblClick(data) {
        if (this.isMutiSelect) {
          return;
        }
        if (!this.notLeafSelectable && this.notLeafClicked) {
          return;
        }
        this.$emit('nodeDblClick');
      },

      // reserved from old version
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },

      // request data of tree ref
      getTreeRef(node, resolve) {
        let nodeData = null;
        let lazy_param = null;
        // check properties for lazyload tree
        if (this.lazyTree && node && typeof resolve === 'function') {
          nodeData = node.data;
          if (node.level === 0) {
            if (Array.isArray(nodeData) && nodeData.length) {
              return resolve(nodeData);
            }
            return resolve([]);
          }
          lazy_param = nodeData && nodeData[this.lazyTreeField];
          if (!lazy_param) {
            return resolve([]);
          }
        }
        // format request data
        let requestData;
        try {
          requestData = JSON.parse(JSON.stringify(this.refInfo));
        } catch (error) {
          requestData = {};
        }
        requestData.content = this.filterText || '';
        let queryParams_local = this.queryParams || {};
        if (this.lazyTree) {
          queryParams_local.lazy_param = lazy_param;
          queryParams_local.lazy_object = nodeData;
        }
        if (queryParams_local && JSON.stringify(queryParams_local) !== '{}') {
          requestData.transmitParam = JSON.stringify(queryParams_local);
        }
        if (this.templateValue && this.templateValue['base_doc_type']) {
          requestData.condition = this.templateValue['base_doc_type'];
        }
        requestData.isNotLeafSelected = this.notLeafSelectable;
        this.$http({
          url: '/uitemplate_web/iref_ctr/commonRefsearch',
          method: 'post',
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          this.$emit('dataFetched');
          let treeData = [];
          if (res && res.data && Array.isArray(res.data.data)) {
            treeData = Utils.formatTreeData(res.data.data, this.lazyTree);
          }
          if (this.lazyTree && typeof resolve === 'function') {
            return resolve(treeData);
          } else {
            this.treeData = treeData;
          }
        }).catch(err => {
          console.log(JSON.stringify(err));
          if (this.lazyTree && typeof resolve === 'function') {
            return resolve([]);
          }
        });
      },

      initRefInfoRelated() {
        const lazyTree = this.refInfo.isLazyload === true;
        this.lazyTreeField = this.refInfo.cfgParam || 'id';
        this.lazyTree = lazyTree;
        if (lazyTree) {
          this.treeProps.isLeaf = 'fe_isLeaf';
        }
      },
    },
    created() {
      this.initRefInfoRelated();
      this.getTreeRef();
    },
  }
</script>
<style scoped>
  .tree-ref-tree {
    overflow: auto;
  }
</style>
