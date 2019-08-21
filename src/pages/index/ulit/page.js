var PageModel = function(options){
  // this.router = options.router;
  this.options = options || {};
  this.pageConfig = this.options.pageConfig || {};
  // this.otherTemplates = {};
  // this.dynamicArea = {};
}
/**
 * 获取按钮
 * @param {*} compId
 */
PageModel.prototype.getButtons = function(compId){
  var tpl = this.getTemplate(compId);
  return tpl ?  tpl.btnList : null;
}

/**
 * 根据event获取按钮
 * @param {*} compId
 * @param {*} event
 */
PageModel.prototype.getButtonByEvent = function(compId,event){
  var tpl = this.getTemplate(compId);
  var btn = null;
  if(Array.isArray(tpl.btnList) && tpl.btnList.length) {
    for (var i = 0; i < tpl.btnList.length; i++) {
      if(tpl.btnList[i].event === event){
        btn = tpl.btnList[i]
      }
    }
  }
  return btn;
}
//左间按钮
PageModel.prototype.getTitleRightButtons = function(compId){
  var tpl = this.getTemplate(compId);
  var titleRightButtons = [];
  if(Array.isArray(tpl.btnList) && tpl.btnList.length) {
    for (var i = 0; i < tpl.btnList.length; i++) {
      if(tpl.btnList[i].btn_position === 'title_right') {
        titleRightButtons.push(tpl.btnList[i]);
      }
    }
    if(Array.isArray(titleRightButtons) && titleRightButtons.length) {
      for (var i = 0; i < titleRightButtons.length; i++) {
        this.options.page.triggerClick(titleRightButtons[i]);
      }
    }
  }
  return titleRightButtons ?  titleRightButtons : null;
}
//行间按钮
PageModel.prototype.getInnerButtons = function(compId){
  var tpl = this.getTemplate(compId);
  var innerButtons = [];
  if(Array.isArray(tpl.btnList) && tpl.btnList.length) {
    for (var i = 0; i < tpl.btnList.length; i++) {
      if(tpl.btnList[i].btn_position === 'row_inner') {
        innerButtons.push(tpl.btnList[i]);
      }
    }
    if(Array.isArray(innerButtons) && innerButtons.length){
      for (var i = 0; i < innerButtons.length; i++) {
        innerButtons[i].title = innerButtons[i].displayname;
      }
    }
  }
  return innerButtons ?  innerButtons : null;
}
PageModel.prototype.getFormBottomButtons = function(compId){
  var tpl = this.getTemplate(compId);
  var formBottomBtns = [];
  if(Array.isArray(tpl.btnList) && tpl.btnList.length) {
    for (var i = 0; i < tpl.btnList.length; i++) {
      if(tpl.btnList[i].btn_position === 'form_bottom') {
        formBottomBtns.push(tpl.btnList[i]);
      }
    }
    if(Array.isArray(formBottomBtns) && formBottomBtns.length){
      for (var i = 0; i < formBottomBtns.length; i++) {
        formBottomBtns[i].title = formBottomBtns[i].displayname;
      }
    }
  }
  return formBottomBtns ?  formBottomBtns : null;
}

