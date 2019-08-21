<template>
  <div class="main-panel" :class="{'no-padding':noPadding}">
    <div v-show="show" class="main-panel-blank">
      <!-- 图钉部分,处理页面中吸顶区域 -->
      <div class="affix-wrap" v-if="$slots['affix']">
        <!-- 占位Div，用于处理main-panel 的padding-top 透出内容问题 -->
        <div ref="affixTop" class="affix-top"></div>
        <!-- 真实展示区Div -->
        <div class="affix-real" :style="{'height':affixHeight+'px'}">
          <slot name="affix"></slot>
        </div>
        <!--占位Div，撑起容器，否则该区域无高度 -->
        <div class="affix-fake" :style="{'height':affixHeight+'px'}"></div>
      </div>
      <!-- 默认slot  -->
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { addResizeListener, removeResizeListener } from "ifbp-element/src/utils/resize-event";
export default {
  name: "IfbpPage",
  props: {
    show: {
      type: Boolean,
      default: true
    },
    noPadding: {
      type: Boolean,
      default: false
    },
    offsetTop: {
      type: Number,
      default: 0
    },
    affixBgColor: {
      type: Array,
      default: function() {
        return [240, 240, 245];
      }
    }
  },
  data: function() {
    return {
      affixHeight: 0
    };
  },
  mounted() {
    var vm = this;
    //如果增加图钉区域;
    var affixObj = this.$slots["affix"];
    if (affixObj) {
      var mainRight = $("#main-right");
      mainRight.on("scroll", vm.handleAffixScroll);

      var affixDom = affixObj[0].elm;
      vm.affixHeight = $(affixDom).outerHeight(true) + 8;
      addResizeListener(affixDom, function() {
        vm.affixHeight = $(affixDom).outerHeight(true) + 8;
      });
    }
  },
  destroyed() {
    var affixObj = this.$slots["affix"];
    if (affixObj) {
      //离开该页面需要移除这个监听的事件
      var mainRight = $("#main-right");
      mainRight.off("scroll", this.handleAffixScroll);

      var affixDom = affixObj[0].elm;
      removeResizeListener(affixDom);
    }
  },
  methods: {
    handleAffixScroll() {
      //改变元素#searchBar的top值
      var mainRight = $("#main-right");
      var scrollTop = mainRight.scrollTop();
      var affixHeight = this.affixHeight;

      var affixReal = $(this.$el).find(".affix-real");
      // 设置top保证位置不动；
      affixReal.css("top", scrollTop + this.offsetTop);
      // 在滚动区域上面插入一个空div 用于撑起盒子，遮住后面滚动区的内容；
      var affixTop = $(this.$refs.affixTop);
      affixTop.css("top", scrollTop + this.offsetTop - 8);

      //设置背景颜色;
      var bgColor = this.affixBgColor;
      // var opacity = parseInt(scrollTop / affixHeight * 100) / 100; 
      var opacity = 1;
      var retBgcolor ='rgba(' + bgColor[0] + ',' + bgColor[1] + ',' + bgColor[2] + ',' + opacity + ')';
      affixReal.css("background-color", retBgcolor);
    }
  }
};
</script>
<style>
</style>

