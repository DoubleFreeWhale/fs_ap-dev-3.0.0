<template>
  <div class="list-panel">
  <el-button  type="primary" @click="initiateProcess" class="fl" style="height: 36px;" v-if="isSponsor">提交</el-button>
  <div class="fl"  v-if="params.processKey">
    <div style="position: relative;">
      <div id="search-container" style="width: 1000px;">
        <div>
          <ul class="btnLists" v-if="this.params.stateFlage!='his'&&!isEnd&&isAgree">
            <el-button type="primary" @click="checkFlow" style="margin-left: 10px;">查看流程图</el-button>
            <el-button type="primary" @click="revocation" style="margin-left: 10px;">撤回</el-button>
            <li v-for="item in btnLists">
              <el-button type="primary" @click="clickButton(item.key)">{{item.value}}</el-button>
            </li>
          </ul>
          <ul v-else style="height: 85px">
            <el-button type="primary" @click="checkFlow" style="margin-left: 10px;">查看流程图</el-button>
            <el-button type="primary" @click="revocation" style="margin-left: 10px;">撤回</el-button>
          </ul>
        </div>
        <div  class="step" style="position: relative;">
          <div style="position: relative;">
            <el-steps :space="200" :active="3">
              <el-step v-if='listData.length>0'>
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="dark" :content=listData[0].userName placement="top">
                        <span>[{{listData[0].activeName}}]{{listData[0].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[0].startTime}}</p>
                      <!-- <p class="titleData">{{listData[0].activeName}}</p> -->
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip class="item" effect="dark" :content=listData[0].deleteReason placement="top">
                      <p class="titleAction" @click="showList">{{listData[0].deleteReason}}</p>
                    </el-tooltip>
                    <div class="titleNumber el-icon-more" style="cursor: pointer;" @click="showList"></div>
                  </div>
              </el-step>

              <!-- 没审批结束的第二步骤 -->
              <el-step v-if='isNext&&listData.length>0&&!isEnd'>
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="dark" :content=listData[listData.length-1].userName placement="top">
                        <span>[{{listData[listData.length-1].activeName}}]{{listData[listData.length-1].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-1].startTime}}</p>
                      <!-- <p class="titleData">{{listData[listData.length-1].activeName}}</p> -->
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip class="item" effect="dark" placement="top">
                      <p class="titleAction">{{listData[listData.length-1].deleteReason}} {{listData[listData.length-1].message}}</p>
                    </el-tooltip>
                    <div class="titleNumber el-icon-edit"></div>
                  </div>
              </el-step>


               <!-- 审批结束的第二步骤 -->
              <el-step v-if='isNext&&listData.length>0&&isEnd'>
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="dark" :content=listData[listData.length-2].userName placement="top">
                        <span>[{{listData[listData.length-2].activeName}}]{{listData[listData.length-2].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-2].startTime}}</p>
                      <!-- <p class="titleData">{{listData[listData.length-2].activeName}}</p> -->
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip class="item" effect="dark" placement="top">
                      <p class="titleAction">{{listData[listData.length-2].deleteReason}} {{listData[listData.length-2].message}}</p>
                    </el-tooltip>
                    <div class="titleNumber el-icon-edit"></div>
                  </div>
              </el-step>

               <!-- 没审批结束最后一步 -->
                <el-step v-if='!isEnd'>
                  <div slot="description">
                    <el-tooltip class="item" effect="dark" :content=waitApproves.join() placement="top">
                      <p class="waitAction">待<span style="color: #5CB0E6">{{waitApproves.join()}}</span>处理</p>
                    </el-tooltip>
                    <div class="titleNumber el-icon-edit"></div>
                  </div>
              </el-step>

               <!-- 审批结束最后一步 -->
                <el-step v-if='isEnd&&listData.length>0'>
                  <div slot="title">
                    <div class="titleText">
                      <el-tooltip class="item" effect="dark" :content=listData[listData.length-1].userName placement="top">
                        <span>[{{listData[listData.length-1].activeName}}]{{listData[listData.length-1].userName}}</span>
                      </el-tooltip>
                      <p class="titleData">{{listData[listData.length-1].startTime}}</p>
                      <!-- <p class="titleData">{{listData[listData.length-1].activeName}}</p> -->
                    </div>
                  </div>
                  <div slot="description">
                    <el-tooltip class="item" effect="dark" placement="top">
                      <p class="titleAction">{{listData[listData.length-1].deleteReason}} {{listData[listData.length-1].message}}</p>
                    </el-tooltip>
                    <div class="titleNumber el-icon-check"></div>
                  </div>
              </el-step>




            </el-steps>
          </div>
        </div>
      </div>
      <div class="statusLists" v-show="isHiddenList" style="background: #fff">
        <ul>
          <li v-for="(item,index) in listData">
            <div><em>{{index+1}}</em><strong>[{{item.activeName}}]</strong><span>{{item.userName}}</span><div style="margin-left: 30px;">{{item.startTime}}</div></div>
            <p><em style="opacity: 0"></em><span>{{item.deleteReason}} {{item.message}}</span><strong></strong></p>
            <!-- <p style="margin-left: 30px;">环节:{{item.activeName}}</p> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div>
    <el-dialog :title="defaultMap[this.action]" v-model="dialogFormVisible" size="tiny">
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
      <template v-if="action === 'rejectAble'">
        <el-form>
          <el-form-item label="审批意见:" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="opinion" :rows="2" placeholder="请输入审批意见"></el-input>
          </el-form-item>
          <el-form-item label="驳回到:" :label-width="formLabelWidth">
            <el-select v-model='rejectTo' placeholder="请选择节点">
              <el-option
              v-for="node in nodeList"
              :key="node.value"
              :label="node.key"
              :value="node.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        </template>
      <template v-else-if="action === 'assignAble'">
          <el-form>
            <el-form-item label="审批意见:" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="opinion" :rows="2" placeholder="请输入审批意见"></el-input>
            </el-form-item>
            <el-form-item label="人员:" :label-width="formLabelWidth">
              <el-select v-model='rejectTo' placeholder="请选择人员">
                <el-option
                v-for="node in nodeList"
                :key="node.value"
                :label="node.key"
                :value="node.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      <template v-else-if="action === 'refuseAble'">
          <el-form>
            <el-form-item label="审批意见:" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="opinion" :rows="2" placeholder="请输入审批意见"></el-input>
            </el-form-item>
          </el-form>
        </template>


       <template v-else-if="action === 'aggreeAble'">
          <el-form>
            <el-form-item label="环节与指派:" :label-width="formLabelWidth" v-show="designateList.length">
              <div v-for="(item,index) in designateList">
                    <p>{{item.activityName}}</p>
                    <el-select v-model="item.participants_01" multiple @change="test" placeholder="请选择">
                          <el-option
                            v-for="item_01 in item.participants"
                            :label="item_01.name"
                            :value="item_01.id">
                          </el-option>
                    </el-select>
              </div>
            </el-form-item>
            <el-form-item label="审批意见:" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="opinion" :rows="2" placeholder="请输入审批意见"></el-input>
            </el-form-item>
          </el-form>
      </template>








      <template v-else-if="action === 'addsignAble'||action === 'delegateAble'" class="addsign">
          <el-form>
            <el-form-item label="人员:" :label-width="formLabelWidth">
              <el-select v-model='userId' placeholder="请选择人员">
                <el-option
                v-for="person in personList"
                :key="person.value"
                :label="person.key"
                :value="person.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
    </el-dialog>
    <el-dialog
    v-model="dialogVisible">
    <iframe :src="flowUrl" frameborder="0" style="width: 650px;height: 300px;"></iframe>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>

  <el-dialog
    title="提示"
    v-model="isHidRevocation"
    size="tiny"
    >
    <span>确定撤回？</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isHidRevocation = false">取 消</el-button>
      <el-button type="primary" @click="sureRevocation">确 定</el-button>
    </span>
