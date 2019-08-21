<template>
  <ifbp-panel-group v-if="activeName === 'four'" style="margin-top:8px;" :navbar="true" class="setting-panel-group" :base-scroll-top="58" :base-nav-bar-top="58">
          <ifbp-panel id="pagebg" title="默认主题" :main-title="true" :toggle-show="false">
            <div class="bgcontainer">
              <div v-for="(item,index) in themeColorArr" :key="index">
                <div @click="setThemeColor(item)" :class="['bgbox',item.themeclass,{'is-active': themeActiveIndex == index}]">
                </div>
                <div style="margin:16px auto;text-align:center;">{{item.themeName}}</div>
              </div>
            </div>
          </ifbp-panel>   
          <div class="expandBtn ifbp-panel" @click="togglePanel">
            <span>高级<i style="margin-left:16px;" :class="[isExpand?'ifbp-icon-caret-up':'ifbp-icon-caret-down']"></i></span>            
          </div>      
          <ifbp-panel v-if="isExpand" id="pagebg" title="页面背景色" :main-title="true" :toggle-show="false">
            <div class="bgcontainer">
              <div @click="setActiveBg(item)" :class="['bgbox',item.bgclass,{'is-active': bgActiveIndex == index}]" v-for="(item,index) in bgColorArr" :key="index">
              </div>
            </div>
          </ifbp-panel>
          <ifbp-panel v-if="isExpand" id="pageHeaderbg" title="全局页眉背景" :main-title="true" :toggle-show="false">
            <span style="font-size: 14px;margin-right: 8px;color: #666666;">透明</span>
            <el-radio class="radio" v-model="settings.isPellucid" :label=true>是</el-radio>
            <el-radio class="radio" v-model="settings.isPellucid" :label=false>否</el-radio>
            <span style="font-size: 14px;margin-right: 8px;margin-left:48px;color: #666666;">选择颜色</span>
            <div style="display: inline-block;margin-top: 16px;">
              <ifbp-color-picker v-model="settings.pageHeaderColor" show-alpha @change="changeColor"></ifbp-color-picker>
            </div>
          </ifbp-panel>
          <ifbp-panel v-if="isExpand" id="themebgimg" title="页面背景图" :main-title="true" :toggle-show="false">
            <div style="margin-bottom: 100px;margin-top: 16px;">
              <div class="bgimg">
                <img :src="settings.bgImg" v-if="settings.bgImg" style=" width: 360px;height: 225px;border: 1px solid #F0F0F5;" />
                <div v-else class='bgimg_null'>
                  <span>请上传背景图片</span>
                </div>

                <div v-if="settings.bgImg" class='bgimg_null_delete'>
                  <i class="el-icon-delete" title='删除' style="font-size: 24px;cursor: pointer;" @click="handleRemove()"></i>

                </div>
              </div>
              <div class='normal-filebody'>
                <el-upload class="upload-demo" drag :action="action" :on-success="handleSuccess" :before-upload="beforeAvatarUpload" multiple>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">拖放文件至此以上传,图片小于150kb</div>
                </el-upload>
              </div>
            </div>
          </ifbp-panel>
        </ifbp-panel-group>
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
  data() {
    return {
      isExpand:false,
      customTheme:true,
      action: '/ifbp-app-bd/bd/psn/psndoc/avatarImgUpload',
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
      themeColorArr: [
        {
          themeclass: 'theme-default',
          bgColor: 'rgba(255,255,255,1)',
          themeName: '灰色'
        },
        {
          themeclass: 'theme-red',
          bgColor: 'rgba(230,0,18,1)',
          themeName: '红色'
        },
        {
          themeclass: 'theme-blue',
          bgColor: 'rgba(55,118,181,1)',
          themeName: '蓝色'
        },
        {
          themeclass: 'theme-green',
          bgColor: 'rgba(68,160,127,1)',
          themeName: '绿色'
        },
        {
          themeclass: 'theme-black',
          bgColor: 'rgba(25,25,25,1)',
          themeName: '黑色'
        },
        {
          themeclass: 'theme-custom', 
          bgColor: 'custom',      
          themeName: '自定义'
        }
      ],
      bgColorArr: [
        {
          bgclass: 'bgcolor-default',
          startColorStr: 'rgba(230,230,235,1)',
          endColorStr: 'rgba(240,240,245,1)'
        },
        {
          bgclass: 'bgcolor-red',
          startColorStr: 'rgba(253,251,251,1)',
          endColorStr: 'rgba(235,237,238,1)'
        },
        {
          bgclass: 'bgcolor-blue',
          startColorStr: 'rgba(222,233,253,1)',
          endColorStr: 'rgba(241,250,245,1)'
        },
        {
          bgclass: 'bgcolor-black',
          startColorStr: 'rgba(0,0,0,1)',
          endColorStr: 'rgba(26,26,26,1)'
        }
      ],
      themeRef: {
        'theme-default':0,
        'theme-red': 1,
        'theme-blue': 2,
        'theme-black': 3,
        'theme-green': 1
      }
    }
  },
  created(){
      this.settings = this.setting;
  },
   watch:{
    settings: {
      handler(newVal,oldVal) {
        if(newVal.isPellucid !== oldVal.isPellucid){
          this.customTheme = false;
        }
        this.themeSetChange();
      },
      deep: true
    }
  },
  computed: {
    bgActiveIndex() {
      var inx = 0
      this.bgColorArr.map((bg, index) => {
        if (
          bg.startColorStr == this.settings.startColorStr &&
          bg.endColorStr == this.settings.endColorStr
        ) {
          inx = index
        }
      })
      return inx
    },
    themeActiveIndex() {      
      let inx = 0
      if(this.customTheme){
        this.themeColorArr.map((bg, index) => {        
          if (bg.bgColor == this.settings.themeColor) {
            inx = index
          }
        })
      }else{        
        inx = this.themeColorArr.length - 1;
      }
      return inx
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/gif' ||
        file.type === 'image/png'
      const isLt2M = file.size / 1024 <= 150

      if (!isJPG) {
        this.$message.error('请上传正确格式的图片！')
      }
      /*  if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 150kb');
        }*/
      return isJPG /* && isLt2M*/
    },
    handleSuccess(response, file, fileLis) {
      if (response.success) {
        this.customTheme = false;        
        this.settings.bgImg =
          '/ifbp-app-bd/bd/psn/psndoc/avatarImgDownLoad?avatar=' + response.data;
      }
    },
    handleRemove() {
      this.settings.bgImg = ''
    },
    changeColor(val) {
      this.customTheme = false;      
      this.settings.pageHeaderColor = val.replace(/rgba/, 'rgba')
    },
    //显示主题高级设置面板
    togglePanel(){
      this.isExpand = !this.isExpand;      
    },
    setActiveBg(item) {        
      this.customTheme = false;
      this.settings.startColorStr = item.startColorStr;
      this.settings.endColorStr = item.endColorStr;
    },
    setThemeColor(item) {            
      if(item.bgColor!== 'custom'){        
        this.settings.themeColor = item.bgColor;      
        var index = this.themeRef[item.themeclass];
        this.settings.isPellucid = false;
        this.setActiveBg(this.bgColorArr[index]);
        this.settings.pageHeaderColor = item.bgColor;
        this.customTheme = true;        
      }else{
        this.customTheme = false;        
      }
    },
    themeSetChange(){
      this.$emit("perferenceSetChange",{
        settings: this.settings,
        customTheme: this.customTheme,
      });      
    }
  }
}
</script>

<style>

</style>
