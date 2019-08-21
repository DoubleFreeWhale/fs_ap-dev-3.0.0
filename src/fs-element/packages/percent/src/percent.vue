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
    <ifbp-tooltip :content="currentValue" :diff="percentFormatedDiffValue" v-if="editable === false"></ifbp-tooltip>
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
import elNumber from "../../number/src/number.vue";
import numberUtil from "ifbp-element/src/utils/math";
 import { IsPC } from 'ifbp-element/src/utils/util';

export default {
  name: "ElPercent",

  componentName: "ElPercent",
  props: {},
  mixins: [elNumber],
  data() {
    return {
      percentFormatedDiffValue: null,
      IsPC: IsPC()
    };
  },

  methods: {
    value2CurrentValue(value) {
      value = this.percentSetformat(value) + "";
      var realValue = value.replace("%", "");
      if (this.realSeparator) {
        var reg = new RegExp(this.realSeparator, "g");
        realValue = realValue.replace(reg, "");
      }
      if (realValue) {
        realValue = numberUtil.accDiv(realValue, 100);
      }
      this.$emit("input", realValue);

      if (
        this.diff &&
        this.diff.oldValue !== undefined &&
        this.diff.newValue !== undefined
      ) {
        this.percentFormatedDiffValue = {
          oldValue: this.percentSetformat(this.diff.oldValue),
          newValue: this.percentSetformat(this.diff.newValue)
        };
      }

      this.setCurrentValue(value);
    },
    percentSetformat(value) {
      var formatValue = numberUtil.setformat(
        numberUtil.accMul(value, 100),
        this.realDecimals,
        this.realSeparator,
        this.realNegativeFormat
      );
      if (formatValue) {
        return formatValue + "%";
      } else {
        return "";
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
        newVal = numberUtil.accDiv(newVal, 100);
        this.$emit("change", newVal, parseFloat(oldValue));
      }
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
      realValue = numberUtil.accDiv(realValue, 100);
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
        let errMessage = "";
        if (this.maxValue && parseFloat(this.value) > this.maxValue) {
          errMessage = "输入值不能大于" + this.maxValue;
          this.dispatch("ElFormItem", "validateErr", [errMessage]);
          return;
        }
        if (this.minValue && parseFloat(this.value) < this.minValue) {
          errMessage = "输入值不能小于" + this.minValue;
          this.dispatch("ElFormItem", "validateErr", [errMessage]);
          return;
        }
        this.dispatch("ElFormItem", "el.form.blur", [this.currentValue]);
      }
    },
    handleFocus(event) {
      this.currentValue = numberUtil.accMul(this.value, 100);
      if(parseFloat(this.value) === 0){
        this.$nextTick(() => {
          this.inputSelect()
        })
      }
      this.$emit("focus", event);
    }
  }
};
</script>

<style scoped>
.errorFormat {
  border: 1px solid #e60012;
}
</style>
