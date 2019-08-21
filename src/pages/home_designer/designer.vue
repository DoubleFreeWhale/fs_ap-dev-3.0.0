<template>
    <div id="editor" class="boxscroll">
        <div id="app" v-drop v-on:click="backPanelClick"></div>
        <el-tools-panel ref="elToolsPanel" v-bind:actived_ele="real_actived_ele"></el-tools-panel>

    </div>
</template>

<script>
    import immutable from   './vendor/immutable'
    import directives from   './vendor/immutable'
    import compUtil from   './js/editor/compUtil'
    import businessType from   './res/businessType.json'
    import elToolsPanel from './components/elToolsPanel'

    export default {
        name: "designerold",
        components:{
            elToolsPanel
        },
        data(){
            return  {
                dType: 'uitemplate',
                actived_ele: null,
                real_actived_ele: null,
                refCodeSelectPk: {},
                refCodeSelectNoPk: null,
                currentModel: {},
                currentDom: null,
                model: immutable.Map({}),
                elementTree: {},
                modelHistories: [],
                currentModelIndex: 0,
                formInfo: {
                    name: '标题',
                    describe: '描述'
                },
                formType: [],
                pkMetadata: '', //关联的元数据
                baseTplData: {
                    rules: {},
                    headData: {},
                    headDataMeta: {},
                    editable: true
                },
                tplData: {
                    rules: {},
                    headData: {},
                    headDataMeta: {},
                    editable: true
                },
                // // 小部件参数
                layoutcontext: {},
                gadgeturl: '',
                id: '',
                shortcutarr: []

            }
        },
        watch: {
            currentDom: function() {},
            actived_ele: function(element) {
                if (!element) {
                    return;
                }
                var comp = element['comp'];
                this.currentModel = comp.$data;
            },
            formInfo: function(info) {
                parent.shell.formInfo = info;
            },
            formType: function(formtype) {
                parent.shell.formType = formtype;
            }
        },
        created: function () {
            window.isDesigner = true;
            this.dType = 'ovpdesigner';
            this.tplData.layoutcontext = {
                container: '',
                options: '',
                layoutMeta: {},
            };
            this.currentDom = $('<div id="form_top" v-on:click="backPanelClick" style="height:100%"><Page v-drop :layoutcontext="layoutcontext"></Page></div>');
        },
        methods: {

            /**
             * 选中组件
             */
            activeNode: function(element) {

                if (this.real_actived_ele)
                    $(this.real_actived_ele).removeClass('activedEle');
                if (element && element.tagName && element.tagName === 'TH') { // table中的表头点击
                    var $table = $(element).closest('.el-table')
                    var $tr = $(element).closest('tr')
                    var index = $tr.find('th').index(element);
                    var columnEle = $table.find('.hidden-columns').find('div')[index];
                    this.real_actived_ele = element;
                    this.actived_ele = columnEle;
                    this.$emit('updata',element,columnEle);
                    window.shell.real_actived_ele = element;
                    window.shell.actived_ele = columnEle;
                } else {
                    this.real_actived_ele = element;
                    this.actived_ele = element;
                    window.shell.real_actived_ele = element;
                    window.shell.actived_ele = element;
                    this.$emit('updata',element,element);
                }
                if (element)
                    $(element).addClass('activedEle');
            },
            /**
             * 删除
             */
            removeNode: function(element) {
                element = element || this.actived_ele;
                if (element) {
                    compUtil.removeDom(element);
                    this.refreshDom();
                    // $(this.actived_ele).remove();
                    this.actived_ele = null;
                    parent.shell.actived_ele = null;
                }
            },

            /**
             * 模型后退
             */
            modelBack: function() {
                this.model = this.modelHistories[--this.currentModelIndex]
            },
            /**
             * 模型前进
             */
            modelForward: function() {
                this.model = this.modelHistories[++this.currentModelIndex]
            },
            /**
             * 模型产生新变化
             */
            newModel: function(parentPath, currentName, comp) {
                if (this.currentModelIndex < this.modelHistories.length) {
                    this.modelHistories.splice(0, this.currentModelIndex + 1);
                }
                var keys = parentPath.split('.');
                keys.push(currentName);
                var currentCompInfo = comp.compInfo;
                this.model = this.model.setIn(keys, immutable.Map(currentCompInfo));
                this.modelHistories.push(this.model);
                this.currentModelIndex = this.modelHistories.length - 1;
            },
            /**
             * 点击背景面板
             */
            backPanelClick: function() {
                this.activeNode(null);
                // this.actived_ele = null;
            },
            dragLeave: function() {

            },
            /**
             * 获取表单模型
             */
            getModel: function(isEnable) {
                if (this.doGetModel)
                    return this.doGetModel(isEnable);
                else
                    return null;
            },
            /**
             * 保存
             * isEnable 是否启用
             */
            save: function(isEnable) {
                if (this.doSave)
                    this.doSave(isEnable);
            },
            clear: function() {
                if (this.doClear) {
                    this.doClear();
                } else {
                    this.currentDom = $('<div id="form_top" v-drop v-on:click="backPanelClick" style="height:100%"><div id="main_area" v-drop style="width:100%;height:100%;"><div id="table_area" v-drop style="width:100%;padding-bottom:30px;"></div><div id="form_area" v-drop style="width:100%;"></div></div></div>');
                    this.setTplData(this.baseTplData);
                    this.refreshDom();
                }
            },

            repair: function() {
                this.repairFormData();
                this.repairTableData();
                this.repairOvpData();
                this.$message('修复完成');
            },

            repairOvpData: function() {
                // this.currentDom.html('<page :layoutcontext="layoutcontext" v-co
                // mp="" v-drop="{muilt:true}">'+ this.currentDom.html() +'</page>');
                for (var i = 1; i <= window.engine.currentDom.children().length - 1; i++) {
                    window.engine.currentDom.children()[0].appendChild(window.engine.currentDom.children()[i]);
                    if (window.engine.currentDom.children().length > 1) {
                        this.repairOvpData();
                    }
                }
                this.refreshDom();
            },
            repairFormData: function() {
                var $form = this.currentDom.find('el-form');
                var table = $form.attr(':model');
                var $formItem = this.currentDom.find('el-form-item');
                var nowData = window.engine.getTplData();
                var nowFormData = nowData[table] || {};
                var newFormData = {};
                for (var i = 0; i < $formItem.length; i++) {
                    var $nowFormItem = $($formItem[i]);
                    if ($nowFormItem.attr('required') === 'required') {
                        $nowFormItem[0].setAttribute(':required', 'true')
                    }
                    var field = $nowFormItem.attr('prop');
                    newFormData[field] = nowFormData[field] || '';
                }
                nowData[table] = newFormData;
                window.engine.setTplData(nowData);
            },
            repairTableData: function() {
                var $table = this.currentDom.find('el-table');
                var $tableColumn = $table.find('el-table-column');
                var table = $table.attr(':data');
                var nowData = window.engine.getTplData();
                for (var i = 0; i < $tableColumn.length; i++) {
                    var $nowTableColumn = $($tableColumn[i]);
                    var nowProp = $nowTableColumn.attr('prop');
                    $nowTableColumn.attr('v-if', 'tableCoulmnVIf' + nowProp);
                    nowData['tableCoulmnVIf' + nowProp] = typeof nowData['tableCoulmnVIf' + nowProp] === 'undefined' ? true : nowData['tableCoulmnVIf' + nowProp];
                }
                nowData[table] = [];
                window.engine.setTplData(nowData);
            },
            /**
             * 加载
             */
            loadModel: function(model) {
                if (this.doLoadModel)
                    this.doLoadModel(model);
                this.refreshDom();
            },

            resetDomAttr: function($targetDom) {
                $targetDom.find('#main_area').attr('v-drop', '');
                $targetDom.find('#form_area').css('height', '');
                $targetDom.find('#form_area').removeAttr('v-show');
                $targetDom.find('#table_area').removeAttr('v-show');
                $targetDom.find('#table_area').css('height', '').css('paddingBottom', '30px');
            },

            /**
             * 递归装配页面,兼容老版本UI模板
             */
            assemDom: function(layoutDetail, $parentDom) {
                var adpMapping = businessType;

                var oThis = this,
                    $dom;
                if (Array.isArray(layoutDetail)) {
                    for (var i = 0; i < layoutDetail.length; i++) {
                        layoutDetail[i]._count = layoutDetail.length;
                        this.assemDom(layoutDetail[i], $parentDom)
                    }
                } else {
                    var originKey = key = layoutDetail.componentKey;
                    key = window.engine.getBusinessCompType(key);
                    /*原有ColumnPanel转化为el-row或者el-col的逻辑
                     if (key == 'ColumnPanel') {
                     if (!layoutDetail.subFormId) {
                     var count = layoutDetail._count || 1;
                     key = 'el-col'
                     layoutDetail.md = layoutDetail.md || (24 / count);
                     layoutDetail.sm = layoutDetail.sm || 24;
                     } else
                     key = 'el-row'
                     }
                     $dom = compUtil._getDefaultCompDom(key);
                     if (adpMapping[originKey] != undefined) {
                     var $formItemDom = compUtil._getDefaultCompDom('el-form-item');
                     $formItemDom.append($dom);
                     $parentDom.append($formItemDom);
                     } else {
                     $parentDom.append($dom);
                     }
                     compUtil._mergeCompAttr(key, $dom, layoutDetail);
                     if (layoutDetail.layoutDetail) {
                     oThis.assemDom(layoutDetail.layoutDetail, $dom)
                     }*/
                    if (key == 'ColumnPanel') {
                        if (layoutDetail.layoutDetail) {
                            oThis.assemDom(layoutDetail.layoutDetail, $parentDom)
                        }
                    } else if (key == 'el-table') {
                        $dom = compUtil._getDefaultCompDom(key);
                        var columns = layoutDetail.layoutDetail;
                        var field, formData;
                        var data = this.getTplData();
                        for (var i = 0; i < columns.length; i++) {
                            var column = columns[i];
                            if (column.isDisplay) {
                                field = compUtil.getFieldByField(column.itemCode);
                                formData = compUtil.getTableByField(column.itemCode);
                                var columnDom = window.engine.createComp('el-table-column', $dom, {
                                    prop: field,
                                    "v-if": 'tableCoulmnVIf' + field,
                                    label: column.title
                                });
                                data['tableCoulmnVIf' + field] = true;
                            }
                        }
                        $dom.attr(':data', formData);
                        // var data = this.getTplData();
                        data[formData] = data[formData] ? data[formData] : {};
                        this.setTplData(data);
                        var pp = $parentDom.parent();
                        $parentDom.remove();
                        pp.append($dom);
                    } else {
                        $dom = compUtil._getDefaultCompDom(key);
                        if (adpMapping[originKey] != undefined) {
                            var $formItemDom = compUtil._getDefaultCompDom('el-form-item');
                            if (layoutDetail.isDisplay) {
                                var field = compUtil.getFieldByField(layoutDetail.itemCode);
                                var formData = compUtil.getTableByField(layoutDetail.itemCode);
                                $formItemDom.attr('label', layoutDetail.title);
                                $formItemDom.attr('prop', field);
                                $dom.attr('v-model', layoutDetail.itemCode);
                                var r = layoutDetail.isReadonly || layoutDetail.readOnly;
                                $dom.attr(':disabled', r ? r : false);
                                if (key === 'el-select') {
                                    var options = layoutDetail.options;
                                    if (options.length > 0) {
                                        var selectOptionsVar = '';
                                        for (var i = 0; i < options.length; i++) {
                                            selectOptionsVar += '<el-option label="' + options[i].name + '" value="' + options[i].selectKey + '"></el-option>';
                                        }
                                        $dom.append(selectOptionsVar);
                                    }
                                }
                                if (key === 'el-ref') {
                                    $dom.attr('field', field);
                                    $dom.attr(':template-value', formData);
                                    $dom.attr('ref-code', layoutDetail.contMeta.refcode);
                                    $dom.attr(':is-muti-select', layoutDetail.isMutiSelect);
                                }
                                if (key === 'ifbp-multilingual') {
                                    $dom.attr('field', field);
                                    $dom.attr(':template-value', formData);
                                }
                                $formItemDom.append($dom);
                                $parentDom.append($formItemDom);

                                if (!$parentDom.attr(':model')) {
                                    var data = this.getTplData();
                                    data[formData] = data[formData] ? data[formData] : {};
                                    this.setTplData(data);
                                    $parentDom.attr(':model', formData);
                                }
                            }
                        } else {
                            $parentDom.append($dom);
                        }
                        compUtil._mergeCompAttr(key, $dom, layoutDetail);
                        if (layoutDetail.layoutDetail) {
                            oThis.assemDom(layoutDetail.layoutDetail, $dom)
                        }
                    }

                }
            },
            /**
             * 递归装配页面,兼容老版本UI模板
             */
            iformAssemDom: function(layoutDetail, $parentDom) {
                var adpMapping = {
                    "Text": "el-input",
                    "TextArea": "el-input",
                    "NumberComponent": "el-input",
                    "RadioBox": "el-radio",
                    "CheckBox": "el-checkbox",
                    "Select": "el-select",
                    "DateComponent": "el-date-picker",
                    "Money": "el-input",
                    "Reference": "el-ref",
                    "Grid": "el-table",
                    "Date": "el-date-picker",
                    "Mobile": "el-phone",
                    "CodeRule": "el-input" //TODO 需要增加
                    // "Label":"ifbp-label",
                    // "ImageComponent":"ifbp-image",
                    // "Email":"ifbp-email",
                    // "Phone":"ifbp-phone",
                }
                var oThis = this,
                    $dom;
                if (Array.isArray(layoutDetail)) {
                    for (var i = 0; i < layoutDetail.length; i++) {
                        layoutDetail[i]._count = layoutDetail.length;
                        this.iformAssemDom(layoutDetail[i], $parentDom)
                    }
                } else if (layoutDetail.layoutDetail && Array.isArray(layoutDetail.layoutDetail)) {
                    this.iformAssemDom(layoutDetail.layoutDetail, $parentDom);

                } else {
                    var originKey = key = layoutDetail.componentKey;
                    key = adpMapping[key] || key;
                    /*原有ColumnPanel转化为el-row或者el-col的逻辑
                     if (key == 'ColumnPanel') {
                     if (!layoutDetail.subFormId) {
                     var count = layoutDetail._count || 1;
                     key = 'el-col'
                     layoutDetail.md = layoutDetail.md || (24 / count);
                     layoutDetail.sm = layoutDetail.sm || 24;
                     } else
                     key = 'el-row'
                     }else if (key == 'el-input'){
                     if (layoutDetail.isTextArea == true){
                     key = 'el-textarea';
                     }
                     }
                     $dom = compUtil._getDefaultCompDom(key);
                     if (adpMapping[originKey] != undefined) {
                     var $formItemDom = compUtil._getDefaultCompDom('el-form-item');
                     $formItemDom.append($dom);
                     $parentDom.append($formItemDom);
                     } else {
                     $parentDom.append($dom);
                     }
                     compUtil._mergeCompAttr(key, $dom, layoutDetail);
                     if (layoutDetail.layoutDetail) {
                     oThis.iformAssemDom(layoutDetail.layoutDetail, $dom)
                     }*/
                    if (key == 'ColumnPanel') {
                        if (layoutDetail.layoutDetail) {
                            oThis.iformAssemDom(layoutDetail.layoutDetail, $parentDom)
                        }
                    } else if (key == 'el-table') {
                        $dom = compUtil._getDefaultCompDom(key);
                        var columns = layoutDetail.layoutDetail;
                        var field, formData;
                        var data = this.getTplData();
                        for (var i = 0; i < columns.length; i++) {
                            var column = columns[i];
                            if (column.isDisplay) {
                                field = compUtil.getFieldByField(column.itemCode);
                                formData = compUtil.getTableByField(column.itemCode);
                                var columnDom = window.engine.createComp('el-table-column', $dom, {
                                    prop: field,
                                    "v-if": 'tableCoulmnVIf' + field,
                                    label: column.title
                                });
                                data['tableCoulmnVIf' + field] = true;
                            }
                        }
                        $dom.attr(':data', formData);
                        // var data = this.getTplData();
                        data[formData] = data[formData] ? data[formData] : {};
                        this.setTplData(data);
                        var pp = $parentDom.parent();
                        $parentDom.remove();
                        pp.append($dom);
                    } else {
                        $dom = compUtil._getDefaultCompDom(key);
                        if (adpMapping[originKey] != undefined) {
                            var $formItemDom = compUtil._getDefaultCompDom('el-form-item');
                            if (layoutDetail.isDisplay) {
                                var field = compUtil.getFieldByField(layoutDetail.itemCode);
                                var formData = compUtil.getTableByField(layoutDetail.itemCode);
                                $formItemDom.attr('label', layoutDetail.title);
                                $formItemDom.attr('prop', field);
                                $dom.attr('v-model', layoutDetail.itemCode);
                                var r = layoutDetail.isReadonly || layoutDetail.readOnly;
                                $dom.attr(':disabled', r ? r : false);
                                if (key === 'el-select') {
                                    var options = layoutDetail.options;
                                    if (options.length > 0) {
                                        var selectOptionsVar = '';
                                        for (var i = 0; i < options.length; i++) {
                                            selectOptionsVar += '<el-option label="' + options[i].name + '" value="' + options[i].selectKey + '"></el-option>';
                                        }
                                        $dom.append(selectOptionsVar);
                                    }
                                }
                                if (key === 'el-ref') {
                                    $dom.attr('field', field);
                                    $dom.attr(':template-value', formData);
                                    $dom.attr('ref-code', layoutDetail.contMeta.refcode);
                                    $dom.attr(':is-muti-select', layoutDetail.isMutiSelect);
                                }
                                if (key === 'ifbp-multilingual') {
                                    $dom.attr('field', field);
                                    $dom.attr(':template-value', formData);
                                }
                                $formItemDom.append($dom);
                                $parentDom.append($formItemDom);
                                if (!$parentDom.attr(':model')) {
                                    var data = this.getTplData();
                                    data[formData] = data[formData] ? data[formData] : {};
                                    this.setTplData(data);
                                    $parentDom.attr(':model', formData);
                                }
                            }
                        } else {
                            $parentDom.append($dom);
                        }
                        compUtil._mergeCompAttr(key, $dom, layoutDetail);
                        if (layoutDetail.layoutDetail) {
                            oThis.iformAssemDom(layoutDetail.layoutDetail, $dom)
                        }
                    }

                }
            },

            refreshDom: function() {
                var oThis = this;
                if (this.refreshDomSetTime)
                    clearTimeout(this.refreshDomSetTime);
                this.refreshDomSetTime = setTimeout(function() {
                    try {
                        oThis.refreshDomFun();
                    } catch (e) {
                        console.warn(e);
                        oThis.resetAttr();
                    }

                }, 300);
            },

            resetAttr: function() {
                if (!window.top.changeObj)
                    return;
                var oThis = this;
                var element = window.top.changeObj.element;
                var attrs = window.top.changeObj.attrs;
                var attrObj = window.top.changeObj.attrObj;
                var attrName = attrObj.model;
                attrs[attrName] = window.top.changeObj.oldValue;
                compUtil.updateCompAttr(element, attrs, attrObj);
                oThis.$message({
                    showClose: true,
                    message: '属性修改错误，已将错误属性还原。'
                });
                this.refreshDom();
            },
            /**
             * 刷新DOM
             */
            refreshDomFun: function() {
                var oThis = this;
                Vue.config.errorHandler = function(err) {
                    if (typeof console !== 'undefined') {
                        console.error(err);
                        oThis.resetAttr();
                    } else {
                        oThis.resetAttr();
                        throw err
                    }
                }
                var _id = null;
                compUtil.repairAttr(this.currentDom);
                var tpl = this.currentDom.html();
                console.log(tpl);
                // this.currentDom.find('[v-model]')
                var data = this.tplData ? this.tplData : {};
                var Comp = Vue.extend({
                    data: function() {
                        return data;
                    },
                    template: '<div v-drop="{muilt: true}" style="height: 100%;">' + tpl + '</div>',
                    methods: {
                        backPanelClick: this.backPanelClick,
                        tableHeaderClick: this.tableHeaderClick
                    },
                    mounted: function() {
                        this.$nextTick(function() {
                            $('.el-table__header-wrapper th').each(function(index, ele) {
                                var $table = $(ele).closest('.el-table')
                                var $tr = $(ele).closest('tr')
                                var index = $tr.find('th').index(ele);
                                var columnEle = $table.find('.hidden-columns').find('div')[index];
                                if (columnEle && columnEle.comp) {
                                    var comp = columnEle.comp;
                                    ele.comp = comp;
                                    $(ele).attr('_id', $(columnEle).attr('_id'));
                                }
                                directives.selectDirective(ele);
                                directives.dndDirective(ele);
                            })
                            $('.boxscroll').perfectScrollbar();
                        })
                    }
                });
                var comp = new Comp().$mount();
                this.comp = comp;
                if (this.actived_ele) {
                    _id = $(this.actived_ele).attr('_id');
                }
                $('#app').empty().append(comp.$el);
                if (_id) {
                    var $el = $('[_id=' + _id + ']');
                    this.activeNode($el[0]);
                }
                $('.boxscroll').perfectScrollbar('update');

            },
            /**
             * 创建组件
             * @param {string} key 需要生成组件的类型
             * @param {DOM} element 组件的父层元素
             * @param {JSON} exAttr 组件需要设置的额外属性
             */
            createComp: function(key, parentEle, exAttr) {
                return compUtil.genComponentDom(key, parentEle, exAttr);
            },

            setRefByPk: function(result, $dom, pk) {
                if (result && result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        result[i].label = result[i].refname
                        result[i].value = result[i].refcode
                    }
                }
                if (pk) {
                    this.refCodeSelectPk[pk] = result;
                    if (result && result.length > 0) {
                        var refcode = result[0].refcode;
                        $($dom.children()[0]).attr('ref-code', refcode);
                    }
                } else {
                    this.refCodeSelectNoPk = result;
                }
            },

            /**
             * 创建form element 组件
             */
            createFormElementComp: function(param) {
                var oThis = this;
                var compAttr = param.compAttr;
                var ctrlType = compAttr.ctrltype;
                ctrlType = window.engine.getBusinessCompType(ctrlType);
                if (ctrlType === 'el-date-picker') {
                    if (compAttr.format === 'HH:mm:ss') {
                        ctrlType = 'el-time-picker';
                    }
                    if (compAttr.format === 'YYYY-MM-DD HH:mm:ss') {
                        compAttr.type = 'datetime';
                    } else {
                        compAttr.type = 'date';
                    }

                }
                var ele = param.ele;
                var fieldId = compAttr.code;
                var formData = compUtil.getTableByField(fieldId);
                var realField = compUtil.getFieldByField(fieldId);
                var data = this.getTplData();
                data[formData] = typeof data[formData] === 'object' ? data[formData] instanceof Array ? {} : data[formData] : {};
                data[formData][realField] = '';
                var name = compAttr.name;
                if (ctrlType === 'el-select') {
                    if (compAttr.select_type === 'checkbox') {
                        ctrlType = 'el-checkbox';
                        data[formData][realField] = false;
                    }
                }
                var attr = {
                    fieldId: fieldId,
                    label: name
                }
                if (compAttr.type) {
                    attr.type = compAttr.type;
                }

                if (ctrlType === 'ifbp-image') {
                    attr[':image-url'] = fieldId;
                }

                var $dom = window.engine.createComp(ctrlType, ele, attr);
                if (ctrlType === 'el-select') {
                    var selectOptions = compAttr['select_options'];
                    var selectOptionsVar = [];
                    for (var i = 0; i < selectOptions.length; i++) {
                        selectOptionsVar.push({
                            value: selectOptions[i].selectKey,
                            label: selectOptions[i].selectVal
                        })
                    }

                    data[realField + 'var'] = selectOptionsVar;
                    var html = '<el-option v-for="item in ' + realField + 'var' + '" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"> </el-option>';
                    $($dom.children()[0]).html(html);
                } else if (ctrlType === 'el-ref') {
                    var pk = compAttr.pk;
                    $($dom.children()[0]).attr('pk', pk);
                    if (pk) {
                        $.ajax({
                            type: "POST",
                            url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryRef",
                            data: {
                                pk_md: pk
                            },
                            dataType: "json",
                            async: false,
                            success: function(result) {
                                oThis.setRefByPk(result, $dom, pk);
                            },
                            error: function() {
                                oThis.setRefByPk(null, $dom, pk);
                            }
                        });
                    } else {
                        $.ajax({
                            type: "POST",
                            url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryRef",
                            dataType: "json",
                            async: false,
                            success: function(result) {
                                oThis.setRefByPk(result, $dom, pk);
                            },
                            error: function() {
                                oThis.setRefByPk(null, $dom, pk);
                            }
                        });
                    }
                }
                return $dom;
            },
            /**
             * 拖拽元数据批量创建form组件
             */
            batchCreateFormComp: function(comps, ele) {
                var formCreateFlag = false;
                for (var i = 0; i < comps.length; i++) {
                    var fieldId = comps[i].code;
                    var showFlag = comps[i].showFlag;
                    if (showFlag === "0") {
                        continue;
                    }
                    if (!formCreateFlag) {
                        if (fieldId) {
                            var formData = compUtil.getTableByField(fieldId);
                            var data = this.getTplData();
                            data[formData] = data[formData] ? data[formData] : {};
                            this.setTplData(data);
                        }
                        var $formEle = compUtil._getDefaultCompDom('el-form')
                        $formEle.attr(':inline', "true");
                        $formEle.attr(':model', formData);
                        compUtil._appendDom($formEle);
                        formCreateFlag = true;
                    }


                    window.engine.createFormElementComp({
                        compAttr: comps[i],
                        ele: $formEle[0]
                    });
                }
                this.refreshDom();
            },

            /**
             * 创建table column 组件
             */
            createTableColumnComp: function(param) {
                var compAttr = param.compAttr;
                var ctrlType = compAttr.ctrltype;
                var width = 150;
                if (ctrlType === 'Text' || (ctrlType === 'Select' && compAttr.select_type === 'select') || ctrlType === 'Reference' || ctrlType === 'DateComponent') {
                    width = 150;
                } else if (ctrlType === 'NumberComponent' || (ctrlType === 'Select' && compAttr.select_type === 'checkbox') || ctrlType === 'Money' || ctrlType === 'ImageComponent') {
                    width = 100;
                } else if (ctrlType === 'TextArea') {
                    width = 200;
                }

                var align = 'left';
                if (ctrlType === 'NumberComponent' || ctrlType === 'Money' || ctrlType === 'DateComponent') {
                    align = 'right';
                } else if (ctrlType === 'Select') {
                    align = 'center';
                }

                var renderType = 'default';
                var format = '';
                if (ctrlType === 'Reference') {
                    renderType = 'ref';
                } else if (ctrlType === 'Select' && compAttr.select_type === 'select') {
                    renderType = 'select';
                } else if (ctrlType === 'DateComponent') {
                    renderType = 'date';
                    format = compAttr.format;
                } else if (ctrlType === 'Money') {
                    renderType = 'money';
                } else if (ctrlType === 'NumberComponent') {
                    renderType = 'number';
                } else if (ctrlType === 'ImageComponent') {
                    renderType = 'image';
                }
                ctrlType = window.engine.getBusinessCompType(ctrlType);

                var fieldId = compAttr.code;
                fieldId = compUtil.getFieldByField(fieldId);
                var realField = compUtil.getFieldByField(fieldId);
                var data = this.getTplData();
                var name = compAttr.name;
                var ele = param.ele;

                var $dom = window.engine.createComp('el-table-column', ele, {
                    prop: fieldId,
                    "v-if": 'tableCoulmnVIf' + fieldId,
                    label: name,
                    width: width,
                    "render-type": renderType,
                    align: align,
                    format: format
                });
                data['tableCoulmnVIf' + fieldId] = true;
                if (ctrlType === 'el-select') {
                    var selectOptions = compAttr['select_options'];
                    var selectOptionsVar = [];
                    for (var i = 0; i < selectOptions.length; i++) {
                        selectOptionsVar.push({
                            value: selectOptions[i].selectKey,
                            label: selectOptions[i].selectVal
                        })
                    }
                    if (!data[realField + 'var']) {
                        data[realField + 'var'] = selectOptionsVar;
                    }
                    $dom.attr(':render-select-options-var', realField + 'var');
                }
                return $dom;
            },

            /**
             * 拖拽元数据批量创建table组件
             */
            batchCreateTableComp: function(comps, ele) {
                var tableCreateFlag = false;
                for (var i = 0; i < comps.length; i++) {
                    var fieldId = comps[i].code;

                    var showFlag = comps[i].showFlag;
                    if (showFlag === "0") {
                        continue;
                    }
                    if (!tableCreateFlag) {
                        if (fieldId) {
                            var tableData = compUtil.getTableByField(fieldId);
                            tableData = tableData + '_t';
                            var data = this.getTplData();
                            data[tableData] = data[tableData] ? data[tableData] : [];
                            this.setTplData(data);
                        }
                        var $tableEle = compUtil._getDefaultCompDom('el-table')
                        $tableEle.attr(':inline', "true");
                        $tableEle.attr(':data', tableData);
                        // $tableEle.attr('v-on:header-click', "tableHeaderClick");
                        compUtil._appendDom($tableEle);
                        tableCreateFlag = true;
                    }

                    window.engine.createTableColumnComp({
                        compAttr: comps[i],
                        ele: $tableEle[0]
                    });
                }
                this.refreshDom();
            },

            tableHeaderClick: function(column, e) {
                var eleId = column._id;
                if (e.stopPropagation)
                    e.stopPropagation();
                else {
                    e.cancelBubble = true;
                }
            },

            // 将元数据的类型转换为设计器的类型
            getBusinessCompType: function(type) {
                return businessType[type] ? businessType[type] : type;
            },

            /**
             * 移动元素
             */
            moveElement: function(srcElement) {
                var _id = $(srcElement).attr('_id');
                compUtil.moveDom(_id);
                this.refreshDom();
            },
            /**
             * 当前组件转换
             */
            converComp: function(type) {
                var comp = this.actived_ele['comp'];
                var data = comp.$data;
                var container = this.actived_ele.parentNode;
                $(comp.$el).remove();
                var newComp = this.createComp(type, container);
                this.activeNode(newComp.$el);
                var newData = newComp.$data;
                var excludeKeys = ['converType'];
                for (key in data) {
                    if (excludeKeys.indexOf(key) != -1)
                        continue;
                    if (newData[key] != 'undefined') {
                        newData[key] = data[key];
                    }
                }
            },
            /**
             * 获取组件对象
             */
            getComp: function(element) {
                var parentNode = element;
                while (parentNode.nodeName != 'BODY') {
                    if (parentNode['comp']) {
                        return parentNode['comp'];
                    }
                    parentNode = parentNode.parentNode;
                }
                return null;
            },
            /**
             * 获取父组件
             */
            getParentComp: function(component) {
                var parentEle = component.$el.parentNode;
                return this.getComp(parentEle);
            },
            getParentCompByKey: function(key, element) {
                if (!element) return null;
                var parentNode = element;
                while (parentNode.nodeName != 'BODY') {
                    if (parentNode['comp']) {
                        if (parentNode['comp'].$options._componentTag && parentNode['comp'].$options._componentTag == key)
                            return parentNode['comp'];
                    }
                    if (parentNode.tagName && parentNode.tagName.toLocaleUpperCase() === 'EL-FORM') {
                        return true;
                    }
                    parentNode = parentNode.parentNode;
                    if (!parentNode)
                        return null;
                }
                return null;
            },
            /**
             * 获取子对象
             */
            getChildCompEl: function(element) {
                var oThis = this;
                var target = null;
                var $childs = $(element).children();
                if ($childs.length > 0) {
                    for (var i = 0; i < $childs.length; i++) {
                        var ele = $childs[i];
                        if (ele['comp']) {
                            target = ele;
                        } else {
                            target = oThis.getChildCompEl(ele);
                        }
                        if (target)
                            return target;
                    }
                }
                return target;

            },

            getTplData: function() {
                return this.tplData;
            },
            setTplData: function(data) {
                this.tplData = data;
                console.log(data);
                this.refreshDom();
            }

        },
        mounted() {
            window.engine=this;
            this.refreshDom()
        }

    }

