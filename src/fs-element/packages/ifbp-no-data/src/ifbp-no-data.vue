<template>
  <div v-if="totalElements===0 && searchState!=='search' && showFlag" :class="computedClassList">
    <slot name="head"></slot>
    <div class="no-data-head" v-if="noDataHead"></div>
    <div class="no-data-bg">
      <i :class="[noDataIcon,'empty']"></i>
      <span v-if="!$slots.noData" class="no-data-text">{{noDataText}}</span>
      <slot name="noData"></slot>
    </div>
    <div style="display:none;" v-if="noDataHead">
      <slot></slot>
    </div>
  </div>

  
  <div v-else-if=" searchState==='search' &&  totalElements===0 && showFlag" :class="computedClassList">
    <slot name="searchhead"></slot>
    <div class="no-data-head" v-if="noDataHead"></div>
    <div class="no-data-bg">
      <i :class="[noSearchDataIcon,'nomatch']"></i>
      <span v-if="!$slots.noSearchData" class="no-data-text">{{noSearchDataText}}</span>
      <slot name="noSearchData"></slot>
    </div>
    <div style="display:none;" v-if="noDataHead">
      <slot></slot>
    </div>
  </div>
  <div v-else-if="showFlag">
    <template>
      <slot></slot>
    </template>
  </div>
  <div v-else>
  </div>
</template>

<script>
export default {
  name: "IfbpNoData",
  props:{
    totalElements:{
      type: Number,
      default: 1
    },
    showFlag:{
      type: Boolean,
      default: true
    },
    searchState:{
      type: String,
      default: ''
    },
    noDataIcon:{
      type: String,
      default: "ifbp-icon-page-empty"
    },
    noDataText:{
      type: String,
      default: '当前没有可用数据'
    },
    noSearchDataIcon:{
      type: String,
      default: "ifbp-icon-search"
    },
    noSearchDataText:{
      type: String,
      default: '找不到匹配项'
    },
    classList: {
      type: Array,
      default: function(){
        return []
      }
    },
    noDataHead:{
      default: ''
    }
  },
  computed:{
    computedClassList(){ 
      return ['no-data'].concat(this.classList)
    }
  },
  updated(){
    if(this.totalElements===0 && this.noDataHead){
      if($(this.$slots.default[0].elm).is(this.noDataHead)){
        $(this.$el).find('.no-data-head').append($(this.$slots.default[0].elm))
      }else{
        $(this.$el).find('.no-data-head').append($(this.$slots.default[0].elm).find(this.noDataHead))
      }
      let noDataHeadHeight = $(this.$el).find('.no-data-head')[0].offsetHeight;
      let marginTop = -1 * parseInt(noDataHeadHeight/2);
      $(this.$el).find('.no-data-bg').css('margin-top', marginTop + 'px');
    }
  }

}
</script>
