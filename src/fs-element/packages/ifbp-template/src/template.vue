<template>
    <div class="yon-uitemplate" :id="'el-template' + this.computedTplId">
    </div>
</template>
<script>
    import Vue from "vue";
    import {extend, extendExceptNull} from "fs-element/src/utils/extend.js";
    import mixin from "./template-mixin";
    import {
        addResizeListener,
        removeResizeListener
    } from "ifbp-element/src/utils/resize-event";
    import {IsPC} from 'ifbp-element/src/utils/util';

    export default {
        name: "IfbpTemplate",
        mixins: [mixin],
        props: {
            tplId: {
                type: String,
                default: (new Date().getTime() + Math.random() + "").replace(".", "")
            },
            localStorageId: {
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
                default: true
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
                default: function ($node) {
                    let str = $node[0].outerHTML;
                    return str;
                }
            },
            tplFinalResetFun: {
                type: Function,
                default: function ($node) {
                    let str = $node[0].outerHTML;
                    return str;
                }
            },
            tplData: {
                // type: [Object, Function],
                // default: function() {
                // 	return {
                // 		customerTplId: this.computedTplId
                // 	};
                // }
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
            editChangeShowMessage: {
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
            },
            vueProps: {
                // 此属性只是为了提供给动态组件使用
            },
            columnUseCache: {
                type: Boolean,
                default: true
            },
            operateArr: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            contentHeaderTitle: {
                type: String
            }
            // ifbpIconShow:{
            //   type:Boolean,
            //   default:true
            // }
        },
        data() {
            return {
                IsPC: IsPC(),
                formRef: "formRef",
                formModel: "",
                tableRef: "tableRef",
                tableModel: "",
                tableFormRef: "tableFormRef",
                tableShow: undefined,
                formShow: undefined,
                editChange: false,
                resTemplate: '',
                requiredFields: [],
                requiredFieldsFlag: false,
                initFlag: false,
                nowVersion: '2',
                resTplBackup: '', // resTemplate 备份
                resDataBackup: null, // resData 备份
                resBaseMethods: null,
                ifbpIconShow: true,
                firstShowType: '',
                newtplData:null,
            };
        },
        computed: {
            tplDatause(){
                return this.tplData||this.newtplData
            },
            nowfunnode() {
                let str = this.funnode;
                if (!this.funnode &&
                    this.$router &&
                    this.$router.currentRoute &&
                    this.$router.currentRoute.query.funcode
                ) {
                    str = this.$router.currentRoute.query.funcode;
                }
                return str
            },
            nowExtend() {
                return this.extendExceptNull ? extendExceptNull : extend;
            },
            myShowType() {
                return this.firstShowType || this.showType
            }
        },
        created() {
            if (this.ifbp_configs) {
                this.mode = this.ifbp_configs.mode || this.mode;
                this.query_uitemplate_url = this.ifbp_configs.query_uitemplate_url;
            }
            this.computedTplId = this.tplId + this.tplCode + this.pkTemp + this.funnode + this.nexuskey;
            this.$emit('tplisok')
        },
        mounted() {
            // console.log('template mounted:' + this.tplId);
            let pageMixinAutoCreate = false;
            let nowComp = this;
            while (nowComp.$parent) {
                if (nowComp.$parent.pageMixinAutoCreate) {
                    pageMixinAutoCreate = true;
                    break;
                } else {
                    nowComp = nowComp.$parent;
                }
            }
            if (this.autoCreate && !pageMixinAutoCreate) {
                this.init();
            }
            window[this.computedTplId] = this;
            this.resizeUiTpl();

        },
        beforeDestroy() {
            delete window[this.computedTplId];
            // this.renderTpl = null;
            // this.comp.$options.data = null;
            // this.comp.$options.methods = null;
            this.destroyComp();
            removeResizeListener(this.$el, this.resizeUiTpl);
            if (this._watcher) {
                this._watcher.teardown()
            }
            let i = this._watchers.length
            while (i--) {
                this._watchers[i].teardown()
            }
            // remove reference from data ob
            // frozen object may not have observer.
            if (this._data.__ob__) {
                this._data.__ob__.vmCount--
            }
            this.$off();
        },
        watch: {
            tplId: function () {
                this.init();
            },
            myShowType: function () {
                this.init();
            },
            pkTemp: function () {
                if (this.tplCode) {
                } else if (this.getPkTemp()) {
                    this.init();
                } else if (this.nowfunnode && this.nexuskey) {
                }
            },
            nowfunnode: function () {
                if (this.tplCode) {
                } else if (this.getPkTemp()) {
                } else if (this.nowfunnode && this.nexuskey) {
                    this.init();
                }
            },
            nexuskey: function () {
                if (this.tplCode) {
                } else if (this.getPkTemp()) {
                } else if (this.nowfunnode && this.nexuskey) {
                    this.init();
                }
            },
            tplDatause: function (newData) {
                console.log(newData);
                if (this.comp) {
                    for (let i in newData) {
                        this.comp[i] = newData[i];
                    }
                }
            },
            formShow: function (formShow) {
                this.comp && (this.comp.formShow = formShow);
            },
            tableShow: function (tableShow) {
                this.comp && (this.comp.tableShow = tableShow);
            },
            editable: function (isEditFlag) {
                this.comp && (this.comp.editable = isEditFlag);
                this.$emit("update:editable", isEditFlag);
            },
            formShowMessage: function (formShowMessage) {
                this.comp && (this.comp.formShowMessage = formShowMessage);
            },
            confirmButton: function (confirmButton) {
                this.comp && (this.comp.confirmButton = confirmButton);
            },
            confirmButtonShow: function (confirmButtonShow) {
                this.comp && (this.comp.confirmButtonShow = confirmButtonShow);
            },
            editButton: function (editButton) {
                this.comp && (this.comp.editButton = editButton);
            },
            editButtonShow: function (editButtonShow) {
                this.comp && (this.comp.editButtonShow = editButtonShow);
            },
            cancelButton: function (cancelButton) {
                this.comp && (this.comp.cancelButton = cancelButton);
            },
            cancelButtonShow: function (cancelButtonShow) {
                this.comp && (this.comp.cancelButtonShow = cancelButtonShow);
            },
            deleteButton: function (deleteButton) {
                this.comp && (this.comp.deleteButton = deleteButton);
            },
            deleteButtonShow: function (deleteButtonShow) {
                this.comp && (this.comp.deleteButtonShow = deleteButtonShow);
            },
            tableOperVif: function (tableOperVif) {
                this.comp && (this.comp.tableOperVif = tableOperVif);
            },
            tableOperColumnVif: function (tableOperColumnVif) {
                this.comp && (this.comp.tableOperColumnVif = tableOperColumnVif);
            },
            readonly: function (readonly) {
                this.comp && (this.comp.readonly = readonly);
            },
            contentHeaderTitle: function (contentHeaderTitle) {
                this.comp && (this.comp.contentHeaderTitle = contentHeaderTitle);
            }
        },
        methods: {
            destroyComp() {
                if (this.comp && typeof this.comp.$destroy === 'function') {
                    this.comp.$destroy();
                    this.comp.$options = null;
                    this.comp.constructor.extendOptions = null;
                    this.comp.constructor.sealedOptions = null;
                    this.comp.constructor.options = null;
                    this.comp.constructor = null;
                    this.comp.templateChangeFun = null;
                    this.comp.templateValueChangeFun = null;
                    this.comp.templateBeforeEditFun = null;
                    this.comp.checkEditChange = null;
                    this.comp.tableDefaultMenuClick = null;
                    this.comp.transferChange = null;
                    this.comp.handleSelectionChange = null;
                    this.comp.handleRowClick = null;
                    this.comp.handleExpand = null;
                    this.comp.handleTableDataChange = null;
                    this.comp.handleRowClickFun = null;
                    this.comp.expandRow = null;
                    this.comp.getTableComp = null;
                    this.comp.getFormComp = null;
                    this.comp.getTableFormComp = null;
                    this.comp.validate = null;
                    this.comp.doValidateFormula = null;
                    this.comp.resetFields = null;
                    this.comp.clearErrorMessage = null;
                    this.comp.resetFormData = null;
                    this.comp.getBaseFormData = null;
                    this.comp.handleClick = null;
                    this.comp.formCancelClickResetData = null;
                    this.comp.formCancelClick = null;
                    this.comp.formDeleteClick = null;
                    this.comp.formConfirmClick = null;
                    this.comp.formEditClick = null;
                    this.comp.handleSelectAll = null;
                    delete this.comp;
                }
            },
            resizeUiTpl() {
                // ;
                var offsetNum = parseInt(this.$el.offsetHeight);
                // console.log("el", this.$el);
                // console.log("height",this.$el.offsetHeight);
                if (!this.$el) {
                    return;
                }
                if ((this.$el.offsetHeight === 0) || isNaN(offsetNum)) {
                    // this.$el.className = "no-top";
                    $(this.$el).addClass('no-top');
                    // console.log(this.$el);
                } else {
                    $(this.$el).removeClass('no-top');
                }
            },
            getPkTemp() {
                if (this.tplModel && this.tplModel.template_id) {
                    return this.tplModel.template_id;
                } else {
                    return this.pkTemp;
                }
            },
            requestSucessFun(resp) {
                if (!this.$vnode) {
                    return;
                }
                let oThis = this;
                let res = JSON.stringify(resp.data);
                let localStorage = window.ifbpLocalCache || window.localStorage;
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
                resTemplate = resTemplate.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                let pkClass = resObj.form ? resObj.form.pkClass : "";
                this.pkClass = pkClass;
                let $dom = $(resTemplate);
                resTemplate = this.tplResetFun.call(this, $dom);
                if (!resTemplate) {
                    resTemplate = $dom[0].outerHTML;
                }
                $dom = $(resTemplate);
                if (this.myShowType === "form" || this.myShowType === "table-form") {
                    let addEvent = function ($dom, eventName) {
                        $dom.each((index, nowDom) => {
                            let $nowDom = $(nowDom);
                            let $formItem = $nowDom.closest("el-form-item");
                            let prop = $formItem.attr("prop");
                            let oldEvent = $nowDom.attr("v-on:" + eventName);
                            if (!oldEvent) {
                                if (eventName === 'change') {
                                    $nowDom.attr(
                                        "v-on:" + eventName,
                                        "function(val, obj){var uiComp = this['" +
                                        oThis.computedTplId +
                                        "'];uiComp.comp.templateChangeFun('" +
                                        prop +
                                        "',val, obj)}"
                                    );
                                } else if (eventName === 'valueChange') {
                                    $nowDom.attr(
                                        "v-on:valuechange",
                                        "function(val){var uiComp = this['" +
                                        oThis.computedTplId +
                                        "'];uiComp.comp.templateValueChangeFun('" +
                                        prop +
                                        "',val)}"
                                    );
                                } else if (eventName === 'blur') {
                                    $nowDom.attr(
                                        "v-on:" + eventName,
                                        "function(event, val){var uiComp = this['" +
                                        oThis.computedTplId +
                                        "'];uiComp.comp.templateChangeFun('" +
                                        prop +
                                        "',val)}"
                                    );
                                } else if (eventName === 'before-edit') {
                                    $nowDom.attr(
                                        "v-on:" + eventName,
                                        "function(comp, callback){var uiComp = this['" +
                                        oThis.computedTplId +
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
                        "el-switch",
                        "el-radio-group"
                    ];
                    for (let j = 0; j < changeCompArr.length; j++) {
                        let nowComp = changeCompArr[j];
                        let $nowCompDom = $dom.find(nowComp);
                        addEvent($nowCompDom, 'valueChange');
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
                        addEvent($nowCompDom, 'valueChange');
                        addEvent($nowCompDom, 'blur');

                    }

                    let beforeEditCompArr = [
                        "el-select",
                        "el-ref"
                    ];
                    for (let j = 0; j < beforeEditCompArr.length; j++) {
                        let nowComp = beforeEditCompArr[j];
                        let $nowCompDom = $dom.find(nowComp);
                        addEvent($nowCompDom, 'valueChange');
                        addEvent($nowCompDom, 'before-edit');
                    }
                }

                let hasForm = $dom.find("#form_area").children().length > 0;
                let hasTable = $dom.find("#table_area").children().length > 0;

                // 删除需要隐藏的dom
                $dom.find("[hide=true]").remove();
                let defaultHideDom = $dom.find("[default-hide=true]");
                let defaultHideData = {};
                defaultHideDom.each((index, dom) => {
                    let vIf = $(dom).attr('v-if');
                    defaultHideData[vIf] = false;
                })
                let tableHTML, formHTML, $tableDom, tableFormHTML;
                if (this.myShowType === "form" || this.myShowType === "table-form") {
                    formHTML = $dom.find("#form_area").html();
                    let $formDom = $(formHTML);
                    $formDom.attr(":adaptation", "true");
                    if (this.IsPC) {
                        $formDom.attr("v-show", "formShow");
                    }
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
                if (this.myShowType === "table" || this.myShowType === "table-form") {
                    tableHTML = $dom.find("#table_area").html();
                    $tableDom = $(tableHTML);
                    $tableDom.attr(':slot-row-fun', 'ifbpMobileTableSlotRowFun');
                    $tableDom.attr(':operate-arr', 'ifbpMobileOperateArr');
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
                    $tableDom.attr("v-on:data-change", "handleTableDataChange");
                    $tableDom.find('el-table-column').each(function () {
                        let a=$(this).attr('width');
                        if(a){
                            $(this).attr('min-width',a);
                            $(this).removeAttr('width')
                        }
                    });
                    debugger
                    tableHTML = $tableDom[0].outerHTML;
                }

                if (this.myShowType === "form") {
                    resTemplate = formHTML;
                    this.formShow = typeof this.formShow === 'undefined' ? true : this.formShow;
                    this.tableShow = typeof this.tableShow === 'undefined' ? false : this.tableShow;
                } else if (this.myShowType === "table") {
                    resTemplate = tableHTML;
                    this.formShow = typeof this.formShow === 'undefined' ? false : this.formShow;
                    this.tableShow = typeof this.tableShow === 'undefined' ? true : this.tableShow;
                } else if (this.myShowType === "table-form") {
                    this.formShow = typeof this.formShow === 'undefined' ? false : this.formShow;
                    this.tableShow = typeof this.tableShow === 'undefined' ? true : this.tableShow;
                    if (this.IsPC) {
                        let formButtonHTML =
                            '<div class="form-button-div" v-show="formShow"  :class="[tableShow?\'paddingBottom16\':\'\']">' +
                            ' <el-button type="primary"  @click="formConfirmClick(\'form\')" v-if="editable && confirmButtonShow && !readonly">{{confirmButton}}</el-button>' +
                            ' <el-button type="primary"  @click="formEditClick(\'form\')" v-if="!editable && editButtonShow && !readonly">{{editButton}}</el-button>' +
                            ' <el-button  @click="formCancelClick(\'form\')" v-if="cancelButtonShow && !readonly">{{cancelButton}}</el-button>' +
                            ' <el-button  @click="formDeleteClick(\'form\')" v-if="deleteButtonShow && !readonly">{{deleteButton}}</el-button>' +
                            "</div>";
                        let tableFormButtonHTML =
                            '<div class="form-button-div" >' +
                            ' <el-button type="primary"  @click="formConfirmClick(\'table-form\',props.row)" v-if="editable && confirmButtonShow && !readonly">{{confirmButton}}</el-button>' +
                            ' <el-button type="primary"  @click="formEditClick(\'table-form\',props.row)" v-if="!editable && editButtonShow && !readonly">{{editButton}}</el-button>' +
                            ' <el-button  @click="formCancelClick(\'table-form\',props.row)" v-if="cancelButtonShow && !readonly">{{cancelButton}}</el-button>' +
                            ' <el-button  @click="formDeleteClick(\'table-form\',props.row)" v-if="deleteButtonShow && !readonly">{{deleteButton}}</el-button>' +
                            "</div>";
                        $tableDom.append(
                            '<el-table-column  type="expand" width="0" min-width="0"><template slot-scope="props">' +
                            tableFormHTML +
                            tableFormButtonHTML +
                            "</template></el-table-column>"
                        );

                        let $addForm = $(formHTML);
                        $addForm.addClass('template-add-form');
                        $tableDom.attr(":span-method","arraySpanMethod");
                        let addFormHTML = $addForm[0].outerHTML;
                        if (this.formPosition === "ahead") {
                            resTemplate =
                                "<div>" +
                                addFormHTML +
                                formButtonHTML +
                                $tableDom[0].outerHTML +
                                "</div>";
                        } else {
                            resTemplate =
                                "<div>" +
                                $tableDom[0].outerHTML +
                                // "<div style='height:20px;position:relative;'></div>" +
                                addFormHTML.replace('el-form', 'el-form style="margin-top:20px;"') +
                                formButtonHTML +
                                "</div>";
                        }
                    } else {
                        resTemplate = "<div>" +
                            "<ifbp-content id='" + this.tplId + "ifbpContent'>" +
                            "<ifbp-top-navbar :title='contentHeaderTitle' slot='header' :back-click='topNavBarClick'>" +
                            "	<template slot='rightBtns'>" +
                            "    <span v-if='editable && confirmButtonShow && !readonly' @click='formConfirmClick(\"form\")'>{{confirmButton}}</span>" +
                            "	</template>" +
                            "</ifbp-top-navbar>" +
                            formHTML +
                            "</ifbp-content>" +
                            $tableDom[0].outerHTML +
                            "</div>";
                    }

                }
                let $finalDom = $(resTemplate);
                resTemplate = this.tplFinalResetFun.call(this, $finalDom);
                // extend处理时如果是数组执行合并操作
                let baseData;
                if (typeof this.tplDatause === "function") {
                    baseData = this.tplDatause.call(this);
                } else {
                    baseData = this.tplDatause;
                }
                baseData=baseData?baseData:{};
                // if (!baseData) {
                //     baseData = {}
                // }
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
                if (defaultValueRealValue && defaultValueRealValue[this.formModel] && typeof defaultValueRealValue[this.formModel] === 'object') {
                    let formRealValue = defaultValueRealValue[this.formModel];
                    Object.keys(formRealValue).forEach(key => {
                        if (key === 'beanMap') {
                            let beanMap = formRealValue.beanMap;
                            Object.keys(beanMap).forEach(beanMapKey => {
                                let beanMapRealValue = beanMap[beanMapKey];
                                resObj.formData[this.formModel].beanMap[beanMapKey] = eval(beanMapRealValue);
                            });
                        } else {
                            let realValue = formRealValue[key];
                            resObj.formData[this.formModel][key] = eval(realValue);
                        }
                    });
                }
                this.resBaseData = JSON.parse(JSON.stringify(resObj.formData));
                if (resObj.formMethods) {
                    this.resBaseMethods = JSON.parse(JSON.stringify(resObj.formMethods));
                }
                let resData;
                let ifbpMobileTableSlotRowFun = this.$scopedSlots.row || null;

                for (let i = 0; i < this.operateArr.length; i++) {
                    let nowOperate = this.operateArr[i];
                    let nowClick = nowOperate.click;
                    if (!nowClick) {
                        nowOperate.click = (scope) => {
                            this.comp.handleClick(nowOperate.icon, scope, nowOperate.title)
                        }
                    }
                }


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
                        readonly: this.readonly,
                        ifbpMobileTableSlotRowFun: ifbpMobileTableSlotRowFun,
                        ifbpMobileOperateArr: this.operateArr,
                        contentHeaderTitle: this.contentHeaderTitle
                    });
                } else {
                    // 将resObj.formData中formModel的字段都置为空串
                    let newFormData = JSON.parse(JSON.stringify(resObj.formData));
                    let nowFormData = newFormData[this.formModel];
                    for (var key in nowFormData) {
                        nowFormData[key] = '';
                    }
                    resData = this.nowExtend(true, {}, newFormData, defaultHideData, baseData, {
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
                        readonly: this.readonly,
                        ifbpMobileTableSlotRowFun: ifbpMobileTableSlotRowFun,
                        ifbpMobileOperateArr: this.operateArr,
                        contentHeaderTitle: this.contentHeaderTitle
                    });
                }

                // table增加按钮控制显示/隐藏列
                if ((this.myShowType === "table" || this.myShowType === "table-form") && this.columnUseCache && this.IsPC) {
                    resData.transferData = [];
                    resData.transferValue = [];
                    const lsKey = this.getTableLocalStorageKey();
                    const lsDataKey = this.getTableDataLocalStorageKey();
                    let lsValue;
                    let lsDataValue;
                    try {
                        let lsValueStr;
                        let lsDataValueStr;
                        if (lsKey) {
                            lsValueStr = localStorage.getItem(lsKey);
                        }
                        if (lsValueStr && ["undefined", "null"].indexOf(lsValueStr) === -1) {
                            lsValue = JSON.parse(lsValueStr);
                            if (lsValue && lsValue.version === this.nowVersion) {
                                lsValue = lsValue.value;
                            } else {
                                lsValue = null;
                            }
                        }
                        if (lsDataKey) {
                            lsDataValueStr = localStorage.getItem(lsDataKey);
                        }
                        if (lsDataValueStr && ["undefined", "null"].indexOf(lsDataValueStr) === -1) {
                            lsDataValue = JSON.parse(lsDataValueStr);
                            if (lsDataValue && lsDataValue.version === this.nowVersion) {
                                lsDataValue = lsDataValue.value;
                            } else {
                                lsDataValue = null;
                            }
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
                        let toggleColumn = $nowTableCoulmn.attr("toggle-column");
                        let defaultHide = $nowTableCoulmn.attr("default-hide");
                        // 同时设置了prop以及label的才当做一列，需要过滤操作列、复选咧、数字列等
                        // 如果自定义了是否显示则此处不再设置显示
                        if (tableColumnProp && tableColumnLabel && toggleColumn !== 'false') {
                            resData.transferData.push({
                                label: tableColumnLabel,
                                key: tableColumnProp
                            });
                            if (Array.isArray(lsValue)) {
                                propsArrTmp.push(tableColumnProp);
                            } else {
                                if (defaultHide != "true") {
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
                            let prop = propsArrTmp[i];
                            let vifProp = prop
                            if (vifProp.indexOf('beanMap.') === 0) {
                                vifProp = vifProp.substring(8);
                            }
                            let flag = resData.transferValue.indexOf(prop) !== -1 ? true : false;
                            resData["tableCoulmnVIf" + vifProp] = flag;
                            if (!flag) {
                                let flag1 = false;
                                if (lsDataValue && lsDataValue.length > 0) {
                                    for (var j = 0; j < lsDataValue.length; j++) {
                                        let nowLsData = lsDataValue[j];
                                        if (nowLsData.key === prop) {
                                            flag1 = true;
                                            break;
                                        }
                                    }
                                }
                                if (!flag1) {
                                    resData["tableCoulmnVIf" + vifProp] = true;
                                    resData.transferValue.push(prop);
                                }
                            }
                        }
                    }
                    // 由于需要考虑模板变化，需要每次都重新设置缓存
                    let localTransferValue = {
                        version: oThis.nowVersion,
                        value: resData.transferValue
                    }
                    // 重新排序
                    let transferValueForOrder = Array.isArray(resData.transferValue) ? resData.transferValue : [];
                    let unorderedTransferData = Array.isArray(resData.transferData) ? resData.transferData.slice() : [];
                    let orderedTransferData = [];
                    let unselectedTransferData = [];
                    unorderedTransferData.forEach(item => {
                        let selectedIndex = resData.transferValue.indexOf(item.key);
                        if (selectedIndex === -1) {
                            unselectedTransferData.push(item);
                        } else {
                            orderedTransferData[selectedIndex] = item;
                        }
                    });
                    // 拼接未选中数据, 并过滤 undefined 和 null 项
                    resData.transferData = orderedTransferData.concat(unselectedTransferData).filter(item => {
                        return item;
                    });

                    let localTransferData = {
                        version: oThis.nowVersion,
                        value: resData.transferData
                    }
                    localStorage.setItem(lsKey, JSON.stringify(localTransferValue));
                    // this.setLsItem(lsKey, JSON.stringify(localTransferValue));
                    localStorage.setItem(lsDataKey, JSON.stringify(localTransferData));
                    resData.transferVisible = false;
                    let toggleColumnHTML = `<ifbp-toggle-column
                                 :visible="transferVisible"
                                 :data="transferData"
                                 ref="toggleColumnDialog"
                                 :selected-keys="transferValue"
                                 @change="transferChange"
                                 @cancel="transferVisible = false"
                                  />
                                   `;

                    $resDom.append(toggleColumnHTML);
                    $resDom.attr(':fit', "true");
                    resTemplate = $resDom[0].outerHTML;
                }
                resData.editIndex=-1;
                this.resTemplate = resTemplate;
                this.resTplBackup = resTemplate;
                this.resDataBackup = resData;
                if ((this.myShowType === "table" || this.myShowType === "table-form") && this.columnUseCache && this.IsPC) {
                    resTemplate = this.sortTableColumns(resData.transferValue, resData.transferData);
                }
                this.renderTpl();
                addResizeListener(this.$el, this.resizeUiTpl);
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
                    this.$pageMgr.getPageModel(this, function (pageModel) {
                        if (pageModel) {
                            var tpl = pageModel.getTemplate(oThis.tplId);
                            oThis.tplModel = tpl;
                            if (tpl) {
                                // oThis.pkTemp = tpl.pk;
                                //TODO 后期不直接修改props 通过计算属性实现
                                oThis.firstShowType = tpl.show_type;
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

                if (this.doRequestTimeId) {
                    clearTimeout(this.doRequestTimeId);
                }
                this.doRequestTimeId = setTimeout(() => {
                    this.doRequestFun();
                }, 300);
            },

            doRequestFun() {

                let localStorage = window.ifbpLocalCache || window.localStorage;
                const lsKey = this.getLocalStorageKey();
                if (lsKey) {
                    let lsValueStr = localStorage.getItem(lsKey);
                    if (lsValueStr) {
                        let resLocal = JSON.parse(lsValueStr);
                        if (resLocal && resLocal.version === this.nowVersion) {
                            let etag_key = resLocal.data && resLocal.data.etag_key;
                            let pk_temp = resLocal.data && resLocal.data.form && resLocal.data.form.pk_temp;
                            if (pk_temp && etag_key && pk_temp !== 'undefined') {
                                this.$http({
                                    url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryTemplate?" +
                                        this.geturlencode({
                                            pk_temp: pk_temp,
                                            etag_key: etag_key
                                        }),
                                    noLoading: true,
                                    method: "get",
                                    headers: {
                                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                                    }
                                })
                                    .then(res => {
                                        if (res.data.useCache) {
                                            this.requestSucessFun(resLocal);
                                        } else {
                                            if (res.data.status === false) {
                                                this.$message({
                                                    showClose: true,
                                                    message: res.data.msg,
                                                    type: "error"
                                                });
                                            } else {
                                                let tablelsKey = this.getTableLocalStorageKey();
                                                let tableDatalsKey = this.getTableDataLocalStorageKey();
                                                localStorage.removeItem(tablelsKey);
                                                localStorage.removeItem(tableDatalsKey);
                                                this.requestSucessFun(res);
                                                res.version = this.nowVersion;
                                                localStorage.setItem(lsKey, JSON.stringify(res));
                                                // this.setLsItem(lsKey, JSON.stringify(res));
                                            }
                                        }
                                    })
                                    .catch(res => {
                                        console.log("UI模板获取结构数据失败");
                                        console.log(res.stack);
                                        if (!this._isDestroyed) {
                                            this.$message({
                                                showClose: true,
                                                message: "UI模板获取结构数据失败",
                                                type: "error"
                                            });
                                        }

                                    });
                                return
                            }
                        } else {
                            // localStorage.setItem(lsKey, '');
                            localStorage.removeItem(lsKey);
                        }
                    }
                }
                this.doRequestRealFun();
            },
            doRequestRealFun() {
                let localStorage = window.ifbpLocalCache || window.localStorage;
                const lsKey = this.getLocalStorageKey();
                if (this.tplCode) {
                    this.$http({
                        url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryTemplateByCode",
                        noLoading: true,
                        method: "post",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        data: this.geturlencode(this.tplCode)
                    })
                        .then(res => {
                            this.requestSucessFun(res);
                            res.version = this.nowVersion;
                            localStorage.setItem(lsKey, JSON.stringify(res));
                            // this.setLsItem(lsKey, JSON.stringify(res));
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
                        url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryTemplate?" +
                            this.geturlencode({
                                pk_temp: this.getPkTemp()
                            }),
                        noLoading: true,
                        method: "get",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                        }
                    })
                        .then(res => {
                            if (res.data.status === false) {
                                this.$message({
                                    showClose: true,
                                    message: res.data.msg,
                                    type: "error"
                                });
                            } else {
                                this.requestSucessFun(res);
                                res.version = this.nowVersion;
                                localStorage.setItem(lsKey, JSON.stringify(res));
                                // this.setLsItem(lsKey, JSON.stringify(res));
                            }
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
                } else if (this.nowfunnode && this.nexuskey) {
                    let d, url, headers, data;
                    if (this.mode === "design") {
                        d = {
                            funcnode: this.nowfunnode,
                            nexuskey: this.nexuskey
                        };
                        url = this.query_uitemplate_url;
                        headers = {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                        };
                        data = this.geturlencode(d);
                    } else {
                        d = {
                            funnode: this.nowfunnode,
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
                            res.version = this.nowVersion;
                            localStorage.setItem(lsKey, JSON.stringify(res));
                            // this.setLsItem(lsKey, JSON.stringify(res));
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
            doShowFormula(type) {
                var showFormulas = this.getData('showFormulas');
                if (showFormulas) {
                    if (type == this.tableModel && showFormulas.table) {
                        this.handleShowFormula(this.getTableData(), showFormulas.table, type);
                    } else if (type == this.formModel && showFormulas.form) {
                        this.handleShowFormula(this.getFormData(), showFormulas.form, type);
                    }
                }
            },
            setData(key, value) {
                console.log(value);
                if (key === this.tableModel) {
                    this.clearEdit();
                }
                if(this.tplDatause){
                    this.tplDatause[key] = value;
                }
                if(this.comp) {
                    this.comp[key] = value;
                    this.doShowFormula(key);
                }else {
                    this.newtplData = this.newtplData || {};
                    this.newtplData.doShowFormulaTypes = this.newtplData.doShowFormulaType || {};
                    this.newtplData.doShowFormulaTypes[key] = true;
                }
            },
            setDefaultData(key, value) {
                let newValue = this.nowExtend({}, this.resBaseData[key], value);
                this.setData(key, newValue);
            },

            setTableData(value) {

                if (!value) {
                    value = [];
                }
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

            setFormDataByField(field, value) {
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
            formCancelClick(type) {
            
                this.comp.formCancelClick(type);
            },
            validate(callback, type) {
                this.comp.validate(callback, type);
            },
            getRequiredFields() {
                if (!this.requiredFieldsFlag) {
                    let $dom = $(this.resTemplate);
                    let $requiredDom = $dom.find("[\\:required='true']");
                    for (var i = 0; i < $requiredDom.length; i++) {
                        let requiredDom = $requiredDom[i];
                        let prop = $(requiredDom).attr('prop');
                        if (prop) {
                            this.requiredFields.push(prop);
                        }
                    }
                    this.requiredFieldsFlag = true;
                }
                return this.requiredFields;
            },
            clearEdit() {
                this.editChange = false;
                this.editIndex = -1;
                this.editBaseData = {};
            },
            setEdit(row, index) {
                this.editBaseData = JSON.parse(JSON.stringify(row));
                this.editIndex = index;
                this.editRow = row;
            },

            resetFields(type) {
                this.comp.resetFields(type);
            },
            resetFormData(type) {
                console.log(2)
                let i=setInterval(()=>{
                    if(this.comp){
                        this.comp.resetFormData(type);
                        clearInterval(i)
                    }
                })
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
            setTransferVisible(transferVisible) {
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

            showFormContent() {
                this.$context && this.$context.getApp() && this.$context.getApp().contentPush(this.tplId + 'ifbpContent');
            },

            expandRow(row, index,expanded) {
                debugger
                this.comp.expandRow(row, index,expanded);
            },

            checkEditChange(successFun, errorFun) {
                this.comp.checkEditChange(successFun, errorFun);
            },

            getBaseTableOperateHtml(operateArr, fixed) {
                let baseOperateArr = [{
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
                let nowOperateArr = operateArr ?
                    baseOperateArr.concat(operateArr) :
                    baseOperateArr;
                return this.getTableOperateHtml(nowOperateArr, fixed);
            },

            getTableOperateHtml: function getTableOperateHtml(operateArr, fixed, colWidth, type) {
                var html = "",
                    fixedStr = "";
                fixed = fixed? fixed : "right";
                let cellStyle = '';
                if (colWidth) {
                    cellStyle = 'cellWidth'
                }
                colWidth = colWidth ? colWidth : "155"
                //判断是否为text类型
                var defaultType = window.appDefaultConfig.ifbpIconType === 'text' ? true : false;
                var showText = !type ? defaultType : type === 'text' ? true : false;
                //判断text总长度


                let totalLength = operateArr.length;
                if (operateArr.length > 0) {
                    if (fixed) {
                        fixedStr = ' fixed="' + fixed + '"';
                    }
                    //判断是否不显示所有icon
                    //判断是否不显示所有icon
                    var showIcon = operateArr.reduce((total, current) => {
                        if (current.vif) {
                            total.push(current.vif);
                        } else {
                            if (total.length === 0) {
                                total = [];
                            }
                        }
                        return total;
                    }, []);
                    var iconVif = "";
                    if (showIcon && showIcon.length > 0) {
                        iconVif = 'v-if="' + showIcon.join("&&") + '"';
                    }
                    html = `<el-table-column label="" :show-overflow-tooltip="false"
                width=" ${colWidth} " v-if="tableOperColumnVif && !readonly"
                class-name="table-operate-column ${cellStyle}"
                 header-align= ${"center" + fixedStr}>
                  <template slot-scope="scope"> `;

                    let htmlMore = showText ? '<el-tooltip effect="light"><ul slot="content">' :
                        '<el-tooltip effect="light" popper-class="hoverToolTip"><ul slot="content">';
                    for (var i = 0; i < operateArr.length; i++) {
                        var oper = operateArr[i];
                        var vifStr = "";
                        if (oper.vif) {
                            // vifStr = 'v-if="scope.$index!==editIndex"';
                            vifStr = 'v-if="' + oper.vif + '"';
                        }
                        debugger
                        // 超过4个按钮, 则第4个显示 ifbp-icon-more 及浮层
                        if (i < 3||(i===4&&operateArr.length===4)) {
                            if (oper.click) {
                                if (showText) {
                                    if (totalLength === 3 || i < 2) {
                                        html += '<span class="el-table-operate-icon" @click.stop="' + oper.click + '(scope)" ' + vifStr + '>' + oper.title + '</span>';
                                    }
                                } else {
                                    let iconClass = oper.ifbpIconShow === false ? oper.icon : ['ifbp-icon-' + oper.icon + ' ' + 'el-icon-' + oper.icon];
                                    html += '<i @click.stop="' + oper.click + '(scope)" ' + vifStr + ' class=" ' + iconClass + '  el-table-operate-icon"  title="' + oper.title + '"></i>';
                                }
                            } else {
                                if (showText) {
                                    if (totalLength === 3 || i < 2) {
                                        html += "<span class='el-table-operate-icon' @click.stop=\"handleClick('" + oper.icon + "',scope,'" + oper.title + "')\" " + vifStr + '>' + oper.title + '</span>';
                                    }
                                } else {
                                    let iconClass = oper.ifbpIconShow === false ? oper.icon : ['ifbp-icon-' + oper.icon + ' ' + 'el-icon-' + oper.icon];
                                    html += "<i @click.stop=\"handleClick('" + oper.icon + "',scope,'" + oper.title + "')\" " + vifStr + ' class=" ' + iconClass + ' el-table-operate-icon"  title="' + oper.title + '"></i>';
                                }
                            }
                        } else {
                            let operMore = operateArr[i];
                            let vifStrMore = "";
                            if (operMore.vif) {
                                vifStrMore = "v-if=\"" + operMore.vif + "\"";
                            }
                            if (showText) {
                                if (operMore.click) {
                                    htmlMore += "\n              <li class=\"el-table-more-operate-item\" @click.stop=\"" + operMore.click + "(scope)\" " + vifStrMore + ">\n<span>" + operMore.title + "</span>\n              </li>\n            ";
                                } else {
                                    htmlMore += "\n              <li class=\"el-table-more-operate-item\" @click.stop=\"handleClick('" + operMore.icon + "', scope,'" + oper.title + "')\" " + vifStrMore + ">\n                <span>" + operMore.title + "</span>\n              </li>\n            ";
                                }
                            } else {
                                if (operMore.click) {
                                    let iconClass = operMore.ifbpIconShow == false ? operMore.icon : ["ifbp-icon-" + operMore.icon + ' ' + 'el-icon-' + operMore.icon];
                                    htmlMore += "\n              <li class=\"el-table-more-operate-item\" @click.stop=\"" + operMore.click + "(scope)\" " + vifStrMore + ">\n                <i class=\"" + iconClass + "  el-table-operate-icon\" " + "></i>\n                <span>" + operMore.title + "</span>\n              </li>\n            ";
                                } else {
                                    let iconClass = operMore.ifbpIconShow == false ? operMore.icon : ["ifbp-icon-" + operMore.icon + ' ' + 'el-icon-' + operMore.icon];
                                    htmlMore += "\n              <li class=\"el-table-more-operate-item\" @click.stop=\"handleClick('" + operMore.icon + "', scope,'" + oper.title + "')\" " + vifStrMore + ">\n                <i class=\" " + iconClass + " el-table-operate-icon\"" + "></i>\n                <span>" + operMore.title + "</span>\n              </li>\n            ";
                                }
                            }

                        }

                    }
                    if(operateArr.length>4){
                        htmlMore += '</ul><i class="ifbp-icon-more el-table-operate-icon"' + iconVif + '></i></el-tooltip>';
                        html += htmlMore;
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
                return this.getLocalStorageKeyFun('ifbpUITpl_');
            },
            // 取当前表格 transferValue 本地存储键名
            getTableLocalStorageKey() {
                return this.getLocalStorageKeyFun('ifbpUITplTable_');
            },

            getTableDataLocalStorageKey() {
                return this.getLocalStorageKeyFun('ifbpUITplTableData_');
            },

            getLocalStorageKeyFun(start) {
                const username =
                    this.getCookie("usercode") ||
                    this.getCookie("u_usercode") ||
                    "localuser";
                let lsKey = start + username + "_" + this.localStorageId;
                if (this.getPkTemp()) {
                    return lsKey + this.getPkTemp();
                }
                if (this.nowfunnode && this.nexuskey) {
                    return lsKey + this.nowfunnode + "_" + this.nexuskey;
                }
                return "";
            },
            //根据字段获取对应组件
            getItemComp: function getItemComp(field) {
                var item = null;
                if (this.getFormComp() && this.getFormComp().$children) {
                    this.getFormComp().$children.forEach(function (itemComp) {
                        if (itemComp.prop == field) {
                            item = itemComp;
                        }
                    });
                }
                return item;
            },
            //处理显示公式
            handleShowFormula(oData, showFormulas, type) {
                var data,
                    oThis = this;
                if (!oData) {
                    return;
                }
                if ((typeof oData === "undefined" ? "undefined" : typeof (oData)) === 'object' && !Array.isArray(oData)) {
                    data = [oData];
                } else {
                    data = oData;
                }

                function getRow(rowid) {
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
                    formula: [],
                    data: []
                    // 所有显示公式中的变量合集，后期可考虑在模板保存时合并，节省处理显示公式时的计算时间
                };
                var allVars = {},
                    editKeys = [];
                for (var key in showFormulas) {
                    var formulas = showFormulas[key];
                    if (formulas) {
                        for (var i = 0; i < formulas.length; i++) {
                            var formula = formulas[i];
                            editKeys.push(formula.originalFormula.split('->')[0]);
                            params.formula.push(formula.originalFormula);
                            for (var j = 0; j < formula.vars.length; j++) {
                                if (!allVars[formula.vars[j]]) {
                                    allVars[formula.vars[j]] = 1;
                                }
                            }
                        }
                    }
                }
                for (var k = 0; k < data.length; k++) {
                    var rowid = !data[k].rowid ? data[k].rowid = Math.random().toString(36).substr(2) : data[k].rowid;
                    var row = {
                        rowid: rowid
                    };
                    for (var key in allVars) {
                        row[key] = data[k][key];
                    }
                    params.data.push(row);
                }

                var url = '/wbalone/formula/executFormulas';
                if (this.getCookie('platform') == 'ifbp') {
                    url = '/ifbp-app-bd/wbalone/formula/executFormulas'
                }
                $.ajax({
                    type: 'POST',
                    url: url,
                    async: false,
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(params), //this.geturlencode(params),
                    success: function success(res) {
                        if (res.success == true || res.status == 1) {
                            var resData = res.data;
                            for (var i = 0; i < resData.length; i++) {
                                var newRow = resData[i];
                                var rowid = newRow.rowid;
                                var oldRow = getRow(rowid);
                                for (var j = 0; j < editKeys.length; j++) {
                                    oldRow[editKeys[j]] = resData[i][editKeys[j]];
                                }
                            }
                        }
                        if (oThis.tableModel && type == oThis.tableModel) {
                            var newOData = oThis.getTableData();
                            var newData = [];
                            if ((typeof newOData === "undefined" ? "undefined" : typeof (newOData)) === 'object' && !Array.isArray(newOData)) {
                                newData = [newOData];
                            } else {
                                newData = newOData;
                            }
                            newData = Object.assign([], newData);
                            oThis.comp[oThis.tableModel] = newData;
                        }
                        data.forEach(function (row) {
                            if (row.rowid) {
                                delete row.rowid;
                            }
                        });
                    },
                    error: function error(e) {
                        data.forEach(function (row) {
                            if (row.rowid) {
                                delete row.rowid;
                            }
                        });
                        console.log("调用显示公式失败");
                        // console.log(res.stack);
                    }
                });

            },
            //处理校验公式
            handleValidateFormula() {
                var validateFormulas = this.getData('validateFormulas');
                if (!validateFormulas || JSON.stringify(validateFormulas) == "{}") return true;
                var validateResult = true,
                    validateMsg1 = '',
                    validateMsg2 = '',
                    validateMsg3 = '';
                var headDataModel = null;
                var backFormulas = [];
                var backData = [];
                loop1:
                    for (var field in validateFormulas) {
                        var fieldValidateFormulas = validateFormulas[field];
                        fieldValidateFormulas = Array.isArray(fieldValidateFormulas) ? fieldValidateFormulas : [fieldValidateFormulas];
                        var tempDatas = [this.getFormData()];
                        if (this.myShowType !== 'form') {
                            tempDatas = this.getTableData();
                        }
                        for (var index = 0; index < tempDatas.length; index++) {
                            for (var i = 0; i < fieldValidateFormulas.length; i++) {
                                //validateResult = false;
                                var fieldValidateFormula = fieldValidateFormulas[i];
                                if (!fieldValidateFormula.originalFormula) {
                                    this.$message({
                                        showClose: true,
                                        duration: 5000,
                                        message: "参数" + field + "校验公式有误！",
                                        type: 'warning'
                                    });
                                    break;
                                }
                                var validKey = fieldValidateFormula.originalFormula.split('->')[0];
                                if (!fieldValidateFormula.client) { // 后端解析
                                    var params = {
                                        formula: fieldValidateFormula.originalFormula,
                                        data: {}
                                    }
                                    for (var i = 0; i < fieldValidateFormula.vars.length; i++) {
                                        var field = fieldValidateFormula.vars[i];
                                        if (field.indexOf('head.') == 0) {
                                            var headField = field.replace('head.', '');
                                            headDataModel = headDataModel || this.getHeadFormData();
                                            params.data[field] = headDataModel[headField];
                                        } else {
                                            params.data[field] = tempDatas[index][field];
                                        }
                                    }
                                    backFormulas.push(params.formula);
                                    backData.push(params.data);
                                    // $.ajax({
                                    //   type:'POST',
                                    //   url:'/wbalone/formula/executFormula',
                                    //   async:false,
                                    //   dataType: 'json',
                                    //   contentType:'application/json',
                                    //   data: JSON.stringify(params),//this.geturlencode(params),
                                    //   success: function(res){
                                    //     if (res.success == true){
                                    //       if (!res.data[validKey]){
                                    //         validateResult = true;
                                    //       }else{
                                    //         if(validKey == '$Message'){
                                    //           validateMsg1 += validateMsg1 + (validateMsg1 == "" ? "" : "。") + res.data[validKey];
                                    //         }else if(validKey == '$Error'){
                                    //           validateMsg2 += validateMsg2 + (validateMsg2 == "" ? "" : "。") + res.data[validKey];
                                    //         }else if(validKey == '$Confirm'){
                                    //           validateMsg3 =  res.data[validKey];
                                    //         }
                                    //       }
                                    //     }
                                    //   },error:function(e){
                                    //     console.error("调用验证公式失败");
                                    //     console.error(e);
                                    //     this.$message({
                                    //       showClose: true,
                                    //       message: "调用验证公式失败",
                                    //       type: "error"
                                    //     });
                                    //   }
                                    // })
                                } else {
                                    var formulaJson = fieldValidateFormula.formulaFunc;
                                    this.formula = this.formula || new this.$Formula();
                                    this.formula.dataModel = tempDatas[index];
                                    headDataModel = headDataModel || this.getHeadFormData();
                                    this.formula.headDataModel = headDataModel;
                                    const mes = this.formula.formula(formulaJson);
                                    if (mes == "") {
                                        validateResult = true;
                                    } else {
                                        if (validKey == '$Message' && mes != "") {
                                            validateMsg1 += validateMsg1 + (validateMsg1 == "" ? "" : "。") + mes;
                                            validateResult = false;
                                        } else if (validKey == '$Error') {
                                            validateMsg2 += validateMsg2 + (validateMsg2 == "" ? "" : "。") + mes;
                                            validateResult = false;
                                        } else if (validKey == '$Confirm') {
                                            validateMsg3 = mes;
                                            validateResult = false;
                                        }
                                    }
                                }
                                if (validateResult == false) {
                                    if (validKey === '$Confirm') {
                                        this.$confirm(validateMsg3, '确认', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                        }).then(() => {
                                            validateResult = true;
                                        }).catch(() => {
                                        })
                                    }
                                }
                                if (validateResult != true) {
                                    break loop1;
                                }
                            }
                        }
                    }
                if (backFormulas.length > 0 && validateResult == true) {
                    params.formula = backFormulas;
                    params.data = backData;
                    $.ajax({
                        type: 'POST',
                        url: '/wbalone/formula/executFormulas',
                        async: false,
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify(params), //this.geturlencode(params),
                        success: function success(res) {
                            if (res.success == true) {
                                for (var i = 0; i < res.data.length; i++) {

                                    if (res.data[i]['$Message']) {
                                        validateResult = false;
                                        validateMsg1 += validateMsg1 + (validateMsg1 == "" ? "" : "。") + res.data[i]['$Message'];
                                    } else if (res.data[i]['$Error']) {
                                        validateResult = false;
                                        validateMsg2 += validateMsg2 + (validateMsg2 == "" ? "" : "。") + res.data[i]['$Error'];
                                    } else if (res.data[i]['$Confirm']) {
                                        validateResult = false;
                                        validateMsg3 = res.data[i]['$Confirm'];
                                    }
                                    if (validateResult == false) {
                                        if (validateMsg3) {
                                            this.$confirm(validateMsg3, '确认', {
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                                type: 'warning'
                                            }).then(function () {
                                                validateResult = true;
                                                validateMsg3 = '';
                                            }).catch(function () {
                                            });
                                        }
                                    }
                                    if (validateResult === false) {
                                        break;
                                    }
                                }
                            }
                        },
                        error: function error(e) {
                            console.error("调用验证公式失败");
                            console.error(e);
                            this.$message({
                                showClose: true,
                                message: "调用验证公式失败",
                                type: "error"
                            });
                        }
                    });
                }

                if (validateMsg1 !== "") {
                    this.$message({
                        showClose: true,
                        message: validateMsg1,
                        type: 'warning'
                    });
                }
                if (validateMsg2 !== '') {
                    this.$message({
                        showClose: true,
                        message: validateMsg2,
                        type: 'error'
                    });
                }
                return validateResult;

            },

            //处理校验公式，只处理form,暂时不用
            handleFormValidateFormula() {
                var validateFormulas = this.getData('validateFormulas');
                if (!validateFormulas || JSON.stringify(validateFormulas) == "{}") return true;
                var validateResult, validateMsg1 = '',
                    validateMsg2 = '',
                    validateMsg3 = '';
                var headDataModel = null;
                for (var field in validateFormulas) {
                    var fieldValidateFormulas = validateFormulas[field];
                    fieldValidateFormulas = Array.isArray(fieldValidateFormulas) ? fieldValidateFormulas : [fieldValidateFormulas];
                    var formData = this.getFormData();
                    for (var i = 0; i < fieldValidateFormulas.length; i++) {
                        validateResult = false;
                        var fieldValidateFormula = fieldValidateFormulas[i];
                        if (!fieldValidateFormula.originalFormula) {
                            this.$message({
                                showClose: true,
                                duration: 5000,
                                message: "参数" + field + "校验公式有误！",
                                type: 'warning'
                            });
                            break;
                        }
                        var validKey = fieldValidateFormula.originalFormula.split('->')[0];
                        if (!fieldValidateFormula.client) { // 后端解析
                            var params = {
                                formula: fieldValidateFormula.originalFormula,
                                data: {}
                            }
                            for (var j = 0; j < fieldValidateFormula.vars.length; j++) {
                                var field = fieldValidateFormula.vars[j];
                                if (field.indexOf('head.') == 0) {
                                    var headField = field.replace('head.', '');

                                    headDataModel = headDataModel || this.getHeadFormData();

                                    params.data[field] = headDataModel[headField];
                                } else {
                                    params.data[field] = formData[field];
                                }
                            }
                            $.ajax({
                                type: 'POST',
                                url: '/wbalone/formula/executFormula',
                                async: false,
                                dataType: 'json',
                                contentType: 'application/json',
                                data: JSON.stringify(params), //this.geturlencode(params),
                                success: function (res) {
                                    if (res.success == true) {
                                        if (!res.data[validKey]) {
                                            validateResult = true;
                                        } else {
                                            if (validKey == '$Message') {
                                                validateMsg1 += validateMsg1 + (validateMsg1 == "" ? "" : "。") + res.data[validKey];
                                            } else if (validKey == '$Error') {
                                                validateMsg2 += validateMsg2 + (validateMsg2 == "" ? "" : "。") + res.data[validKey];
                                            } else if (validKey == '$Confirm') {
                                                validateMsg3 = res.data[validKey];
                                            }
                                        }
                                    }
                                },
                                error: function (e) {
                                    console.error("调用验证公式失败");
                                    console.error(e);
                                    this.$message({
                                        showClose: true,
                                        message: "调用验证公式失败",
                                        type: "error"
                                    });
                                }
                            })
                        } else {
                            var formulaJson = fieldValidateFormula.formulaFunc;
                            this.formula = this.formula || new this.$Formula();
                            this.formula.dataModel = tempDatas[index];
                            headDataModel = headDataModel || this.getHeadFormData();
                            this.formula.headDataModel = headDataModel;
                            const mes = this.formula.formula(formulaJson);
                            if (mes == "") {
                                validateResult = true;
                            } else {
                                if (validKey == '$Message' && mes != "") {
                                    validateMsg1 += validateMsg1 + (validateMsg1 == "" ? "" : "。") + mes;
                                } else if (validKey == '$Error') {
                                    validateMsg2 += validateMsg2 + (validateMsg2 == "" ? "" : "。") + mes;
                                } else if (validKey == '$Confirm') {
                                    validateMsg3 = mes;
                                }
                            }
                        }
                        if (validateResult == false) {
                            if (validKey === '$Confirm') {
                                this.$confirm(validateMsg3, '确认', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    validateResult = true;
                                }).catch(() => {
                                })
                            }
                        }
                    }
                }
                if (validateMsg1 !== "") {
                    this.$message({
                        showClose: true,
                        message: validateMsg1,
                        type: 'warning'
                    });
                }
                if (validateMsg2 !== '') {
                    this.$message({
                        showClose: true,
                        message: validateMsg2,
                        type: 'error'
                    });
                }
                return validateResult;
            },

            //tableData变化后，计算合计类公式
            handleSummaryEditFormula() {
                // if (!window._debug) return; // 调试态启用
                var editFormulas = this.getData('editFormulas');
                if (!editFormulas) return;
                for (var field in editFormulas) {
                    var fieldEditFormulas = editFormulas[field];
                    fieldEditFormulas = Array.isArray(fieldEditFormulas) ? fieldEditFormulas : [fieldEditFormulas];
                    for (var i = 0; i < fieldEditFormulas.length; i++) {
                        var fieldEditFormula = fieldEditFormulas[i];
                        if (fieldEditFormula.originalFormula && fieldEditFormula.originalFormula.indexOf('summary(') !== -1) {
                            var tableDataModel = this.getTableData();
                            var headDataModel = this.getHeadFormData();
                            this.formula = this.formula || new this.$Formula();
                            this.formula.tableDataModel = tableDataModel;
                            this.formula.headDataModel = headDataModel;
                            this.formula.formula(fieldEditFormula.formulaFunc);
                        }
                    }
                }
            },
            //处理编辑公式
            handleEditFormula(field, val) {
                var oThis = this;
                var editFormulas = this.getData('editFormulas');
                var fieldEditFormulas = editFormulas && editFormulas[field];
                var formData = this.getFormData();
                //处理编辑公式

                if (!fieldEditFormulas) return;
                fieldEditFormulas = Array.isArray(fieldEditFormulas) ? fieldEditFormulas : [fieldEditFormulas];
                // var backendFormulas = [],frontFormulas = [],
                for (var i = 0; i < fieldEditFormulas.length; i++) {
                    var fieldEditFormula = fieldEditFormulas[i];
                    if (!fieldEditFormula) {
                        continue;
                    }
                    var editKeys = [],
                        _d = {},
                        editKey;
                    var params = {
                        formula: [],
                        data: [],
                        dataType: {}
                    }
                    editKey = fieldEditFormula.originalFormula && fieldEditFormula.originalFormula.split('->')[0]
                    if (!fieldEditFormula.client && fieldEditFormula.vars && fieldEditFormula.vars.length) {
                        // editKeys.push(fieldEditFormula.originalFormula.split('->')[0]);
                        params.formula.push(fieldEditFormula.originalFormula);
                        for (var j = 0; j < fieldEditFormula.vars.length; j++) {
                            var field = fieldEditFormula.vars[j];
                            if (field.indexOf('head.') == 0) {
                                var headField = field.replace('head.', '');
                                _d[field] = this.getHeadFormData()[headField];
                            } else {
                                _d[field] = formData[field];
                                var fieldComp = this.getItemComp(field);
                                if (fieldComp) {
                                    params.dataType[field] = fieldComp.$children[0].$props.type;
                                }
                            }
                        }
                        params.data.push(_d);
                        $.ajax({
                            url: "/wbalone/formula/executFormulas",
                            type: 'POST',
                            async: false,
                            dataType: 'json',
                            contentType: 'application/json',
                            data: JSON.stringify(params), //this.geturlencode(params)
                            success: function (res) {
                                if (res.success == true) {
                                    var resData = res.data[0];
                                    // for (var i =0 ; i < editKeys.length; i++){
                                    if (editKey) {
                                        if (editKey.indexOf('head.') == 0) {
                                            var headField = editKey.replace('head.', '');
                                            var headFormData = this.getHeadFormData();
                                            var oldValue = headFormData[headField];
                                            headFormData[headField] = resData[headField];
                                            if (oldValue !== headFormData[headField]) {
                                                oThis.$emit("change", headField, oldValue);
                                            }
                                        } else {
                                            var oldValue = formData[editKey];
                                            formData[editKey] = resData[editKey];
                                            if (oldValue !== formData[editKey]) {
                                                oThis.$emit("change", editKey, formData[editKey]);
                                            }
                                        }
                                    }

                                }
                            },
                            error: function (res) {
                                console.error("调用编辑公式失败");
                                console.error(res.stack);
                                this.$message({
                                    showClose: true,
                                    message: "调用编辑公式失败",
                                    type: "error"
                                })
                            }
                        })
                    } else { //前端直接解析
                        var formulaJson = fieldEditFormula.formulaFunc;
                        var tableDataModel = this.getTableData();
                        var headDataModel = this.getHeadFormData();
                        // var formulaJson = fieldEditFormula.formulaFunc;
                        this.formula = this.formula || new this.$Formula();
                        this.formula.dataModel = formData;
                        this.formula.tableDataModel = tableDataModel;
                        this.formula.headDataModel = headDataModel;
                        var oldValue = formData[editKey];
                        this.formula.formula(formulaJson);
                        var newValue = formData[editKey];
                        if (oldValue !== newValue) {
                            oThis.$emit("change", editKey, newValue);
                        }
                    }
                }
            },

            /**
             *获取主UI模板的formData
             */
            getHeadFormData() {
                // if (!window._debug) return null;
                var oThis = this;
                var headFormData = null;
                if (this.$pageMgr) {
                    var page = this.$pageMgr.getPage && this.$pageMgr.getPage(oThis);
                    if (page && page.pageModel) {
                        var headTplId = page.pageModel.pageConfig.mainTpl && page.pageModel.pageConfig.mainTpl.compid;
                        if (headTplId) {
                            for (var key in page.$refs) {
                                if (page.$refs[key].$options._componentTag == 'ifbp-template' && page.$refs[key].$options.propsData.tplId == headTplId) {
                                    headFormData = page.$refs[key].getFormData();
                                    break;
                                }
                            }
                        }
                    }
                }
                return headFormData;
            },

            sortTableColumns(selected, allData) {
                // ;
                if (!this.resTemplate) {
                    return '';
                }
                let $originTpl = $(this.resTplBackup);
                let originTable = $originTpl.find('el-table');
                let onlyHasTable = false;
                let $originTable;
                if (originTable && originTable.length) {
                    $originTable = $(originTable);
                } else {
                    onlyHasTable = true;
                    $originTable = $originTpl;
                }
                let sortedTable = $('<div></div>');
                // expand column
                let expandColumn = $originTable.find('el-table-column[type="noIconExpand"]');
                if (expandColumn && expandColumn.length) {
                    sortedTable.append(expandColumn);
                }
                // selection column
                let selectionColumn = $originTable.find('el-table-column[type="selection"]');
                if (selectionColumn && selectionColumn.length) {
                    sortedTable.append(selectionColumn);
                }
                // index column
                let indexColumn = $originTable.find('el-table-column[type="index"]');
                if (indexColumn && indexColumn.length) {
                    sortedTable.append(indexColumn);
                }
                // props columns => 只渲染selected
                for (let i = 0; i < selected.length; i++) {
                    let prop = selected[i];
                    let propColumn = $originTable.find(`el-table-column[prop="${prop}"]`);
                    if (propColumn && propColumn.length) {
                        sortedTable.append(propColumn);
                    }
                }
                // 修改this["tableCoulmnVIf" + prop]
                for (let i = 0; i < allData.length; i++) {
                    let item = allData[i];
                    let prop = item.key;
                    let vifProp = prop;
                    if (vifProp.indexOf('beanMap.') === 0) {
                        vifProp = vifProp.substring(8)
                    }
                    this["tableCoulmnVIf" + vifProp] = selected.indexOf(prop) !== -1;
                    this.comp && (this.comp["tableCoulmnVIf" + vifProp] = selected.indexOf(prop) !== -1);
                }
                // operating column
                let operatingColumn = $originTable.find('el-table-column[class-name="table-operate-column"]');
                let hasOperatingColumn = false;
                if (operatingColumn && operatingColumn.length) {
                    hasOperatingColumn = true;
                    sortedTable.append(operatingColumn);
                }
                // toggle column
                let toggleColumn = $originTable.find('ifbp-toggle-column');
                let hasToggleColumn = false;
                if (toggleColumn && toggleColumn.length) {
                    hasToggleColumn = true;
                    sortedTable.append(toggleColumn);
                }
                // 处理之前规则之外的column
                if (hasOperatingColumn) {
                    $originTable.find('el-table-column').insertBefore(sortedTable.find('el-table-column[class-name="table-operate-column"]'))
                } else if (hasToggleColumn) {
                    $originTable.find('el-table-column').insertBefore(sortedTable.find('ifbp-toggle-column'))
                } else {
                    sortedTable.append($originTable.find('el-table-column'));
                }
                // ;
                if (onlyHasTable) {
                    $originTpl.html(sortedTable.html());
                } else {
                    $originTable.html(sortedTable.html());
                    $originTpl.remove('el-table').append($originTable);
                }
                let dom = $originTpl[0].outerHTML;
                this.resTemplate = dom;
                return dom;
            },

            reRenderTable(selected, allData) {
                let resultTpl = this.sortTableColumns(selected, allData);
                // ;
                this.setTransferVisible(false);
                let toggleDialog = this.$refs.toggleColumnDialog;
                if (toggleDialog && typeof toggleDialog.$destroy === 'function') {
                    toggleDialog.$destroy();
                }
                // this.$nextTick(() => {
                // this.comp.template = resultTpl;
                // this.comp.$forceUpdate();
                // });
                this.$nextTick(() => {
                    this.renderTpl();
                });
            },

            renderTpl() {
                let oThis = this;
                let baseProps = {
                    template: this.resTemplate,
                    data: () => {
                        return this.resDataBackup;
                    }
                };

                let otherProps = this.$vnode.data.attrs;
                if (this.vueProps) {
                    otherProps = extend(true, {                    }, otherProps, this.vueProps);
                }
                otherProps.methods = otherProps.methods || {};
                if (this.resBaseMethods) {
                    var methods1 = Object.keys(otherProps.methods)
                    var methods2 = Object.keys(this.resBaseMethods)
                    methods2.map(item => {
                        if (methods1.indexOf(item) == -1) {
                            otherProps.methods[item] = function () {
                            }
                        }
                    })
                }
                otherProps.methods.tableDefaultMenuClick = function () {
                    this.transferVisible = true;
                };
                otherProps.methods.arraySpanMethod = function ({ row, column, rowIndex, columnIndex }) {
                        if(column.type==='expand'){
                            return [1,2]
                        }
                };

                otherProps.methods.transferChange = function (selected, allData) {
                    // ;
                    let localStorage = window.ifbpLocalCache || window.localStorage;
                    const lsKey = oThis.getTableLocalStorageKey();
                    const lsDataKey = oThis.getTableDataLocalStorageKey();
                    if (Array.isArray(selected) && selected.length && lsKey) {
                        let selectedKeysToSave = {
                            version: oThis.nowVersion,
                            value: selected
                        };
                        localStorage.setItem(lsKey, JSON.stringify(selectedKeysToSave));
                        // this.setLsItem(lsKey, JSON.stringify(selectedKeysToSave));
                        this.transferValue = selected;
                    }
                    if (Array.isArray(allData) && selected.length && lsDataKey) {
                        let allDataToSave = {
                            version: oThis.nowVersion,
                            value: allData
                        };
                        localStorage.setItem(lsDataKey, JSON.stringify(allDataToSave));
                        // this.setLsItem(lsDataKey, JSON.stringify(allDataToSave));
                        this.transferData = allData;
                        oThis.reRenderTable(selected, allData);
                    }
                }

                otherProps.methods.handleSelectionChange = function (selection) {
                    oThis.$emit("selection-change", selection);
                };
                otherProps.methods.handleSelectAll = function (selection) {
                    oThis.$emit("select-all", selection);
                };

                otherProps.methods.checkEditChange = function (successFun, errorFun) {
                    if (oThis.editChange) {
                        this.$confirm('数据已发生改变，如您离开将不会保存当前操作', '提示', {
                            confirmButtonText: '离开',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            successFun.call(this);
                        }).catch(() => {
                            errorFun.call(this);
                        });
                    } else {
                        successFun.call(this);
                    }
                }
                otherProps.methods.handleRowClick = function (row,  column,event, scope) {
                    let tar = event.target;
                    if (
                        $(tar).closest(".el-table-column--selection").length < 1 &&
                        !$(tar).hasClass("el-table-operate-icon") &&
                        $(tar).closest(".el-table-column-no-click").length < 1
                    ) {
                        this.checkEditChange(() => {
                            this.formCancelClickResetData('table-form');
                            setTimeout(() => {
                                this.handleRowClickFun(row, event, column, scope);
                            })
                        })
                    }
                };

                otherProps.methods.handleExpand = function (row, expanded) {

                    oThis.$emit("expand", row, expanded);
                };

                otherProps.methods.handleTableDataChange = function (data) {
                    oThis.handleSummaryEditFormula();
                };

                otherProps.methods.handleRowClickFun = function (row, event, column, scope) {
                   console.log(row)
                    oThis.editChange = false;
                    let expandFlag = true;
                    let tar = event.target;
                    if(
                        $(tar).closest(".el-table-column--selection").length < 1 &&
                        !$(tar).hasClass("el-table-operate-icon") &&
                        $(tar).closest(".el-table-column-no-click").length < 1
                    ) {
                        if(oThis.IsPC && oThis.rowClickExpendRow && oThis.myShowType === "table-form") {

                            if(oThis.getTableComp().getExpandRow() === row) {
                                oThis.getTableComp().closeExpandRow();
                                expandFlag = false;
                                oThis.editBaseData = {};
                                oThis.editIndex = -1;
                                oThis.editRow = {};
                                let tableData = oThis.getTableData();
                                // tableData[oThis.editIndex] = oThis.editBaseData; // 一共4条数据，删除第二条，然后点击第三条就会变成第二条数据，因此删除，出现问题再完善
                                let tableIndex = tableData.indexOf(row);
                                this.editIndex = -1;
                                // oThis.getTableComp().toggleRowExpansion(row);
                            } else {
                                let tableData = oThis.getTableData();

                                // tableData[oThis.editIndex] = oThis.editBaseData; // 一共4条数据，删除第二条，然后点击第三条就会变成第二条数据，因此删除，出现问题再完善
                                let tableIndex = tableData.indexOf(row);
                                oThis.operIndex = tableIndex;
                                this.expandRow(row, tableIndex);
                            }
                            oThis.$emit("update:editable", false);
                        }
                        // oThis.$emit("row-click", row, event, column, expandFlag, scope);
                    }
                }

                otherProps.methods.expandRow = function (row, index,expanded) {
                    debugger
                    oThis.getTableComp().closeExpandRow();
                    if (oThis.IsPC) {
                        if((typeof expanded)==='boolean'){
                            oThis.getTableComp().toggleRowExpansion(row,expanded);
                        }else {
                            oThis.getTableComp().toggleRowExpansion(row);
                        }
                    }

                    this.editIndex = index;
                    oThis.formShow = false;
                    oThis.setEdit(row, index);
                    oThis.setFormData(row);
                };

                otherProps.methods.getTableComp = function () {
                    debugger
                    return this.$refs[oThis.tableRef];
                };
                otherProps.methods.getFormComp = function () {
                    return this.$refs[oThis.formRef];
                };

                otherProps.methods.getTableFormComp = function () {
                    return this.$refs[oThis.tableFormRef];
                };

                otherProps.methods.templateChangeFun = function (field, val, obj) {
                    obj = obj || {};
                    // if (oThis.handleValidateFormula(field, val) === false){
                    //   val = null;
                    //   oThis.setFormDataByField(field, val);
                    // }
                    // oThis.handleEditFormula(field, val);
                    oThis.editChange = true;
                    oThis.$emit("change", field, val, obj);
                };

                otherProps.methods.templateValueChangeFun = function (field, val) {
                    // if (oThis.handleValidateFormula(field, val) === false){
                    //   val = null;
                    //   oThis.setFormDataByField(field, val);
                    // }
                    oThis.handleEditFormula(field, val);
                };

                otherProps.methods.templateBeforeEditFun = function (field, comp, callback) {
                    if (oThis._events['before-edit'] && oThis._events['before-edit'].length > 0) {
                        oThis.$emit("before-edit", field, comp, callback);
                    } else {
                        callback.call(comp);
                    }
                };

                otherProps.methods.validate = function (callback, type) {
                    let ref;
                    if (!type && oThis.myShowType === 'table-form') {
                        type = this.formShow === true ? 'form' : 'table-form';
                    }
                    if (type === "form" || !type || oThis.myShowType === 'form') {
                        ref = oThis.formRef;
                    } else {
                        ref = oThis.tableFormRef;
                    }
                    this.$refs[ref].validate(valid => {
                        // if (valid){ //form验证通过后，触发验证公式
                        //   // valid = oThis.handleValidateFormula();
                        //   if(valid){
                        //   	callback.call(this, valid);
                        //   }
                        // }else{
                        callback.call(this, valid);
                        // }
                    });
                };

                otherProps.methods.doValidateFormula = function () {
                    return oThis.handleValidateFormula();
                };

                otherProps.methods.resetFields = function (type) {
                    let ref;
                    if (type === "form" || !type) {
                        ref = oThis.formRef;
                    } else {
                        ref = oThis.tableFormRef;
                    }
                    this.$refs[ref] && this.$refs[ref].resetFields();
                }

                otherProps.methods.clearErrorMessage = function (type) {
                    let ref;
                    if (type === "form" || !type) {
                        ref = oThis.formRef;
                    } else {
                        ref = oThis.tableFormRef;
                    }
                    this.$refs[ref] && this.$refs[ref].clearErrorMessage();
                }

                otherProps.methods.resetFormData = function (type) {
                    // 解决点击行之后再点击新增导致行的数据丢失的问题，后续改成调用清楚校验结果的方法
                    // this.resetFields();
                    this[oThis.formModel] = JSON.parse(
                        JSON.stringify(oThis.resBaseData[oThis.formModel])
                    );
                    setTimeout(() => {
                        this.clearErrorMessage();
                    })
                };

                otherProps.methods.getBaseFormData = function () {
                    return JSON.parse(JSON.stringify(oThis.resBaseData[oThis.formModel]));
                };

                otherProps.methods.handleClick = function (icon, scope, title) {
                    this.checkEditChange(() => {
                        oThis.$emit('table-click', icon, scope, title);
                        oThis.$emit(icon + "-table-click", scope, title);
                    })
                };

                otherProps.methods.formCancelClickResetData = function (type) {
                    if (type === 'table-form') {
                        let tableData = oThis.getTableData()||[];
                        if (oThis.editBaseData && oThis.editIndex > -1) {
                            try {
                                let data = JSON.parse(JSON.stringify(oThis.editBaseData));
                                oThis.editRow = data;
                                tableData[oThis.editIndex] = data;
                                oThis.setTableData(tableData);
                                oThis.setFormData(data);
                            } catch (e) {
                            }
                        }
                        oThis.tableShow = tableData.length > 0 ? true : false;
                    } else {
                        oThis.formShow = false;
                    }
                    oThis.editChange = false;
                };
                otherProps.methods.topNavBarClick = function () {
                    this.formCancelClick('table-form');
                };
                otherProps.methods.formCancelClick = function (type,row) {

                    if (type === 'table-form') {
                        let tableData = oThis.getTableData();
                        if (oThis.editBaseData) {
                            try {
                                let data = JSON.parse(JSON.stringify(oThis.editBaseData));
                                oThis.editRow = data;
                                tableData[oThis.editIndex] = data;
                                oThis.setTableData(tableData);
                                if (oThis.IsPC) {
                                    oThis.getTableComp().toggleRowExpansion(row);
                                }
                                oThis.setFormData(data);
                                if (!oThis.IsPC) {
                                    oThis.$context.getApp().back();
                                }
                            } catch (e) {
                            }
                        }
                        oThis.tableShow = tableData.length > 0 ? true : false;
                    } else {
                        oThis.formShow = false;
                    }
                    oThis.editChange = false;
                    oThis.$emit("update:editable", false);
                    oThis.$emit("form-cancel-click", type, oThis.editRow, oThis.editIndex);
                };

                otherProps.methods.formDeleteClick = function (type,row) {
                    let tableData = oThis.getTableData();
                    let index = tableData.indexOf(row);
                    oThis.$emit("form-delete-click", type, row, index);
                };

                otherProps.methods.formConfirmClick = function (type, row) {
                    let index;
                    if (oThis.IsPC) {
                        
                        let tableData = oThis.getTableData();
                        index = tableData.indexOf(row);
                    }
                    if (oThis.confirmClearEdit) {
                        oThis.clearEdit();
                    }
                    //table-form类型的模板保存时 触发显示公式
                    oThis.doShowFormula(type);
                    oThis.$emit("form-confirm-click", type, oThis.editRow, index);
                };

                otherProps.methods.formEditClick = function (type, row) {
                    let tableData = oThis.getTableData();
                    let index = tableData.indexOf(row);
                    oThis.setEdit(row, index);
                    oThis.$emit("update:editable", true);
                    oThis.$emit("form-edit-click", type, row, index);
                };
                // otherProps.beforeDestroy = function() {
                // 	// this.$options.data = null;
                // 	// this.$options.methods = null;
                // };
                let props = extend(true, {}, otherProps, baseProps);

                // 销毁之前的实例
                oThis.destroyComp();
                // if(this.comp && typeof this.comp.$destroy === 'function') {
                // 	this.comp.$destroy();
                // }
                let comp = Vue.extend(props);
                this.comp = new comp();
                let compMount = this.comp.$mount();
                // $(this.$el).find("div[inline=true]").remove();
                // $(this.$el).find("form").remove();
                $(this.$el).html("");
                this.$el.appendChild(compMount.$el);
                this.comp.$nextTick(() => {
                    if (oThis.tplDatause && oThis.tplDatause.ifxbptxempxlatxetaxblxemxodxel) {
                        oThis.setTableData(oThis.tplDatause.ifxbptxempxlatxetaxblxemxodxel);
                        delete oThis.tplDatause.ifxbptxempxlatxetaxblxemxodxel;
                    }
                    if (oThis.tplDatause && oThis.tplDatause.ifxbptxempxlatxefoxrmxemxodxel) {
                        oThis.setFormData(oThis.tplDatause.ifxbptxempxlatxefoxrmxemxodxel);
                        delete oThis.tplDatause.ifxbptxempxlatxefoxrmxemxodxel;
                    }
                    if (oThis.tplDatause && oThis.tplDatause.doShowFormulaTypes) {
                        for (var key in oThis.tplDatause.doShowFormulaTypes) {
                            //var type = oThis.tplDatause.doShowFormulaTypes[key];
                            delete oThis.tplDatause.doShowFormulaTypes[key];
                            oThis.doShowFormula(key);
                        }
                    }
                    oThis.$emit("after-create", oThis);
                });
            }
        }
    };
</script>
<style lang="less">
    .el-table tr .el-table-operate-icon:hover, .el-table-more-operate-item:hover {
        color: @myDefaultColor;
    }
</style>