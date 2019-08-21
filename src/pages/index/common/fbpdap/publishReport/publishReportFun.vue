<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="发布报表功能"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area>
      <el-button type="primary" @click="publish">发布报表功能</el-button>
      <ifbp-search
        class="fr"
        :template-code="classTplCode"
        @search="handleSearch"
      >
      </ifbp-search>
    </ifbp-button-area>
    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <div class="ifbp-btn-line">
        <div class="fl">
          <span class="publish-title">已发布功能</span>
        </div>
        <div class="fr">
          <ifbp-table-card-icon :show-table="showTable" @update:showTable="value => this.showTable = value"></ifbp-table-card-icon><i class="ifbp-icon-setting" :class='{"disabled":!showTable}' @click="setHeader" title="设置"></i>
        </div>
      </div>
      <!-- UI模板组件 -->
      <ifbp-template 
        ref="publishTplRef"
        :pk-temp="tplTablePk"
        :tpl-data="tplTableData"
        show-type="table"
        :table-show-menu="false"
        :tpl-reset-fun="tplTableResetFun"
        @developer-board-table-click="tplDeveloperClick"
        @delete-table-click="tplTableDeleteClick"
        v-show="showTable"
        class="publish-table"
      >
      </ifbp-template>
      <!-- 卡片 -->
      <ifbp-publish-card
        v-show="!showTable"
        :card-data="cardData"
        @cardShowReportClick="tplShowReportClick"
        @cardDeveloperClick="tplDeveloperClick"
        @cardDeleteClick="tplTableDeleteClick"
      ></ifbp-publish-card>
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
    <!-- 发布功能弹窗 -->
    <el-dialog title="发布报表功能" :before-close="publishCancel" v-model="publishDialogVisible" class="publish-dialog">
      <el-steps :space="150" :active="stepActive" :center="true" :align-center="true" process-status="finish" finish-status="success" style="margin-bottom:16px;">
        <el-step title="创建功能"></el-step>
        <el-step title="选择报表"></el-step>
        <el-step title="确认发布"></el-step>
      </el-steps>
      <div class="publish-dialog-body">
        <!-- 第一步 -->
        <el-form :model="publishDialogForm" :rules="publishRules" :inline="true" label-width="90px" ref="publishEditForm" v-show='stepActive==0' class="publish-dialog-form">
          <el-form-item label="功能名称" required prop="fun_name">
            <el-input v-model="publishDialogForm.fun_name" placeholder="请输入功能名称"></el-input>
          </el-form-item>
          <el-form-item label="功能编码" required prop="funcode">
            <el-input v-model="publishDialogForm.funcode" placeholder="请输入功能编码"></el-input>
          </el-form-item>
          <el-form-item label="所属模块" prop="own_model" required>
            <el-ref
              ref-code="systypecode"
              field="own_model"
              :template-value="publishDialogForm"
              width="300px"
              :editable="true"
              @trigger="handleRefTrigger3"
              placeholder="请选择所属模块">
            </el-ref>
          </el-form-item>
          <el-form-item label="功能分类" prop="pk_func_class" required>
            <el-ref
              ref-code="appgroupref"
              ref="ref4"
              field="pk_func_class"
              :template-value="publishDialogForm"
              width="300px"
              :editable="true"
              :query-params="queryParams4"
              placeholder="请选择功能分类">
            </el-ref>
          </el-form-item>
          <el-form-item label="功能描述" class="publish-block"  prop="fun_desc">
            <el-input type="textarea" :rows="2" placeholder="请输入功能描述" resize="none" v-model="publishDialogForm.fun_desc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 第二步 -->
        <div class="publish-main-container" v-show='stepActive==1'>
          <div class="tree-container fl">
            <ul class="classify-list" v-if="Array.isArray(classifyData) && classifyData.length">
              <li class="classify-li" v-for="(column,index) in classifyData" @click="treeClick(column.pk_report_class,index)" :class="{'active':column.isCheck}">
                <i class="hr-icon-folder-solid"></i><span>{{column.name}}</span>
              </li>
            </ul>
          </div>
          <div class="right-container">
            <!-- UI模板组件 -->
            <ifbp-template 
              ref="infoTplTableRef"
              :pk-temp="publishTplTablePk"
              show-type="table"
              :table-show-menu="false"
              :tpl-reset-fun="dialogTableResetFun"
              @row-click="rowClick"
              @selection-change="handleSelectionChange"
            >
            </ifbp-template>
          </div>
        </div>
        <!-- 第三步 -->
        <!-- 卡片 -->
        <ul class="report-card-area" v-if='stepActive==2 &&cardReportData && cardReportData.length'>
            <!-- <li class="report-add">
              <div class="report-card-div">
                <i class="ifbp-icon-plus-square"></i>
              </div>
            </li> -->
            <li v-for="(column,index) in cardReportData" draggable="true"> 
                <div class="report-card-div">
                    <div class="report-main-area">
                      <div class="fl report-l-area">
                          <i class="ifbp-icon-description"></i>
                      </div>
                      <div class="report-r-area">
                        <label class="strong"><span>{{column.name}}</span></label>
                        <label><span>{{column.type==0?'报表':'仪表板'}}</span></label>
                      </div>
                    </div>
                    <i class="ifbp-icon-power-off delete-icon" @click='deleteReportCard(index)'></i>
                </div>
            </li>
        </ul>
      </div>
      <ifbp-form-button-area>
        <el-button type="primary" @click='publishConfirm' v-if='stepActive==2'>确认发布</el-button>
        <el-button type="primary" @click='publishNextStep' v-if='stepActive!=2' :disabled='publishDialogForm.fun_name=="" || publishDialogForm.funcode=="" || publishDialogForm.own_model==""||publishDialogForm.pk_func_class==""?true:false'>下一步</el-button>
        <el-button @click='publishPreviousStep' v-if='stepActive!=0'>上一步</el-button>
        <el-button  @click="publishCancel" v-if='stepActive==0'>取消</el-button>
      </ifbp-form-button-area>
    </el-dialog>
    <!-- 查看功能弹窗 -->
    <el-dialog title="查看功能" :before-close="showPublishCancel" v-model="showPublishDialogVisible" class="publish-dialog">
      <el-steps :space="150" :active="showStepActive" :center="true" :align-center="true" process-status="finish" finish-status="success" style="margin-bottom:16px;" v-if="showSteps">
        <el-step title="选择报表"></el-step>
        <el-step title="确认发布"></el-step>
      </el-steps>
      <div class="publish-dialog-body" :class='{"show-active":!showSteps}'>
        <!-- 第一步 -->
        <el-form :model="showPublishDialogForm" label-width="90px" :inline="true" ref="showPublishEditForm" class="publish-dialog-form" v-show='showStepActive==1&&showSteps || !showSteps'>
          <el-form-item label="功能名称:" required prop="fun_name">
            <el-input v-model="showPublishDialogForm.fun_name" placeholder="请输入功能名称"></el-input>
          </el-form-item>
          <el-form-item label="功能编码:" required prop="funcode">
            <el-input v-model="showPublishDialogForm.funcode" placeholder="请输入功能编码"></el-input>
          </el-form-item>
          <el-form-item label="所属模块" prop="own_model" required>
            <el-ref
              ref-code="systypecode"
              field="own_model"
              :template-value="showPublishDialogForm"
              width="300px"
              :editable="true"
              @trigger="handleRefTrigger3"
              placeholder="请选择">
            </el-ref>
          </el-form-item>
          <el-form-item label="功能分类" prop="pk_func_class" required>
            <el-ref
              ref-code="appgroupref"
              ref="ref4"
              field="pk_func_class"
              :template-value="showPublishDialogForm"
              width="300px"
              :editable="true"
              :query-params="queryParams4"
              placeholder="请选择">
            </el-ref>
          </el-form-item>
          <el-form-item label="功能描述"  class="publish-block" prop="fun_desc">
            <el-input type="textarea" :rows="2" placeholder="请输入功能描述" resize="none" v-model="showPublishDialogForm.fun_desc"></el-input>
          </el-form-item>
          <el-form-item label="URL" class="publish-block">
            <el-input :rows="2" :editable="false" v-model="showPublishDialogForm.url"></el-input>
          </el-form-item>
        </el-form>
        <!-- 卡片 -->
        <ul class="report-card-area" v-if='cardReportData && cardReportData.length' v-show='showStepActive==1&&showSteps || !showSteps'>
            <li class="report-add">
              <div class="report-card-div" @click='addReport()'>
                <i class="ifbp-icon-plus-square"></i>
              </div>
            </li>
            <li v-for="(column,index) in cardReportData" :draggable="true"> 
              <div class="report-card-div">
                <div class="report-main-area">
                  <div class="fl report-l-area">
                      <i class="ifbp-icon-description"></i>
                  </div>
                  <div class="report-r-area">
                    <label class="strong"><span>{{column.name}}</span></label>
                    <label><span>{{column.type==0?'报表':'仪表板'}}</span></label>
                  </div>
                </div>
                <i class="ifbp-icon-power-off delete-icon" @click='deleteReportCard(index)'></i>
              </div>
            </li>
        </ul>
        <!-- 第二步 -->
        <div class="publish-main-container" v-show='showStepActive==0&&showSteps'>
          <div class="tree-container fl">
            <ul class="classify-list" v-if="Array.isArray(classifyData) && classifyData.length">
              <li class="classify-li" v-for="(column,index) in classifyData" @click="treeClick(column.pk_report_class,index)" :class="{'active':column.isCheck}">
                <i class="hr-icon-folder-solid"></i><span>{{column.name}}</span>
              </li>
            </ul>
          </div>
          <div class="right-container">
            <!-- UI模板组件 -->
            <ifbp-template 
              ref="infoTplTableRef"
              :pk-temp="publishTplTablePk"
              show-type="table"
              :table-show-menu="false"
              :tpl-reset-fun="dialogTableResetFun"
              @row-click="rowClick"
              @selection-change="handleSelectionChange"
            >
            </ifbp-template>
          </div>
        </div>
      </div>
      <ifbp-form-button-area>
        <el-button type="primary" @click='showPublishConfirm' v-if='showStepActive==1&&showSteps || !showSteps'>确定</el-button>
        <el-button type="primary" @click='showPublishConfirm' v-if='showStepActive==0&&showSteps'>下一步</el-button>
        <el-button  @click="showPublishCancel">取消</el-button>
      </ifbp-form-button-area>
    </el-dialog>
    <!-- 查看关联功能 Dialog -->
    <el-dialog title='查看关联报表' :before-close="funConfirm" v-model="funDialogVisible" class="fun-dialog">
      <div class="fun-title">
        <span>磁贴</span>
        <span>功能</span>
        <span>报表</span>
      </div>
      <transverse-tree :treeData='treeData' :parentsIcon='parentsIcon' :grandchildrenIcon='grandchildrenIcon'></transverse-tree>
      <ifbp-form-button-area>
        <el-button type="primary" @click="funConfirm">确定</el-button>
      </ifbp-form-button-area>
    </el-dialog>
  </ifbp-page>
