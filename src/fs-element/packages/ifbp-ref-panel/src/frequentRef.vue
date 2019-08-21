<template>
  <div class="frequent-ref-container">
    <div v-if="!Array.isArray(frequentlyUsedRef) || !frequentlyUsedRef.length"
      :style="{
        height: contentHeight + 'px'
      }">
      {{ freErrMsg || '未获取到常用数据' }}
    </div>
    <template v-else-if="['RefGridTree', 'RefGrid'].indexOf(refInfo.refUIType) !== -1">
      <el-table
        class="transition-height"
        :data="frequentlyUsedRef"
        highlight-current-row
        @current-change="handleNodeClick"
        @row-dblclick="nodeDblClick"
        @select="handleFreTabSelectChange"
        @select-all="handleFreTabSelectChange"
        :height="contentHeight"
        ref="freTableRef">
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
    </template>
    <template v-else-if="refInfo.refUIType === 'RefTree'">
      <el-tree
        class="transition-height"
        :data="frequentlyUsedRef"
        :props="treeProps"
        node-key="id"
        :check-strictly="true"
        :show-checkbox="isMutiSelect"
        ref="freTreeRef"
        :highlight-current="true"
        :filter-node-method="filterNode"
        :current-node-key="currentTreeNodeKeys"
        :style="{
          height: contentHeight + 'px',
          overflow: 'auto'
        }"
        @check-change="handleCheckChange"
        @node-click="handleNodeClick"
        @node-dblclick="nodeDblClick">
      </el-tree>
    </template>
  </div>
</template>

<script>
  import Utils from './utils.js';
  export default {
    name: 'IfbpFrequentRef',
    props: {
      templateValue: Object,
      refInfo: Object,
      queryParams: Object,
      selected: Array,
      contentHeight: Number,
      isMutiSelect: Boolean,
      notLeafSelectable: Boolean,
      contentHeight: Number,
    },
    data() {
      return {
        // freErrMsg: '正在获取常用参照...',
        freErrMsg: '',
        frequentlyUsedRef: null,
        currentTreeNodeKeys: '',
        treeProps: {
          children: 'children',
          label: 'reflabel',
          id: 'id'
        },
        notLeafClicked: false,
        strFieldCode: ['code', 'name'],
        strFieldName: ['编码', '名称'],
      };
    },
    watch: {
      selected: {
        handler() {
          this.setSelected();
        },
        deep: true
      },
    },
    methods: {
      // request data of frequently used ref
      getFrequentlyUsedRefs() {
        Utils.getFrequentlyUsedRefs(this).then(resData => {
          if (resData && Array.isArray(resData.frequentlyUsedRef)) {
            this.frequentlyUsedRef = resData.frequentlyUsedRef;
            if (resData.strFieldCode) {
              this.strFieldCode = resData.strFieldCode;
            }
            if (resData.strFieldName) {
              this.strFieldCode = resData.strFieldName;
            }
          }
          this.setSelected();
        }).catch(errMsg => {
          this.freErrMsg = errMsg;
          console.log(errMsg);
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
          if (this.refInfo.refUIType === 'RefTree') {
            if (this.isMutiSelect) {
              if (!this.$refs.freTreeRef) {
                return;
              }
              this.$refs.freTreeRef.setCheckedKeys(sel);
            } else {
              this.currentTreeNodeKeys = (Array.isArray(sel) && sel.length) ? sel[0] : '';
            }
          } else {
            if (!this.$refs.freTableRef || !Array.isArray(this.frequentlyUsedRef)) {
              return;
            }
            this.frequentlyUsedRef.forEach((v) => {
              if (v.id && sel.indexOf(v.id) !== -1) {
                this.$refs.freTableRef.toggleRowSelection(v, true);
              } else {
                this.$refs.freTableRef.toggleRowSelection(v, false);
              }
            });
          }
        });
      },

      /**
       * click related events
       */
      // multiple ref check change event for tree
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
          if (data) {
            this.$emit('select', [data]);
          }
          return;
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

      handleFreTabSelectChange(selection) {
        if (!this.isMutiSelect) {
          return;
        }
        var table = [];
        var cur = [];
        this.frequentlyUsedRef.forEach((v) => {
          table.push(v.id);
        });
        this.selected.forEach((v) => {
          if (table.indexOf(v.id) < 0) {
            cur.push(v);
          }
        });
        this.$emit('select', cur.concat(selection));
      },

      // reserved from old version
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
    },
    created() {
      this.getFrequentlyUsedRefs();
    },
  };
</script>
<style scoped>
  .flat-ref {
    padding: 0 16px;
  }
  .flat-ref-groups {
    display: flex;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .flat-ref-groups span {
    flex: 1;
    background: #EAF9FF;
    font-size: 14px;
    color: #2D2D2D;
    border-right: 1px solid #fff;
    cursor: pointer;
  }
  .flat-ref-groups .current,
  .flat-ref-groups span:hover {
    background: #5AC8FA;
    color: #FFFFFF;
  }
  .flat-ref-options {
    overflow: auto;
  }
  .flat-ref-label,
  .flat-ref-option {
    margin-top: 8px;
    padding: 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    line-height: 14px;
    color: #2D2D2D;
  }
  .flat-ref-option {
    cursor: pointer;
  }
  .flat-ref-option::selection,
  .tree-node-childnode:selection,
  .tree-breadcrumbs span::selection {
    color: inherit;
  }
  .flat-ref-label,
  .flat-ref-option:hover,
  .flat-ref-option.current {
    color: #5AC8FA;
  }
</style>
