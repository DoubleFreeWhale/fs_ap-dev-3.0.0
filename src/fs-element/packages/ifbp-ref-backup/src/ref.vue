<template>
    <div class='ref-container'>
        <el-autocomplete
          :placeholder="placeholder"
          v-model="value"
          v-show="true"
          icon="pt-fenlei1"
          v-bind:style="{width:'100%',display:'inline-block'}"
          :width="width"
          :disabled="disabled"
          @valuechange = "valueChange"
          v-if="editable"
          :on-icon-click="showDialog"
          :triggerOnFocus="triggerOnFocus"
          :fetch-suggestions="getSuggestions"
          :showBtnDialog="true"
          @showDialog="showDialog"
          @select="onSelectData"
          @blur="handleInputBlur"
          :fetchOnEnter="fetchOnEnter"
          :autoMatchWhenEnter="true"
        >
          <!-- <template v-if="selected.length > 0 && !this.disabled" slot="prepend">
            <el-button @click="reset" class="ref-input-clear-btn">清空</el-button>
          </template> -->
        </el-autocomplete>
        <ifbp-tooltip :content="value" :diff="diffLabel" v-else></ifbp-tooltip>


        <el-dialog
          v-if="customDialog"
          class="ref-dialog"
          :custom-class = "'dialog_' + coed"
          v-model="dialogVisible"
          @close="closeDialog"
          :title="dialogTitle"
          :showClose="dialogShowClose"
          :size="customDialogSize"
          :width="width"
        >
          <!-- <slot></slot> -->
          <component :is="customDialog"
      
            :field="field"
            :templateValue="templateValue"
            :isMutiSelect="isMutiSelect"
            :queryParams="queryParams"
            :notLeafSelectable="notLeafSelectable"
            :defaultFilterStr="defaultFilterStr"
            @customRefConfirm="onSelectData"
            @customRefCancel="closeDialog"
          ></component>
        </el-dialog>

        <refDialog
          v-else
          @onSelectData="onSelectData"
          @closeDialog="closeDialog"
          :maxHeight = "maxHeight"
          :size="customDialogSize"
          :dialogVisible="dialogVisible"
          :refInfo="refInfo"
          :templateValue="templateValue"
          :savedSelected="selected"
          :treeTableTree="treeTableTree"
          :refData="refData"
          :queryParams="queryParams_local"
          label="label"
          :dialogTitle="dialogTitle"
          :dialogShowClose="dialogShowClose"
          :isFlatRef="isFlatRef"
          :isMutiSelect="isMutiSelect"
          :notLeafSelectable="notLeafSelectable"
          :totalElementsInitial="totalElementsInitial"
          :defaultFilterStr="defaultFilterStr"
          :showSelected="showSelected"
          :frequentlyUsedRef="frequentlyUsedRef"
          :freErrMsg="freErrMsg"
          :freStrFieldCode="freStrFieldCode"
          :freStrFieldName="freStrFieldName"
          :showFrePanel="showFrePanel"></refDialog>
    </div>