</el-dialog>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      isHidRevocation:false,
      designateList:[],
      remoteUserId:'',
      dialogVisible:false,
      flowUrl:'',
      isAgree:true,
      author:'',
      isNext:false,
      isEnd:false,
      waitApproves:[],
      titleNumber:'...',
      isSponsor:false,
      params:{},
      params_01:{},
      pk:'',
      isifr:false,
      action: "",
      linkIframe:'',
      opinion: '同意',
      rejectTo: '',
      userId: '',
      nodeList: [],
      personList: [],
      isHiddenList: false,
      approveUrl:'',
      listData: [
      ],
      btnLists: [{
          value: "同意",
          key: "agree"
        },
        {
          value: "驳回",
          key: "reject"
        },
        {
          value: "委派",
          key: "weipai"
        },
        {
          value: "不同意",
          key: "disagree"
        }
      ],
      dialogTableVisible: false,
      dialogFormVisible: false,
      defaultMap: {
        assignAble: '指派',
        rejectAble: '驳回',
        delegateAble: '改派',
        addsignAble: '加签',
        aggreeAble: '同意',
        refuseAble: '拒绝'
      },
      formLabelWidth: '120px'
    };
  },
  methods: {
    sureRevocation(){
        var vm = this;
        var params={
          taskId:this.params.task_id
         };
          this.$http({
            url: '/ifbp-bpm-service/proc/withdraw',
            method: 'get',
            params: params
          }).then((res) => {
            console.log("撤回");
            console.log(res);
            if(res.data.success){
              this.$message({
                message: '撤回成功！',
                type: 'success'
              });
              vm.isAgree=true;
            }else{
              vm.$message({
                message: res.data.errorMessage,
                type: 'error'
              });
            }
            this.isHidRevocation=false;
          }).catch(() => {
            this.$message.error('失败');
          });
    },
    revocation(){
      this.isHidRevocation=true;
    },
    test(item) {
      console.log(JSON.stringify(item));
    },
    checkFlow(){
      this.dialogVisible=true;
      this.flowUrl='http://dev-ap.iservice.imfbp.com/ifbp-bpm-service/static/vendor/diagram-viewer/index.html?processDefinitionId='+this.params.processDefinitionId+'&processInstanceId='+this.params.processInstanceId;
      // alert(this.flowUrl);
      console.log(this.flowUrl);
    },
    requestPerson() {
      this.$http({
        url: '/ifbp-bpm-service/identity/users'
      }).then((res) => {
        var newList = res.data.data;
        // 将取到的值处理一下
        var curList = [];
        newList.forEach((item) => {
          // console.log(item)
          var obj = {
            key: item.name,
            value: item.userid
          };
          curList.push(obj);
        });
        this.personList = curList;
      });
    },
    requestAction() {
      this.$http({
        url: '/ifbp-bpm-service/task/operation?processDefinitionId=' + this.params.processDefinitionId + '&activityId=' + this.params.activityId,
        method: 'post'
      }).then((res) => {
        var curArr = res.data.data;
        var btnOrder = {
          aggreeAble: 1,
          rejectAble: 2,
          refuseAble: 3,
          assignAble: 4,
          delegateAble: 5,
          addsignAble: 6
        };
        var curList = [];
        curArr.forEach((action) => {
          curList.push({
            key: action.op,
            value: action.text ? action.text : this.defaultMap[action.op]
          });
        });
        curList.sort((a, b) => btnOrder[a.key] > btnOrder[b.key]);
        console.log('传完的值');
        console.log(curList);
        //alert(JSON.stringify(curList));
        this.btnLists = curList;
      });
    },
    getAssignment(){
      var vm = this;
      var params={
          taskId:this.params.task_id
         };
        this.$http({
          url: '/ifbp-bpm-service/task/assign-checking',
          method: 'get',
          params: params
        }).then((res) => {
          console.log("00000");
          console.log(res.data.status);
          if(res.data.status){
            vm.designateList=res.data.data.assignInfoItems;
            vm.designateList.forEach(function(item,index){
              vm.$set(item, 'participants_01', []);
              // item.participants_01=[];
              item.participants_02=[];
            })
            console.log(vm.designateList);
          }else{
            console.log(res.data.msg);
          }
        }).catch(() => {
          this.$message.error('去掉代理失败');
        });
    },
    requestHistory() {
      var vm =this;
      this.$http({
        url: '/ifbp-bpm-service/proc/approval-detail',
        params: {
          processInstanceId: this.params.processInstanceId,
          taskId: this.params.task_id
        }
      }).then((res) => {
        if (res.data.status === 1) {
          vm.listData=[];
          vm.waitApproves=[];
          var hisData=res.data.data.historicTasks;
          console.log("hisData");
          console.log(hisData);
          var Time=res.data.data.startTime;
          vm.$http({
              url: '/ifbp-bpm-service/identity/info/'+res.data.data.startUserId,
              method: 'get'
            }).then((res_01) => {
              var resList_01=res_01.data.data;
              var userName_01='';
              if(res_01.data.status===1){
                 userName_01=resList_01.name;
              }else{
                userName_01="查无此人";
              }
              vm.listData.push({
                deleteReason:'提交',
                userName:userName_01,
                activeName:res.data.data.name,
                startTime:new Date(Time).toLocaleString()
              })
              hisData.forEach(function(item,index){ 
                vm.$http({
                  url: '/ifbp-bpm-service/identity/info/'+item.assignee,
                  method: 'get'
                }).then((res_02) => {
                    var deleteReason='';
                    if(item.deleteReason=='completed'){
                        deleteReason='同意';
                    }else if(item.deleteReason=='jumpToActivity'){
                      deleteReason='驳回';
                    }else if(item.deleteReason=='ACTIVITI_DELETED'){
                      deleteReason='驳回并中止';
                    }else if(item.deleteReason=='withdraw'){
                      deleteReason='审批后撤回';
                    }else if(item.deleteReason=='jump'){
                      deleteReason='调整';
                    }else if(item.deleteReason=='stop'){
                      deleteReason='终止';
                    }else if(item.deleteReason=='refuse'){
                      deleteReason='拒绝';
                    }else if(item.deleteReason&&item.deleteReason.indexOf("reject")>=0){
                      deleteReason='驳回';
                    }else if(item.deleteReason=='deleted'||item.deleteReason=='Delete'||item.deleteReason=='delete'){
                      deleteReason='删除';
                    }else if(item.deleteReason==null){
                      deleteReason='待审批';
                    }else{
                      deleteReason='未知:'+item.deleteReason;
                    };
                    var userName_02='';
                    if(res_02.data.status===1){
                      userName_02=res_02.data.data.name;
                    }else{
                      userName_02="没查到此人";
                    }

                    var curTime;
                    if(item.endTime){
                      // curTime=new Date(item.endTime).toLocaleString();
                      curTime=item.endTime;
                    }else{
                      curTime='--';
                    } 
                    var message;

                    if(item.taskComments){
                      if(item.taskComments[0]){
                        message = item.taskComments[0].message;
                      }else{
                        message='--';
                      }
                    }else{
                      message='--';
                    }
                   


                    if(deleteReason!='删除'&&deleteReason!='待审批'){
                       vm.listData.push({
                        deleteReason:deleteReason,
                        userName:userName_02,
                        activeName:item.activity.name,
                        startTime:curTime,
                        message:message
                      })
                    }else if(deleteReason=='待审批'){
                      console.log('待审批');
                      console.log(userName_02);
                      var user='';
                      user="["+item.activity.name+"]"+userName_02;
                      vm.waitApproves.push(user);
                    }

                  if(vm.listData.length>2){
                    vm.isNext=true;
                  }
                  console.log("------1-------");
                  console.log(vm.listData);
                  console.log("------1-------");
                  vm.listData.sort(function(a,b){
                      // return Date.parse(a.startTime) - Date.parse(b.startTime);//时间正序
                      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();//时间正序
                  });
                  console.log("--------排序完--------");
                  console.log(vm.listData);
                  vm.listData.forEach(function(item,index){
                      console.log(item.startTime);
                      if(new Date(item.startTime).toLocaleString()!="Invalid Date"){
                        item.startTime=new Date(item.startTime).toLocaleString();
                      }
                  })
                }).catch(() => {
                  this.$message.error('请求333q3333333失败');
                });
              });
            }).catch(() => {
              this.$message.error('请求3333333333失败');
          });
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(() => {
        this.$message.error('审批历史请求失败');
      });
    },
    showList() {
      this.isHiddenList = !this.isHiddenList;
    },
    clickButton(action) {
      // console.log(action)
      var data = this.params;
      this.action = action;
      if (this.action === 'aggreeAble') {
        this.dialogFormVisible = true;
      } else if (this.action === 'refuseAble') {
        this.dialogFormVisible = true;
      } else if (this.action === 'rejectAble') {
        
        this.$http.get('/ifbp-bpm-service/task/reject-check', {
            params: {
              taskId: data.task_id
            }
          }).then((response) => {


            
            // 获取驳回下拉列表
            console.log('驳回列表');
            console.log(response);
            if (response.data.status === 0) {

              this.$message.error(response.data.msg);
              // this.nodeList = [{
              //   key: '制单人(拒绝)',
              //   value: 'REJECTTOINIT'
              // }];
              this.dialogFormVisible = true;
            } else {
              var newList = response.data.data;
              // 将取到的值处理一下
              var curList = [];
              // curList.push({
              //   key: '制单人(拒绝)',
              //   value: 'REJECTTOINIT'
              // });
              newList.forEach((item) => {
                // console.log(item)
                var obj = {
                  key: item.name,
                  value: item.activityId
                };
                curList.push(obj);
              });
              this.nodeList = curList;
              this.dialogFormVisible = true;
            }
          



          }).catch((error) => {
            console.log(error);
          });
      } else if (this.action === 'assignAble') {
        this.$http.get('/ifbp-bpm-service/task/assign-check', {
            params: {
              taskId: data.task_id
            }
          }).then((response) => {
            // 获取驳回下拉列表
            if (response.data.status === 0) {
              this.$message.error(response.data.msg);
            } else {
              var newList = response.data.data;
              // 将取到的值处理一下
              var curList = [];
              newList.forEach((item) => {
                // console.log(item)
                var obj = {
                  key: item.name,
                  value: item.localUserId,
                  remoteUserId: item.remoteUserId
                };
                curList.push(obj);
              });
              this.nodeList = curList;
              this.dialogFormVisible = true;
            }
          }).catch((error) => {
            console.log(error);
          });
      } else if (this.action === 'addsignAble') {
        this.dialogFormVisible = true;
      } else if (this.action === 'delegateAble') {
        this.dialogFormVisible = true;
      } else if (this.action === 'assignAble') {
        this.dialogFormVisible = true;
      }
    },

    waitApprove(){
      this.$http({
          url: '/ifbp-bpm-service/proc/'+this.params.processInstanceId+'/todoActivity',
          method: 'get'
        }).then((res) => {
          this.waitApproves=res.data.data.name;
          console.log(res.data.data.name);
        }).catch(() => {
          this.$message.error('请求失败');
        });
    },


    getOpinion(){
      this.$http.get('/ifbp-bpm-service/proc/approval-comments', {
          params: {
              processInstanceId: this.params.processInstanceId
            }
      }).then((res) => {
          alert(JSON.stringify(res));
      }).catch((error) => {
        console.log(error);
      })
    },

    approveState(){
      this.$http({
        url: '/ifbp-bpm-service/proc/'+this.params.processInstanceId+'/status',
        method: 'get'
      }).then((res) => {
        console.log(res.data.data.status);
        if(res.data.data.status==="run"){
          this.isEnd=false;
          // this.waitApprove();
        }else{
          this.isEnd=true;
        }  
      }).catch(() => {
        this.$message.error('请求失败');
      });
    },


    confirm() {
      var vm=this;
      this.data = this.curdata;
      var designateListStr='';
      if (this.action === 'aggreeAble') {
        this.designateList.forEach(function(item,index){
          for(var i=0;i<item.participants_01.length;i++){
            var itemId=item.participants_01[i];
            item.participants_02.push({
              id:itemId
            })
          }
        })
        if(!this.designateList.length>0){
          designateListStr='';
        }else{
          designateListStr=JSON.stringify(this.designateList);
        }


        this.$http({
            url: '/ifbp-bpm-service/approval/action',
            method: 'post',
            data: {
              taskId: this.params.task_id,
              action: 'agree',
              comment: this.opinion,
              processInstanceId: this.params.processInstanceId,
              processDefinitionId: this.params.processDefinitionId,
              processKey: this.params.processKey,
              businessKey: this.params.businessKey,
              assignInfo:designateListStr
            }
          }).then((response) => {
            this.dialogFormVisible = false;
            if (response && response.data && (response.data.status === 1)) {
              this.dialogFormVisible = false;
              this.$message({
                type: 'success',
                message: '已审批同意'
              });
              this.requestHistory();
              this.requestAction();
              // if(!this.designateList.length>0){
              //   alert("tongyi")
                vm.isAgree=false;
              // }
              this.requestPerson();
              this.approveState();
            } else if (response && response.data && (response.data.status === 0)) {
              this.$message({
                type: 'error',
                message: response.data.msg
              });
            }
          }).catch((error) => {
            this.dialogFormVisible = false;
            console.log(error);
          });
      } else if (this.action === 'refuseAble') {
        this.$http({
            url: '/ifbp-bpm-service/task/refuse',
            method: 'get',
            params: {
              taskId: this.params.task_id,
              auditComment: this.opinion,
              processInstanceId: this.params.processInstanceId,
              processDefinitionId: this.params.processDefinitionId,
              processKey: this.params.processKey,
              businessKey: this.params.businessKey
            }
          }).then((response) => {
            this.dialogFormVisible = false;
            if (response && response.data && (response.data.status === 1)) {
              this.dialogFormVisible = false;
              this.$message({
                type: 'success',
                message: '已拒绝流程'
              });
              this.requestHistory();
              this.requestAction();
              vm.isAgree=false;
              this.requestPerson();
              this.approveState();
            } else if (response && response.data && (response.data.status === 0)) {
              this.$message({
                type: 'error',
                message: response.data.msg
              });
            }
          }).catch((error) => {
            this.dialogFormVisible = false;
            this.$message({
              type: 'error',
              message: '请求失败'
            });
            console.log(error);
          });
      } else if (this.action === 'rejectAble') {
        // 驳回
        var params;
        if (this.rejectTo === 'REJECTTOINIT') {
          params = {
            rejectToInit: 'true',
            action: 'reject',
            rejectReason: this.opinion,
            processInstanceId: this.params.processInstanceId,
            processDefinitionId: this.params.processDefinitionId,
            processKey: this.params.processKey,
            businessKey: this.params.businessKey
          };
        } else {
          params = {
            taskId: this.params.task_id,
            action: 'reject',
            comment: this.opinion,
            processInstanceId: this.params.processInstanceId,
            processDefinitionId: this.params.processDefinitionId,
            activityId: this.rejectTo,
            processKey: this.params.processKey,
            businessKey: this.params.businessKey
          };
          if (this.rejectTo === '') {
            this.$message({
              type: 'error',
              message: '请选择有效的节点'
            });
            return;
          }
        }
        this.$http({
            url: '/ifbp-bpm-service/approval/action',
            method: 'post',
            data: params
          }).then((response) => {
            // 1代表成功 0代表失败
            this.dialogFormVisible = false;
            if (response && response.data && (response.data.status === 1)) {
              this.$message({
                type: 'success',
                message: '驳回成功'
              });
              this.requestHistory();
              this.requestAction();
              vm.isAgree=false;
              this.requestPerson();
              this.approveState();
            } else if (response && response.data && (response.data.status === 0)) {
              this.$message({
                type: 'error',
                message: response.data.msg
              });
            }
          }).catch((error) => {
            this.dialogFormVisible = false;
            console.log(error);
          });
      } else if (this.action === 'delegateAble') {
        this.$http({
            url: '/ifbp-bpm-service/task/delegate',
            method: 'post',
            data: {
              taskId: this.params.task_id,
              assign: this.userId,
              processDefinitionId: this.params.processDefinitionId,
              processKey: this.params.processKey,
              businessKey: this.params.businessKey
            }
          }).then((response) => {
            this.dialogFormVisible = false;
            if (response && response.data && (response.data.status === 1)) {
              this.$message({
                type: 'success',
                message: '改派成功'
              });
              this.requestHistory();
              this.requestAction();
              vm.isAgree=false;
              this.requestPerson();
              this.approveState();
            } else if (response && response.data && (response.data.status === 0)) {
              this.$message({
                type: 'error',
                message: response.data.msg
              });
            }
          }).catch((error) => {
            this.dialogFormVisible = false;
            console.log(error);
          });
      } else if (this.action === 'addsignAble') {
        var arrIds = [];
        arrIds.push(this.userId);
        this.$http({
            url: '/ifbp-bpm-service/task/signAdd',
            method: 'post',
            data: {
              taskId: this.params.task_id,
              assigns: arrIds,
              processDefinitionId: this.params.processDefinitionId,
              processKey: this.params.processKey,
              businessKey: this.params.businessKey
            }
          }).then((response) => {
            this.dialogFormVisible = false;
            if (response && response.data && (response.data.status === 1)) {
              this.$message({
                type: 'success',
                message: '加签成功'
              });
              this.requestHistory();
              this.requestAction();
              vm.isAgree=false;
              this.requestPerson();
              this.approveState();
            } else if (response && response.data && (response.data.status === 0)) {
              this.$message({
                type: 'error',
                message: response.data.msg
              });
            }
          }).catch((error) => {
            this.dialogFormVisible = false;
            console.log(error);
          });
      }else if (this.action === 'assignAble'){
          this.nodeList.forEach(function(item,index){
            if(item.value == vm.rejectTo){
              vm.remoteUserId=item.remoteUserId;
            }
          })
          this.$http({
            url: '/ifbp-bpm-service/approval/action',
            method: 'post',
            data: {
              taskId: this.params.task_id,
              action: 'agree',
              comment: this.opinion,
              processInstanceId: this.params.processInstanceId,
              activityId: this.rejectTo,
              remoteUserId: vm.remoteUserId
            }
          }).then((response) => {
            this.dialogFormVisible = false;
            if (response && response.data && (response.data.status === 1)) {
              this.dialogFormVisible = false;
              this.$message({
                type: 'success',
                message: '指派成功'
              });
              this.requestHistory();
              this.requestAction();
              vm.isAgree=false;
              this.requestPerson();
              this.approveState();
            } else if (response && response.data && (response.data.status === 0)) {
              this.$message({
                type: 'error',
                message: response.data.msg
              });
            }
          }).catch((error) => {
            this.dialogFormVisible = false;
            console.log(error);
          });
      }
      this.rejectTo = '';
      this.opinion = '同意';
      this.userId = '';
    },
    cancel() {
      this.dialogFormVisible = false;
      this.rejectTo = '';
      this.opinion = '同意';
      this.userId = '';
    },

  isEnable(){
       var sceneCode=this.params_01.sceneCode;
      if(sceneCode!=='undefined'&&sceneCode){
          this.$http.get('/ifbp-bpm-service/bmp_proc/check', {
          params: {
              buzicode: "KHGL",
              sceneCode: sceneCode
            }
          }).then((res) => {
              this.isSponsor=res.data.data.enabled;
              // alert(res.data.data.enabled);
              console.log(res);
          }).catch((error) => {
            console.log(error);
          })
      }
  },

   getParams() {
      var data = {};
      var tmp;
      var paramPK = location.href.split('?')[0].split('/');
      this.pk=paramPK[paramPK.length-1];
      var paramStr = location.href.split('?')[1];
      if (paramStr) {
        var paramsArr = paramStr.split('&');
        paramsArr.forEach((v) => {
          tmp = v.split('=');
          data[tmp[0]] = decodeURIComponent(tmp[1]);
        });
      }
      if(data.sceneCode){
        this.params_01 = data;
      }else{
        this.params=data;
      }
      // alert(data.sceneCode);
    },
// 处理传入组件的值
    doParams(){
      var data = {};
      var tmp;
      var paramStr = this.childMsg.split('?')[1];
      if (paramStr) {
        var paramsArr = paramStr.split('&');
        paramsArr.forEach((v) => {
          tmp = v.split('=');
          data[tmp[0]] = decodeURIComponent(tmp[1]);
        });
      }
      this.params = data;
    },

    getUser(){
        this.$http({
          url: '/ifbp-bpm-service/identity/info/07016fea-dfc7-11e7-b686-005056944e95',
          method: 'get'
        }).then((res) => {
          alert(JSON.stringify(res));
        }).catch(() => {
          this.$message.error('请求失败');
        });
    },

    initiateProcess(){
       var params = {
        "buzicode":"KHGL",
        "sceneCode":this.params_01.sceneCode,
        "processInstanceName":"个人客户流程",
        "businessKey":this.pk,
        "mdPK":this.pk
      }
      // alert(JSON.stringify(params))
      this.$http({
        url: '/ifbp-bpm-service/proc/start',
        method: 'post',
        data: params
      }).then((res) => {
        // alert(JSON.stringify(res))
        if(res.data.status === 1){
            this.$message({
            type: 'success',
            message: '发起流程成功'
          });
        }else{
          this.$message.error(res.data.msg);
        }
      }).catch(() => {
        this.$message.error('发起失败');
      });
    }
  },
  // props: ['childMsg'],
  created() {
    // alert(this.childMsg);
    this.getParams();
    // this.getOpinion();
    // this.doParams();
    this.isEnable();
    if(this.params.processKey){
      this.requestHistory();
      this.requestAction();
      this.requestPerson();
      this.getAssignment();
      // this.waitApprove();
      this.approveState();
      // this.getUser();
    }
  },
  mounted() {
    




  },
};
</script>
<style scoped>
.waitAction{
  position: absolute;
  left: 40px;
  top: 9px;
  font-size: 14px;
  color: #333333;
}
.titleNumber{
  position: absolute;
  left: 0px;
  top: 0px;
  color: #fff;
  line-height: 32px;
  text-align: center;
  width: 32px;
  height: 32px;
  background: #20a0ff;
  border-radius: 50%;
}
.titleText{
  position: absolute;
  left: 43px;
  top: -48px;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  width: 180px;
}
.titleText span{
  display: inline-block;
  /*width: 166px;*/
  height: 18px;
  overflow: hidden;
}
.titleData{
  font-size: 12px;
  color: #888888;
}
.titleAction{
  font-size: 14px;
  color: #475669;
  position: absolute;
  left: 45px;
  top: 25px;
  width: 166px;
  height: 14px;
  overflow: hidden;
}
#search-container {
  height: 100px;
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: none!important;
}

.first_step .statuss {
  overflow: hidden;
}

.first_step .statuss span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #25c8ff;
  vertical-align: middle;
  text-align: center;
  line-height: 20px;
  color: #ddd;
}

