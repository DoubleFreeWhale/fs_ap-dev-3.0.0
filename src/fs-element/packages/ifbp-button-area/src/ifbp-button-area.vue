<template>
    <div :class="['operator-container', 'clearfix', noBreadcrumb===true?'no-breadcrumb':'']">
        <slot></slot>
    </div>
</template>
<script>
  export default {
    name:'IfbpButtonArea',
    data: function(){
      return {}
    },
    props: {
      noBreadcrumb: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
