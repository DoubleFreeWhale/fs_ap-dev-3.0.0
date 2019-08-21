<template>
  <div
    style="padding: 10px;"
    id="sys-setting"
  >
    <div :span="6" class="tab-vertical">
        <tab-vertical
          :tabs="tabs"
          @setCurTab="setCurTab"
        ></tab-vertical>
    </div>
    <div class="setting-dialog-content">
      <div class="all-setting">
        <change-password
          v-show="activeName === 'first'"
          :activeName="activeName"
          :platform="platform"
          @pswChange='pswChange'
        ></change-password>
        <preference-set
          v-show="activeName === 'second'"
          :setting='settings'
          :activeName="activeName"
          :platform="platform"
          @perferenceSetChange='perferenceSetChange'
        ></preference-set>
        <theme-set
          v-show="activeName === 'four'"
          :setting='settings'
          :activeName="activeName"
          :platform="platform"
          @themeSetChange='themeSetChange'
        ></theme-set>
        <language
          v-show="activeName === 'three'"
          :setting='settings'
          :activeName="activeName"
          :platform="platform"
          :languages='settings.languages'
          @languageSetChange='languageSetChange'
        ></language>
        <business
          v-show="activeName === 'five'"
          :setting='settings'
          :activeName="activeName"
          :platform="platform"
          :businesss='settings.business'
          @businessSetChange='businessSetChange'
        ></business>
      </div>
    </div>
  </div>
