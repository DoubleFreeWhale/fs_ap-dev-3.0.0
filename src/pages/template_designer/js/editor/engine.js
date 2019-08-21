require([
  // 'dnd', 
  'immutable',
  'jquery',
  'directives',
  'compUtil',
  'text!res/businessType.json',
  // 'text!js/editor/defaultModel.json',
  // 'loadComponents', 
  // 'text!/js/editor/components.json', 
  'engineMixin',
  'elToolsPanel',
  'scrollbar',
], function (immutable, jq, directives, compUtil, businessType, engineMixin) {
  businessType = JSON.parse(businessType);
  //添加指令
  directives.addDirectives(Vue);
  Vue.prototype.ifbp_configs = Vue.prototype.ifbp_configs || {
    mode: 'design',
    query_uitemplate_url: 'http://localhost:58080/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryTemplateByCode'
  }

  /**
   * vue初始化
   */
  parent.engine = window.engine = new Vue({
    mixins: [engineMixin],
    el: '#editor',
    data: {
      dType: 'uitemplate',
      actived_ele: null,
      real_actived_ele: null,
      refCodeSelectPk: {},
      refCodeSelectNoPk: null,
      currentModel: {},
      currentScript:{},
      currentStyle:{},
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
      baseTplData:{
        rules: {},
        headData: {},
        headDataMeta: {},
        editable: true
      },
      tplData: {
        rules: {},
        headData: {},
        headDataMeta: {},
        editable: true,

      },
      tplMethods:{
      	
      },
    },
    computed:{
    	isNewtem:function(){
    		return parent.shell.isNewtem;
    	}
    },
    watch: {
      currentDom: function () {},
      actived_ele: function (element) {
        if (!element) {
          return;
        }
        var comp = element['comp'];
        this.currentModel = comp.$data;
      },
      formInfo: function (info) {
        parent.shell.formInfo = info;
      },
      formType: function (formtype) {
        parent.shell.formType = formtype;
      }
    },
    methods: {

      /**
       * 选中组件
       */
      activeNode: function (element) {
        if (this.real_actived_ele)
          $(this.real_actived_ele).removeClass('activedEle');
        if (element && element.tagName && element.tagName === 'TH') { // table中的表头点击
          var $table = $(element).closest('.el-table')
          var index = $(element).attr('baseindex');
          var columnEle = $table.find('.hidden-columns').find('div')[index];
          this.real_actived_ele = element;
          this.actived_ele = columnEle;
          parent.shell.real_actived_ele = element;
          parent.shell.actived_ele = columnEle;
        } else {
          this.real_actived_ele = element;
          this.actived_ele = element;
          parent.shell.real_actived_ele = element;
          parent.shell.actived_ele = element;
        }

        if (element)
          $(element).addClass('activedEle');
      },
      /**
       * 删除
       */
      removeNode: function (element) {
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
       * 置顶 
       */
      removeToTop:function(element){
      	 element = element || this.actived_ele;     
	        if (element) {
            compUtil.removeDomToTop(element);
	          this.refreshDom();
	       /*   this.actived_ele = null;
	          parent.shell.actived_ele = null;*/
	        }
      },
       /**
       * 置底
       */
      removeToBottom:function(element){
      	 element = element || this.actived_ele;     
	        if (element) {
            compUtil.removeDomToButtom(element);
	          this.refreshDom();
	       /*   this.actived_ele = null;
	          parent.shell.actived_ele = null;*/
	        }
      },
      /**
       * 模型后退
       */
      modelBack: function () {
        this.model = this.modelHistories[--this.currentModelIndex]
      },
      /**
       * 模型前进
       */
      modelForward: function () {
        this.model = this.modelHistories[++this.currentModelIndex]
      },
      /**
       * 模型产生新变化
       */
      newModel: function (parentPath, currentName, comp) {
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
      backPanelClick: function () {
        this.activeNode(null);
        // this.actived_ele = null;
      },
      dragLeave: function () {

      },
      /**
       * 获取表单模型
       */
      getModel: function (isEnable) {
        if (this.doGetModel)
          return this.doGetModel(isEnable);
        else
          return null;
      },
      /**
       * 保存
       * isEnable 是否启用
       */
      save: function (isEnable) {
        if (this.doSave)
          this.doSave(isEnable);
      },
      clear: function () {
        this.currentDom = $('<div id="form_top" v-drop v-on:click="backPanelClick" style="height:100%"><div id="main_area" v-drop style="width:100%;height:100%;"><div id="table_area" v-drop style="width:100%;padding-bottom:30px;"></div><div id="form_area" v-drop style="width:100%;"></div></div></div>');
        this.setTplData(this.baseTplData);
        this.refreshDom();
      },

      business: function(){
        this.businessFormData();
        this.businessTableData();
        this.$message('同步完成');
      },

      businessFormData: function(){
        var $form = this.currentDom.find('el-form');
        var table = $form.attr(':model');
        var $formItem = this.currentDom.find('el-form-item');
        var nowData = window.engine.getTplData();
        var nowFormData = nowData[table] || {};
        var newFormData = {};
        for (var i = 0; i < $formItem.length; i++) {
          var $nowFormItem = $($formItem[i]);
          if($nowFormItem.attr('prop').indexOf('.') > -1){
            var field = $nowFormItem.attr('prop').substring($nowFormItem.attr('prop').indexOf('.') + 1);
          }else{
            var field = $nowFormItem.attr('prop');
          }
          var fieldId = table + '.' + field;
          var vModel = table + '.' + $nowFormItem.attr('prop');
          var nowBusinessObj = window.parent.shell.treeDataObj[fieldId];
          if(nowBusinessObj && typeof nowBusinessObj.length != 'undefined' && nowBusinessObj.length != 0 && nowBusinessObj.length != '0' && nowBusinessObj.length){
            $nowFormItem.attr('max',nowBusinessObj.length);
            compUtil.updateRules(fieldId, 'max', nowBusinessObj.length);
          }else{
            $nowFormItem.attr('max','');
            compUtil.updateRules(fieldId, 'max', '');
          }
          if(nowBusinessObj && nowBusinessObj.ctrltype === 'DateComponent'){
            $nowFormItem.attr('max','');
            compUtil.updateRules(fieldId, 'max', '');
          }
          if(nowBusinessObj && nowBusinessObj.ctrltype === 'Select'){
            $nowFormItem.attr('max','');
            compUtil.updateRules(fieldId, 'max', '');
          }
          if(nowBusinessObj && nowBusinessObj.ctrltype === 'ImageComponent'){
            $nowFormItem.attr('max','');
            compUtil.updateRules(fieldId, 'max', '');
          }
          
          if(nowBusinessObj && typeof nowBusinessObj.max_value != 'undefined'){
            $nowFormItem.find('[v-model="'+vModel+'"]').attr(':max-value',nowBusinessObj.max_value);
          }
  
          if(nowBusinessObj &&  typeof nowBusinessObj.min_value != 'undefined'){
            $nowFormItem.find('[v-model="'+vModel+'"]').attr(':min-value',nowBusinessObj.min_value);
          }

          if(nowBusinessObj &&  typeof nowBusinessObj.default_value != 'undefined'){
            if(nowBusinessObj.is_dynamic === 'Y'){
              newFormData.beanMap = newFormData.beanMap || {};
              newFormData.beanMap[field] = nowBusinessObj.default_value;
            }
          }else{
            if(nowBusinessObj.is_dynamic === 'Y'){
              newFormData.beanMap = nowFormData.beanMap || {};
              newFormData.beanMap[field] = nowFormData.beanMap[field];
            }
          }
        }
        nowData[table] = newFormData;
        window.engine.setTplData(nowData);
      },
      businessTableData: function(){
        var $table = this.currentDom.find('el-table');
        var $tableColumn = $table.find('el-table-column');
        var table = $table.attr(':data');
        var nowData = window.engine.getTplData();
        for(var i = 0;i < $tableColumn.length; i++){
          var $nowTableColumn = $($tableColumn[i]);
          var nowProp = $nowTableColumn.attr('prop');
          var fieldId = table.substring(0,table.length - 2) + '.' + nowProp;
          var nowBusinessObj = window.parent.shell.treeDataObj[fieldId];
          if(nowBusinessObj && nowBusinessObj.ctrltype === 'Reference'){
            $nowTableColumn.attr('pk',nowBusinessObj.pk)
          }
        }
      },

      repair: function () {
        this.repairFormData();
        this.repairTableData();
        this.$message('修复完成');
      },


      repairFormData: function () {
        var $form = this.currentDom.find('el-form');
        var table = $form.attr(':model');
        var rules = $form.attr(':rules');
        var $formItem = this.currentDom.find('el-form-item');
        var nowData = window.engine.getTplData();
        var nowFormData = nowData[table] || {};
        var newFormData = {};
        if(rules){
          nowData[rules] = nowData[rules] || {};
        }
        for (var i = 0; i < $formItem.length; i++) {
          var $nowFormItem = $($formItem[i]);
          if($nowFormItem.attr('required') === 'required'){
            $nowFormItem[0].setAttribute(':required','true')
            $nowFormItem[0].removeAttribute('required')
          }
          var field = $nowFormItem.attr('prop');
          var realField = '';
          if(field.indexOf('.') > -1){
            realField = field.substring(field.indexOf('.') + 1)
          }

          if(field && typeof field !== 'undefined' && field !== 'undefined'){
            if(realField){
              $nowFormItem.attr('v-if','formItemVIf' + realField);
              newFormData.beanMap = newFormData.beanMap || {};
              newFormData.beanMap[field] = typeof newFormData.beanMap[field] === 'undefined'? '' : newFormData.beanMap[field];
              nowData['formItemVIf' + realField] = typeof nowData['formItemVIf' + realField] === 'undefined'? true:nowData['formItemVIf' + realField];
            }else{
              $nowFormItem.attr('v-if','formItemVIf' + field);
              newFormData[field] = typeof nowFormData[field] === 'undefined'? '' : nowFormData[field];
              nowData['formItemVIf' + field] = typeof nowData['formItemVIf' + field] === 'undefined'? true:nowData['formItemVIf' + field];
            }
          }
        }
        var $datePick = this.currentDom.find('el-date-picker');
        $datePick.attr(':valuetoms','true');
        var $timePick = this.currentDom.find('el-time-picker');
        $timePick.attr(':valuetoms','true');
        nowData[table] = newFormData;
        window.engine.setTplData(nowData);
      },
      repairTableData: function(){
        var $table = this.currentDom.find('el-table');
        var $tableColumn = $table.find('el-table-column');
        var table = $table.attr(':data');
        var nowData = window.engine.getTplData();
        for(var i = 0;i < $tableColumn.length; i++){
          var $nowTableColumn = $($tableColumn[i]);
          var nowProp = $nowTableColumn.attr('prop');
          var realNowProp = '';
          if(nowProp && nowProp.indexOf('.') > -1){
            realNowProp = nowProp.substring(nowProp.indexOf('.') + 1)
          }
          if(realNowProp){
            $nowTableColumn.attr('v-if','tableCoulmnVIf' + realNowProp);
          }else{
            $nowTableColumn.attr('v-if','tableCoulmnVIf' + nowProp);
          }
          $nowTableColumn.attr(':sortable','true');
          // 根据renderType设置对其方式
          var renderType = $nowTableColumn.attr('render-type');
          var align = 'left';
          if(renderType === 'select' || renderType === 'boolean'){
            align = 'center';
          }else if(renderType === 'date' || renderType === 'number' || renderType === 'money'  || renderType === 'percent'){
            align = 'right';
          }

          $nowTableColumn.attr('align',align);
          $nowTableColumn.attr('header-align',align);

          if(realNowProp){
            nowData['tableCoulmnVIf' + realNowProp] = typeof nowData['tableCoulmnVIf' + realNowProp] === 'undefined'? true:nowData['tableCoulmnVIf' + realNowProp];
          }else{
            nowData['tableCoulmnVIf' + nowProp] = typeof nowData['tableCoulmnVIf' + nowProp] === 'undefined'? true:nowData['tableCoulmnVIf' + nowProp];
          }
        }
        nowData[table]  = [];
        window.engine.setTplData(nowData);
      },
      /**
       * 加载
       */
      loadModel: function (model) {
        if (this.doLoadModel)
          this.doLoadModel(model);
        this.refreshDom();
      },

      resetDomAttr: function ($targetDom) {
        $targetDom.find('#main_area').attr('v-drop', '');
        $targetDom.find('#form_area').css('height', '');
        $targetDom.find('#form_area').removeAttr('v-show');
        $targetDom.find('#table_area').removeAttr('v-show');
        $targetDom.find('#table_area').css('height', '').css('paddingBottom', '30px');
      },

      /**
       * 递归装配页面,兼容老版本UI模板
       */
      assemDom: function (layoutDetail, $parentDom) {
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
                $formItemDom.attr('v-if', 'formItemVIf' + field);
                data['formItemVIf' + field] = true;
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
                if (key === 'ifbp-address-ref') {
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
      iformAssemDom: function (layoutDetail, $parentDom) {
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
                $formItemDom.attr('v-if', 'formItemVIf' + field);
                data['formItemVIf' + field] = true;
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
                if (key === 'ifbp-address-ref') {
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

      refreshDom: function () {
        var oThis = this;
        if (this.refreshDomSetTime)
          clearTimeout(this.refreshDomSetTime);
        this.refreshDomSetTime = setTimeout(function () {
          try {
            oThis.refreshDomFun();
          } catch (e) {
            console.warn(e);
            oThis.resetAttr();
          }

        }, 300);
      },

      resetAttr: function () {
        if (!window.parent.changeObj)
          return;
        var oThis = this;
        var element = window.parent.changeObj.element;
        var attrs = window.parent.changeObj.attrs;
        var attrObj = window.parent.changeObj.attrObj;
        var attrName = attrObj.model;
        attrs[attrName] = window.parent.changeObj.oldValue;
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
      refreshDomFun: function () {
        var oThis = this;
        Vue.config.errorHandler = function (err) {
          if (typeof console !== 'undefined') {
            console.error(err);
            oThis.resetAttr();
          } else {
            oThis.resetAttr();
            throw err
          }
        }
        Vue.config.warnHandler = function (err) {
          if(err.indexOf('Error compiling template') > -1){
            oThis.resetAttr();
          }
        }
        var _id = null;
        compUtil.repairAttr(this.currentDom);
        var tpl = this.currentDom.html();
        console.log(tpl);
        var formItems = this.currentDom.find('el-form-item');
        window.formElementCreated = [];
        for(var ii = 0; ii < formItems.length; ii++){
          window.formElementCreated.push($(formItems[ii]).attr('prop'))
        }
        var tableColums = this.currentDom.find('el-table-column');
        window.TableColumnCreated = [];
        for(var jj = 0; jj < tableColums.length; jj++){
          window.TableColumnCreated.push($(tableColums[jj]).attr('prop'))
        }
        // this.currentDom.find('[v-model]')
        var data = this.tplData ? this.tplData : {};
        var Omethods = {};
        Omethods.methods = {   
        		backPanelClick: this.backPanelClick,
            tableHeaderClick: this.tableHeaderClick
        }
        if(this.tplMethods){
        	 for(var key in this.tplMethods){    
					  Omethods.methods[key] = function(){}
        	}
    	  }    
        var Comp = Vue.extend({
          data: function () {
            return data;
          },
		
          template: '<div v-drop="{muilt: true}">' + tpl + '</div>',
          methods:Omethods.methods,
          mounted: function () {
            this.$nextTick(function () {
              var tableDirFun = function(index, ele){
                if(!$(ele).hasClass('is-hidden')){
                  var $table = $(ele).closest('.el-table')
                  var index = $(ele).attr('baseindex');
                  var columnEle = $table.find('.hidden-columns').find('div')[index];
                  if (columnEle && columnEle.comp) {
                    var comp = columnEle.comp;
                    ele.comp = comp;
                    $(ele).attr('_id', $(columnEle).attr('_id'));
                  }
                  directives.selectDirective(ele);
                  directives.dndDirective(ele);
                }
              }
              $('.el-table__header-wrapper th').each(function (index, ele) {
                tableDirFun(index,ele)
              })

              $('.el-table__fixed .el-table__fixed-header-wrapper th').each(function (index, ele) {
                tableDirFun(index,ele)
              })
              $('.el-table__fixed-right .el-table__fixed-header-wrapper th').each(function (index, ele) {
                tableDirFun(index,ele)
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
       * @param {JSON} exAttr 业务对象属性信息
       */
      createComp: function (key, parentEle, exAttr, param) {
        return compUtil.genComponentDom(key, parentEle, exAttr, param);
      },

      setRefByPk: function (result, $dom, pk) {
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
      createFormElementComp: function (param) {
        var oThis = this;
        var compAttr = param.compAttr;
        var ctrlType = compAttr.ctrltype;
        ctrlType = window.engine.getBusinessCompType(ctrlType);
        if (ctrlType === 'el-date-picker') {
          compAttr.length = null;
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
        var name = compAttr.name;
        var formData = compUtil.getTableByField(fieldId);
        var realField = compUtil.getFieldByField(fieldId);
        var data = this.getTplData();

        window.formElementCreated = window.formElementCreated || [];
        var index = window.formElementCreated.indexOf(realField) 
        if(index > -1){
          this.$message({
            showClose: true,
            message: '元素' + name + '已经存在，不能重复拖拽'
          });
          return;
        }else{
          window.formElementCreated.push(realField)
        }
        

        data[formData] = typeof data[formData] === 'object' ? data[formData] instanceof Array ? {} : data[formData] : {};
        if(param.compAttr.is_dynamic === 'Y'){
          data[formData].beanMap = data[formData].beanMap || {};
          data[formData].beanMap[realField] = '';
        }else{
          data[formData][realField] = '';
        }
        
        if (ctrlType === 'el-select') {
          if (compAttr.select_type === 'checkbox') {
            ctrlType = 'el-checkbox';
            if(param.compAttr.is_dynamic === 'Y'){
              data[formData].beanMap = data[formData].beanMap || {};
              data[formData].beanMap[realField] = false;
            }else{
              data[formData][realField] = false;
            }
          }
        }
        var field = compUtil.getFieldByField(fieldId);
        var attr = {
          fieldId: fieldId,
          "v-if": 'formItemVIf' + field,
          label: name
        }
        data['formItemVIf' + field] = true;
        if (compAttr.type) {
          attr.type = compAttr.type;
        }

        // 处理元数据中带过来的属性 begin
        if(typeof compAttr.length != 'undefined' && compAttr.length != 0 && compAttr.length != '0' && compAttr.length && compAttr.ctrltype !== 'Select' && compAttr.ctrltype !== 'DateComponent' && compAttr.ctrltype !== 'ImageComponent'){
          attr.max = compAttr.length;
          compUtil.updateRules(fieldId, 'max', attr.max);
        }

        if(typeof compAttr.max_value != 'undefined'){
          attr[':max-value'] = compAttr.max_value;
        }

        if(typeof compAttr.min_value != 'undefined'){
          attr[':min-value'] = compAttr.min_value;
        }

        if(typeof compAttr.default_value != 'undefined'){
          var table = compUtil.getTableByField(fieldId);
          var field = compUtil.getFieldByField(fieldId);
          var data = window.engine.getTplData();
          data[table] = data[table] || {};
          if(param.compAttr.is_dynamic === 'Y'){
            data[table].beanMap = data[table].beanMap || {};
            data[table].beanMap[field] = compAttr.default_value
          }else{
            data[table][field] = compAttr.default_value;
          }
          window.engine.setTplData(data);
        }

        // 处理元数据中带过来的属性 end

        var $dom = window.engine.createComp(ctrlType, ele, attr, param);
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
              success: function (result) {
                oThis.setRefByPk(result, $dom, pk);
              },
              error: function () {
                oThis.setRefByPk(null, $dom, pk);
              }
            });
          } else {
            $.ajax({
              type: "POST",
              url: "/uitemplate_web/uitemplate_ctr/uitemplate_design_ctr/queryRef",
              dataType: "json",
              async: false,
              success: function (result) {
                oThis.setRefByPk(result, $dom, pk);
              },
              error: function () {
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
      batchCreateFormComp: function (comps, ele) {
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
      createTableColumnComp: function (param) {
        var compAttr = param.compAttr;
        
        var ctrlType = compAttr.ctrltype;
        var width = 150;
        if (ctrlType === 'Text' || (ctrlType === 'Select' && compAttr.select_type === 'select') || ctrlType === 'Reference' || ctrlType === 'DateComponent' || ctrlType === 'MultiLangText') {
          width = 150;
        } else if (ctrlType === 'NumberComponent' || (ctrlType === 'Select' && compAttr.select_type === 'checkbox') || ctrlType === 'Money' || ctrlType === 'ImageComponent') {
          width = 100;
        } else if (ctrlType === 'TextArea') {
          width = 200;
        }

        var align = 'left';
        
        if(ctrlType === 'NumberComponent' || ctrlType === 'Money' || ctrlType === 'DateComponent'){
          align = 'right';
        }else if(ctrlType === 'Select'){
          align = 'center';
        }
        var headerAlign = align;
        
        var renderType = 'default';
        var format = '';
        if (ctrlType === 'Reference') {
          renderType = 'ref';
        } else if (ctrlType === 'Select' && compAttr.select_type === 'select') {
          renderType = 'select';
        } else if (ctrlType === 'Select' && compAttr.select_type === 'checkbox') {
          renderType = 'boolean';
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

        window.TableColumnCreated = window.TableColumnCreated || [];
        var index = window.TableColumnCreated.indexOf(realField) 
        if(index > -1){
          this.$message({
            showClose: true,
            message: '元素' + name + '已经存在，不能重复拖拽'
          });
          return;
        }else{
          window.TableColumnCreated.push(realField)
        }

        var propV = fieldId;
        if(param.compAttr.is_dynamic === 'Y'){
          propV = 'beanMap.' + fieldId;
        }

        var $dom = window.engine.createComp('el-table-column', ele, {
          prop: propV,
          "v-if": 'tableCoulmnVIf' + fieldId,
          label: name,
          width: width,
          "render-type": renderType,
          align: align,
          "header-align": headerAlign,
          format: format
        }, param);
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
        }else if (ctrlType === 'el-ref') {
          var pk = compAttr.pk;
          $dom.attr('pk',pk);
         }
        return $dom;
      },

      /**
       * 拖拽元数据批量创建table组件
       */
      batchCreateTableComp: function (comps, ele) {
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

      tableHeaderClick: function (column, e) {
        var eleId = column._id;
        if (e.stopPropagation)
          e.stopPropagation();
        else {
          e.cancelBubble = true;
        }
      },

      // 将元数据的类型转换为设计器的类型
      getBusinessCompType: function (type) {
        return businessType[type] ? businessType[type] : type;
      },

      /**
       * 移动元素
       */
      moveElement: function (srcElement) {
        var _id = $(srcElement).attr('_id');
        compUtil.moveDom(_id);
        this.refreshDom();
      },
      /**
       * 当前组件转换
       */
      converComp: function (type) {
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
      getComp: function (element) {
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
      getParentComp: function (component) {
        var parentEle = component.$el.parentNode;
        return this.getComp(parentEle);
      },
      getParentCompByKey: function (key, element) {
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
      getChildCompEl: function (element) {
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

        // $(element).children().each(function (index, ele) {
        //   if (ele['comp']) {
        //     target = ele;
        //   } else {
        //     target = oThis.getChildCompEl(ele);
        //   }
        //   if (target)
        //     return target;
        // })
        // return target;
      },

      getTplData: function () {
        return this.tplData;
      },
      setTplData: function (data) {
        var vm = this;
        this.tplData = data;
        if(window.parent && window.parent.shell){
          window.parent.shell.setTplDataStr();
          this.refreshDom();
        }else{
          setTimeout(function(){
            vm.setTplData(data);
          },100);
        }
      },
      getTplMethods:function(){
      	return this.tplMethods;
      },
      setTplMethods: function (methods) {
        var vm = this;
        this.tplMethods = methods;
        if(window.parent && window.parent.shell){
          window.parent.shell.setTplDataStr();
          this.refreshDom();
        }else{
          setTimeout(function(){
            vm.setTplData(data);
          },100);
        }
      },
      

    }
  });

  window.engine.refreshDom();
  parent.ready && parent.ready();
  // $(function () {
  //   parent.shell.ready();
  // })

});