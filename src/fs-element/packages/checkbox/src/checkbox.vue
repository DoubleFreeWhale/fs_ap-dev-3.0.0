<template>
  <label class="el-checkbox" :class="{'mt-el-checkbox':!tableCheckboxStyle && !IsPC,'checkbox-is-checked': isChecked && !IsPC,'checkbox-is-disabled': (disabled || !isEditable) && !IsPC}">
    <template>
      <span class="el-checkbox__input"
        :class="{
          'is-disabled': disabled || !isEditable,
          'is-checked': isChecked,
          'is-indeterminate': indeterminate,
          'is-focus': focus,
          'show-span': !tableCheckboxStyle && !IsPC
        }"  
      >
        <span class="el-checkbox__inner"></span>
        <input
          v-if="trueLabel || falseLabel"
          class="el-checkbox__original"
          type="checkbox"
          :name="name"
          :disabled="disabled || !isEditable"
          :true-value="trueLabel"
          :false-value="falseLabel"
          v-model="model"
          @change="handleChange"
          @focus="focus = true"
          @blur="focus = false">
        <input
          v-else
          class="el-checkbox__original"
          type="checkbox"
          :disabled="disabled || !isEditable"
          :value="label"
          :name="name"
          v-model="model"
          @change="handleChange"
          @focus="focus = true"
          @blur="focus = false">
      </span>
      <span class="el-checkbox__label" v-if="$slots.default || label">
        <slot></slot>
        <template v-if="!$slots.default">{{label}}</template>
      </span>
    </template>
  </label>
</template>
<script>
  import Emitter from 'ifbp-element/src/mixins/emitter';
  import { IsPC } from 'ifbp-element/src/utils/util';
  export default {
    name: 'ElCheckbox',

    mixins: [Emitter],

    componentName: 'ElCheckbox',

    data() {
      return {
        selfModel: false,
        focus: false,
        diffLabel: null,
        TimeOut:null,
        IsPC :IsPC(),
      };
    },

    computed: {
      model: {
        get() {
          return this.isGroup
            ? this.store : this.value !== undefined
            ? this.value : this.selfModel;
        },

        set(val) {
          if (this.isGroup) {
            let isLimitExceeded = false;
            (this._checkboxGroup.min !== undefined &&
              val.length < this._checkboxGroup.min &&
              (isLimitExceeded = true));

            (this._checkboxGroup.max !== undefined &&
              val.length > this._checkboxGroup.max &&
              (isLimitExceeded = true));

            isLimitExceeded === false &&
            this.dispatch('ElCheckboxGroup', 'input', [val]);

          } else if (this.value !== undefined) {
            this.$emit('input', val);
          } else {
            this.selfModel = val;
          }
        }
      },

      isChecked() {
        if ({}.toString.call(this.model) === '[object Boolean]') {
          return this.model;
        } else if (Array.isArray(this.model)) {
          return this.model.indexOf(this.label) > -1;
        } else if (this.model !== null && this.model !== undefined) {
          if(this.model === 'true'){
            return true;
          }
          return this.model === this.trueLabel;
        }
      },

      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'ElCheckboxGroup') {
            parent = parent.$parent;
          } else {
            this._checkboxGroup = parent;
            return true;
          }
        }
        return false;
      },

      store() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      }, 
      isEditable(){
      	 return this.isGroup
          ? this._checkboxGroup.editable
          : this.editable;
      }
    },

    props: {
      tableCheckboxStyle: {
        type: Boolean,
        default: false
      },
      value: {},
      label: {},
      showlabel:{},
      indeterminate: Boolean,
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: {
        type: [String, Number]
      },
      falseLabel: [String, Number],
      editable: {
        type: Boolean,
        default: true
      },
      diff: {}
    },

    methods: {
      addToStore() {
        if (
          Array.isArray(this.model) &&
          this.model.indexOf(this.label) === -1
        ) {
          this.model.push(this.label);
        } else {
          this.model = this.trueLabel || true;
        }
      },
      handleChange(ev) {
        this.$emit('change', ev);
        if (this.isGroup) {
          this.$nextTick(_ => {
            this.dispatch('ElCheckboxGroup', 'change', [this._checkboxGroup.value]);
          });
        }
      }
      
    },

    watch:{
      isEditable(editable){
        this.dispatch('ElFormItem', 'editableChange', [editable]);
      },      
      model: {
        immediate: true,
        handler(value) {
          if(this.TimeOut){
            clearTimeout(this.TimeOut);
          }
          this.TimeOut = setTimeout(()=>{
            this.$emit('valuechange',value);
            this.TimeOut = null;
            clearTimeout(this.TimeOut);
          },200);         
        }
	    }      
    },
    created() {
      this.checked && this.addToStore();
      if (this.diff && this.diff.oldValue !== undefined && this.diff.newValue !== undefined) {
        this.diffLabel = {
          oldValue: this.diff.oldValue ? '是' : '否',
          newValue: this.diff.newValue ? '是' : '否'
        }
      }
    },
    mounted: function(){
      this.dispatch('ElFormItem', 'editableChange', [this.isEditable]);
    }
  };
</script>
