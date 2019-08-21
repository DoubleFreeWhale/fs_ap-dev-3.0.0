<template>
  <div class="panel-container"
    :class="{
      'no-tab-header': !showFrePanel,
    }"
    :style="{
      position: panelShowType === 'dialog' ? 'static' : 'relative',
      'padding-bottom': panelShowType !== 'dialog' ? '64px': ''
    }">
    <div class="panel-content-container"
      :style="{
        height: refDialogBodyHeight + 'px'
      }">

      <!-- flat ref ( only single select ) -->
      <flat-ref
        v-if="refInfo.refUIType === 'RefFlat'"
        :templateValue="templateValue"
        :refInfo="refInfo"
        :selected="localSelected"
        :showFrePanel="showFrePanel"
        :queryParams="queryParams"
        :contentHeight="contentHeight"
        @select="setSelectedByEmitter"
        @nodeDblClick="nodeDblClick">
        <!-- :contentHeight="height" -->
      </flat-ref>
      <div v-else class="tabs-contaienr">
        <!-- no need for flat ref -->
        <div class="filter-options-container">
          <el-input
            v-if="refInfo.refUIType !== 'RefFlat'"
            placeholder="输入关键字进行过滤"
            icon="search"
            class="filter-input"
            v-model="filterText"
            @keyup.native.enter="getSuggestions"
            :on-icon-click="getSuggestions">
          </el-input>
          <el-checkbox
            v-if="refInfo.refUIType === 'RefTree' && isMutiSelect"
            class="child-auto-check"
            v-model="childAutoCheck">
            包含下级
          </el-checkbox>
        </div>
        <!-- refs -->
        <el-tabs
          v-model="refTabsActiveName"
          class="ref-dialog-tabs"
          @tab-click="handleRefTabClick">
          <el-tab-pane v-if="showFrePanel" label="常用" name="frequentlyUsed">
            <frequent-ref
              v-if="showFrePanel"
              :templateValue="templateValue"
              :refInfo="refInfo"
              :selected="localSelected"
              :showFrePanel="showFrePanel"
              :queryParams="queryParams"
              :isMutiSelect="isMutiSelect"
              :contentHeight="contentHeight"
              @select="setSelectedByEmitter"
              @nodeDblClick="nodeDblClick">
            </frequent-ref>
          </el-tab-pane>
          <el-tab-pane label="全部" name="allRef">
            <tree-ref
              v-if="refInfo.refUIType === 'RefTree'"
              :templateValue="templateValue"
              :refInfo="refInfo"
              :selected="localSelected"
              :filterText="filterText"
              :queryParams="queryParams"
              :notLeafSelectable="notLeafSelectable"
              :isMutiSelect="isMutiSelect"
              :contentHeight="contentHeight"
              :childAutoCheck="childAutoCheck"
              :shouldFetchData="shouldFetchData"
              @dataFetched="dataFetched"
              @select="setSelectedByEmitter"
              @nodeDblClick="nodeDblClick">
            </tree-ref>
            <table-ref
              v-else-if="refInfo.refUIType === 'RefGrid'"
              :templateValue="templateValue"
              :refInfo="refInfo"
              :selected="localSelected"
              :filterText="filterText"
              :queryParams="queryParams"
              :isMutiSelect="isMutiSelect"
              :contentHeight="contentHeight"
              :shouldFetchData="shouldFetchData"
              @dataFetched="dataFetched"
              @select="setSelectedByEmitter"
              @nodeDblClick="nodeDblClick">
            </table-ref>

            <tree-table-ref
              v-else-if="refInfo.refUIType === 'RefGridTree'"
              :templateValue="templateValue"
              :refInfo="refInfo"
              :selected="localSelected"
              :filterText="filterText"
              :queryParams="queryParams"
              :notLeafSelectable="notLeafSelectable"
              :isMutiSelect="isMutiSelect"
              :contentHeight="contentHeight"
              :shouldFetchData="shouldFetchData"
              @dataFetched="dataFetched"
              @select="setSelectedByEmitter"
              @nodeDblClick="nodeDblClick">
            </tree-table-ref>

            <div v-else
              :style="{
                height: contentHeight + 'px',
                overflow: 'hidden'
              }"></div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 已选 panel -->
      <selected-panel v-if="showSelected"
        :selected="localSelected"
        @collapse="selectedPanelCollapse"
        @selectChange="setSelectedByEmitter"></selected-panel>

    </div>

    <!-- footer -->
    <div slot="footer" class="ref-panel-footer">
      <el-button @click="panelCancel">取 消</el-button>
      <el-button type="primary" @click="panelConfirm">确 定</el-button>
    </div>
  </div>
