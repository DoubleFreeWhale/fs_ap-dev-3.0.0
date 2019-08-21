<template>
    <div>
        <el-dialog ref = "elDialog1" title="" v-model="dialogRefVisible" :size="size" id="el-dialog">
            <div class="fold" @click="foldClick($event)">
              <i class="el-icon-pt-fenlei1" ></i>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="常用" name="first"></el-tab-pane>
                <el-tab-pane label="全部" name="second"></el-tab-pane>
            </el-tabs>
            <div style="display:flex;background-color:#FFF;border:1px #EEE solid" >
                <div v-if="treeData.length>0" :style="styleTree" id="refTree" v-clickoutside="handleClickoutside">
                    <el-input
                            placeholder="输入关键字进行过滤"
                            icon="search"
                            v-model="filterText">
                    </el-input>
                    <el-tree
                            :data="treeData"
                            :props="treeprops"

                            default-expand-all
                            ref ="reftree"
                            :filter-node-method="filterNode"
                            @node-click="handleNodeClick">
                    </el-tree>
                </div>
                <div v-if="tableData.length>0" :style="styleTable" id="refTable">
                    <div v-if="treeData.length<=0">
                        <el-input
                                placeholder="输入关键字进行过滤"
                                icon="search"
                                v-model="filterText">
                        </el-input>
                    </div>

                    <el-table
                            :data="tableData"
                            highlight-current-row
                            @current-change="handleCurrentChange"
                            style="width: 100%">
                        <el-table-column
                                type="index"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                property="date"
                                label="日期"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                property="name"
                                label="姓名"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                property="address"
                                label="地址">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCloseSelf">取 消</el-button>
                <el-button type="primary" @click="handleCloseSelf">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  /*eslint no-console: "warn"*/
  import {addResizeListener, removeResizeListener} from 'ifbp-element/src/utils/resize-event';
  import Clickoutside from 'ifbp-element/src/utils/clickoutside';
  export default {
    name: 'ElRef',
    props: ['dialogVisible', 'treeDc', 'children', 'label', 'tableDc'],
    directives: { Clickoutside },
    data() {
      return {
        refClientWidth: '',
        rflag: 'true',
        size: 'large',
        activeName: 'first',
        treeData: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        },
        {
          id: 4,
          label: '一级 4',
          children: [{
            id: 9,
            label: '二级 4-1'
          }, {
            id: 10,
            label: '二级 4-2'
          }]
        }
        ],
        treeprops: {
          children: 'children',
          label: 'label'
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
        dialogRefVisible: false,
        filterText: '',
        data: null // the selected data
      };
    },
    watch: {
      filterText(val) {
        this.$refs.reftree.filter(val);
      }
    },
    created() {
      this.dialogRefVisible = this.dialogVisible;
      this.treeAndTableShow(this.treeDc, this.tableDc);
      this.fetchData();
    },
    mounted() {
      // var vm = this;
      // var resizeSc = function() {
      //   vm.refClientWidth = document.body.clientWidth;
      //   var refFold = document.querySelector('.fold');
      //   if (vm.refClientWidth >= 320 && vm.refClientWidth < 768) {
      //     vm.size = 'full';
      //     if ((vm.treeDc.length > 0) && (vm.tableDc.length > 0)) {
      //       vm.styleTree = {width: '70%', position: 'absolute', left: '-70%'};
      //       vm.styleTable = {width: '100%'};
      //       if (refFold) {
      //         refFold.style.display = 'block';
      //       }

      //     } else if ((vm.treeDc.length > 0) && (vm.tableDc.length <= 0)) {
      //       vm.styleTree = {width: '100%'};
      //       vm.styleTable = {width: '0%'};
      //       vm.tableData = [];
      //     } else if ((vm.treeDc.length <= 0) && (vm.tableDc.length > 0)) {
      //       vm.styleTree = {width: '0%'};
      //       vm.styleTable = {width: '100%'};
      //       vm.treeData = [];
      //     }
      //   } else if (vm.refClientWidth >= 768) {

      //     if ((vm.treeDc.length > 0) && (vm.tableDc.length > 0)) {
      //       vm.size = 'large';
      //       refFold.style.display = 'none';
      //       vm.styleTree = {width: '30%'};
      //       vm.styleTable = {width: '70%'};
      //     } else if ((vm.treeDc.length > 0) && (vm.tableDc.length <= 0)) {
      //       vm.size = 'small';
      //       vm.styleTree = {width: '100%'};
      //       vm.styleTable = {width: '0%'};
      //       vm.tableData = [];
      //     } else if ((vm.treeDc.length <= 0) && (vm.tableDc.length > 0)) {
      //       vm.size = 'small';
      //       vm.styleTree = {width: '0%'};
      //       vm.styleTable = {width: '100%'};
      //       vm.treeData = [];
      //     }
      //   }
      // };
      this.$refs.elDialog1.$nextTick(() => {
        this.resizeSc();

      });
      window.addEventListener('resize', this.resizeSc);
      // window.addEventListener('resize', () => {
      //   resizeSc();
      // });

    },
    beforeMount() {
      console.log(this.treeDc, this.tableDc);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeSc);
    },
    methods: {
      resizeSc(){
        var vm = this;
        vm.refClientWidth = document.body.clientWidth;
        var refFold = document.querySelector('.fold');
        if (vm.refClientWidth >= 320 && vm.refClientWidth < 768) {
          vm.size = 'full';
          if ((vm.treeDc.length > 0) && (vm.tableDc.length > 0)) {
            vm.styleTree = {width: '70%', position: 'absolute', left: '-70%'};
            vm.styleTable = {width: '100%'};
            if (refFold) {
              refFold.style.display = 'block';
            }

          } else if ((vm.treeDc.length > 0) && (vm.tableDc.length <= 0)) {
            vm.styleTree = {width: '100%'};
            vm.styleTable = {width: '0%'};
            vm.tableData = [];
          } else if ((vm.treeDc.length <= 0) && (vm.tableDc.length > 0)) {
            vm.styleTree = {width: '0%'};
            vm.styleTable = {width: '100%'};
            vm.treeData = [];
          }
        } else if (vm.refClientWidth >= 768) {

          if ((vm.treeDc.length > 0) && (vm.tableDc.length > 0)) {
            vm.size = 'large';
            refFold.style.display = 'none';
            vm.styleTree = {width: '30%'};
            vm.styleTable = {width: '70%'};
          } else if ((vm.treeDc.length > 0) && (vm.tableDc.length <= 0)) {
            vm.size = 'small';
            vm.styleTree = {width: '100%'};
            vm.styleTable = {width: '0%'};
            vm.tableData = [];
          } else if ((vm.treeDc.length <= 0) && (vm.tableDc.length > 0)) {
            vm.size = 'small';
            vm.styleTree = {width: '0%'};
            vm.styleTable = {width: '100%'};
            vm.treeData = [];
          }
        }
      },
      handleClickoutside() {
        if (this.refClientWidth >= 320 && this.refClientWidth < 768) {
          if (this.treeData.length > 0 && this.tableData.length > 0) {
            document.querySelector('.fold').style.display = 'block';
            this.styleTree = {width: '70%', position: 'absolute', left: '-70%'};
            this.rflag = true;
          }
        }
      },
      treeAndTableShow(tree, table) {
        if ((tree.length > 0) && (table.length > 0)) {
          this.size = 'large';
          this.styleTree = {width: '30%'};
          this.styleTable = {width: '70%'};
        } else if ((tree.length > 0) && (table.length <= 0)) {
          this.size = 'small';
          this.styleTree = {width: '100%'};
          this.styleTable = {width: '0%'};
          this.tableData = [];
        } else if ((tree.length <= 0) && (table.length > 0)) {
          this.size = 'small';
          this.styleTree = {width: '0%'};
          this.styleTable = {width: '100%'};
          this.treeData = [];
        }

      },
      foldClick(event) {
        if (this.rflag) {
          event.currentTarget.style.display = 'none';
          this.styleTree = { width: '70%', position: 'absolute', left: '0', zIndex: '1000', border: '1px solid #d1dbe5'};
          this.rflag = false;
        } else {
          event.currentTarget.style.display = 'block';
          this.rflag = true;
        }

      },
      fetchData(url) {
        if (!url) return;
        this.$http.get('./static/data.js').then((response) => {
          // success callback
          console.log(response.data);
        }, (response) => {
          // error callback
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      /*eslint no-unused-vars: "warn"*/
      handleClick(tab, event) {
        console.log(tab.name, event);
        this.$emit('onTabClick', tab);
      },
      handleNodeClick(data) {
        console.log(data);
        this.data = data;
        this.$emit('onTreeNodeClick', data);
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: 'region1' }, { name: 'region2' }]);
        }
        if (node.level > 3) return resolve([]);
        let hasChild;
        if (node.data.name === 'region1') {
          hasChild = true;
        } else if (node.data.name === 'region2') {
          hasChild = false;
        } else {
          hasChild = Math.random() > 0.5;
        }
        setTimeout(() => {
          let data;
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
        return resolve(this.data);
      },
      handleCurrentChange(val) {
        console.log(val.name);
        this.currentRow = val;
        this.data = val;
        this.$emit('onSelectRow', val);
      },
      handleCloseSelf() {
        console.log(this.data);
        this.$emit('onSelectData', this.data);
        this.dialogRefVisible = false;
      }
    }
  };
</script>
<style scoped>
    .el-tree{
        border-bottom: none;
    }
    .fold {
      position: absolute;
      top:1rem;
      display: none;
    }
    .fold i {
      font-size: 18px;
      color: #bfcbd9;
    }
    /*.fold i:hover {
      color:#20a0ff;
      cursor: pointer;
    }*/


</style>
