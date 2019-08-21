<template lang="html">
<div class="ifbp-tips">
  <el-popover
    :popper-class="['ifbp-popover',ifbpPopoverClose ?'ifbp-popover-no-close':'ifbp-popover-close']"
    :placement="ifbpPopoverContent.placement || placement"
    :title="ifbpPopoverContent.title || title"
    :ifbp-popover-close="ifbpPopoverClose"
    :trigger="ifbpPopoverContent.trigger || trigger"
    :content="ifbpPopoverContent.content||content">
    <slot></slot>
    <i :class="[tipsDefaultIcon, 'ifbp-popover-i']" slot="reference"></i>
  </el-popover>
</div>
</template>

<script>
export default {
  name: 'IfbpTips',
  data() {
    return {
      ifbpPopoverContent:{}
    };
  },
  props:{
    ifbpTipsContent:{
      type: Object
    },
    tipsDefaultIcon:{
      type:String,
      default:"ifbp-icon-help"
    },
    content:'',
    placement:{
      type: String,
      default: 'bottom'
    },
    title:'',
    trigger: {
      type: String,
      default: 'click'
    },
    ifbpPopoverClose: {
      type: Boolean,
      default: true
    }
  },
  methods: {
  },
  watch: {
    ifbpTipsContent: {
      deep:true,
      handler(val) {
        this.ifbpPopoverContent = val;
      }
    }
  },
  mounted() {
    if(this.ifbpTipsContent) {
      this.ifbpPopoverContent = this.ifbpTipsContent;
    }

  }
}
</script>


