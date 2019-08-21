<template>
  <ifbp-page>
    <!--节点title-->
    <ifbp-breadcrumb name="发送消息"></ifbp-breadcrumb>
    <!-- <ifbp-button-area>
      <el-button type="primary" @click="formConfirm">发送</el-button>
    </ifbp-button-area> -->
    <!-- 主体区域 -->
    <ifbp-main-area type="list">
      <!-- 主表编辑页签 -->
      <ifbp-panel id="basePanel" title="消息信息">
        <ifbp-template ref="formRef"
                       :pk-temp="pkTemp"
                       show-type="form"
                       :tpl-data="formData"
                       :methods="formMethods"
                       :tpl-reset-fun="formResetFun"
                       @after-create="templateFormAfterCreate"
        >
        </ifbp-template>
        <!-- 富文本编辑器 -->
        <el-form :inline="true" label-width="150px" :adaptation="true">
          <el-form-item _id="ueditor-div" label="内容" width="100%" :required="true">
            <ifbp-ueditor ref="ifbpUeditorRef" :ueditorData="ueditorData"></ifbp-ueditor>
          </el-form-item>
        </el-form>
      </ifbp-panel>
      <ifbp-panel id="attachmentPanel" title="附件管理">
        <ifbp-upload :disable-upload="customerDisableUpload"
          busi-code="sm_msg_content"
          force-type = "normal"
          :pk-busi="pk_message">
        </ifbp-upload>
      </ifbp-panel>
      <ifbp-footer>
        <el-button type="primary" @click="formConfirm" :disabled="sendButtonDisabled">发送</el-button>
      </ifbp-footer>
    </ifbp-main-area>
  </ifbp-page>
</template>
<script>
  import ifbpUeditor from './ifbp-ueditor.vue';
  export default {
    components: { ifbpUeditor },
    data() {
      var vm = this;
      var id = this.$root.$router.currentRoute.params.id;
      var type = this.$root.$router.currentRoute.params.type;
      return {
        getByIdUrl: '/baseapp/messagecenter/get',
        sendUrl: '/baseapp/messagecenter/send',
        pkmessageUrl: '/baseapp/messagecenter/fetchpk4message',
        dataTest:[],
        customerDisableUpload: false,
        sendButtonDisabled: false,
        pkTemp: '0001AA100000002L46B6',
        // 通过传入的参数判断是新增还是修改操作
        id: id,
        pk_message: '',
        type: type,
        dynamicpkClass: '',
        // 基础panel显示图标
        messageIcons: [
          {
            icon: "edit",
            click: function() {
              vm.formEdit = !vm.formEdit;
            }
          }
        ],
        // UI模板所需参数
        typicalDemoFunnode: "CJGL",
        typicalDemoNexuskey: "typical",
        formData: {
          message: {
              isonline: false,
          },
          refParams: {
              isonline: ''
          }
        },
        // 基本信息默认是否可修改
        formEdit: true,
        formMethods:{
          changeHandle: function(event){
            var checked = event.target.checked;
            vm.$refs.formRef.setData('refParams', {isonline: checked});
          }
        },
        formResetFun:function($node){
          let $isonline = $node.find('[v-model="message.isonline"]');
          $isonline.attr('v-on:change', 'changeHandle');
          return $node[0].outerHTML;
        },
        //富文本编辑器
        ueditorData:''
      };
    },
    created(){
      this.requestpkmessage();
    },
    mounted() {
      this.request();
      // 修改页面默认不可编辑
    },
    methods: {
      dynamicChangeFun(item,field,val){
      },
      templateFormAfterCreate(UIComp) {
        this.dynamicpkClass = UIComp.getPkClass();
      },
      // 请求客户基本信息详情
      request() {
        if (!this.id) return;
        var data = {
          pk_message: this.id
        };
        this.$http({
          url: this.getByIdUrl,
          method: "post",
          data: data,
          headers: {
            "Content-Type": "application/json"
          },
          dataType: "application/json"
        })
          .then(res => {
            if (res.data.success === true) {
              var formData = this.$refs.formRef.getFormData();
              if(!formData){
                  formData = {};
              }
              var resData = res.data.data;
              formData.beanMap = resData.beanMap;
              if(this.type && this.type === 'reply') {
                //回复：发件人变收件人，标题加Re:,收件人的beanMap也一起变一下
                formData.subject = 'Re:' + resData.subject;
                formData.receiver = resData.sender;
                formData.beanMap.receiver_ref[formData.receiver] = resData.beanMap.sender_ref[resData.sender];
              } else if(this.type ==='forward'){
                //转发：标题加Fw:,content也带上
                formData.subject = 'Fw' + resData.subject;
                formData.content = resData.content;
              }
              this.$refs.formRef.setFormData(formData);
              this.baseData = JSON.parse(JSON.stringify(formData));
            } else {
              this.$message({
                message: res.data.error.errorMessage,
                type: "error"
              });
            }
          })
          .catch((e) => {
            this.$message({
              message: "基本信息详情获取失败",
              type: "error"
            });
          });
      },
      requestpkmessage() {
        this.$http({
          url: this.pkmessageUrl,
          method: "get",
          headers: {
            "Content-Type": "application/json"
          },
          dataType: "application/json"
        })
          .then(res => {
            if (res.data.success === true) {
              this.pk_message = res.data.data;
              console.log(this.pk_message);
            } else {
              this.$message({
                message: res.data.error.errorMessage,
                type: "error"
              });
            }
          })
          .catch(() => {
            this.$message({
              message: "信息获取失败",
              type: "error"
            });
          });
      },
      // 基本信息取消按钮操作
      formCancel() {
        if (this.baseData) {
          this.$refs.formRef.setFormData(this.baseData);
        } else {
          this.$refs.formRef.resetFormData();
        }
      },
      // 基本信息保存按钮操作
      formConfirm() {
        var vm = this;
        if(!this.pk_message) {
          return;
        }
        if(this.$refs.ifbpUeditorRef.getContentHtml()==''){
          this.$message("请输入内容");
          return;
        }
        console.log(JSON.stringify(vm.$refs.formRef.getFormData()));
        this.$refs.formRef.validate(valid => {
          if (valid) {
            var data = JSON.parse(JSON.stringify(vm.$refs.formRef.getFormData()));
            vm.sendButtonDisabled = true;
            if(data.receipt === true){
                data.receipt = 'Y';
            }else {
              data.receipt = 'N';
            }
            data.pk_message = this.pk_message;
            data.content = this.$refs.ifbpUeditorRef.getContentHtml();
            vm
              .$http({
                url: this.sendUrl,
                method: "post",
                data: data,
                headers: {
                  "Content-Type": "application/json"
                },
                dataType: "application/json"
              })
              .then((res) => {
                if (res.data.success) {
                  vm.$message.success("发送成功");
                  this.$router.push('/messageCenter');
                } else {
                  vm.$message({
                    message: res.data.error.errorMessage,
                    type: "error"
                  });
                }
              })
              .catch(() => {
                vm.$message({
                  message: "保存失败",
                  type: "error"
                });
              });
         } else {
           this.$message("校验未通过");
         }
       });
      }
    }
  };
</script>
