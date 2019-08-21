<template lang="html">
  <div  class="el-steps ifbp-steps"
  :class="['is-' + direction]">
  <div class="ifbp-step-left" v-if="showOverStepLeft">
    <i class="ifbp-icon-angle-left" @click="ifbpStepPreMove"></i>
  </div>
  <div class="ifbp-step-right" v-if="showOverStepRight">
    <i class="ifbp-icon-angle-right" @click="ifbpStepNextMove"></i>
  </div>
  <div class="ifbp-step-item">
    <div v-for="item in ifbpStepsData"
      class="el-step ifbp-step" @click = "stepClick"
      :class="['is-' + direction]">
      <div
        class="el-step__head ifbp-step-head-extend"
        :class="['is-' + item.currentStatus, 'is-text' ,'is-ifbp-extend']">
        <span class="el-step__icon ifbp-step-icon">
          <!-- <slot name="icon"> -->
            <i  :class="[ item.icon, 'is-' + item.currentStatus]"></i>
          <!-- </slot> -->
        </span>
      </div>
      <div
        class="ifbp-step__main">
        <span
          class="el-step__title ifbp-extand-span"
          ref="title"
          :class="['is-' + item.currentStatus]">
          {{item.title}}
          <!-- <slot name="title">{{ title }}</slot> -->
        </span>
        <span class="ifbp-extand-span-i">
          <i class="ifbp-step-arrow ifbp-icon-angle-right" v-if="direction === 'horizontal'"
          :class="[ { 'is-icon': item.icon },'is-' + item.currentStatus]" >
          </i>
        </span>
      </div>
    </div>
  </div>

  </div>
</template>

