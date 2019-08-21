<template>
   <div style="margin-top:8px" v-if="activeName === 'second'">
          <ifbp-panel-group :navbar="true" class="setting-panel-group" :base-scroll-top="58" :base-nav-bar-top="58">
            <ifbp-panel id='guidermodel' title="导航模式">
              <p class="desc">设置导航菜单展示方式：左侧导航是鼠标移到左上角图标区域从左侧滑出菜单，顶部导航是点击header中间的title区域在下方弹出菜单面板</p>
              <div class="setting-form">
                <div :class="['setting-form-item', {'selected': settings.navPosition === 'left'}]" @click="checkItemClick('navPosition', 'left')">
                  <img class="nav preview-img" src="@/assets/images/settings/nav-left.png?__inline" alt="左侧浮动导航">
                  <el-radio class="radio" v-model="settings.navPosition" label="left">左侧浮动导航</el-radio>
                </div>
                <div :class="['setting-form-item', {'selected': settings.navPosition === 'leftFixed'}]" @click="checkItemClick('navPosition', 'leftFixed')">
                  <img class="nav preview-img" src="@/assets/images/settings/nav-left-fixed.png?__inline" alt="左侧固定导航">
                  <el-radio class="radio" v-model="settings.navPosition" label="leftFixed">左侧固定导航</el-radio>
                </div>

                <div :class="['setting-form-item', {'selected': settings.navPosition === 'top'}]" @click="checkItemClick('navPosition', 'top')">
                  <img class="nav preview-img" src="@/assets/images/settings/nav-top.png?__inline" alt="顶部导航">
                  <el-radio class="radio" v-model="settings.navPosition" label="top">顶部导航</el-radio>
                </div>
              </div>
            </ifbp-panel>

            <ifbp-panel id='pageTabs' title="页签">
              <p class="desc">设置是否展示多页签：选中单页签后不显示多页签，选中多页签后打开过的应用以页签的形式展示在顶部</p>
              <div class="setting-form">
                <div :class="['setting-form-item', {'selected': settings.showTabs === false}]" @click="checkItemClick('showTabs', false)">
                  <img class="tab preview-img" src="@/assets/images/settings/show-tabs-no.png?__inline" alt="左侧导航">
                  <el-radio class="radio" v-model="settings.showTabs" :label="false">单页签</el-radio>
                </div>
                <div :class="['setting-form-item', {'selected': settings.showTabs === true}]" @click="checkItemClick('showTabs', true)">
                  <img class="tab preview-img" src="@/assets/images/settings/show-tabs-yes.png?__inline" alt="顶部导航">
                  <el-radio class="radio" v-model="settings.showTabs" :label="true">多页签</el-radio>
                </div>
              </div>
            </ifbp-panel>
            <ifbp-panel v-if="platform === 'fbp'" id='settingshow' title="表单显示设置">
              <div class="theme-setting">
                <el-form label-width="150px" :model="settings">
                  <el-form-item label="显示类型" inline-label="true">
                    <el-select v-model="settings.showtype" placeholder="请选择类型" style="width:100%;">
                      <el-option v-for="item in showtypeArray" :label="item.name" :value="item.code" :key="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </ifbp-panel>

            <ifbp-panel id='workhomesetting' title="工作台设置">
              <div class="theme-setting">
                <el-radio class="radio" v-model="settings.workspace" label="all">全部</el-radio>
                <el-radio class="radio" v-model="settings.workspace" label="my">我的工作台</el-radio>
                <el-radio class="radio" v-model="settings.workspace" label="role">角色工作台</el-radio>
              </div>
            </ifbp-panel>
          </ifbp-panel-group>
        </div>
</template>

<script>
export default {
  props: {
    activeName: {
      type: String,
      default: 'first'
    },
    platform: {
      type: String,
      default: 'ifbp'
    },
    setting: {
      type: Object,
      default: function (){
        return {}
      }
    }
  },
  created(){
      this.settings = this.setting;
  },
  data(){
    return {
      // settings 表中的主要字段
      settings: {
        themeCode: '',
        themeName: '',
        userId: '',
        themeId: '',
        showTabs: false, // 是否展示多页签：true or false
        navPosition: 'left', // 导航菜单位置："left" or "top"
        bannerColor: '', // banner区域背景色
        workspace: 'all',
        showtype: '', //显示类型
        startColorStr:  'rgba(230,230,235,1)',          
        endColorStr: 'rgba(240,240,245,1)',
        isPellucid: true,
        pageHeaderColor: 'rgba(255, 255, 255, 1)',
        themeColor: '',
        bgImg: ''
      },
      showtypeArray: [
        {
          code: 'table',
          name: '表格'
        },
        {
          code: 'form',
          name: '表单'
        }
      ],
    }
  },
  methods: {
    checkItemClick(key, value) {
      this.settings[key] = value;
      this.$emit("perferenceSetChange",this.settings,this.activeName);      
    },
  }
}
</script>

<style scoped>
#sys-setting .setting-form {
  display: flex;
  flex-wrap: wrap;
  /*  justify-content: center;*/
  margin-top: 15px;
}
#sys-setting .ifbp-panel-body p.desc {
  line-height: 22px;
  font-size: 14px;
  color: #666;
  padding: 6px 0;
  box-sizing: border-box;
}

#sys-setting .setting-form-item img.preview-img {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  border: 2px solid white;
  width: 300px;
  cursor: pointer;
}
#sys-setting .setting-form-item:hover img,
#sys-setting .setting-form-item.selected img {
  border-color: #5cb0e6;
}
#sys-setting .setting-form img.preview-img.nav {
  height: 178px;
}
#sys-setting .setting-form img.preview-img.tab {
  height: 82px;
}
#sys-setting .setting-form-item {
  margin: 10px;
}
#sys-setting .setting-form-item label.el-radio {
  display: block;
  text-align: center;
  margin-top: 15px;
}
#sys-setting .theme-setting {
  text-align: left;
  padding: 16px 0;
}
#sys-setting .theme-setting .el-form-item {
  max-width: 500px;
  margin: 20px auto;
}

@media screen and (max-width: 520px) {
  #sys-setting .ifbp-panel-body p.desc {
    width: 100%;
    float: none;
  }
  #sys-setting .theme-setting .el-form-item {
    margin-right: 0;
    width: 100%;
  }
}
</style>