</script>

<style  lang="less">
    #editor  ps-scrollbar-x-rail {
        display: block;
    }
    fieldset {
        border: none;
    }

    #editor {
        width: 100%;
        height: 100%;
        background-color: #FFF;
        position: relative;

    }

    .form_div {
        border-bottom: 1px solid #C8C8CD;
    }

    #app {
        /* width:100%; */
        /* min-height: 300px;*/
        height: calc(100% - 88px);
        /* height :-webkit-calc(100% - 50px); */
        /* height:100%; */
        border: 20px solid #FFF;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        padding: 30px;
        background-color: #FFF;
        min-height: 100%;
        .form_title {
            height: 52px;
            line-height: 52px;
            text-align: center;
            font-size: 20px;
            color: #2D2D2D;
        }

        .form-description {
            width: 100%;
            padding-left: 30%;
            padding-right: 30%;
            padding-bottom: 16px;
            word-wrap: break-word;
            text-align: left;
            font-size: 14px;
            color: #8E8E93;
            position: relative;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
        }

        .el-col {
            min-height: 51px;
            background: rgb(240, 240, 245);
            border: 1px solid rgba(86, 61, 124, .2)
        }

        .targetEle {
            /* outline: 1px dashed #38adff; */
        }

        .activedEle {
            border: 1px solid #38adff
        }

        .drag-over {
            outline: 2px dashed #38adff
        }



        .dressTitle.draggable {
            cursor: move;
        }

        .dressTitle {
            background: #F1F0F5;
            height: 32px;
            line-height: 32px;
            padding: 0 5px;
        }

        .dressPad {
            padding: 10px 5px;
        }





        [class^="icon-"],
        [class*=" icon-"] {
            vertical-align: middle;
            text-transform: none;
            font-weight: normal;
            font-style: normal;
            font-variant: normal;
            font-family: 'icomoon';
            line-height: 1;
            /*speak: none;*/
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            -webkit-text-size-adjust: none;
            -moz-text-size-adjust: none;
            -ms-text-size-adjust: none;
        }

        .el-row {
            min-height: 51px;
        }

        .dorp_pos {
            float: left;
            width: 0px;
            min-height: 51px;
            height: 100%;
            outline: 2px dashed #38adff
        }

        .dorp_pos_h {
            /* float: left; */
            width: 100%;
            height: 20px;
            outline: 2px dashed #38adff;
        }

        .el-form {
            /* border: 1px dashed rgba(86, 61, 124, .2); */
            padding-bottom: 20px;
            margin-bottom: 10px;
        }

        .el-form-item {
            /* border: 1px dashed rgba(86, 61, 124, .2); */
            margin-bottom: 0px;
            padding: 5px 0px;
        }

        .el-col .el-form-item {
            border: 0px;
        }

        .el-table th.activedEle {
            border: 1px solid #38adff;
            border-bottom: 1px solid #38adff;
        }

        .el-table th.drag-over {
            border: 2px dashed #38adff;
            border-bottom: 2px dashed #38adff;
        }

        .boxscroll {
            overflow-y: auto;
            overflow-x: auto;
            /* overflow: auto; */
        }

        .el-form-item__label {
            color: #666666;
        }

        .el-form-panel {
            min-height: 40px;
        }

        .el-form-panel.el-form-panel-last {
            border-bottom: 1px;
        }

        .ifbp-panel-body {
            min-height: 50px;
        }

        .shortcut {
            width: 100%;
            overflow: hidden;
        }

        .shortcut li {
            float: left;
            list-style: none;
            height: 70px;
            border: 1px solid #F0F0F5;
            border-radius: 4px;
            text-align: center;
            overflow: hidden;
            padding-top: 30px;
            background: #ffffff;
            cursor: pointer;
            width: calc(25% - 14px);
            margin-right: 16px;
            box-shadow: 0 1px 2px 0 rgba(0,0,0,0.15);
        }

        .shortcut li:last-child {
            margin: 0;
        }

        .shortcut li img {
            width: 35px;
            height: 35px;
        }

        .shortcut .rightbox {
            float: right;
            text-align: left;
            width: 60%;
            padding-left: 8px;
        }

        .appIcon {
            font-size: 2rem;
            color: #9adfef;
        }

        .ui-grid {
            padding: 1px;
        }

        .ui-grid div[id*="gadget-site"] {
            margin-top: 15px;
            padding: 0 1px;
        }

        .page>.el-row {
            margin: 0!important;
        }
    }
    .dressTips {
        position: absolute;
        background: #fff;
        padding: 1px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font: 14px/1.5 arial, "Microsoft Yahei", "Hiragino Sans GB", sans-serif;
        font-size: 14px;
        color: #666;
    }
    .dressBtnBar {
        margin-left: -5px;
    }
    .dressBtnUl {
        margin: 0 0 0 5px;
        list-style: none;
        padding: 0;
        /* border: 1px solid #CBCBCB; */
        overflow: hidden;
        float: left;
    }

    .dressBtnUl li {
        width: 28px;
        text-align: center;
        line-height: 28px;
        float: left;
        /* color: #7F7F7F; */
        color: #409eff;
        cursor: pointer;
    }

</style>