<template>
  <div class="el-form-item" :class="{
    'is-error': validateState === 'error',
    'is-validating': validateState === 'validating',
    'is-required': (isRequired || required) && editable,
    'mt-el-form-item': !IsPC,
    'hav-bottom': !editable,
    'form-item-top': itemLabelPosition === 'top',
    'hav-padding-right': havPaddingRight
  }" v-bind:style="itemStyle">
    <div class="mt-form-item-content" v-if="!IsPC">
        <label :for="prop" class="mt-el-form-item__label" :class="{'mt-lable-disabled':disabled}" v-bind:style="labelStyle" v-if="label" :title="label">
          <slot name="label">{{label + form.labelSuffix}}</slot>
        </label>
        <div class="mt-el-form-item__content" :class="{'edit-form': havLablePosition}" v-bind:style="mtContentStyle">
          <slot></slot>
        </div>
         <transition name="el-zoom-in-top">
            <div class="mt-el-form-item__error" v-if="validateState === 'error' && showMessage && form.showMessage">{{validateMessage}}</div>
          </transition>
    </div>
    <div v-else>
        <label :for="prop" :class="['el-form-item__label',formTipsContent?'el-form-tips-item__label':'']" v-bind:style="labelStyle" v-if="label" :title="label">
          <slot name="label"><span>{{label + form.labelSuffix}}</span></slot>
          <ifbp-tips class="form-item-tips" :ifbp-popover-close="true" trigger="click" :content="formTipsContent" v-if="formTipsContent"></ifbp-tips>
          <slot name="formTips"></slot>
        </label>
        <div class="el-form-item__content" v-bind:style="contentStyle">
          <div class="el-form-item__cover"  v-if="validateState === 'error' && showMessage && form.showMessage"></div>
          <slot></slot>
          <transition name="el-zoom-in-top">
            <div class="el-form-item__error" v-if="validateState === 'error' && showMessage && form.showMessage">{{validateMessage}}</div>
          </transition>
        </div>
    </div>
  </div>
</template>
<script>
import AsyncValidator from "async-validator";
import emitter from "ifbp-element/src/mixins/emitter";
import { IsPC } from 'ifbp-element/src/utils/util';
function noop() {}

function getPropByPath(obj, path) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, ".$1");
  path = path.replace(/^\./, "");

  let keyArr = path.split(".");
  let i = 0;

  for (let len = keyArr.length; i < len - 1; ++i) {
    let key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      throw new Error("please transfer a valid prop path to form item!");
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj[keyArr[i]]
  };
}

