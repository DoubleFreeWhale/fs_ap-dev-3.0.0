<template>
  <div class="ifbp-dynamic-panel">
    <ifbp-panel :class="ifbpDynamicPanelFirst?'dynamicMain':''" v-for="(item, index) in dynamicResData"
                :key="item.code+index"
    :id="'dynamicIfbpPanel' + item.code"
    :title="item.displayname"
    :icons="(item.readonly === true || item.dynamicReadonly === true)?[]:item.childIcons? item.childIcons:defaultChildIcons"
    :data-index="index"
    :data-code="item.code"
    :code="item.code"
    :rightIcons="item.rightIcons"
    @update:showBody="function(val){panelShowBodyChange(item,val)}"
    >
      <ifbp-template :ref="'dynamic_'+item.code"
                     class="op1111"
                :tplId="'dynamic_'+item.code"
                :funnode="item.funnode"
                :nexuskey="item.nexuskey"
                :pk-temp = "item.pk_template"
                :show-type="item.showType"
                :table-show-menu="item.dynamicShowTableMenu"
                :table-oper-vif="item.tableOperVif"
                :delete-button-show="!item.dynamicEditable"
                :cancel-button-show="(typeof item.cancelButtonShow === 'undefined' && item.dynamicEditable) || (typeof item.cancelButtonShow !== 'undefined' && item.cancelButtonShow)"
                :editable="item.dynamicEditable"
                @update:editable="val => {item.dynamicEditable = val;item.cancelButtonShow = val; $forceUpdate();updateEditable(item, index, val)}"
                :readonly= "(item.readonly === true || item.dynamicReadonly === true )? true : false"
                :tpl-data="item.tplData|| dynamicData[item.code]"
                :tpl-reset-fun="function($node){dynamicFuns(item,$node)}"
                :confirm-clear-edit="item.confirmClearEdit"
                :vue-props="item.templateProps"
                @change="function(filed,value){childChange(item,filed,value)}"
                @before-edit="function(field, comp, callback){childBeforeEdit(item,field, comp, callback)}"
                @expand="function(row, expanded){item.tableOperVif = !expanded;expand(item, index, row, expanded)}"
                @after-create="function(comp){DynamicAfterCreate(comp, index)}"
                @form-edit-click="function(type,row){formEditClick(item,index,type,row)}"
                @table-click="function(icon,scope){childTableClick(item,index,icon,scope)}"
                @edit-table-click="function(scope){childEditClick(item,index,scope)}"
                @delete-table-click="function(scope){childDeleteClick(item,index,scope)}"
                @form-confirm-click="function(type){childFormConfirm(item,index,type)}"
                @form-cancel-click="function(type){childFormCancel(item,index,type)}"
                @form-delete-click="function(type,row){childFormDelete(item,index,type,row)}"
                >
      </ifbp-template>
      <el-pagination v-if="item.showPagination || false"
        @size-change="function(size){handleSizeChange(item, size)}"
        @current-change="function(currentPage){handleCurrentChange(item,currentPage)}"
        :current-page="(item.dynamicPagination && item.dynamicPagination.currentPage)?item.dynamicPagination.currentPage:1"
        :page-sizes="[10,20,40,90]"
        :page-size="(item.dynamicPagination && item.dynamicPagination.size)?item.dynamicPagination.size:10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="item.dynamicPagination && item.dynamicPagination.totalElements">
      </el-pagination>
      <ifbp-del-dialog
      v-model="childDelDialogVisible"
      message="确认删除该数据？删除后无法恢复。"
      @click="childDeleteDialogClick"
      >
      </ifbp-del-dialog>
    </ifbp-panel>
  </div>
</template>

<script>

