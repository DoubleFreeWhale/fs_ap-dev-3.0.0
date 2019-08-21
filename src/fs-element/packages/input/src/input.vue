<template>
  <div :class="[
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
      <textarea
        v-if="type === 'textarea'"
        class="el-textarea__inner"
        :value="currentValue"
        @input="handleInput"
        ref="textarea"
        v-bind="$props"
        :style="textareaStyle"
        @focus="handleFocus"
        @blur="handleBlur">
      </textarea>

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
              onIconClick &&  !disabled? 'is-clickable' : ''
            ]"
            v-if="icon"
            @click="handleIconClick">
          </i>
        </slot>
        <input
                v-if="type === 'text'"
                class="el-input__inner"
                v-bind="$props"
                :autocomplete="autoComplete"
                :value="currentValue"
                ref="input"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur">
        <input type="text"
              v-else-if="type === 'money'"
              class="el-input__inner"
              :value="innerValue"
              @input="handleInput"
              @focus="handleFilterFocus($event)"
              @blur="handleFilterBlur($event)">
        <template v-else>
        <input
                  class="el-input__inner"
                  v-bind="$props"
                  :autocomplete="autoComplete"
                  :value="currentValue"
                  ref="input"
                  @input="handleInput"
                  @focus="handleFocus"
                  @blur="handleBlur">
        </template>

        <i class="el-input__icon el-icon-loading" v-if="validating"></i>
        <!-- 后置元素 -->
        <div class="el-input-group__append" v-if="$slots.append">
          <slot name="append"></slot>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
  import emitter from 'ifbp-element/src/mixins/emitter';
  import calcTextareaHeight from './calcTextareaHeight';
  import merge from 'ifbp-element/src/utils/merge';
  import { IsPC } from 'ifbp-element/src/utils/util';
  export default {
    name: 'ElInput',

    componentName: 'ElInput',

    mixins: [emitter],

    data() {
      return {
        currentValue: this.value,
        textareaCalcStyle: {},
        innerValue: 0,
        trueValue: this.value,
        errorClass: false,
        TimeOut:null,
        IsPC: IsPC()
      };
    },

    props: {
      value: [String, Number],
      placeholder: String,
      size: String,
      resize: String,
      readonly: Boolean,
      autofocus: Boolean,
      icon: String,
      disabled: Boolean,
      editable: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: 'text'
      },
      name: String,
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      rows: {
        type: Number,
        default: 2
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      form: String,
      maxlength: Number,
      minlength: Number,
      max: {},
      min: {},
      step: {},
      validateEvent: {
        type: Boolean,
        default: true
      },
      onIconClick: Function,
      symbol: {
        type: String,
        default: '$'
      },
      decimals: {
        type: Number,
        default: 2
      },
      comma: {
        type: Boolean,
        default: false
      },
      diff: {},
      validateType:{
        type: String
      }
    },

    computed: {
      validating() {
        return this.$parent.validateState === 'validating';
      },
      textareaStyle() {
        return merge({}, this.textareaCalcStyle, { resize: this.resize });
      }
    },

    watch: {
      editable(editable){
        this.dispatch('ElFormItem', 'editableChange', [editable]);
      },
      disabled(disabled){
        this.dispatch('ElFormItem', 'disabledChange', [disabled]);
      },
      value: {
        immediate: true,
        handler(value) {
        
          if (this.type === 'money') {
            const newVal = +value;
            if (isNaN(newVal)) return;
            this.trueValue = newVal;
            this.setformat(this.trueValue);
            this.$emit('input', this.trueValue);
          } else {
            this.value2CurrentValue(value);
          }
          if(this.TimeOut){
            clearTimeout(this.TimeOut);
          }
          this.TimeOut = setTimeout(()=>{
            this.valueChange(value);
            this.TimeOut = null;
            clearTimeout(this.TimeOut);
          },200);         
        }
      },
      validateType(val){
        this.dispatch('ElFormItem', 'validateType', [val]);
      }
    },

    methods: {
    	valueChange(val){
    		this.$emit('valuechange',val)
    	},
      value2CurrentValue(value) {
        this.setCurrentValue(value);
      },
      handleBlur(event) {
        let value = this.currentValue;
        if(typeof value === "string") {
          value = value.trim();
        }
        this.$emit('blur', event, value);
        if(value !== this.currentValue){
          this.$emit('input', value);
          this.setCurrentValue(value);
          this.$emit('change', value);
        }
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.blur', [value]);
        }
      },
      inputSelect() {
        this.$refs.input.select();
      },
      resizeTextarea() {
        if (this.$isServer) return;
        var { autosize, type } = this;
        if (!autosize || type !== 'textarea') return;
        const minRows = autosize.minRows;
        const maxRows = autosize.maxRows;

        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
      },
      handleFocus(event) {
        this.$emit('focus', event);
      },
      handleInput(event) {
        const value = event.target.value;
        this.$emit('input', value);
        this.setCurrentValue(value);
        this.$emit('change', value);
      },
      handleIconClick(event) {
        if (this.onIconClick) {
          this.onIconClick(event);
        }
        this.$emit('click', event);
      },
      setCurrentValue(value) {
        // var value;
        // if( typeof value === "string") {
        //   value = value.trim();
        // }
        if (value === this.currentValue) return;
        this.$nextTick(_ => {
          this.resizeTextarea();
        });
        this.currentValue = value;
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.change', [value]);
        }
      },
      setformat(number) {
        if (this.comma) {
          const digitsRE = /(\d{3})(?=\d)/g;
          const stringified = number.toFixed(this.decimals);
          const int = this.decimals ? stringified.slice(0, -1 - this.decimals) : stringified;
          const i = int.length % 3;
          const head = i > 0
                  ? (int.slice(0, i) + (int.length > 3 ? ',' : ''))
                  : '';
          const float = this.decimals
                  ? stringified.slice(-1 - this.decimals)
                  : '';
          const sign = this.innerValue < 0 ? '-' : '';
          this.innerValue = sign + this.symbol + head +
                  int.slice(i).replace(digitsRE, '$1,') +
                  float;

        } else if (!this.comma) {
          this.innerValue = isNaN(number)
                  ? this.symbol + 0
                  : this.symbol + number.toFixed(this.decimals);
        }
      },
      handleFilterFocus(event) {
        this.innerValue = this.trueValue;
        this.$emit('focus', event);
      },
      handleFilterBlur($event) {
        this.trueValue = +$event.target.value.replace(/[^\d.]/g, '');
        this.setformat(this.trueValue);
        this.$emit('blur', $event, this.trueValue);
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.blur', [this.trueValue]);
        }
        this.$emit('input', this.trueValue);
      }
    },

    created() {
      if (this.type === 'money' && this.value) {
        this.setformat(this.value);
      } else {
        this.$on('inputSelect', this.inputSelect);
      }
    },

    mounted() {
      this.dispatch('ElFormItem', 'editableChange', [this.editable]);
      this.dispatch('ElFormItem', 'disabledChange', [this.disabled]);
      this.dispatch('ElFormItem', 'validateType', [this.validateType]);
      this.resizeTextarea();
    }
  };
</script>

<style scoped>
  .errorFormat {border: 1px solid #E60012;}
</style>
