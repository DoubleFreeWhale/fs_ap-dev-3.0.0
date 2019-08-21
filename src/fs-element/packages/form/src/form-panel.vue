<template>
  <div :class="{'el-form-panel1':!!title,'el-form-panel':!title}">
    <div class="el-form-panel-title" v-if="!!title && IsPC">
      {{title}}
    </div>
    <slot></slot>
  </div>
</template>
<script>
import { IsPC } from 'ifbp-element/src/utils/util';
export default {
  name: 'ElFormPanel',
  componentName: 'ElFormPanel',
  props: [ 'title' ],
  data () {
    return {
      IsPC: IsPC()
    }
  }

};
</script>
<style >

</style>
