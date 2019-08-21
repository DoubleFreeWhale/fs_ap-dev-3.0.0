<template>
  <div :class="[
    'el-number',
    type === 'textarea' ? 'el-textarea' : 'el-input',
    size ? 'el-input--' + size : '',
    {
      'is-disabled': disabled,
      'el-input-group': $slots.prepend || $slots.append,
      'el-input-group--append': $slots.append,
      'el-input-group--prepend': $slots.prepend,
      'mt-el-input': !IsPC
    }
  ]">
    <ifbp-tooltip :content="currentValue" :diff="diff" v-if="editable === false"></ifbp-tooltip>
    <template v-else>
      <!-- 前置元素 -->
      <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <!-- input 图标 -->
      <slot name="icon">
        <i class="el-input__icon"
          :class="[
            'el-icon-' + icon,
            'ifbp-icon-' + icon,
            onIconClick ? 'is-clickable' : ''
          ]"
          v-if="icon"
          @click="handleIconClick">
        </i>
      </slot>
      <input
              class="el-input__inner ime-inactive"
              v-bind="$props"
              :autocomplete="autoComplete"
              :value="currentValue"
              ref="input"
              @input="debounceHandleInput"
              @focus="handleFocus"
              @blur="handleBlur">
      <i class="el-input__icon el-icon-loading" v-if="validating"></i>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
  </div>
