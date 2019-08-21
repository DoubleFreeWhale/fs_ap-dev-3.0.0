<template>
  <div :class="['clearfix','ifbp-panel',!navbar?'ifbp-panel-no-nav-bar':'',!IsPC?'ifbp-panel-mobile':'']" :id="defId">
    <div :class="['ifbp-panel-title',mainTitle ? 'ifbp-main-panel-title' : '']">
      <div class="fl iconleft">
        <span  class="title-sub" @click="toggleShowFun(defId)" >
          <i class="ifbp-icon-angle-down" v-if="toggleShow && IsPC"></i>
         <!-- <i class="ifbp-icon-angle-right"  @click="toggleShowDown" v-if="!toggleFlag" ></i>-->
          {{title}}

        </span>
        <i v-for="(icon,index) in iconsOrg" :key="index" :title="icon.title || icon.displayName" v-show="typeof icon.show === 'undefined' || icon.show"
            :class="icon.ifbpIconShow===false?[icon.icon,'ifbp-panel-i']:['el-icon-' + icon.icon,'ifbp-icon-' + icon.icon,'ifbp-panel-i']  "
            @click="e => {iconClick(icon.click || icon.event,e)}">
          </i>
        <div class="ifbp-add" style="display: none;"></div>
        <slot name="left"></slot>
      </div>
      <div class="ifbp-panel-icons-right">
        <i v-for="(item,index) in rightIconsOrg"
           :key="index"
           :title="item.title || item.displayName"
           v-show="typeof item.show === 'undefined' || item.show"
           :class="item.ifbpIconShow===false? item.icon:['el-icon-' + item.icon,'ifbp-icon-' + item.icon]"
           @click="e => {rightIconClick(item.click || item.event,e)}"
        >
        </i>
        <slot name="right"></slot>
        <i class="ifbp-icon-angle-down" v-if="!IsPC && toggleShow" @click="toggleShowFun(defId)"></i>
      </div>

    </div>
    <transition name="fade" >
     <div class="ifbp-panel-body" v-show="showBodyFlag">
        <slot></slot>
    </div>
    </transition>
  </div>
</template>

<script>
import emitter from "ifbp-element/src/mixins/emitter";
import { IsPC } from 'ifbp-element/src/utils/util';
export default {
  name: "IfbpPanel",

  componentName: "IfbpPanel",

  mixins: [emitter],

  props: {
    code:{
      type: String,
    },
    title: {
      type: String
    },
    rightIcons: Array,
    icons: Array,
    id: String,
    showBody: {
      type: Boolean,
      default: true
    },
    toggleShow: {
      type: Boolean,
      default: true
    },
    mainTitle: {
      type: Boolean,
      default: false
    },
    navbar: {
      type: Boolean,
      default: true
    },
    ifbpIconShow:{
      type:Boolean,
      default:true
    }
  },

  data(){
    return {
      showBodyFlag: true,
      rightIconsOrg: [],
      iconsOrg: [],
      IsPC: IsPC()
    }
  },

  watch:{
    rightIcons(val) {
      this.rightIconsOrg = val;
      this.$forceUpdate();
    },
    icons(val) {
      this.iconsOrg = val;
      this.$forceUpdate();
    },
    showBody(val) {
      this.showBodyFlag = val;
      if (!this.showBodyFlag) {
        $("#" + this.defId).find(".ifbp-icon-angle-down").css("transform", "rotate(-90deg)");
      } else {
        $("#" + this.defId).find(".ifbp-icon-angle-down").css("transform", "rotate(0deg)");
      }
    },
    title(){
      if(this.navbar){
        this.dispatch("IfbpPanelGroup", "childChange");
      }
    }
  },

  methods:{

    toggleShowFun: function toggleShowFun() {
      if(this.toggleShow){
        this.showBodyFlag = !this.showBodyFlag;
        this.$emit('update:showBody', this.showBodyFlag);
        if (!this.showBodyFlag) {
          $("#" + this.defId).find(".ifbp-icon-angle-down").css("transform", "rotate(-90deg)");
        } else {
          $("#" + this.defId).find(".ifbp-icon-angle-down").css("transform", "rotate(0deg)");
        }
      }
    },
    rightIconClick(fun, e){
      if (typeof fun !== 'function') {
        return;
      }
      fun.call(this, e, this.code);
    },
    iconClick(fun, e) {
      if (typeof fun !== 'function') {
        return;
      }
      fun.call(this, e, this.code);

    }
  },

  mounted(){
    this.rightIconsOrg = this.rightIcons;
    this.iconsOrg = this.icons;
    this.showBodyFlag = this.showBody;
    if (!this.showBodyFlag) {
      $("#" + this.defId).find(".ifbp-icon-angle-down").css("transform", "rotate(-90deg)");
    } else {
      $("#" + this.defId).find(".ifbp-icon-angle-down").css("transform", "rotate(0deg)");
    }
    if(this.navbar){
      this.dispatch("IfbpPanelGroup", "childChange");
    }
  },

  destroyed(){
    if(this.navbar){
      this.dispatch("IfbpPanelGroup", "childChange");
    }
  },

  computed: {
    // hasBody() {
    //   return (
    //     this.$slots && this.$slots.default && this.$slots.default.length > 0
    //   );
    // }
    defId(){
      if(this.id){
        return this.id;
      }else{
        return "ctrIcon"+parseInt(Math.random()*1000);
      }
    }
  }
};
</script>

<style>

  .fade-enter-active, .fade-leave-active {
          transition: all .3s
        }
        .fade-enter, .fade-leave-active {
          opacity: 0
        }
</style>
