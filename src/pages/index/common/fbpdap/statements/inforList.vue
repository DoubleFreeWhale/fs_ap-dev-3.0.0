<template>
  <ifbp-page class="info-list">
    <!-- 节点title -->
    <ifbp-breadcrumb name="报表信息"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area>
      <el-button type="primary" @click="publish">发布</el-button>
      <ifbp-search
        class="fr"
        :template-code="classTplCode"
        @search="handleSearch"
      >
      </ifbp-search>
    </ifbp-button-area>
    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <div class="info-main-container">
        <div class="tree-container">
          <el-tree
            class="info-tree"
            :data="treeData"
            :props="treeProps"
            default-expand-all
            :highlight-current="highlightCurrent"
            @node-click="treeNodeClicked"
            v-if="Array.isArray(treeData) && treeData.length"
            ref="funTree">
          </el-tree>
        </div>
        <div class="right-container">
          <!-- UI模板组件 -->
          <ifbp-template 
            ref="infoTplTableRef"
            :pk-temp="tplTablePk"
            :tpl-data="tplTableData"
            show-type="table"
            :table-show-menu="false"
            :tpl-reset-fun="tplTableResetFun"
            @selection-change="handleSelectionChange"
            @edit-table-click="tplTableEditClick"
            @delete-table-click="tplTableDeleteClick"
            v-show="showTable"
            class="info-table"
          >
          </ifbp-template>
          <!-- 分页组件 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalElements">
          </el-pagination>
        </div>
      </div>
    </ifbp-main-area>
    <!-- 新增模板 Dialog -->
    <el-dialog title="编辑报表" :before-close="addCancel" size="tiny" v-model="addDialogVisible">
      <el-form :model="addDialogForm" :rules="addRules"  label-width="100px" ref="addForm">
        <el-form-item label="分类" prop="pk_report_class" required>
          <el-ref
            ref-code="reportClass"
            field="pk_report_class"
            :template-value="addDialogForm"
            width="50px"
            ref="reportClassRef"
          >
          </el-ref>
        </el-form-item>
        <el-form-item label="编码" prop="code" required>
          <el-input v-model="addDialogForm.code"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="addDialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="url" required>
          <el-input v-model="addDialogForm.url"></el-input>
        </el-form-item>
      </el-form>
      <ifbp-form-button-area>
        <el-button type="primary" @click='addConfirm'>保存</el-button>
        <el-button  @click="addCancel">取消</el-button>
      </ifbp-form-button-area>
    </el-dialog>

    <!-- 发布信息 -->
    <el-dialog title='发布信息' :before-close="publishCancel" v-model="publishDialogVisible" size="tiny" style="min-height:333px;">
      <el-form :model="publishDialogForm" :rules="publishRules" ref="publishForm" label-width="100px">
        <el-form-item label="所属模块" prop="own_model" required>
          <el-ref
            ref-code="systypecode"
            field="own_model"
            :template-value="publishDialogForm"
            width="300px"
            :editable="true"
            @trigger="handleRefTrigger3"
            placeholder="请选择">
          </el-ref>
        </el-form-item>
        <el-form-item label="磁贴分组" prop="pk_func_class" required>
          <el-ref
            ref-code="appgroupref"
            ref="ref4"
            field="pk_func_class"
            :template-value="publishDialogForm"
            width="300px"
            :editable="true"
            :query-params="queryParams4"
            placeholder="请选择">
          </el-ref>
        </el-form-item>
        <el-form-item label="功能编码" prop="funcode">
          <el-input v-model="publishDialogForm.funcode"></el-input>
        </el-form-item>
        <el-form-item label="功能名称" prop="fun_name">
          <el-input v-model="publishDialogForm.fun_name"></el-input>
        </el-form-item>
      </el-form>
      <ifbp-form-button-area>
        <el-button type="primary" @click='publishConfirm'>保存</el-button>
        <el-button  @click="publishCancel">取消</el-button>
      </ifbp-form-button-area>
    </el-dialog>
  </ifbp-page>
</template>

