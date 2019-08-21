<template>
  <div class="main-panel">
    <ifbp-breadcrumb name="审批中心"></ifbp-breadcrumb>
    <!-- 按钮区域 -->
    <ifbp-button-area>
    <template v-show="approvestatus === '0'">
        <el-button
          v-show="approvestatus === '0'" 
          v-for="(item,index) in mainBtns" :key="index" 
          @click="triggerClick(item, 1,2)" 
          v-text="item.displayname">
        </el-button>
    </template>
      <ifbp-search class="fr"
                  :template-code="searchCode"
                  ref="approveSearchRef"
                  @search="handleSearch"
                  @select="handleSearch"
                  @ready="handleSearchReady"
                  :focus-input-on-mounted="true"
                  :conditions-before-advance="conditionCount"
                  :options-before-more="optionCountBeforeMore">
      </ifbp-search>
    </ifbp-button-area>
    <!-- 主体区域 -->
    <ifbp-main-area type="list">
    <!-- <div class="list-main-container clearfix"> -->
      <!-- UI模板组件 -->
      <ifbp-template ref="tableRef"
                    tpl-id="approveCenter"
                    :tpl-data="tableData"
                    show-type="table"
                     :methods="tableMethods"
                     :auto-create="false"
                    :tplResetFun="tableResetFun"
                     @selection-change="tableSelectionChange"
      >
      </ifbp-template>
      <!--分页组件-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements"
        >
      </el-pagination>
    </ifbp-main-area>
    <!-- </div> -->

    <!--批准Dialog-->
      <el-dialog
        title="批准"
        :visible.sync="approveDialogVisible"
        size="tiny">
        <el-form ref="assignFormRef" :model="assignFormData" :rules="rules" :inline="false" class="agree_assign"> 
          <el-form-item required prop="designate" v-if='optionData.length > 0' >
            <el-select style="width:368px" v-model="assignFormData.designate" multiple placeholder="请选择指派人">
              <el-option
                  v-for="item in optionData"
                  :label="item.name"
                  :value="item.pk_user"
                  :key="item.pk_user"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item   v-if = 'has_preset_message' >
            <el-select v-model="presetMessageStr" @change="handlePresetMessageChange" placeholder="常用审批语" >
              <el-option
                v-for="value in presetMessageArray"
                :label="value.presetMessage"
                :value="value.presetMessage"
                :key="value.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-input style="width:368px" type="textarea"
                    :rows="2"
                    :maxlength="500"
                    placeholder="同意"
                    show-close="false"
                    v-model="opinion"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">取 消</el-button>
        <el-button type="primary" @click="approveClick">确 定</el-button>
      </span>
      </el-dialog>

    <!--驳回Dialog-->
    <el-dialog
      title="驳回"
      :visible.sync="rejectDialogVisible"
      size="tiny">
      
      <el-form :inline="false" class="reject_">
        <el-form-item  class="rejectto">
          <el-select v-model='rejectTo' placeholder="请选择驳回节点" >
            <el-option
            v-for="node in nodeList"
            :key="node.value"
            :label="node.key"
            :value="node.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
        <el-form-item v-if = 'has_preset_message'>
          <el-select v-model="presetMessageStr" @change="handlePresetMessageChange" placeholder="常用审批语" >
            <el-option
            v-for="value in presetMessageArray"
            :label="value.presetMessage"
            :value="value.presetMessage"
            :key="value.id">
            </el-option>
          </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea"
              :rows="2"
              :maxlength="500"
              placeholder="驳回"
              show-close="false"
              v-model="opinion"
              >
          </el-input>
        </el-form-item>
        <el-form-item class="isRepeat">
            <el-radio class="radio_isRepeat" v-model="isRepeat" label="1">重走流程</el-radio>
            <el-radio class="radio" v-model="isRepeat" label="2">不重走流程</el-radio>
        </el-form-item>  
      </el-form> 
      <span slot="footer" class="dialog-footer">
      <el-button @click="rejectDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="rejectClick">确 定</el-button>
    </span>
    </el-dialog>

 <!--批量审批Dialog-->
    <el-dialog
      title="批量批准"
      :visible.sync="multiApproveClickDialogVisible"
      size="tiny">
      <el-form :inline="false" class="batch_agree">
        <el-form-item v-if = 'has_preset_message'>
            <el-select v-model="presetMessageStr" @change="handlePresetMessageChange" placeholder="常用审批语" >
              <el-option
              v-for="value in presetMessageArray"
              :label="value.presetMessage"
              :value="value.presetMessage"
              :key="value.id">
              </el-option>
            </el-select>
            </el-form-item>
        </el-form-item>
        <el-form-item>
            <el-input type="textarea"
                :rows="2"
                :maxlength="500"
                placeholder="同意"
                show-close="false"
                v-model="opinion"
                >
            </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="multiApproveClickDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="multiApproveClick">确 定</el-button>
    </span>
    </el-dialog>
 <!--批量驳回Dialog-->
    <el-dialog
      title="批量驳回"
      :visible.sync="multiRejectClickDialogVisible"
      size="tiny">
      <el-form :inline="false" class="batch_reject">
        <el-form-item v-if = 'has_preset_message'>
            <el-select v-model="presetMessageStr" @change="handlePresetMessageChange" placeholder="常用审批语" >
              <el-option
              v-for="value in presetMessageArray"
              :label="value.presetMessage"
              :value="value.presetMessage"
              :key="value.id">
              </el-option>
            </el-select>
            </el-form-item>
        </el-form-item>
        <el-form-item>
            <el-input type="textarea"
                :rows="2"
                :maxlength="500"
                placeholder="同意"
                show-close="false"
                v-model="opinion"
                >
            </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="multiRejectClickDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="multiRejectClick">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
  import pageModelMixin from '../../ulit/pageModelMixin.js';
