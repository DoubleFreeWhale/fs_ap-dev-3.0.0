<template>
  <ifbp-page class="info-list">
    <!-- 节点title -->
    <ifbp-breadcrumb></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area>
      <!-- <el-button type="primary" @click="publish">发布</el-button> -->
      <ifbp-search
        class="fr"
        :template-code="classTplCode"
        @search="handleSearch"
      >
      </ifbp-search>
    </ifbp-button-area>
    <!-- content -->
    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <div class="info-main-container">
        <div class="tree-container">
          <span class="add-classify"><i class="ifbp-icon-add fr" @click="addClassify"></i></span>
          <ul class="classify-list" v-if="Array.isArray(classifyData) && classifyData.length">
            <li class="classify-li" v-for="(column,index) in classifyData" @click="treeClick(column.pk_report_class,index)" :class="{'active':column.isCheck}">
              <i class="ifbp-icon-folder"></i><input class="classify-input" v-if="column.isEdit" size="mini" v-model="column.name" @focus="focus($event)" @blur.one="blur($event,index)" @keyup.one.enter="blur($event,index)" placeholder="请输入分类" v-focus><span v-else>{{column.name}}</span>
              <el-tooltip placement="bottom" effect="light">
                <i class="ifbp-icon-more el-tooltip" v-if="!column.isEdit"></i>
                <ul slot="content">
                    <li @click="classifyDelete(column,index)"><span>删除</span></li>
                    <li @click="classifyRename(index)"><span>重命名</span></li>
                    <li><span>上移</span></li>
                    <li><span>下移</span></li>
                </ul>
              </el-tooltip>
            </li>
          </ul>
        </div>
        <div class="right-container">
          <div class="ifbp-btn-line">
            <div class="fl">
              <span class="classify-title">{{classifyTitle}}</span>
            </div>
            <div class="fr">
              <ifbp-table-card-icon :show-table="showTable" @update:showTable="value => this.showTable = value"></ifbp-table-card-icon><i class="ifbp-icon-setting" :class='{"disabled":!showTable}' @click="setHeader" title="设置"></i>
            </div>
          </div>
          <!-- UI模板组件 -->
          <ifbp-template 
            ref="infoTplTableRef"
            :pk-temp="tplTablePk"
            :tpl-data="tplTableData"
            show-type="table"
            :table-show-menu="false"
            :tpl-reset-fun="tplTableResetFun"
            @selection-change="handleSelectionChange"
            @developer-board-table-click="tplDeveloperClick"
            @delete-table-click="tplTableDeleteClick"
            @right-table-click="tplMoveClick"
            @ascending-table-click="tplAscendingClick"
            @descending-table-click="tplDescendingClick"
            v-show="showTable"
          >
          </ifbp-template>
          <!-- 卡片 -->
          <ifbp-infolist-card
            v-show="!showTable"
            :card-data="cardData"
            @cardDeveloperClick="tplDeveloperClick"
            @cardDeleteClick="tplTableDeleteClick"
            @cardMoveClick="tplMoveClick"
            @cardAscendingClick="tplAscendingClick"
            @cardDescendingClick="tplDescendingClick"
          ></ifbp-infolist-card>
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
    <!-- 移动分类 Dialog -->
    <el-dialog title='移动到' :before-close="moveCancel" v-model="moveDialogVisible" size="tiny" class="move-dialog">
      <ul class="classify-list classify-list-dialog" v-if="Array.isArray(classifyDialogData) && classifyDialogData.length">
        <li class="classify-li" v-for="(column,index) in classifyDialogData" @click="treeDialogClick(column.pk_report_class,index)" :class="{'active':column.isCheck}">
          <i class="ifbp-icon-folder"></i><input class="classify-input" v-if="column.isEdit" size="mini" v-model="column.name" @focus="focus($event)" @blur.one="blur($event,index)" @keyup.one.enter="blur($event,index)" placeholder="请输入分类" v-focus><span v-else>{{column.name}}</span>
        </li>
      </ul>
      <ifbp-form-button-area>
        <!-- <div class="add-classify-dialog fl"><i class="ifbp-icon-add" @click="addClassify"></i><span>新建分类</span></div> -->
        <el-button type="primary" @click="moveConfirm">确定</el-button>
        <el-button  @click="moveCancel">取消</el-button>
      </ifbp-form-button-area>
    </el-dialog>
    <!-- 查看关联功能 Dialog -->
    <el-dialog title='查看关联功能' :before-close="funConfirm" v-model="funDialogVisible" class="fun-dialog">
      <div class="fun-title">
        <span>报表</span>
        <span>功能</span>
        <span>磁贴</span>
      </div>
      <transverse-tree :treeData='treeData'></transverse-tree>
      <ifbp-form-button-area>
        <el-button type="primary" @click="funConfirm">确定</el-button>
      </ifbp-form-button-area>
    </el-dialog>
  </ifbp-page>
</template>