</template>
<script>
import elInput from "../../input/src/input.vue";
import debounce from "throttle-debounce/debounce";
import numberUtil from "ifbp-element/src/utils/math";
import { IsPC } from 'ifbp-element/src/utils/util';
export default {
  name: "ElNumber",

  componentName: "ElNumber",

  mixins: [elInput],
  data(){
    return {
      IsPC: IsPC()
    }
  },
  props: {
    maxValue: Number,
    minValue: Number,
    decimals: {
      //小数保留位数
    },
    separator: {
      //千分符
      type: String
    },
    //负数显示的格式
    negativeFormat: {
      validator: function(value) {
        return (
          typeof value == "string" &&
          (value == "-123456" ||
            value == "- 123456" ||
            value == "123456-" ||
            value == "123456 -" ||
            value == "(123456)")
        );
      }
    } /* 可选值有 '-123456','- 123456','123456-','123456 -','(123456)' */
  },
  watch:{
    decimals(){
      this.value2CurrentValue(this.value);
    },
    separator(){
      this.value2CurrentValue(this.value);
    },
    negativeFormat(){
      this.value2CurrentValue(this.value);
    },
    maxValue(){
      this.resetRules();
    },
    minValue(){
      this.resetRules();
    }
  },

  computed: {
    appContext() {
      return this.$context && this.$context.getMaskerMeta("float");
    },
    realDecimals() {
      if (!this.decimals && this.appContext && this.appContext["precision"]) {
        return parseInt(this.appContext["precision"]);
      }
      return parseInt(this.decimals);
    },
    realSeparator() {
      if (
        !this.separator &&
        this.appContext &&
        this.appContext["isThousandth"]
      ) {
        return this.appContext["thousandthChar"];
      }
      return this.separator;
    },
    realNegativeFormat() {
      if (
        !this.negativeFormat &&
        this.appContext &&
        this.appContext["negative"]
      ) {
        return this.appContext["negative"];
      }
      return this.negativeFormat;
    }
  },

  methods: {
    value2CurrentValue(value) {
      value = numberUtil.setformat(
        value,
        this.realDecimals,
        this.realSeparator,
        this.realNegativeFormat
      );
      var realValue = value;
      if (this.realSeparator) {
        var reg = new RegExp(this.realSeparator, "g");
        realValue = value.replace(reg, "");
      }
      if(realValue)
        realValue = parseFloat(realValue);
      this.$emit("input", realValue);
      this.setCurrentValue(value);
    },

    handleFocus(event) {
      this.currentValue = this.value;
      if(parseFloat(this.value) === 0){
        this.$nextTick(() => {
          this.inputSelect()
        })
      }
      this.$emit("focus", event);
    },

    handleBlur(event) {
      var formatValue =
        numberUtil.setformat(
          event.target.value,
          this.realDecimals,
          this.realSeparator,
          this.realNegativeFormat
        ) + "";
      var reg = new RegExp(this.realSeparator, "g");
      var realValue = formatValue.replace(reg, "");
      if(realValue)
        realValue = parseFloat(realValue);
      if (realValue === this.value) {
        this.value2CurrentValue(realValue);
      } else {
        this.$emit("input", realValue);
      }
      this.$emit("blur", event, realValue);
      let numberInputFormat = window.appDefaultConfig.numberInputFormat;
      if(typeof numberInputFormat === 'undefined'){
        numberInputFormat = true
      }
      if(!numberInputFormat){
        this.$emit("change", realValue);
      }
      if (this.validateEvent) {
        // let errMessage = "";
        // if (this.maxValue && parseFloat(realValue) > this.maxValue) {
        //   errMessage = "输入值不能大于" + this.maxValue;
        //   this.dispatch("ElFormItem", "validateErr", [errMessage]);
        //   return;
        // }
        // if (this.minValue && parseFloat(realValue) < this.minValue) {
        //   errMessage = "输入值不能小于" + this.minValue;
        //   this.dispatch("ElFormItem", "validateErr", [errMessage]);
        //   return;
        // }
        this.dispatch("ElFormItem", "el.form.blur", [this.currentValue]);
      }
    },

    handleInput(event) {
      let numberInputFormat = window.appDefaultConfig.numberInputFormat;
      if(typeof numberInputFormat === 'undefined'){
        numberInputFormat = true
      }
      if(numberInputFormat){
        const value = event.target.value;
        const oldValue = this.value;
        var newVal;
        if (value === "-") {
          return;
        }
        if (!value) {
          newVal = "";
        } else {
          newVal = parseFloat(value);
          if (isNaN(newVal)) {
            newVal = this.currentValue;
          }
        }
        if (
          value &&
          value.indexOf &&
          this.realDecimals !== 0 &&
          this.realDecimals !== "0"
        ) {
          if (value.indexOf(".") !== value.lastIndexOf(".")) {
            newVal = value.substr(0, value.length - 1);
          } else if (
            value.indexOf(".") === value.lastIndexOf(".") &&
            value.indexOf(".") === value.length - 1
          ) {
            return;
          } else if (
            value.lastIndexOf("0") === value.length - 1 &&
            value.indexOf(".") > -1
          ) {
            return;
          }
        }
        this.setCurrentValue(newVal);
        this.$emit("change", newVal, parseFloat(oldValue));
      }
    },

    setCurrentValue(value) {
      this.currentValue = value + 1;
      this.currentValue = value;
      // 数字控件比较特殊，不支持change监听，只有blur的时候再校验
      // if (this.validateEvent) {
      //   this.dispatch("ElFormItem", "el.form.change", [value]);
      // }
    },
    maxValueRules(){
      if (this.validateEvent && typeof this.maxValue != 'undefined') {
        let checkMaxValue = (rule, value, callback) => {
          if (parseFloat(value) > this.maxValue) {
            callback(new Error("输入值不能大于" + this.maxValue));
          } else {
            callback();
          }
        };
        let rule = {
          trigger: "blur",
          validator: checkMaxValue
        };
        let rule1 = {
          trigger: "change",
          validator: checkMaxValue
        }
        this.dispatch("ElFormItem", "addRules", rule);
        this.dispatch("ElFormItem", "addRules", rule1);
      }
    },
    minValueRules(){
      if (this.validateEvent && typeof this.minValue != 'undefined') {
        let checkMinValue = (rule, value, callback) => {
          if (parseFloat(value) < this.minValue) {
            callback(new Error("输入值不能小于" + this.minValue));
          } else {
            callback();
          }
        };
        let rule = {
          trigger: "blur",
          validator: checkMinValue
        };
        let rule1 = {
          trigger: "change",
          validator: checkMinValue
        }
        this.dispatch("ElFormItem", "addRules", rule);
        this.dispatch("ElFormItem", "addRules", rule1);
      }
    },
    clearRules(){
      this.dispatch("ElFormItem", "clearRules");
    },
    resetRules(){
      this.clearRules();
      this.maxValueRules();
      this.minValueRules();
    }
  },

  created() {
    this.debounceHandleInput = debounce(this.debounce, value => {
      this.handleInput(value);
    });
    this.maxValueRules();
    this.minValueRules();
  }
};
</script>

<style scoped>
.errorFormat {
  border: 1px solid #e60012;
}
</style>