export default {
  name: "ElFormItem",

  componentName: "ElFormItem",

  mixins: [emitter],

  props: {
     itemLabelPosition: {
      type: String,
      default: 'left'
    },
    label: String,
    labelWidth: String,
    labelColor:String,
    width: String,
    prop: String,
    required: Boolean,
    rules: [Object, Array],
    error: String,
    validateStatus: String,
    showMessage: {
      type: Boolean,
      default: true
    },
    tipsContent: {
      type:String
    }
  },
  watch: {
    error(value) {
      this.validateMessage = value;
      this.validateState = value ? "error" : "";
    },
    validateStatus(value) {
      this.validateState = value;
    },
    required(value){
      this.resetAddRules();
    },
    tipsContent(val) {
      this.formTipsContent = val;
    }
  },
  computed: {
    labelStyle() {
      var ret = {};
      if (this.form.labelPosition === "top") return ret;
      var labelWidth =
        this.labelWidth || (this.form.hasLabelWidth && this.form.labelWidth);
      if (parseInt(labelWidth) > 150) {
        labelWidth = "150px";
      }
      if (labelWidth) {
        ret.width = labelWidth;
      }
      var labelColor = this.labelColor;
      if(labelColor){
      	ret.color = labelColor;
      }
      return ret;
    },
    itemStyle() {
      var ret = {};
      var width = this.width;
      // var width = '200px';
      if (width) {
        ret.width = width;
      }
      return ret;
    },
    contentStyle() {
      var ret = {};
      if (this.form.labelPosition === "top" || this.form.inline) return ret;
      var labelWidth =
        this.labelWidth || (this.form.hasLabelWidth && this.form.labelWidth);
      if (labelWidth) {
        ret.marginLeft = labelWidth;
      }
      return ret;
    },
    mtContentStyle(){
      var ret={}
      if (this.form.labelPosition === "top") {
        ret={
          "box-sizing": "border-box",
          "display":'block',
          "text-align": "left",
          "padding": "0 16px"
        }
        return ret;
      }else{
         this.havLablePosition=true;
         ret={
          "box-sizing": "border-box",
          "display":'inline-block',
          "text-align": "right",
          "padding-right": "16px"
        }
        var clientWidth=document.documentElement.offsetWidth;
        var labelWidth= this.labelWidth  || (this.form.hasLabelWidth && this.form.labelWidth);
        ret.width=(clientWidth-parseInt(labelWidth))-this.getFontSize()+'px';
        return ret;
      }

    },
    form() {
      try{
        var parent = this.$parent;
        while (parent.$options.componentName !== "ElForm") {
          parent = parent.$parent;
        }
        return parent;
      }catch(e){
        console.log('form item form try catch');
        return {};
      }

    },
    fieldValue: {
      cache: false,
      get() {
        var model = this.form.model;
        if (!model || !this.prop) {
          return;
        }

        var path = this.prop;
        if (path.indexOf(":") !== -1) {
          path = path.replace(/:/, ".");
        }

        return getPropByPath(model, path).v;
      }
    }
  },
  data() {
    return {
      validateState: "",
      validateMessage: "",
      validateDisabled: false,
      validator: {},
      isRequired: false,
      validateType: '',
      addRules: [],
      itemAddRules: [],
      editable: true,
      disabled: false,
      IsPC: IsPC(),
      havLablePosition:false,
      formTipsContent: '',
      havPaddingRight:''
    };
  },
  methods: {
    resetAddRules(){
      this.addRules = [];
      this.addRules = this.addRules.concat(this.itemAddRules);
      if (!this.isRequired && this.required) {
        // 设置了必输标记但是没有对应的规则
        this.addRules.push({
          required: true,
          message: "请输入" + this.label,
          trigger: "blur"
        });
        this.addRules.push({
          required: true,
          message: "请输入" + this.label,
          trigger: "change"
        });
      }
      if (this.validateType){
        let rule = {
          trigger: "blur"
        };
        let validate_type = this.validateType.split(',');
        validate_type.map(item => {
        switch(item){
          case 'Phone':
            rule.pattern = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
            rule.message = '电话格式错误';
            break;
          case 'Mobile':
            rule.pattern = /^1[34578]\d{9}$/;
            rule.message = '手机格式错误';
            break;
          case 'Email':
            rule.pattern = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
            rule.message = '邮箱格式错误';
            break;
          case 'NoChinese':
            rule.pattern = /^[^\u4e00-\u9fa5]+$/;
            rule.message = '不能包含中文';
            break;
          default:
            break;
        }
        this.addRules.push(rule);
        let rule1 = JSON.parse(JSON.stringify(rule));
        rule1.trigger = 'change';
        this.addRules.push(rule1);
        })
      }

    },
    validate(trigger, callback = noop) {
      this.validateState = '';
      this.validateMessage = '';
      var rules = this.getFilteredRule(trigger);
      if (!rules || rules.length === 0) {
        callback();
        return true;
      }

      this.validateState = "validating";

      var descriptor = {};
      descriptor[this.prop] = rules;

      var validator = new AsyncValidator(descriptor);
      var model = {};
      if (this.fieldValue || this.fieldValue === 0) {
        model[this.prop] = this.fieldValue + ""; // 由于校验的规则中默认的type为string，因此校验时统一转为字符串
      } else {
        model[this.prop] = "";
      }
      validator.validate(model, { firstFields: true }, (errors, fields) => {
        this.validateState = !errors ? "success" : "error";
        if(this.validateState === "error" && !this.form.firstValidateError){
          this.form.firstValidateError = true
          let headerHeight = $(".header")[0] ? $(".header")[0].offsetHeight : 0
          headerHeight += 8;
          if($(this.$el).offset().top - headerHeight < 0){
            this.$el.scrollIntoView();
          }
        }
        this.validateMessage = errors ? errors[0].message : "";

        callback(this.validateMessage);
      });
    },
    resetField() {
      this.validateState = "";
      this.validateMessage = "";

      let model = this.form.model;
      let value = this.fieldValue;
      let path = this.prop;
      if (path.indexOf(":") !== -1) {
        path = path.replace(/:/, ".");
      }

      let prop = getPropByPath(model, path);

      if (Array.isArray(value)) {
        this.validateDisabled = true;
        prop.o[prop.k] = [].concat(this.initialValue);
      } else {
        this.validateDisabled = true;
        prop.o[prop.k] = this.initialValue;
      }
    },
    getRules() {
      var formRules = this.form.rules;
      var selfRuels = this.rules;
      var addRules = this.addRules;

      formRules = formRules ? formRules[this.prop] : [];

      return [].concat(selfRuels || formRules || []).concat(addRules);
    },

    getBaseRules() {
      var formRules = this.form.rules;
      var selfRuels = this.rules;
      formRules = formRules ? formRules[this.prop] : [];
      return [].concat(selfRuels || formRules || []);
    },
    getFilteredRule(trigger) {
      var rules = this.getRules();

      return rules.filter(rule => {
        return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
      });
    },
    onFieldBlur() {
      this.validate("blur");
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false;
        return;
      }

      this.validate("change");
    },
    onValidateErr(errMessage) {
      this.validateState = "error";
      this.validateMessage = errMessage;
    },
    onvalidateType(validateType){
      this.validateType = validateType;
      this.resetAddRules();
    },
    onAddRules(rules){
      this.itemAddRules = this.itemAddRules.concat(rules);
      this.resetAddRules();
    },
    onClearRules(){
      this.itemAddRules = [];
      this.resetAddRules();
    },
    onEditableChange(editable) {
      this.editable = editable;
    },
    onDisabledChange(disabled){
      this.disabled= disabled;
    },
    onHavPaddingRight(IsPC){
      this.havPaddingRight= !IsPC;
    },
    clearErrorMessage() {
      this.validateState = '';
      this.validateMessage = '';
    }
  },
  mounted() {
    try{
      this.formTipsContent = this.tipsContent || '';
      this.$el.baseWidth = this.$el.style.width;
      this.$el.basePaddingLeft = this.$el.style.paddingLeft;
      this.dispatch("ElForm", "el.form.addAllField", [this]);
      if (this.prop) {
        this.dispatch("ElForm", "el.form.addField", [this]);

        let initialValue = this.fieldValue;
        if (Array.isArray(initialValue)) {
          initialValue = [].concat(initialValue);
        }
        Object.defineProperty(this, "initialValue", {
          value: initialValue
        });
        let baseRules = this.getBaseRules();
        if (baseRules.length) {
          baseRules.every(rule => {
            if (rule.required) {
              this.isRequired = true;
              return false;
            }
          });
        }

        if (!this.isRequired && this.required) {
          // 设置了必输标记但是没有对应的规则
          this.addRules.push({
            required: true,
            message: "请输入" + this.label,
            trigger: "change"
          });
          this.addRules.push({
            required: true,
            message: "请输入" + this.label,
            trigger: "blur"
          });
        }
        let rules = this.getRules();

        if (rules.length) {
          this.$on("el.form.blur", this.onFieldBlur);
          this.$on("el.form.change", this.onFieldChange);
        }
        this.$on("validateErr", this.onValidateErr);
      }
    }catch(e){
      console.log('form item mounted try catch');
    }
  },
  created(){
    this.$on("editableChange", this.onEditableChange);
    this.$on("disabledChange", this.onDisabledChange);
    this.$on("havPaddingRight", this.onHavPaddingRight);
    this.$on('validateType', this.onvalidateType);
    this.$on("addRules", this.onAddRules);
    this.$on("clearRules", this.onClearRules);
  },
  beforeDestroy() {
    this.dispatch("ElForm", "el.form.removeField", [this]);
    this.dispatch("ElForm", "el.form.removeAllField", [this]);
  }
};
</script>
