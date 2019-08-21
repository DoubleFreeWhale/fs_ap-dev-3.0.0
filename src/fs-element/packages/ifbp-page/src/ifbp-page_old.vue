<template>
  <div class="main-panel" :class="{'no-padding':noPadding}">
    <div v-show="show" class="main-panel-blank">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name:'IfbpPage',
    props:{
      show:{
        type: Boolean,
        default: true
      },
      noPadding:{
        type:Boolean,
        default:false,
      }
    },
    data: function(){

      return {}
    }
  }
</script>