//业务按钮
PageModel.prototype.getTitleBusiButtons = function(compId){
  var tpl = this.getTemplate(compId);
  var titleBusiButtons = [];
  if(Array.isArray(tpl.btnList) && tpl.btnList.length) {
    for (var i = 0; i < tpl.btnList.length; i++) {
      if(tpl.btnList[i].btn_position === 'title_busi') {
        titleBusiButtons.push(tpl.btnList[i]);
      }
    }
  }
  return titleBusiButtons ?  titleBusiButtons : null;
}
//右间按钮
PageModel.prototype.getShoulderRightButtons = function(compId){
  var tpl = this.getTemplate(compId);
  var shoulderRightButtons = [];
  if(Array.isArray(tpl.btnList) && tpl.btnList.length) {
    for (var i = 0; i < tpl.btnList.length; i++) {
      if(tpl.btnList[i].btn_position === 'shoulder_right') {
        shoulderRightButtons.push(tpl.btnList[i]);
      }
    }
    if(Array.isArray(shoulderRightButtons) && shoulderRightButtons.length) {
      for (var i = 0; i < shoulderRightButtons.length; i++) {
        this.options.page.triggerClick(shoulderRightButtons[i]);
      }
    }
  }
  return shoulderRightButtons ?  shoulderRightButtons : null;
}
//表单按钮
PageModel.prototype.getFormButtons = function(compId){
  var tpl = this.getTemplate(compId);
  var formButtons = [];
  if(Array.isArray(tpl.btnList) && tpl.btnList.length) {
    for (var i = 0; i < tpl.btnList.length; i++) {
      if(tpl.btnList[i].btn_position === 'form_bottom') {
        formButtons.push(tpl.btnList[i]);
      }
    }
  }
  return formButtons ?  formButtons : null;
}
PageModel.prototype.getSearchCode = function(compId){
  var tpl = this.getTemplate(compId);
  return tpl ?  tpl.search_template_code: null;
}
PageModel.prototype.getPkTemp = function(compId) {
  var pkTemp = this.getTemplate(compId);
  if(!pkTemp) {
    return;
  }
  return  pkTemp.pk;
}
PageModel.prototype.getTemplate = function(compId){
  var mainTpl = this.pageConfig.mainTpl;
  var tplList = this.pageConfig.tplList;
  // return mainTpl;
  var targetTpl = null;
  if (mainTpl && mainTpl.compid == compId){
    return mainTpl;
  }else if (tplList && tplList.length > 0){
    tplList.forEach(function(tpl){
      if (tpl.compid == compId){
        targetTpl = tpl;
      }
    })
    return targetTpl;
  }
  //return null;
}

PageModel.prototype.getDynamic = function(){
  return this.pageConfig.dynamicPageList;
}

function getRouterPath(router, path){
  // var path = page.$route.path;
  var match = router.match(path);
  if (match.matched.length > 0){
    path = match.matched[0].path;
  }
  return path;
}

function getArguments(originArgs){
  var args = [];
  for (var i = 0; i < originArgs.length; i++){
    args.push(originArgs[i]);
  }
  return args;
}

function warpPageMethod(page, pageExtConfig, methodName){
  page._originMethods = page._originMethods || {};
  if (!page._originMethods[methodName]){
    page._originMethods[methodName] =  page[methodName];
    page[methodName] = function(){
      var args = getArguments(arguments);
      var ext = pageExtConfig.extDefine;
      var callback = function(){
        var _result =  page._originMethods[methodName].apply(page, args);
        ext.dispatch.call(page,  methodName, 'after',  args);
        return _result;
      }
      var result = ext.dispatch.call(page, methodName, 'before', args);
      if (typeof result === 'function'){
        return result(callback);
      }else if (result !== false){
        return callback();
      }
    }
  }
}



function transCrossRules(rules){
  var transRules = {};
  for (var i = 0; i < rules.length; i++){
    var rule = rules[i];
    for (var j = 0; j < rules.length; j ++){

        var kv = rules[j].split('.');
        var model = kv[0], fieldName = kv[1];
        transRules[model] = transRules[model] || {};

        transRules[model][fieldName] = {};

    }
  }
  return transRules;
}

/**
 * 监听校验规则的触发
 */
function regUiTemplateCrossValidateRule(uiTemplateIns, ruleModels, rules){
  if (uiTemplateIns.comp){
    if (uiTemplateIns.formModel && ruleModels[uiTemplateIns.formModel]){
      ruleModels[uiTemplateIns.formModel]._template = uiTemplateIns;
      uiTemplateIns.$on('before-edit', function(fieldName, comp, cb){
         if (ruleModels[uiTemplateIns.formModel][fieldName]){
          executeCrossRule(ruleModels, rules, fieldName, comp, uiTemplateIns);
         }
         cb();
      })
    }
  }else{
    setTimeout(function(){
      regUiTemplateCrossValidateRule(uiTemplateIns, ruleModels, rules);
    }, 500);
  }
}

