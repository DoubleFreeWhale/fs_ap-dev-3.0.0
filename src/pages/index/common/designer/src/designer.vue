<template>
  <div>
    <header class="designer-header">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="12">
          <el-button type="primary" @click="addWidget">新增</el-button><!-- 
        --><el-button type="primary" @click="saveWidget">保存</el-button><!--
        --><el-button type="default" @click="clearWidget">清空</el-button><!--
        --><el-button type="default" v-if="showDeleteBtn" @click="deleteWidget">删除</el-button>
        </el-col>
      </el-row>
    </header>

    <section>
      <grid-layout :layout="designerWidgets" v-if="gridLayoutFlag" :col-num="parseInt(colNum)" :row-height="rowHeight" :is-draggable="draggable" :is-resizable="resizable" :vertical-compact="true" :use-css-transforms="true">
        <grid-item v-for="item in designerWidgets" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :min-h="item.minH" :max-h="item.maxH" :min-w="item.minW" @resized="resized" @resize="resize" @moved="moved" @move="move">
          <div class="designer-widget">
            <!-- 该图层 显示组件编辑和删除按钮 -->
            <div class="designer-widget-header">
              <div class="fl"></div>
              <div class="fr">
                <a @click="editItem(item)"><i class="ifbp-icon-edit"></i></a>
                <a @click="delItem(item.id)"><i class="ifbp-icon-delete"></i></a>
              </div>
            </div>
            <!-- 组件上模态层,鼠标悬浮,显示编辑和删除 -->
            <div class="designer-widget-model"></div>
            <!-- 组件两种类型,vue的和html的; -->
            <designer-widget v-if="item.type == 'js'" :widget="item"></designer-widget>
            <div v-else :id="item.id" v-html="item.html"></div>
          </div>
        </grid-item>
      </grid-layout>
    </section>
    <!-- 对话框 新增或编辑小部件 -->
    <el-dialog :title="widgetDialogTitle" :visible="dialogOfDesiner" class="designer-widget-dialog" :before-close="handleClose">
      <!-- 普通小部件 新增/编辑 -->
      <div v-if="addOrEdit" class="widget-add-content">
        <el-row>
          <el-col :xs="8" :sm="8" :md="8" :lg="8">&nbsp;</el-col>
          <el-col :xs="16" :sm="16" :md="16" :lg="16">
            <div class="widget-search">
              <el-input placeholder="请输入查询的小部件名称" icon="search" v-model="widgetSearch" @keyup.enter.native="handleIconClick" :on-icon-click="handleIconClick">
              </el-input>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <!-- 弹出框 左侧栏 小部件组别 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" class="widget-left">
            <ul class="widget-orgs" v-if="widgetData.length > 0">
              <li class="widget-org" :class="{'widget-org-active':key == widgetOrgNum}" v-for=" (widgetOrg, key) in widgetData" :key="key" @click="getOrgWidget(widgetOrg.category,key)">
                {{ widgetOrg.categoryName }}
              </li>
            </ul>
            <div v-else>
              <p class="no-widget-org">暂无小部件分组</p>
            </div>
          </el-col>
          <!-- 弹出框 右侧栏 当前组别下的小部件 -->
          <el-col :xs="16" :sm="16" :md="16" :lg="16">
            <ul class="widget-lists" v-if="currentWidgets.length > 0">
              <li class="widget-list" :class="{'widget-active':widgetKey == widgetNum}" v-if="widget.show !== false" v-for=" (widget, widgetKey) in currentWidgets" :key="widgetKey" @click="setWidget(widget.id,widgetKey)">
                <div style="margin-top: 10px;">
                  <span class="widget-title">
                    {{ widget.name }}
                  </span>
                </div>
                <div class="widget-descr-fa">
                  <span class="widget-descr" :title="widget.descr">
                    {{ widget.descr }}
                  </span>
                </div>
              </li>
            </ul>
            <div v-else>
              <p class="no-widge">此分组暂无小部件</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 快捷小部件 新增/编辑-->
      <div v-if="!addOrEdit">
        <el-row>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" class="widget-left">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="widget-attributes">
              <el-tab-pane label="属性" name="first">
                <ul class="widget-attr">
                  <li class="widget-attribute">
                    <div>
                      <label>名称</label>
                      <div class="widget-input">
                        <el-input v-model="selectedWidgetData.name" disabled></el-input>
                      </div>
                    </div>
                  </li>
                  <li class="widget-attribute">
                    <div>
                      <label>编码</label>
                      <div class="widget-input">
                        <el-input v-model="selectedWidgetData.id" disabled></el-input>
                      </div>
                    </div>
                  </li>
                  <li class="widget-attribute">
                    <div>
                      <label>地址</label>
                      <div class="widget-input">
                        <el-input v-model="selectedWidgetData.cnf" disabled></el-input>
                      </div>
                    </div>
                  </li>
                  <li class="widget-attribute" v-for=" (item,key) in widgetAttrsOther" :key="key">
                    <div>
                      <label>{{ item.name }}</label>
                      <div class="widget-input">
                        <el-input v-model="item.value">{{ item.value }}</el-input>
                      </div>
                    </div>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="功能预置" name="second" v-if="widgetSet">
                <short-cut ref="shortCutRef" v-show="widgetSetId == 'shortcutnew'" :arr="paramsArr" @change="shortCutChange"></short-cut>
                <home-page v-show="widgetSetId == 'homePage'" @change="collectionsChange"></home-page>
              </el-tab-pane>
            </el-tabs>            
          </el-col>
          <!-- 右侧预览区 -->
          <el-col :xs="16" :sm="16" :md="16" :lg="16">
            <div class="widget-preview">
              小部件预览
            </div>
            <div style="position: relative;">
              <div class="widget-preview-model"></div>
              <div ref="widgetShow" id="widget-show" v-if="widgetShowFlag"></div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOfDesiner = false">取 消</el-button>
        <el-button type="primary" @click="sureSelectWidget">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DesignerWidget from "./designerWidget.vue";
