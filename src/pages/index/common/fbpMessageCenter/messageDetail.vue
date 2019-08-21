<template>
  <ifbp-page>
    <!--节点title-->
    <ifbp-breadcrumb name="查看消息"></ifbp-breadcrumb>
    <!-- 主体区域 -->
    <ifbp-main-area type="detail">
      <!-- 主表编辑页签 -->
      <ifbp-panel id="basePanel" title="消息信息">
        <ifbp-template ref="formRef"
                       :pk-temp="pkTemp"
                       show-type="form"
                       :tpl-data="formData"
                       :editable="formEdit"
                       @after-create="templateFormAfterCreate"
        >
        </ifbp-template>
        <!-- 富文本编辑器 -->
        <el-form :inline="true" label-width="150px" :adaptation="true">
          <el-form-item _id="ueditor-div" label="内容" width="100%" :required="false">
            <ifbp-ueditor ref="ifbpUeditorRef" :ueditorData="ueditorData" :isReadonly="isReadonly" v-if='this.ueditorData'></ifbp-ueditor>
          </el-form-item>
        </el-form>
      </ifbp-panel>
      <ifbp-panel id="attachmentPanel" title="附件管理">
        <ifbp-upload :disable-upload="customerDisableUpload"
          busi-code="sm_msg_content"
          force-type = "normal"
          :pk-busi="msgsendpk">
        </ifbp-upload>
      </ifbp-panel>
    </ifbp-main-area>

    <el-dialog
      title="提示"
      :visible="receiptDialogVisible"
      :modal="modal"
      @update:visible="val => receiptDialogVisible = val"
      size="tiny"
      :before-close="handleClose">
      <span>该消息需要发送已读回执，是否发送回执消息?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="receiptClick('N')">取 消</el-button>
        <el-button type="primary" @click="receiptClick('A')">确 定</el-button>
      </span>
    </el-dialog>
  </ifbp-page>
</template>
<script>
  import ifbpUeditor from './ifbp-ueditor.vue';
  export default {
    components: { ifbpUeditor },
    data() {
      var vm = this;
      var id = this.$root.$router.currentRoute.params.id;
      return {
        getByIdUrl: '/baseapp/messagecenter/get',
        receiptUrl: '/baseapp/messagecenter/readandreceipt',
        dataTest:[],
        customerDisableUpload: true,
        pkTemp: '000115100000002L5JMT',
        // 通过传入的参数判断是新增还是修改操作
        id: id,
        msgsendpk: id,
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
        formData: {},
        // 基本信息默认是否可修改
        formEdit: false,
        receiptDialogVisible: false,
        modal: true,
        //富文本编辑器
        ueditorData:'',
        isReadonly:true
      };
    },
    mounted() {
      this.request();
    },
    methods: {
      dynamicChangeFun(item,field,val){
      },
      templateFormAfterCreate(UIComp) {
        this.dynamicpkClass = UIComp.getPkClass();
      },
      // 请求客户基本信息详情
      request() {
        var vm = this;
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
              if(res.data.data.destination === 'inbox'){
                this.msgsendpk = res.data.data.msgsendpk;
              }
              this.$refs.formRef.setFormData(res.data.data);
              this.baseData = JSON.parse(JSON.stringify(res.data.data));
              this.ueditorData = JSON.parse(JSON.stringify(res.data.data.content));

              setTimeout(() => {
                if(res.data.data.destination === 'inbox' && res.data.data.isread === false && res.data.data.receipt === 'Y'){
                  vm.receiptDialogVisible = true;
                }else {
                  vm.readAndReceipt();
                }
              }, 1000);

            } else {
              this.$message({
                message: res.data.error.errorMessage,
                type: "error"
              });
            }
          })
          .catch(e => {
            this.$message({
              message: "信息详情获取失败",
              type: "error"
            });
          });
      },
      handleClose(){
        this.readAndReceipt('N');
      },
      receiptClick(receipt){
        this.readAndReceipt(receipt);
      },
      readAndReceipt(receipt){
        var vm = this;
        var data = {
          pk_message: this.id,
        };
        if(receipt){
          data.receipt = receipt;
        }
        this.$http({
          url: this.receiptUrl,
          method: "post",
          data: data,
          headers: {
            "Content-Type": "application/json"
          },
          dataType: "application/json"
        })
          .then(res => {
            if (res.data.success === true) {
              if(vm.receiptDialogVisible){
                vm.receiptDialogVisible = false;
                this.$message({
                    message: '回执成功'
                });
              }
            } else {
              this.$message({
                message: res.data.error.errorMessage,
                type: "error"
              });
            }
          })
          .catch(e => {
            this.$message({
              message: "请求失败",
              type: "error"
            });
          });
      },
      // 信息取消按钮操作
      formCancel() {
        this.formEdit = false;
        if (this.baseData) {
          this.$refs.formRef.setFormData(this.baseData);
        } else {
          this.$refs.formRef.resetFormData();
        }
      },
      // 信息保存按钮操作
    }
  };
</script>
