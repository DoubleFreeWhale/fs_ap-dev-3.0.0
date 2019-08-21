
import compHelper from '../compHelper'

export  default {
  genRandomID: function () {
    return Math.random().toString(36).substr(2);
  },
  getCompDef: function (key, throwIfUndefined) {
    if (throwIfUndefined === undefined)
      throwIfUndefined = true;
    var comp = null;
    comp = this.getBaseCompDef(key) ||
        this.getLayoutDef(key) ||
        this.getFormCompDef(key) ||
        this.getBizCompDef(key) ||
        this.getSysCompDef(key);
    if (!comp && throwIfUndefined) {
      alert('组件:' + key + ' 未注册！');
      throw new Error('组件:' + key + ' 未注册！');
    }
    return comp;
  },
  /**
   * 组件的属性
   */

  getCompProperty: function (key) {
    var comp = this.getCompDef(key);
    var property = comp.property;
    compHelper.getCompProperty && compHelper.getCompProperty(property);
    return comp.property;
  },
  getFormCompArray: function () {
    if (compHelper.getFormCompArray)
      return compHelper.getFormCompArray();
    else
      return [];
  },
  getFormCompDef: function (key) {
    if (compHelper.getFormCompDef)
      return compHelper.getFormCompDef(key);
    else
      return null;
  },
  getLayoutArray: function () {
    if (compHelper.getLayoutArray)
      return compHelper.getLayoutArray();
    else
      return [];
  },
  getLayoutDef: function (key) {
    if (compHelper.getLayoutDef)
      return compHelper.getLayoutDef(key);
    else
      return null;
  },
  getSysCompArray: function () {
    if (compHelper.getSysCompArray)
      return compHelper.getSysCompArray();
    else
      return [];
  },
  getSysCompDef: function (key) {
    if (compHelper.getSysCompDef)
      return compHelper.getSysCompDef(key);
    else
      return null;
  },
  getBaseCompArray: function () {
    if (compHelper.getBaseCompArray)
      return compHelper.getBaseCompArray();
    else
      return [];
  },
  getBaseCompDef: function (key) {
    if (compHelper.getBaseCompDef)
      return compHelper.getBaseCompDef(key);
    else
      return null;
  },
  getBizCompArray: function () {
    if (compHelper.getBizCompArray)
      return compHelper.getBizCompArray();
    else
      return [];
  },
  getBizCompDef: function (key) {
    if (compHelper.getBizCompDef)
      return compHelper.getBizCompDef(key);
    else
      return null;
  },

  /**
   * 组件的指令
   */
  getCompDirective: function (key) {
    var comp = this.getCompDef(key);
    return comp.directive;
  },
  /**
   * 目前云表单用到,组件要生成的模型信息
   */
  getCompModel: function (key) {
    var comp = this.getCompDef(key);
    return comp.model;
  },
  _getCompInfo: function (key, compArray) {
    for (var i = 0; i < compArray.length; i++) {
      if (compArray[i].key == key) {
        return compArray[i]
      }
    }
    return null;
  },
  getCompInfo: function (key) {
    var compInfo = null;
    compInfo = this._getCompInfo(key, this.getBaseCompArray()) ||
        this._getCompInfo(key, this.getFormCompArray()) ||
        this._getCompInfo(key, this.getLayoutArray()) ||
        this._getCompInfo(key, this.getBizCompArray()) ||
        this._getCompInfo(key, this.getSysCompArray());
    return compInfo;
  },
  /**
   * 更新组件属性
   */
  updateCompAttr: function (element, attrs, attrObj) {
    var _id = $(element).attr('_id');
    var $dom = window.engine.currentDom.find('[_id=' + _id + ']');
    var attrName = attrObj.model;
    var attrType = attrObj.type;
    var oldValue = $dom.attr(attrName);
    if(attrs[attrName] === 'true'){
      attrs[attrName] = true;
    }else if(attrs[attrName] === 'false'){
      attrs[attrName] = false;
    }
    var attrValue = attrs[attrName];
    // 默认值的处理有问题，暂时去掉
    // if (attrValue === oldValue) {
    //   return;
    // }
    parent.changeObj = {};
    parent.changeObj.oldValue = $dom.attr(attrName);
    parent.changeObj.element = element;
    parent.changeObj.attrObj = attrObj;
    parent.changeObj.attrs = attrs;
    if (attrType === 'number') {
      attrValue = parseInt(attrValue);
    }
    if (this.setVueEditorAttr(element, attrs, attrObj)) {} else {
      $dom.attr(attrName, attrs[attrName]);
      if (typeof attrs[attrName] === 'undefined' || attrs[attrName] === null)
        $dom.removeAttr(attrName);
    }
    window.engine.refreshDom();
  },
  /**
   * 设计器改变时设置组件的属性
   */
  setVueEditorAttr: function (element, attrs, attrObj) {
    var _id = $(element).attr('_id');
    var $dom = window.engine.currentDom.find('[_id=' + _id + ']');
    var attrName = attrObj.model;
    var oldValue = $dom.attr(attrName);
    var attrValue = attrs[attrName];
    if (attrName === 'template') {
      $dom.html(attrs[attrName]);
      return true;
    } else if (this.isRule(attrName)) {
      var field = $dom.attr('v-model');
      this.updateRules(field, attrName, attrValue);
      return true;
    } else if (attrName === 'select-options-var' || attrName === 'radio-options-var' || attrName === 'checkbox-options-var') {
      if (attrName === 'select-options-var') {
        var html = '<el-option v-for="item in ' + attrs[attrName] + '" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"> </el-option>';
      } else if (attrName === 'radio-options-var') {
        var html = '<el-radio v-for="item in ' + attrs[attrName] + '"  :label="item.value" :disabled="item.disabled">{{item.label}}</el-radio>';
      } else if (attrName === 'checkbox-options-var') {
        var html = '<el-checkbox v-for="item in ' + attrs[attrName] + '"  :label="item.value"  :disabled="item.disabled">{{item.label}}</el-checkbox>';
      }
      $dom.html(html);
      var key = attrName.substring(0, attrName.indexOf('-var'));
      var data = window.engine.getTplData();
      data[attrValue] = data[attrValue] || [];
      window.engine.setTplData(data);
      attrs[key] = window.engine.tplData[attrValue];
      return true;
    } else if (attrName === 'select-options' || attrName === 'radio-options' || attrName === 'checkbox-options' || attrName === ':render-select-options') {
      var attrNameVar = attrName + '-var';
      var tplData = window.engine.getTplData();
      tplData[attrs[attrNameVar]] = attrs[attrName];
      window.shell.tplDataStr = JSON.stringify(tplData);
      window.shell.setEngineTplData();
      return true;
    } else if (attrName === 'compType') {
      var _id = $dom.attr('_id');
      var vModel = $dom.attr('v-model');
      var table = this.getTableByField(vModel);
      var field = this.getFieldByField(vModel);
      var ref = $dom.attr('ref');
      var oldCompType = $dom[0].localName;
      var newCompType = attrs[attrName];
      var compInfo = this.getCompInfo(newCompType);
      var $newdom = this._getDefaultCompDom(compInfo);
      $newdom.attr('_id', _id);
      $newdom.attr('v-model', vModel);
      $newdom.attr('ref', ref);
      if (compInfo.type === 'formelement') {
        $newdom.attr(':editable', 'editable');
      }
      var arr = ['el-select', 'el-radio-group', 'el-checkbox-group'];
      if (arr.indexOf(newCompType) > -1) {
        var selectOptionsVar = '';
        if (arr.indexOf(oldCompType) > -1) {
          var $elOption = $($dom.children()[0]);
          var vForStr = $elOption.attr('v-for');
          if (vForStr)
            var selectOptionsVar = vForStr.substring(vForStr.indexOf('in') + 3);
        }
        if (!selectOptionsVar) {
          selectOptionsVar = 'testOptionsVar';
        }
        if (newCompType === 'el-select') {
          var html = '<el-option v-for="item in ' + selectOptionsVar + '" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"> </el-option>';
        } else if (newCompType === 'el-radio-group') {
          var html = '<el-radio v-for="item in ' + selectOptionsVar + '" :label="item.value"  :disabled="item.disabled">{{item.label}}</el-radio>';
        } else if (newCompType === 'el-checkbox-group') {
          var html = '<el-checkbox v-for="item in ' + selectOptionsVar + '" :label="item.value"  :disabled="item.disabled">{{item.label}}</el-checkbox>';
        }
        $newdom.append(html);
      }

      if(newCompType === 'el-ref' || newCompType === 'ifbp-address-ref'){
        $newdom.attr(':template-value',table);
        $newdom.attr('field',field);
      }

      $dom.parent().append($newdom);
      $dom.remove();
      return true;
    } else if (attrName === 'show-index') {
      if (attrValue) {
        $dom.prepend('<el-table-column type="index" width="70" align="center" header-align="center"></el-table-column>');
      } else {
        $dom.find('[type=index]').remove();
      }

      return true;
    } else if (attrName === 'show-multi') {
      if (attrValue) {
        var indexColumn = $dom.find('[type=index]');
        if (indexColumn.length > 0) {
          indexColumn.after('<el-table-column type="selection" align="center" header-align="center" width="50"></el-table-column>');
        } else {
          $dom.prepend('<el-table-column type="selection" align="center" header-align="center" width="50"></el-table-column>');
        }

      } else {
        $dom.find('[type=selection]').remove();
      }
      return true;
    } else if ((attrName === ':data' && $dom[0].localName === 'el-table') || (attrName === ':model' && $dom[0].localName === 'el-form')) {
      if ($dom[0].localName === 'el-form') {
        if (oldValue) {
          var htmlStr = window.engine.currentDom[0].innerHTML;
          var reg = new RegExp(oldValue, 'gm');
          htmlStr = htmlStr.replace(reg, attrValue);
          window.engine.currentDom.html(htmlStr);
        }
      }
      var data = window.engine.getTplData();
      if ($dom[0].localName === 'el-form') {
        data[attrValue] = data[oldValue] || {};
      } else {
        data[attrValue] = data[oldValue] || [];
      }
      delete data[oldValue];
      window.engine.setTplData(data);
    } else if (attrName === 'v-model') {
      if (attrValue.indexOf('.') > 0) {
        // formItem中的编辑组件
        var table = this.getTableByField(attrValue);
        var field = this.getFieldByField(attrValue);
        var oldTable = table;
        if (oldValue) {
          var oldTable = this.getTableByField(oldValue);
          var oldField = this.getFieldByField(oldValue);
        }
        var data = window.engine.getTplData();
        data[table] = data[oldTable] || {};
        data[table][field] = data[oldTable][oldField];
        delete data[oldTable][oldField];
        window.engine.setTplData(data);
      }
    } else if (attrName === 'defaultValue') {
      var Vmodel = attrs['v-model'];
      if (!Vmodel) {
        window.engine.$message({
          showClose: true,
          message: '请先设置绑定属性',
          type: 'error'
        });
        $dom.attr(attrName, '');
        return true;
      } else {
        if (Vmodel.indexOf('.') > 0) {
          // formItem中的编辑组件
          var table = this.getTableByField(Vmodel);
          var field = this.getFieldByField(Vmodel);
          var data = window.engine.getTplData();
          var realField = '';
          if(field.indexOf('.') > -1){
            realField = field.substring(field.indexOf('.') + 1)
          }
          data[table] = data[table] || {};
          if(realField){
            data[table].beanMap = data[table].beanMap || {};
            data[table].beanMap[realField] = attrs['defaultValueShowValue'];
          }else{
            data[table][field] = attrs['defaultValueShowValue'];
          }
          if(attrs['defaultValueRealValue']){
            data.defaultValueRealValue = data.defaultValueRealValue || {};
            data.defaultValueRealValue[table] = data.defaultValueRealValue[table] || {};
            if(realField){
              data.defaultValueRealValue[table].beanMap = data.defaultValueRealValue[table].beanMap || {};
              data.defaultValueRealValue[table].beanMap[realField] = attrs['defaultValueRealValue'];
            }else{
              data.defaultValueRealValue[table][field] = attrs['defaultValueRealValue'];
            }
          }else{
            try{
              if(realField){
                delete data.defaultValueRealValue[table].beanMap[realField];
              }else{
                delete data.defaultValueRealValue[table][field];
              }

            }catch(e){

            }
          }
          window.engine.setTplData(data);
        }
        return false;
      }
    }
    else if(attrName === ':rules' || attrName === ':query-params'){
      var data = window.engine.getTplData();
      data[attrValue] = data[oldValue] || {};
      if(attrValue != oldValue){
        delete data[oldValue];
      }
      window.engine.setTplData(data);
    }else if(attrName === ':fetch-suggestions' || attrName === ':on-error' || attrName === ':on-success' || attrName === ':summary-method' || attrName === ':top-summary-method' ){
      var methods = window.engine.getTplMethods();
      methods[attrValue] = methods[oldValue] || {};
      if(attrValue != oldValue){
        delete methods[oldValue];
      }
      window.engine.setTplMethods(methods);
    }else if(attrName === ':action'){
      var data = window.engine.getTplData();
      data[attrValue] = data[oldValue] || "";
      if(attrValue != oldValue){

        delete data[oldValue];
      }
      window.engine.setTplData(data);
    }else if(attrName === 'render-template'){
      $dom.html('');
      var prop = $dom.attr('prop');
      if(attrValue === 'user-name'){
        $dom.html('<template scope="scope"><div class="uitemplate-user-name"><ifbp-table-image :name="scope.row.' +prop + '" :index="scope.$index"></ifbp-table-image><ifbp-tooltip class="cell table-image-cell" :content="scope.row.' +prop + '"></ifbp-tooltip></div></template>');
      }else if(attrValue === 'user-name-a'){
        $dom.html('<template scope="scope"><div class="uitemplate-user-name-a"><ifbp-table-image :name="scope.row.' +prop + '" :index="scope.$index"></ifbp-table-image><a @click="tableCellClick(scope)" class="cell table-image-cell">{{scope.row.' +prop + '}}</a></div></template>');
      }
    }
    return false;
  },


  getTableByField: function (field) {
    return field.substring(0, field.indexOf('.'))
  },
  getFieldByField: function (field) {
    return field.substring(field.indexOf('.') + 1);
  },
  /**
   * 是否是校验规则属性
   */
  isRule: function (key) {
    if (key == 'minlength' || key == 'maxlength' || key == 'min' || key == 'max') {
      return true;
    } else {
      return false;
    }
  },


  /**
   * 更新校验规则
   */
  updateRules: function (field, ruleName, ruleValue) {
    if(ruleValue === null || ruleValue === 'null'){
      ruleValue = ''
    }
    var rules = window.engine.tplData.rules;
    var fieldPath = field.split('.');
    var realField = fieldPath[1];
    if(realField === 'beanMap'){
      realField = 'beanMap.' + fieldPath[2]
    }
    rules[realField] = rules[realField] || [];
    var ruleArr = rules[realField];

    var rule = this.genRule(ruleName, ruleValue);
    for (var i = 0; i < ruleArr.length; i++) {
      if (ruleArr[i][ruleName] != undefined) {
        if(ruleValue === '' || !ruleValue){
          ruleArr.splice(i);
          if(ruleArr.length === 0){
            delete rules[fieldPath[1]];
          }
        }else{
          ruleArr[i] = rule;
        }
        window.engine.setTplData(window.engine.tplData);
        return;
      }
    }
    if(ruleValue === ''){
      delete rules[realField];
    }else{
      ruleArr.push(rule);
    }
    window.engine.setTplData(window.engine.tplData);
  },

  /**
   * 生成默认规则
   */
  genRule: function (name, value) {
    var rule;
    if (name == 'min') {
      rule = {
        trigger: 'blur',
        message: '输入长度不能小于' + value
      };
    } else if (name == 'max') {
      rule = {
        trigger: 'blur',
        message: '输入长度不能大于' + value
      };
    }
    rule[name] = parseInt(value);
    return rule;
  },

  /**
   * 选中元素时根据vue组件设置设计器属性
   *
   */
  setEditorEditorAttr: function (key, element, model) {
    var domId = $(element).attr('_id');
    var eleDom = window.engine.currentDom.find('[_id=' + domId + ']');
    if (key === 'template') { // select是存在template的，后续其他组件需要逐渐测试是否使用此方式
      model[key] = eleDom[0].innerHTML;
    } else if (this.isRule(key)) {
      var rule = this.getCompRule(element, key);
      model[key] = rule == null ? '' : rule[key];
      return true;
    } else if (key === 'select-options-var' || key === 'radio-options-var' || key === 'checkbox-options-var') {
      var $elOption = $(eleDom.children()[0]);
      var vForStr = $elOption.attr('v-for');
      var selectOptionsVar = '';
      if (vForStr)
        var selectOptionsVar = vForStr.substring(vForStr.indexOf('in') + 3);
      model[key] = selectOptionsVar;
      return true;
    } else if (key === 'select-options' || key === 'radio-options' || key === 'checkbox-options' || key === ':render-select-options') {
      var keyVar = key + '-var';
      model[key] = window.engine.tplData[model[keyVar]];
      return true;
    } else if (key === 'compType') {
      model[key] = eleDom[0].localName;
      return true;
    } else if (key === 'disabled') {
      model[key] = eleDom.attr(key) === 'disabled' ? true : false;
      return true;
    }
    /*else if (key === 'required') {
           model[key] = eleDom.attr(key) === 'required' ? true : false;
           return true;
         } */
    else if (key === 'hide' || key === 'default-hide' || key === ':is-muti-select' || key === ':not-leaf-selectable' || key === ':show-pagination' || key === ':required' || key === ':show-summary' || key === ':table-tree' || key === ':expand-tree-all' || key === ':multiple' || key === ':clearable' || key === ':sortable' || key === ':fetch-on-enter') {
      model[key] = eleDom.attr(key) === "true" ? true : false;
      return true;
    } else if(key === ':show-header'){
      if(typeof eleDom.attr(key) === 'undefined'){
        model[key] = true;
      }else{
        model[key] = eleDom.attr(key) === "true" ? true : false;
      }
      return true;
    } else if (key === 'show-index') {
      model[key] = eleDom.find('[type=index]').length > 0 ? true : false;
      return true;
    } else if (key === 'show-multi') {
      model[key] = eleDom.find('[type=selection]').length > 0 ? true : false;
      return true;
    } else if (key === 'defaultValue') {
      if(model['v-model']){
        var fieldId = model['v-model'];
        var table = this.getTableByField(fieldId);
        var field = this.getFieldByField(fieldId);
        if(field.indexOf('.')> -1){
          var realField = field.substring(field.indexOf('.') + 1);
          model[key] = window.engine.tplData[table] && window.engine.tplData[table].beanMap && window.engine.tplData[table].beanMap[realField]
        }else{
          if(element.className === "el-checkbox-group"){
            model[key] = new Array();
            if(window.engine.tplData[table]){
              window.engine.tplData[table][field] = new Array();
            }

          }else{
            model[key] = window.engine.tplData[table] && window.engine.tplData[table][field];
          }
        }

        return true;
      }
    } else if (key === 'showFormula' || key === 'editFormula'){
      model[key] = eleDom.attr(key)
    } else if (key === 'render-template'){
      var html = eleDom.html();
      var attrValue = 'default';
      if(html.indexOf('uitemplate-user-name') > -1){
        attrValue = 'user-name'
      }else if(html.indexOf('uitemplate-user-name-a') > -1){
        attrValue = 'user-name-a'
      }
      model[key] = attrValue
    }
    return false;
  },
  /**
   * 获取校验规则
   */
  getCompRule: function (element, key) {
    var _id = $(element).attr('_id');
    var $dom = window.engine.currentDom.find('[_id=' + _id + ']');
    var field = $dom.attr('v-model');
    if (!field) return;
    var rules = window.engine.tplData.rules || {};
    var fieldPath = field.split('.');
    var rule = fieldPath[1];
    if(rule === 'beanMap')
      rule = 'beanMap.' + fieldPath[2];
    var ruleArr = rules[rule];
    if (!ruleArr)
      return null;
    if (!key) {
      return ruleArr;
    } else {
      for (var i = 0; i < ruleArr.length; i++) {
        if (typeof ruleArr[i][key] != 'undefined' && ruleArr[i][key] != null) {
          return ruleArr[i];
        }
      }
      return null;
    }
  },
  _appendDom: function ($dom) {
    this._appendDomFun($dom);
    this._resetDropVar();
  },

  _appendDomFun: function ($dom) {
    if (compHelper._appendDomFun) {
      compHelper._appendDomFun($dom);
    } else {
      var $target;
      if (window.dropId === 'root') {
        var targetEle = window.engine.currentDom;
        $(targetEle).append($dom);
      } else {
        var targetEle = window.engine.currentDom.find('[_id=' + window.dropId + ']');
        if (window.dropType == 'insertBefore') {
          $dom.insertBefore($(targetEle));
        } else {
          $(targetEle).append($dom);
        }
      }
    }
  },

  _resetDropVar: function () {
    window.$dropPosDom && window.$dropPosDom.remove && window.$dropPosDom.remove();
    window.dropType = null;
    window.dropId = null;
  },
  /**
   * 拖拽时生成组件
   * @param {string} key 需要生成组件的类型
   * @param {JSON} exAttr 组件需要设置的额外属性
   */

  genComponentDom: function (key, parentEle, exAttr, param) {
    var $dom, $outerDom, $tempDom, exTable, exField;
    var cannotBeParent = ['el-form-item', 'el-table-column'];
    var compInfo = this.getCompInfo(key);
    if (!compInfo) {
      alert('不支持的类型' + key);
      console.log(key + 'exAttr' + JSON.stringify(exAttr));
      return;
    }
    var data = window.engine.getTplData();
    $outerDom = $dom = this._getDefaultCompDom(compInfo);
    if (exAttr) {
      for (var k in exAttr) {
        $dom.attr(k, exAttr[k]);
      }
      if (exAttr.fieldId) {
        exTable = this.getTableByField(exAttr.fieldId);
        exField = this.getFieldByField(exAttr.fieldId);
        if(param.compAttr.is_dynamic === 'Y'){
          exField = 'beanMap.' + exField;
        }
      }

    }
    if (compInfo.type == 'formelement') {
      $dom.removeAttr('v-if');
      data.editable = typeof data.editable === 'undeinfed' ? true : data.editable;
      $dom.attr(':editable', 'editable');

      if (exAttr && exAttr.fieldId) {
        var vModel = exAttr.fieldId;
        if(param.compAttr.is_dynamic === 'Y'){
          var fields = exAttr.fieldId.split('.');
          vModel = ''
          for(var i = 0; i< fields.length; i++){
            if(i === (fields.length - 1)){
              vModel += 'beanMap.' + fields[i];
            }else{
              vModel += fields[i] + '.'
            }
          }
        }
        $dom.attr('v-model', vModel);
      }
      if (compInfo.key === 'el-ref' || compInfo.key === 'ifbp-address-ref' || compInfo.key === 'ifbp-multilingual'|| compInfo.key === 'ifbp-file-upload') {
        $dom.attr('field', exField);
        $dom.attr(':template-value', exTable);
      }
      if (compInfo.key === 'ifbp-image') {
        $dom.attr(':image-url', exTable+"."+exField);
        data.action = "action";
      }

      if(compInfo.key === 'el-date-picker' || compInfo.key === 'el-time-picker'){
        $dom.attr(':valuetoms', true);
      }
      $outerDom = this._getDefaultCompDom('el-form-item');
      if (exAttr && exAttr.label) {
        $outerDom.attr('label', exAttr.label);
      }
      if (exAttr && exAttr['v-if']) {
        $outerDom.attr('v-if', exAttr['v-if']);
      }
      if (exAttr && exAttr.fieldId) {
        var propV = exField;
        // if(param.compAttr.is_dynamic === 'Y'){
        // propV = 'beanMap.' + exField;
        // }
        $outerDom.attr('prop', propV);
      }
      $dom.removeAttr('fieldid');
      $dom.removeAttr('label');
      $outerDom.append($dom);
      //云表单生成字段信息
      compHelper._genFieldInfo && compHelper._genFieldInfo(key, $dom, $outerDom);

      if (parentEle && cannotBeParent.indexOf(parentEle.localName) < 0) { // 一种情况下el-form在外部创建，此时需要传入，另外一种情况需要创建el-form
        $(parentEle).append($outerDom);
      } else {
        this._appendDomFun($outerDom);
      }
      if (!window.engine.getParentCompByKey('el-form', $outerDom[0])) {
        $tempDom = $outerDom;
        if (exAttr && exAttr['fieldId']) {
          var fieldId = exAttr['fieldId'];
          if (fieldId) {
            var formData = this.getTableByField(fieldId);
            data[formData] = data[formData] ? data[formData] : {};
          }
        }
        $outerDom = this._getDefaultCompDom('el-form');
        $outerDom.append($tempDom);
        this._appendDomFun($outerDom);
      }
      this._resetDropVar();
    } else if (compInfo.type === 'tablecolumn') {
      if (parentEle && cannotBeParent.indexOf(parentEle.localName) < 0) { // 一种情况下el-form在外部创建，此时需要传入，另外一种情况需要创建el-form
        $(parentEle).append($outerDom);
      } else {
        this._appendDomFun($outerDom);
      }
    } else if (compInfo.key === 'el-form-panel') {
      if (parentEle) {
        $(parentEle).append($outerDom);
      }
      if (!window.engine.getParentCompByKey('el-form', $outerDom[0])) {
        $tempDom = $outerDom;
        $outerDom = this._getDefaultCompDom('el-form');
        $outerDom.append($tempDom);
        this._appendDomFun($outerDom);
      }
    }else {
      this._appendDom($outerDom);
    }
    window.engine.setTplData(data);
    return $outerDom;
  },
  moveDom: function (id) {
    var $dom = window.engine.currentDom.find('[_id=' + id + ']');
    this._appendDom($dom);
  },
  /**
   * 获取组件模板
   */
  _getDefaultCompDom: function (key) {
    var content, $dom, tpl = '',
        oThis = this;
    if (typeof key == 'object') {
      content = key['content']
      key = key['key'];
    }
    if (content) {
      tpl = content;
      $dom = $(tpl);
      $dom.find('[v-comp]').each(function (index, element) {
        $(element).attr('_id', oThis.genRandomID());
        oThis._setDefaultAttr($dom, element.tagName);
      });
      if ($dom.attr('v-comp') != 'undefined') {
        $dom.attr('_id', this.genRandomID());
        oThis._setDefaultAttr($dom, $dom[0].tagName);
      }
    } else {
      var dirs = this.getCompDirective(key);
      tpl = '<' + key + ' _id=' + this.genRandomID() + ' ' + dirs + ' >' + '</' + key + '>';
      $dom = $(tpl);
      this._setDefaultAttr($dom, key);
    }
    if (key === 'el-form') {
      $dom.attr(':inline', "true");
      $dom.attr(':rules', "rules");
      $dom.attr('label-width', "150px");
      $dom.attr(':adaptation', "true");
    }
    compHelper._getDefaultCompDom && compHelper._getDefaultCompDom(key, $dom);
    return $dom;
  },
  /**
   * 设置组件默认值
   */
  _setDefaultAttr: function ($dom, key) {
    key = key.toLowerCase();
    var property = this.getCompProperty(key);
    for (var i = 0; i < property.length; i++) {
      if (property[i].default != undefined) {
        $dom.attr(property[i].model, property[i].default);
      }
    }

  },
  /**
   * 补充组件属性
   */
  repairAttr: function ($dom) {
    var oThis = this;
    if ($dom.parent().length == 0) {
      $dom.attr('_id', 'root');
    }
    $dom.each(function (index, ele) {
      var $ele = $(ele),
          tagName = ele.tagName.toLowerCase();
      if (!$ele.attr('_id')) {
        $ele.attr('_id', oThis.genRandomID());
      }
      var compDef = oThis.getCompDef(tagName, false);
      var dirs = (compDef && compDef.directive) ? compDef.directive.trim() : "";
      if (dirs) {
        dirs = dirs.split(' ');
        for (var i = 0; i < dirs.length; i++) {
          var dirArr = dirs[i].split('=');
          if ($ele.attr(dirArr[0]) === undefined) {
            $ele.attr(dirArr[0], dirArr[1] || "");
          }
        }
      }
      if ($ele.attr('id') === 'form_top' || $ele.attr('id') === 'main_area' || $ele.attr('id') === 'table_area' || $ele.attr('id') === 'form_area') {
        $ele.attr('v-drop', "");
      }
      oThis.repairAttr($ele.children());
    })
  },
  /**
   * 删除节点
   */
  removeDom: function (element) {
    var _id = $(element).attr('_id');
    var $dom = window.engine.currentDom.find('[_id=' + _id + ']');
    //删除TplData中的值
    var prop = $dom.attr('prop');
    var tplData = window.engine.getTplData();
    tplData['editFormulas'] = {};
    tplData.editFormulas['id'] = [{originalFormula: "defitem1defitem1defitem1"}]
    window.engine.setTplData(tplData)
    //编辑公式  显示公式 校验公式
    //表格
    if( $dom[0] && $dom[0].tagName === "EL-TABLE-COLUMN"){
      if(tplData['showFormulas'] && tplData['showFormulas']['table'] && tplData['showFormulas'][prop]){
        delete tplData['showFormulas']['table'][prop];
      }
      window.TableColumnCreated = window.TableColumnCreated || [];
      var index = window.TableColumnCreated.indexOf(prop)
      if(index > -1){
        window.TableColumnCreated.splice(index,1)
      }
    }else{
      if(tplData['editFormulas'] && tplData['editFormulas'][prop]){
        delete tplData['editFormulas'][prop];
      }
      if(tplData['validateFormulas'] && tplData['validateFormulas'][prop]){
        delete tplData['validateFormulas'][prop];
      }
      if(tplData['showFormulas'] && tplData['showFormulas']['form'] && tplData['showFormulas'][prop]){
        delete tplData['showFormulas']['form'][prop];
      }
      window.formElementCreated = window.formElementCreated || [];
      var index = window.formElementCreated.indexOf(prop)
      if(index > -1){
        window.formElementCreated.splice(index,1)
      }
    }
    window.engine.setTplData(tplData)
    //删除字段信息
    compHelper.removeField && compHelper.removeField($dom);
    $dom.remove();
  },
  /**
   * 移动元素至底部或顶部
   */
  removeDomToTop: function (element,position) {
    var _id = $(element).attr('_id');
    var $dom = window.engine.currentDom.find('[_id=' + _id + ']');
    //获取父级元素
    var father = $dom.parent();
    //移除当前元素
    $dom.remove();
    father.prepend($dom.get(0));

  },
  removeDomToButtom: function (element) {
    var _id = $(element).attr('_id');
    var $dom = window.engine.currentDom.find('[_id=' + _id + ']');
    //获取父级元素
    var father = $dom.parent();
    //移除当前元素
    $dom.remove();
    father.append($dom.get(0));
  },
  /**
   * drop前事件
   */
  onBeforeDrop: function(key, callback){
    var compInfo = this.getCompInfo(key);
    if (key === 'ifbp-template'){
      parent.shell.selectUITemplate(function(template){
        var attrArr = []
        attrArr.push({name:'funnode',value:template.funnode})
        attrArr.push({name:'nexuskey',value:template.nexuskey})
        attrArr.push({name:'tplName',value:template.tempname})
        callback(attrArr);
        // window.engine.refreshDom();
      });
    }
    // 由于创建formitem的时候会自动创建form，因此去掉此处的判断
    // else if (compInfo.type === 'formelement') {
    //   var $targetEle = window.engine.currentDom.find('[_id=' + window.dropId + ']');
    //   if (!window.engine.getParentCompByKey('el-form', $targetEle[0])){
    //     window.engine.$message({
    //       message: '表单组件必须拖放到表单布局内！',
    //       type: 'warning',
    //       duration:5000,
    //       showClose:true
    //     });
    //     _cleanDropMark();
    //   }else{
    //     callback();
    //   }
    // }
    else{
      callback();
    }
  },
  /**
   *兼容旧版本，合并组件属性
   */
  _mergeCompAttr: function (key, $dom, attrs) {
    if (key == 'el-col') {
      $dom.attr(':md', attrs.md);
      $dom.attr(':sm', attrs.sm);
    } else if (key == 'el-input') {

    } else if (key == 'el-form-item') {
      $dom.attr('label', attrs.title);
      $dom.attr('required', attrs.required);
    }
  },
  /**
   * 删除dom中的v-comp v-drag等属性
   */
  removeDesignAttr: function ($dom) {
    var oThis = this;
    $dom.each(function (index, ele) {
      var $ele = $(ele);
      // $ele.removeAttr('_id');
      $ele.removeAttr('v-comp');
      $ele.removeAttr('v-dnd');
      $ele.removeAttr('v-drop');
      $ele.removeAttr('v-drag');
      $ele.removeAttr('v-select');
      oThis.removeDesignAttr($ele.children());
    })
  },


}