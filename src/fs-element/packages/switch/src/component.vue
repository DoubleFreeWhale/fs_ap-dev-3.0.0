<template>
  <div>
    <ifbp-tooltip :content="checked?'是':'否'" :diff="diffLabel" v-if="editable === false"></ifbp-tooltip>
    <template v-else>
      <label class="el-switch" :class="{ 'is-disabled': disabled, 'el-switch--wide': hasText,'mt-switch': !IsPC }">
        <div class="el-switch__mask" v-show="disabled"></div>
        <input
          class="el-switch__input"
          type="checkbox"
          @change="handleChange"
          v-model="_value"
          :name="name"
          :true-value="onValue"
          :false-value="offValue"
          :disabled="disabled">
        <span class="el-switch__core" ref="core" :style="{ 'width': coreWidth + 'px' }">
          <span class="el-switch__button" :style="{ transform }"></span>
        </span>
        <transition name="label-fade">
          <div
            class="el-switch__label el-switch__label--left"
            v-show="checked"
            :style="{ 'width': coreWidth + 'px' }">
            <i :class="[onIconClass]" v-if="onIconClass"></i>
            <span v-if="!onIconClass && onText">{{ onText }}</span>
          </div>
        </transition>
        <transition name="label-fade">
          <div
            class="el-switch__label el-switch__label--right"
            v-show="!checked"
            :style="{ 'width': coreWidth + 'px' }">
            <i :class="[offIconClass]" v-if="offIconClass"></i>
            <span v-if="!offIconClass && offText">{{ offText }}</span>
          </div>
        </transition>
      </label>
    </template>
  </div>
</template>

<script>
import { IsPC } from 'ifbp-element/src/utils/util';
  export default {
    name: 'ElSwitch',
    props: {
      value: {
        type: [Boolean, String, Number],
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 0
      },
      onIconClass: {
        type: String,
        default: ''
      },
      offIconClass: {
        type: String,
        default: ''
      },
      onText: {
        type: String,
        default: 'ON'
      },
      offText: {
        type: String,
        default: 'OFF'
      },
      onColor: {
        type: String,
        default: ''
      },
      offColor: {
        type: String,
        default: ''
      },
      onValue: {
        type: [Boolean, String, Number],
        default: true
      },
      offValue: {
        type: [Boolean, String, Number],
        default: false
      },
      name: {
        type: String,
        default: ''
      },
      editable: {
        type: Boolean,
        default: true
      },
      diff: {}
    },
    data() {
      return {
        coreWidth: this.width,
        diffLabel: null,
        IsPC: IsPC()
      };
    },
    created() {
      if (!~[this.onValue, this.offValue].indexOf(this.value)) {
        this.$emit('input', this.onValue);
      }
      if (this.diff && this.diff.oldValue !== undefined && this.diff.newValue !== undefined) {
        this.diffLabel = {
          oldValue: this.diff.oldValue ? '是' : '否',
          newValue: this.diff.newValue ? '是' : '否'
        }
      }
    },
    computed: {
      checked() {
        
        return this.value === this.onValue;
      },
      hasText() {
        /* istanbul ignore next */
        return this.onText || this.offText;
      },
      _value: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      },
      transform() {
        return this.checked ? `translate(${ this.coreWidth - 20 }px, 2px)` : 'translate(2px, 2px)';
      }
    },
    watch: {
      value() {
        if (this.onColor || this.offColor) {
          this.setBackgroundColor();
        }
      },
      editable(){
        this.$nextTick(() => {
          if (this.onColor || this.offColor) {
            this.setBackgroundColor();
          }
        });
      }
    },
    methods: {
      handleChange(event) {
        
        this.$emit('change', event.currentTarget.checked ? this.onValue : this.offValue);
      },
      setBackgroundColor() {
        let newColor = this.checked ? this.onColor : this.offColor;
        if(this.$refs.core){
          this.$refs.core.style.borderColor = newColor;
          this.$refs.core.style.backgroundColor = newColor;
        }
      }
    },
    mounted() {
      /* istanbul ignore if */
      if(!this.IsPC){
        this.onText=''
        this.offText=''
      }
      if (this.width === 0) {
        this.coreWidth = this.hasText ? 58 : 46;
      }
      if (this.onColor || this.offColor) {
        this.setBackgroundColor();
      }
    }
  };
</script>