</template>
<script>
import commonUtils from "../../util/commonUtils.js";
import pageModelMixin from "../../util/pageModelMixin.js";
import tabVertical from "./tabVertical.vue";
import changePassword from "./changePassword.vue";
import preferenceSet from "./preferenceSet.vue";
import themeSet from "./themeSet.vue";
import language from "./language.vue";
import business from "./business.vue";
export default {
  mixins: [pageModelMixin],
  components: {
    tabVertical,
    changePassword,
    preferenceSet,
    themeSet,
    language,
    business
  },
  data() {
    let passwordCustomer;
    let halfPolicy;
    let regx = new RegExp("//");
    let oThis = this;
    let vm = this;
    var platform = vm.$context.getPlatform();
    if (window.passwordPolicy) {
      passwordCustomer = window.passwordPolicy;
    }
    return {
      direction: "fl",
      tabs: [
        {
          value: "安全",
          code: "safe",
          number: "first"
        },
        {
          value: "偏好",
          code: "preference",
          number: "second"
        },
        {
          value: "主题",
          code: "theme",
          number: "four"
        },
        {
          value: "语言",
          code: "language",
          number: "three"
        },
        {
          value: "业务",
          code: "business",
          number: "five"
        }
      ],
      // passwordTabHide: !window.appDefaultConfig.settingPasswordTabHide,
      passwordTabHide: true,
      platform: platform,
      showFirstErrorMessage: false,
      //固定写法
      scrollDom: document.getElementsByClassName("view")[0],
      loginName: "",
      activeName: "",
      threeInit: true,
      secondShow: true,
      themeCodeOriginal: "",
      // settings 表中的主要字段
      settings: {
        themeCode: "",
        themeName: "",
        userId: "",
        themeId: "",
        showTabs: false, // 是否展示多页签：true or false
        navPosition: "left", // 导航菜单位置："left" or "top"
        bannerColor: "", // banner区域背景色
        workspace: "all",
        showtype: "", //显示类型
        startColorStr: "rgba(230,230,235,1)",
        endColorStr: "rgba(240,240,245,1)",
        isPellucid: true,
        pageHeaderColor: "rgba(255, 255, 255, 1)",
        themeColor: "",
        bgImg: "",
        languages: {
          format: "zh-cn",
          type: "zh-cn"
        },
        business: {
          unit: "zh-cn",
          acountBooks: "zh-cn",
          controlArea: "zh-cn",
          costFields: "zh-cn"
        }
      },
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
      bannerArray: [
        {
          code: "default",
          name: "默认"
        },
        {
          code: "red",
          name: "红色"
        }
      ],
      // fbprules: {
      //   oldPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
      //   newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
      //   reNewPwd: [{ validator: rePasswordPolicyValidator, trigger: 'blur' }]
      // },
      // /^(?=[a-z]*)(?=[A-Z]*)(?=[0-9]*){8,60}$/
      passwordPolicy: "/^(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,60}$/",
      passwordPercentage: 0,
      // showtypeArray: [
      //   {
      //     code: 'table',
      //     name: '表格'
      //   },
      //   {
      //     code: 'form',
      //     name: '表单'
      //   }
      // ],
      showNavbar: true,
      // 基本信息设置
      settingStaffEdit: false,
      settingStaffData: {},
      settingStaffMethods: {
        avatarUploadSuccess(res) {
          var formData = vm.$refs.settingStaffRef.comp.psndoc;
          formData.avatar = res.data;
        }
      },
      settingStaffIcons: [
        {
          icon: "edit",
          show: true,
          click() {
            vm.settingStaffEdit = !vm.settingStaffEdit;
            vm.settingStaffIcons[0].show = false;
          }
        }
      ],
      showSettingStaff: true
    };
  },
  created() {
    if (window.passwordPrompt) {
      this.passwordPrompt = window.passwordPrompt;
    }
    if (window.passwordPolicy) {
      this.passwordPolicy = window.passwordPolicy;
    }
    this.getSettingsData();
    this.loginName = commonUtils.getCookie("_A_P_loginName");
    if (
      this.$context.getIsChangePassword() === "Y" ||
      this.$context.getDisabledate() === "disable"
    ) {
      this.activeName = "first";
      this.secondShow = false;
    }
    if (this.platform === "ifbp") {
      let promise = this.getUserType();
      Promise.all([promise]).then(() => {
        if (this.showSettingStaff) {
          this.getUserData();
        }
      });
    }
  },
  methods: {
    setCurTab(index) {
      this.activeName = this.tabs[index].number;
    },
    handleClick(tab, event) {
      // if (tab.name === 'second') {
      //   this.showNavbar = true;
      // }
      // if (tab.name === 'four' || 'first') {
      //   this.showNavbar = false;
      // }
      if (tab.name === "three") {
        if (this.threeInit) {
          setTimeout(() => {
            this.$refs.settingStaffRef.init();
          }, 100);
          this.threeInit = false;
        }
      }
    },
    //保存系统设置
    confirm() {
      if (this.activeName === "three") {
        if (this.platform === "ifbp") {
          this.setUserData();
          this.setUserAvatar();
        }
      } else {
        const promise2 = this.saveSettingsData();
        promise2.then(val2 => {
          // 保存系统风格设置成功
          if (val2) {
            // 未修改密码 && 保存系统风格成功，返回并刷新
            // window.history.go(-1);
            setTimeout(() => {
              // 延迟1s重新加载,页面设置生效
              window.location.reload();
            }, 1000);
          }
        });
      }
    },
    // 取消
    cancel() {
      this.getSettingsData();
      this.$message("已取消");
      if (this.activeName === "three") {
        this.settingStaffEdit = false;
        this.settingStaffIcons[0].show = true;
      }
      // window.history.go(-1);
    },
    // 获取系统设置的数据
    getSettingsData() {
      this.activeName =
        commonUtils.getCookie("ifbp-setting-index", this.activeName) ||
        "second";
      this.$http({
        url: "/wbalone/wbTheme/getPresentUserTheme",
        method: "get"
      })
        .then(res => {
          if (res.data.status === 1) {
            var data = res.data.wbTheme || {};
            Object.keys(this.settings).forEach(key => {
              this.$set(
                this.settings,
                key,
                data[key] === null ||
                  data[key] === "" ||
                  data[key] === "undefined" ||
                  data[key] === undefined
                  ? this.settings[key]
                  : data[key]
              );
            });
            commonUtils.setCookie("workspace", data.workspace);
            this.settings.themeId = res.data.themeId;
            this.themeCodeOriginal = data.themeCode;
          }
        })
        .catch(e => {
          console.log("获取系统设置数据失败, " + e);
        });
    },
    handleThemeChange(val) {
      var item = this.themeArray.filter(v => {
        return v.code === val;
      })[0];
      this.$set(this.settings, "themeName", item.name || "");
    },
    businessSetChange(business){
      this.settings.business = business;
    },
    languageSetChange(language){
      this.settings.languages = language;
    },
    themeSetChange(obj) {
      this.settings = obj.settings;
    },
    pswChange(activeName) {
      this.activeName = activeName;
    },
    perferenceSetChange(settings, activeName) {
      this.settings = settings;
      this.activeName = activeName;
    },
    // 保存系统偏好设置
    saveSettingsData(settings) {
      commonUtils.setCookie("ifbp-theme", this.settings.themeCode);
      commonUtils.setCookie("ifbp-setting-index", this.activeName);
      this.$set(
        this.settings,
        "userId",
        commonUtils.getCookie("_A_P_id") || ""
      );
      commonUtils.setCookie("workspace", this.settings.workspace);
      const promise = new Promise((resolve, reject) => {
        var data = {
          isDefault: "N",
          themeCode: this.settings.themeCode,
          themeName: this.settings.themeName,
          userId: this.settings.userId,
          themeId: this.settings.themeId,
          jsonTheme: this.settings,
          workspace: this.settings.workspace,
          startColorStr: this.settings.startColorStr,
          endColorStr: this.settings.endColorStr,
          isPellucid: this.settings.isPellucid,
          pageHeaderColor: this.settings.pageHeaderColor,
          themeColor: this.settings.themeColor,
          bgImg: this.settings.bgImg,
          languages: this.settings.languages,
          business: this.settings.business
        };
        var url = "/wbalone/wbTheme/upDataTheme";
        return this.$http({
          url: url,
          method: "post",
          data: data
        })
          .then(res => {
            if (res.data.status === 1) {
              console.log("success:" + res);
              this.$message({
                message: "保存系统设置数据成功！",
                type: "success"
              });
              resolve(true);
            } else {
              reject();
            }
          })
          .catch(e => {
            this.$message({
              message: "保存系统设置数据失败！",
              type: "error"
            });
            reject();
            console.log("保存系统设置数据失败, " + e);
          });
      });
      return promise;
    },
    // 基本信息设置相关
    getUserType() {
      return this.$http({
        url: "/ifbp-app-sm/sm/user/userType",
        method: "post"
      })
        .then(res => {
          if (res.data.success === true) {
            if (res.data.data === "0") {
              this.showSettingStaff = true;
            } else {
              this.showSettingStaff = false;
            }
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "请求出错"
          });
        });
    },
    getUserData() {
      this.$http({
        url: "/ifbp-app-bd/bd/psn/psndoc/basic",
        method: "post"
      })
        .then(res => {
          if (res.data.success === true) {
            let resData = res.data.data[0];
            this.$nextTick(() => {
              if (this.$refs.settingStaffRef) {
                this.$set(
                  resData,
                  "avatar",
                  commonUtils.getCookie("_A_P_avatar")
                );
                this.$refs.settingStaffRef.setFormData(resData);
              } else {
                this.$set(this.settingStaffData, "uitemplateFormData", resData);
              }
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "请求出错"
          });
        });
    },
    setUserAvatar() {
      let avatar = this.$refs.settingStaffRef.getData("psndoc").avatar;
      let submitData = {
        avatar: avatar
      };
      this.$http({
        url: "/ifbp-app-sm/sm/user/avatar",
        method: "post",
        data: submitData
      })
        .then(res => {
          if (res.data.success === true) {
            console.log("用户头像上传成功");
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "请求出错"
          });
        });
    },
    setUserData() {
      this.$refs.settingStaffRef.getFormComp().validate(valid => {
        if (valid) {
          var submitData = JSON.parse(
            JSON.stringify(this.$refs.settingStaffRef.getData("psndoc"))
          );
          // delete submitData.avatar
          this.$http({
            url: "/ifbp-app-bd/bd/psn/psndoc/update",
            method: "put",
            data: submitData
          })
            .then(res => {
              if (res.data.success) {
                this.$message({
                  message: "基本信息修改成功",
                  type: "success"
                });
                this.settingStaffEdit = false;
                this.settingStaffIcons[0].show = true;
              } else {
                this.$message({
                  message: res.data.error.errorMessage,
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: "用户信息更新失败",
                type: "error"
              });
            });
        } else {
          // 验证失败
        }
      });
    }
  }
};
</script>
<style scoped>
#sys-setting {
  position: relative;
  padding: 0 24px 0 4px !important;
  box-sizing: border-box;
}
.tab-vertical,
.setting-dialog-content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  height: 100%;
}

