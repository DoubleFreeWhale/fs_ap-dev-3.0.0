<template>
  <div :class="type == 'list' ? 'list-main-container clearfix' : type == 'detail' ? 'detail-main-container clearfix' : '' + ' clearfix'"
       :style="type == 'detail'?{minHeight:mainheight}:{}"
  >
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name:'IfbpMainArea',
    props:{
      type:{
        type:String,
        default:'list'
      }
    },
    data: function(){
      return {}
    },
    computed:{
      mainheight(){
        console.log(this.$root.$children[0].mainRightHeight);
        return this.$root.$children[0].mainRightHeight?this.$root.$children[0].mainRightHeight-16+'px':''
      }
    }
  }
</script>