<script>
export default {
  name:"IfbpStepsExtend",
  data(){
    return {
      steps: [],
      stepOffset: 0,
      index: 0,
      style: {},
      lineStyle: {},
      mainOffset: 0,
      isLast: false,
      internalStatus: '',
      showOverStepRight: false,
      showOverStepLeft:false,
      stepItemWidth:0,
      allStepWidth:0,
    };
  },
  props: {
    isGreyClick: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Number,
      default: 1,
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    alignCenter: Boolean,
    finishStatus: {
      type: String,
      default: 'extend'
    },
    ifbpStepsData:Array,
    stepClickIndex: {
      type: Number,
      default: 1
    },
    blockActiveChangeWhenClick: Boolean,
  },
  watch: {
    active(newVal, oldVal) {
      this.$emit('change', newVal, oldVal);
    },
    stepClickIndex(val) {
      let indexLength = $(this.$el).find('.ifbp-step');
      setTimeout(() => {
        for (let i = 0; i < indexLength.length; i++) {
          $(indexLength[i]).find('.ifbp-step-head-extend').removeClass("ifbpExtendActive");
        }
        if($($(this.$el).find('.ifbp-step')[val-1]).find('.ifbp-step-head-extend.is-extend').length ===1 || this.isGreyClick) {
          $($(this.$el).find('.ifbp-step')[val-1]).find('.ifbp-step-head-extend').addClass('ifbpExtendActive');
        } else {
          $($(this.$el).find('.ifbp-step')[0]).find('.ifbp-step-head-extend').addClass('ifbpExtendActive');
        }
      })
    }
  },
  methods: {
    updateStatus(val) {
      // debugger;
      // const prevChild = this.$parent.$children[this.index - 1];
      this.ifbpStepsData.forEach((child, index) => {
        if (val > index) {
          child.currentStatus = this.finishStatus;
        } else {
          child.currentStatus = 'wait';
        }
        // console.log(child, index, child.currentStatus);
      });
      this.$forceUpdate();
      // if (prevChild) prevChild.calcProgress(this.internalStatus);
    },
    tabIndex(target,nodeList){
      for(let i=0;i<nodeList.length;i++){
        if(target===nodeList[i]){
          return i;
        }
      }
    },
    stepClick() {
      var target = event.currentTarget;
      var children = target.parentNode.children;
      if (this.isGreyClick || $(event.currentTarget.children[0]).find('.is-extend').length === 1) {
        this.index = this.tabIndex(target,children);
        this.$emit("step-click", this.ifbpStepsData.length, this.index+1);
      }
      if (this.blockActiveChangeWhenClick) {
        return;
      }
      if(this.isGreyClick) {
        for (let i = 0; i < children.length; i++) {
          $(children[i].children).removeClass("ifbpExtendActive");
        }
        $(target.children[0]).addClass("ifbpExtendActive");
        // this.index = this.tabIndex(target,children);
        // this.$emit("step-click", this.ifbpStepsData.length, this.index+1);
      } else {
        if($(event.currentTarget.children[0]).find('.is-extend').length === 1) {
          for (let i = 0; i < children.length; i++) {
            $(children[i].children).removeClass("ifbpExtendActive");
          }
          $(target.children[0]).addClass("ifbpExtendActive");
          // this.index = this.tabIndex(target,children);
          // this.$emit("step-click", this.ifbpStepsData.length, this.index+1);
        }

      }

      // var children1 = $(event.currentTarget.parentNode.children).find('.el-step__head');
      // for (let i = 0; i < children.length; i++) {
      //   $(children[i].children).removeClass("ifbpExtendActive");
      // }
    },
    ifbpStepNextMove() {
      // debugger;
      var stepItemDom = $(this.$el).find('.ifbp-step-item')[0];
      var pWidth = this.allStepWidth-stepItemDom.scrollLeft -this.stepItemWidth;
      if(pWidth >= this.stepItemWidth) {
        stepItemDom.scrollLeft = stepItemDom.scrollLeft + this.stepItemWidth;
      }
      if(pWidth === this.stepItemWidth) {
        this.showOverStepRight = false;
      }
      if(pWidth>0 && pWidth< this.stepItemWidth) {
        stepItemDom.scrollLeft = stepItemDom.scrollLeft + pWidth;
        this.showOverStepRight = false;
      }
      // if(pWidth>0) {
      //   this.showOverStepRight = true;
      // }
      if(stepItemDom.scrollLeft >0 ){
        this.showOverStepLeft = true;
        // return;
      }
      // console.log(this.k,stepItemDom.scrollLeft);
  },
  ifbpStepPreMove() {
    var stepItemDom = $(this.$el).find('.ifbp-step-item')[0];
    var pWidth = this.allStepWidth-stepItemDom.scrollLeft -this.stepItemWidth;
    // if(pWidth>0) {
    //   this.showOverStepRight = true;
    // }
    // console.log(stepItemDom.scrollLeft);
    if(stepItemDom.scrollLeft >= this.stepItemWidth){
      stepItemDom.scrollLeft = stepItemDom.scrollLeft- this.stepItemWidth;
      this.showOverStepRight = true;
    }else if(stepItemDom.scrollLeft< this.stepItemWidth) {
      stepItemDom.scrollLeft = 0;
      this.showOverStepLeft = false;
      this.showOverStepRight = true;
    }
    if(stepItemDom.scrollLeft >0 ){
      this.showOverStepLeft = true;
      // return;
    }
    // console.log(this.k,stepItemDom.scrollLeft);
  }
},
  mounted() {
    // const unwatch = this.$watch('index', val => {
      this.$watch('active', this.updateStatus, { immediate: true });
      // unwatch();
    // });
    var stepDom = this.$el;
    var stepItemDom = $(this.$el).find('.ifbp-step-item')[0];
    this.stepItemWidth = $(this.$el).find('.ifbp-step-item')[0].offsetWidth;
    var allSteps = $(this.$el).find('.ifbp-step');
     this.allStepWidth = 0;
    for (var i = 0; i < allSteps.length; i++) {
      // console.log(allSteps[i].offsetWidth);
      // console.log($(allSteps[i]).find('.ifbp-step__main').get(0).offsetWidth);
      this.allStepWidth = this.allStepWidth +allSteps[i].offsetWidth;
    }
    // this.n = parseInt(this.allStepWidth/this.stepItemWidth);
    // console.log(this.stepItemWidth,this.allStepWidth);
    if(this.stepItemWidth < this.allStepWidth) {
      if(stepItemDom.scrollLeft > 0) {
        this.showOverStepLeft = true;
      }
      this.showOverStepRight = true;
    }
    let indexLength = $(this.$el).find('.ifbp-step');
    setTimeout(() => {
      for (let i = 0; i < indexLength.length; i++) {
        $(indexLength[i]).find('.ifbp-step-head-extend').removeClass("ifbpExtendActive");
      }
      if($($(this.$el).find('.ifbp-step')[this.stepClickIndex-1]).find('.ifbp-step-head-extend.is-extend').length ===1 || this.isGreyClick) {
        $($(this.$el).find('.ifbp-step')[this.stepClickIndex-1]).find('.ifbp-step-head-extend').addClass('ifbpExtendActive');
      } else {
        $($(this.$el).find('.ifbp-step')[0]).find('.ifbp-step-head-extend').addClass('ifbpExtendActive');
      }
    })


  }

}
</script>

<style lang="css">

 /* .ifbp-step:last-of-type .ifbp-extand-span-i {
    display: none;
  } */
</style>