</template>

<script>
  import SelectedPanel from './selected.vue';
  import FrequentRef from './frequentRef.vue';
  import FlatRef from './flatRef.vue';
  import TreeRef from './treeRef.vue';
  import TableRef from './tableRef.vue';
  import TreeTableRef from './treeTableRef.vue';
  export default {
    name: 'IfbpRefPanel',
    components: {
      'selected-panel': SelectedPanel,
      'frequent-ref': FrequentRef,
      'flat-ref': FlatRef,
      'tree-ref': TreeRef,
      'table-ref': TableRef,
      'tree-table-ref': TreeTableRef,
    },
    props: {
      isMutiSelect: Boolean,
      // 非叶子节点是否可以选择(单选树)
      notLeafSelectable: Boolean,
      // 是否显示已选
      showSelected: Boolean,
      templateValue: Object,
      refInfo: Object,
      defaultFilterStr: String,
      selected: Array,
      queryParams: Object,
      panelShowType: String,
      height: Number,
      panelVisible: Boolean,
    },
    data() {
      return {
        filterText: '',
        contentHeight: 280,
        refDialogBodyHeight: 280,
        refTabsActiveName: 'frequentlyUsed',
        localSelected: [],
        showFrePanel: true,

        // filter input change
        shouldFetchData: false,

        // timer for debounce when calculating container height
        setHeightTimer: null,
        childAutoCheck: false,
      };
    },
    watch: {
      // refInfo(val) {
      //   this.resetRefInfoRelated(val);
      // },
      refInfo: {
        handler() {
          this.initRefInfoRelated();
          // fetch data again
          this.getSuggestions();
        },
        deep: true
      },
      selected: {
        handler() {
          this.initSelectedArr();
        },
        deep: true
      },
      defaultFilterStr(val) {
        this.filterText = val || '';
      },
      // queryParams: {
      //   handler() {
      //     // fetch data again
      //     // this.getSuggestions();
      //   },
      //   deep: true
      // },
      // templateValue: {
      //   handler(newVal, oldVal) {
      //     if (
      //       this.refInfo.refCode === 'bdpsndoc' &&
      //       (newVal && oldVal && newVal.base_doc_type !== oldVal.base_doc_type)
      //     ) {
      //       this.getSuggestions();
      //     }
      //   },
      //   deep: true
      // },
      panelVisible(val) {
        if (val) {
          this.getSuggestions();
        }
      },
    },
    methods: {
      // filter text change, and trigger fetch event in child components
      getSuggestions() {
        this.shouldFetchData = true;
      },
      // set should fetch data false
      dataFetched() {
        this.shouldFetchData = false;
      },

      handleRefTabClick(tab) {
        if (!tab) {
          return;
        }
        const tabName = tab.name;
        if (!tabName) {
          return;
        }
      },


      /**
       * new version
       */
      // init selected array to a local array
      initSelectedArr() {
        this.localSelected = Array.isArray(this.selected) ? this.selected.slice() : [];
      },
      // init refInfo related params
      initRefInfoRelated() {
        // hide frequently used refs
        if (this.refInfo.isHotspot === false) {
          this.showFrePanel = false;
          // show 'all' panel
          this.refTabsActiveName = 'allRef';
        }
      },

      // calculating container height
      setContentHeight(selectedPanelVisible) {
        const heightWithoutHeaderAndFooter = window.innerHeight - 64 * 2 - 65 - 64;
        // 最小取400, 防止过度挤压
        // let _contentHeight = Math.max(parseInt(heightWithoutHeaderAndFooter, 10), 320);
        let _contentHeight = parseInt(heightWithoutHeaderAndFooter, 10);
        // 最大500, 防止大屏幕空白太多
        _contentHeight = Math.min(_contentHeight, 500);
        let _tabsHeaderHeight = 48 + 16; // tab title
        if (this.refInfo.refUIType === 'RefFlat') {
          _tabsHeaderHeight = 40; // 分组
        } else if (this.refInfo.refUIType === 'RefGridTree') {
          _tabsHeaderHeight += 30; // 面包屑
        }
        _contentHeight -= _tabsHeaderHeight;
        if (this.height) {
          _contentHeight = this.height;
        }
        // set dialog height to avoid dialog height change
        this.refDialogBodyHeight = _contentHeight + _tabsHeaderHeight;
        const selectedCollapsed = 48;
        const selectedExpanded = 150;
        if (this.showSelected) {
          _contentHeight -= 14; // margin
          if (selectedPanelVisible) {
            _contentHeight -= selectedExpanded;
          } else {
            _contentHeight -= selectedCollapsed;
          }
        }
        this.contentHeight = _contentHeight;
        console.log(_contentHeight);
      },

      // calculating container height with debounce
      debounceSetContentHeight() {
        if (this.setHeightTimer) {
          clearTimeout(this.setHeightTimer);
        }
        this.setHeightTimer = setTimeout(() => {
          this.setHeightTimer = null;
          this.setContentHeight();
        }, 300);
      },

      /**
       * collapse event of selected panel, for handling container height
       * @param val: activated collapse items array
       */
      selectedPanelCollapse(val) {
        let selectedPanelVisible = false;
        if (Array.isArray(val) && val.length) {
          selectedPanelVisible = true;
        }
        this.setContentHeight(selectedPanelVisible);
      },

      /**
       * setting selected array to an emitting array
       * @param sel: selected Objects or Object (Array || Object)
       */
      setSelectedByEmitter(sel) {
        this.localSelected = Array.isArray(sel) ? sel : (sel ? [sel] : []);
      },

      // trigger select event when double click and not multiple
      nodeDblClick(val) {
        if (this.isMutiSelect) {
          return;
        }
        // data already passed by click event
        // this.localSelected = val;
        this.panelConfirm();
      },

      panelCancel() {
        this.initSelectedArr();
        this.$emit('customRefCancel');
      },
      panelConfirm() {
        this.$emit('customRefConfirm', this.localSelected);
      },
    },
    created() {
      // init refInfo
      this.initRefInfoRelated();
      // init selected
      this.initSelectedArr();
      // init filter input
      this.filterText = this.defaultFilterStr || '';
      // init content height
      this.setContentHeight();
      window.addEventListener('resize', this.debounceSetContentHeight);
      // window.addEventListener('resize', () => {
      //   this.debounceSetContentHeight();
      // });
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.debounceSetContentHeight);
    },
  };