import shortCut from "./shortCut.vue";
import homePage from "./homePage.vue";

let testLayout = [
  { x: 0, y: 0, w: 3, h: 2, i: "q", resizable: true, draggable: true },
  { x: 0, y: 0, w: 3, h: 4, i: "b", resizable: true, draggable: true },
  { x: 0, y: 0, w: 3, h: 5, i: "d", resizable: true, draggable: true },
  { x: 0, y: 0, w: 3, h: 3, i: "g", resizable: true, draggable: true }
];
export default {
  computed: {
    paramsArr(){
      return this.params.arr;
    }
  },
  watch: {},
  components: {

    DesignerWidget,
    shortCut,
    homePage
  },
  data() {
    return {
      widgetShowFlag: true,
      gridLayoutFlag: true,
      arr: [],
      params: {},
      widgetSetId: '',
      widgetSet: false,
      activeName: 'first',
      designerFlag: '',
      showDeleteBtn: false,
      widgetAttrsOther: [],
      widgetDialogTitle: "添加小部件",
      widgetNum: "",
      widgetOrgNum: "",
      designerWidgetsSaveData: [],
      designerWidgetsInit: [],
      designerWidgetsChange: [],
      widget_html_info: "",
      widgetShowHtml: "",
      selectedWidgetData: {},
      designerWidgets: [],
      widgetAddress: "",
      widgetCode: "",
      addOrEdit: true, //默认true
      selectedWidgetId: "",
      widgetSearch: "",
      cerrentWidgetOrg: "",
      searchName: "",
      dialogOfDesiner: false, //默认false
      widgets: [],
      currentWidgets: [],
      widgetData: [],
      layout: JSON.parse(JSON.stringify(testLayout)),
      draggable: true,
      resizable: true,
      mirrored: false,
      rowHeight: 48,
      rowSpace: 12,
      colNum: 12,
      id: "",
      modifyTime: "",
      layoutId: ""
    };
  },
  mounted() {
    var oThis = this;
    // let vm = this;
    this.$eventBus.$on("tabchange", (i)=>{
      setTimeout(() =>{
        if(oThis.$vnode.data.attrs.index === i && $(oThis.$el).parent().length > 0){
        // this.renderwidgetBox();
          console.log(this.$route)
          console.log(this.$router)
          const flag = this.$route.query.flag;
        this.designerFlag = flag;
        if (flag == "workbench") {
          this.showDeleteBtn = true;
        }
        this.getLayout();
        this.getWidgetArray("", false);
        this.gridLayoutFlag = true;
        this.widgetShowFlag = true;
        this.$forceUpdate();
      } else {
        this.gridLayoutFlag = false;
        this.widgetShowFlag = false;
      }
      })
      
    },500)
  },
  created() {
    const flag = this.$route.query.flag;
    this.designerFlag = flag;
    if (flag == "workbench") {
      this.showDeleteBtn = true;
    }
    this.getLayout();
    this.getWidgetArray("", false);
  },
  methods: {
    handleClose(){
      this.dialogOfDesiner = false;
    },
    shortCutChange(value){
      this.arr = value;
      this.showWidget(this.widgetSetId);
    },
    collectionsChange(value){
      this.showWidget(this.widgetSetId);
    },
    handleClick(index){

    },
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.href
        .substr(window.location.href.indexOf("?") + 1)
        .match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    // 获取
    getLayout() {
      // flag
      const flag = this.$route.query.flag;
      // 平台(判断是ifbp还是fbp)
      const platform = this.getPlatform();
      // id (layoutid)
      this.id = this.$route.query.layoutid;
      //
      this.modifyTime = this.$route.query.modify;
      // layoutId;
      this.layoutId =this.$route.query.layoutid;
      if (platform == "ifbp") {
        if (flag == "workbench") {
          $.ajax({
            url: "/wbalone/wbalyout/getUserExistLayout",
            type: "POST"
          }).then(res => {
            if (res.status === "1") {
              this.id = res.data.id;
              this.modifyTime = res.data.modify;
              this.layoutId = res.data.layoutpk;
              this.getLayoutSource(this.id, "ifbp");
            }
          });
        } else {
          this.getLayoutSource(this.id, "ifbp");
        }
      } else {
        this.getLayoutSource(this.id, "fbp");
      }
    },

    adaptScreen() {
      let that = this;
      window.onresize = function() {
        let window_width = window.innerWidth;
        if (window_width < 1000) {
          if (window_width < 798) {
            that.designerWidgetsChange.map(item => {
              item.x = 0;
              item.w = 12;
            });
            that.designerWidgets = JSON.parse(
              JSON.stringify(that.designerWidgetsChange)
            );
          } else {
            that.designerWidgets = JSON.parse(
              JSON.stringify(that.designerWidgetsInit)
            );
          }
        }
      };
    },
    // 根据 layoutId 和 对应平台,查询具体存的gridItem信息;
    getLayoutSource(id, flag) {
      let that = this;
      this.$http({
        url: "/wbalone/wbalyout/data:layoutSource/" + id,
        method: "get",
        dataType: "json"
      }).then(res => {
        let data = [];
        if (res.data.success) {
          data = JSON.parse(res.data.data.source);
          data.map( item => { // 每一个Item就是一个小部件的位置,类型信息;
            item.params.isDesigner = true;
          })
          if (data.length == 0) {
            that.$message({
              type: "error",
              message: "暂无布局"
            });
          }
        } else {
          that.$message({
            type: "error",
            message: ""
          });
        }
        //如果是 fbp的布局 就缓存一份;
        if (flag == "fbp") {
          let localStorage = window.ifbpLocalCache || window.localStorage;
          localStorage.setItem("layoutid_" + id, res.data.modifytime);
        }
        //将查询到的布局的所有小部件的信息保存;
        this.designerWidgetsInit = JSON.parse(JSON.stringify(data));
        this.designerWidgetsChange = JSON.parse(JSON.stringify(data));
        this.designerWidgets = JSON.parse(JSON.stringify(data));
        //
        this.adaptScreen();
      });
    },
    // 获取平台种类
    getPlatform: function() {
      var sRE = "(?:; )?platform=([^;]*);?";
      var oRE = new RegExp(sRE);
      var cookieValue = "ifbp";
      if (oRE.test(document.cookie)) {
        cookieValue = decodeURIComponent(RegExp["$1"]);
      }
      return cookieValue;
    },

    clearWidget() {
      this.designerWidgets = [];
      this.designerWidgetsInit = [];
      this.designerWidgetsChange = [];
    },

    deleteWidget() {
      var oThis = this;
      var url = "/wbalone/wbalyout/delPersonalLayout";
      $.ajax({
        type: "get",
        url: url,
        data: {},
        dataType: "json",
        success: function(data) {
          if (data.success) {
            oThis.$message({
              type: "success",
              message: data.message
            });
            //关闭叶签
            let app = window.vueInstance.$context.getApp();
            app.closeTabs(app.tabIndex);
          } else {
            oThis.$message({
              type: "warning",
              message: data.error.errorMessage
            });
          }
        }
      });
    },

    saveWidget() {
      let localStorage = window.ifbpLocalCache || window.localStorage;
      if (this.designerWidgets.length == 0) {
        this.$message({
          type: "warning",
          message: "请设计至少一个小部件"
        });
        return;
      }
      const flag = this.$route.query.flag;

      const platform = this.getPlatform();
      if (platform == "fbp") {
        this.modifyTime = localStorage.getItem(
          "layoutid_" + this.layoutId
        );
      }
      let content = JSON.parse(JSON.stringify(this.designerWidgets));
      content.map( item => {
        item.params.isDesigner = false;
      })
      let param = {
        biz: {},
        order: [
          {
            wbid: "",
            wid: []
          }
        ],
        templateId: "",
        layoutId: this.layoutId,
        layout: [],
        modifytime: this.modifyTime,
        content: JSON.stringify(content)
      };
      let url = "/wbalone/wbalyout/sort/save/v2";
      if (flag == "workbench") {
        url = "/wbalone/wbalyout/sort/save/user";
      }
      this.$http({
        url: url,
        method: "post",
        dataType: "json",
        headers: {
          "Content-Type": "application/json"
        },
        data: param
      })
        .then(res => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            window.appDefaultConfig.designerSaveReflash = true;
          } else {
            this.$message({
              type: "error",
              message: res.data.error.errorMessage
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "error"
          });
        });
    },

    handleIconClick() {
      this.getWidgetArray(this.widgetSearch, true, this.cerrentWidgetOrg);
    },

    initXY(widgets) {
      let data = {};
      if (widgets.length == 0) {
        data = {
          x: 0,
          y: 0
        };
        return data;
      } else {
        widgets.map(item => {
          item["yh"] = item.y + item.h + 0;
          item["xw"] = item.x + item.w + 0;
        });
        let result_widget = [];
        let max_yh = Math.max.apply(
          Math,
          widgets.map(function(o) {
            return o.yh;
          })
        );
        widgets.map(item => {
          if (item.yh == max_yh) {
            result_widget.push(item);
          }
        });
        let max_xw = Math.max.apply(
          Math,
          result_widget.map(function(o) {
            return o.xw;
          })
        );
        result_widget.map(item => {
          if (item.xw == max_xw) {
            let final_x = item.xw;
            let final_y = item.y;
            if (max_xw == 12) {
              final_x = 0;
              final_y = final_y + 7 + 0;
            }
            if (item.yh / 7 >= 1) {
              final_y = item.yh + 7 + 0;
            }
            data = {
              x: final_x,
              y: final_y
            };
          }
        });
        return data;
      }
    },
    sureSelectWidget() {
      this.setWidgetOptions(this.selectedWidgetId,this.widgetAttrsOther);
      this.setDesignerWidgetOptions(this.selectedWidgetId,this.widgetAttrsOther);
      let current_widget = this.getWidget(this.selectedWidgetId);
      if (this.addOrEdit) {
        this.widgetDialogTitle = "编辑小部件";
        this.addOrEdit = false;
        this.widgetSetId = current_widget.id;
        if(current_widget.id == 'shortcutnew'){
          this.widgetSet = true;
        } else if(current_widget.id == 'homePage') {
          if(this.getPlatform() == 'fbp'){
            this.widgetSet = true;
          } else {
            this.widgetSet = false;
          }
        } else {
          this.widgetSet = false;
        }
        this.activeName = 'first';
        setTimeout(() => {
          this.showWidget(current_widget.id);
        }, 10);
      } else {
        this.designerWidgetsSaveData = JSON.parse(
          JSON.stringify(this.designerWidgets)
        );
        //小部件创建添加宽高
        let minH = 7;
        let minW = 3;
        let h = 7;
        if (
          current_widget.id == "collection" ||
          current_widget.id == "shortcutnew"
        ) {
          minH = 2;
          h = 2;
        }
        let current_widget_cnf = current_widget.cnf.substr(0,3);
        if(current_widget_cnf != '/ap'){
          minH = 2;
        }
        if ( current_widget.id == "schedule" ) {
          minW = 6;
        }
        if(current_widget.id == "homePage"){
        	minH = 6;
        }
        let init_x_y = this.initXY(this.designerWidgetsSaveData);
        let params = {};
        params['height'] = h * this.rowHeight + (h - 1) * this.rowSpace - 100;
        params['isDesigner'] = true;
        params['w'] = minW;
        params['options'] = current_widget.options;
        if(current_widget.id == 'shortcutnew'){
          params['arr'] =  this.arr;
        } else {
          params['arr'] =  [];
        }
        let data = {
          x: init_x_y.x,
          y: init_x_y.y,
          w: 3,
          h: 7,
          minH: minH,
          minW: minW,
          i: current_widget.id,
          id: current_widget.id,
          js: current_widget.cnf,
          params: params,
          type: current_widget.wtype,
          resizable: true,
          draggable: true
        };
        if (this.designerWidgetsSaveData.length == 0) {
          this.designerWidgetsSaveData.push(data);
        } else {
          for (let i = 0; i < this.designerWidgetsSaveData.length; i++) {
            if (this.designerWidgetsSaveData[i].id == data.id) {
              //重新赋值可以修改的属性
              if(data.id == 'shortcutnew'){
                this.designerWidgetsSaveData[i]['params']['arr'] = this.arr;
              }
              break;
            } else if (i == this.designerWidgetsSaveData.length - 1) {
              this.designerWidgetsSaveData.push(data);
            }
          }
        }
        this.designerWidgets = JSON.parse(
          JSON.stringify(this.designerWidgetsSaveData)
        );
        this.designerWidgetsChange = JSON.parse(
          JSON.stringify(this.designerWidgetsSaveData)
        );
        this.designerWidgetsInit = JSON.parse(
          JSON.stringify(this.designerWidgetsSaveData)
        );
        this.dialogOfDesiner = false;
      }
    },
    showWidget(id) {
      let widget = this.getWidget(id);
      if(widget.options == 'null'){
        widget.options = '[]';
      }
      let params = {
        arr : this.arr,
        options : JSON.parse(widget.options),
        isDesigner: true
      };
      let change_widget = this.getDesignerWidget(id);
      let options = change_widget
        ? change_widget["params"]
        : params;
      if(params.options.length > 0){
        if(change_widget && change_widget["params"]['options'] == null) {
          options['options'] = params.options;
        }
      }
      options = JSON.stringify(options);
      let current_widget = change_widget ? change_widget : widget;
      let widget_js = current_widget.cnf || current_widget.js;
      let widget_html =
        '<div id="' +
        current_widget.id +
        '1"><script type="text/javascript">require(["' +
        widget_js +
        '"],function(plugin){plugin.init("' +
        current_widget.id +
        '1","' + current_widget.id +
        '1",' +
        options +
        ");})<\/script></div>";
      $("#widget-show").html(widget_html);
    },
    /**
       在新增/编辑小部件弹出框中,选中某个小部件;
     */
    setWidget(id, index) {
      this.widgetNum = index;
      this.selectedWidgetId = id;
      this.selectedWidgetData = this.getWidget(this.selectedWidgetId);
      this.widgetAttrsOther = JSON.parse(this.selectedWidgetData.options);
    },
    setWidgetOptions(id,options){
      for (let i = 0; i < this.widgets.length; i++) {
        if (this.widgets[i].id == id) {
          this.widgets[i]['options'] = JSON.stringify(options);
        }
      }
    },
    getWidget(id) {
      for (let i = 0; i < this.widgets.length; i++) {
        if (this.widgets[i].id == id) {
          return this.widgets[i];
        }
      }
    },
    getDesignerWidget(id) {
      for (let i = 0; i < this.designerWidgets.length; i++) {
        if (this.designerWidgets[i].id == id) {
          return this.designerWidgets[i];
        }
      }
    },
    setDesignerWidgetOptions(id,options) {
      for (let i = 0; i < this.designerWidgets.length; i++) {
        if (this.designerWidgets[i].id == id) {
          this.designerWidgets[i]['params']['options'] = JSON.stringify(options);
        }
      }
    },
    getOrgWidget(category, index) {
      this.widgetOrgNum = index;
      let flag = this.$route.query.flag;
      this.cerrentWidgetOrg = category;
      this.widgetData.map(item => {
        if (item.category == "wbalone") {
          item.widgetList.map(widget => {
            if (
              (flag == "workbench" || flag == "role") &&
              widget.id == "shortcutnew"
            ) {
              widget["show"] = false;
            }
            if (widget.id == "homePage" && flag == "ovp") {
              widget["show"] = false;
            }
          });
        }
        if (item.category == category) {
          this.currentWidgets = item.widgetList;
          this.setWidget(this.currentWidgets[0]["id"], 0);
        }
      });
    },
    addWidget() {
      this.addOrEdit = true;
      this.widgetDialogTitle = "新增小部件";
      this.dialogOfDesiner = true;
    },
    getCookie(cName) {
      let cStart;
      let cEnd;
      if (document.cookie.length > 0) {
        cStart = document.cookie.indexOf(cName + "=");
        if (cStart !== -1) {
          cStart = cStart + cName.length + 1;
          cEnd = document.cookie.indexOf(";", cStart);
          if (cEnd === -1) {
            cEnd = document.cookie.length;
          }
          return decodeURIComponent(document.cookie.substring(cStart, cEnd));
        }
      }
      return "";
    },

    getWidgetArray(name, isSearch, category) {
      let url = "/wbalone/role/widget/queryWidget";
      let data;
      let flag = this.$route.query.flag;
      const userId = this.getCookie("_A_P_id");
      flag = "workbench";
      data = {
        roleId: userId || "",
        name: name || "",
        type: flag,
        category: category || ""
      };
      $.ajax({
        url: url,
        async: false,
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: res => {
          if (res && res.success) {
            if (isSearch) {
              this.currentWidgets = res.data[0].widgetList;
            } else {
              this.widgetData = res.data;
              res.data.map(item => {
                this.widgets = this.widgets.concat(item.widgetList);
              });
            }
            this.getOrgWidget(res.data[0]["category"], 0);
          } else {
            this.widgetData = [];
            this.currentWidgets = [];
          }
        }
      });
    },
    //   { x: 0, y: 0, w: 3, h: 2, i: "q", resizable: true, draggable: true },
    move(id, newX, newY) {},
    moved(item, newX, newY) {
      this.moveChangeData(this.designerWidgets, item.i, newX, newX);
      this.moveChangeData(this.designerWidgetsInit, item.i, newX, newY);
    },
    moveChangeData(widgets, id, newX, newY) {
      for (let j = 0; j < widgets.length; j++) {
        if (widgets[j].id == id) {
          widgets[j]["x"] = newX;
          widgets[j]["y"] = newY;
        }
      }
    },
    resize(id, newH, newW, newHPx, newWPx) {
      let widgets = JSON.parse(JSON.stringify(this.designerWidgets));
      widgets = this.resizeSet(id, newH, newW, widgets);
      this.designerWidgets = JSON.parse(JSON.stringify(widgets));
      this.designerWidgetsChange = JSON.parse(JSON.stringify(widgets));
      this.designerWidgetsInit = JSON.parse(JSON.stringify(widgets));
    },
    resized(id, newH, newW, newHPx, newWPx) {
      let widgets = JSON.parse(JSON.stringify(this.designerWidgets));
      widgets = this.resizeSet(id, newH, newW, widgets);
      this.designerWidgets = JSON.parse(JSON.stringify(widgets));
      this.designerWidgetsChange = JSON.parse(JSON.stringify(widgets));
      this.designerWidgetsInit = JSON.parse(JSON.stringify(widgets));
    },
    resizeSet(id, newH, newW, widgets) {
      for (let j = 0; j < widgets.length; j++) {
        if (widgets[j].id == id) {
          widgets[j]["h"] = newH;
          widgets[j]["w"] = newW;
          widgets[j]["params"]["height"] =
            newH * this.rowHeight + (newH - 1) * this.rowSpace - 100;
          widgets[j]["params"]["w"] = newW;

        }
      }
      return widgets;
    },
    delItem(itemId) {
      this.delItemFun(itemId, this.designerWidgets);
      this.delItemFun(itemId, this.designerWidgetsInit);
      this.delItemFun(itemId, this.designerWidgetsChange);
    },
    delItemFun(itemId, data) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].id == itemId) {
          data.splice(j, 1);
        }
      }
    },
    editItem(item) {
      this.addOrEdit = true;
      this.dialogOfDesiner = true;
      this.widgetDialogTitle = "编辑小部件";
      this.params = this.getDesignerWidget(item.id).params;
      this.selectedWidgetId = item.id;
      this.selectedWidgetData = this.getWidget(item.id);
      this.widgetAttrsOther = JSON.parse(this.selectedWidgetData.options);
      this.sureSelectWidget();
    },
    /**
     * Add change direction button
     */
    changeDirection() {
      let documentDirection = getDocumentDir();
      let toggle = "";
      if (documentDirection === "rtl") {
        toggle = "ltr";
      } else {
        toggle = "rtl";
      }
      setDocumentDir(toggle);
    }
  }
};
</script>
<style>
.vue-grid-item{
  border:1px solid transparent;
  box-sizing:content-box;
}
.designer-widget-dialog > .el-dialog > .el-dialog__body {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 0 !important;
}
.designer-widget-dialog > .el-dialog > .el-dialog__footer {
  border-top: 1px solid #eee;
}
.widget-attributes > .el-tabs__header{
  margin-left: 0;
}
.widget-attributes > .el-tabs__content{
  margin-left: 0;
}
</style>

