<template>
  <div id="notification-sidebar" ref="notificationSidebar" :style="{'margin-top': indexFlag ? '0px' : '-8px'}">
    <div class="main-content">
      <div class="part" v-for="(item,key) in sidebarData" :key="key">
        <h3>{{item.title}}</h3>
        <div class="message-card" v-for="(value,index) in item.data" :key="index">
          <div class="title">
            <i :class="value.icon" :style="{color:value.color}"></i>
            <span class="subtitle">{{value.subtitle}}</span>
            <span class="time">{{value.time}}</span>
          </div>
          <div class="content">
            <el-tooltip class="item" effect="normal" :content="value.contenttitle" placement="top">
              <h4>{{value.contenttitle}}</h4>
            </el-tooltip>
            <el-tooltip class="item" effect="normal" :content="value.content" placement="top">
              <h6>{{value.content}}</h6>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="main-footer">
      <el-tooltip effect="normal" placement="top" content="设置" >
        <i class="ifbp-icon-setting" @click="handleSetting"></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: "notificationSidebar",
  data() {
    return {
      isShow: true,
      sidebarData: [
        {
          title: "标题1",
          data: [
            {
              subtitle: "通讯录",
              time: "下午3:00",
              icon: "ifbp-icon-assignment-ind",
              color: "#ff3b30",
              contenttitle: "用友网络科技股份有限公司30周年庆典活动",
              content: "2018年10月27日 奥林匹克体育中"
            }
          ]
        },
        {
          title: "标题2",
          data: [
            {
              subtitle: "报销",
              time: "下午3:00",
              icon: "ifbp-icon-business-reporting",
              color: "#FFCC00",
              contenttitle: "用友网络科技股份有限公司30周年庆典活动",
              content: "2018年10月27日 奥林匹克体育中"
            },
            {
              subtitle: "通讯录",
              time: "下午3:00",
              icon: "ifbp-icon-assignment-ind",
              color: "#ff3b30",
              contenttitle:
                "用友网络科技股份有限公司30周年庆典活动用友网络科技股份有限公司30周年庆典活动",
              content:
                "2018年10月27日 奥林匹克体育中2018年10月27日 奥林匹克体育中2018年10月27日 奥林匹克体育中2018年10月27日 奥林匹克体育中"
            }
          ]
        },
        {
          title: "标题3",
          data: [
            {
              subtitle: "系统更新",
              time: "下午3:00",
              icon: "ifbp-icon-settings-applications",
              color: "#75787B",
              contenttitle: "用友网络科技股份有限公司30周年庆典活动",
              content: "2018年10月27日 奥林匹克体育中"
            }
          ]
        },
        {
          title: "标题4",
          data: [
            {
              subtitle: "日程",
              time: "下午3:00",
              icon: "ifbp-icon-approve",
              color: "#E60012",
              contenttitle: "赵慧琴同意了你的请假申请",
              content: "2018年10月27日 年假"
            }
          ]
        }
      ]
    };
  },
  props: {
    // sidebarData: {
    //   type: Array,
    //   default: []
    // },
    indexFlag: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleSetting() {
      const h = this.$createElement;
      this.$msgbox({
        title: "通知",
        message: h("p", null, [
          h("span", null, "设置功能")
        ]),
        showCancelButton: true,
        confirmButtonText: "保存",
        cancelButtonText: "取消",
      }).then(action => {
        this.$message({
          type: "info",
          message: action == "confirm" ? "设置成功！" : "取消设置！"
        });
      });
    }
  }
};
</script>

<style scoped>
#notification-sidebar {
  position: absolute;
  right: 0;
  z-index: 1020 !important;
  height: 100%;
  width: 25%;
  background: rgba(210, 210, 215, 0.5);
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.25), -1px 0 0 0 #d2d2d7;
}
#notification-sidebar .main-content {
  height: calc(100% - 49px);
  position: relative;
  overflow: auto;
}
#notification-sidebar .main-content .part:last-child {
  margin-bottom: 43px;
}
#notification-sidebar h3 {
  margin-top: 22px;
  margin-left: 24px;
  margin-bottom: 14px;
  font-size: 20px;
  color: #2d2d2d;
  line-height: 20px;
  font-weight: normal;
}
#notification-sidebar .message-card {
  height: 112px;
  margin: 0 16px;
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.87);
  border: 1px solid #e6e6eb;
  border-radius: 4px;
}
#notification-sidebar .message-card .title {
  height: 24px;
  background: rgba(240, 240, 245, 0.87);
  font-size: 12px;
  color: #75787b;
  line-height: 24px;
}
#notification-sidebar .message-card .title i {
  margin-right: 6px;
  margin-left: 6px;
  line-height: 24px;
  float: left;
}
/* #notification-sidebar .message-card .title .ifbp-icon-assignment-ind {
  color: #ff3b30;
} */
#notification-sidebar .message-card .subtitle {
  font-weight: 700;
  float: left;
}
#notification-sidebar .message-card .title .time {
  float: right;
  margin-right: 16px;
}
#notification-sidebar .message-card .content {
  padding: 16px;
}
#notification-sidebar .message-card .content h4 {
  font-size: 14px;
  color: #000000;
  line-height: 16px;
  margin-bottom: 9px;
  font-weight: normal;

  /* 显示点点点 */
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#notification-sidebar .message-card .content h6 {
  font-size: 12px;
  color: #5a5a5a;
  line-height: 16px;
  font-weight: normal;

  /* 显示点点点 */
  width: 100%;
  display: -webkit-box;
  /* autoprefixer: off*/
  -webkit-box-orient: vertical;
  /* autoprefixer: on*/
  -webkit-line-clamp: 2;
  overflow: hidden;
}
#notification-sidebar .main-footer {
  width: 100%;
  padding: 16px;
  border-top: 1px solid #d2d2d7;
  position: relative;
}
#notification-sidebar .main-footer i {
  color: #75787b;
  font-size: 16px;
  vertical-align: middle;
  position: absolute;
  right: 48px;
}
/*滚动条样式*/
#notification-sidebar .main-content::-webkit-scrollbar {
  width: 0px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
#notification-sidebar .main-content::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
#notification-sidebar .main-content::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>
