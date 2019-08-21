<template>
    <!-- 新增模板 Dialog -->
    <el-dialog :title='title' :before-close="btnCancel" :visible="showDialog" size="tiny">
        <el-form ref="assignFormRef" :model="assignFormData" :rules="rules" label-width="100px" v-if='optionData.length > 0'>
            <el-form-item label="下一环节">
                <el-input  v-model="inputVal" :editable="false"></el-input>
            </el-form-item>
            <el-form-item label="指派" required prop="designate">
                <el-select v-model="assignFormData.designate" multiple placeholder="请选择">
                    <el-option
                        v-for="item in optionData"
                        :label="item.name"
                        :value="item.pk_user"
                        :key="item.pk_user"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <ifbp-form-button-area>
            <el-button type="primary" @click='btnConfirm'>确定</el-button>
            <el-button  @click="btnCancel">取消</el-button>
        </ifbp-form-button-area>
    </el-dialog>
</template>
<script>
  export default {
    name: 'assignsubmit',
    //title:弹窗的标题
    props: {
        billType:{
            type:String,
            default:''
        },
        billId:{
            type:String,
            default:''
        },
        title:{
            type:String,
            default:"提交单据"
        }
    },
    data(){
        return{
            showDialog:false,
            designateList:[],
            assignFormData:{
                designate:[]
            },
            optionData:[],
            inputVal:'',
            rules: {
                designate: [
                    { required: true, message: '请选择指派人', trigger: 'blur' },
                ]
            }
        }
    },
    methods: {
        showAssignDialog(){
            this.$nextTick(()=>{
                if(this.billType !== '' && this.billId !== ''){
                    this.request();
                }else{
                    console.log('billType或billId为空。');
                }
            });
        },
        request(){
            var vm = this;
            let requestUrl = '/riart/fbpworkflows/assignsubmit';
            vm.$http({
            url: requestUrl,
            method: 'post',
            data: {
                billType: vm.billType,
                billId: vm.billId
            },
            dataType: 'json'
            }).then(function(res){
                if (res.data.status === true){
                    vm.designateList = [];
                    let getData = res.data.data;
                    vm.designateList = getData;
                    if(vm.designateList && vm.designateList.length > 0 ){
                        vm.inputVal = getData[0].activityDesc;
                        vm.optionData = getData[0].allUsers;
                        if(vm.optionData&&vm.optionData.length>0){
                            vm.showDialog=true;
                        }else{
                            vm.btnConfirm();
                        }
                    }else{
                        vm.btnConfirm();
                    }
   
                } else {
                    vm.$message.error(res.data.msg);
                }
            }).catch((e) => {
                vm.$message.error('操作异常');
            });
        },
        btnConfirm(){
            var vm = this;
            if(vm.designateList){
                vm.$refs["assignFormRef"].validate(function(valid){
                    if (valid) {
                        let requestUrl = '/riart/fbpworkflows/dosubmit';
                        vm.$http({
                        url: requestUrl,
                        method: 'post',
                        data: {
                            billType: vm.billType,
                            billId: vm.billId,
                            param: vm.assignFormData.designate
                        },
                        dataType: 'json'
                        }).then(function(res) {
                            if (res.data.status === true) {
                                vm.showDialog=false;
                                vm.$emit("callBack");
                                vm.btnCancel();
                                vm.$message({
                                    message: "提交成功！",
                                    type: "success"
                                });
                            } else {
                                vm.$message.error(res.data.msg);
                            }
                        }).catch(function(e) {
                            vm.$message.error('操作异常');
                        });
                    } 
                });
            }else{
                let requestUrl = '/riart/fbpworkflows/dosubmit';
                vm.$http({
                url: requestUrl,
                method: 'post',
                data: {
                    billType: vm.billType,
                    billId: vm.billId,
                    param: vm.assignFormData.designate
                },
                dataType: 'json'
                }).then(function(res) {
                    if (res.data.status === true) {
                        vm.showDialog=false;
                        vm.$emit("callBack");
                        vm.btnCancel();
                        vm.$message({
                            message: "提交成功！",
                            type: "success"
                        });
                    } else {
                        vm.$message.error(res.data.msg);
                    }
                }).catch(function(e) {
                    vm.$message.error('操作异常');
                });
            }
            
            
        },
        btnCancel(){
            this.showDialog=false;
            this.assignFormData.designate=[];
        },
    }
  };
</script>