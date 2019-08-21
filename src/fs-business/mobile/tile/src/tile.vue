<template lang="html">
  <div class="mobile-card" :class="sizeClass" :style="styleObject" @click="cardClick">
    <div class="mobile-card-info">
      <div class="mobile-card-info-icon">
        <i :class="(icon || childItem.icon) ? (icon || childItem.icon) : 'ifbp-icon-Track'" :style="{'color':(iconColor||childItem.iconColor)}"></i>
      </div>
      <div class="mobile-card-title">
        {{title || childItem.appName}}
      </div>
    </div>
    <div :class="['card-icon-status',iconStatus === 'add'?'card-add':'', iconStatus ==='minus'?'card-minus':'']" v-if="iconStatus" @click="iconClick(childItem)">
      <i class="ifbp-icon-add-circle mt-icon-add" v-if="iconStatus==='add'"></i>
      <i class="ifbp-icon-remove-circle mt-icon-remove" v-if="iconStatus ==='minus'"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sizeClass:'sm',
      styleObject: {
        color: '#333',
        fontSize: '12px'
      },
      childItem: {}
    };
  },
  props: {
    title:{
      type:String
    },
    size: {
      type:String
    },
    icon:{
      type:String,
      default:'ifbp-icon-Track'
    },
    iconColor: {
      type: String,
      default: '#5CB0E6'
    },
    cardStyle: {
      type:Object
    },
    iconStatus: {
      type:String,
      default:''
    },
    child: {
      type: Object
    }
  },
  watch: {
    cardStyle(val) {
      this.styleObject = val;
    },
    child: {
      deep: true,
      handler(val) {
        this.childItem = val;
      }
    }
  },
  methods: {
    cardClick() {
      this.$emit('card-click');
    },
    iconClick(child) {
      this.$emit('card-icon-click',child);
    }
  },
  created() {
    if (this.size) {
          this.sizeClass = this.size;
        }
        if (this.cardStyle) {
          this.styleObject = this.cardStyle;
        }
  },
  mounted() {
    this.childItem = this.child;

  }
}
</script>

<style lang="css">
div {
  margin: 0;
  padding: 0;
}
.sm {
  width:25%;
  height:92px;
}
.md {
  width:33.33%;
  height:92px;
}
.lg{
  width:50%;
  height:92px;
}
.mobile-card{
  border: 1px solid transparent;
  text-align: center;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
}
.mobile-card:hover {
  /* border: 1px solid #6bcaea; */
  cursor: pointer;
}
.mobile-card-title {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  line-height: 17px;
  font-size: 12px;
  color: #333;
  margin-top: 8px;
}
.mobile-card-info{
  width:100%;
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.mobile-card-info-icon {
  height: 24px;
  line-height: 24px;
}
.mobile-card-info-icon i {
  line-height: 24px;
  font-size: 24px;
}
.card-icon-status {
  position: absolute;
  top: 0;
  right: 0;
  width:24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
}
.card-icon-status i{
  font-size: 24px;
  /* color: #fff; */
}
.mt-icon-add{
 /* color: rgb(53,138,242); */
 color: #0089FA;
}
.mt-icon-remove{
  /* color: rgb(237,101,100); */
  color: #FF595F
;
}


</style>
