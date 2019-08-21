<template>
  <div class="yon-uitemplate" :id="'el-template' + this.tplId" >
  </div>
</template>
<script>
import Vue from "vue";
import { extend, extendExceptNull } from "@/assets/utils/extend.js";
import mixin from "./template-mixin";
import {
  addResizeListener,
  removeResizeListener
} from "ifbp-element/src/utils/resize-event";
export default {
  name: "IfbpTemplate",
  mixins: [mixin],
  props: {
    tplId: {
      type: String,
      default: (new Date().getTime() + Math.random() + "").replace(".", "")
    },
    localStorageId:{
      type: String,
      default: ''
    },
    tplCode: String,
    pkTemp: String,
    funnode: String,
    nexuskey: String,
    formCancelFun: String,
    formConfirmFun: String,
    autoCreate: {
      type: Boolean,
      default: false
    },
    showType: {
      type: String,
      default: 'table'
    },
    formPosition: {
      type: String,
      default: "ahead"
    },
    editable: {
      type: Boolean,
      default: true
    },
    tplResetFun: {
      type: Function,
      default: function($node) {
        return  $node[0].outerHTML;
      }
    },
    tplFinalResetFun: {
      type: Function,
      default: function($node) {
        return $node[0].outerHTML;
      }
    },
    tplData:{
      type: [Object, Function],
      default: function() {
        return {
          customerTplId: this.tplId
        };
      }
    },
    query_uitemplate_url: "",
    mode: "normal",
    confirmButton: {
      type: String,
      default: "保存"
    },
    confirmButtonShow: {
      type: Boolean,
      default: true
    },
    editButton: {
      type: String,
      default: "编辑"
    },
    editButtonShow: {
      type: Boolean,
      default: true
    },
    cancelButton: {
      type: String,
      default: "取消"
    },
    cancelButtonShow: {
      type: Boolean,
      default: true
    },
    deleteButton: {
      type: String,
      default: "删除"
    },
    deleteButtonShow: {
      type: Boolean,
      default: false
    },
    rowClickExpendRow: {
      type: Boolean,
      default: true
    },
    tableOperVif: {
      type: Boolean,
      default: true
    },
    tableOperColumnVif: {
      type: Boolean,
      default: true
    },
    formShowMessage: {
      type: Boolean,
      default: true
    },
    tableShowMenu: {
      type: Boolean,
      default: true
    },
    extendExceptNull: {
      type: Boolean,
      default: false
    },
    initWithDefault: {
      type: Boolean,
      default: true
    },
    editChangeShowMessage:{
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    confirmClearEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formRef: "formRef",
      formModel: "",
      tableRef: "tableRef",
      tableModel: "",
      tableFormRef: "tableFormRef",
      tableShow: true,
      formShow: false,
      editChange: false,
      resTemplate: '',
      requiredFields: [],
      requiredFieldsFlag: false,
      initFlag: false
    };
  },
  computed: {
    nowExtend() {
      return this.extendExceptNull ? extendExceptNull : extend;
    }
  },
  created() {
    if (this.ifbp_configs) {
      this.mode = this.ifbp_configs.mode || this.mode;
      this.query_uitemplate_url = this.ifbp_configs.query_uitemplate_url;
    }
    if (
      !this.funnode &&
      this.$router &&
      this.$router.currentRoute &&
      this.$router.currentRoute.query.funcode
    ) {
      this.funnode = this.$router.currentRoute.query.funcode;
    }
  },
  mounted() {
    console.log('template mounted:' + this.tplId);
    if (this.autoCreate) {
      this.init();
    }
    window[this.tplId] = this;
    this.resizeUiTpl();
    
  },
  watch: {
    showType: function() {
      this.init();
    },
    pkTemp: function() {
      this.init();
    },
    funnode: function() {
      this.init();
    },
    nexuskey: function() {
      this.init();
    },
    tplData: function(newData) {
      if (this.comp) {
        for (let i in newData) {
          this.comp[i] = newData[i];
        }
      }
    },
    formShow: function(formShow) {
      this.comp && (this.comp.formShow = formShow);
    },
    tableShow: function(tableShow) {
      this.comp && (this.comp.tableShow = tableShow);
    },
    editable: function(isEditFlag) {
      this.comp && (this.comp.editable = isEditFlag);
      this.$emit("update:editable", isEditFlag);
    },
    formShowMessage: function(formShowMessage) {
      this.comp && (this.comp.formShowMessage = formShowMessage);
    },
    confirmButton: function(confirmButton) {
      this.comp && (this.comp.confirmButton = confirmButton);
    },
    confirmButtonShow: function(confirmButtonShow) {
      this.comp && (this.comp.confirmButtonShow = confirmButtonShow);
    },
    editButton: function(editButton) {
      this.comp && (this.comp.editButton = editButton);
    },
    editButtonShow: function(editButtonShow) {
      this.comp && (this.comp.editButtonShow = editButtonShow);
    },
    cancelButton: function(cancelButton) {
      this.comp && (this.comp.cancelButton = cancelButton);
    },
    cancelButtonShow: function(cancelButtonShow) {
      this.comp && (this.comp.cancelButtonShow = cancelButtonShow);
    },
    deleteButton: function(deleteButton) {
      this.comp && (this.comp.deleteButton = deleteButton);
    },
    deleteButtonShow: function(deleteButtonShow) {
      this.comp && (this.comp.deleteButtonShow = deleteButtonShow);
    },
    tableOperVif: function(tableOperVif) {
      this.comp && (this.comp.tableOperVif = tableOperVif);
    },
    tableOperColumnVif: function(tableOperColumnVif) {
      this.comp && (this.comp.tableOperColumnVif = tableOperColumnVif);
    },
    readonly: function(readonly) {
      this.comp && (this.comp.readonly = readonly);
    }
  },
  methods: {
    resizeUiTpl() {
      // debugger;
      var offsetNum = parseInt(this.$el.offsetHeight);
      // console.log("el", this.$el);
      // console.log("height",this.$el.offsetHeight);
      if(!this.$el) {
        return;
      }
      if((this.$el.offsetHeight === 0)|| isNaN(offsetNum)) {
        // this.$el.className = "no-top";
        $(this.$el).addClass('no-top');
        // console.log(this.$el);
      } else {
        $(this.$el).removeClass('no-top');
      }
    },
    getPkTemp() {
      if (this.tplModel && this.tplModel.pk) {
        return this.tplModel.pk;
      } else {
        return this.pkTemp;
      }
    },
    // getShowType(){
    //   if (this.tplModel && this.tplModel.show_type){
    //     return this.tplModel.show_type;
    //   }else{
    //     return this.showType;
    //   }
    // },
    requestSucessFun(resp) {
      let oThis = this;
      let res = JSON.stringify(resp.data);
      res = res
        .replace(/v-select=\\"\\"/g, "")
        .replace(/v-dnd=\\"\\"/g, "")
        .replace(/v-drop=\\"\\"/g, "")
        .replace(/v-drop=\\"{muilt:true}\\"/g, "")
        .replace(/v-drop=\\"{muilt: true}\\"/g, "")
        .replace(/v-comp=\\"\\"/g, "");
      // .replace(/<el-table-column/g, "<el-table-column sortable");
      let resObj = JSON.parse(res);
      if (resObj.formVersion !== "1" && resObj.formVersion !== 1) {
        return;
      }
      // 处理dom结构
      let resTemplate = resObj.formLayout;
      let pkClass = resObj.form ? resObj.form.pkClass : "";
      this.pkClass = pkClass;
      let $dom = $(resTemplate);
      resTemplate = this.tplResetFun.call(this, $dom);
      if(!resTemplate){
        resTemplate = $dom[0].outerHTML;
      }
      $dom = $(resTemplate);
      if (this.showType === "form" || this.showType === "table-form") {
        let addEvent = function($dom, eventName) {
          $dom.each((index, nowDom) => {
            let $nowDom = $(nowDom);
            let $formItem = $nowDom.closest("el-form-item");
            let prop = $formItem.attr("prop");
            let oldEvent = $nowDom.attr("v-on:" + eventName);
            if(!oldEvent){
              if(eventName === 'change'){
                $nowDom.attr(
                  "v-on:" + eventName,
                  "function(val){var uiComp = this['" +
                    oThis.tplId +
                    "'];uiComp.comp.templateChangeFun('" +
                    prop +
                    "',val)}"
                );
              }else if(eventName === 'blur'){
                $nowDom.attr(
                  "v-on:" + eventName,
                  "function(event, val){var uiComp = this['" +
                    oThis.tplId +
                    "'];uiComp.comp.templateChangeFun('" +
                    prop +
                    "',val)}"
                );
              }else if(eventName === 'before-edit'){
                $nowDom.attr(
                  "v-on:" + eventName,
                  "function(comp, callback){var uiComp = this['" +
                    oThis.tplId +
                    "'];uiComp.comp.templateBeforeEditFun('" +
                    prop +
                    "',comp, callback)}"
                );
              }
            }
          });
        };
        let changeCompArr = [
          "el-select",
          "el-ref",
          "el-checkbox",
          "el-date-picker",
          "el-time-picker",
          "el-switch"
        ];
        for (let j = 0; j < changeCompArr.length; j++) {
          let nowComp = changeCompArr[j];
          let $nowCompDom = $dom.find(nowComp);
          addEvent($nowCompDom, 'change');
        }
        let blurCompArr = [
          "el-input",
          "el-number",
          "el-money",
          "el-percent",
          "el-textarea",
        ];
        for (let j = 0; j < blurCompArr.length; j++) {
          let nowComp = blurCompArr[j];
          let $nowCompDom = $dom.find(nowComp);
          addEvent($nowCompDom, 'blur');
        }

        let beforeEditCompArr = [
          "el-select",
          "el-ref"
        ];
        for (let j = 0; j < beforeEditCompArr.length; j++) {
          let nowComp = beforeEditCompArr[j];
          let $nowCompDom = $dom.find(nowComp);
          addEvent($nowCompDom, 'before-edit');
        }
      }

      let hasForm = $dom.find("#form_area").children().length > 0;
      let hasTable = $dom.find("#table_area").children().length > 0;
      // if (!this.showType) {
      //   if (hasForm && !hasTable) {
      //     this.showType = "form";
      //   } else if (!hasForm && hasTable) {
      //     this.showType = "table";
      //   } else if (hasForm && hasTable) {
      //     this.showType = "table-form";
      //   }
      // }

      // 删除需要隐藏的dom
      $dom.find("[hide=true]").remove();
      let defaultHideDom = $dom.find("[default-hide=true]");
      let defaultHideData = {};
      defaultHideDom.each((index,dom)=>{
        let vIf = $(dom).attr('v-if');
        defaultHideData[vIf] = false;
      })
      let tableHTML, formHTML, $tableDom, tableFormHTML;
      if (this.showType === "form" || this.showType === "table-form") {
        formHTML = $dom.find("#form_area").html();
        let $formDom = $(formHTML);
        $formDom.attr(":adaptation", "true");
        $formDom.attr("v-show", "formShow");
        $formDom.attr(":show-message", "formShowMessage");
        let nowFormRef = $formDom.attr("ref");
        if (nowFormRef) {
          this.formRef = nowFormRef;
        } else {
          $formDom.attr("ref", this.formRef);
        }
        this.formModel = $formDom.attr(":model");
        formHTML = $formDom[0].outerHTML;
        $formDom.attr("ref", this.tableFormRef);
        $formDom.removeAttr("v-show");
        tableFormHTML = $formDom[0].outerHTML;
      }
      if (this.showType === "table" || this.showType === "table-form") {
        tableHTML = $dom.find("#table_area").html();
        $tableDom = $(tableHTML);
        $tableDom.attr("v-show", "tableShow");
        let nowTableRef = $tableDom.attr("ref");
        if (nowTableRef) {
          this.tableRef = nowTableRef;
        } else {
          $tableDom.attr("ref", this.tableRef);
        }
        this.tableModel = $tableDom.attr(":data");
        $tableDom.attr("v-on:selection-change", "handleSelectionChange");
        $tableDom.attr("v-on:select-all", "handleSelectAll");
        $tableDom.attr("v-on:row-click", "handleRowClick");
        $tableDom.attr("v-on:expand", "handleExpand");

        tableHTML = $tableDom[0].outerHTML;
      }

      if (this.showType === "form") {
        resTemplate = formHTML;
        this.formShow = true;
        this.tableShow = false;
      } else if (this.showType === "table") {
        resTemplate = tableHTML;
        this.formShow = false;
        this.tableShow = true;
      } else if (this.showType === "table-form") {
        let formButtonHTML =
          '<div class="form-button-div" v-show="formShow" style="padding-bottom:16px">' +
          ' <el-button type="primary"  @click="formConfirmClick(\'form\')" v-if="editable && confirmButtonShow && !readonly">{{confirmButton}}</el-button>' +
          ' <el-button type="primary"  @click="formEditClick(\'form\')" v-if="!editable && editButtonShow && !readonly">{{editButton}}</el-button>' +
          ' <el-button  @click="formCancelClick(\'form\')" v-if="cancelButtonShow && !readonly">{{cancelButton}}</el-button>' +
          ' <el-button  @click="formDeleteClick(\'form\')" v-if="deleteButtonShow && !readonly">{{deleteButton}}</el-button>' +
          "</div>";
        let tableFormButtonHTML =
          '<div class="form-button-div" >' +
          ' <el-button type="primary"  @click="formConfirmClick(\'table-form\')" v-if="editable && confirmButtonShow && !readonly">{{confirmButton}}</el-button>' +
          ' <el-button type="primary"  @click="formEditClick(\'table-form\')" v-if="!editable && editButtonShow && !readonly">{{editButton}}</el-button>' +
          ' <el-button  @click="formCancelClick(\'table-form\')" v-if="cancelButtonShow && !readonly">{{cancelButton}}</el-button>' +
          ' <el-button  @click="formDeleteClick(\'table-form\')" v-if="deleteButtonShow && !readonly">{{deleteButton}}</el-button>' +
          "</div>";
        $tableDom.prepend(
          '<el-table-column  type="noIconExpand"><template scope="props">' +
            tableFormHTML +
            tableFormButtonHTML +
            "</template></el-table-column>"
        );
        if (this.formPosition === "ahead") {
          resTemplate =
            "<div>" +
            formHTML +
            formButtonHTML +
            $tableDom[0].outerHTML +
            "</div>";
        } else {
          resTemplate =
            "<div>" +
            $tableDom[0].outerHTML +
            // "<div style='height:20px;position:relative;'></div>" +
            formHTML.replace('el-form', 'el-form style="margin-top:20px;"') +
            formButtonHTML +
            "</div>";
        }
      }
      let $finalDom = $(resTemplate);
      resTemplate = this.tplFinalResetFun.call(this, $finalDom);
      // extend处理时如果是数组执行合并操作
      let baseData;
      if (typeof this.tplData === "function") {
        baseData = this.tplData.call(this);
      } else {
        baseData = this.tplData;
      }
      if(typeof baseData === 'undefined'){
        baseData = {}
      }
      if (baseData.uitemplateTableData) {
        baseData[this.tableModel] = baseData.uitemplateTableData;
        delete baseData.uitemplateTableData;
      }
      if (baseData.uitemplateFormData) {
        baseData[this.formModel] = baseData.uitemplateFormData;
        delete baseData.uitemplateFormData;
      }

      // 处理特殊的默认值
      let defaultValueRealValue = resObj.formData.defaultValueRealValue;
      if(defaultValueRealValue && defaultValueRealValue[this.formModel] && typeof defaultValueRealValue[this.formModel] === 'object'){
        let formRealValue = defaultValueRealValue[this.formModel];
        Object.keys(formRealValue).forEach(key => {
          if(key === 'beanMap'){
            let beanMap = formRealValue.beanMap;
            Object.keys(beanMap).forEach(beanMapKey => {
              let beanMapRealValue = beanMap[beanMapKey];
              resObj.formData[this.formModel].beanMap[beanMapKey] = eval(beanMapRealValue);
            });
          }else{
            let realValue = formRealValue[key];
            resObj.formData[this.formModel][key] = eval(realValue);
          }
        });
      }

      this.resBaseData = JSON.parse(JSON.stringify(resObj.formData));
      let resData;
      if (this.initWithDefault) {
        resData = this.nowExtend(true, {}, resObj.formData, defaultHideData, baseData, {
          editable: this.editable,
          rules: {},
          formShow: this.formShow,
          tableShow: this.tableShow,
          confirmButton: this.confirmButton,
          confirmButtonShow: this.confirmButtonShow,
          cancelButton: this.cancelButton,
          cancelButtonShow: this.cancelButtonShow,
          deleteButton: this.deleteButton,
          deleteButtonShow: this.deleteButtonShow,
          editButton: this.editButton,
          editButtonShow: this.editButtonShow,
          tableOperVif: this.tableOperVif,
          tableOperColumnVif: this.tableOperColumnVif,
          formShowMessage: this.formShowMessage,
          readonly: this.readonly
        });
      } else {
        // 将resObj.formData中formModel的字段都置为空串
        let newFormData =  JSON.parse(JSON.stringify(resObj.formData));
        let nowFormData = newFormData[this.formModel];
        for(var key in nowFormData){
          nowFormData[key] = '';
        }
        resData = this.nowExtend(true, {},newFormData,defaultHideData, baseData, {
          editable: this.editable,
          rules: {},
          formShow: this.formShow,
          tableShow: this.tableShow,
          confirmButton: this.confirmButton,
          confirmButtonShow: this.confirmButtonShow,
          cancelButton: this.cancelButton,
          cancelButtonShow: this.cancelButtonShow,
          deleteButton: this.deleteButton,
          deleteButtonShow: this.deleteButtonShow,
          editButton: this.editButton,
          editButtonShow: this.editButtonShow,
          tableOperVif: this.tableOperVif,
          tableOperColumnVif: this.tableOperColumnVif,
          formShowMessage: this.formShowMessage,
          readonly: this.readonly
        });
      }

      let localStorage = window.ifbpLocalCache || window.localStorage;
      // table增加按钮控制显示/隐藏列
      if (this.showType === "table" || this.showType === "table-form") {
        resData.transferData = [];
        resData.transferValue = [];
        const lsKey = this.getTableLocalStorageKey();
        let lsValue;
        try {
          let lsValueStr;
          if (lsKey) {
            lsValueStr = localStorage.getItem(lsKey);
          }
          if (lsValueStr && ["undefined", "null"].indexOf(lsValueStr) === -1) {
            lsValue = JSON.parse(lsValueStr);
          }
        } catch (e) {
          console.log("JSON parse error: ", e);
        }
        let $resDom = $(resTemplate);
        let $tableDom = $resDom.find("el-table");
        if ($resDom[0].localName === "el-table") {
          $tableDom = $resDom;
        }
        let $tableColumnDom = $tableDom.find("el-table-column");
        if (this.tableShowMenu) {
          $tableDom.attr(":show-menu", "true");
        }
        $tableDom.attr("v-on:table-menu-click", "tableDefaultMenuClick");
        let propsArrTmp = [];
        for (let i = 0; i < $tableColumnDom.length; i++) {
          let $nowTableCoulmn = $($tableColumnDom[i]);
          let tableColumnProp = $nowTableCoulmn.attr("prop");
          let tableColumnLabel = $nowTableCoulmn.attr("label");
          let defaultHide = $nowTableCoulmn.attr("default-hide");
          // 同时设置了prop以及label的才当做一列，需要过滤操作列、复选咧、数字列等
          // 如果自定义了是否显示则此处不再设置显示
          if (tableColumnProp && tableColumnLabel) {
            resData.transferData.push({
              label: tableColumnLabel,
              key: tableColumnProp
            });
            if (Array.isArray(lsValue)) {
              propsArrTmp.push(tableColumnProp);
            } else {
              if(defaultHide != "true"){
                resData.transferValue.push(tableColumnProp);
              }
            }
          }
        }

        // 如果本地存储不为空则取本地存储, 如果为空则存当前值
        if (Array.isArray(lsValue) && lsKey) {
          resData.transferValue = lsValue.filter(val => {
            return propsArrTmp.indexOf(val) !== -1;
          });
          for (var i = 0; i < propsArrTmp.length; i++) {
            var prop = propsArrTmp[i];
            resData["tableCoulmnVIf" + prop] =
              resData.transferValue.indexOf(prop) !== -1 ? true : false;
          }
        } else {
          localStorage.setItem(lsKey, JSON.stringify(resData.transferValue));
        }

        let transferDialogHTML =
          '<el-dialog v-model="transferVisible" :show-close="true" title="显示隐藏列" custom-class="transfer_self"> ';
        transferDialogHTML += "<el-transfer ";
        transferDialogHTML += ":titles=\"['隐藏列', '显示列']\" ";
        transferDialogHTML += 'v-model="transferValue" ';
        transferDialogHTML += ':data="transferData" ';
        transferDialogHTML += '@change="transferChange"> ';
        transferDialogHTML += "</el-transfer> ";
        transferDialogHTML += "</el-dialog> ";
        resData.transferVisible = false;
        $resDom.append(transferDialogHTML);
        resTemplate = $resDom[0].outerHTML;
      }

      this.resTemplate = resTemplate;
      let baseProps = {
        template: resTemplate,
        data: () => {
          return resData;
        }
      };
      let otherProps = this.$vnode.data.attrs;
      otherProps.methods = otherProps.methods || {};
      otherProps.methods.tableDefaultMenuClick = function() {
        this.transferVisible = true;
      };
      otherProps.methods.transferChange = function(
        value,
        direction,
        movedKeys
      ) {
        const lsKey = oThis.getTableLocalStorageKey();
        var movedKeys2 = JSON.parse(JSON.stringify(movedKeys));
        if (value.length === 0 && direction === "left") {
          this.$message("至少需显示一列！");
          var lastKey = movedKeys2.pop();
          this.transferValue.push(lastKey);
          if (lsKey) {
            localStorage.setItem(lsKey, JSON.stringify([lastKey]));
          }
        }
        for (let i = 0; i < movedKeys2.length; i++) {
          this["tableCoulmnVIf" + movedKeys2[i]] = !(direction === "left");
        }
        if (Array.isArray(value) && value.length && lsKey) {
          localStorage.setItem(lsKey, JSON.stringify(value));
        }
      };

      otherProps.methods.handleSelectionChange = function(selection) {
        oThis.$emit("selection-change", selection);
      };
      otherProps.methods.handleSelectAll = function(selection) {
        oThis.$emit("select-all", selection);
      };

      otherProps.methods.checkEditChange = function(fun){
        if(oThis.editChange){
          this.$confirm('数据已发生改变，如您离开将不会保存当前操作', '提示', {
            confirmButtonText: '离开',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            fun.call(this);
          }).catch(() => {
          });
        }else{
          fun.call(this);
        }
      }
      otherProps.methods.handleRowClick = function(row, event, column) {
        let tar = event.target;
        if (
            $(tar).closest(".el-table-column--selection").length < 1 &&
            !$(tar).hasClass("el-table-operate-icon") &&
            $(tar).closest(".el-table-column-no-click").length < 1
          ) {
          this.checkEditChange(() => {
            this.formCancelClickResetData('table-form');
            setTimeout(() =>{
              this.handleRowClickFun(row, event, column);
            })
          })
        }
      };

      otherProps.methods.handleExpand = function(row, expanded) {
        oThis.$emit("expand", row, expanded);
      };
      

      otherProps.methods.handleRowClickFun = function(row, event, column){
        oThis.editChange = false;
        let expandFlag = true;
        let tar = event.target;
        if (
          $(tar).closest(".el-table-column--selection").length < 1 &&
          !$(tar).hasClass("el-table-operate-icon") &&
          $(tar).closest(".el-table-column-no-click").length < 1
        ) {
          if (oThis.rowClickExpendRow && oThis.showType === "table-form") {
            if (oThis.getTableComp().getExpandRow() === row) {
              oThis.getTableComp().closeExpandRow();
              expandFlag = false;
              oThis.editBaseData = {};
              oThis.editIndex = -1;
              oThis.editRow = {};
            } else {
              let tableData = oThis.getTableData();
              // tableData[oThis.editIndex] = oThis.editBaseData; // 一共4条数据，删除第二条，然后点击第三条就会变成第二条数据，因此删除，出现问题再完善
              let tableIndex = tableData.indexOf(row);
              this.expandRow(row, tableIndex);
            }
            oThis.$emit("update:editable", false);
          }
          oThis.$emit("row-click", row, event, column, expandFlag);
        }
      }

      otherProps.methods.expandRow = function(row, index){
        oThis.getTableComp().expandRow(row);
        oThis.formShow = false;
        oThis.setEdit(row, index);
        oThis.setFormData(row);
      };

      otherProps.methods.getTableComp = function() {
        return this.$refs[oThis.tableRef];
      };
      otherProps.methods.getFormComp = function() {
        return this.$refs[oThis.formRef];
      };

      otherProps.methods.getTableFormComp = function() {
        return this.$refs[oThis.tableFormRef];
      };

      otherProps.methods.templateChangeFun = function(field, val) {
        // if (oThis.handleValidateFormula(field, val) === false){
        //   val = null;
        //   oThis.setFormDataByField(field, val);
        // }
        oThis.handleEditFormula(field, val);
        oThis.editChange = true;
        oThis.$emit("change", field, val);
      };

      otherProps.methods.templateBeforeEditFun = function(field, comp, callback){
        if(oThis._events['before-edit'] && oThis._events['before-edit'].length > 0){
          oThis.$emit("before-edit", field, comp, callback);
        }else{
          callback.call(comp);
        }
      };

      otherProps.methods.validate = function(callback, type) {
        let ref;
        if(!type && oThis.showType === 'table-form'){
          type = this.formShow === true? 'form': 'table-form';
        }
        if (type === "form" || !type || oThis.showType === 'form') {
          ref = oThis.formRef;
        } else {
          ref = oThis.tableFormRef;
        }
        this.$refs[ref].validate(valid => {
          if (valid){ //form验证通过后，触发验证公式
            valid = oThis.handleValidateFormula();
          }
          callback.call(this, valid);
        });
      };

      otherProps.methods.resetFields = function(type){
        let ref;
        if (type === "form" || !type) {
          ref = oThis.formRef;
        } else {
          ref = oThis.tableFormRef;
        }
        this.$refs[ref] && this.$refs[ref].resetFields();
      }

      otherProps.methods.clearErrorMessage = function(type){
        let ref;
        if (type === "form" || !type) {
          ref = oThis.formRef;
        } else {
          ref = oThis.tableFormRef;
        }
        this.$refs[ref] && this.$refs[ref].clearErrorMessage();
      }

      otherProps.methods.resetFormData = function(type) {
        // 解决点击行之后再点击新增导致行的数据丢失的问题，后续改成调用清楚校验结果的方法
        // this.resetFields();
        this[oThis.formModel] = JSON.parse(
          JSON.stringify(oThis.resBaseData[oThis.formModel])
        );
        setTimeout(() => {
          this.clearErrorMessage();
        })
      };

      otherProps.methods.getBaseFormData = function() {
        return JSON.parse(JSON.stringify(oThis.resBaseData[oThis.formModel]));
      };

      otherProps.methods.handleClick = function(icon, scope) {
        this.checkEditChange(() => {
          oThis.$emit('table-click',icon, scope);
          oThis.$emit(icon + "-table-click", scope);
        })
      };

      otherProps.methods.formCancelClickResetData = function(type) {
        if(type === 'table-form'){
          let tableData = oThis.getTableData();
          if(oThis.editBaseData){
            try{
              let data = JSON.parse(JSON.stringify(oThis.editBaseData));
              oThis.editRow = data;
              tableData[oThis.editIndex] = data;
              oThis.setTableData(tableData);
              oThis.setFormData(data);
            }catch(e){
            }
          }
          oThis.tableShow = tableData.length > 0? true: false;
        }else{
          oThis.formShow = false;
        }
        oThis.editChange = false;
      };

      otherProps.methods.formCancelClick = function(type) {
        if(type === 'table-form'){
          let tableData = oThis.getTableData();
          if(oThis.editBaseData){
            try{
              let data = JSON.parse(JSON.stringify(oThis.editBaseData));
              oThis.editRow = data;
              tableData[oThis.editIndex] = data;
              oThis.setTableData(tableData);
              oThis.getTableComp().expandRow(data);
              oThis.setFormData(data);
            }catch(e){
            }
          }
          oThis.tableShow = tableData.length > 0? true: false;
        }else{
          oThis.formShow = false;
        }
        oThis.editChange = false;
        oThis.$emit("update:editable", false);
        oThis.$emit("form-cancel-click", type, oThis.editRow);
      };

      otherProps.methods.formDeleteClick = function(type) {
        oThis.$emit("form-delete-click", type, oThis.editRow);
      };

      otherProps.methods.formConfirmClick = function(type) {
        if(oThis.confirmClearEdit){
          oThis.clearEdit();
        }
        oThis.$emit("form-confirm-click", type, oThis.editRow);
      };

      otherProps.methods.formEditClick = function(type) {
        let row = oThis.getTableComp().getExpandRow();
        let tableData = oThis.getTableData();
        let index = tableData.indexOf(row);
        oThis.setEdit(row, index);
        oThis.$emit("update:editable", true);
        oThis.$emit("form-edit-click", type, row);
      };

      let props = extend(true, {}, otherProps, baseProps);
      let comp = Vue.extend(props);
      this.comp = new comp();
      let compMount = this.comp.$mount();
      // $(this.$el).find("div[inline=true]").remove();
      // $(this.$el).find("form").remove();
      $(this.$el).html("");
      this.$el.appendChild(compMount.$el);
      addResizeListener(this.$el, this.resizeUiTpl);
      this.comp.$nextTick(() => {
        if (oThis.tplData && oThis.tplData.ifxbptxempxlatxetaxblxemxodxel) {
          oThis.setTableData(oThis.tplData.ifxbptxempxlatxetaxblxemxodxel);
          delete oThis.tplData.ifxbptxempxlatxetaxblxemxodxel;
        }
        if (oThis.tplData && oThis.tplData.ifxbptxempxlatxefoxrmxemxodxel) {
          oThis.setFormData(oThis.tplData.ifxbptxempxlatxefoxrmxemxodxel);
          delete oThis.tplData.ifxbptxempxlatxefoxrmxemxodxel;
        }
        if (oThis.tplData && oThis.tplData.doShowFormulaTypes){
          for (var key in oThis.tplData.doShowFormulaTypes){
            //var type = oThis.tplData.doShowFormulaTypes[key];
            delete oThis.tplData.doShowFormulaTypes[key];
            oThis.doShowFormula(key);
          }
        }
        oThis.$emit("after-create", oThis);
      });
    },
    init() {
      this.initFlag = true;
      this.request();
    },
    hasInit() {
      return this.initFlag;
    },
    request() {
      var oThis = this;
      if (!this._hasGetPageModel && this.$pageMgr) {
        this.$pageMgr.getPageModel(this, function(pageModel) {
          if (pageModel) {
            var tpl = pageModel.getTemplate(oThis.tplId);
            oThis.tplModel = tpl;
            if (tpl) {
              //TODO 后期不直接修改props 通过计算属性实现
              oThis.showType = tpl.show_type;
            }
          }
          oThis._hasGetPageModel = true;
          oThis.doRequest();
        });
      } else {
        this.doRequest();
      }
    },

    doRequest() {
      if(this.doRequestTimeId){
        clearTimeout(this.doRequestTimeId);
      }
      this.doRequestTimeId = setTimeout(()=>{
        this.doRequestFun();
      },300);
    },

    doRequestFun() {
      const lsKey = this.getLocalStorageKey();
      let localStorage = window.ifbpLocalCache || window.localStorage;
      if (lsKey) {
        let lsValueStr = localStorage.getItem(lsKey);
        if(lsValueStr){
          let res =  JSON.parse(lsValueStr);
          this.requestSucessFun(res);
          return;
        }
      }

      if (this.tplCode) {
        this.$http({
          url:
            "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryTemplateByCode",
          noLoading: true,
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          data: this.geturlencode(this.tplCode)
        })
          .then(res => {
            this.requestSucessFun(res);
            localStorage.setItem(lsKey, JSON.stringify(res));
          })
          .catch(res => {
            console.log("UI模板获取结构数据失败");
            console.log(res.stack);
            this.$message({
              showClose: true,
              message: "UI模板获取结构数据失败",
              type: "error"
            });
          });
      } else if (this.getPkTemp()) {
        this.$http({
          url:
            "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryTemplate?" +
            this.geturlencode({ pk_temp: this.getPkTemp() }),
          noLoading: true,
          method: "get",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        })
          .then(res => {
            this.requestSucessFun(res);
            localStorage.setItem(lsKey, JSON.stringify(res));
          })
          .catch(res => {
            console.log("UI模板获取结构数据失败");
            console.log(res.stack);
            this.$message({
              showClose: true,
              message: "UI模板获取结构数据失败",
              type: "error"
            });
          });
      } else if (this.funnode && this.nexuskey) {
        let d, url, headers, data;
        if (this.mode == "design") {
          d = {
            funcnode: this.funnode,
            nexuskey: this.nexuskey
          };
          url = this.query_uitemplate_url;
          headers = {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          };
          data = this.geturlencode(d);
        } else {
          d = {
            funnode: this.funnode,
            nexusKey: this.nexuskey
          };
          url = "/wbalone/ieoproleuitemplate/listByFunNodeAndNexusKey";
          headers = {
            "Content-Type": "application/json"
          };
          data = JSON.stringify(d);
        }
        this.$http({
          url: url,
          noLoading: true,
          method: "post",
          headers: headers,
          data: data
        })
          .then(res => {
            this.requestSucessFun(res);
            localStorage.setItem(lsKey, JSON.stringify(res));
          })
          .catch(res => {
            console.log("UI模板获取结构数据失败");
            console.log(res.stack);
            this.$message({
              showClose: true,
              message: "UI模板获取结构数据失败",
              type: "error"
            });
          });
      }
    },
    geturlencode(data) {
      let tmp = Object.keys(data);
      tmp.forEach((v, i) => {
        tmp[i] = v + "=" + data[v];
      });
      return tmp.join("&");
    },
			doShowFormula(type){
				var showFormulas = this.getData('showFormulas');
				if (showFormulas){
					if (type == this.tableModel && showFormulas.table){
						this.handleShowFormula(this.getTableData(), showFormulas.table);
					}else if (type == this.formModel && showFormulas.form){
						this.handleShowFormula(this.getFormData(), showFormulas.form);
					}
				}
			},
			setData(key, value) {
				if (this.tplData) this.tplData[key] = value;
				if (this.comp) this.comp[key] = value;
				if (this.comp){
					this.doShowFormula(key);
				}
				else{
          this.tplData = this.tplData || {};
          this.tplData.doShowFormulaTypes = this.tplData.doShowFormulaType || {}
					this.tplData.doShowFormulaTypes[key] = true;
				}
			},

    setDefaultData(key, value) {
      let newValue = this.nowExtend({}, this.resBaseData[key], value);
      this.setData(key, newValue);
    },

    setTableData(value) {
      let tableModel = this.tableModel;
      if (!tableModel) tableModel = "ifxbptxempxlatxetaxblxemxodxel";
      this.setData(tableModel, value);
    },

    setDefaultTableData(value) {
      let newValue = this.nowExtend({}, this.resBaseData[this.tableModel], value);
      this.setTableData(newValue);
    },

    setFormData(value) {
      let formModel = this.formModel;
      if (!formModel) formModel = "ifxbptxempxlatxefoxrmxemxodxel";
      this.setData(formModel, value);
    },

    setFormDataByField(field, value){
      let formData = this.getFormData();
      formData[field] = value;
      this.setFormData(formData);
    },

    setDefaultFormData(value) {
      let newValue = this.nowExtend({}, this.resBaseData[this.formModel], value);
      this.setFormData(newValue);
    },
    getData(key) {
      if (this.comp) return this.comp[key];
	    return null;
    },
    getTableData() {
      return this.getData(this.tableModel);
    },
    getFormData() {
      return this.getData(this.formModel);
    },
    getTableComp() {
      return this.comp.getTableComp();
    },
    getFormComp() {
      return this.comp.getFormComp();
    },
    getTableFormComp() {
      return this.comp.getTableFormComp();
    },
    validate(callback, type) {
      this.comp.validate(callback, type);
    },
    getRequiredFields() {
      if(!this.requiredFieldsFlag){
        let $dom = $(this.resTemplate);
        let $requiredDom = $dom.find("[\\:required='true']");
        for(var i = 0; i < $requiredDom.length;i++){
          let requiredDom = $requiredDom[i];
          let prop = $(requiredDom).attr('prop');
          if(prop){
            this.requiredFields.push(prop);
          }
        }
        this.requiredFieldsFlag = true;
      }
      return this.requiredFields;
    },
    clearEdit(){
      this.editChange = false;
      this.editIndex = -1;
      this.editBaseData = {};
    },
    setEdit(row, index){
      this.editBaseData = JSON.parse(JSON.stringify(row));
      this.editIndex = index;
      this.editRow = row;
    },

    resetFields(type) {
      this.comp.resetFields(type);
    },
    resetFormData(type) {
      this.comp.resetFormData(type);
    },
    getBaseFormData() {
      let formData = this.getFormData();
      let emptyBaseData = this.comp.getBaseFormData();
      let newBaseData = {};
      if (emptyBaseData) {
        Object.keys(emptyBaseData).forEach(key => {
          console.log(key);
          if (formData.hasOwnProperty(key)) {
            newBaseData[key] = formData[key];
          }
        });
      }
      return newBaseData;
    },
    setTransferVisible(transferVisible){
      this.comp && (this.comp.transferVisible = transferVisible);
    },
    getNodeById($node, id) {
      if (id) {
        if ($node.attr("_id") === id) {
          return $node;
        } else {
          return $node.find("[_id=" + id + "]");
        }
      }
      return null;
    },
    getTableDom($node) {
      if ($node) {
        if ($node[0].localName === "el-table") {
          return $node;
        } else {
          return $node.find("el-table");
        }
      }
    },
    getFormDom($node) {
      if ($node) {
        if ($node[0].localName === "el-form") {
          return $node;
        } else {
          return $node.find("el-form");
        }
      }
    },
    getTableIndexHtml() {
      return '<el-table-column type="index" width="50"></el-table-column>';
    },
    getTableMultiHtml() {
      return '<el-table-column type="selection" width="50"></el-table-column>';
    },

    getPkClass() {
      return this.pkClass;
    },

    expandRow(row, index){
      this.comp.expandRow(row, index);
    },

    checkEditChange(fun){
      this.comp.checkEditChange(fun);
    },

    getBaseTableOperateHtml(operateArr, fixed) {
      let baseOperateArr = [
        {
          title: "编辑",
          icon: "edit",
          vif: "tableOperVif"
        },
        {
          title: "删除",
          icon: "delete",
          vif: "tableOperVif"
        }
      ];
      let nowOperateArr = operateArr
        ? baseOperateArr.concat(operateArr)
        : baseOperateArr;
      return this.getTableOperateHtml(nowOperateArr, fixed);
    },



    getTableOperateHtml(operateArr, fixed) {
      let html = "",
        fixedStr = "";
      fixed = typeof fixed === "undefined" ? "right" : fixed;
      if (operateArr.length > 0) {
        if (fixed) {
          fixedStr = ' fixed="' + fixed + '"';
        }
        html =
          '<el-table-column label="" width="152" v-if="tableOperColumnVif && !readonly" class-name="table-operate-column" header-align="center" ' +
          fixedStr +
          '>  <template scope="scope"> ';
        for (let i = 0; i < operateArr.length; i++) {
          let oper = operateArr[i];
          let vifStr = "";
          if (oper.vif) {
            vifStr = 'v-if="' + oper.vif + '"';
          }
          // 超过4个按钮, 则第4个显示 ifbp-icon-more 及浮层
          if (operateArr.length > 4 && i === 3) {
            html += '<el-tooltip effect="light"><ul slot="content">';
            for (let j = 3; j < operateArr.length; j++) {
              let operMore = operateArr[j];
              let vifStrMore = "";
              if (operMore.vif) {
                vifStrMore = `v-if="${operMore.vif}"`;
              }
              if (operMore.click) {
                html += `
                  <li class="el-table-more-operate-item" @click.stop="${
                    operMore.click
                  }(scope)" ${vifStrMore}>
                    <i class="ifbp-icon-${
                      operMore.icon
                    } el-table-operate-icon"></i>
                    <span>${operMore.title}</span>
                  </li>
                `;
              } else {
                html += `
                  <li class="el-table-more-operate-item" @click.stop="handleClick('${
                    operMore.icon
                  }', scope)" ${vifStrMore}>
                    <i class="ifbp-icon-${
                      operMore.icon
                    } el-table-operate-icon"></i>
                    <span>${operMore.title}</span>
                  </li>
                `;
              }
            }
            html +=
              '</ul><i class="ifbp-icon-more el-table-operate-icon"></i></el-tooltip>';
            break;
          }
          if (oper.click) {
            html +=
              '<i @click.stop="' +
              oper.click +
              '(scope)" ' +
              vifStr +
              ' class="ifbp-icon-' +
              oper.icon +
              ' el-table-operate-icon"  title="' +
              oper.title +
              '"></i>';
          } else {
            html +=
              "<i @click.stop=\"handleClick('" +
              oper.icon +
              "',scope)\" " +
              vifStr +
              ' class="ifbp-icon-' +
              oper.icon +
              ' el-table-operate-icon"  title="' +
              oper.title +
              '"></i>';
          }
        }
        html += "</template></el-table-column>";
      }
      return html;
    },

    // 设置差异化属性
    setFormDiffProps($node) {
      // 获取 form jQuery element
      var $formDom = $node.find("el-form");
      // 循环给 form item 下的组件赋值 ':diff'
      $formDom.find("el-form-item").each((index, formItem) => {
        // 获取当前 form item 属性名
        var prop = formItem.getAttribute("prop");
        // 获取子节点 dom
        var childNode = formItem.children[0];
        // console.log(childNode);
        if (!childNode) {
          return true;
        }
        // 获取子节点 _id
        var childId = childNode.getAttribute("_id");
        if (!childId) {
          return true;
        }
        // 获取子节点 jQuery element
        var $child = this.getNodeById($node, childId);
        if (!$child) {
          return true;
        }
        // 设置子节点 ':diff' 属性
        $child.attr(":diff", "diffData." + prop);

        // 差异化数据中的参照, 需要传入 beanMap
        if (!$child[0] || !$child[0].tagName) {
          return true;
        }
        var renderType = $child[0].tagName.toLowerCase();
        if (!renderType || renderType !== "el-ref") {
          return true;
        }
        $child.attr(":diff-bean-map", "diffData.beanMap");
      });
    },

    // 取 cookie
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

    getLocalStorageKey() {
      const username =
        this.getCookie("usercode") ||
        this.getCookie("u_usercode") ||
        "localuser";
      let lsKey = "ifbpUITpl_" + username + "_" + this.localStorageId;
      if (this.getPkTemp()) {
        return lsKey + this.getPkTemp();
      }
      if (this.funnode && this.nexuskey) {
        return lsKey + this.funnode + "_" + this.nexuskey;
      }
      return "";
    },
    // 取当前表格 transferValue 本地存储键名
    getTableLocalStorageKey() {
      const username =
        this.getCookie("usercode") ||
        this.getCookie("u_usercode") ||
        "localuser";
      if (["table", "table-form"].indexOf(this.showType) === -1) {
        return "";
      }
      let lsKey = "ifbpUITplTable_" + username + "_" + this.localStorageId;
      if (this.getPkTemp()) {
        return lsKey + this.getPkTemp();
      }
      if (this.funnode && this.nexuskey) {
        return lsKey + this.funnode + "_" + this.nexuskey;
      }
      return "";
    },
    //根据字段获取对应组件
    getItemComp: function getItemComp(field) {
      var item = null;
      if (this.getFormComp() && this.getFormComp().$children){
        this.getFormComp().$children.forEach(function (itemComp) {
          if (itemComp.prop == field) {
            item = itemComp;
          }
        });
      }
      return item;
    },
    //处理显示公式
    handleShowFormula(oData, showFormulas){
      var data,oThis = this;
      if(!oData){
        return;
      }
      if (typeof oData === 'object' && !Array.isArray(oData) ){
        data = [oData];
      }else{
        data = oData;
      }
      function getRow(rowid){
        var r = null;
        data.forEach(function (row) {
          if (row.rowid == rowid) {
            r = row;
          }
        });
        return r;
      };
      if (!showFormulas || JSON.stringify(showFormulas) == '{}') return;
      var params = {
        formula:[],
        data:[]
      }
      // 所有显示公式中的变量合集，后期可考虑在模板保存时合并，节省处理显示公式时的计算时间
      var allVars = {},editKeys = [];
      for (var key in showFormulas){
        var formulas = showFormulas[key];
        if (formulas){
          for (var i =0; i < formulas.length; i++){
            var formula = formulas[i];
            editKeys.push(formula.originalFormula.split('->')[0]);
            params.formula.push(formula.originalFormula);
            for (var i = 0; i < formula.vars.length; i++){
              if (!allVars[formula.vars[i]]){
                allVars[formula.vars[i]] = 1;
              }
            }
          }
        }
      }
      for (var i = 0; i< data.length; i++){
        var rowid = !data[i].rowid ? data[i].rowid = Math.random().toString(36).substr(2) : data[i].rowid;
        var row = {rowid:rowid};
        for (var key in allVars){
          row[key] = data[i][key]
        }
        params.data.push(row);
      }
      this.$http({
        url:
          "/wbalone/formula/executFormulas",
        method: "post",
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        data: params
      }).then(res => {
        if (res.data.success == true){
          var resData = res.data.data;
          for (var i=0;  i< resData.length; i++){
            var newRow = resData[i];
            var rowid = newRow.rowid;
            var oldRow = getRow(rowid);
            for (var j =0 ; j < editKeys.length; j++){
              oldRow[editKeys[j]] = resData[i][editKeys[j]];
            }
          }
        }
        //如果是表格的显示公式 重新调用setTableData
        if(oThis.tableModel){
        	 data =  Object.assign([], data);
        	 oThis.comp[oThis.tableModel] = data;
        }
        data.forEach(function (row) {
	          if (row.rowid) {
	            delete row.rowid
	          }
	      });
      })
      .catch(res => {
  		data.forEach(function (row) {
          if (row.rowid) {
            delete row.rowid
          }
        });
        console.log("调用显示公式失败");
        console.log(res.stack);     
      });

    },
    //处理校验公式
    handleValidateFormula(){
      var validateFormulas =  this.getData('validateFormulas');
      if (!validateFormulas || JSON.stringify(validateFormulas)=="{}") return true;
      var validateResult, validateMsg = '';
      for (var field in validateFormulas){
        var fieldValidateFormulas = validateFormulas[field];
        fieldValidateFormulas = Array.isArray(fieldValidateFormulas) ? fieldValidateFormulas: [fieldValidateFormulas];
        var formData = this.getFormData();
        for (var i = 0; i < fieldValidateFormulas.length; i++){
          validateResult = false;
          var fieldValidateFormula = fieldValidateFormulas[i];
 			  if(!fieldValidateFormula.originalFormula){
				     this.$message({
							showClose: true,
							duration:5000,
							message: "参数"+field+"校验公式有误！",
							type: 'warning'
					});
           break;
			   }
          var validKey =  fieldValidateFormula.originalFormula.split('->')[0];
          if (!fieldValidateFormula.client){ // 后端解析
            var params = {
              formula: fieldValidateFormula.originalFormula,
              data: {}
            }
            for (var i = 0; i < fieldValidateFormula.vars.length; i++){
              params.data[fieldValidateFormula.vars[i]] = formData[fieldValidateFormula.vars[i]];
            }
            $.ajax({
              type:'POST',
              url:'/wbalone/formula/executFormula',
              async:false,
              dataType: 'json',
              contentType:'application/json',
              data: JSON.stringify(params),//this.geturlencode(params),
              success: function(res){
                if (res.success == true){
                  if (res.data[validKey] == ''){
                    validateResult = true;
                  }else{
                    validateMsg = res.data[validKey];
                  }
                }
              },error:function(e){
                console.error("调用验证公式失败");
                console.error(e);
                this.$message({
                  showClose: true,
                  message: "调用验证公式失败",
                  type: "error"
                });
              }
            })
          }else{
            var formulaJson = fieldValidateFormula.formulaFunc;
            this.formula = this.formula || new this.$Formula(formData);
            validateMsg = this.formula.formula(formulaJson);
            if (validateMsg == '') validateResult = true;
          }
          if (validateResult == false){
            if (validKey === '$Message'){
              this.$message({
                showClose: true,
                message: validateMsg,
                type: 'warning'
              });
            }else if (validKey === '$Error'){
              this.$message({
                showClose: true,
                message: validateMsg,
                type: 'error'
              });
            }else if (validKey === '$Confirm'){
              this.$confirm(validateMsg, '确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                validateResult = true;
              }).catch(() => {
              });
            }
          }
          if (validateResult == false) return validateResult;
        }
      }
      return validateResult;
    },
    //处理编辑公式
    handleEditFormula(field, val){
      var oThis = this;
      var editFormulas = this.getData('editFormulas');//this.tplData.editFormulas;
      var fieldEditFormulas = editFormulas && editFormulas[field];
      var formData = this.getFormData();
      //处理编辑公式

      if (!fieldEditFormulas) return;
      fieldEditFormulas = Array.isArray(fieldEditFormulas) ? fieldEditFormulas: [fieldEditFormulas];
      // var backendFormulas = [],frontFormulas = [],
      for (var i = 0; i < fieldEditFormulas.length; i++){
        var fieldEditFormula = fieldEditFormulas[i];
        var editKeys = [],_d = {}, editKey;
        var params = {
          formula: [],
          data: [],
          dataType: {}
        }
        editKey = fieldEditFormula.originalFormula.split('->')[0]
        if (!fieldEditFormula.client){
          // editKeys.push(fieldEditFormula.originalFormula.split('->')[0]);
          params.formula.push(fieldEditFormula.originalFormula);
          for (var i = 0; i < fieldEditFormula.vars.length; i++){
            _d[fieldEditFormula.vars[i]] = formData[fieldEditFormula.vars[i]];
            var fieldComp = this.getItemComp(fieldEditFormula.vars[i]);
            if (fieldComp){
              params.dataType[fieldEditFormula.vars[i]] = fieldComp.$children[0].$props.type;
            }
          }
          params.data.push(_d);
      	 $.ajax({
          url:"/wbalone/formula/executFormulas",
          type:'POST',
          async:false,
          dataType: 'json',
		      contentType:'application/json',
          data: JSON.stringify(params), //this.geturlencode(params)
          success: function(res){
	          if (res.success == true) {
	            var resData = res.data[0];
	            // for (var i =0 ; i < editKeys.length; i++){
              var oldValue = formData[editKey];
              formData[editKey] = resData[editKey];
              if (oldValue !== formData[editKey]){
                oThis.$emit("change", editKey, formData[editKey]);
              }
	            // }
		        }
	        },
	        error:function(res){
	          console.error("调用编辑公式失败");
	          console.error(res.stack);
	          this.$message({
	            showClose: true,
	            message: "调用编辑公式失败",
	            type: "error"
	          })
	        }
          })
        }else{ //前端直接解析
            var formulaJson = fieldEditFormula.formulaFunc;
            // var formulaJson = fieldEditFormula.formulaFunc;
            this.formula = this.formula || new this.$Formula();
            this.formula.dataModel = formData;
            var oldValue = formData[editKey];
            this.formula.formula(formulaJson);
            var newValue = formData[editKey];
            if (oldValue !== newValue){
              oThis.$emit("change", editKey, newValue);
            }
        }
      }
    }
  }
};
</script>
<style>
</style>
