function addOrgFilter(page, uiTemplateIns) {
  if (uiTemplateIns.comp && uiTemplateIns.formModel) {
    // if (uiTemplateIns.getFormComp() && uiTemplateIns.getFormComp().$children){
    //   uiTemplateIns.getFormComp().$children.forEach(function (itemComp) {
    //     if (itemComp.$children[0] && itemComp.$children[0].$options._componentTag === 'el-ref') {
    //       page._refComps =  itemComp.$children[0]
    //     }
    //   });
    // }
    uiTemplateIns.$on('before-edit', function (fieldName, comp, cb) {
      setOrg(comp);
      cb();
    })
  } else {
    setTimeout(function () {
      addOrgFilter(page, uiTemplateIns);
    }, 500);
  }
}

function setOrg(page, comp){
  var pk_org = page.$refs[page._uiTemplateRef].getFormData()[page._orgField]; //page._pk_org;
  comp.setOrg(pk_org);
}

export default {
  page:null,
  /**
   * 初始化
   */
  init(page, uiTemplateRef, orgField){
    this.page = page;
    var oThis = this;
    page._uiTemplateRef = uiTemplateRef;
    page._orgField = orgField;
    // 组织变化监听
    page.$refs[uiTemplateRef].$on('change', function (fieldName, comp, cb) {
      if (fieldName === orgField){
        this.$confirm('组织变化, 是否清空表单中的其它字段?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          oThis.cleanRefValue();
        }).catch(() => {
        });
      }
      cb();
    })
    //增加其它参照编辑前事件
    for(var key in page.$refs){
      if (page.$refs[key].$options._componentTag == 'ifbp-template'){
        addOrgFilter(page, page.$refs[key]);

      }else if (page.$refs[key].$options._componentTag == 'ifbp-dynamic-panel'){
        page.$refs[key].$on('before-edit', function(temp, fieldName, comp, cb){
          setOrg(page, comp);
          cb();
        });  
      }  //
    }
  },

  cleanRefValue(){
    var uiTemplateRef = this.page._uiTemplateRef;
    var orgField = this.page._orgField;
    var uiTemplateIns = this.page.$refs[uiTemplateRef];
    if (uiTemplateIns.getFormComp() && uiTemplateIns.getFormComp().$children){
      uiTemplateIns.getFormComp().$children.forEach(function (itemComp) {
        if (itemComp.$children[0] && itemComp.$children[0].$options._componentTag === 'el-ref') {
          uiTemplateIns.setFormDataByField(itemComp.prop, '');
        }
      });
    }

  },
}