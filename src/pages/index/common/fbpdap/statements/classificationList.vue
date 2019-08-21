<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="报表分类"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area>
      <el-button type="primary" @click="add">新增</el-button>
      <ifbp-search
        class="fr"
        :template-code="classTplCode"
        @search="handleSearch"
      >
      </ifbp-search>
    </ifbp-button-area>
    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <!-- UI模板组件 -->
      <ifbp-template 
        ref="classification"
        :pk-temp="tplTablePk"
        :tpl-data="tplTableData"
        show-type="table"
        :table-show-menu="false"
        :tpl-reset-fun="tplTableResetFun"
        @edit-table-click="tplTableEditClick"
        @delete-table-click="tplTableDeleteClick"
        v-show="showTable"
        class="classification-table"
      >
      </ifbp-template>
      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination>
    </ifbp-main-area>
    <!-- 新增模板 Dialog -->
    <el-dialog :title='dialogType=="add"?"新增报表分类":"编辑报表分类"' :before-close="addCancel" v-model="mdClassDialogVisible" size="tiny" style="min-height:233px;">
      <el-form :model="dialogForm" :rules="rules"  label-width="100px" ref="classEditForm">
        <el-form-item label="编码" prop="code" required>
          <el-input v-model="dialogForm.code"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="dialogForm.name"></el-input>
        </el-form-item>
      </el-form>
      <ifbp-form-button-area>
        <el-button type="primary" @click='addConfirm'>保存</el-button>
        <el-button  @click="addCancel">取消</el-button>
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
        tplTablePk:'000115100000002QZYKT',
        // funnode:'classification',
        // nexuskey:'BBFL',
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
        mdClassDialogVisible: false,
        delDialogVisible: false,
        ts: '',
        delIndex: '',
        dialogType:'add',
        dialogFormReset:{},
        dialogForm: {
          code: '',//编码
          name: '',//名称
        },
        rules:{     
          code:[{required:true,message:'编码不能为空', trigger: 'blur' }],      
          name:[{required:true,message:'名称不能为空', trigger: 'blur' }],
        },

        // ref相关
        entityID: null,
        currentTitle: '',
        treeData: [],
        tplTree: [],
        busitypecode: '',
        currentApp: '',
        
        // search template 相关
        classTplCode: 'BBFLSEARCH',
        searchTpl: {},
        //卡片列表切换
        showTable: true,
        cardData:[],
        rowData:[],
        stateUrl:'/f/dap/reportClassMGT/'
      };
    },
    methods: {
      // 获取模板列表
      request(){
        let requestUrl = this.stateUrl+'pageList';
        let requestData = {
          searchParams: {
            searchMap: {}
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
            this.$refs.classification.setTableData(res.data.data.content);
            this.totalElements = res.data.data.totalElements;
            this.pageSize = res.data.data.size;
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            });
          }
        }).catch((e) => {
          this.$message.error('操作异常');
        });
      },
      /**
       * UI模板方法
       */
      // table行的编辑操作
      tplTableEditClick(scope) {
          // 备份数据
          this.rowData = JSON.parse(JSON.stringify(scope.row));
          this.dialogType='edit';
          this.$nextTick(()=>{
            this.$refs['classEditForm'].resetFields();
            this.dialogForm = this.rowData;
          });
          this.dialogType='edit';
          this.mdClassDialogVisible = true;
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
            console.error(e);
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
        this.dialogType='add';
        this.mdClassDialogVisible = true;
      },
      addConfirm() {
        let requestUrl = this.stateUrl+(this.dialogType=='edit'?'update':'save');
        this.$refs.classEditForm.validate((valid) => {
          if (valid) {
            this.$http({
              url: requestUrl,
              method: 'post',
              data:this.dialogForm
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
        this.dialogForm = this.dialogFormReset;
        this.$refs['classEditForm'].resetFields();
        this.mdClassDialogVisible = false;
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
      // 处理参照事件
      handleRefTrigger(type, data) {
        // console.log(type, data);
        if (type === 'change' && data && data.value && data.value[0]) {
          this.refCode = data.value[0].refcode;
          this.refId = data.value[0].id;
        }
      },
      // 处理高级搜索事件
      handleSearch(tpl) {    
        if (!tpl) {
          return;
        }
        this.currentPage = 1;
        this.searchTpl = tpl;
        this.selectedTreeNode = [];
        this.request();
      },
      setHeader(){
        if(this.showTable){
          this.$refs.classTplTableRef.setTransferVisible(true);
        }
      }
    },
    created(){
      this.request();
      this.dialogFormReset = this.dialogForm;
    }
  };
</script>
<style scope>
.classification-table{
  margin-top: 0;
}
</style>