</template>
<script>
/* eslint-disable */
import emitter from 'ifbp-element/src/mixins/emitter';
import refDialog from './refDialog.vue';
export default {
  name: 'ElRef',
  data() {
    return {
      coed:"",
      refData: '',
      value: '',
      selected: [],
      refInfo: '',
      dialogVisible: false,
      timeid: false,
      triggerOnFocus: false,
      diffLabel: null,
      treeTableTree: null,
      totalElementsInitial: 0,
      // 懒加载树
      lazyTree: false,
      // query params 本地变量
      queryParams_local: {},
      // 平铺参照
      isFlatRef: false,
      // 传入dialog的str
      defaultFilterStr: null,
      isFirstClick:false, //判断是不是被点记过,
      // 常用
      frequentlyUsedRef: [],
      freErrMsg: null,
      freStrFieldCode: ['code', 'name'],
      freStrFieldName: ['编码', '名称'],
      showFrePanel: true,
    };
  },
  mixins: [emitter],
  computed:{
    realField(){
      if(this.field.indexOf('.') > -1){
        return this.field.substring((this.field.indexOf('.') + 1));
      } else {
        return '';
      }
    }
  },
  props: {
    width: {},
    field: {
      default: ''
    },
    isMutiSelect: {},
    refCode: {},
    templateValue: {},
    editable: {
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    queryParams: {
      type: Object,
      default() {
        return {};
      }
    },
    beforeQuery: {
      type: Function
    },
    customDialog: {},
    diff: {},
    diffBeanMap: {},
    customDialogSize: {
      type: String,
      default: 'small'
    },
    placeholder: {},
    dialogTitle: {},
    dialogShowClose: {
      type: Boolean,
      default: false
    },
    // input显示的字段
    showField: String,
    // 非叶子节点是否可以选择(单选树)
    notLeafSelectable: {
      type: Boolean,
      default: false
    },
    // 是否显示已选
    showSelected: {
      type: Boolean,
      default: false
    },
    maxHeight:{
    	type:Number,
      default:688
    },
    // 禁止 autocomplete 自动获取数据, fetch when enter hit
    fetchOnEnter: {
      type: Boolean,
      default: false
    }
  },
  watch:{
  	 dialogVisible(val) {
  	 	if(val){
  	 		this.coed = Date.parse(new Date());
  	 		this.$nextTick(()=>{
            	$(".dialog_"+this.coed+" .el-dialog__body").css("max-height",this.maxHeight + "px")
           })            
  	 	}
  	 },
    editable(editable){
      this.dispatch('ElFormItem', 'editableChange', [editable]);
    },
    // 修复监听不到 params 变化 bug
    queryParams: {
      handler(queryParams) {
        // console.log('query params changed');
        for (var key in this.queryParams_local){
          if (['wherePart','lazy_param', 'lazy_object','org'].indexOf(key) == -1){
            delete this.queryParams_local[key];
          }
        }
        if (Object.prototype.toString.call(queryParams) === '[object Object]') {
          for (var key in queryParams){
            this.queryParams_local[key] = queryParams[key];
          }
        }
        // else {
          // this.queryParams_local = {};
        // }
      },
      deep: true
    },
    templateValue: {
      handler() {
        this.handlePropChange();
      },
      deep: true
    },
    refCode() {
      this.handleRefCodeChange();
    }
  },
  components: {
    refDialog
  },
  methods: {
  	valueChange(val){
  		this.$emit("valuechange",val);
  	},
    init() {
      if (!this.editable && this.diff && this.diff.oldValue !== undefined && this.diff.newValue !== undefined) {
        this.diffLabel = {
          oldValue: this.formatRefName(this.diff.oldValue, this.diffBeanMap, 'oldValue'),
          newValue: this.formatRefName(this.diff.newValue, this.diffBeanMap, 'newValue')
        };
        return;
      }
      let tempValue;
      if(this.realField){
        tempValue = this.templateValue.beanMap[this.realField];
      }else{
        tempValue = this.templateValue[this.field];
      }
      
      this.value = '';
      if (tempValue) {
        this.value = this.formatRefName(tempValue, this.templateValue.beanMap);
        if(!this.value){
          this.setPK(tempValue);
          return; // setSelected 放到翻译的回调里处理
        }
        this.setSelected(tempValue);
      }
    },
    reset() {
      // if (!this.disabled) {
        this.value = '';
        this.selected = [];
        if(this.realField){
          this.templateValue.beanMap[this.realField] = '';
        }else{
          this.templateValue[this.field] = '';
        }
        this.$emit('reset');
      // }
    },
    onSelectData(data) {
      this.value = '';
      var name;
      if (Object.prototype.toString.call(data) === '[object Array]') {
        this.selected = data;
        data.forEach(v => {
          if (this.showField && ['name', 'refname'].indexOf(this.showField) === -1) {
            if (['code', 'refcode'].indexOf(this.showField) !== -1) {
              name = v.code || v.refcode || '';
            } else {
              name = v[this.showField] || '';
            }
          } else {
            name = v.refname ? v.refname : v.name;
          }
          this.value = this.value + ',' + name;
        });
        this.value = this.value.substr(1);
      } else if (data !== undefined) {
        this.selected = [data];
        if (this.showField && ['name', 'refname'].indexOf(this.showField) === -1) {
          if (['code', 'refcode'].indexOf(this.showField) !== -1) {
            this.value = data.code || data.refcode || '';
          } else {
            this.value = data[this.showField] || '';
          }
        } else {
          this.value = data.refname ? data.refname : data.name;
        }
      } else {
        this.selected = [];
      }
      var temp = '';
      this.selected.forEach(v => {
        temp = temp + ',' + v.id;
      });
      temp = temp.substr(1);
      if(this.realField){
        this.templateValue.beanMap[this.realField] = temp;
      }else{
        this.templateValue[this.field] = temp;
      }
      
      var payload = {
        key: this.field,
        value: this.selected
      };

      this.templateValue.beanMap = this.templateValue.beanMap || {};
      if(this.realField){
        this.templateValue.beanMap[this.realField + '_ref'] =
          this.templateValue.beanMap[this.realField + '_ref'] || {};
        this.selected.forEach((item, index) => {
          this.templateValue.beanMap[this.realField + '_ref'][item.id] = this.selected[index];
        });
      }else{
        this.templateValue.beanMap[this.field + '_ref'] =
          this.templateValue.beanMap[this.field + '_ref'] || {};
        this.selected.forEach((item, index) => {
          this.templateValue.beanMap[this.field + '_ref'][item.id] = this.selected[index];
        });
      }

      this.$emit('trigger', 'change', payload);
      this.$emit('change', payload);
      this.updateFrequentlyUsedRef();
      this.closeDialog();
    },
    // 获取常用参照
    getFrequentlyUsedRef() {
      const requestData = {
        pageSize: 0,
        refcode: this.refCode
      };
      // condition
      if (this.templateValue['base_doc_type']) {
        requestData.condition = this.templateValue['base_doc_type'];
      }
      // transmitParam
      if (this.queryParams_local && JSON.stringify(this.queryParams_local) !== '{}') {
        if (this.lazyTree) {
          this.queryParams_local = this.queryParams_local || {};
          this.queryParams_local.lazy_param = null;
          this.queryParams_local.lazy_object = null;
        }
        requestData.transmitParam = JSON.stringify(this.queryParams_local);
      }
      this.$http({
        url: '/uitemplate_web/uitemplate_ctr/mdadptor_ctr/queryRefHotspotInfo',
        method: 'post',
        data: requestData,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (!res || !res.data) {
          this.frequentlyUsedRef = [];
          return;
        }
        if (!res.data.success && res.data.error) {
          this.freErrMsg = res.data.error.errorMessage || '';
          this.frequentlyUsedRef = [];
          return;
        }
        let resData = res.data.data;
        if (!Array.isArray(resData) || !resData.length) {
          this.frequentlyUsedRef = [];
          return;
        }
        let refBeanMap = resData[0].beanMap;
        if (!refBeanMap) {
          this.frequentlyUsedRef = [];
          return;
        }
        // 常用 table 的列属性和名称
        const strFieldCode = resData[0].strFieldCode;
        const strFieldName = resData[0].strFieldName;
        if (Array.isArray(strFieldCode) && Array.isArray(strFieldName) && strFieldCode.length === strFieldName.length) {
          this.freStrFieldCode = strFieldCode;
          this.freStrFieldName = strFieldName;
        }
        let refs = refBeanMap[this.refCode + '_ref'];
        if (Object.prototype.toString.call(refs) === '[object Object]') {
          let refsArr = Object.values(refs) || [];
          if (this.refInfo.refUIType === 'RefTree') {
            refsArr.forEach(ref => {
              if (ref) {
                ref.pid = 'null'; // 全部置为根节点
                let reflabel = ref.code || ''; // show label for tree
                reflabel += ' ';
                reflabel += ref.name || '';
                ref.reflabel = reflabel;
              }
            });
          }
          this.frequentlyUsedRef = refsArr;
        } else {
          this.frequentlyUsedRef = [];
        }

      }).catch(err => {
        this.frequentlyUsedRef = [];
      }).finally(() => {
        this.dialogVisible = true;
      });
    },
    // 记录选中信息
    updateFrequentlyUsedRef() {
      if (!this.showFrePanel) {
        return;
      }
      const selectedData = this.selected;
      if (!Array.isArray(selectedData) || !selectedData.length) {
        return;
      }
      let selectedIds = [];
      selectedData.forEach(val => {
        if (val.id) {
          selectedIds.push(val.id);
        }
      });
      let requestObj = {
        ids: selectedIds.join(','),
        pageSize: 0,
        refcode: this.refCode
      };
      // condition
      if (this.templateValue['base_doc_type']) {
        requestObj.condition = this.templateValue['base_doc_type'];
      }
      // transmitParam
      if (this.queryParams_local && JSON.stringify(this.queryParams_local) !== '{}') {
        if (this.lazyTree) {
          this.queryParams_local = this.queryParams_local || {};
          this.queryParams_local.lazy_param = null;
          this.queryParams_local.lazy_object = null;
        }
        requestObj.transmitParam = JSON.stringify(this.queryParams_local);
      }
      const requestData = [requestObj];
      this.$http({
        url: '/uitemplate_web/uitemplate_ctr/mdadptor_ctr/updateRefHotspotInfo',
        method: 'post',
        data: requestData,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
      }).catch(err => {
      });
    },
    showDialog(caller) {
      let callbackFun = () => {
        // 自定义弹出框时, 不再发送请求
        if (this.disabled) {
          return;
        }
        if (this.customDialog) {
          this.dialogVisible = true;
          return;
        }
        this.refData = null;
        this.treeTableTree = null;
        if (caller !== 'suggestion') {
          this.defaultFilterStr = null;
        }
        // if (this.refInfo.refUIType === 'RefGridTree') {
        //   this.requestTreeTableTree();
        // } else if (this.refInfo.refUIType === 'RefFlat') {
        //   // flat ref
        //   this.isFlatRef = true;
        //   this.requestFlatRef();
        // } else {
        // 	if(this.isFirstClick){
        // 		this.request();
        // 		// this.dialogVisible = true;
        // 	}else{
        // 		this.requestInfo().then(res=>{
        //       this.isFirstClick = true;
        //       this.request();
        //     });
        // 	}
        // }
        if (this.isFirstClick) {
          this.getFirstPanelData();
          // this.getFrequentlyUsedRef();
        } else {
          this.requestInfo().then(res=>{
            this.isFirstClick = true;
            this.getFirstPanelData();
            // this.getFrequentlyUsedRef();
          });
        }
      }
      // if(window.engine && window.engine.tplData){
      // 	return;
      // }
      if(this._events['before-edit'] && this._events['before-edit'].length > 0){
        this.$emit('before-edit', this, callbackFun)
      }else{
        callbackFun.call(this);
      }
    
      
      
      
    },
    // 兼容不显示常用panel的请求
    getFirstPanelData() {
      if (this.showFrePanel) {
        this.getFrequentlyUsedRef();
        return;
      }
      if (this.refInfo.refUIType === 'RefGridTree') {
        this.requestTreeTableTree();
      } else if (this.refInfo.refUIType === 'RefFlat') {
        // flat ref
        this.isFlatRef = true;
        this.requestFlatRef();
      } else {
        this.request();
      }
    },
    requestTreeTableTree() {
      let requestData;
      try {
        requestData = JSON.parse(JSON.stringify(this.refInfo));
      } catch (error) {
        requestData = {};
      }
      if (this.queryParams_local && JSON.stringify(this.queryParams_local) !== '{}') {
        
      if (this.templateValue['base_doc_type']) {
        requestData.condition = this.templateValue['base_doc_type'];
      }
      if (this.lazyTree) {
        this.queryParams_local = this.queryParams_local || {};
        this.queryParams_local.lazy_param = null;
        this.queryParams_local.lazy_object = null;
      }
      }
      this.$http({
        url: '/uitemplate_web/iref_ctr/blobRefClassSearch',
        method: 'post',
        data: requestData,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        // let fotmated = this.formatTreeTableTree(res.data.data);
        if (!res || !res.data || !res.data.data) {
          return;
        }
        this.treeTableTree = this.getRefData(res.data.data) || [];
        this.dialogVisible = true;
      });
    },
    // 格式化标签显示名
    formatTreeTableTree(dataArr) {
      dataArr.forEach(node => {
        node.label = node.refcode ? node.refcode + ' ' + node.name : node.name;
        node.value = node.refpk;
      });
      return dataArr;
    },
    getSuggestions(searchStr, callback) {
      let callbackFun = () => {
        if (!searchStr) {
          callback([]);
          return;
        }
        if (this.beforeQuery) {
          var result = this.beforeQuery.call(this);
          if (!result) {
            callback([]);
            return;
          }
        }
        var tmp = function() {        
           	if(this.isFirstClick){
        		this.querySearch(searchStr, callback)
        	}else{
        		this.requestInfo().then(res=>{
	    			this.isFirstClick = true;
	  		  		this.querySearch(searchStr, callback)
  				});
        	}
          this.timeid = false;
        }.bind(this);
        if (!this.timeid) {
          this.timeid = setTimeout(tmp, 300);
        } else {
          clearTimeout(this.timeid);
          this.timeid = setTimeout(tmp, 300);
        }
      }
      if(this._events['before-edit'] && this._events['before-edit'].length > 0){
        this.$emit('before-edit', this, callbackFun)
      }else{
        callbackFun.call(this);
      }
    },
    querySearch(searchStr, callback) {
      let requestData;
      try {
        requestData = JSON.parse(JSON.stringify(this.refInfo));
      } catch (error) {
        requestData = {};
      }
      requestData.content = searchStr;
      if (this.queryParams_local && JSON.stringify(this.queryParams_local) !== '{}') {
        if (this.templateValue['base_doc_type']) {
          requestData.condition = this.templateValue['base_doc_type'];
        }
        if (this.lazyTree) {
          this.queryParams_local = this.queryParams_local || {};
          this.queryParams_local.lazy_param = null;
          this.queryParams_local.lazy_object = null;
        }
        requestData.transmitParam = JSON.stringify(this.queryParams_local);
      }
      if (this.templateValue && this.templateValue['base_doc_type']) {
        requestData.condition = this.templateValue['base_doc_type'];
      }
      this.$http({
        url: '/uitemplate_web/iref_ctr/filterRefJSON',
        method: 'post',
        data: requestData,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (!res || !res.data || !res.data.data) {
          return;
        }
        var segs;
        if (
          res.data &&
          {}.toString.call(res.data.data) === '[object Array]'
        ) {
          segs = res.data.data;
          for (var i = 0; i < segs.length; i++) {
            segs[i].value = segs[i].refname;
          }
        } else {
          segs = [{ value: '无可用数据！' }];
        }
        callback(segs);
      });
    },
    requestInfo() {
      if (this.refCode) {
        var url = '/uitemplate_web/iref_ctr/refInfo/?refCode=' + this.refCode;
        var _this = this;
        return (new Promise(function (resolve) {
	      	 _this.$http({
	          url: url,
	          method: 'get'
	        }).then(refInfo => {
	          const refInfoData = refInfo.data;
	          _this.refInfo = refInfo.data;
	          if (refInfo.data) {
	            if (typeof refInfo.data.isLazyload === 'boolean') {
	              _this.lazyTree = refInfo.data.isLazyload;
	            }
	            if (typeof refInfo.data.isPageable === 'boolean') {
	              _this.suggestionsPageable = refInfo.data.isPageable;
	            }
	            if (refInfo.data.refUIType === 'RefFlat') {
	              _this.isFlatRef = true;
              }
              if (refInfo.data.isHotspot === false) {
                _this.showFrePanel = false;
              }
	            resolve();
	          }
	        }).catch(err => {
            console.log(err);
          });
        })
        )
      }else{
      	return null;
      }
    },
    request() {
      if (this.beforeQuery) {
        var result = this.beforeQuery.call(this);
        if (!result) {
          return;
        }
      }
      if (!this.templateValue || !this.refCode || !this.field) return;
      // 树表不发commonRefSearch请求
      if (this.refInfo.refUIType === 'RefGridTree') {
        this.requestTreeTableTree();
        return;
      } else if (this.refInfo.refUIType === 'RefFlat') {
        // flat ref
        this.isFlatRef = true;
        this.requestFlatRef();
        return;
      }
      // 请求 data
      let requestData;
      try {
        requestData = JSON.parse(JSON.stringify(this.refInfo));
      } catch (error) {
        requestData = {};
      }
      if (this.defaultFilterStr) {
        requestData.content = this.defaultFilterStr;
      }
      // code为dept的参照需要额外传值
      if (this.refInfo.refCode === 'dept') {
        var tmp = location.hash.split('?')[1];
        var dept_org = tmp ? tmp.split('=')[1] : '';
        requestData.pk_org = dept_org;
      }
      if (this.templateValue['base_doc_type']) {
        requestData.condition = this.templateValue['base_doc_type'];
      }
      // if (this.lazyTree) {
      //   this.queryParams_local = this.queryParams_local || {};
      //   this.queryParams_local.lazy_param = null;
      //   this.queryParams_local.lazy_object = null;
      // }
      if (this.queryParams_local && JSON.stringify(this.queryParams_local) !== '{}') {
        if (this.lazyTree) {
          this.queryParams_local = this.queryParams_local || {};
          this.queryParams_local.lazy_param = null;
          this.queryParams_local.lazy_object = null;
        }
        requestData.transmitParam = JSON.stringify(this.queryParams_local);
      }
      // 分页
      if (this.refInfo.refUIType === 'RefGrid') {
        let pageInfo = {
          pageSize: 10,
          currPageIndex: 0
        };
        requestData.refClientPageInfo = pageInfo;
      }
      this.$http({
        url: '/uitemplate_web/iref_ctr/commonRefsearch',
        method: 'post',
        data: requestData,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(ref => {
        if (!ref || !ref.data || !ref.data.data) {
          return;
        }
        ref.data.data = this.getRefData(ref.data.data);
        this.refData = ref.data;
        if (ref.data.refViewModel && ref.data.refViewModel.refClientPageInfo && ref.data.refViewModel.refClientPageInfo.pageCount) {
          this.totalElementsInitial = ref.data.refViewModel.refClientPageInfo.pageCount;
        }
        this.dialogVisible = true;
      });
    },
    getRefData(data) {
      var refData;
      if (['RefTree'].indexOf(this.refInfo.refUIType) > -1) {
        var map = {};
        var ids = [];
        var root = [];
        data.forEach(v => {
          ids.push(v.id);
          if (this.lazyTree) {
            v.fe_isLeaf = v.isLeaf === 'true';
          }
        });
        data.forEach(v => {
          if (ids.indexOf(v.pid) > -1) {
            if (map[v.pid]) {
              map[v.pid].push(v);
            } else {
              map[v.pid] = [v];
            }
          } else {
            root.push(v);
          }
        });
        var setChild = function(node) {
          var tmp = node;
          if (map[tmp.id]) {
            tmp.children = map[tmp.id];
            tmp.children.forEach(v => {
              setChild(v);
            });
          }
        };
        root.forEach(v => {
          setChild(v);
        });
        refData = root;
      } else {
        refData = data;
      }
      return refData;
    },
    closeDialog() {
      this.dialogVisible = false;
    },

    /**
     * 格式化非编辑态时参照的显示值
     * val: 参照值
     * beanMap: 对应的beanMap
     * type: diff ref 对应的新值或旧值(oldValue || newValue)
     */
    formatRefName(val, beanMap, type) {
      if (!val || !beanMap) {
        return '';
      }
      if(this.realField){
        var data = beanMap[this.realField + '_ref'];  
      }else{
        var data = beanMap[this.field + '_ref'];
      }
      if (Object.prototype.toString.call(data) !== '[object Object]') {
        return '';
      }
      var valueArr = [];
      var tmp = val.split(',');
      var refObj = '';
      Object.keys(data).forEach(key => {
        refObj = '';
        if(key === type){
          refObj = data[key] && data[key][val];
        }else{
          if (tmp.indexOf(key) > -1) {
            refObj = type ? data[key][type] : data[key];
          }
        }
        if(refObj){
          if (this.showField && ['name', 'refname'].indexOf(this.showField) === -1) {
            if (['code', 'refcode'].indexOf(this.showField) !== -1) {
              let tmp_value = refObj.code || refObj.refcode || '';
              valueArr.push(tmp_value);
            } else {
              valueArr.push(refObj[this.showField]);
            }
          } else {
            let tmp_value = refObj.name || refObj.refname || '';
            valueArr.push(tmp_value);
          }
        }
      });
      return valueArr.join(',');
    },

    setSelected(val) {
      this.selected = [];
       if (!this.templateValue.beanMap) {
        return;
      }
      if(this.realField){
        var data = this.templateValue.beanMap[this.realField + '_ref'];
      }else{
        var data = this.templateValue.beanMap[this.field + '_ref'];
      }
      if (Object.prototype.toString.call(data) !== '[object Object]') {
        return;
      }
      var tmp = val.split(',');
      Object.keys(data).forEach(key => {
        if (tmp.indexOf(key) > -1) {
          this.selected.push(data[key]);
        }
      });
    },

    handleInputBlur() {
      // console.log('************* blur ******************');
      const currentName = this.value;
      this.defaultFilterStr = currentName;
      // 为空
      if (!currentName) {
        // 清空当前参照
        this.reset();
        this.$emit('trigger', 'change', {
          key: this.field,
          value: []
        });
        this.$emit('change', {
          key: this.field,
          value: []
        });
        return;
      }
      // 单选或多选只选了一个值
      let currentValue;
      if(this.realField){
        currentValue = this.templateValue.beanMap[this.realField];
      }else{
        currentValue = this.templateValue[this.field];
      }
      if (!currentValue) {
        this.reset();
        this.$emit('trigger', 'change', {
          key: this.field,
          value: []
        });
        this.$emit('change', {
          key: this.field,
          value: []
        });
        return;
      }
      const beanMap = this.templateValue.beanMap;
      if (!this.isMutiSelect || currentValue.indexOf(',') === -1) {
        const rightName = this.formatRefName(currentValue, beanMap);
        if (!rightName || rightName !== currentName) {
          this.reset();
          this.$emit('trigger', 'change', {
          key: this.field,
          value: []
        });
        this.$emit('change', {
          key: this.field,
          value: []
        });
        }
        return;
      }
      // 多选
      let currentValueArr = currentValue.split(',');
      let currentNameArr = currentName.split(',');
      let finalValueArr = [];
      let rightNameArr = [];
      let refData;
      if(this.realField){
        refData = beanMap[this.realField + '_ref'];
      }else{
        refData = beanMap[this.field + '_ref'];
      }
      if (!refData) {
        this.reset();
        this.$emit('trigger', 'change', {
          key: this.field,
          value: []
        });
        this.$emit('change', {
          key: this.field,
          value: []
        });
      }
      Object.keys(refData).forEach(key => {
        if (currentValueArr.indexOf(key) !== -1) {
          const refObj = refData[key];
          let refName;
          if (refObj) {
            if (this.showField && ['name', 'refname'].indexOf(this.showField) === -1) {
              if (['code', 'refcode'].indexOf(this.showField) !== -1) {
                refName = refObj.code || refObj.refcode || '';
              } else {
                refname = refObj[this.showField] || '';
              }
            } else {
              refName = refObj.name || refObj.refname || '';
            }
          }
          // 如果当前显示值数组中存在已选中值对应名称, 则将该值放入结果数组
          if (refName && currentNameArr.indexOf(refName) !== -1) {
            finalValueArr.push(key);
            rightNameArr.push(refName);
          }
        }
      });
      if (finalValueArr.length) {
        if(this.realField){
          this.templateValue.beanMap[this.realField] = finalValueArr.join(',');
        }else{
          this.templateValue[this.field] = finalValueArr.join(',');
        }
        
        this.value = rightNameArr.join(',');
      } else {
        this.reset();
        this.$emit('trigger', 'change', {
          key: this.field,
          value: []
        });
        this.$emit('change', {
          key: this.field,
          value: []
        });
      }
    },
    // templateValue 或 refCode 变化后处理事件
    handlePropChange() {
      if(this.realField){
        if (this.templateValue && this.templateValue.beanMap[this.realField]) {
          if(typeof this.templateValue.beanMap[this.realField + '_ref'] === 'undefined'){
            this.init();
          }else if(this.value !== this.formatRefName(this.templateValue.beanMap[this.realField], this.templateValue.beanMap) || (this.diff && this.diff.oldValue !== undefined && this.diff.newValue !== undefined)){
            this.init();
          }
        } else {
          if(this.value){
            this.reset();
          }
        }
      } else{
        if (this.templateValue && this.templateValue[this.field]) {
          this.value = this.templateValue[this.field];
          if(typeof this.templateValue.beanMap[this.field + '_ref'] === 'undefined'){
            this.init();
          }else if(this.value !== this.formatRefName(this.templateValue[this.field], this.templateValue.beanMap) || (this.diff && this.diff.oldValue !== undefined && this.diff.newValue !== undefined)){
            this.init();
          }
        } else {
          if(this.value){
            this.reset();
          }
        }
      }
      
    },
    handleRefCodeChange(){
      this.requestInfo();
    },
    // 根据pk获取beanmap
    getBeanMapByPK(pks) {
      if (!pks) {
        return;
      }
      const requestUrl = '/uitemplate_web/uitemplate_ctr/mdadptor_ctr/getRefTranslateInfo';
      let f = this.field;
      if(this.realField)
        f = this.realField;
      const requestData = [{
        fieldCode: f,
        refCode: this.refCode,
        param: null,
        id: pks
      }];
      this.$http({
        url: requestUrl,
        method: 'post',
        data: requestData,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (!res || !res.data || !Array.isArray(res.data)) {
          return;
        }
        let resBeanMap;
        for (let i = 0; i < res.data.length; i++) {
          const obj = res.data[i];
          if (obj.fieldCode === this.field && obj.refCode === this.refCode) {
            resBeanMap = obj.beanMap || {};
          }
        }
        this.templateValue.beanMap = this.templateValue.beanMap || {};
        if(this.realField){
          this.templateValue.beanMap[this.realField + '_ref'] = resBeanMap[this.realField + '_ref'] || {};
          this.templateValue.beanMap[this.realField] = pks;
        }else{
          this.templateValue.beanMap[this.field + '_ref'] = resBeanMap[this.field + '_ref'] || {};
          this.templateValue[this.field] = pks;
        }
        this.setSelected(pks);
        // 进入的时候不会触发监听，主动调用
        this.handlePropChange();
      });
    },
    setQueryParamsByKey(key, value) {
      this.queryParams_local = this.queryParams_local || {};
      this.queryParams_local[key] = value || '';
    },

    /**
     * 平铺参照
     */
    requestFlatRef() {
      if (!this.refInfo || !Array.isArray(this.refInfo.strFieldCode) || !this.refInfo.strFieldCode.length) {
        console.log('未获取正确的refInfo');
        return;
      }
      const requestData = {
        refModelUrl: this.refInfo.refModelUrl,
        content: this.refInfo.strFieldCode[0]
      };
      this.$http({
        url: '/uitemplate_web/iref_ctr/getFlatRefData',
        method: 'post',
        data: requestData,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (!res || !res.data || !res.data.data) {
          return;
        }
        res.data.data = this.getRefData(res.data.data);
        this.refData = res.data;
        this.dialogVisible = true;
      });
    },

    /**
     * 暴露方法
     */
    setPK(pk) {
      this.getBeanMapByPK(pk);
    },
    setPKs(pks) {
      this.getBeanMapByPK(pks);
    },
    setWherePart(param) {
      this.setQueryParamsByKey('wherePart', param);
    },
    addWherePart(param) {
      this.queryParams_local = this.queryParams_local || {};
      if (!param) {
        return;
      }
      this.queryParams_local.wherePart += param;
    },
    setCrossPart(crossSql){
      if (this._crossSql === undefined){
        this.queryParams_local.wherePart = crossSql + (this.queryParams_local.wherePart ? (' ' + this.queryParams_local.wherePart) : '');  //' ' + (this.queryParams_local.wherePart || '');
      }else{ // 第二次打开参照，需要替换掉原有的交叉校验过滤sql
        this.queryParams_local.wherePart = this.queryParams_local.wherePart.replace(this._crossSql, crossSql);
      }
      this._crossSql = crossSql;
    },
    setOrg(param) {
      this.setQueryParamsByKey('org', param);
    },
    triggerFormItemChange() {
      if (this.templateValue && this.field) {
        if(this.realField){
          this.dispatch('ElFormItem', 'el.form.change', this.templateValue.beanMap[this.realField]);
        }else{
          this.dispatch('ElFormItem', 'el.form.change', this.templateValue[this.field]);
        }
      }
    }
  },
  created: function() {
    this.queryParams_local = $.extend({}, this.queryParams || {});
    if(this.realField){
      if (this.templateValue && this.templateValue.beanMap[this.realField]) {
        this.init();
      }
    }else{
      if (this.templateValue && this.templateValue[this.field]) {
        this.init();
      }
    }
    
    // if (!this.templateValue || !this.refCode || !this.field) {
    //   this.triggerOnFocus = false;
    // }
    // 自定义弹出框时, 不发送请求
    if (this.customDialog) {
      return;
    }
  /*  this.requestInfo();*/
    this.$on('change', this.triggerFormItemChange);
  },
  mounted: function(){
    this.dispatch('ElFormItem', 'editableChange', [this.editable]);
  }
};
/* eslint-enable */
</script>

<style>
</style>