</template>

<script>
  import ifbpPublishCard from './ifbp-publish-card'
  import transverseTree from '../statements/transverseTree'
  // import publish_mock from './publish_mock.js'
  export default {
    components: { ifbpPublishCard,transverseTree},
    data() {
      let vm = this;
      return {
        currentFun: {},
        tplTablePk:'000111100000002VWZBI',
        publishTplTablePk:'0001151000000035VD7H',
        tplTableData: {
          tplShowReportClick(){
            vm.funDialogVisible=true;
          }
        },
        tplTableResetFun: function ($node) {
          let $table = this.getTableDom($node);
          let operateHtml =this.getTableOperateHtml([{title: "查看",icon: "developer-board"},{title: "删除",icon: "delete"}]);// 操作列
          $table.append(operateHtml);
          let $funName = $node.find("[ _id='6tyrzwscgm2']"); // 功能名称
          $funName.html(`
            <template scope="scope">
              <span @click="tplShowReportClick" style="cursor:pointer;">{{scope.row.fun_name}}</span>
            </template>
          `);
          return $node[0].outerHTML;
        },
        dialogTableResetFun: function ($node) {
          let $table = this.getTableDom($node);
          $table.attr(":adaptation", false);
        },
        /**
         * 分页传入参数
         */
        totalElements: 0,
        currentPage: 1,
        pageSize: 10,
        // 弹窗
        publishTotalElements: 0,
        publishCurrentPage: 1,
        publishPageSize: 10,
        /**
         * dialogs 相关
         */
        publishDialogVisible:false,
        showPublishDialogVisible:false,
        funDialogVisible:false,
        // ref相关
        treeData: [
          {name:'磁贴名称1',
          children:[
            {name:'功能名称1',
            children:[
              {name:'报表名称1'},
              {name:'报表名称2'},
              {name:'报表名称3'},
              {name:'报表名称4'},
              {name:'报表名称5'},
            ]},
          ]},
        ],
        parentsIcon:'ifbp-icon-patch',
        grandchildrenIcon:'ifbp-icon-description',
        tplTree: [],      
        // search template 相关
        classTplCode: 'func',
        searchData:null,
        searchTpl: {},
        //卡片列表切换
        showTable: true,
        cardData:[],
        rowData:[],
        stateUrl:'/baseapp/funcMGT/',
        //进度
        stepActive:0,
        showStepActive:0,
        // 发布功能弹窗
        publishDialogForm:{
          fun_name: '',//功能名称
          funcode: '',//目标功能编码
          pk_func_class:'',//功能分类
          own_model: "",//所属模块
          fun_desc:'',//描述
          pk_reports:[]
        },
        showPublishDialogForm:{},
        //分类
        classidyUrl:'/f/dap/reportClassMGT/',
        reportStateUrl:'/f/dap/reportMGT/',
        pkReportClassData:'',
        classifyData:[],
        isRename:false,
        checkIndex:null,
        cardReportData:[],//弹窗报表
        selectFlag:true,
        showSteps:false,
        publishShowUrl:'http://10.10.4.231:18888/ap/login.html?r=L2Fw',
        queryParams4: {
          pk_app_area:''
        },
        queryParams3: {
          systypecode:''
        },
        publishRules:{     
          own_model: [{ required: true, message: '所属模块不能为空', trigger: 'blur' }],
          pk_func_class: [{ required: true, message: '功能分类不能为空', trigger: 'blur' }],
          funcode: [
            { required: true, message: '功能编码不能为空', trigger: 'blur' }],
          fun_name: [
            { required: true, message: '功能名称不能为空', trigger: 'blur' }],
          fun_desc: [
            { required: false}],
        },
      };
    },
    methods: {
      // 获取模板列表
      request(n, s) {
        var url;
        if (n === undefined) {
          url = "/baseapp/funcMGT/pageList?pn=1&ps=10";
        } else {
          url = "/baseapp/funcMGT/pageList?pn=" + n + "&ps=" + s;
        }
        this.$http({
          url: url,
          method: "post",
          data:this.searchData,
          headers: {
              "Content-Type": "application/json"
          },
          dataType: "application/json"
        }).then((res) => {
          this.cardData = res.data.data.content;
          this.$refs.publishTplRef.setTableData(res.data.data.content);
          this.totalElements = res.data.data.totalElements; // 总条数
          this.size = res.data.data.size; // 每页的条数
        })
          .catch(() => {
            this.$message({
              message: "信息获取失败",
              type: "error"
            });
          });
      },
      /**
     * 分页
     */
      handleSizeChange(val) {
        this.request(1, val);
      },
      handleCurrentChange(val) {
        this.request(val, this.size);
      },
      publishSizeChange(val) {
        this.publishCurrentPage = 1;
        this.publishPageSize = val;
        this.requestReportFn();
      },
      publishCurrentChange(val) {
        this.publishCurrentPage = val;
        this.requestReportFn();
      },
      /**
       * UI模板方法
       */
      // table行的删除操作
      tplTableDeleteClick(scope) {
        let scopeObj = scope;
        this.$confirm('确认删除该数据？删除后无法恢复。').then( () => {
          let requestUrl = this.stateUrl+'delete';
          this.$http.post(requestUrl,scope.row).then((res)=>{
            if (res.data.status == true) {
              this.$message.success('删除成功');
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
      //table行的报表展示操作
      tplShowReportClick(scope){
        this.funDialogVisible=true;
      },
      tplDeveloperClick(scope){
        this.showPublishDialogForm=JSON.parse(JSON.stringify(scope.row));
        this.showPublishDialogVisible=true;
      },
      //发布功能
      publish() {
        this.publishDialogVisible = true;
      },
      publishCancel(){
        this.publishDialogForm.pk_reports=[];
        this.$refs['publishEditForm'].resetFields();
        this.stepActive = 0;
        this.classifyData.forEach((item,i)=>{
          this.$set(item,'isCheck',false);
        });
        this.$refs.infoTplTableRef.setTableData();
        this.publishDialogVisible = false;
      },
      //上一步
      publishPreviousStep(){
        if(this.stepActive==1){
        }else if(this.stepActive==2){
          this.treeClick(this.pkReportClassData,this.checkIndex);
        }else if(this.stepActive==3){
        }
        this.stepActive--;
      },
      //下一步
      publishNextStep(){
        if(this.stepActive==0){

        }else if(this.stepActive==1){
          this.cardReportData = [];
          for(let value of this.classifyData){
            this.cardReportData.push(...value.pk_reports);
          }
        }
        this.stepActive++;
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
        this.searchData = tpl;
        this.request();
      },
      setHeader(){
        if(this.showTable){
          this.$refs.publishTplRef.setTransferVisible(true);
        }
      },
      // 获取树数据
      getTreeData() {
        // ajax 获取树数据
        const requestUrl = this.classidyUrl+'listAll';
        this.$http.get(requestUrl).then((res) => {
          if (res.data.status) {
            this.classifyData = res.data.data;
          }else if (res.data.error && res.data.error.errorMessage) {
            this.$message.error('信息获取失败: ' + res.data.error.errorMessage);
          }
        }).catch(() => {
          this.$message.error('请求失败');
        });
      },
       //左侧点击选中
      treeClick(value,index){
        this.checkIndex = index;
        this.selectFlag = false;
        this.classifyData.forEach((item,i)=>{
          if(index==i){
            this.$set(item,'isCheck',true);
          }else{
            this.$set(item,'isCheck',false);
          }
        });
        this.pkReportClassData = value;
        this.requestReportFn();
      },
      // 获取模板列表
      requestReportFn(){
        let requestUrl = this.reportStateUrl+'pageList';
        let searchMapObj = {};
        if(this.pkReportClassData){
          searchMapObj = {
              pk_report_class: this.pkReportClassData
            };
        }
        let requestData = {
          searchParams: {
            searchMap: searchMapObj
          },
          pageNum: 1,
          pageSize: 9999
        };
        this.$http({
          url: requestUrl,
          method: 'post',
          data: requestData,
          dataType: 'json'
        }).then((res) => {
          if (res.data.status === true) {
            let vm = this;
            let contentData = res.data.data.content;
            this.$refs.infoTplTableRef.setTableData(contentData);
            this.publishTotalElements = res.data.data.totalElements;
            this.publishPageSize = res.data.data.size;
            this.$nextTick(()=>{
              contentData.forEach(row => {
                if(this.classifyData[this.checkIndex].pk_reports&&this.classifyData[this.checkIndex].pk_reports.length>0){
                  for(let value of this.classifyData[this.checkIndex].pk_reports){
                    if (row.pk_report == value.pk_report){
                      this.$refs.infoTplTableRef.getTableComp().toggleRowSelection(row,true);
                      return;
                    }
                  }
                }
              });
              this.selectFlag = true;
            });
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch((e) => {
          this.$message.error('操作异常');
        });
      },   
      toggleSelection(rows) {
        if (rows) {
          // rows.forEach(row => {
          //   this.$refs.multipleTable.toggleRowSelection(row);
          // });
        } else {
          // this.$refs.multipleTable.clearSelection();
        }
      },
      // table选中改变
      handleSelectionChange(selection) {
        if(this.selectFlag){
          this.classifyData[this.checkIndex].pk_reports = selection;
        }
      },
      //删除预览卡片
      deleteReportCard(index){
        this.classifyData.forEach((classItem,classIndex)=>{
          if (this.cardReportData[index].pk_report_class == classItem.pk_report_class){
            classItem.pk_reports.forEach((item,i)=>{
              if(this.cardReportData[index].pk_report == item.pk_report){
                this.classifyData[classIndex].pk_reports.splice(i,1);
              }
            });
          }
        });
        this.cardReportData.splice(index,1);
      },
      //确认发布
      publishConfirm(){
        this.publishDialogForm.pk_reports=this.cardReportData;
        console.log(this.publishDialogForm);
        this.showPublishDialogForm=JSON.parse(JSON.stringify(this.publishDialogForm));
        // this.publishCancel();
        // this.showPublishDialogVisible=true;
        let requestUrl = this.reportStateUrl+'publishfunction';
        this.publishDialogForm.pk_reports=[];
        this.cardReportData.forEach((item,i)=>{
          this.publishDialogForm.pk_reports.push(item.pk_report);
        });
        this.$refs.publishEditForm.validate((valid) => {
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
      //查看功能取消
      showPublishCancel(){
        this.showPublishDialogForm={};
        this.showSteps=false;
        this.showStepActive = 0;
        this.classifyData.forEach((item,i)=>{
          this.$set(item,'isCheck',false);
        });
        this.$refs.infoTplTableRef.setTableData();
        this.showPublishDialogVisible = false;
      },
      //添加报表
      addReport(){
        this.showSteps=true;
      },
      rowClick(row){
        this.$refs.infoTplTableRef.getTableComp().toggleRowSelection(row);
      },
      handleRefTrigger3(type, data) {
        if (type === 'change') {
          if(data.value&&data.value.length>0){
            this.queryParams4.pk_app_area = data.value[0].id;
          }
          this.$refs.ref4.reset();
        }
      },
      showPublishConfirm(){
        
      },
      // 查看关联功能确定
      funConfirm(){
        this.funDialogVisible=false;
      },
    },
    created(){
      this.request();
      this.getTreeData();
    }
  };
</script>
<style scoped>
  .publish-title{
    font-weight: bold;
    font-size: 16px;
    color: #2D2D2D;
    letter-spacing: 0;
    line-height: 16px;
  }
  .publish-main-container .classify-list .classify-li{
    height: 32px;
  }
  .publish-main-container .classify-list .classify-li i{
    font-size: 16px;
    color: #5CB0E6;
    vertical-align: middle;
    margin: 0 8px 0 16px;
  }
  .publish-main-container .classify-list .classify-li:hover{
    cursor: pointer;
    background:#F0F5FA;
  }
  .publish-main-container .classify-list .classify-li span{
    display: inline-block;
    width: 155px;
    line-height: 32px;
    font-size: 14px;
  }
  .publish-main-container .classify-list .classify-li:hover span,.publish-main-container .classify-list .classify-li.active span{
    color: #5CB0E6;
  }
  .publish-main-container{
    height: 100%;
    border-top:1px solid  #F0F0F5;
    border-bottom:1px solid  #F0F0F5;
    box-sizing: border-box;
    overflow: auto;
  }
  .publish-main-container .tree-container{
    width: 200px;
    box-sizing: border-box;
    height: 100%;
    padding: 16px 0;
    border-right: 1px solid #F0F0F5;
  }
  .publish-main-container .right-container{
    margin-left:200px;
  }
  /* 弹窗卡片 */
  .report-card-area{
    position: relative;
    margin: 0 8px;
    padding: 0;
  }
  .report-card-area li{
    float:left;
    margin: 0 0 16px;
    box-sizing: border-box;
    min-width: 206px;
    height: 58px;
    width: 33.3%;
    border: none;
    border-left: 8px solid #fff;
    border-right: 8px solid #fff;
  }
  .report-card-area li .report-card-div{
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    height: 58px;
    padding: 8px 0 0 8px;
    background: #FFFFFF;
    border: 1px solid #F0F0F5;
    border-radius: 4px;
  }
  .report-card-area li .report-card-div:hover{
    background: rgba(243,246,249,0.50);
    box-shadow: 0 2px 4px 0 #E2E8EF;
  }
  .report-card-area .report-l-area i{
    font-size: 20px;
    color: #5CB0E6;
  }
  .report-card-area .report-r-area label{
    display: block;
    width:100%; 
    box-sizing: border-box;
    padding-right: 5px;
    white-space:nowrap; 
    overflow:hidden; 
    text-overflow:ellipsis; 
    font-size:14px;
    height: 18px;
    margin-bottom: 8px;
    color: #75787B;
  }
  .report-card-area .report-r-area label.strong{ 
    color: #2D2D2D;
  }
  .report-card-area .report-r-area{
    box-sizing: border-box;
    margin-left: 28px;
  }
  .report-card-area li.report-add .report-card-div{
    text-align: center;
    line-height: 58px;
    background: #F5F5FA;
    border: 1px dotted #D2D2D7;
    border-radius: 4px; 
    cursor: pointer;
    padding: 0;
  }
  .report-card-area li.report-add .report-card-div:hover{
    background: #F5F5FA;
    box-shadow: none;
  }
  .report-add .report-card-div i{
    font-size: 18px;
    color: #C8C8CD;
    vertical-align: middle;
  }
  .report-card-area .delete-icon{
    display: none;
    position: absolute;
    font-size: 16px;
    color: #C8C8CD;
    top: 10px;
    right: 14px;
    z-index: 10;
    cursor: pointer;
  }
  .report-card-area li .report-card-div:hover .delete-icon{
    display: inline-block;
  }
  .publish-dialog-body{
    height:386px;
    margin:0 -16px;
    overflow: auto;
  }
  .publish-dialog-body.show-active{
    height:466px;
  }
  .publish-dialog-body .publish-dialog-form{
    margin: 0 16px;
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
</style>
<style>
  .publish-dialog  .el-dialog{
    max-width: 686px;
    width: 686px;
    height: 614px;
    min-height: 614px;
  }
  .publish-dialog .el-dialog__body{
    height: 518px;
    min-height: 518px;
    max-height: 518px;
  }
  .publish-dialog .el-form--inline .el-form-item__content {
    width: calc(100% - 90px);
  }
  .publish-dialog .el-form--inline .el-form-item {
    /* width: 325px; */
    width: 49.6%;
  }
  .publish-dialog .el-form--inline .el-form-item.publish-block{
    width: 100%;
  }
  .publish-main-container .yon-uitemplate{
    margin-top:0;
  }
  .fun-dialog .el-dialog{
    min-width: 690px;
    width: 690px;
    min-height: 562px;
  }
</style>