<style scoped>
.widget-org-active {
  background-color: #C1E5FD;
}
.designer-widget:hover > .designer-widget-header {
  display: block;
}
.designer-widget-model,
.widget-preview-model {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: white;
  z-index: 1;
  opacity: 0;
}
.designer-widget-header {
  display: none;
  position: absolute;
  height: 30px;
  line-height: 30px;
  padding: 10px 0;
  right: 0;
  z-index: 2;
  background-color:rgba(0,0,0,.5);
  width: 100%;
  bottom: 0;
}
.designer-widget-header a {
  color: white;
  cursor: pointer;
  margin-right:16px;
}
.widget-preview {
  padding: 15px;
  font-size: 16px;
  background-color: #eee;
}
#widget-show {
  padding: 15px;
  min-height: 408px;
  background-color: #eee;
}
.widget-input {
  padding-right: 10px;
  margin-top: 5px;
}
.widget-attr {
  padding-left: 10px;
  padding-right: 10px;
}
.widget-attribute {
  height: 60px;
  margin-top: 10px;
  font-size: 16px;
}
.designer-header {
  height: 50px;
  line-height: 50px;
  background-color: white;
  margin:0 14px;
}
.designer-header .el-button {
  margin-left:16px;
}
.widget-left {
  border-right: 1px solid #eee;
}
.widget-organization {
  height: 35px;
  line-height: 35px;
  padding: 10px;
  font-size: 16px;
}
.widget-search {
  height: 35px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.no-widget-org,
.no-widge {
  font-size: 16px;
  text-align: center;
  margin-top: 50px;
}
.widget-org {
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
}
.widget-lists,
.widget-orgs,
.widget-attributes {
  height: 480px;
  overflow: auto;
}
.widget-attributes {
  margin-top: -1px;
}
.widget-attr {
  /* padding-left: 15px; */
}
.widget-list {
  cursor: pointer;
  float: left;
  width: 40%;
  height: 84px;
  margin-left: 15px;
  margin-top: 15px;
  line-height: 84px;
  padding-left: 16px;
  border: 1px solid #eee;
  border-radius: 4px;
}
.widget-list:hover {
  background: rgba(243,246,249,0.50);
  border: 1px solid #F0F0F5;
  box-shadow: 0 2px 4px 0 #E2E8EF;
}
.widget-list .active {
  background: rgba(243,246,249,0.50);
  border: 1px solid #F0F0F5;
  box-shadow: 0 2px 4px 0 #E2E8EF;
}
.widget-active {
  background: rgba(243,246,249,0.50);
  border: 1px solid #F0F0F5;
  box-shadow: 0 2px 4px 0 #E2E8EF;
}
.widget-list div {
  height: 32px;
  line-height: 32px;
}
.widget-title {
  font-size: 16px;
  color: #2D2D2D;
}
 .widget-descr-fa {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
 }
.widget-descr {
  font-size: 12px;
  color: #75787B;
}
.widget-add-content {
  height: 400px;
}
</style>