<script>
  export default {
    data() {
      var vm = this;
      return {
        currentFun: {},
        tplTablePk:'000115100000002QZYLB',
        tplTableData: {},
        tplTableResetFun: function ($node) {
          var $table = this.getTableDom($node);
          var operateHtml =this.getTableOperateHtml([{title: "编辑",icon: "edit"},{title: "删除",icon: "delete"}]);// 操作列
          $table.append(operateHtml);
          return $node[0].outerHTML;
        },
        /**
         * 分页传入参数
         */
        totalElements: 0,
        currentPage: 1,
        pageSize: 10,

        /**
         * dialogs 相关
         */
        publishDialogVisible: false,
        addDialogVisible: false,
        delDialogVisible: false,
        ts: '',
        delIndex: '',
        addDialogFormReset:{},
        addDialogForm:{
          pk_report_class:'',//分类
          code:'',//编码
          name:'',//名称
          url:''
        },
        publishDialogForm:{
          funcode: '',//目标功能编码
          fun_name: '',//功能名称
          pk_func_class:'',//功能分类
          own_model: "",//所属模块
          pk_reports:[]
        },
        queryParams4: {
          pk_app_area:''
        },
        queryParams3: {
          systypecode:''
        },
        addRules:{     
          pk_report_class: [{ required: false, message: '分类不能为空', trigger: 'blur' }],
          code: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          url: [{ required: true, message: 'url不能为空', trigger: 'blur' }],
        },
        publishRules:{     
          own_model: [{ required: true, message: '所属模块不能为空', trigger: 'blur' }],
          pk_func_class: [{ required: true, message: '功能分类不能为空', trigger: 'blur' }],
          funcode: [
            { required: true, message: '功能编码不能为空', trigger: 'blur' }],
          fun_name: [
            { required: true, message: '功能名称不能为空', trigger: 'blur' }],
        },
        treeData: [],
        treeProps: {
          id: 'id',
          pid: 'pid',
          label: 'label',
          children: 'children'
        },
        // search template 相关
        classTplCode: 'reportInfoSearch',
        searchTpl: {},
        //卡片列表切换
        showTable: true,
        cardData:[],
        rowData:[],
        funcode: 'statements',
        // 高亮当前选中
        highlightCurrent: true,
        pk_report_class_data:'',
        stateUrl:'/f/dap/reportMGT/',
      };
    },
    methods: {
      // 获取模板列表
      request(){
        let requestUrl = this.stateUrl+'pageList';
        let searchMapObj = {};
        if(this.pk_report_class_data){
          this.searchTpl = {};
          searchMapObj = {
              pk_report_class: this.pk_report_class_data
            };
        }
        let requestData = {
          searchParams: {
            searchMap: searchMapObj
          },
          pageNum: this.currentPage,
          pageSize: this.pageSize
        };
        if (this.searchTpl) {
          requestData.searchParams.searchMap.searchTemplateParam = JSON.stringify(this.searchTpl);
        }
        this.$http({
          url: requestUrl,
          method: 'post',
          data: requestData,
          dataType: 'json'
        }).then((res) => {
          if (res.data.status === true) {
            this.cardData=res.data.data.content;
            this.$refs.infoTplTableRef.setTableData(res.data.data.content);
            this.totalElements = res.data.data.totalElements;
            this.pageSize = res.data.data.size;
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch((e) => {
          this.$message.error('操作异常');
        });
      },   
      /**
       * UI模板方法
       */
      // table选中改变
      handleSelectionChange(selection) {
        this.publishDialogForm.pk_reports = [];
        for (let value of selection) {
          this.publishDialogForm.pk_reports.push(value.pk_report);
        }
      },
      // table行的编辑操作
      tplTableEditClick(scope) {
          // 备份数据
          this.rowData = JSON.parse(JSON.stringify(scope.row));
          this.addDialogVisible = true;
          this.$nextTick(()=>{
            this.$refs['addForm'].resetFields();
            this.addDialogForm = this.rowData;
          });
      },
      // table行的删除操作
      tplTableDeleteClick(scope) {
        let scopeObj = scope;
        this.$confirm('确认删除该数据？删除后无法恢复。').then( () => {
          let requestUrl = this.stateUrl+'delete';
          this.$http.post(requestUrl,scope.row).then((res)=>{
            if (res.data.status == true) {
              this.$message('删除成功');
              this.request();
            } else if (res.data.status == false) {
              this.$message.error(res.data.message);
            }
          }).catch((e) => {
            this.$message.error('操作失败');
          });
        }).catch(() => {});
      },
      /**
       * 分页
       */
      handleSizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.request();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.request();
      },
      add() {
        this.addDialogVisible = true;
      },
      addConfirm() {
        let requestUrl = this.stateUrl+'save';
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$http({
              url: requestUrl,
              method: 'post',
              data:this.addDialogForm
            }).then((res) => {
              if(res.data.status == true) {
                this.addCancel();
                this.request();
              } else {
                this.$message.error(res.data.msg);
              }
            }).catch(() => {
              this.$message.error('请求失败');              
            });
          }
        });
      },
      addCancel() {
        this.addDialogForm = this.addDialogFormReset;
        this.$refs['addForm'].resetFields();
        this.addDialogVisible = false;
      },
      // 发布
      publish() {
        if(this.publishDialogForm.pk_reports.length == 0){
          this.$message('请选择报表');
          return;     
        }
        this.publishDialogVisible = true;
      },
      publishCancel() {
        this.$refs['publishForm'].resetFields();
        this.publishDialogVisible = false;
      },
      publishConfirm() {
        let requestUrl = this.stateUrl+'publishfunction';
        this.$refs.publishForm.validate((valid) => {
          if (valid) {
            this.$http({
              url: requestUrl,
              method: 'post',
              data:this.publishDialogForm
            }).then((res) => {
              if(res.data.status == true) {
                this.publishCancel();
                this.$message.success('报表发布成功');
                this.request();
              } else {
                this.$message.error(res.data.msg);
              }
            }).catch(() => {
              this.$message.error('请求失败');              
            });
          }
        });
      },
      requestSearchTpl() {
        var requestUrl = '/ifbp-app-sm-qt-web/quyerTemplate/getByCode';
        this.$http({
          url: requestUrl,
          method: 'post',
          data: this.classTplCode,
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((res) => {
            console.log(JSON.stringify(res.data));
            if (res.data && res.data.success) {
              this.classTpl = res.data.data;
            }
          })
          .catch(() => {
            console.log('未获取到查询模板');
          });
      },
      // 处理高级搜索事件
      handleSearch(tpl) {    
        if (!tpl) {
          return;
        }
        this.currentPage = 1;
        this.searchTpl = tpl;
        this.selectedTreeNode = [];
        this.funcode = '';
        this.pk_report_class_data = '';
        this.highlightCurrent = false;
        this.request();
      },
      setHeader(){
        if(this.showTable){
          this.$refs.infoTplTableRef.setTransferVisible(true);
        }
      },
      // 树节点变化
      treeNodeClicked(data, node, vueNode) {
        if (node && node.isLeaf) {
          this.pk_report_class_data = data.data.pk_report_class;
          this.highlightCurrent = true;
          this.request();
        }
      },
      // 格式化树数据
      formatTreeData(data) {
        if (!data || !Array.isArray(data.reportclass) || !data.reportclass.length) {
          this.$message.error('数据错误');
          return;
        }
        const copyData = JSON.parse(JSON.stringify(data));
        let formatedData = [];
        copyData.reportclass.forEach(item => {
          item.id = item.pk_report_class;
          item.pid = '';
          item.label = item.name;
          formatedData.push(item);
        });
        copyData.reports.forEach(item => {
          item.id = item.pk_report;
          item.pid = item.pk_report_class;
          item.label = item.name;
          formatedData.push(item);
        });
        return formatedData;
      },
      // 获取树数据
      getTreeData() {
        const tilecode = this.$context.getCurrentTileCode();
        if (tilecode) {
          const tileInfo = this.$context.getTileByCode(tilecode);
          if (tileInfo) {
            this.breadcrumbName = tileInfo.label;
          }
        }
        if (!tilecode) {
          this.$message.error("未获取到tilecode");
          return;
        }
        // ajax 获取树数据
        const requestUrl = '/f/dap/reportClassMGT/listAll';
        this.$http.get(requestUrl).then(res => {
          if (res.data.status) {
            let fotmated  = {
              'reportclass':res.data.data,
              'reports':[]
            };
            fotmated.reportclass.unshift({name:'全部分类',pk_report_class:''});
            console.log(fotmated);
            this.showTree = true;
            this.treeData = this.formatTreeData(fotmated);
          }else if (res.data.error && res.data.error.errorMessage) {
            this.$message.error('信息获取失败: ' + res.data.error.errorMessage);
          }
        })
        .catch(() => {
          this.$message.error('请求失败');
        });
      },
      handleRefTrigger3(type, data) {
        // if (type === 'change') {
        //   this.queryParams4.pk_app_area = data.value[0].id;
        //   this.$refs.ref4.reset();
        // }
      },
    },
    created(){
      this.getTreeData();
      this.addDialogFormReset = this.addDialogForm;
    }
  };
</script>
<style scoped>
  .info-main-container {
    display: flex;
    flex: 1;
  }
  .info-list .tree-container {
    width: 250px;
    min-width:250px;
    margin-right: 16px;
    background: #ffffff;
    margin: -16px 0 -16px -16px;
    border-right: 16px solid #f0f0f5;
  }
  .right-container{
    position: relative;
    min-width:800px;
    background: #fff;
    margin-left: 16px;
    flex:1;
    flex-wrap: wrap;
  }
  .info-iframe {
    flex: 1;
    width:100%;
    background: #ffffff;
    margin-top: 50px;
    min-height: 600px;
  }
  .info-table{
    margin-top: 0;
  }
</style>
<style>
  .info-tree .el-tree {
    border: none;
  }
</style>