.first_step .statuss em {
  display: inline-block;
  height: 3px;
  width: 200px;
  background: #25c8ff;
}

.first_step .statuss i {
  position: absolute;
  right: -10px;
  top: 30px;
  font-style: normal;
}

.first_step strong {
  text-align: center;
  width: 200px;
  position: absolute;
  left: 50%;
  top: -30px;
  margin-left: -100px;
  font-weight: normal;
}

.first_step .submissionTime {
  text-align: center;
  /*position: absolute;
  left: 50%;
  top: -7px;
  margin-left: -71px;*/
}

.first_step p {
  width: 100px;
  position: absolute;
  left: 50%;
  margin-left: -50px;
  top: 20px;
  text-align: center;
}

.first_step p em {
  font-style: normal;
}

.btnLists {
  display: inline-block;
  overflow: hidden;
  height: 85px;
}

.btnLists li {
  float: left;
  margin-left: 5px;
}

.btnLists li button {
  /*width: 60px;*/
}

.statusLists {
  position: absolute;
  left: 15px;
  top: 140px;
  z-index: 800;
  border: 1px solid #eee;
}

.statusLists ul {
  /*margin-top: 5px;*/
  height: 300px;
  overflow-x: hidden;
}

.statusLists li {
  background: #fff;
  width: 250px;
}

.statusLists li em {
  font-style: normal;
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #25c8ff;
  vertical-align: middle;
  text-align: center;
  line-height: 20px;
  color: #ddd;
  font-size: 13px;
}

.statusLists li span {
  margin-left: 10px;
}

.statusLists li strong {
  font-weight: normal;
  margin-left: 10px;
  font-size: 13px;
}

.statusLists li {
  padding: 10px;
  padding-left: 20px;
}

.statusLists li div {
  /*padding-top: 10px;*/
}

.statusLists li p {
  padding-top: 10px;
}

.clickList {
  cursor: pointer;
}
</style>
  
