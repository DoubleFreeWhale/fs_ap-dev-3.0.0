<!-- 用户下拉菜单组件 -->
<template>
    <div>
        <ul class="user-component">
<!--            <li v-if="!isApm">-->
<!--                <i title="收藏" class="ifbp-icon-star-off el-icon-star-off el-icon-pt-shoucang icon disabled"-->
<!--                   v-if="!isCollect"></i>-->
<!--                <i title="收藏" @click.stop="removeCollect" class="ifbp-icon-star-on el-icon-star-on icon"-->
<!--                   style="color: #FFCC00;" v-if="isCollected && isCollect"></i>-->
<!--                <i title="收藏" @click.stop="saveClickColl"-->
<!--                   class="ifbp-icon-star-off el-icon-star-off el-icon-pt-shoucang icon"-->
<!--                   v-if="!isCollected && isCollect"></i>-->
<!--            </li>-->

            <el-popover v-if="!isApm"
                        :visible-arrow=false
                        placement="bottom"
                        :width="collectionConfig=='old' || collectionConfig=='new'? 326 : 620 "
                        trigger="click"
                        popper-class="collectClass"
                        style="padding:0 !important"
                        @show="showPopover"
                        @hide="showPopover"
            >
<!--                <li slot="reference" style="margin-left: 0;" :class="{'isShowColl':isShowCollect}" title="收藏">-->

<!--                        <i class="ifbp-icon-caret-down el-icon-caret-bottom icon" style="cursor: pointer"></i>-->

