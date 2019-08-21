<template>
  <div class="ref-container">
    <!-- 编辑态 -->
    <template v-if="editable">
      <!-- 下拉 -->
      <select-ref
        v-if="panelShowType === 'select'"
        v-bind="$props"
        :refInfo="refInfo"
        :queryParams="queryParams_local"
        @change="onSelectData">
      </select-ref>
      <el-autocomplete
        v-else
        :placeholder="placeholder"
        v-model="value"
        v-show="true"
        icon="pt-fenlei1"
        :width="width"
        :disabled="disabled"
        @valuechange="valueChange"
        :on-icon-click="showRefPanel"
        :triggerOnFocus="triggerOnFocus"
        :fetch-suggestions="getSuggestions"
        :showBtnDialog="true"
        @showDialog="showRefPanel"
        @select="onSelectData"
        @blur="handleInputBlur"
        :fetchOnEnter="fetchOnEnter"
        :autoMatchWhenEnter="true">
      </el-autocomplete>
    </template>
    <ifbp-tooltip
      :content="value"
      :diff="diffLabel"
      v-else>
    </ifbp-tooltip>

    <el-dialog
      v-if="panelShowType === 'dialog'"
      class="ref-dialog"
      :custom-class="'dialog_' + coed"
      v-model="dialogVisible"
      @close="closeDialog"
      :title="dialogTitle || (refInfo && refInfo.refName)"
      :showClose="dialogShowClose"
      :size="customDialogSize"
      :width="width">
      <component
        v-if="refInfo || (customDialog !== 'ifbp-ref-panel' && !refCode)"
        :is="customDialog"
        v-bind="$props"
        :panelVisible="dialogVisible"
        :refInfo="refInfo"
        :selected="selected"
        :queryParams="queryParams_local"
        :defaultFilterStr="defaultFilterStr"
        @customRefConfirm="onSelectData"
        @customRefCancel="closeDialog">
      </component>
    </el-dialog>

    <el-popover
      v-else-if="panelShowType === 'popover'"
      v-model="popoverVisible"
      ref="popoverRef"
      class="ref-popover"
      :width="parseInt(width)">
      <component
        v-if="refInfo || (customDialog !== 'ifbp-ref-panel' && !refCode)"
        :is="customDialog"
        v-bind="$props"
        :panelVisible="popoverVisible"
        :refInfo="refInfo"
        :selected="selected"
        :queryParams="queryParams_local"
        :defaultFilterStr="defaultFilterStr"
        @customRefConfirm="onSelectData"
        @customRefCancel="closeDialog">
      </component>
    </el-popover>

  </div>
</template>