/**
 * 执行交叉校验规则
 */
function executeCrossRule(ruleModels, rules, fieldName, comp, currentTemp){
  var model = currentTemp.formModel;
  // if (!ruleModels[model] || !ruleModels[model][fieldName]) reutrn;
  if (!ruleModels[model]) return;
  // var rule  = ruleModels[model][fieldName];
  // var fields =  rules //rule.split(',');
  var valueMap = {};
  for (var i = 0; i < rules.length; i ++){
    var kv = rules[i].split('.'), temp = currentTemp;
    if (kv[0] != model){
      temp = ruleModels[kv[0]]._template;
    }
      valueMap[rules[i]] =  temp ?  (temp.getFormData()[kv[1]] ? temp.getFormData()[kv[1]] : '') : '';
  }
  $.ajax({
    method: 'POST',
    url:'/uapbd/crossrule/getFilterSql',
    async:false,
    data:JSON.stringify({billtype:ruleModels.billtype,fieldname:model + '.' + fieldName,pk_org:ruleModels.pk_org,valueMap:valueMap}),
    dataType: 'json',
    contentType:'application/json',
    success: function(res){
      if (res.success === true){
        var sql  = res.data || '';
        //参照
        if (comp.setCrossPart){
          comp.setCrossPart(sql);
        }
      }else{
        console.error(res);
      }
    }
  })
}



