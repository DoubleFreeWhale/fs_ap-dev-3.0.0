<template>
    <div>
        <el-dialog
          v-model="visible"
          class="ref-dialog"
          :custom-class = "'dialog_' + coed"
          :class="{
            'flat-ref-dialog': isFlatRef
          }"
          :title="dialogTitle || refInfo.refName"
          :size="size"
          @close="closeDialog"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="dialogShowClose || false">
          <el-input
            v-if="!isFlatRef"
            placeholder="输入关键字进行过滤"
            icon="search"
            class="filter-input"
            v-model="filterText"
            @keyup.native.enter="getSuggestions"
            :on-icon-click="getSuggestions">
          </el-input>
          <div class="ufold" @click="ufoldClick($event)">
            <i class="el-icon-pt-fenlei1"></i>
          </div>
          <div class="ref-dialog-body-container" :style="{
            height: refDialogBodyHeight + 'px'
          }">
            <div
              v-if="isFlatRef"
              class="flat-ref">
              <div v-if="Array.isArray(strFieldName) && strFieldName.length"
                class="flat-ref-groups">
                <span
                  :class="{
                    current: currentFlatGroupIndex === 'fre'
                  }"
                  @click="flatRefGroupChange('fre')">常用</span>
                <span v-for="(groupName, groupNameIndex) in strFieldName"
                  :class="{
                    current: currentFlatGroupIndex === groupNameIndex
                  }"
                  :key="groupNameIndex"
                  @click="flatRefGroupChange(groupNameIndex)">{{ groupName }}</span>
              </div>
              <div class="flat-ref-options"
                :style="{
                  height: contentHeight + 'px'
                }">
                <!-- 常用 -->
                <div v-if="currentFlatGroupIndex === 'fre'">
                  <div
                    v-if="!Array.isArray(frequentlyUsedRef) || !frequentlyUsedRef.length"
                    style="padding: 16px;">
                    {{ freErrMsg || '未获取到常用数据' }}
                  </div>
                  <el-row v-else>
                    <el-col :span="23" :offset="1">
                      <el-row>
                        <el-col :span="4"
                          v-for="(option, optionIndex) in frequentlyUsedRef"
                          :key="optionIndex"
                          :title="option.code ? option.code + ' ' + option.name : option.name"
                          class="flat-ref-option"
                          :class="{
                            current: selectedFlatRefId.indexOf(option.id) !== -1
                          }"
                          @click.native="flatRefClicked(option)"
                          @dblclick.native="nodeDblClick(option)">{{ option.name }}</el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </div>
                <!-- 带标签 -->
                <template v-else-if="Object.prototype.toString.call(tableData) === '[object Object]'">
                  <el-row v-for="(flatOptions, flatLabel) in tableData"
                    :key="flatLabel">
                    <el-col class="flat-ref-label" :span="1">{{ flatLabel }}</el-col>
                    <el-col :span="23">
                      <el-row>
                        <el-col :span="4"
                          v-for="(option, optionIndex) in flatOptions"
                          :key="optionIndex"
                          :title="option.refcode ? option.refcode + ' ' + option.refname : option.refname"
                          class="flat-ref-option"
                          :class="{
                            current: selectedFlatRefId.indexOf(option.id) !== -1
                          }"
                          @click.native="flatRefClicked(option)"
                          @dblclick.native="nodeDblClick(option)">{{ option.name || option.refname }}</el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
                <!-- 不带标签 -->
                <template v-else-if="Array.isArray(tableData) && tableData.length">
                  <el-row>
                    <el-col :span="23" :offset="1">
                      <el-row>
                        <el-col :span="4"
                          v-for="(option, optionIndex) in tableData"
                          :key="optionIndex"
                          :title="option.refcode ? option.refcode + ' ' + option.refname : option.refname"
                          class="flat-ref-option"
                          :class="{
                            current: selectedFlatRefId.indexOf(option.id) !== -1
                          }"
                          @click.native="flatRefClicked(option)"
                          @dblclick.native="nodeDblClick(option)">{{ option.name || option.refname }}</el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
                <div v-else style="padding: 12px 12px 100px;">
                  <!-- 暂无数据…… -->
                </div>
              </div>
            </div>
            <el-tabs v-else class="ref-dialog-tabs" v-model="refTabsActiveName" @tab-click="handleRefTabClick">
              <el-tab-pane v-if="showFrePanel" label="常用" name="frequentlyUsed">
                <div
                  v-if="!Array.isArray(frequentlyUsedRef) || !frequentlyUsedRef.length"
                  :style="{
                    height: contentHeight + 'px'
                  }">
                  {{ freErrMsg || '未获取到常用数据' }}
                </div>
                <div v-else>
                  <template v-if="['RefGridTree', 'RefGrid'].indexOf(refInfo.refUIType) !== -1">
                    <el-table
                      class="transition-height"
                      :data="frequentlyUsedRef"
                      highlight-current-row
                      @current-change="handleCurrentChange"
                      @row-dblclick="nodeDblClick"
                      @select="handleFreTabSelectChange"
                      @select-all="handleFreTabSelectChange"
                      :height="contentHeight - 1"
                      :style="{
                        marginBottom: '1px'
                      }"
                      ref="freTableRef">
                      <el-table-column
                        type="selection"
                        v-if="isMutiSelect"
                        width="55">
                      </el-table-column>
                      <el-table-column
                        v-for="(colName,index) in freStrFieldName"
                        :key="index"
                        :label="colName"
                        :property="freStrFieldCode[index]">
                      </el-table-column>
                    </el-table>
                  </template>
                  <template v-else-if="refInfo.refUIType === 'RefTree'">
                    <el-tree
                      class="transition-height"
                      :style="{
                        height: contentHeight + 'px',
                        overflow: 'auto'
                      }"
                      :data="frequentlyUsedRef"
                      :props="treeprops"
                      node-key="id"
                      :check-strictly="true"
                      :show-checkbox="isMutiSelect"
                      ref="freTreeRef"
                      :highlight-current="true"
                      :filter-node-method="filterNode"
                      :current-node-key="currentTreeNodeKeys"
                      @check-change="handleCheckChange"
                      @node-click="handleNodeClick"
                      @node-dblclick="nodeDblClick">
                    </el-tree>
                  </template>
                </div>
              </el-tab-pane>
              <el-tab-pane label="全部" name="first">
                <div v-if="refInfo.refUIType === 'RefGridTree'"
                  class="tree-selector-container">
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
                <div v-if="treeData && treeData.length">
                  <el-tree
                    v-if="lazyTree"
                    class="transition-height"
                    :style="{
                      height: contentHeight + 'px',
                      overflow: 'auto'
                    }"
                    :data="treeData"
                    :props="lazyTreeProps"
                    lazy
                    :load="lazyTreeLoad"
                    :node-key="lazyTreeField"
                    :check-strictly="true"
                    :show-checkbox="isMutiSelect"
                    ref="reftree"
                    :highlight-current="true"
                    :filter-node-method="filterNode"
                    :current-node-key="currentTreeNodeKeys"
                    @check-change="handleCheckChange"
                    @node-click="handleNodeClick"
                    @node-dblclick="nodeDblClick">
                  </el-tree>
                  <el-tree
                    v-else
                    class="transition-height"
                    :style="{
                      height: contentHeight + 'px',
                      overflow: 'auto'
                    }"
                    :data="treeData"
                    :props="treeprops"
                    node-key="id"
                    :check-strictly="true"
                    :show-checkbox="isMutiSelect"
                    ref="reftree"
                    :highlight-current="true"
                    :filter-node-method="filterNode"
                    :current-node-key="currentTreeNodeKeys"
                    @check-change="handleCheckChange"
                    @node-click="handleNodeClick"
                    @node-dblclick="nodeDblClick">
                  </el-tree>
                </div>
                <div v-else-if="tableData && tableData.length && Array.isArray(strFieldName) && strFieldName.length && Array.isArray(strFieldCode) && strFieldCode.length">
                  <el-table
                    class="transition-height"
                    :data="tableData"
                    highlight-current-row
                    empty-text="暂无数据……"
                    @current-change="handleCurrentChange"
                    @row-dblclick="nodeDblClick"
                    @select="handleTabSelectChange"
                    @select-all="handleTabSelectChange"
                    :height="showPagination ? contentHeight - 46 : contentHeight - 1"
                    :style="{
                      marginBottom: showPagination ? '' : '1px'
                    }"
                    ref="refTable">
                    <el-table-column
                      type="selection"
                      v-if="isMutiSelect&&refInfo.refUIType!=='RefTree'"
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

                <div v-else
                  :style="{
                    height: contentHeight + 'px',
                    overflow: 'hidden'
                  }"></div>
              </el-tab-pane>
            </el-tabs>
            <el-collapse
              v-if="showSelected"
              v-model="activeCollapseName_selected"
              class="selected-panel"
              @change="selectedPanelCollapse">
              <el-collapse-item :title="'已选' + (Array.isArray(selected) && selected.length ? '(' + selected.length + ')' : '')" name="selected">
                <el-tag
                  class="selected-tag"
                  v-for="(tag, index) in selected"
                  :key="index"
                  type="primary-outline"
                  closable
                  closeTransition
                  @close="removeSelected(index)">{{ tag.refname || tag.name }}</el-tag>
                <span
                  v-if="selected.length"
                  class="btn-clear-selected"
                  @click="clearSelected">清空</span>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCloseSelf('cancel')">取 消</el-button>
            <el-button type="primary" @click="handleCloseSelf('confirm')">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
    import Clickoutside from 'ifbp-element/src/utils/clickoutside';
    export default {
      props: ['maxHeight','isMutiSelect', 'dialogVisible', 'refData', 'children', 'label', 'refInfo', 'savedSelected', 'templateValue', 'queryParams', 'size', 'treeTableTree', 'dialogTitle', 'dialogShowClose', 'isFlatRef', 'notLeafSelectable', 'totalElementsInitial', 'defaultFilterStr', 'showSelected', 'frequentlyUsedRef', 'freErrMsg', 'freStrFieldCode', 'freStrFieldName', 'showFrePanel'],
      directives: {
        Clickoutside
      },
      data() {
        return {
          coed:"",	      	
          urefClientWidth: '',
          rflag: 'true',
          refTabsActiveName: 'frequentlyUsed',
          selected: [],
          treeData: [],
          // 外部引用可以添加的属性
          treeprops: {
            children: 'children',
            // label: 'refname',
            label: 'reflabel',
            id: 'id'
          },
          lazyTreeProps: {
            children: 'children',
            // label: 'refname',
            label: 'reflabel',
            id: 'id',
            isLeaf: 'fe_isLeaf'
          },
          styleTree: {
            width: '100%'
          },
          tableData: [],
          currentRow: null,
          styleTable: {
            width: '100%'
          },
          strFieldCode: [],
          strFieldName: [],
                // dialogVisible: true,
          filterText: '',
          visible: false,
          timeid: '',
          currentTreeNodeKeys: '',
          currentTreeNodePk: null,
          treeNodeField: 'refpk',
          contentHeight: 280,
          localData: [],
          currentFlatRef: null,
          currentFlatGroupIndex: 'fre',
          selectedFlatRefId: [],

          // 树表
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
          // 临时保存变量
          /**
           * 分页
           */
          currentPage: 1,
          pageSize: 10,
          totalElements: 0,
          // 点击了树的非叶子节点
          notLeafClicked: false,
          // 是否显示分页
          showPagination: false,
          // 树是否懒加载
          lazyTree: false,
          // 树懒加载时传递的字段
          lazyTreeField: 'id',

          /**
           * 已选
           */
          selectedPanelVisible: false,
          activeCollapseName_selected: [],
          refDialogBodyHeight: 280,
        };
      },
      watch: {
        // refInfo(val) {
        //   this.resetRefInfoRelated(val);
        // },
        refData() {
          this.adjustRefData();
          this.setTableColNames();
        },
        dialogVisible(val) {
          this.visible = val;
          if (val === true) {
            // this.currentFlatGroupIndex = 0;
            // this.adjustRefData();
            // this.formatSelectedArr();
            // this.setSelected();
            // this.setTableColNames();
            // this.setTreeTableTreeDefaultNode();
            // this.bindMouseEventForGridTree();
            // this.resetRefInfoRelated();

			this.coed = Date.parse(new Date());
            this.filterText = this.defaultFilterStr || '';
            this.currentFlatGroupIndex = 'fre';
            // this.refTabsActiveName = 'frequentlyUsed';
            this.refTabsActiveName = this.showFrePanel ? 'frequentlyUsed' : 'first';
            if (this.refInfo.refUIType === 'RefGridTree') {
              this.currentTreeNodePk = null;
              this.getTreeTableTree();
            }
            this.setContentHeight();
            this.formatSelectedArr();
            this.setSelected();
            this.setTableColNames();
            // this.setTreeTableTreeDefaultNode();
            this.bindMouseEventForGridTree();
            this.resetRefInfoRelated();
            this.$nextTick(()=>{
            	$(".dialog_"+this.coed+" .el-dialog__body").css("max-height",this.maxHeight + "px")
            })
            
          }
        }
      },
      mounted() {

        this.$nextTick(() => {
          this.adjustRefData();
        });
        window.addEventListener('resize', this.resizeListener);
        // window.addEventListener('resize', () => {
        //   this.adjustRefData.call(this);
        // });
      },
      beforeDestroy() {
        window.removeEventListener('resize', this.resizeListener);
      },
      // computed: {
      //   visible: function() {
      //     return this.dialogVisible;
      //   }
      // },
      created() {
        // this.dialogVisible = this.props.dialogVisible;
        // this.treeprops = {
        //   children: this.children,
        //   label: this.label
        // };
        this.adjustRefData();
        this.bindMouseEventForGridTree();
      },
      beforeMount() {
      },
      methods: {
        resizeListener(){
          this.adjustRefData.call(this);
        },
        resetRefInfoRelated(refInfo) {
          refInfo = refInfo || this.refInfo;
          this.treeNodeField = refInfo.cfgParam || 'refpk';
          // 分页
          if (refInfo.isPageable === true) {
            this.showPagination = true;
          }
          // 树懒加载
          if (refInfo.isLazyload === true) {
            this.lazyTree = true;
          }
          // 懒加载传值字段
          this.lazyTreeField = refInfo.cfgParam || 'id';
          this.totalElements = this.totalElementsInitial;
          this.currentPage = 1;
        },
        handleClickoutside() {
          if (this.urefClientWidth >= 320 && this.urefClientWidth < 767) {
            if (this.refInfo.refUIType === 'RefGridTree') {
              document.querySelector('.ufold').style.display = 'block';
              this.styleTree = {width: '30%', position: 'absolute', left: '-30%'};
              this.rflag = true;
            }
          }
        },
        ufoldClick(event) {
          if (this.rflag) {
            event.currentTarget.style.display = 'none';
            this.styleTree = { width: '70%', position: 'absolute', left: '0', zIndex: '1000'};
            this.rflag = false;
          } else {
            event.currentTarget.style.display = 'block';
            this.rflag = true;
          }

        },
        adjustRefData() {
          if (this.refData && this.refData.data) {
            this.setDialogData(this.refData.data);
          }
          this.local_treeTableTree = this.treeTableTree || [];
        },
        setContentHeight() {
          const heightWithoutHeaderAndFooter = window.innerHeight - 64 * 2 - 65 - 64;
          // 最小取400, 防止过度挤压
          let _contentHeight = Math.max(parseInt(heightWithoutHeaderAndFooter, 10), 320);
          // 最大500, 防止大屏幕空白太多
          _contentHeight = Math.min(_contentHeight, 500);
          let _tabsHeaderHeight = 48 + 16; // tab title
          if (this.isFlatRef) {
            _tabsHeaderHeight = 40; // 分组
          } else if (this.refInfo.refUIType === 'RefGridTree') {
            _tabsHeaderHeight += 30; // 面包屑
          }
          this.refDialogBodyHeight = _contentHeight + _tabsHeaderHeight;
          const selectedCollapsed = 48;
          const selectedExpanded = 150;
          if (this.showSelected) {
            _contentHeight -= 14; // margin
            if (this.selectedPanelVisible) {
              _contentHeight -= selectedExpanded;
            } else {
              _contentHeight -= selectedCollapsed;
            }
          }
          this.contentHeight = _contentHeight;
        },
        filterNode(value, data) {
          if (!value) return true;
          return data.name.indexOf(value) !== -1;
        },
        getSuggestions() {
          if (this.refInfo.isLazyload) {
            this.queryParams.lazy_param = null;
            this.queryParams.lazy_object = null;
          }
          // 模糊查询触发
          var tmp = function() {
            this.currentPage = 1;
            this.querySearch();
            this.timeid = false;
          }.bind(this);
          if (!this.timeid) {
            this.timeid = setTimeout(tmp, 300);
          } else {
            clearTimeout(this.timeid);
            this.timeid = setTimeout(tmp, 300);
          }
        },
        querySearch() {
          const searchStr = this.filterText;
          let requestData;
          try {
            requestData = JSON.parse(JSON.stringify(this.refInfo));
          } catch (error) {
            requestData = {};
          }
          requestData.content = searchStr;

          let queryParams_local = this.queryParams || {};
          if (this.refInfo.isLazyload) {
            queryParams_local.lazy_param = null;
            queryParams_local.lazy_object = null;
          }
          if (queryParams_local && JSON.stringify(queryParams_local) !== '{}') {
            requestData.transmitParam = JSON.stringify(queryParams_local);
          }

          // if (this.queryParams && JSON.stringify(this.queryParams) !== '{}') {
          //   requestData.transmitParam = JSON.stringify(this.queryParams);
          // }
          if (this.templateValue && this.templateValue['base_doc_type']) {
            requestData.condition = this.templateValue['base_doc_type'];
          }

          let requestUrl = '/uitemplate_web/iref_ctr/commonRefsearch';
          if (this.refInfo.refUIType === 'RefGridTree') {
            requestData.clientParam = this.currentTreeNodePk;
            requestUrl = '/uitemplate_web/iref_ctr/blobRefSearch';
          }
          // 分页
          if (['RefGrid', 'RefGridTree'].indexOf(this.refInfo.refUIType) > -1) {
            let pageInfo = {
              pageSize: this.pageSize,
              currPageIndex: this.currentPage - 1
            };
            requestData.refClientPageInfo = pageInfo;
          }
          this.$http({
            url: requestUrl,
            method: 'post',
            data: requestData,
            headers: {
              'Content-Type': 'application/json'
            }
          }).then((res) => {
            if (!res || !res.data || !res.data.data) {
              return;
            }
            var refData = res.data.data;
            refData = this.getRefData(refData);
            this.setDialogData(refData);
            if (!res.data.refViewModel) {
              return;
            }
            if (res.data.refViewModel.refClientPageInfo && res.data.refViewModel.refClientPageInfo.pageCount) {
              this.totalElements = res.data.refViewModel.refClientPageInfo.pageCount;
            }
            if (res.data.refViewModel.strFieldCode) {
              this.strFieldCode = res.data.refViewModel.strFieldCode;
            }
            if (res.data.refViewModel.strFieldName) {
              this.strFieldName = res.data.refViewModel.strFieldName;
            }
          });
        },

        getRefData(data) {
          if (!data || !data.length) {
            return [];
          }
          var refData;
          if (['RefTree'].indexOf(this.refInfo.refUIType) > -1) {
            var map = {};
            var ids = [];
            var root = [];
            data.forEach(v => {
              ids.push(v.id);
              if (this.lazyTree) {
                v.fe_isLeaf = v.isLeaf === 'true';
              }
            });
            data.forEach(v => {
              if (ids.indexOf(v.pid) > -1) {
                if (map[v.pid]) {
                  map[v.pid].push(v);
                } else {
                  map[v.pid] = [v];
                }
              } else {
                root.push(v);
              }
            });
            var setChild = function(node) {
              var tmp = node;
              if (map[tmp.id]) {
                tmp.children = map[tmp.id];
                tmp.children.forEach(v => {
                  setChild(v);
                });
              }
            };
            root.forEach(v => {
              setChild(v);
            });
            refData = root;
          } else {
            refData = data;
          }
          return refData;
        },

        handleRefTabClick(tab) {
          this.$emit('onTabClick', tab);
          if (!tab) {
            return;
          }
          const tabName = tab.name;
          if (!tabName) {
            return;
          }
          switch (tabName) {
            // 常用tab
            case 'frequentlyUsed':
              this.setSelected();
              break;
            // 全部tab
            default:
                this.querySearch();
            // this.adjustRefData();
              break;
          }
        },
        onSelectData(data) {
          if (!this.isMutiSelect) {
            this.$emit('onSelectData', data);
          }
        },
        handleNodeClick(data, node) {
          if (!this.isMutiSelect && this.refInfo.refUIType === 'RefTree') {
            if (this.notLeafSelectable || data.isLeaf === 'true') {
              this.notLeafClicked = false;
              this.selected = [data];
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
            this.selected = [data];
          }
        },
        handleCheckChange(data, checked) {
          if (this.isMutiSelect) {
            // this.selected = this.$refs.reftree.getCheckedNodes();
            let dataId = data.id;
            let currentSelected = this.selected;
            if (!Array.isArray(currentSelected)) {
              currentSelected = [];
            }
            if (checked && currentSelected.every(ref => ref.id !== dataId)) {
              this.selected.push(data);
            }
            if (!checked && currentSelected.some(ref => ref.id === dataId)) {
              this.selected = currentSelected.filter(ref => ref.id !== dataId);
            }
          }
        },
        handleTabSelectChange(selection) {
          if (this.isMutiSelect) {
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
            this.selected = cur.concat(selection);
          }
        },
        handleCurrentChange(val) {
          if (!this.isMutiSelect) {
            this.selected = [val];
            // this.$emit('onSelectData', val);
          }
        },
        // 单选时, 双击节点触发选中
        nodeDblClick(val) {
          if (this.isMutiSelect) {
            return;
          }
          const childNodes = val.children;
          if (!this.notLeafSelectable && this.notLeafClicked) {
            return;
          }
          this.$emit('onSelectData', val);
        },
        loadList(data) {
          const requestData = {
            refModelUrl: this.refInfo.refModelUrl,
            condition: data.id
          };
          this.$http({
            url: '/uitemplate_web/iref_ctr/blobRefSearch',
            method: 'post',
            data: requestData,
            headers: {
              'Content-Type': 'application/json'
            }
          }).then((res) => {
            if (!res || !res.data || !res.data.data) {
              return;
            }
            this.tableData = res.data.data;
            this.setSelected();
          });

        },
        setSelected() {
          if (this.refTabsActiveName === 'frequentlyUsed') {
            this.setFreSelected();
            return;
          }
          var sel = [];
          this.selected.forEach((v) => {
            if (v.id) {
              sel.push(v.id);
            }
          });
          this.$nextTick(() => {
            if (this.refInfo.refUIType === 'RefTree') {
              if (this.isMutiSelect && this.$refs.reftree) {
                if (!this.$refs.reftree) {
                  return;
                }
                this.$refs.reftree.setCheckedKeys(sel);
              } else {
                this.currentTreeNodeKeys = (Array.isArray(sel) && sel.length) ? sel[0] : '';
              }
            } else if (this.isFlatRef) {
              this.selectedFlatRefId = sel;
            } else {
              // if (!sel.length) {
              //   return;
              // }
              if (!this.$refs.refTable) {
                return;
              }
              this.tableData.forEach((v) => {
                if (v.id && sel.indexOf(v.id) !== -1) {
                  this.$refs.refTable.toggleRowSelection(v, true);
                } else {
                  this.$refs.refTable.toggleRowSelection(v, false);
                }
              });
            }
          });
        },
        handleDelete(index, row) {
          this.selected.splice(index, 1);
          if (this.refInfo.refUIType === 'RefTree') {
            if (!this.$refs.reftree) {
              return;
            }
            this.$refs.reftree.setChecked(row.id, false);
          } else {
            var tmp;
            this.tableData.forEach((v) => {
              if (v.id === row.id) {
                tmp = v;
              }
            });
            if (!this.$refs.refTable) {
              return;
            }
            this.$refs.refTable.toggleRowSelection(tmp);
          }
        },
        lazyTreeLoad(node, resolve) {
          const nodeData = node.data;
          if (node.level === 0) {
            if (Array.isArray(nodeData) && nodeData.length) {
              return resolve(nodeData);
            }
            return resolve([]);
          }
          const lazy_param = nodeData && nodeData[this.lazyTreeField];
          if (!lazy_param) {
            return resolve([]);
          }
          let requestData;
          try {
            requestData = JSON.parse(JSON.stringify(this.refInfo));
          } catch (error) {
            requestData = {};
          }
          requestData.content = this.filterText || '';
          let queryParams_local = this.queryParams || {};
          queryParams_local.lazy_param = lazy_param;
          queryParams_local.lazy_object = nodeData;
          if (queryParams_local && JSON.stringify(queryParams_local) !== '{}') {
            requestData.transmitParam = JSON.stringify(queryParams_local);
          }
          this.$http({
            url: '/uitemplate_web/iref_ctr/commonRefsearch',
            method: 'post',
            data: requestData,
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(ref => {
            if (!ref || !ref.data || !Array.isArray(ref.data.data)) {
              return resolve([]);
            }
            let resData = this.getRefData(ref.data.data);
            resData = this.formatTreeLabel(resData);
            return resolve(resData);
          }).catch(err => {
            console.log(JSON.stringify(err));
            return resolve([]);
          });
        },
        closeDialog() {
          this.$emit('closeDialog');
          // 重置过滤文字
          this.filterText = '';
          // 下次打开 dialog 应显示第一个 tab
          this.refTabsActiveName = 'frequentlyUsed';
          // 清空数据
          this.clearDialogData();
        },
        handleCloseSelf(code) {
          if (code === 'confirm') {
            if (!this.notLeafSelectable && this.notLeafClicked) {
              this.$message({
                message: '不允许选择非末级数据',
                type: 'error'
              });
              return;
            }
            this.$emit('onSelectData', this.selected);
          }
          this.closeDialog();
        },

        // 提取出的初始化方法
        uresizeSc() {
          this.setDialogData(this.refData.data);
        },

        // 设置 dialog 数据
        setDialogData(dataArr) {
          this.localData = dataArr;
          if (!Array.isArray(dataArr) && this.refInfo.refUIType !== 'RefFlat') {
            this.localData = [];
            // this.formatSelectedArr();
            // console.log('参照 dialog 数据为空');
            return;
          }
          // this.formatSelectedArr();
          // 清空对话框数据
          this.clearDialogData();
          // 设置对话框数据
          switch (this.refInfo.refUIType) {
            case 'RefGrid':
            case 'RefGridTree':
            case 'RefFlat':
              this.tableData = dataArr;
              break;
            case 'RefTree':
              this.treeData = this.formatTreeLabel(dataArr);
              break;
            default:
              break;
          }
          // 设置选中
          if (dataArr && dataArr !== [] && dataArr !== {}) {
            this.setSelected();
          }
        },

        // 清除 dialog 数据
        clearDialogData() {
          this.tableData = [];
          this.listData = [];
          this.treeData = [];
        },

        // 格式化树状参照的显示(code + name)
        formatTreeLabel(dataArr) {
          if (!Array.isArray(dataArr)) {
            return dataArr;
          }
          for (let i = 0; i < dataArr.length; i++) {
            let refObj = dataArr[i];
            if (Object.prototype.toString.call(refObj) !== '[object Object]') {
              continue;
            }
            refObj.reflabel = refObj.refcode ? refObj.refcode + ' ' + refObj.refname : refObj.refname;
            if (refObj.children) {
              refObj.children = this.formatTreeLabel(refObj.children);
            }
          }
          return dataArr;
        },

        // 树表 cascader 点击
        handleCascaderItemClick(val) {
          this.currentTreeNodePk = val[this.treeNodeField];
          this.querySearch();
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
            this.local_treeTableTree = this.getRefData(res.data.data) || [];
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

        // 设置已选中tab中未赋予的字段
        formatSelectedArr() {
          let savedArr = JSON.parse(JSON.stringify(this.savedSelected));
          if (!savedArr || !Array.isArray(savedArr)) {
            this.selected = [];
            return;
          }
          const localDataArr = this.localData;
          let localDataObj = {};
          if (!localDataArr || !Array.isArray(localDataArr)) {
            this.selected = [];
            return;
          }
          for (let i = 0; i < localDataArr.length; i++) {
            const localData = localDataArr[i];
            const localId = localData.id;
            if (localId) {
              localDataObj[localId] = localData;
            }
          }
          for (let i = 0; i < savedArr.length; i++) {
            let savedObj = savedArr[i];
            const id = savedObj.id;
            if (localDataObj[id]) {
              savedArr[i] = localDataObj[id];
            }
          }
          this.selected = savedArr;
        },

        flatRefClicked(ref) {
          this.currentFlatRef = ref;
          this.selectedFlatRefId = [ref.id];
          this.selected = [ref];
        },

        flatRefGroupChange(index) {
          if (this.currentFlatGroupIndex === index) {
            return;
          }
          if (index === 'fre') {
            this.currentFlatGroupIndex = index;
            return;
          }
          this.requestFlatRef(index);
        },
        requestFlatRef(index) {
          if (!this.refInfo || !Array.isArray(this.refInfo.strFieldCode) || index > this.refInfo.strFieldCode.length - 1) {
            return;
          }
          this.$http({
            url: '/uitemplate_web/iref_ctr/getFlatRefData',
            method: 'post',
            data: {
              refModelUrl: this.refInfo.refModelUrl,
              content: this.refInfo.strFieldCode[index],
              isUseDataPower: this.refInfo.isUseDataPower,
              dataPowerOperation_Code: this.refInfo.dataPowerOperation_Code
            },
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => {
            if (!res || !res.data || !res.data.data) {
              return;
            }
            var refData = res.data.data;
            this.setDialogData(refData);
            this.currentFlatGroupIndex = index;
          });
        },

        // 设置树panel第一级数据(树表)
        setTreeTableTreeDefaultNode() {
          if (this.refInfo.refUIType !== 'RefGridTree') {
            return;
          }
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
        // 树表绑定移入移除事件
        bindMouseEventForGridTree() {
          if (this.refInfo.refUIType !== 'RefGridTree') {
            return;
          }
          let _this = this;
          /*eslint no-undef: "off"*/
          $('.ref-dialog').on('mouseenter', '.tree-breadcrumbs', function() {
            clearTimeout(_this.leaveTimer);
            _this.treeNodePanelVisible = true;
          });
          $('.ref-dialog').on('mouseleave', '.tree-selector-container', function() {
            _this.leaveTimer = setTimeout(() => {
              _this.treeNodePanelVisible = false;
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
          this.querySearch();
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
          this.querySearch();
        },

        /**
         * 分页
         */
        handlePageSizeChange(val) {
          this.currentPage = 1;
          this.pageSize = val;
          this.querySearch();
        },
        handleCurrentPageChange(val) {
          this.currentPage = val;
          this.querySearch();
        },

        /**
         * 已选
         */
        selectedPanelCollapse(val) {
          if (Array.isArray(val) && val.length) {
            this.selectedPanelVisible = true;
          } else {
            this.selectedPanelVisible = false;
          }
          this.setContentHeight();
        },
        removeSelected(tagIndex) {
          this.selected.splice(tagIndex, 1);
          this.setSelected();
        },
        clearSelected() {
          this.selected = [];
          this.setSelected();
        },

        /**
         * 常用
         */
        handleFreTabSelectChange(selection) {
          if (this.isMutiSelect) {
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
            this.selected = cur.concat(selection);
          }
        },
        handleFreCheckChange(data) {
          if (this.isMutiSelect) {
            this.selected = this.$refs.freTreeRef.getCheckedNodes();
          }
        },
        setFreSelected() {
          var sel = [];
          this.selected.forEach((v) => {
            if (v.id) {
              sel.push(v.id);
            }
          });
          this.$nextTick(() => {
            if (this.refInfo.refUIType === 'RefTree') {
              if (this.isMutiSelect && this.$refs.freTreeRef) {
                this.$refs.freTreeRef.setCheckedKeys(sel);
              } else {
                this.currentTreeNodeKeys = (Array.isArray(sel) && sel.length) ? sel[0] : '';
              }
            } else if (this.isFlatRef) {
              this.selectedFlatRefId = sel;
            } else {
              // if (!sel.length) {
              //   return;
              // }
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
      }
    };
</script>
<style scoped>
  .ufold {
    position: absolute;
    top:1rem;
    display: none;
  }
  .ufold i {
    font-size: 18px;
    color: #bfcbd9;
  }
  .ufold i:hover {
    color:#20a0ff;
    cursor: pointer;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }
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

  /* 树表 */
  .tree-breadcrumbs {
    /* 溢出往左撑开 */
    position: absolute;
    left: 0;
    padding-bottom: 16px;
    padding-left: 16px;
    /* min-width: 98%; */
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
  .flat-ref-options {
    overflow: auto;
  }
  .transition-height {
    transition: height ease-in-out .4s;
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
  .no-selected {
    box-sizing: border-box;
    padding: 12px 12px 100px;
  }
  .selected-tag {
    margin-right: 16px;
    margin-bottom: 12px;
  }
  .btn-clear-selected {
    color: #75787B;
    font-size: 14px;
    cursor: pointer;
  }
  .btn-clear-selected:hover {
    color: #2d2d2d;
  }
</style>
<style>
  .ref-dialog .el-tabs>div {
    margin-left: 0 !important;
  }
  .ref-dialog .el-tabs__nav {
    margin-left: 0 !important;
  }
  .ref-dialog .ref-dialog-tabs > .el-tabs__header {
    border-bottom: 1px solid #F0F0F5;
    margin-bottom: 16px;
  }
  .ref-dialog .el-tabs__item {
    height: 48px;
    line-height: 48px;
    /* max-width: 170px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; */
  }
  .ref-dialog .el-tabs__item::selection {
    color: inherit;
  }
  .ref-dialog .el-tabs__item .el-cascader__label {
    line-height: 48px;
  }
  .ref-dialog .ref-dialog-tabs {
    background-color:#FFF;
    padding: 0 16px;
  }
  .ref-dialog .el-dialog {
    max-height: none;
  }
  .ref-dialog .el-dialog__body {
    padding: 0;
    overflow: hidden;
    max-height: none;
  }
  .ref-dialog .filter-input {
    position: absolute;
    top: 8px;
    right: 16px;
    width: 192px;
    z-index: 2;
  }
  .ref-dialog .el-tree {
    border:  none;
  }
  .ref-dialog.flat-ref-dialog .el-dialog__body {
    padding-top: 8px;
  }
  .tree-node-panel > .el-tabs__content {
    padding: 8px 16px;
  }
  .ref-dialog .el-table tr .el-table-operate-icon {
    display: inline-block;
    visibility: hidden;
  }
  .ref-dialog .el-table__body tr:hover .el-table-operate-icon {
    visibility: visible;
  }
  .ref-dialog .el-tree-node__content:hover {
    background: #EAF9FF;
  }
  .ref-dialog .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background: #C1E5FD;
  }
  .ref-dialog .el-tree .el-tree-node__label{
        max-width:95%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
  }
  .ref-dialog .selected-panel {
    margin-top: 14px;
    border: none;
  }
  .ref-dialog .selected-panel .el-collapse-item__header {
    height: 48px;
    line-height: 48px;
    border: none;
    background: #F0F5FA;
  }
  .ref-dialog .selected-panel .el-collapse-item__content {
    box-sizing: border-box;
    height: 102px;
    overflow-y: auto;
    padding: 0 16px;
    background: #F0F5FA;
  }
  .ref-dialog .selected-panel .el-collapse-item__content::-webkit-scrollbar-track-piece {
    background: #F0F5FA;
  }
  
</style>