import discard from "./discard.js";
export default {
  name: 'IfbpDynamicPanel',
  mixins: [discard],
  data() {
    var vm = this;
    return {
      pageParentId:'',
      pageBusicode:'',
      pageCode:'',
      dynamicResData:[],
      dynamicPageData: [], // 页面定制中获取的json对象
      defaultChildIcons: [{
        icon: 'plus',
        title:'新增',
        click: (e) => {
          var parentDom = e.currentTarget.parentNode.parentNode.parentNode;
          if (parentDom) {
            var index = parentDom.getAttribute('data-index');
            var code = parentDom.getAttribute('data-code');
          } else {
            return;
          }

          if(this.plusIconBeforeClick){
            let beforeClick = this.plusIconBeforeClick.call(this,code);
            if(!beforeClick){
              return
            }
          }

          // dynamicPageData 为页面定制的数据
          if((!vm.pageParentId && vm.dynamicPageData.length>0 ) || (vm.dynamicPageData.length<1 && !vm.parentId)) {
            vm.$message({
              message: '请先保存主表信息',
              type: 'error'
            });
          } else {
            for (var i = 0; i < vm.dynamicResData.length; i++) {
              if(vm.dynamicResData[i].code === code) {
                vm.$set(vm.dynamicResData[i], "dynamicEditable", true);
              }
            }
            vm.$refs['dynamic_' + code][0].getTableComp().closeExpandRow();

            // 重置新增数据
            vm.$refs['dynamic_' + code][0].resetFormData();
            // 显示新增区域
            vm.$refs['dynamic_' + code][0].formShow = true;
            vm.$forceUpdate();
            vm.$emit('plus-icon-click', code);
          }
        }
      }],
      dynamicData: {},
      childBaseData: {},
      childDelData: {},
      childDelDialogVisible: false,
      pkClass:{},
      tableOrForm:{},
      dynamicChildResetFun($node, item) {
        var $table = this.getTableDom($node);
        var $operateHtml = this.getBaseTableOperateHtml();
        $table.append($operateHtml);
        return $node[0].outerHTML;
      }
    };
  },
  props:{
    ifbpDynamicPanelFirst: {
      type: Boolean,
      default:true
    },
    busiCode:{
      type:String
    },
    dynamicCode:{
      type:String
    },
    dynamicPanelData:{
      default() {
        return [];
      }
    },
    isCreate:{
      type:Boolean,
      default:true
    },
    parentId:{
      type:String
    },
    defaultCrud:{
      default:true
    },
    parentPkClass:{
      type: String
    },
    childIcons: {
      type: Array
    },
    rightIcons: {
      type: Array
    },
    dynamicResetFuns: {
      type: Array
    },
    dynamicNoCodeResetFuns: {
      type: Function
    },
    tableOperVif: {
      type:Array
    },
    confirmClearEdit: {
      type: Array
    },
    noCodeConfirmClearEdit: {
      type: Boolean
    },
    dynamicTplData: {
      type: Array
    },
    dynamicNoCodeTplData: {
      type: Object
    },
    leftContent: {
      type: Array
    },
    dynamicReadonly: {
      // 页面代码中通过此属性控制只读，页面定制设置的只读为readonly，页面定制中设置的优先级高
      type: Array
    },
    dynamicEditable: {
      type: Array
    },
    dynamicNoCodeShowTableMenu:{
      default: false
    },
    dynamicNoCodeChildIcons:{
      type: Array
    },
    dynamicNoCodeRightIcons:{
      type: Array
    },
    dynamicMethods:{

    },
    dynamicTemplateProps: {
      type: Array
    },
    plusIconBeforeClick:{

    },
    dynamicPagination: {
      type: Array
    },
    showPagination: {
      type: Array
    }
  },
  watch: {
    tableOperVif: {
      deep: true,
      handler(val) {
        this.resetResDataByAttr(val, "tableOperVif", "tableOperVif");
      }
    },
    confirmClearEdit: {
      deep: true,
      handler(val) {
        this.resetResDataByAttr(val, "confirmClearEdit", "confirmClearEdit");
      }
    },
    noCodeConfirmClearEdit: {
      deep: true,
      handler(val) {
        this.noCodeResetResDataByAttr(val, "confirmClearEdit");
      }
    },
    childIcons: {
      deep: true,
      handler(val) {
        this.resetResDataByAttr(val, "childIcons", "icons");
      }
    },
    rightIcons: {
      deep: true,
      handler(val) {
        this.resetResDataByAttr(val, "rightIcons", "icons");
      }
    },
    dynamicEditable: {
      deep: true,
      handler(val) {
        this.resetResDataByAttr(val, "dynamicEditable", "dynamicEditable");
      }
    },
    dynamicReadonly: {
      deep:true,
      handler(val) {
        this.resetResDataByAttr(val, "dynamicReadonly", "dynamicReadonly");
      }
    },
    leftContent: {
      deep: true,
      handler(val) {
        var $ifbpDom;
        if(val && val.length > 0) {
          for (var i = 0; i < val.length; i++) {
            $ifbpDom = $("#dynamicIfbpPanel" + val[i].code);
            if($ifbpDom) {
              $ifbpDom.children().children().find(".ifbp-add").nextAll().remove();
              $ifbpDom.children().children().find(".ifbp-add").after(this.leftContent[i].dom);

            }
          }
        }
      }
    },
    dynamicPagination: {
      deep: true,
      handler(val) {
        this.resetResDataByAttr(val, "dynamicPagination", "dynamicPagination");
      }
    },
    showPagination: {
      deep: true,
      handler(val) {
        this.resetResDataByAttr(val, "showPagination", "isShowPagination");
      }
    }
  },

  methods: {
    panelShowBodyChange(item,val) {
      this.$emit('panel-show-body', item, val);
    },
    handleSizeChange(item, size) {
      this.$emit('handle-size-change', item, size);
    },
    handleCurrentChange(item, currentPage) {
      this.$emit('handle-current-change', item, size);
    },
    /** 组件内部方法 begin */
    resetResDataByAttr(val, attr ,valAttr){
      if(this.dynamicResData && this.dynamicResData.length > 0) {
        if(val && val.length > 0) {
          for (var i = 0; i < val.length; i++) {
            for (var j = 0; j < this.dynamicResData.length; j++) {
              if(val[i].code === this.dynamicResData[j].code) {
                if(!this.dynamicResData[i].valAttr || (this.dynamicResData[i].valAttr && this.dynamicResData[i].valAttr instanceof Array && this.dynamicResData[i].valAttr.length < 1))
                  this.$set(this.dynamicResData[j],attr, val[i][valAttr]);
                }
              }
            }
          }
        }
      this.$forceUpdate();
    },
    noCodeResetResDataByAttr(val, valAttr){
      if(Array.isArray(this.dynamicResData) && this.dynamicResData.length) {
        for (var i = 0; i < this.dynamicResData.length; i++) {
          if(!this.dynamicResData[i].valAttr || (this.dynamicResData[i].valAttr && this.dynamicResData[i].valAttr instanceof Array && this.dynamicResData[i].valAttr.length < 1))
            this.$set(this.dynamicResData[i],valAttr, val);
          }
        }
      this.$forceUpdate();
    },
    // 根据传入值来重置data
    resetDynamic(){
      this.resetResDataByAttr(this.tableOperVif, "tableOperVif", "tableOperVif");
      this.resetResDataByAttr(this.confirmClearEdit, "confirmClearEdit", "confirmClearEdit");
      this.resetResDataByAttr(this.childIcons, "childIcons", "icons");
      this.resetResDataByAttr(this.rightIcons, "rightIcons", "icons");
      this.resetResDataByAttr(this.dynamicEditable, "dynamicEditable", "dynamicEditable");
      this.resetResDataByAttr(this.dynamicTplData, "tplData", "tplData");
      this.resetResDataByAttr(this.dynamicReadonly, "dynamicReadonly", "dynamicReadonly");
      this.resetResDataByAttr(this.dynamicResetFuns, "dynamicResetFuns", "resetFun");
      this.resetResDataByAttr(this.dynamicTemplateProps, "templateProps", "props");
      this.resetResDataByAttr(this.dynamicPagination, "dynamicPagination", "dynamicPagination");
      this.resetResDataByAttr(this.showPagination, "showPagination", "isShowPagination");

      // 根据nocode 属性重置data
      if(this.dynamicNoCodeResetFuns) {
        this.noCodeResetResDataByAttr(this.dynamicNoCodeResetFuns,"dynamicResetFuns");
      }
      if(typeof this.noCodeConfirmClearEdit != 'undefined'){
        this.noCodeResetResDataByAttr(this.noCodeConfirmClearEdit, "confirmClearEdit");
      }
      if(typeof this.dynamicNoCodeShowTableMenu != 'undefined') {
        this.noCodeResetResDataByAttr(this.dynamicNoCodeShowTableMenu,"dynamicShowTableMenu");
      }
      if(this.dynamicNoCodeChildIcons) {
        this.noCodeResetResDataByAttr(this.dynamicNoCodeChildIcons,"childIcons");
      }
      if(this.dynamicNoCodeRightIcons) {
        this.noCodeResetResDataByAttr(this.dynamicNoCodeRightIcons,"rightIcons");
      }
      if(this.dynamicNoCodeTplData) {
        this.noCodeResetResDataByAttr(this.dynamicNoCodeTplData,"tplData");
      }

      // 根据页面定制中的类型来重置showType
      for (var i = 0; i < this.dynamicResData.length; i++) {
        this.dynamicResData[i].editable = false;
        if(this.dynamicResData[i].style === "参照") {
          this.dynamicResData[i].showType = "form";
        } else {
          this.dynamicResData[i].showType = "table-form";
        }
      }
    },
    // 此方法用于获取dynamicResData ，获取之后需要调用resetDynamic 来重置属性
    getDynamic(){
      // data的优先级 页面定制 >> 传入的值 >> 平台默认的
      // 处理页面定制中获取到的配置信息
      if(this.dynamicPageData.length > 0) {
        this.dynamicResData = this.dynamicPageData;
        var iconsLeft = [];
        var iconsRight= [];
        if(Array.isArray(this.dynamicResData) && this.dynamicResData.length ) {
          for (var i = 0; i < this.dynamicResData.length; i++) {
            if(Array.isArray(this.dynamicResData[i].btnList)&& this.dynamicResData[i].btnList.length > 0) {
              iconsLeft = this.getLeftIconsByCode(this.dynamicResData[i].code);
              iconsRight = this.getRightIconsByCode(this.dynamicResData[i].code);
              if(Array.isArray(iconsLeft) && iconsLeft.length>0) {
                this.$set(this.dynamicResData[i],'childIcons',iconsLeft)
              }
              if(Array.isArray(iconsRight) && iconsRight.length>0) {
                this.$set(this.dynamicResData[i],'rightIcons',iconsRight)
              }
            }
          }
        }
        console.log(this.dynamicResData );
        this.resetDynamic();
        this.$nextTick(() =>{
          this.$emit('dynamic-data-change',this);
        });
      }else{
        if(this.dynamicPanelData.length > 0) {
          this.dynamicResData = this.dynamicPanelData;
          this.resetDynamic();
          this.$nextTick(() =>{
          this.$emit('dynamic-data-change',this);
        });
        } else{
          var data;
          if(this.busiCode||this.busiCodeDef) {
            data = {"busicode":this.busiCode||this.busiCodeDef,"code":this.dynamicCode};
          } else {
            data = {"code":this.dynamicCode};
          }
          this.$http({
            url: '/ifbp-app-sm-infoset-web/page_layout_child/getByCode',
            method: 'post',
            data: data,
            dataType: 'json'
          }).then((res)=>{
            if (res.data.success === true) {
              this.$nextTick(() => {
                this.dynamicResData = res.data.data;
                this.resetDynamic();
                this.$nextTick(() =>{
                  this.$emit('dynamic-data-change',this);
                });
              });
            } else {
              // 不再提示错误信息
              // this.$message({
              //   message: res.data.msg,
              //   type: 'error'
              // });
            }
          }).catch((e) =>{
            this.$message({
              message: '子表信息获取失败',
              type: 'error'
            });
            this.$logger.error(e);
          })
        }
      }
      if(Array.isArray(this.dynamicResData) && this.dynamicResData.length) {
        for (var i = 0; i < this.dynamicResData.length; i++) {
          this.dynamicResData[i].dynamicEditable = true;
          this.dynamicResData[i].cancelButtonShow = true;
          this.dynamicResData[i].tableOperVif = true;
          this.dynamicResData[i].dynamicShowTableMenu = false;
          this.dynamicResData[i].confirmClearEdit = true;
        }
      }

    },
    expand(item, index, row, expanded) {
      this.$emit('expand',item, index, row, expanded);
    },

    updateEditable(item, index, editable){
      this.$emit("update:editable", item, index, editable);
    },

    childChange(item,field,value){
      this.$emit('change',item,field,value);
    },
    childBeforeEdit(item,field, comp, callback){
      if(this._events['before-edit'] && this._events['before-edit'].length > 0){
        this.$emit("before-edit", this.$refs['dynamic_' + item.code][0] ,field, comp, callback);
      }else{
        callback.call(comp);
      }
    },
    // UI模板渲染完成之后调用
    DynamicAfterCreate(UIComp, index) {
      // 获取所有的pkClass
      console.log(index);
      this.pkClass[index] = UIComp.getPkClass();
      this.dynamicRequest(index);
      // 刷新ifbp-panel 左侧内容区的内容
      if(this.leftContent && this.leftContent.length > 0) {
        var $ifbpDom;
        for (var i = 0; i < this.leftContent.length; i++) {
          $ifbpDom = $("#dynamicIfbpPanel" + this.leftContent[i].code);
          if($ifbpDom) {
            if($ifbpDom.children().children().find(".ifbp-add").length > 0) {
              $ifbpDom.children().children().find(".ifbp-add").nextAll().remove();
            } else {
              $ifbpDom.children().children().find(".title-sub").nextAll().remove();
            }
            $ifbpDom.children().children().find(".ifbp-add").after(this.leftContent[i].dom);
          }
        }
      }
      this.$emit('template-after-create',UIComp);
      if(this.dynamicResData.length===(index+1)){
        this.$emit('after-create');
        this.$emit('after-mounted');
      }
    },
    childTableClick(item, index, icon, scope){
      this.$emit('table-click',item, index, icon, scope)
    },
    // 行编辑事件
    childEditClick(item, index, scope) {
      this.$refs['dynamic_' + item.code][0].expandRow(scope.row,scope.$index,true);
      this.dynamicResData[index].dynamicEditable = true;
      this.$emit("editTableClick", item, index, scope);
      this.$emit("edit-table-click", item, index, scope);
    },
    // 行删除事件
    childDeleteClick(item, index, scope) {
      // 暂时没有设置成true的情况
      if(this.defaultCrud === 'true' || this.defaultCrud === true) {
        this.childDelDialogVisible = true;
        this.childDelData = scope.row;
        this.childIndex = index;
      }
      this.$emit('tableDelete', item, scope);
      this.$emit("delete-table-click", item, scope);
    },

    // 展开区的编辑按钮
    formEditClick(item, index, type, row) {
      this.$emit('form-edit-click', item, index, type, row);
    },
    // 展开去的保存按钮
    childFormConfirm(item, index, type) {
      var vm = this;
      var url = this.dynamicResData[index].updateURL;
      this.$refs['dynamic_' + item.code][0].validate(valid => {
        if (valid) {

          if (vm.defaultCrud === "true" || vm.defaultCrud === true){
            var data = {
              "baseEntity": {
                "beanMap": {
                  "pk_parent_common": dId,
                },
                "metaDefinedName": data2.metaDefinedName,
                "namespace": data2.namespace,
                "status": data2.status,
                "changedPropertyNames": data2.changedPropertyNames
              },
              "pkClass": vm.pkClass[index]
            };
            var data2 = vm.$refs['dynamic_' + item.code][0].getFormData();
            var dId;
            if(this.dynamicPageData.length >0 ) {
              dId = vm.pageParentId;
            } else {
              dId = vm.parentId;
            }

              // delete data2.beanMap;
              for (var key in data2) {
                if(!(key === "metaDefinedName" || key === 'namespace' || key === 'status' || key === 'changedPropertyNames' || key === 'beanMap')) {
                  data.baseEntity.beanMap[key] = data2[key];
                }
              }
            if (type === 'form') {
              url = this.dynamicResData[index].saveURL;
            }
            vm.$http({
              url: url,
              method: 'post',
              data: data,
              headers: {
                'Content-Type': 'application/json'
              },
              dataType: 'application/json'
            })
            .then(res => {
              if (res.data.success) {
                vm.$message({
                  message: '保存成功'
                });
                vm.$refs['dynamic_' + item.code][0].tableShow = true;
                // 隐藏新增区域
                vm.$refs['dynamic_' + item.code][0].formShow = false;
                // 关闭Table中的编辑区域
                vm.$refs['dynamic_' + item.code][0].getTableComp().closeExpandRow();
                if (type === 'form') {
                  vm.dynamicRequest(index);
                }
              } else {
                vm.$message({
                  message: res.data.error.errorMessage,
                  type: 'error'
                });
              }
            })
            .catch(() => {
              vm.$message({
                message: '保存失败',
                type: 'error'
              });
            });
          }else{
          }
        } else {
          vm.$message('校验未通过');
        }
      }, type);
      this.$emit('formConfirm', item, type);
      this.$emit('form-confirm-click', item, type);
    },
    childFormCancel(item, index, type) {
      this.$emit('formCancel', item, type);
      this.$emit('form-cancel-click', item, type);
    },
    childFormDelete(item, index, type, row) {
      
      this.$emit('formDelete', item, type, row);
      this.$emit('form-delete-click', item, type, row);
    },

    getIfbpTemplates(){
      let ifbpTemplates = []
      for(let ref in this.$refs){
        if(this.$refs[ref]){
          let nowRef = null;
          if(Array.isArray(this.$refs[ref])){
            nowRef = this.$refs[ref][0]
          }else{
            nowRef = this.$refs[ref];
          }
          if(nowRef.$vnode && nowRef.$vnode.componentOptions && nowRef.$vnode.componentOptions.tag === "ifbp-template"){
            ifbpTemplates.push(nowRef);
          }
        }
      }
      return ifbpTemplates;
    },
    /** 组件内部方法 end */

    /** 提供的api方法 begin */
    setItemAttrBycode(code, attr, attrValue){
      if(this.dynamicResData && this.dynamicResData.length > 0) {
        for(let i = 0; i < this.dynamicResData.length; i++){
          if(code === this.dynamicResData[i].code) {
            this.$set(this.dynamicResData[i],attr, attrValue);
          }
        }
      }
      this.$forceUpdate();
    },
    setItemAttrNoCode(attr, attrValue){
      if(this.dynamicResData && this.dynamicResData.length > 0) {
        for(let i = 0; i < this.dynamicResData.length; i++){
          // if(code === this.dynamicResData[i].code) {
            this.$set(this.dynamicResData[i],attr, attrValue);
          // }u
        }
      }
      this.$forceUpdate();
    },
    /**
     *返回所有数据
     */
    getAllData(){
      var datas = {};
       if(this.dynamicResData && this.dynamicResData.length>0) {
         for (let i = 0; i < this.dynamicResData.length; i++) {
           var code  = this.dynamicResData[i].code;
           if(this.$refs['dynamic_' + code][0]){
             var uitemplate = this.$refs['dynamic_' + code][0];
             datas[code] =  uitemplate.getTableData() || uitemplate.getFormData();
           }
         }
       }
      return datas;
    },
    // 获取所有的code
    getAllTableCode() {
      var dataCode = [];
      if(this.dynamicResData && this.dynamicResData.length > 0) {
        for (var i = 0; i < this.dynamicResData.length; i++) {
          dataCode.push(this.dynamicResData[i].code);
        }
      }
      return dataCode;
    },

    /**
     *设置数据
     */
    setFormDataByCode(code, data){
      if(this.$refs['dynamic_' + code][0]) {
        var uitemplate = this.$refs['dynamic_' + code][0];
        uitemplate.setFormData(data);
      }
    },
    setTableDataByCode(code, data){
      this.$refs['dynamic_' + code][0].tableShow=data.length > 0;
      this.$refs['dynamic_' + code][0].setTableData(data);
    },
    getFormDataByCode(code) {
      if(this.$refs['dynamic_' + code][0]) {
        var formData = this.$refs['dynamic_' + code][0].getFormData();
        return formData;
      }
    },
    getTableDataByCode(code) {
      if(this.$refs['dynamic_' + code][0]) {
        var formData = this.$refs['dynamic_' + code][0].getTableData();
        return formData;
      }
    },
    /**
     *获取数据
     */
    getDataByCode(code){
      if(this.$refs['dynamic_' + code][0]) {
        var uitemplate = this.$refs['dynamic_' + code][0];
        var data =  uitemplate.getTableData() || uitemplate.getFormData();
        return data;
      }
    },
    getTemplateByCode(code){
      if(this.$refs['dynamic_' + code][0]) {
        return this.$refs['dynamic_' + code][0];
      }
    },
    getLeftRightIcons(code, arr, arrType) {
      var vm = this;
      arr = [];
      if(Array.isArray(this.dynamicPageData) && this.dynamicPageData.length) {
        for (var i = 0; i < this.dynamicPageData.length; i++) {
          if(this.dynamicPageData[i].code === code) {
            for (var j = 0; j < this.dynamicPageData[i].btnList.length; j++) {
              if(this.dynamicPageData[i].btnList[j].btn_position === arrType) {
                arr.push(this.dynamicPageData[i].btnList[j]);
              }
            }
          }
        }
        if(arrType === 'title_right' || arrType === 'shoulder_right') {
          if(Array.isArray(arr) && arr.length) {
            for (var i = 0; i < arr.length; i++) {
              let event = arr[i].event;
              arr[i].click = function(e,code){
                let args = arguments;
                // let args1 = arguments[1];
                if(event === 'addFun'){
                  if(vm.dynamicMethods && vm.dynamicMethods[event]){
                      vm.dynamicMethods && vm.dynamicMethods[event] && vm.dynamicMethods[event].apply(vm,args);
                  }else{
                    // 实现默认的新增逻辑
                    if((!vm.pageParentId && vm.dynamicPageData.length>0 ) || (vm.dynamicPageData.length<1 && !vm.parentId)) {
                      vm.$message({
                        message: '请先保存主表信息',
                        type: 'error'
                      });
                    } else {
                      for (var i = 0; i < vm.dynamicResData.length; i++) {
                        if(vm.dynamicResData[i].code === code) {
                          vm.$set(vm.dynamicResData[i], "dynamicEditable", true);
                        }
                      }
                      vm.$refs['dynamic_' + code][0].getTableComp().closeExpandRow();
                      // 重置新增数据
                      vm.$refs['dynamic_' + code][0].resetFormData();
                      // 显示新增区域
                      vm.$refs['dynamic_' + code][0].formShow = true;
                      vm.$forceUpdate();
                      vm.$emit('plus-icon-click', code);
                    }
                  }
                }else{
                  vm.dynamicMethods && vm.dynamicMethods[event] && vm.dynamicMethods[event].apply(vm,args);
                }

              }
              // this.triggerPage.triggerClick(arr[i]);
            }
          }
        }
        if(arrType === 'row_inner') {
          for (var i = 0; i < arr.length; i++) {
            arr[i].title = arr[i].displayname;
          }
        }
      }
      return arr;
    },
    // 获取页面定制的行间按钮的方法
    getInnerIconsByCode(code) {
      var dynamicInnerBtns = [];
      return this.getLeftRightIcons(code, dynamicInnerBtns, 'row_inner') || [];
    },
    getLeftIconsByCode(code) {
      var dynamicLeftBtns = [];
      return this.getLeftRightIcons(code, dynamicLeftBtns, 'title_right') || [];
    },
    getRightIconsByCode(code) {
      var dynamicRightBtns = [];
      return this.getLeftRightIcons(code, dynamicRightBtns, 'shoulder_right') || [];
    },
    //重新拼接resetFun
    dynamicFuns(item,$node){
        if(item.dynamicResetFuns){
          if(this.$refs["dynamic_" + item.code][0]){
            item.dynamicResetFuns.call(this.$refs["dynamic_" + item.code][0],$node, item);
          }
        }else{
          if(this.getInnerIconsByCode(item.code).length > 0) {
            var $table;
            if ($node) {
              if ($node[0].localName === "el-table") {
                $table = $node;
              } else {
                $table = $node.find("el-table");
              }
            }
            var icons = this.getInnerIconsByCode(item.code);
            var $operateHtml = this.$refs["dynamic_" + item.code][0].getTableOperateHtml(icons);
            $table.append($operateHtml);
          } else {
            if(this.$refs["dynamic_" + item.code][0]){
              this.dynamicChildResetFun.call(this.$refs["dynamic_" + item.code][0],$node, item);
            }
          }
        }
        return $node[0].outerHTML;
    },
    //校验方法
    getValidate() {
      if(Array.isArray(this.dynamicResData) && this.dynamicResData.length){
        let validValue = false;
        for (var i = 0; i < this.dynamicResData.length; i++) {
          if(this.$refs["dynamic_" + this.dynamicResData[i].code][0]) {
            this.$refs["dynamic_" + this.dynamicResData[i].code][0].validate((valid) => {
              if(valid) {
                validValue = true;
              } else {
                validValue = false;
                return;
              }
            })
          }
      }
      return validValue;
    }
  }
    /** 提供的api方法 end */
  },

  created() {

    try{
      var oThis = this;

      if (!this._hasGetPageModel && this.$pageMgr){
        this.$pageMgr.getPageModel(this, (pageModel)=>{
          if (pageModel){
            var dynamic = pageModel.getDynamic();
            oThis.dynamicPageData = dynamic;
            if(Array.isArray(dynamic) && dynamic.length > 0) {
            
              oThis.pageParentId = pageModel.pageConfig.pk;
              oThis.pageBusicode = pageModel.options.busicode;
              oThis.pageCode = pageModel.options.code;
            }
          }
          oThis.getDynamic();
          oThis._hasGetPageModel = true;
          this.$emit('after-create');
        });
      } else {
        oThis.getDynamic();
        this.$emit('after-create');
      }
    }catch(e){
      console.log(e.stack)
    }

    if (!this.busiCode && this.$router && this.$router.currentRoute && this.$router.currentRoute.query.funcode){
      
      this.busiCodeDef = this.$router.currentRoute.query.funcode;
    }
  },

};
</script>

<style>
</style>
