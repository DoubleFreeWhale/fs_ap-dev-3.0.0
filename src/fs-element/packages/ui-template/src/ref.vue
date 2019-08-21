<template>
    <div>
        <el-dialog ref="uelDialog" :modal="false" title="" v-model="visible" :size="size" @close="closeDialog"
                   class="ref-dialog">
            <div class="ufold" @click="ufoldClick($event)">
                <i class="el-icon-pt-fenlei1"></i>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name="first">
                    <div style="display:flex;background-color:#FFF;border:1px #EEE solid">
                        <div v-if="treeData.length>0" :style="styleTree" v-clickoutside="handleClickoutside">
                            <el-autocomplete
                                    placeholder="输入关键字进行过滤"
                                    icon="search"
                                    width="100%"
                                    :fetch-suggestions="getSuggestions"
                                    @select="onSelectData"
                                    v-model="filterText">
                            </el-autocomplete>
                            <el-tree
                                    :data="treeData"
                                    :props="treeprops"
                                    node-key="refpk"
                                    :check-strictly="true"
                                    :show-checkbox="data.isMutiSelect&&refInfo.refUIType!=='RefGridTree'"
                                    default-expand-all
                                    ref="reftree"
                                    :filter-node-method="filterNode"
                                    @check-change="handleCheckChange"
                                    @node-click="handleNodeClick">
                            </el-tree>
                        </div>
                        <div :style="styleTable">
                            <div v-if="treeData.length<=0">
                                <el-autocomplete
                                        placeholder="输入关键字进行过滤"
                                        icon="search"
                                        width="100%"
                                        :fetch-suggestions="getSuggestions"
                                        @select="onSelectData"
                                        v-model="filterText">
                                </el-autocomplete>
                            </div>
                            <el-table
                                    :data="tableData"
                                    highlight-current-row
                                    empty-text="暂无数据……"
                                    @current-change="handleCurrentChange"
                                    @select="handleTabSelectChange"
                                    @select-all="handleTabSelectChange"
                                    :height="tableHeight"
                                    ref="refTable"
                                    style="width: 100%">
                                <el-table-column
                                        type="selection"
                                        v-if="data.isMutiSelect&&refInfo.refUIType!=='RefTree'"
                                        width="55">
                                </el-table-column>
                                <el-table-column
                                        v-for="(colName,index) in strFieldName"
                                        :label="colName"
                                        :property="strFieldCode[index]"
                                        :show-overflow-tooltip="true">
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="'已选('+selected.length+')'" v-if="data.isMutiSelect" name="second">
                    <div v-if="treeData.length<=0">
                        <el-input
                                placeholder="输入关键字进行过滤"
                                icon="search"
                                width="100%">
                        </el-input>
                    </div>
                    <el-table
                            :data="selected"
                            v-if="selected.length>0"
                            highlight-current-row
                            empty-text="暂无数据……"
                            height="309"
                            style="width: 100%">
                        <el-table-column
                                v-for="(colName,index) in strFieldName"
                                :label="colName"
                                :property="strFieldCode[index]"
                                :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template scope="scope">
                                <el-button
                                        size="small"
                                        type="danger"
                                        @click="handleDelete(scope.$index, scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
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
    props: ['data', 'dialogVisible', 'refData', 'children', 'label', 'tableDc', 'refInfo', 'savedSelected'],
    data() {
      return {
        urefClientWidth: '',
        rflag: 'true',
        size: 'large',
        activeName: 'first',
        selected: [],
        treeData: '',
        // 外部引用可以添加的属性
        treeprops: {
          children: 'children',
          label: 'refname',
          id: 'id'
        },
        styleTree: {
          width: '100%'
        },
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        currentRow: null,
        styleTable: {
          width: '100%'
        },
        strFieldCode: [],
        strFieldName: [],
        // dialogVisible: true,
        filterText: '',
        tableHeight: 345,
        visible: false,
        timeid: ''
      };
    },
    watch: {
      refInfo(val) {
        this.treeprops.label = ['RefGridTree'].indexOf(val.refUIType) > -1 ? 'name' : 'refname';
      },
      // filterText(val) {
      //   this.$refs.reftree.filter(val);
      // },
      refData() {
        this.adjustRefData();
        if (this.refInfo.strFieldName) {
          this.strFieldName = this.refInfo.strFieldName;
          this.strFieldCode = this.refInfo.strFieldCode;
        } else if (this.refData.refViewModel && this.refData.refViewModel.strFieldName) {
          this.strFieldName = this.refData.refViewModel.strFieldName;
          this.strFieldCode = this.refData.refViewModel.strFieldCode;
        }

      },
      dialogVisible(val) {
        this.visible = val;
        if (val === true) {
          this.selected = JSON.parse(JSON.stringify(this.savedSelected));
          this.setSelected();
        }
      }
    },
    mounted() {
      // var vm = this;
      // var uresizeSc = function () {
      //   vm.urefClientWidth = document.body.clientWidth;
      //   var urefFold = document.querySelector('.ufold');
      //   if (vm.urefClientWidth >= 320 && vm.urefClientWidth < 767) {
      //     vm.size = 'full';
      //     if (vm.refInfo.refUIType === 'RefGridTree') {
      //       vm.styleTree = {width: '34%', position: 'absolute', left: '-34%'};
      //       vm.styleTable = {width: '100%'};
      //       vm.listData = [];
      //       vm.tableData = [];
      //       vm.treeData = vm.refData.data;
      //       if (urefFold) {
      //         urefFold.style.display = 'block';
      //       }

      //     } else if (vm.refInfo.refUIType === 'RefGrid') {
      //       vm.styleTree = {width: '0%'};
      //       vm.styleTable = {width: '100%'};
      //       vm.treeData = [];
      //       vm.listData = [];
      //       vm.tableData = vm.refData.data;
      //     } else if (vm.refInfo.refUIType === 'RefTree') {
      //       vm.styleTree = {width: '100%'};
      //       vm.styleTable = {width: '0%'};
      //       vm.tableData = [];
      //       vm.listData = [];
      //       vm.treeData = vm.refData.data;
      //     }
      //   } else if (vm.urefClientWidth >= 767) {

      //     if (vm.refInfo.refUIType === 'RefGridTree') {
      //       vm.size = 'large';
      //       vm.styleTree = {width: '40%'};
      //       vm.styleTable = {width: '60%'};
      //       vm.listData = [];
      //       vm.tableData = [];
      //       vm.treeData = vm.refData.data;
      //       if (urefFold) {
      //         urefFold.style.display = 'none';
      //       }

      //     } else if (vm.refInfo.refUIType === 'RefGrid') {
      //       vm.size = 'small';
      //       vm.styleTree = {width: '0%'};
      //       vm.styleTable = {width: '100%'};
      //       vm.treeData = [];
      //       vm.listData = [];
      //       vm.tableData = vm.refData.data;
      //     } else if (vm.refInfo.refUIType === 'RefTree') {
      //       vm.size = 'small';
      //       vm.styleTree = {width: '100%'};
      //       vm.styleTable = {width: '0%'};
      //       vm.tableData = [];
      //       vm.listData = [];
      //       vm.treeData = vm.refData.data;
      //     }
      //   }

      // };

      this.$refs.uelDialog.$nextTick(() => {
        this.uresizeSc();

      });
      window.addEventListener('resize', this.uresizeSc);
      // window.addEventListener('resize', () => {
      //   uresizeSc();
      // });

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
      this.fetchData();
    },
    beforeMount() {
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.uresizeSc);
    },
    methods: {
      uresizeSc(){
        var vm = this;
       vm.urefClientWidth = document.body.clientWidth;
        var urefFold = document.querySelector('.ufold');
        if (vm.urefClientWidth >= 320 && vm.urefClientWidth < 767) {
          vm.size = 'full';
          if (vm.refInfo.refUIType === 'RefGridTree') {
            vm.styleTree = {width: '34%', position: 'absolute', left: '-34%'};
            vm.styleTable = {width: '100%'};
            vm.listData = [];
            vm.tableData = [];
            vm.treeData = vm.refData.data;
            if (urefFold) {
              urefFold.style.display = 'block';
            }

          } else if (vm.refInfo.refUIType === 'RefGrid') {
            vm.styleTree = {width: '0%'};
            vm.styleTable = {width: '100%'};
            vm.treeData = [];
            vm.listData = [];
            vm.tableData = vm.refData.data;
          } else if (vm.refInfo.refUIType === 'RefTree') {
            vm.styleTree = {width: '100%'};
            vm.styleTable = {width: '0%'};
            vm.tableData = [];
            vm.listData = [];
            vm.treeData = vm.refData.data;
          }
        } else if (vm.urefClientWidth >= 767) {

          if (vm.refInfo.refUIType === 'RefGridTree') {
            vm.size = 'large';
            vm.styleTree = {width: '40%'};
            vm.styleTable = {width: '60%'};
            vm.listData = [];
            vm.tableData = [];
            vm.treeData = vm.refData.data;
            if (urefFold) {
              urefFold.style.display = 'none';
            }

          } else if (vm.refInfo.refUIType === 'RefGrid') {
            vm.size = 'small';
            vm.styleTree = {width: '0%'};
            vm.styleTable = {width: '100%'};
            vm.treeData = [];
            vm.listData = [];
            vm.tableData = vm.refData.data;
          } else if (vm.refInfo.refUIType === 'RefTree') {
            vm.size = 'small';
            vm.styleTree = {width: '100%'};
            vm.styleTable = {width: '0%'};
            vm.tableData = [];
            vm.listData = [];
            vm.treeData = vm.refData.data;
          }
        }
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
          this.styleTree = {width: '70%', position: 'absolute', left: '0', zIndex: '1000'};
          this.rflag = false;
        } else {
          event.currentTarget.style.display = 'block';
          this.rflag = true;
        }

      },
      adjustRefData() {
        this.tableHeight = this.refInfo.refUIType === 'RefGridTree' ? 345 : 309;
        switch (this.refInfo.refUIType) {
          case 'RefGridTree':
            this.size = 'large';
            this.styleTree = {width: '34%'};
            this.styleTable = {width: '66%'};
            this.listData = [];
            this.tableData = [];
            this.treeData = this.refData.data;
            break;
          case 'RefGrid':
            this.size = 'small';
            this.styleTree = {width: '0%'};
            this.styleTable = {width: '100%'};
            this.treeData = [];
            this.listData = [];
            this.tableData = this.refData.data;
            break;
          case 'RefTree':
            this.size = 'small';
            this.styleTree = {width: '100%'};
            this.styleTable = {width: '0%'};
            this.tableData = [];
            this.listData = [];
            this.treeData = this.refData.data;
            break;
          case 'CommonRef':
            this.size = 'small';
            this.styleTree = {width: '0%'};
            this.styleTable = {width: '100%'};
            this.tableData = this.refData.data;
            this.treeData = [];
            // this.listData = this.refData;
            break;
          default:
            this.size = 'small';
            this.styleTree = {width: '0%'};
            this.styleTable = {width: '100%'};
            this.tableData = [];
            this.treeData = [];
            this.listData = [];
        }
      },
      fetchData(url) {
        if (url) {
          this.$http.get('./static/data.js').then((response) => {
            // success callback
          }, (response) => {
            // error callback
          });
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      getSuggestions(searchStr, callback) {
        var tmp = function () {
          this.querySearch(searchStr, callback);
          this.timeid = false;
        }.bind(this);
        if (!this.timeid) {
          this.timeid = setTimeout(tmp, 300);
        } else {
          clearTimeout(this.timeid);
          this.timeid = setTimeout(tmp, 300);
        }
      },
      querySearch(searchStr, callback) {
        if (this.templateValue['base_doc_type']) {
          this.$http({
            url: '/uitemplate_web/iref_ctr/filterRefJSON',
            method: 'post',
            data: 'content=' + encodeURIComponent(searchStr) + '&refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl) + '&condition=' + this.templateValue['base_doc_type']
          }).then((res) => {
            var segs;
            if (res.data && ({}).toString.call(res.data.data) === '[object Array]') {
              segs = res.data.data;
              for (var i = 0; i < segs.length; i++) {
                segs[i].value = segs[i].refname;
              }
            } else {
              segs = [{value: '无可用数据！'}];
            }
            callback(segs);
          });
        } else {
          this.$http({
            url: '/uitemplate_web/iref_ctr/filterRefJSON',
            method: 'post',
            data: 'content=' + encodeURIComponent(searchStr) + '&refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl)
          }).then((res) => {
            var segs;
            if (res.data && ({}).toString.call(res.data.data) === '[object Array]') {
              segs = res.data.data;
              for (var i = 0; i < segs.length; i++) {
                segs[i].value = segs[i].refname;
              }
            } else {
              segs = [{value: '无可用数据！'}];
            }
            callback(segs);
          });
        }
      },
      /*eslint no-unused-vars: "warn"*/
      handleClick(tab, event) {
        this.$emit('onTabClick', tab);
      },
      onSelectData(data) {
        if (!this.data.isMutiSelect) {
          this.$emit('onSelectData', data);
          this.closeDialog();
        }
      },
      handleNodeClick(data) {
        if (this.refInfo.refUIType === 'RefGridTree') {
          this.loadList(data);
        } else if (!this.data.isMutiSelect) {
          this.$emit('onSelectData', data);
          this.closeDialog();
        }
      },
      handleCheckChange(data) {
        if (this.data.isMutiSelect) {
          this.selected = this.$refs.reftree.getCheckedNodes();
        }
      },
      handleTabSelectChange(selection) {
        if (this.data.isMutiSelect) {
          var table = [];
          var cur = [];
          this.tableData.forEach((v) => {
            table.push(v.refpk);
          });
          this.selected.forEach((v) => {
            if (table.indexOf(v.refpk) < 0) {
              cur.push(v);
            }
          });
          this.selected = cur.concat(selection);
        }
      },
      handleCurrentChange(val) {
        if (!this.data.isMutiSelect) {
          this.$emit('onSelectData', val);
          this.closeDialog();
        }
      },
      loadList(data) {
        this.$http({
          url: '/uitemplate_web/iref_ctr/blobRefSearch',
          method: 'post',
          data: 'refModelUrl=' + encodeURIComponent(this.refInfo.refModelUrl) + '&condition=' + encodeURIComponent(data.refpk)
        }).then((res) => {
          this.tableData = res.data.data;
          this.setSelected();
        });

      },
      setSelected() {
        var sel = [];
        this.selected.forEach((v) => {
          sel.push(v.refpk);
        });
        this.$nextTick(() => {
          if (this.refInfo.refUIType === 'RefTree') {
            this.$refs.reftree.setCheckedKeys(sel);
          } else {
            this.tableData.forEach((v) => {
              if (sel.indexOf(v.refpk) > -1) {
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
          this.$refs.reftree.setChecked(row.refpk, false);
        } else {
          var tmp;
          this.tableData.forEach((v) => {
            if (v.refpk === row.refpk) {
              tmp = v;
            }
          });
          this.$refs.refTable.toggleRowSelection(tmp);
        }
      },
      loadNode(node, resolve) {
        var data;
        if (node.level === 0) {
          return resolve([{name: 'region1'}, {name: 'region2'}]);
        }
        if (node.level > 3) {
          return resolve([]);
        }
        let hasChild;
        if (node.data.name === 'region1') {
          hasChild = true;
        } else if (node.data.name === 'region2') {
          hasChild = false;
        } else {
          hasChild = Math.random() > 0.5;
        }
        setTimeout(() => {
          if (hasChild) {
            const count = this.count + 1;
            data = [{
              name: `zone${count}`
            }, {
              name: `zone${count}`
            }];
          } else {
            data = [];
          }

          return resolve(data);
        }, 500);
        return resolve(data);
      },
      closeDialog: function () {
        this.$parent.$emit('closeDialog');
      },
      handleCloseSelf(code) {
        if (code === 'confirm') {
          this.$emit('onSelectData', this.selected);
        }
        this.closeDialog();
        // this.visible=false;
      }
    }
  };
</script>
<style scoped>
    .el-tree {
        border-bottom: none;
    }

    .ufold {
        position: absolute;
        top: 1rem;
        display: none;
    }

    .ufold i {
        font-size: 18px;
        color: #bfcbd9;
    }

    .ufold i:hover {
        color: #20a0ff;
        cursor: pointer;
    }
</style>
