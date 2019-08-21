<template lang="html">
<div :class="['ifbp-ref-tips','ifbp-ref-tips-' + index]">
  <el-popover
    :ref="popoverRef"
    :indexx="index"
    v-model="ifbpRefTipsVisible"
    :popper-class="['ifbp-popover',ifbpPopoverClose ?'ifbp-popover-no-close':'ifbp-popover-close']"
    :placement="ifbpPopoverContent.placement || placement"
    :title="ifbpPopoverContent.title || title"
    :ifbp-popover-close="ifbpPopoverClose"
    :trigger="ifbpPopoverContent.trigger || trigger"
    :content="ifbpPopoverContent.content||content">
    <div class="ifbp-ref-tips-content">
    <slot></slot>
    </div>
    <div class="ref-tips-oper">
      <slot name="button"></slot>
      <el-button @click="refTipsPreClick" v-if="!firstFlag">上一步</el-button>
      <el-button @click="refTipsNextClick" v-if="!lastFlag">下一步</el-button>
      <el-button @click="ifbpRefTipsVisible = false">关闭</el-button>
    </div>
  </el-popover>
  <span class="" v-popover="popoverRef">
    <slot name="reference"></slot>
  </span>
</div>
</template>

<script>
export default {
  name: 'IfbpRefTips',
  data() {
    var vm = this;
    return {
      ifbpPopoverContent:{},
      popoverRef:'popoverRef',
      num:0,
      ifbpRefTipsVisible: false

    };
  },

  props:{
    firstFlag: {
      type: Boolean,
      default: false
    },
    lastFlag : {
      type: Boolean,
      default: false
    },
    // popoverIndex: 0,
    index: {
      type:Number,
      default:0
    },
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
    show() {
      setTimeout(()=>{
        let $refs = $('.ifbp-ref-tips-' + this.index)[0].__vue__.$refs;
        $refs['popover' + this.index].doShow();
      });
    },
    refTipsPreClick() {
      let  newIndex = this.index - 1;
      let $refs = $('.ifbp-ref-tips-' + newIndex)[0].__vue__.$refs;
      this.ifbpRefTipsVisible = false;
      $refs['popover' + newIndex].doShow();
    },
    refTipsNextClick(e) {
      let  newIndex = this.index + 1;
      let $refs = $('.ifbp-ref-tips-' + newIndex)[0].__vue__.$refs;
      this.ifbpRefTipsVisible = false;
      $refs['popover' + newIndex].doShow();
    },
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
    // debugger;
    if(this.ifbpTipsContent) {
      this.ifbpPopoverContent = this.ifbpTipsContent;
    }


  },
  created() {
    this.popoverRef = 'popover'+this.index;
  }
}
</script>

