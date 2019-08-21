<template>
  <label class="el-radio" @click="clickRadio(label)">
    <ifbp-tooltip :content="showlabel"  v-if="isEditable === false  && model === label"></ifbp-tooltip> 	
    <span v-if="isEditable === true"
    	class="el-radio__input"
      :class="{
        'is-disabled': isDisabled || !isEditable,
        'is-checked': model === label,
        'is-focus': focus
      }"
    >
      <span class="el-radio__inner"></span>
      <input
        class="el-radio__original"
        :value="label"
        type="radio"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        :name="name"
        :disabled="isDisabled || !isEditable">
    </span>
    <span v-if="isEditable === true" class="el-radio__label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from 'ifbp-element/src/mixins/emitter';

  export default {
    name: 'ElRadio',

    mixins: [Emitter],

    componentName: 'ElRadio',

    props: {
      value: {},
      label: {},
      disabled: Boolean,
      editable:{
      	type:Boolean,
      	default:true
      },
      name: String
    },

    data() {
      return {
        focus: false,
        TimeOut:null
      };
    },
		watch: {
      isEditable(editable){
        this.dispatch('ElFormItem', 'editableChange', [editable]);
    	},
    	value: {
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
    computed: {
      showlabel(){
        if(this.$slots.default){
          if(this.$slots.default.length > 0){
            return this.$slots.default[0].text
          }else{
            if(this.$slots.default.text){
              return this.$slots.default.text
            }
          }
        }
        return this.label
      },
      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'ElRadioGroup') {
            parent = parent.$parent;
          } else {
            this._radioGroup = parent;
            return true;
          }
        }
        return false;
      },

      model: {
        get() {
          return this.isGroup ? this._radioGroup.value : this.value;
        },
        set(val) {
          if (this.isGroup) {
            this.dispatch('ElRadioGroup', 'input', [val]);
          } else {                    
            this.$emit('input', val);
          }
        }
      },
      isDisabled() {
        return this.isGroup
          ? this._radioGroup.disabled || this.disabled
          : this.disabled;
      },
      isEditable(){
      	 return this.isGroup
          ? this._radioGroup.editable
          : this.editable;
      }
      
    },
    mounted() {
      this.dispatch('ElFormItem', 'editableChange', [this.isEditable]);
    },
    methods:{
    	clickRadio(val){
        // fix bug: disabled radio can be checked
        if (this.isDisabled) {
          return;
        }
        // fix bug: click triggered multiple times
        if (this.model === val) {
          return;
        }
    		this.model = val
    		if(this.isGroup){
	      	this.dispatch('ElRadioGroup', 'change', [val]);
    		}
    	}
    }
  };
</script>