<!--                </li>-->
                <div class="coll-header">我的收藏</div>
                <div :class="[collectionConfig == 'old' ? 'coll-body' : 'coll-body-new']">
                    <ul>
                        <li v-for="coll in collections" @click='collectClick(coll)'>
                            <i v-if="coll.icon"
                               :class="[coll.icon,collectionConfig == 'old' ? 'coll-left' :'coll-top','iconfont','iconfont_form']"></i>
                            <i v-else
                               :class="['ifbp-icon-patch',collectionConfig == 'old' ? 'coll-left' :'coll-top','iconfont','iconfont_form']"
                               style="color:#8E8E93"></i>
                            <div v-if="collectionConfig == 'old'" class="coll-right">
                                <div :class="coll.subtitle?'coll-title':'coll-title-single'"><span>{{coll.title}}</span>
                                </div>
                                <div v-show="coll.subtitle" class="coll-subtitle"><span>{{coll.subtitle}}</span></div>
                            </div>
                            <div v-else class="coll-bottom">
                                <div class="coll-title"><span>{{coll.title}}</span></div>
                                <div v-show="coll.subtitle" class="coll-subtitle"><span>{{coll.subtitle}}</span></div>
                            </div>


                        </li>
                    </ul>
                </div>

                <div class="coll-footer">
                    <div class="coll-icon" @click="updateCollectMessage">
                        <i class="ifbp-icon-edit"></i>
                        <span>编辑</span>
                    </div>

                </div>
            </el-popover>
            <li v-if="isApm">
	      <span href="javascript:void(0)" @click='showApmTime' class="message-button" id="apm-time">
	    	 {{ showTime }}
	      </span>
            </li>
            <li v-if="isRobot && !isApm">
                <a href="javascript:void(0)" @click='robotClick' class="message-button" title="智能问答">
                    <i class="ifbp-icon-intelligent-answer icon"></i>
                </a>
            </li>
            <li v-if="msgcenter && !isApm">

                <el-badge :value='msgcount' :max="99" title="消息">
                    <a class="ifbp-icon-notifications icon" @click="messageClick"></a>
                </el-badge>
            </li>
            <li class="user" v-if="!isApm">
                <div v-if="showSettingsflag == 'tab'">
                    <el-dropdown @command="handleCommand">

                        <div>
                            <ifbp-table-image v-if="showDefaultImg" :name="username"
                                              style="margin-right: 0px;color:#fff"></ifbp-table-image>
                            <img v-else :src='userimg'
                                 style="height: 32px;width: 32px;border-radius: 50%;vertical-align: middle;"/>
                        </div>
                        <el-dropdown-menu slot="dropdown" class="user-el-dropdown-menu">
                            <slot name="item"></slot>
                            <el-dropdown-item style='margin-bottom: 10px;' command='loginOut'><i
                                    class='ifbp-icon-power el-icon-pt-tuichu icon'></i><span>注 销</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>

                    </el-dropdown>

                </div>
                <div @click="showSetting" v-else-if="showSettingsflag == 'dialog'">
                    <ifbp-table-image v-if="showDefaultImg" :name="username"
                                      style="margin-right: 0px;color:#fff"></ifbp-table-image>
                    <!-- <i class="ifbp-icon-account" v-if="showDefaultImg" style="font-size: 32px;color: #8E8E93;    line-height: inherit;"></i> -->
                    <img v-else :src='userimg'
                         style="height: 32px;width: 32px;border-radius: 50%;vertical-align: middle;"/>
                </div>
            </li>
            <slot></slot>
        </ul>
        <!-- 修改密码的model dialog -->
        <el-dialog
                   top="80px"
                   title="修改密码"
                   :show-close="false"
                   :modal="modal"
                   v-model="resetShow">
            <el-form>
                <el-form-item label="旧密码">
                    <el-input auto-complete="off" type="password" v-model="oldPwd"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input auto-complete="off" type="password" v-model="newPwd"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码">
                    <el-input auto-complete="off" type="password" v-model="reNewPwd"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetShow = false">取 消</el-button>
                <el-button type="primary" @click="checkPwd">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog style="height: calc(100% - 72px); top: 72px"

                   title="系统设置"
                   :show-close="false"
                   :modal="true"
                   v-model="resetTheme">
            <el-form label-position="top" v-model="settings">
                <el-form-item label="预置主题">
                    <el-select v-model="settings.themeCode" placeholder="请选择主题" style="width:100%;"
                               @change="handleThemeChange">
                        <el-option v-for="item in themeArray" :key="item.code" :label="item.name"
                                   :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否显示多页签">
                    <el-radio-group v-model="settings.showTabs">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetTheme = false">取 消</el-button>
                <el-button type="primary" @click="changeSettings">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
    export default {
        name: "ElUser",
        data() {
            return {
                showSettingsflag: 'tab',
                resetShow: false,
                resetTheme: false,
                modal: false,
                oldPwd: "",
                newPwd: "",
                reNewPwd: "",
                settings: {
                    themeCode: "",
                    themeName: "",
                    showTabs: true,
                    userId: ""
                    // jsonTheme: {
                    //   showTabs: false
                    // }
                },
                isApm: false,
                themeArray: [
                    {
                        code: "default",
                        name: "默认"
                    },
                    {
                        code: "red",
                        name: "红色"
                    }
                ],
                isShowCollect: false

                // cusTheme: '#20a0ff'
            };
        },
        props: {
            showTime: {
                type: String,
                default: ""
            },
            isCollected: {
                type: Boolean,
                default: false
            },
            userimg: {
                type: String,
                default: ""
            },
            username: {
                type: String,
                default: "username"
            },
            messageCount: {
                type: Number,
                default: 0
            },
            msgcenter: {
                type: String,
                default: "/index"
            },
            isRobot: {
                type: Boolean,
                default: false
            },
            isCollect: {
                type: Boolean,
                default: false
            },
            msgcount: {
                type: Number,
                default: 0
            },
            // beforeSettingsChange: {
            //   type: Function,
            //   default: function() {

            //   },
            // },
            settingsData: {
                type: Object,
                default() {
                    return {
                        themeCode: "",
                        themeName: "",
                        showTabs: true,
                        userId: ""
                        // jsonTheme: {
                        //   showTabs: false
                        // }
                    };
                }
            },
            collections: {
                type: Array,
                default() {
                    return []
                }
            },
            /* 控制是否显示用户icon，true为显示，false为不显示 */
            showDefaultImg: {
                type: Boolean,
                default: false,
            },
            collectionConfig: {
                type: String,
                default: 'old'
            }
        },
        created() {
            //下拉框的宽度要和头部保持一致
            this.isApm = window.isAPM;
            this.showSettingsflag = window.appDefaultConfig.personalSettings;
            if (this.showSettingsflag) {

            } else {
                this.showSettingsflag = 'tab'
            }
        },
        methods: {
            showApmTime() {
                this.$emit("showApmTime");
            },
            showPopover() {
                this.isShowCollect = !this.isShowCollect;
            },
            saveClickColl() {
                this.$emit("saveClickColl");
            },
            removeCollect() {
                this.$emit("removeCollect");
            },
            messageClick() {
                this.$emit("messageClick");
            },
            robotClick() {
                this.$emit("robotClick");
            },
            collectClick(coll) {
                this.$emit('collectClick', coll);
            },
            updateCollectMessage() {
                this.$emit('updateCollectMessage');
            },
            showSetting() {
                this.$emit("showSetting");
            },
            handleCommand(command) {
                if(command){
                    if (command == "openReset") {
                        this.openReset();
                    }
                    if (command == "loginOut") {
                        this.loginOut();
                    }
                    this.$emit("handleCommand", command);
                }
            },
            openReset() {
                this.oldPwd = "";
                this.newPwd = "";
                this.reNewPwd = "";
                this.resetShow = !this.resetShow;
            },
            loginOut() {
                this.$emit("logout");
            },
            checkPwd() {
                if (this.oldPwd === this.newPwd) {
                    this.$message({
                        message: "新旧密码不能相同！",
                        type: "error"
                    });
                } else if (this.newPwd !== this.reNewPwd) {
                    this.$message({
                        message: "两次输入的新密码不一致！",
                        type: "error"
                    });
                } else {
                    this.changePwd();
                }
            },
            changePwd() {
                this.$http({
                    url:
                        "/ifbp-app-sm/sm/user/resetPwd?id=" +
                        this.getCookie("_A_P_id") +
                        "&oldPwd=" +
                        this.oldPwd +
                        "&newPwd=" +
                        this.newPwd,
                    method: "get"
                })
                    .then(res => {
                        if (res.data.success) {
                            this.$message({
                                message: "密码修改成功",
                                type: "success"
                            });
                            this.resetShow = false;
                            this.loginOut();
                        } else {
                            this.$message({
                                message: res.data.error.errorMessage,
                                type: "error"
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: "密码修改失败，请重试",
                            type: "error"
                        });
                    });
            },
            handleThemeChange(val) {
                var item = this.themeArray.filter(v => {
                    return v.code === val;
                })[0];
                this.$set(this.settings, "themeName", item.name || "");
            },
            openTheme() {
                this.$set(
                    this.settings,
                    "themeCode",
                    u.getCookie("ifbp-theme") || "default"
                );
                this.resetTheme = !this.resetTheme;
            },
            changeSettings() {
                u.setCookie("ifbp-theme", this.settings.themeCode);
                this.resetTheme = false;
                this.$set(this.settings, "userId", this.getCookie("_A_P_id") || "");
                window.history.go(0);
            },
            saveSettingsData(settings) {
                var data = {
                    isDefault: settings.themeCode === "default" ? "Y" : "N",
                    themeCode: settings.themeCode || "",
                    themeName: settings.themeName || "",
                    userId: settings.userId || "",
                    jsonTheme: settings
                };
                var url = "/wbalone/wbTheme/upDataTheme";
                return this.$http({
                    url: url,
                    method: "post",
                    data: data
                })
                    .then(res => {
                        console.log("success:" + res);
                    })
                    .catch(e => {
                        console.log("保存系统设置数据失败, " + e);
                    });
            }
        },
        watch: {
            settingsData: {
                handler: function (val) {
                    Object.keys(this.settings).forEach(key => {
                        this.settings[key] = val[key] === undefined ? "" : val[key];
                    });
                },
                deep: true
            }
        }
    };
</script>
<style>
    #apm-time {
        color: rgba(0, 0, 0, .65);
        font-size: 14px;
    }

    .username {
        width: 126px;
        max-width: 126px;
        display: inline-block;
        overflow: hidden;
        vertical-align: middle;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
    }

    .user {
        text-align: center;
    }

    li.el-dropdown-menu__item.dropdown_collect {
        width: 320px !important;
    }

    li.el-dropdown-menu__item.update {
        height: 48px;
        text-align: right;
        font-size: 14px;
        color: #2D2D2D;
        margin-right: 8px;
    }

    li.el-dropdown-menu__item.title {
        height: 48px;
        font-size: 18px;
        color: #333333;
        font-weight: 600;
    }

    li.el-dropdown-menu__item.ifbp-icon-edit {
        color: #75787B;
    }

    .dropdown_collect.dropdown_collect_i {

        color: #2d2d2d;
        display: block;
        float: left;
        /* height: 44px; */
        line-height: 48px;
        /* width: 32px; */
        font-size: 32px;
        text-align: center;
        vertical-align: inherit;
    }

    .el-popover.collectClass {
        width: 320px;
        padding: 0 !important;
        background: #FFFFFF;
        border: 1px solid #F0F0F5;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
        border-radius: 4px;
    }

    .el-popover.collectClass .coll-header {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #F0F0F5;
        font-size: 18px;
        color: #333333;
        padding-left: 16px;
    }

    .el-popover.collectClass .coll-footer {
        height: 48px;
        line-height: 48px;
        border-top: 1px solid #F0F0F5;
        font-size: 18px;
        color: #333333;
        padding-left: 16px;
        text-align: right;
    }

    .coll-footer i {
        font-size: 18px;
        color: rgb(117, 120, 123);
        vertical-align: middle;
    }

    .coll-footer span {
        font-size: 14px;
        color: rgb(117, 120, 123);
        padding-right: 16px;
        padding-left: 8px;
    }

    .coll-footer .coll-icon {
        float: right;
    }

    .coll-footer .coll-icon:hover .ifbp-icon-edit, .coll-footer .coll-icon:hover span {
        cursor: pointer;
        color: #5CB0E6;
    }

    .el-popover.collectClass .coll-body {
        max-height: 320px;
        overflow-y: auto;
    }

    .el-popover.collectClass .coll-body-new {
        min-height: 356px;
        max-height: 464px;
        overflow-y: auto;
        margin-top: 16px;
        margin-left: 16px;
    }

    .el-popover.collectClass .coll-body li {
        list-style: none;
        padding-left: 16px;
        height: 64px;
        line-height: 64px;
    }

    .el-popover.collectClass .coll-body-new li {
        list-style: none;
        float: left;
        width: 96px;
        height: 108px;
        border: 1px solid rgba(0, 0, 0, 0);
    }

    .el-popover.collectClass .coll-body-new li:hover {
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #E6E6EB;
    }

    .el-popover.collectClass .coll-body li .coll-left {
        font-size: 32px;
        display: block;
        float: left;
        height: 64px;
        line-height: 64px;
    }

    .el-popover.collectClass .coll-body li .coll-top {
        font-size: 32px;

    }

    .el-popover.collectClass .coll-body-new li i {
        display: block;
        text-align: center;
        font-size: 24px;
        margin-top: 20px;

    }

    .coll-body-new .coll-bottom .coll-title {
        text-align: center;
        height: 16px;
        line-height: 16px;
        font-size: 14px;
        color: #2D2D2D;
        margin-top: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .coll-body-new .coll-bottom .coll-title-single {
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        color: #2D2D2D;
        margin-top: 8px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .coll-body-new .coll-bottom .coll-subtitle {
        height: 14px;
        line-height: 14px;
        font-size: 12px;
        margin-top: 6px;
        color: #75787B;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }


    .el-popover.collectClass .coll-body li .coll-right {
        margin-left: 16px;
        float: left;
    }

    .coll-body .coll-right .coll-title {
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        color: rgb(51, 51, 51);
        margin-top: 8px;
    }

    .coll-body .coll-right .coll-title-single {
        height: 48px;
        line-height: 48px;
        font-size: 16px;
        color: rgb(51, 51, 51);
        margin-top: 8px;
    }

    .coll-body .coll-right .coll-subtitle {
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        color: rgb(136, 136, 136);
    }

    i.ifbp-icon-caret-down.el-icon-caret-bottom {
        transition: transform .3s;
        vertical-align: middle;
    }

    .isShowColl i.ifbp-icon-caret-down.el-icon-caret-bottom {
        transform: rotate(-180deg);
    }

    .user-el-dropdown-menu {
        margin: 5px 0 0 !important;
        padding: 0 !important
    }

    .user-el-dropdown-menu .el-dropdown {
        cursor: pointer;
        width: 100%;
        height: 100%;
        text-align: center
    }

    .user-el-dropdown-menu .el-dropdown-link:hover {
        color: #71787e !important
    }

    .user-el-dropdown-menu li {
        width: 228px;
        padding: 8px 8px 8px 16px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #48586a;
        height: 36px;
        line-height: 1.5;
        box-sizing: border-box;
        cursor: pointer;
        text-align: left
    }

    .user-component li:hover i, .user-component li:hover span {
        color: #000
    }


    .user-el-dropdown-menu .el-dropdown-menu__item:hover {
        background: #f0f5fa !important
    }

    .user-el-dropdown-menu .el-dropdown-menu__item img {
        display: block;
        float: left;
        height: 32px;
        width: 32px;
        border-radius: 50%;
        margin-top: 8px
    }

    .user-el-dropdown-menu .el-dropdown-menu__item .usermessage {
        float: left;
        line-height: 16px;
        height: 32px;
        font-size: 14px;
        margin-top: 8px
    }

    .user-el-dropdown-menu .el-dropdown-menu__item i {
        font-size: 16px;
        color: #2d2d2d
    }

    .user-el-dropdown-menu .el-dropdown-menu__item span {
        width: 150px;
        display: inline-block;
        margin-left: 8px;
        font-size: 14px;
        color: #2d2d2d;
        vertical-align: text-bottom;
        margin-right: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis
    }

    .user-el-dropdown-menu .el-dropdown-menu__item--divided {
        margin: 0 !important
    }

    .user-el-dropdown-menu .el-dropdown-link {
        display: inline-block;
        line-height: 40px;
        font-size: 16px;
        padding-left: 8px;
        padding-right: 8px;
        color: #727171
    }

    .user-component .icon {
        vertical-align: middle;
        font-size: 24px
    }

    .header-black .user-component .icon.disabled {
        cursor: not-allowed;
        color: #fff;
        opacity: .5
    }

    .header-white .user-component .icon.disabled {
        cursor: not-allowed;
        /*color: #8e8e93;*/
        opacity: .5
    }

    .el-badge__content.is-fixed {
        top: 10px;
        right: 0;
        position: absolute;
        -ms-transform: translateY(-50%) translateX(50%);
        transform: translateY(-50%) translateX(50%);
        z-index: 1
    }

    .el-dropdown-link .el-icon-pt-daohang-yonghu {
        margin-right: 1px
    }

    .username {
        font-size: 14px
    }

    .message-button {
        position: relative !important;
        display: inline-block
    }

    .message-number {
        position: absolute;
        width: 20px;
        height: 20px;
        display: inline-block;
        right: -2px;
        top: 2px;
        color: #fff !important;
        font-size: 12px;
        line-height: 20px
    }

    .user-component {
        list-style: none;
        float: right
    }

    .user-component li {
        list-style: none;
        float: left;
        color: inherit;
        height: 40px;
        line-height: 40px;
        border-radius: 3px;
        text-align: center;
        margin-left: 16px
    }



    .user-component li.is-active:hover {
        cursor: pointer
    }

    .user-component li.el-menu-item:hover a, .user-component li.el-menu-item:hover span, .user-component ul li.el-menu-item:hover i {
        color: #71787e
    }

    .user-el-dropdown-menu {
        margin: 5px 0 0 !important;
        padding: 0 !important
    }

    .user-el-dropdown-menu .el-dropdown {
        cursor: pointer;
        width: 100%;
        height: 100%;
        text-align: center
    }

    .user-el-dropdown-menu .el-dropdown-link:hover {
        color: #71787e !important
    }

    .user-el-dropdown-menu li {
        width: 228px;
        padding: 8px 8px 8px 16px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #48586a;
        height: 36px;
        line-height: 1.5;
        box-sizing: border-box;
        cursor: pointer;
        text-align: left
    }

    .user-component li:hover i, .user-component li:hover span {
        color: #000
    }

    .user-el-dropdown-menu li:nth-child(1) {
        cursor: default;
    }

    .user-el-dropdown-menu .el-dropdown-menu__item:hover {
        background: #f0f5fa !important
    }

    .user-el-dropdown-menu .el-dropdown-menu__item img {
        display: block;
        float: left;
        height: 32px;
        width: 32px;
        border-radius: 50%;
        margin-top: 8px
    }

    .user-el-dropdown-menu .el-dropdown-menu__item .usermessage {
        float: left;
        line-height: 16px;
        height: 32px;
        font-size: 14px;
        margin-top: 8px
    }

    .user-el-dropdown-menu .el-dropdown-menu__item i {
        font-size: 16px;
        color: #2d2d2d
    }

    .user-el-dropdown-menu .el-dropdown-menu__item span {
        width: 150px;
        display: inline-block;
        margin-left: 8px;
        font-size: 14px;
        color: #2d2d2d;
        vertical-align: text-bottom;
        margin-right: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis
    }

    .user-el-dropdown-menu .el-dropdown-menu__item--divided {
        margin: 0 !important
    }

    .user-el-dropdown-menu .el-dropdown-link {
        display: inline-block;
        line-height: 40px;
        font-size: 16px;
        padding-left: 8px;
        padding-right: 8px;
        color: #727171
    }

    .header-black .user-component .icon.disabled {
        cursor: not-allowed;
        color: #fff;
        opacity: .5
    }

    .header-white .user-component .icon.disabled {
        cursor: not-allowed;
        /*color: #8e8e93;*/
        opacity: .5
    }

    .el-badge__content.is-fixed {
        top: 10px;
        right: 0;
        position: absolute;
        -ms-transform: translateY(-50%) translateX(50%);
        transform: translateY(-50%) translateX(50%);
        z-index: 1
    }

    .el-dropdown-link .el-icon-pt-daohang-yonghu {
        margin-right: 1px
    }

    .username {
        font-size: 14px
    }

    .message-button {
        position: relative !important;
        display: inline-block
    }

    .message-number {
        position: absolute;
        width: 20px;
        height: 20px;
        display: inline-block;
        background: url(../../../theme-default/images/u641.png);
        right: -2px;
        top: 2px;
        color: #fff !important;
        font-size: 12px;
        line-height: 20px
    }
</style>