<script>
/* eslint-disable */
import emitter from 'ifbp-element/src/mixins/emitter';
import SelectRef from './selectRef.vue';
export default {
  name: 'ElRef',
  components: {
    'select-ref': SelectRef
  },
  data() {
    return {
      coed: '',
      value: '',
      selected: [],
      refInfo: null,
      timeid: false,
      triggerOnFocus: false,
      diffLabel: null,
      // query params 本地变量
      queryParams_local: {},

      // 传入dialog的str
      defaultFilterStr: null,
      isFirstClick: false, //判断是不是被点记过,

      dialogVisible: false,
      popoverVisible: false,

      // for updating frequently used refs
      showFrePanel: true,
      lazyTree: false,
    };
  },
  mixins: [emitter],
  computed: {
    realField() {
      if (this.field.indexOf('.') > -1) {
        return this.field.substring((this.field.indexOf('.') + 1));
      } else {
        return '';
      }
    }
  },
  props: {
    width: {
      type: String,
      default: '680px'
    },
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
      default () {
        return {};
      }
    },
    beforeQuery: {
      type: Function
    },
    customDialog: {
      type: String,
      default: 'ifbp-ref-panel'
    },
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
      default: true
    },
    // 是否显示已选
    showSelected: {
      type: Boolean,
      default: true
    },
    maxHeight: {
      type: Number,
      default: 688
    },
    // 禁止 autocomplete 自动获取数据, fetch when enter hit
    fetchOnEnter: {
      type: Boolean,
      default: false
    },

    // 2018-12-17
    // 内容展示方式 'dialog' / 'select' / 'popover'
    panelShowType: {
      type: String,
      default: 'dialog'
    },

    // 2019-01-02
    isUseDataPower: {
      type: Boolean,
      default: true
    },
    dataPowerOperation_Code: {
      type: String,
      default: null
    },

    // 控制台不输出错误信息
    silent: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.coed = Date.parse(new Date());
        this.$nextTick(() => {
          $(".dialog_" + this.coed + " .el-dialog__body").css("max-height", this.maxHeight + "px")
        })
      }
    },
    editable(editable) {
      this.dispatch('ElFormItem', 'editableChange', [editable]);
    },
    // 修复监听不到 params 变化 bug
    queryParams: {
      handler(queryParams) {
        let queryParams_local_c = {}
        for (var key in this.queryParams_local) {
            queryParams_local_c[key] = queryParams[key];
          }
        // console.log('query params changed');
        for (var key in queryParams_local_c) {
          if (['wherePart', 'lazy_param', 'lazy_object', 'org'].indexOf(key) == -1) {
            delete queryParams_local_c[key];
          }
        }
        if (Object.prototype.toString.call(queryParams) === '[object Object]') {
          for (var key in queryParams) {
            queryParams_local_c[key] = queryParams[key];
          }
        }
        this.queryParams_local = queryParams_local_c;
      },
      deep: true
    },
    templateValue: {
      handler() {
          debugger
        this.handlePropChange();
      },
    },
    refCode() {
      this.handleRefCodeChange();
    }
  },
  methods: {
    valueChange(val) {
      this.$emit("valuechange", val);
    },
    init() {
      debugger
      if (!this.editable && this.diff && this.diff.oldValue !== undefined && this.diff.newValue !== undefined) {
        this.diffLabel = {
          oldValue: this.formatRefName(this.diff.oldValue, this.diffBeanMap, 'oldValue'),
          newValue: this.formatRefName(this.diff.newValue, this.diffBeanMap, 'newValue')
        };
        return;
      }
      let tempValue = '';
      if (this.realField) {
        tempValue = this.templateValue.beanMap[this.realField];
      } else {
        tempValue = this.templateValue[this.field];
      }

      this.value = '';
      if (tempValue) {
        this.value = this.formatRefName(tempValue, this.templateValue.beanMap);
        if (!this.value) {
          this.setPK(tempValue);
          return; // setSelected 放到翻译的回调里处理
        }
        this.setSelected(tempValue);
        if (this.panelShowType === 'select') {
          this.selectRefValue = this.isMutiSelect ? tempValue.split(',') : tempValue;
        }
      }
    },
    reset() {
      // if (!this.disabled) {
      this.value = '';
      this.selected = [];
      if (this.realField) {
        this.templateValue.beanMap[this.realField] = '';
      } else {
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
      if (this.realField) {
        this.templateValue.beanMap[this.realField] = temp;
      } else {
        this.templateValue[this.field] = temp;
      }

      var payload = {
        key: this.field,
        value: this.selected
      };

      this.templateValue.beanMap = this.templateValue.beanMap || {};
      if (this.realField) {
        this.templateValue.beanMap[this.realField + '_ref'] =
          this.templateValue.beanMap[this.realField + '_ref'] || {};
        this.selected.forEach((item, index) => {
          this.templateValue.beanMap[this.realField + '_ref'][item.id] = this.selected[index];
        });
      } else {
        this.templateValue.beanMap[this.field + '_ref'] =
          this.templateValue.beanMap[this.field + '_ref'] || {};
        this.selected.forEach((item, index) => {
          this.templateValue.beanMap[this.field + '_ref'][item.id] = this.selected[index];
        });
      }
      this.$emit('trigger', 'change', payload, {type: 'ref'});
      this.$emit('change', payload, {type: 'ref'});
      this.updateFrequentlyUsedRef();
      this.closeDialog();
    },
    // 记录选中信息
    updateFrequentlyUsedRef() {
      // frequently used ref disabled
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
      }).then(res => {}).catch(err => {});
    },
    showRefPanel(caller) {
      if (this.disabled) {
        return;
      }
      if (this._events['before-edit'] && this._events['before-edit'].length > 0) {
        this.$emit('before-edit', this, this.setPanelVisible);
      } else {
        this.setPanelVisible();
      }
    },
    setPanelVisible() {
      if (!this.refCode && this.customDialog !== 'ifbp-ref-panel') {
        if (!this.silent) {
          console.log(`${this.field} 对应的 refCode 为空, 但仍将显示 ${this.panelShowType}.`);
        }
        switch (this.panelShowType) {
          case 'dialog':
            this.dialogVisible = true;
            break;
          case 'popover':
            this.popoverVisible = true
            break;
          default:
            break;
        }
        return;
      }
      this.requestInfo().then(res => {
        switch (this.panelShowType) {
          case 'dialog':
            this.dialogVisible = true;
            break;
          case 'popover':
            this.popoverVisible = true
            break;
          default:
            break;
        }
      }).catch(err => {});;
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
        var tmp = function () {
          if (this.isFirstClick) {
            this.querySearch(searchStr, callback)
          } else {
            this.requestInfo().then(res => {
              this.isFirstClick = true;
              this.querySearch(searchStr, callback)
            }).catch(err => {});;
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
      if (this._events['before-edit'] && this._events['before-edit'].length > 0) {
        this.$emit('before-edit', this, callbackFun)
      } else {
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
      requestData.isNotLeafSelected = this.notLeafSelectable;
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
          res.data && {}.toString.call(res.data.data) === '[object Array]'
        ) {
          segs = res.data.data;
          for (var i = 0; i < segs.length; i++) {
            segs[i].value = segs[i].refname;
          }
        } else {
          segs = [{
            value: '无可用数据！'
          }];
        }
        callback(segs);
      });
    },
    requestInfo() {
      return new Promise((resolve, reject) => {
        if (!this.refCode) {
          if (!this.silent) {
            console.log(`${this.field} 对应的 refCode 不能为空.`);
          }
          return reject();
        }
        if (this.isFirstClick) {
          return resolve();
        }
        this.isFirstClick = true;
        this.$http({
          url: `/uitemplate_web/iref_ctr/refInfo/?refCode=${this.refCode}`,
          method: 'get'
        }).then(res => {
          if (!res || !res.data) {
            if (!this.silent) {
              console.log(`获取 refCode 为 ${this.refCode} 的参照的 refInfo 失败.`);
            }
            return reject();
          }
          let refInfo = res.data;
          refInfo.isUseDataPower = this.isUseDataPower;
          refInfo.dataPowerOperation_Code = this.dataPowerOperation_Code;
          this.refInfo = refInfo;
          if (typeof refInfo.isLazyload === 'boolean') {
            this.lazyTree = refInfo.isLazyload;
          }
          if (refInfo.isHotspot === false) {
            this.showFrePanel = false;
          }
          resolve();
        }).catch(err => {
          if (!this.silent) {
            console.log(err);
          }
          reject();
        });
      });
    },
    closeDialog() {
      this.dialogVisible = false;
      this.popoverVisible = false;
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
      var data
      if (this.realField) {
         data = beanMap[this.realField + '_ref'];
      } else {
         data = beanMap[this.field + '_ref'];
      }
      if (Object.prototype.toString.call(data) !== '[object Object]') {
        return '';
      }
      var valueArr = [];
      var tmp = (typeof val)==='string'? val.split(','):val;
      var refObj = '';
      Object.keys(data).forEach(key => {
        refObj = '';
        if (key === type) {
          refObj = data[key] && data[key][val];
        } else {
          if (tmp.indexOf(key) > -1) {
            refObj = type ? data[key][type] : data[key];
          }
        }
        if (refObj) {
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
      if (this.realField) {
        var data = this.templateValue.beanMap[this.realField + '_ref'];
      } else {
        var data = this.templateValue.beanMap[this.field + '_ref'];
      }
      if (Object.prototype.toString.call(data) !== '[object Object]') {
        return;
      }
      var tmp = (typeof val)==='string'? val.split(','):val;
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
        }, {type: 'ref'});
        this.$emit('change', {
          key: this.field,
          value: []
        }, {type: 'ref'});
        return;
      }
      // 单选或多选只选了一个值
      let currentValue;
      if (this.realField) {
        currentValue = this.templateValue.beanMap[this.realField];
      } else {
        currentValue = this.templateValue[this.field];
      }
      if (!currentValue) {
        this.reset();
        this.$emit('trigger', 'change', {
          key: this.field,
          value: []
        }, {type: 'ref'});
        this.$emit('change', {
          key: this.field,
          value: []
        }, {type: 'ref'});
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
          }, {type: 'ref'});
          this.$emit('change', {
            key: this.field,
            value: []
          }, {type: 'ref'});
        }
        return;
      }
      // 多选
      let currentValueArr = currentValue.split(',');
      let currentNameArr = currentName.split(',');
      let finalValueArr = [];
      let rightNameArr = [];
      let refData;
      if (this.realField) {
        refData = beanMap[this.realField + '_ref'];
      } else {
        refData = beanMap[this.field + '_ref'];
      }
      if (!refData) {
        this.reset();
        this.$emit('trigger', 'change', {
          key: this.field,
          value: []
        }, {type: 'ref'});
        this.$emit('change', {
          key: this.field,
          value: []
        }, {type: 'ref'});
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
        if (this.realField) {
          this.templateValue.beanMap[this.realField] = finalValueArr.join(',');
        } else {
          this.templateValue[this.field] = finalValueArr.join(',');
        }

        this.value = rightNameArr.join(',');
      } else {
        this.reset();
        this.$emit('trigger', 'change', {
          key: this.field,
          value: []
        }, {type: 'ref'});
        this.$emit('change', {
          key: this.field,
          value: []
        }, {type: 'ref'});
      }
    },
    // templateValue 或 refCode 变化后处理事件
    handlePropChange() {
      if (this.realField) {
        if (this.templateValue && this.templateValue.beanMap[this.realField]) {
          if (typeof this.templateValue.beanMap[this.realField + '_ref'] === 'undefined') {
            this.init();
          } else if (this.value !== this.formatRefName(this.templateValue.beanMap[this.realField], this.templateValue.beanMap) || (this.diff && this.diff.oldValue !== undefined && this.diff.newValue !== undefined)) {
            this.init();
          }
        } else {
          if (this.value) {
            this.reset();
          }
        }
      } else {
        if (this.templateValue && this.templateValue[this.field]) {
          if (!this.templateValue.beanMap ||(typeof this.templateValue.beanMap[this.field + '_ref'] === 'undefined')) {
            this.init();
          } else if (this.value !== this.formatRefName(this.templateValue[this.field], this.templateValue.beanMap) || (this.diff && this.diff.oldValue !== undefined && this.diff.newValue !== undefined)) {
            this.init();
          }
        } else {
          if (this.value) {
            this.reset();
          }
        }
      }

    },
    handleRefCodeChange() {
      this.isFirstClick = false;
      this.requestInfo().then(res => {}).catch(err => {});
    },
    // 根据pk获取beanmap
    getBeanMapByPK(pks) {
      if (!pks) {
        return;
      }
      const requestUrl = '/uitemplate_web/uitemplate_ctr/mdadptor_ctr/getRefTranslateInfo';
      let f = this.field;
      if (this.realField)
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
        if (this.realField) {
          this.templateValue.beanMap[this.realField + '_ref'] = resBeanMap[this.realField + '_ref'] || {};
          this.templateValue.beanMap[this.realField] = pks;
        } else {
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
    setCrossPart(crossSql) {
      if (this._crossSql === undefined) {
        this.queryParams_local.wherePart = crossSql + (this.queryParams_local.wherePart ? (' ' + this.queryParams_local.wherePart) : ''); //' ' + (this.queryParams_local.wherePart || '');
      } else { // 第二次打开参照，需要替换掉原有的交叉校验过滤sql
        this.queryParams_local.wherePart = this.queryParams_local.wherePart.replace(this._crossSql, crossSql);
      }
      this._crossSql = crossSql;
    },
    setOrg(param) {
      this.setQueryParamsByKey('org', param);
    },
    triggerFormItemChange() {
      if (this.templateValue && this.field) {
        if (this.realField) {
          this.dispatch('ElFormItem', 'el.form.change', this.templateValue.beanMap[this.realField]);
        } else {
          this.dispatch('ElFormItem', 'el.form.change', this.templateValue[this.field]);
        }
      }
    }
  },
  created() {
    this.queryParams_local = $.extend({}, this.queryParams || {});
    if(this.field==='corp_id'){
    debugger
    }

    if (this.realField) {
      if (this.templateValue && this.templateValue.beanMap[this.realField]) {
        this.init();
      }
    } else {
      if (this.templateValue && this.templateValue[this.field]) {
        this.init();
      }
    }

    if (this.panelShowType === 'select') {
      this.requestInfo().then(res => {}).catch(err => {});
    }
    this.$on('change', this.triggerFormItemChange);
  },
  mounted() {
    this.dispatch('ElFormItem', 'editableChange', [this.editable]);
  }
};
/* eslint-enable */
</script>

<style>
  .ref-popover > .el-popover {
    padding: 0;
  }
</style>