.setting-dialog-content {
  right: 0;
  margin-left: 164px;
}
.all-setting {
  height: 500px;
  overflow: auto;
}
</style>
<style>
.tab-vertical {
  width: 163px;
}
#sys-setting .setting-form-item:hover .el-radio .el-radio__inner {
  border-color: #5cb0e6;
}
#sys-setting .el-tabs__header {
  margin-bottom: 0px;
}
.ifbp-item-group-nav-bar {
  /* right: 11px !important; */
}
.bgcontainer {
  display: flex;
}
.bgbox {
  width: 64px;
  height: 48px;
  margin: 16px 24px;
  border: 3px solid #fff;
}
.bgbox:hover {
  border: 3px double #5cb0e6;
}
.bgbox.is-active {
  border: 3px double #5cb0e6;
}
.bgcolor-default {
  filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr='rgba(230,230,235,1)',endColorStr='rgba(240,240,245,1)',gradientType='0');
  background: -ms-linear-gradient(
    top,
    rgba(230, 230, 235, 1),
    rgba(240, 240, 245, 1)
  );
  background: -o-linear-gradient(
    top,
    rgba(230, 230, 235, 1),
    rgba(240, 240, 245, 1)
  );
  background: -webkit-gradient(
    linear,
    0% 0%,
    0% 100%,
    from(rgba(230, 230, 235, 1)),
    to(rgba(240, 240, 245, 1))
  );
}
.bgcolor-red {
  filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr='rgba(253,251,251,1)',endColorStr='rgba(235,237,238,1)',gradientType='0');
  background: -ms-linear-gradient(
    top,
    rgba(229, 229, 233, 1),
    rgba(235, 237, 238, 1)
  );
  background: -o-linear-gradient(
    top,
    rgba(229, 229, 233, 1),
    rgba(235, 237, 238, 1)
  );
  background: -webkit-gradient(
    linear,
    0% 0%,
    0% 100%,
    from(rgba(229, 229, 233, 1)),
    to(rgba(235, 237, 238, 1))
  );
}
.bgcolor-blue {
  filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr='rgba(222,233,253,1)',endColorStr='rgba(241,250,245,1)',gradientType='0');
  background: -ms-linear-gradient(
    top,
    rgba(222, 233, 253, 1),
    rgba(241, 250, 245, 1)
  );
  background: -o-linear-gradient(
    top,
    rgba(222, 233, 253, 1),
    rgba(241, 250, 245, 1)
  );
  background: -webkit-gradient(
    linear,
    0% 0%,
    0% 100%,
    from(rgba(222, 233, 253, 1)),
    to(rgba(241, 250, 245, 1))
  );
}
.bgcolor-black {
  filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr='rgba(0,0,0,1)',endColorStr='rgba(26,26,26,1)',gradientType='0');
  background: -ms-linear-gradient(top, rgba(0, 0, 0, 1), rgba(26, 26, 26, 1));
  background: -o-linear-gradient(top, rgba(0, 0, 0, 1), rgba(26, 26, 26, 1));
  background: -webkit-gradient(
    linear,
    0% 0%,
    0% 100%,
    from(rgba(0, 0, 0, 1)),
    to(rgba(26, 26, 26, 1))
  );
}
.theme-default {
  background: url("../../../../assets/images/theme/theme-default.png") no-repeat
    center center/cover;
}
.theme-red {
  background: url("../../../../assets/images/theme/theme-red.png") no-repeat center
    center/cover;
}
.theme-blue {
  background: url("../../../../assets/images/theme/theme-blue.png") no-repeat
    center center/cover;
}
.theme-green {
  background: url("../../../../assets/images/theme/theme-green.png") no-repeat
    center center/cover;
}
.theme-black {
  background: url("../../../../assets/images/theme/theme-black.png") no-repeat
    center center/cover;
}
.theme-custom {
  border: 1px #ccc dotted;
}
.expandBtn {
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  color: #2d2d2d;
  font-weight: 400;
  background: none !important;
}
.expandBtn > span {
  display: inline-block;
  height: 32px;
  line-height: 32px;
  padding: 0 16px;
  border-radius: 4px;
  text-transform: none;
  transition: box-shadow 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.expandBtn > span:active {
  box-shadow: 0 1000px 1000px 0 rgba(0, 0, 0, 0.5) inset;
}
.expandBtn > span > i {
  vertical-align: middle;
}
.normal-filebody {
  margin-bottom: 16px;
  height: 200px;
  transition: height 0.3s linear;
}
#sys-setting .upload-demo .el-upload {
  display: block;
  height: 225px !important;
  width: auto !important;
}
#sys-setting .upload-demo .el-upload-dragger .el-icon-upload {
  color: #c8c8cd;
}
#sys-setting .upload-demo .el-upload-dragger .el-upload__text {
  color: #75787b;
}
#sys-setting .upload-demo .el-upload-dragger {
  border-width: 0;
  margin: 0 auto;
}
.bgimg {
  float: left;
  width: 360px;
  height: 225px;
  margin-right: 16px;
}
.bgimg_null {
  width: 360px;
  height: 225px;
  border: 1px solid rgb(230, 230, 235);
  display: inline-block;
  text-align: center;
  line-height: 225px;
  font-size: 14px;
  color: #666666;
}
.upload-demo ul.el-upload-list.el-upload-list--text {
  display: none;
}
</style>
