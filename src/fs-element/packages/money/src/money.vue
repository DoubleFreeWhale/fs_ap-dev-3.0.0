<template>
	<div :class="[
    'el-number',
    type === 'textarea' ? 'el-textarea' : 'el-input',
    size ? 'el-input--' + size : '',
    {
      'is-disabled': disabled,
      'el-input-group': $slots.prepend || $slots.append,
      'el-input-group--append': $slots.append,
      'el-input-group--prepend': $slots.prepend
    }
  ]">
		<ifbp-tooltip :content="currentValue" :diff="moneyFormatedDiffValue" v-if="editable === false"></ifbp-tooltip>
		<template v-else>
			<!-- 前置元素 -->
			<div class="el-input-group__prepend" v-if="$slots.prepend">
				<slot name="prepend"></slot>
			</div>
			<!-- input 图标 -->
			<slot name="icon">
				<i class="el-input__icon" :class="[
            'el-icon-' + icon,
            'ifbp-icon-' + icon,
            onIconClick ? 'is-clickable' : ''
          ]" v-if="icon" @click="handleIconClick">
        </i>
			</slot>
			<input class="el-input__inner ime-inactive" v-bind="$props" :autocomplete="autoComplete" :value="currentValue" ref="input" @input="debounceHandleInput" @focus="handleFocus" @blur="handleBlur">
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

export default {
  name: "ElMoney",

  componentName: "ElMoney",
  props: {
    symbol: {
      type: String,
      default: "￥"
    }
  },
  mixins: [elNumber],

  data() {
    return {
      moneyFormatedDiffValue: null
    };
  },
  computed: {
    realSymbol() {
      if (
        !this.symbol &&
        this.appContext &&
        this.appContext["currency"] &&
        this.appContext["currency"]["curSymbol"]
      ) {
        return this.appContext["currency"]["curSymbol"];
      }
      return this.symbol;
    }
  },

  methods: {
    value2CurrentValue(value) {
      //value转为货币格式
      let reg = new RegExp(this.realSeparator, "g");
      value = (value + "").replace(reg, "");
      value = this.moneySetformat(value) + "";
      var realValue = value.replace(this.realSymbol, "");
      realValue = realValue.replace(reg, "");
      if (
        this.diff &&
        this.diff.oldValue !== undefined &&
        this.diff.newValue !== undefined
      ) {
        this.moneyFormatedDiffValue = {
          oldValue: this.moneySetformat(this.diff.oldValue),
          newValue: this.moneySetformat(this.diff.newValue)
        };
      }
      if(realValue)
        realValue = parseFloat(realValue);      
      this.$emit("input", realValue);
      this.setCurrentValue(value);
    },
    moneySetformat(value) {
      var formatValue = numberUtil.setformat(
        value,
        this.realDecimals,
        this.realSeparator,
        this.realNegativeFormat
      );
      if (formatValue) {
        return this.realSymbol + formatValue;
      } else {
        return this.decimals ? this.realSymbol + Number(0).toFixed(Number(this.decimals)) : '';
      }
    }
  }
};
</script>

<style scoped>
.errorFormat {
  border: 1px solid #e60012;
}
</style>