export default {
  mixins: [pageModelMixin],
  data() {
    var vm = this;
    return {
      presetMessageArray: [],
      presetMessageStr: "",
      has_preset_message:false,
      conditionCount: 4,
      optionCountBeforeMore: 8,
      condtionOpt:{},
      mainBtns:[],
      listUrl: '/riart/task/pageList/center',
      // 查询模板传入参数
      searchCode: "approveCenter",
      searchData: "",
      // UI模板传入参数
      tableData: {},
      opinion:"",
      rejectTo: "",
      isRepeat:"1",
      designateList:[],
      nodeList:[],
      assignFormData:{
          designate:[]
      },
      inputVal:'',
      optionData:[],
      rules: {
          designate: [
              { required: true, message: '请选择指派人', trigger: 'blur' },
          ]
      },
      approvestatus:"0",
      tableMethods: {
        tableShowClick: function(scope) {
          var weburl = "";
          var billType = scope.row.reason3;
          var billId = scope.row.billid;
          this.$http({
            method: "get",
            url: '/riart/task/getWebUrl?billType='+billType+'&billId=' + billId
          }).then(function(res) {
            if (res.data.status === true) {
              weburl = res.data.data;
              if(weburl === ""){
                this.$message({
                  message: "地址为空",
                  type: "error"
                });
              }else{
                //window.open(weburl);
                 vm.$router.push(weburl) ;

              }
            }
          }).catch(function() {
              this.$message({
                message: "地址获取失败",
                type: "error"
              });
            });
        },
        tableApproveClick: function(scope) {

          vm.approveRow = scope.row;
          vm.getAssignment(vm.approveRow);        
          vm.opinion = "";
        },
        tableRejectClick: function(scope) {
          vm.rejectRow = scope.row;
          vm.getRejectData(vm.rejectRow);
          vm.opinion = "";
          vm.rejectTo = "";          
        },
      },
      tableResetFun: function($node) {
        // 增加默认的新增删除按钮
        var $table = this.getTableDom($node);
        var $columns = $node.find('el-table-column[prop="billno"]');
        $columns.html('<template scope="scope"><a href="javascript:;" @click="tableShowClick(scope)" class="op-a">{{scope.row.billno}}</a></template>');
        var baseOperateArr = [];
        if(vm.approvestatus === "0"){
          baseOperateArr = [
            {
              title: "批准",
              click: "tableApproveClick",
              icon: "check_circle_outline"
            },
            {
              title: "驳回",
              click: "tableRejectClick",
              icon: "highlight_off"
            }
          ];
        }
        var operateHtml = this.getTableOperateHtml(baseOperateArr,'','','text');
        $table.append(operateHtml);
        return $node[0].outerHTML;
      },


      // 分页组件传入参数
      totalElements: 0,
      currentPage: 1,
      size: 10,
      // 是否显示dialog
      approveDialogVisible:false,
      rejectDialogVisible:false,
      clickDialogVisible: false,
      multiApproveClickDialogVisible: false,
      multiRejectClickDialogVisible: false
    };
  },
  created() {
    // this.getPageModel(function (pageModel) {
    //     this.mainBtns = pageModel.getButtons("approveCenter");
    //   });
    //    this.request(this.currentPage, this.size,);
  },
  mounted(){
      this.getPageModel(function (pageModel) {
          this.mainBtns = pageModel.getButtons("approveCenter");
      });
      this.request(this.currentPage, this.size,);
      this.getFCPresetMessage();
  },

  methods: {
    cancelClick() {
      this.$emit("input", false);
    },
    getAssignment(rowData) {
      var vm = this;
      vm.assignFormData.designate = [];
      vm.designateList = [];
      vm.inputVal = "";
      vm.optionData = [];
      var params = {
        billType: rowData.reason3,
        billId:rowData.billid
      };
      vm.$http({
        url: "/riart/fbpworkflows/assign-checking",
        method: "get",
        params: params
      }).then(function(res) {
          if (res.data.status) {
            if(res.data.data){
                let getData = res.data.data;
                vm.inputVal = getData[0].activityDesc;
                vm.optionData = getData[0].allUsers;
                vm.designateList = getData;
                vm.designateList.forEach(function(item, index) {
                  vm.$set(item, "participants_01", []);
                  item.participants_02 = [];
                });
                vm.approveDialogVisible = true;
            }
          } else {
            vm.assignFormData.designate = [];
            vm.designateList = [];
            vm.inputVal = "";
            vm.optionData = [];
            vm.approveDialogVisible = true;
          }
        }).catch(function() {
          // vm.$message.error("获取被指派人列表失败");
        });
    },
    getFCPresetMessage() {
      var vm = this;
      vm.$http({
          url: "/riart/fbpworkflows/getFCPresetMessage",
          method: "get"
        }).then(function(res) {
          if(response.data.status === true){
            if(response.data.data){
              vm.presetMessageArray = res.data.data;
              vm.has_preset_message = true;
            }
          }else{
              vm.presetMessageArray = [];
          }
        }).catch(function() {
          //vm.$message.error("请求失败！");
        });
    },
    handlePresetMessageChange(item){
      var vm = this;
      vm.presetMessageStr = item;
      vm.opinion = item;
    },
    getRejectData(rowData){
          var vm = this;
          vm.$http.get("/riart/task/reject-check", {
            params: {
                pk_workflownote: rowData.pk_checkflow
            }
          }).then(function(response) {
            if (response.data.status === false) {
              vm.$message.error(response.data.msg);
            } else {
              var newList = response.data.data;
              // 将取到的值处理一下
              var curList = [];
              newList.forEach(function(item) {
                var obj = {
                  key: item.activityDesc,
                  value: item.activityDefId
                };
                curList.push(obj);
              });
              vm.nodeList = curList;
              vm.rejectDialogVisible = true;
            }
          }).catch(function(error) {
              vm.$message.error("获取驳回列表失败！");
          });
    },
    ifbpPageInit(){
      this.request(this.currentPage, this.size,);
    },
    resetForm:function() {
      this.approveDialogVisible = false
      this.$refs["assignFormRef"].resetFields();
    },
    // 请求数据
    request(curPage, size) {
      var _this = this;
      var data = {
        pageNum: curPage || 1,
        pageSize: size || _this.size,
      };
      if (_this.searchData) {
        data.searchParams = {
          searchMap: {
            qtAggVO: JSON.stringify(_this.searchData)
          }
        };
      }
      _this.$http({
        url: _this.listUrl,
        method: "post",
        data: data,
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json"
      }).then(function(res) {
          if (res.data.status === true) {
            if(res.data.approvestatus){
                _this.approvestatus = res.data.approvestatus;
            }
            _this.$refs.tableRef.init();
            var vm = res.data.data.content || [];
            if (vm && vm.length) {
              vm.forEach(function (v, i) {
                vm[i].reason3 = vm[i].billtype;
                vm[i].billtype = res.data.addresultMap.billTypeMap[vm[i].billtype];
              });
            }
            var totalEls = res.data.data.totalElements || 0;
            var pgsize = res.data.data.size || 10;
            _this.$nextTick(function() {
              if (_this.$refs.tableRef) {
                _this.$refs.tableRef.setTableData(vm);
                _this.totalElements = totalEls;
                _this.size = pgsize;
                
              } else {
                _this.$set(_this.tableData, 'uitemplateTableData', vm);
              }
            });
          }

        }).catch(function(e) {
          _this.$message({
            message: "加载数据出现异常！",
            type: "error"
          });
        });
    },
    search(ev) {
      console.log(ev);
    },
    // 查询区点击搜索后的处理
    handleSearch(searchData,condition,options) {
      var vm = this;
      if (!searchData) {
        return;
      }
      vm.searchData = searchData;
      vm.currentPage = 1;
      vm.request();
    },
    //查询模板加载后的数据初始化
    handleSearchReady(searchData) {
        var vm = this;
        vm.getSearchCondtion()
        if (!searchData) {
            return;
        }
        //设置默认条件： 代办类型，待处理
        searchData.conditionList.forEach(function(cond){
            if (cond.fieldcode === "approvestatus") {
                 cond.optionList.options.forEach(function(item) {
                    if(item.value === "0"){
                      item.selected = true;
                    };
                 });
            };
        });
        // searchData.conditionList[2].optionList.options[0].selected=true;
        vm.searchData = searchData;
        vm.currentPage = 1;
        // this.request();
    },
    getSearchCondtion(){
      var vm = this;
      vm.$http({
        method: "get",
        url: "/riart/task/getsearchcodtion"
      }).then(function(response) {
          if (response.data.status === true) {
            if(response.data.addresultMap){
              vm.$refs.approveSearchRef.setOptionsByFieldcode(response.data.addresultMap);
            } 
          } else {
            vm.$message.error(response.data.msg);
          }
        }).catch(function(error) {
            // vm.$message.error("获取查询条件失败！");
        });
    },
    // 审批处理
    approveClick() {
      var self = this;
      if(self.designateList.length > 0){
        self.$refs["assignFormRef"].validate(function(valid){
              if (valid) {
                var selectuser = [];  
                var activityDefId  = "";                 
                self.designateList.forEach(function(item, index) {
                  activityDefId = item.activityDefId;
                });
                var param_assign_value = {};
                param_assign_value[activityDefId] = self.assignFormData.designate;
                if ( self.opinion === "") {
                  self.opinion = "指派";
                  } 
                var obj = {}; 
                obj.param_assign_info = param_assign_value;
                obj.param_note = self.opinion;
                var em = {};
                em.nolockandconsist = "Y";
                var param = JSON.stringify(obj);
                var requestData = {
                  action : 'agree',
                  billType:self.approveRow.reason3,
                  billId:self.approveRow.billid,
                  pk_checkflow:self.approveRow.pk_checkflow,
                  param:param
                };
                self.doAction(requestData);
              }
        });
      }else{
        if (self.opinion === "") {
          self.opinion = "同意";
        }
        var obj = {};
        obj.param_note = self.opinion;
        var em = {};
        em.nolockandconsist = "Y";
        obj.eParam = em;
        var param = JSON.stringify(obj);
        var requestData = {
          action : 'agree',
          billType:self.approveRow.reason3,
          billId:self.approveRow.billid,
          pk_checkflow:self.approveRow.pk_checkflow,
          param:param
        };
        self.doAction(requestData);
      } 
    },
    doAction: function (requestData) {
      var self = this;
      self.$http({
        url: "/riart/task/dowfaction",
        method: "post",
        data: requestData,
        timeout:60000,
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json"
      })
        .then(function(res) {
          if (res.data.success === true) {
            self.$message({
              message: "审批成功",
              type: "success"
            });
            self.approveDialogVisible = false;
            self.request();
          } else {
            self.approveDialogVisible = false;
            self.$message({
              message: res.data.error.errorMessage,
              type: "error"
            });
          }
        }).catch(function(e) {
          self.approveDialogVisible = false;
          self.$message({
            message: "审批失败",
            type: "error"
          });
        });
    },
    // 驳回处理
    rejectClick() {
       var self = this;
      if (self.rejectTo === "") {
        self.$message({
          type: "error",
          message: "请选择有效的节点"
        });
        return;
      }
      if ( self.opinion === "") {
        self.opinion = '驳回';
      }
      var obj = {};
      //obj.param_reject_activity = this.rejectRow.activity_id;
      obj.param_reject_activity = self.rejectTo;
      obj.param_note = self.opinion;
      var em = {};
			em.isRepeat = self.isRepeat;
			obj.eParam = em;
      var param = JSON.stringify(obj);
      var data = {
        action : 'reject',
        billType:self.rejectRow.reason3,
        billId:self.rejectRow.billid,
        pk_checkflow:self.rejectRow.pk_checkflow,
        param:param
      };
      self.$http({
        url: "/riart/task/dowfaction",
        method: "post",
        data: data,
        headers: {
          "Content-Type": "application/json"
        },
        dataType: "application/json"
      })
        .then(function(res) {
          if (res.data.success === true) {
            self.$message({
              message: "驳回成功",
              type: "success"
            });
            self.rejectDialogVisible = false;
            self.request();
          } else {
            self.rejectDialogVisible = false;
            self.$message({
              message: res.data.error.errorMessage,
              type: "error"
            });
          }
        })
        .catch(function(e) {
          self.rejectDialogVisible = false;
          self.$message({
            message: "驳回失败",
            type: "error"
          });
        });
    },

    // 批量批准
    batchapprove() {
      var self = this;
      self.opinion = "";
      var tableSelections = self.$refs.tableRef.getTableComp().getSelection();
      if(tableSelections.length > 0){
          self.multiApproveClickDialogVisible = true;
      }else{
          self.$message({
            message: "请选择需要审批的数据！",
            type: "error"
          }); 
      }
      
    },
    // 批量驳回
    batchreject() {
      var self = this;
      self.opinion = "";
      var tableSelections = self.$refs.tableRef.getTableComp().getSelection();
      if(tableSelections.length > 0){
          self.multiRejectClickDialogVisible = true;
      }else{
          self.$message({
            message: "请选择需要驳回的数据！",
            type: "error"
          }); 
      }
    },

    // 批量审批处理
    multiApproveClick() {
      var self = this;
      var tableSelections = self.$refs.tableRef.getTableComp().getSelection();
      var times = 60000;
      if(tableSelections && tableSelections.length > 0){
          times = times * tableSelections.length;
      }
      var billtypes = [];
      var billids = [];
      var pk_checkflows = [];
      var activity_ids = [];
      for(var i = 0 ; i < tableSelections.length ; i ++ ){
        billtypes.push(tableSelections[i].reason3);
        billids.push(tableSelections[i].billid);
        pk_checkflows.push(tableSelections[i].pk_checkflow);
        activity_ids.push(tableSelections[i].activity_id);
      }
      var data = {
        action : 'agree',
        billtypes:billtypes,
        billids:billids,
        pk_checkflows:pk_checkflows,
        activity_ids:activity_ids,
        param_note:self.opinion
      };
      self.multiApproveClickDialogVisible = false;
      
      self.$http({
        url: "/riart/task/doBatchAction",
        method: "post",
        data: data,
        headers: {
          "Content-Type": "application/json"
        },
        timeout:times,
        dataType: "application/json"
      })
        .then(function(res) {
          if (res.data.success === true) {
            self.$message({
              message: res.data.data,
              type: "success"
            });

            self.request();
          } else {
            self.$message({
              message: res.data.error.errorMessage,
              type: "error"
            });
          }
        })
        .catch(function(e) {
          self.$message({
            message: "批量审批出现异常！",
            type: "error"
          });
        });
    },

    // 批量驳回处理
    multiRejectClick() {
      var self = this;
      var tableSelections = self.$refs.tableRef.getTableComp().getSelection();
      var times = 60000;
      if(tableSelections && tableSelections.length > 0){
        times = times * tableSelections.length;
      }
      var billtypes = [];
      var billids = [];
      var pk_checkflows = [];
      var activity_ids = [];
      for(var i = 0 ; i < tableSelections.length ; i ++ ){
        billtypes.push(tableSelections[i].reason3);
        billids.push(tableSelections[i].billid);
        pk_checkflows.push(tableSelections[i].pk_checkflow);
        activity_ids.push(tableSelections[i].activity_id);
      }
      var data = {
        action : 'reject',
        billtypes:billtypes,
        billids:billids,
        pk_checkflows:pk_checkflows,
        activity_ids:activity_ids,
        param_note:self.opinion
      };
      self.multiRejectClickDialogVisible = false;
      self.$http({
        url: "/riart/task/doBatchAction",
        method: "post",
        data: data,
        headers: {
          "Content-Type": "application/json"
        },
        timeout:times,
        dataType: "application/json"
      })
        .then(function(res) {
          if (res.data.success === true) {
            self.$message({
              message: res.data.data,
              type: "success"
            });

            self.request();
          } else {
            self.$message({
              message: res.data.error.errorMessage,
              type: "error"
            });
          }
        })
        .catch(function(e) {
          self.$message({
            message: "批量驳回出现异常！",
            type: "error"
          });
        });
    },
// table选中改变
    tableSelectionChange(selection) {

    },
    // 翻页标签改变每页显示数据
    handleSizeChange(val) {
      this.request(1, val);
    },

    // 翻页标签改变当前页
    handleCurrentChange(val) {
      this.request(val, this.size);
    }
  }
};
</script>
<style>
  #messageCenter {
    width:100%;
    /*width: 98%;*/
    /*height: 100%;*/
    margin: 0 auto;
    position: relative;
    /*padding: 15px 24px;*/
    box-sizing:border-box;
  }

  #messageCenter .messageheader {
    font-size: 18px;
    padding-bottom: 16px;
    /*line-height: 18px;*/
    /*padding-top: 20px;*/
    /*padding-left: 16px;*/
    /*font-family: "Microsoft YaHei", Helvetica, Arial, sans-serif;*/
  }
  #messageCenter .messageheader .sp0 {
    line-height: 18px;
    display: inline-block;
  }
  #messageCenter .handle {
    background: #fff;
    height: 70px;
    line-height: 70px;
    /*padding-left: 20px;*/
  }

  #messageCenter .handle .back,
  #messageCenter .handle .search {
    float: right;
    margin-right: 25px;
  }

  #messageCenter .handle-body {
    margin-top: 10px;
    background: #fff;
    /*padding: 15px 5px;*/
  }

  #messageCenter .handle-body {
    font-size: 14px;
    color: #666666;
  }

  #messageCenter .handle-body ul {
    display: inline-block;
  }

  #messageCenter .handle-body ul li {
    display: inline-block;
    margin: 20px 0 10px 20px;
  }

  #messageCenter .handle-body .setLabel {
    width: 80px;
    display: inline-block;
    text-align: right;
    margin: 20px 0 0 0;
  }

  #messageCenter .handle-body ul li:hover {
    cursor: pointer;
  }
  .el-dialog__body .rejectto {
    margin-top: 16px;
  }
  .el-dialog__body .isRepeat {
    margin-top: 16px;
  }
  .active1 {
    background: #1baede;
    color: #fff;
    padding: 2px 6px;
  }

  #messageCenter .tableList {
    margin-top: 20px;
  }

  #messageCenter .block1 .el-pagination {
    float: right;
  }

  #messageCenter .block1 {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  #messageCenter .el-table tr {
    height: 58px !important;
    padding-top: 10px;
  }

  #messageCenter .el-table {
    border: none !important;
  }

  #messageCenter .el-table::after,
  #messageCenter .el-table::before {
    background-color: transparent!important;
  }

  #messageCenter .tableList .mdate {
    font-size: 12px;
    color: #9e9e9e;
    /*padding-top: 15px;*/
  }

  #messageCenter .tableList .content .cell {
    width: 800px;
    font-size: 14px !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    color: #262626 !important;
  }

  #messageCenter .background_grey {
    color: #9e9e9e!important;
  }

  #messageCenter .el-table__empty-block {
    background-color: #eeeff1;
  }
  .agree_assign .el-form-item__content {
      width: 100%;
  }
  .reject_ .el-form-item__content {
      width: 100%;
  }
  .batch_agree .el-form-item__content {
      width: 100%;
  }
  .batch_reject .el-form-item__content {
      width: 100%;
  }
</style>
