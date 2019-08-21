<template>
  <div class="el-radio-group" :class="{'mt-radio-group':!IsPC}">
    <slot></slot>
  </div>
</template>
<script>
  import Emitter from 'ifbp-element/src/mixins/emitter';
  import { IsPC } from 'ifbp-element/src/utils/util';
  export default {
    name: 'ElRadioGroup',
    componentName: 'ElRadioGroup',
    mixins: [Emitter],
		 data(){
    	return {
    		TimeOut:null,
        IsPC: IsPC(),
    	}
    },
    props: {
      value: {},
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean,
      editable:{
      	type:Boolean,
      	default:true
      }
    },
    watch: {
      value(value) {
      /*  this.$emit('change', value);*/
        this.dispatch('ElFormItem', 'el.form.change', [this.value]);
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
  };
</script>