export default {
  PageModel:PageModel,
  pageMgr:{
    pages: {},
    extConfig:null,
    createdPage: function(page){
      var pageId = Math.random().toString(36).substr(2);
      page._pageId = pageId;
      page._requirePageModelStack = [];
      this.pages[pageId] = page;
      this.fetchPageModel(page);
      this.pageMethodExtend(page);
    },
    mountedPage: function(page){
    },
    fetchPageModel: function(page){

      var oThis = this, path = page.$route.path;
      var match = page.$router.match(path);
      var param;
      if (match.matched.length > 0){
        path = match.matched[0].path;
      }
      var funcode = page.$route.query.funcode;
      if (funcode){
        param = {
          path:path,
          funcode:funcode
        }
      }else{
        param = {
          path:path,
        }
      }

      page.$http({
        url:'/baseapp/pageconfig/getPageConfigByRoute',
        method:'post',
        data: param,
        dataType:"application/json",
        headers:{
          "Content-Type":"application/json"
        }
      }).then((res)=>{
        if (res.data.success == true && res.data.data){
          res.data.data.page = page;
          page.pageModel = new PageModel(res.data.data);
          oThis.triggerPageModelCall(page);
        }else{
          console.error(res);
        }
      })
    },
    fetchPageExt: function(path){
      var oThis = this;
      // var extDefine = null;
      if (this.extConfig === null){
        $.ajax({
          url:'/ap/conf/extConfig.json',
          async:false,
          success: function(res){
            oThis.extConfig = (typeof res === 'string') ?   JSON.parse(res) : res;
          }
        })
      }
      var pageExtConfig = null;
      var pageRoute = path;
      if (this.extConfig && this.extConfig.length > 0){
        for(var i = 0; i< this.extConfig.length; i++){
          if (this.extConfig[i].route == pageRoute){
            pageExtConfig = this.extConfig[i];
            break;
          }
        }
      }
      if (pageExtConfig){
        window.pageExtDefine = function(callBack){
          pageExtConfig.extDefine = callBack();
        }
        $.ajax({
          url:pageExtConfig.extJs,
          async:false,
        })
      }
      return pageExtConfig;
    },
    pageExtend:function(path,comp){
      var pageExtConfig = this.fetchPageExt(path);
      if (pageExtConfig && pageExtConfig.extDefine && pageExtConfig.extDefine.beforeCreated){
        pageExtConfig.extDefine.beforeCreated(comp);
      }
    },
    pageMethodExtend: function(page){
      var path = getRouterPath(page.$router,page.$route.path);
      var pageExtConfig = this.fetchPageExt(path);
      if (pageExtConfig && pageExtConfig.extMethods){
        for(var i = 0; i < pageExtConfig.extMethods.length; i++){
          var methodName = pageExtConfig.extMethods[i];
          warpPageMethod(page, pageExtConfig, methodName);
        }
      }
    },
    destroyedPage: function(vm){
      delete this.pages[vm._pageId];
      vm.$options.triggerClick = null;
      vm.triggerClick = null;
    },
    /**
     * 来源页面
     */
    getPageModel: function(component, callback){

      var page = component
      while (page){
        if (page._pageId){
          if (page.pageModel){
            callback.call(this, page.pageModel);
          }else{
            page._requirePageModelStack.push({comp:component,callback:callback});
          }
          return;
          // return page.pageModel ? page.pageModel : null;
        }else{
          page = page.$parent;
        }
      }
      return callback.call(this, null);
    },

    getPage: function(component){
      var page = null;

      while (component){
        if (component._pageId){
          page = component;
          break;
        }else{
          component = component.$parent;
        }
      }
      return page;
    },

    /**
     * 回调请求页面模型的方法
     */
    triggerPageModelCall: function(page){
      var stack  = page._requirePageModelStack;
      while (stack && stack.length > 0){
        var rq = stack.shift();
        rq.callback.call(rq.comp, page.pageModel);
      }
    },
    triggerClick: function(page, btn, args){
      var eventName = btn.event;
      if(btn.btn_position === "title_right" || btn.btn_position === "shoulder_right" ) {
          var nowClick = btn.event;
          btn.click = ()=>{
            page[nowClick].apply(page, args);
          }
      } else {
        page[eventName].apply(page, args);
      }
    },
    /**
     * 查询交叉校验规则
     */
    addCrossRule: function(page, billtype, pk_org){
      $.ajax({
        method: 'POST',
        url:'/uapbd/crossrule/queryCrossRule',
        async:false,
        data:JSON.stringify({billtype: billtype, pk_org: pk_org}),
        dataType: 'json',
        contentType:'application/json',
        success: function(res){
          if (res.success === true){
            var rules = res.data;
            var ruleModels = transCrossRules(rules);
            ruleModels.billtype = billtype;
            // ruleModels.pk_group = pk_group;
            ruleModels.pk_org = pk_org;
            page._ruleModels = ruleModels;
            for(var key in page.$refs){
              if (page.$refs[key].$options._componentTag == 'ifbp-template'){
                regUiTemplateCrossValidateRule(page.$refs[key], ruleModels, rules);
              }else if (page.$refs[key].$options._componentTag == 'ifbp-dynamic-panel'){
                page.$refs[key].$on('before-edit', function(temp, fieldName, comp, cb){
                  executeCrossRule(ruleModels, rules,  fieldName, comp, temp);
                  cb();
                });
              }  //
            }
          }else{
            console.error(res);
          }
        }
      })
    },
    updateCrossOrg: function(page, pk_org){
      page._ruleModels = pk_org;
    },
    doValidateFormula: function(page, callback){
      var _page = this.getPage(page);
      var temps = [], valid = true;
      for(var key in _page.$refs){
        if (_page && _page.$refs[key] && _page.$refs[key].$options && _page.$refs[key].$options._componentTag == 'ifbp-template') {
          temps.push(_page.$refs[key]);
        } else if (_page && _page.$refs[key] && _page.$refs[key].$options && _page.$refs[key].$options._componentTag == 'ifbp-dynamic-panel') {
            temps = temps.concat(_page.$refs[key].getIfbpTemplates());
        }
      }
      for (var i = 0; i< temps.length; i++){
        valid = temps[i].comp.doValidateFormula();
        if (!valid){
          break;
        }
      }
      callback.call(page, valid);
    }
  }
};
