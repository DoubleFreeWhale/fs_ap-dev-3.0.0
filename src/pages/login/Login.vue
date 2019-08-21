<template>
    <div id="Login" style="height: 100%;  display: flex;">

        <el-form :model="loginForm"
                 label-position="left"
                 ref="loginForm"
                 :hide-required-asterisk="true"
                 class="loginForm">
            <el-form-item prop="tip">
                <h2 style="">登录
                    <el-alert
                            v-if="errMessage"
                            :title="errMessage"
                            type="error"
                            class="errMessage"
                    >
                    </el-alert>
                </h2>

            </el-form-item>
            <el-form-item prop="usercode"
                          :rules="[
                        { required: true, message: '用户名不允许为空，请输入!', trigger: 'blur' },
                        { pattern: /^[\s\u4e00-\u9fa5a-z0-9_-]{0,}$/, message: '用户名存在非法字符，请重新输入', trigger: 'blur' }
                    ]"
            >
                <template slot="label"> <span class="title">
                    用户名
                </span></template>
                <el-input type="text" v-model="loginForm.usercode"
                          size="large"
                          class="login-input"
                          placeholder="请输入用户名"
                          autoComplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="userpwd" :rules="[
                            { required: true, message: '密码不允许为空，请输入!', trigger: 'blur' }
                          ]">
                <template slot="label"> <span class="title">
                    密码
                </span></template>
                <el-input type="password"
                          placeholder="请输入密码"
                          size="large"
                          class="login-input"
                          v-model="loginForm.userpwd" autoComplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="captchaenable" prop="captcha" :rules="[
                            { required: true, message: '验证码不允许为空，请输入!', trigger: 'blur' }
                          ]">
                <template slot="label"> <span class="title">
                    验证码
                </span></template>
                <el-input type="password"
                          placeholder="请输入验证码"
                          size="large"
                          class="login-input"
                          v-model="loginForm.captcha" autoComplete="off"></el-input>
            </el-form-item>
            <el-form-item style="text-align: left">
                <el-checkbox v-model="checked"><span style="font-size: 14px;color: #7C90A6;">记住密码</span></el-checkbox>
                <el-button type="text" style="float: right" @click="dialogVisible=true">忘记密码</el-button>
                <el-alert
                        v-if="checked"
                        title="请不要在公共场合使用该功能！！"
                        type="warning"
                        show-icon
                        :closable="false"
                        class="errMessage"
                >
                </el-alert>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"  size="large" style="width:100%" @click="login()">登录</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="找回密码" :visible="dialogVisible" :show-close="false">
            <div class="resetBox">
                <el-steps :space="100" :active="active" align-center process-status="finish" finish-status="success">
                    <el-step title="填写信息"></el-step>
                    <el-step title="验证码"></el-step>
                    <el-step title="重置密码"></el-step>
                    <el-step title="完成"></el-step>
                </el-steps>
                <el-form  v-if="active===0" label-width="80px"
                          ref="form_step0"
                          class="formStep" :model="form_step">
                    <el-form-item label="用户" prop="user_code"
                                  :rules="[
                        { required: true, message: '用户名不允许为空，请输入!', trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="form_step.user_code"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email"
                                  :rules="[
                        { required: true, message: '邮箱不允许为空，请输入!', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确，请重新输入!', trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="form_step.email"></el-input>
                    </el-form-item>
                </el-form>
                <el-form  v-if="active===1" label-width="80px"
                          ref="form_step1"
                          class="formStep" :model="form_step">
                    <el-form-item label="验证码" prop="valid_code"
                                  :rules="[
                        { required: true, message: '验证码不允许为空，请输入!', trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="form_step.valid_code"></el-input>
                    </el-form-item>
                </el-form>
                <el-form  v-if="active===2" label-width="80px"
                          ref="form_step2"
                          class="formStep" :model="form_step">
                    <el-form-item label="新密码" prop="pass"
                                  :rules="[
                        { required: true, message: '新密码不允许为空，请输入!', trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="form_step.pass"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass"
                                  :rules="[
                        { required: true, message: '确认密码不允许为空，请输入!', trigger: 'blur' },
                        { type: 'enum',enum:[form_step.pass], message: '两次密码不一致，请重新输入!', trigger: 'blur' }
                    ]"
                    >
                        <el-input v-model="form_step.checkPass"></el-input>
                    </el-form-item>
                </el-form>
                <el-alert
                        v-if="form_step_errmsage"
                        :title="form_step_errmsage"
                        type="warning"
                        show-icon
                        :closable="false"
                        class="errMessage"
                >
                </el-alert>
            </div>
            <div  slot="footer" style="text-align: right">
                <el-button @click="handleDialogClose()" v-if="active === 0">取消</el-button>
                <el-button @click="backStep()" v-if="active != 0 && active != 3">上一步</el-button>
                <el-button type="primary" @click="next()" v-if="active != 3">下一步</el-button>
                <el-button type="primary" @click="handleDialogClose()" v-if="active == 3">完成</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Qs from 'qs'

    export default {
        name: "Login",
        data: function () {
            return {
                dialogVisible: false,
                errMessage: '',
                loginForm: {
                    usercode: '',
                    userpwd: '',
                    langcode: 'simpchn',
                    bccode: 'develop',
                    devicetype: '1',
                    captcha: '',
                    isforce: 'N',
                },
                form_step: {
                    bccode:'develop',
                    user_code: '',
                    email: '',
                    valid_code: '',
                    pass: '',
                    checkPass: ''
                },
                languages: [],
                busiCenters: [],
                captchaenable: false,
                checked: false,
                active:0,
                form_step_errmsage:'',
            };
        },
        created: function () {
            let remember=localStorage.getItem('remember');
            if(remember){
                this.loginForm=Object.assign(this.loginForm,JSON.parse(remember))
            }
            this.getLoginSetting();
        },
        methods: {
            getLoginSetting() {
                var loginsetting;
                var loginsettingString = window.localStorage.getItem('loginsetting');
                if (loginsettingString) {
                    loginsetting = JSON.parse(loginsettingString);
                }
                var url = '/baseapp/account/loginsetting';
                if (loginsetting && loginsetting.ts) {
                    url = url + '?ts=' + loginsetting.ts
                }
                this.$http.get(url).then(({data}) => {
                    console.log(data)
                    if (data.status) {
                        this.busiCenters = data.busiCenters;
                        this.languages = data.languages;
                        this.captchaenable = data.captchaenable;
                        this.loginForm.bccode=data.busiCenters[0].code
                    }
                }).catch(err => {
                    this.errMessage = '系统数据获取失败，请重试！'
                })
            },
            login(e) {
                this.$refs.loginForm.validate((res)=>{

                    if(res){
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        let obj = Object.assign({}, this.loginForm);
                        if (e) {
                            obj.isforce = 'Y'
                        }
                        obj.captcha = '1';
                        this.$http.post('/baseapp/account/login', Qs.stringify(obj)).then(({data}) => {
                            loading.close();
                            if (data.status) {
                                var remember = {
                                    userCode: data.usercode,
                                    langCode: data.langcode,
                                    bccode: data.bccode,
                                    userpwd: data.userpwd,
                                };
                                if(this.checked){
                                    localStorage.setItem('remember',JSON.stringify(remember))
                                }
                                window.location.replace('index.html')  ;
                            } else if (data.error.errorCode === 'user_already_online') {
                                this.$confirm('该用户已在线，是否强制登录？', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.login(true);
                                }).catch(() => {

                                });
                            } else {
                                let msg = data.msg || data.message;
                                this.$alert(msg, '提示')
                            }
                        }).catch(err => {
                            loading.close();
                            console.log(err);
                            this.$alert('发生未知错误', '提示')
                        })
                    }
                })
            },
            next(){
                this.form_step_errmsage='';
                this.$refs['form_step'+this.active].validate((ok)=>{
                   if(ok){
                       let obj=Object.assign({step_active:this.active+1},this.form_step)
                       this.$http.post('/riart/sfbase/pwd/nextstep?r=' + Math.random(),obj).then(({data})=>{
                           let res=data
                           if (res.status) {
                               this.active++;
                           } else {
                               this.form_step_errmsage=res.msg
                           }
                       }).catch(err=>{
                           console.log(err);
                           this.$alert('发生未知错误', '提示')
                       });
                   }
                })

            },
            handleDialogClose(){
                this.form_step.user_code='';
                this.form_step.pass='';
                this.form_step.checkPass='';
                this.form_step.email='';
                this.form_step.valid_code='';
                if(this.$refs.form_step0){
                    this.$refs.form_step0.resetFields()
                }
                this.dialogVisible=false;
                this.active=0
            }
        },


    }
</script>

<style >
    .loginForm {
        width: 49%;
        margin: auto;
    }

    h2 {
        text-align: left;
        color: #1B1E24;
        font-size: 30px;
        height: 90px;
    }

    .errMessage {
        line-height: 18px;
    }

    .title {
        font-size: 14px;
        color: #252631;
    }

    #Login .login-input {
        font-size: 14px;
        color: #bc2747;
    }
    #loginBox .el-form-item__content{
        width: 100%;
    }
    .login-input input {

    }
    .resetBox{
        width: 400px;
        margin: 0 auto;
    }
    .formStep{
        width: 360px;
        margin-top: 12px;
        height: 125px;
    }
</style>