<script>
  import ifbpInfolistCard from './ifbp-infolist-card'
  import transverseTree from './transverseTree'
  export default {
    components: { ifbpInfolistCard,transverseTree },
    data() {
      var vm = this;
      return {
        currentFun: {},
        tplTablePk:'000115100000002ST57U',
        // funnode:'classification',
        // nexuskey:'BBFL',
        tplTableData: {},
        tplTableResetFun: function ($node) {
          var $table = this.getTableDom($node);
          var operateHtml =this.getTableOperateHtml([{title: "关联功能",icon: "developer-board"},{title: "删除",icon: "delete"},{title: "移动",icon: "right"},{title: "上移",icon: "ascending"},{title: "下移",icon: "descending"}]);// 操作列
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
        funDialogVisible: true,
        delDialogVisible: false,
        moveDialogVisible: false,
        ts: '',
        delIndex: '',
        addDialogFormReset:{},
        addDialogForm:{
          pk_report_class:'',//分类
          code:'',//编码
          name:'',//分类名称
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
        treeData: [
          {name:'报表名称1',
          children:[
            {name:'功能名称1',
            children:[
              {name:'磁贴名称1'}
            ]},
            {name:'功能名称2',
            children:[
              {name:'磁贴名称1'}
            ]},
            {name:'功能名称3',
            children:[
              {name:'磁贴名称1'}
            ]},
            {name:'功能名称4'},
            {name:'功能名称5'},
          ]}
        ],
        treeProps: {
          id: 'id',
          pid: 'pid',
          label: 'label',
          children: 'children'
        },
        // search template 相关
        classTplCode: 'BBFLSEARCH',
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
        classidyUrl:'/f/dap/reportClassMGT/',
        //分类
        classifyData:[],
        isRename:false,
        checkIndex:null,
        classifyTitle:'',
        classifyDialogData:[]
      };
    },
    directives: {
      focus: {
        // 指令的定义
        inserted: function (el) {
          el.focus()
        }
      }
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
      // table行的删除操作
      tplTableDeleteClick(scope) {
        this.$confirm('确认删除该数据？删除后无法恢复。', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () => {
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
      //table行的关联操作
      tplDeveloperClick(scope){
        this.funDialogVisible=true;
      },
      //table行的移动操作
      tplMoveClick(scope){
        // 备份数据
        this.rowData = JSON.parse(JSON.stringify(scope.row));
        this.classifyDialogData = JSON.parse(JSON.stringify(this.classifyData));
        this.moveDialogVisible=true;

      },
      //table行的上移
      tplAscendingClick(scope){

      },
      //table行的下移
      tplDescendingClick(scope){

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
      //左侧点击选中
      treeClick(value,index){
        if(this.classifyData[index].isEdit){
          return;
        }
        this.classifyData.forEach((item,i)=>{
          if(index==i){
            this.$set(item,'isCheck',true);
          }else{
            this.$set(item,'isCheck',false);
          }
        });
        this.checkIndex = index;
        this.pk_report_class_data = value;
        this.classifyTitle = this.classifyData[index].name;
        // this.highlightCurrent = true;
        this.request();
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
        // ajax 获取树数据
        const requestUrl = this.classidyUrl+'listAll';
        this.$http.get(requestUrl).then((res) => {
          if (res.data.status) {
            this.classifyData = res.data.data;
            if(this.checkIndex!=null){
              this.$set(this.classifyData[this.checkIndex],'isCheck',true);
              this.classifyTitle = this.classifyData[this.checkIndex].name;
            }
          }else if (res.data.error && res.data.error.errorMessage) {
            this.$message.error('信息获取失败: ' + res.data.error.errorMessage);
          }
        }).catch(() => {
          this.$message.error('请求失败');
        });
      },
      handleRefTrigger3(type, data) {
        if (type === 'change') {
          this.queryParams4.pk_app_area = data.value[0].id;
          this.$refs.ref4.reset();
        }
      },
      //得到焦点选中
      focus(event) {
        event.currentTarget.select();
      },
      blur(event,index){
        if(this.classifyData[index].name==''){
          this.classifyData[index].name='新建分类';
        }
        this.$set(this.classifyData[index],'isEdit',false);
        if(this.checkName(index)){
          let requestUrl = this.isRename?this.classidyUrl+'update':this.classidyUrl+'save';
          this.$http({
            url: requestUrl,
            method: 'post',
            data: this.classifyData[index]
          }).then((res) => {
            if(res.data.status == true) {
              this.getTreeData();
            } else {
              this.$message.error(res.data.msg);
              this.getTreeData();
            }
          }).catch(() => {
            this.$message.error('请求失败');              
          });
        }else{
          this.$message.error('分类名称不能重复');
          setTimeout(()=>{
            this.$set(this.classifyData[index],'isEdit',true);
          })
        }
      },
      addClassify(){
        if(this.checkEdit()){
          this.$message.info('请先保存当前分类');
        }else{
          this.classifyData.push({name:'新建分类',isEdit:true});
          this.isRename=false;
        }
      },
      //判断是否有编辑
      checkEdit(){
        let checkEditFlag=false;
        this.classifyData.forEach((item,i)=>{
          if(item.isEdit){
            return checkEditFlag = true;
          }
        });
        if(checkEditFlag){
          return true;
        }else{
          return false;
        }
      },
      //判断是否重名
      checkName(index){
        let checkFlag=true;
        this.classifyData.forEach((item,i)=>{
          if(item.name==this.classifyData[index].name && index!=i){
            return checkFlag = false;
          }
        });
        if(checkFlag){
          return true;
        }else{
          return false;
        }
      },
      //分类删除
      classifyDelete(column,index){
        this.$confirm('确认删除该数据？删除后无法恢复。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () => {
          let requestUrl = this.classidyUrl+'delete';
          this.$http.post(requestUrl,column).then((res)=>{
            if (res.data.status == true) {
              if(this.checkIndex == index){
                this.checkIndex = null;
                this.classifyTitle = '';
              }
              this.getTreeData();
            } else if (res.data.status == false) {
              this.$message.error(res.data.message);
            }
          }).catch((e) => {
            console.error(e);
            this.$message.error('操作失败');
          });
        }).catch(() => {});
      },
      //重命名
      classifyRename(index){
        if(this.checkEdit()){
          this.$message.info('请先保存当前分类');
        }else{
          this.$set(this.classifyData[index],'isEdit',true);
          this.isRename=true;
        }
      },
      //移动报表确定
      treeDialogClick(pk_report_class,index){
        this.rowData.pk_report_class=pk_report_class;
        this.classifyDialogData.forEach((item,i)=>{
          if(index==i){
            this.$set(item,'isCheck',true);
          }else{
            this.$set(item,'isCheck',false);
          }
        });
      },
      moveConfirm(){
        let requestUrl = this.stateUrl+'save';
        this.$http({
          url: requestUrl,
          method: 'post',
          data:this.rowData
        }).then((res) => {
          if(res.data.status == true) {
            this.moveCancel();
            this.request();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(() => {
          this.$message.error('请求失败');              
        });
      },
      moveCancel(){
        this.moveDialogVisible=false;
      },
      // 查看关联功能确定
      funConfirm(){
        this.funDialogVisible=false;
      },
    },
    created(){
      this.getTreeData();
      this.addDialogFormReset = this.addDialogForm;
    }
  };
</script>
<style scoped>
  .info-list .list-main-container{
    min-width: 900px;
  }
  .info-list .operator-container{
    min-width:820px;
  }
  .info-main-container {
    display: flex;
    flex: 1;
    min-height: 160px;
  }
  .info-list .tree-container {
    width: 240px;
    min-width:240px;
    margin-right: 16px;
    background: #ffffff;
    margin: -16px 16px -16px -16px;
    border-right: 16px solid #f0f0f5;
  }
  .right-container{
    position: relative;
    min-width:560px;
    background: #fff;
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
  /* 新增分类 */
  .add-classify{
    display: block;
    height: 32px;
  }
  .add-classify i{
    color: #75787B;
    margin: 6px 16px 0;
    font-size: 20px;
    cursor: pointer;
  }
  .add-classify-dialog{
    cursor: pointer;
    line-height: 32px;
  }
  .add-classify-dialog i{
    font-size:20px;
    vertical-align: middle;
  }
  .add-classify-dialog span{
    margin-left: 4px;
  }
  .classify-list .classify-li{
    height: 32px;
  }
  .classify-list .classify-li i{
    font-size: 16px;
    color: #5CB0E6;
    vertical-align: middle;
    margin: 0 8px 0 16px;
  }
  .classify-list .classify-li .ifbp-icon-more{
    display: none;
    margin: 0 0 0 5px;
  }
  .classify-list .classify-li:hover{
    cursor: pointer;
    background:#F0F5FA;
  }
  .classify-list .classify-li:hover .ifbp-icon-more{
    display: inline-block;
  }
  .classify-list .classify-li span{
    display: inline-block;
    width: 160px;
    line-height: 32px;
    font-size: 14px;
  }
  .classify-list .classify-li:hover span,.classify-list .classify-li.active span{
    color: #5CB0E6;
  }
  .classify-list .classify-li .classify-input{
    width: 160px;
    height: 16px;
    margin-top: 6px;
    border: 2px solid #5CB0E6;
    font-size: 14px;
    vertical-align: inherit;
  }
  .classify-title{
    font-weight: bold;
    font-size: 16px;
    color: #2D2D2D;
    letter-spacing: 0;
    line-height: 16px;
  }
  .classify-list-dialog {
    max-height: 300px;
    overflow: auto;
  }
  /* 查看关联功能 */
  .fun-title{
    height: 32px;
    line-height: 32px;
    margin: -16px -16px 16px -16px;
    border-bottom:1px solid #F0F0F5;
  }
  .fun-title span{
    display: inline-block;
    float: left;
    width: 202px;
    margin-left: 24px;
  }
  .fun-title span:first-child{
    margin-left: 16px;
  }
  .info-tree .el-tree {
    border: none;
  }
  .info-list > div {
    display: flex;
    flex-direction: column;
    min-height: 90%;
  }
</style>
<style>
  .fun-dialog .el-dialog{
    min-width: 690px;
    width: 690px;
    min-height: 562px;
  }
</style>