<script>
  import Emitter from 'ifbp-element/src/mixins/emitter';

  export default {
    name: 'ElCheckboxGroup',

    componentName: 'ElCheckboxGroup',

    mixins: [Emitter],
    data(){
    	return {
    		TimeOut:null
    	}
    },
    props: {
      value: {},
      min: Number,
      max: Number,
      size: String,
      fill: String,
      textColor: String,
      editable:{
        type:Boolean,
        default: true
      }
    },

    watch: {
      value(value) {
        this.dispatch('ElFormItem', 'el.form.change', [value]);
        
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

<template>
  <div class="el-checkbox-group">
    <slot></slot>
  </div>
</template>