</script>
<style scoped>
  /* new version */
  /* .panel-container {
    position: static;
    padding-bottom: 64px;
  } */
  .ref-panel-footer {
    position: absolute;
    bottom: 0;
    right: 0;
    box-sizing: border-box;
    width: 100%;
    text-align: right;
    padding: 16px;
    background: #fff;
    z-index: 2;
  }
  .panel-container .filter-options-container {
    position: absolute;
    /* 64px (header) + 8px (edge) */
    top: 8px;
    right: 16px;
    z-index: 2;
  }
  .panel-container.no-tab-header .filter-options-container {
    top: 16px;
  }
  .panel-container .filter-input {
    width: 192px;
  }
  .panel-container .child-auto-check {
    margin-left: 16px;
  }
  .panel-container .tabs-contaienr {
    position: relative;
  }
</style>
<style>
  .ref-dialog .el-dialog .el-dialog__body {
    /* adjust footer style */
    position: static;
    padding: 0 0 64px;
  }
  .panel-container .el-tabs>div {
    margin-left: 0 !important;
  }
  .panel-container .el-tabs__nav {
    margin-left: 0 !important;
  }
  .panel-container .ref-dialog-tabs {
    background-color:#FFF;
    padding: 0 16px;
  }
  .panel-container .ref-dialog-tabs > .el-tabs__header {
    border-bottom: 1px solid #F0F0F5;
    margin-bottom: 16px;
  }
  .panel-container.no-tab-header  .ref-dialog-tabs > .el-tabs__header {
    opacity: 0;
  }
  .panel-container .el-tabs__item {
    height: 48px;
    line-height: 48px;
    /* max-width: 170px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; */
  }
  .panel-container .el-tabs__item::selection {
    color: inherit;
  }
  .panel-container .el-tabs__item .el-cascader__label {
    line-height: 48px;
  }
  .panel-container .el-tree {
    border:  none;
  }
  .panel-container .el-table tr .el-table-operate-icon {
    display: inline-block;
    visibility: hidden;
  }
  .panel-container .el-table__body tr:hover .el-table-operate-icon {
    visibility: visible;
  }
  .panel-container .el-tree-node__content:hover {
    background: #EAF9FF;
  }
  .panel-container .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background: #C1E5FD;
  }
  .panel-container .el-tree .el-tree-node__label{
    max-width:95%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:nowrap;
  }
  .panel-container .el-pagination {
    margin-top: 14px;
  }
</style>
