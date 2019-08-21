<template>
  <div :class="['el-textarea',
    size ? 'el-input--' + size : '',
    {
      'is-disabled': disabled,
      'el-input-group': $slots.prepend || $slots.append,
      'el-input-group--append': $slots.append,
      'el-input-group--prepend': $slots.prepend
    }
  ]">
    <ifbp-tooltip :content="currentValue" :diff="diff" v-if="editable === false"></ifbp-tooltip>
    <template v-else>
      <textarea
        class="el-textarea__inner"
        :value="currentValue"
        @input="handleInput"
        ref="textarea"
        v-bind="$props"
        :style="textareaStyle"
        @focus="handleFocus"
        @blur="handleBlur">
      </textarea>
    </template>
  </div>
</template>
<script>
  import emitter from 'ifbp-element/src/mixins/emitter';
  import calcTextareaHeight from '../../input/src/calcTextareaHeight';
  import merge from 'ifbp-element/src/utils/merge';

  export default {
    name: 'ElTextarea',

    componentName: 'ElTextarea',

    mixins: [emitter],

    data() {
      return {
        currentValue: this.value,
        textareaCalcStyle: {},
        innerValue: 0,
        trueValue: this.value,
        errorClass: false,
        TimeOut:null
      };
    },

    props: {
      value: [String, Number],
      placeholder: String,
      size: String,
      resize: String,
      readonly: Boolean,
      autofocus: Boolean,
      editable: {
        type: Boolean,
        default: true
      },
      icon: String,
      disabled: Boolean,
      name: String,
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      rows: {
        type: [Number, String],
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
      diff: {}
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
      value: {
        immediate: true,
        handler(value) {
            this.setCurrentValue(value);
          if(this.TimeOut){
            clearTimeout(this.TimeOut);
          }
          this.TimeOut = setTimeout(()=>{
            this.valueChange(value);
            this.TimeOut = null;
            clearTimeout(this.TimeOut);
          },200);   
        }
      }
    },

    methods: {
    	valueChange(val){
    		this.$emit("valuechange",val);
    	},
      handleBlur(event) {
        // this.$emit('blur', event);
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
          const int = stringified.slice(0, -1 - this.decimals);
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
        this.$emit('blur', $event);
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
      this.resizeTextarea();
    }
  };
</script>

<style scoped>
  .errorFormat {border: 1px solid #E60012;}
</style>
