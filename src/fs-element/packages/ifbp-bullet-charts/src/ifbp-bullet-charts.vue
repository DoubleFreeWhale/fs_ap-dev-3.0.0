<template>
<!-- <div class="box"> -->
<div class="applet-strip" v-if="bulletData && bulletData !==''">
  <span class="centerLine" :style="{left:appletChangeLeft}"><span class="expected-value">{{bulletData.expectedValue}}{{bulletData.unit}}</span></span>
  <!-- <span class="num">{{bulletData.targetName}}</span> -->
  <div class="applet-bullet-progress bulletColor" data-attr="bulletColor" :style="{width:appletChangeWidth,background:bulletData.color}">
    <font class="applet-target-num" :style="{color:bulletData.color}">{{bulletData.targetValue}}{{bulletData.unit}}</font>
    <span class="applet-bullet-progress-before" :style="{background:bulletData.color}"></span>
    <span class="applet-bullet-progress-top" :style="{borderTopColor:bulletData.color}"></span>
    <span class="applet-bullet-progress-after" :style="{borderBottomColor:bulletData.color}"></span>
  </div>
</div>
<!-- </div> -->
</template>

<script>
export default {
  name: 'IfbpBulletCharts',
  props: ['bulletData'],
  data() {
    return {
      bulletColor: '',
      // bulletData: {
      // expectedName:'一个月',
      // targetName: '总量',
      // maxValue: 100,
      // expectedValue: 0,
      // targetValue: 0,
      // unit: "亿",
      // color:"red"
      // },
      appletChangeLeft: '',
      appletChangeWidth: '' //进度条宽度
    }
  },
  methods: {},
  watch: {
    bulletData(val) {
      if (val) {
        this.bulletColor = val.color;
        let maxValue = parseFloat(val.maxValue);
        // let targetNum = parseInt(this.title) * 2;
        let expectedValue = parseFloat(val.expectedValue);
        let targetValue = parseFloat(val.targetValue);
        this.appletChangeLeft = ((expectedValue / maxValue) * 100) + '%';
        this.appletChangeWidth = ((targetValue / maxValue) * 100) + '%'; //计算进度条宽度
      }
    }
  },
  mounted() {
    if (this.bulletData) {
      this.bulletColor = this.bulletData.color;
      let maxValue = parseFloat(this.bulletData.maxValue);
      // let targetNum = parseInt(this.title) * 2;
      let expectedValue = parseFloat(this.bulletData.expectedValue);
      let targetValue = parseFloat(this.bulletData.targetValue);
      this.appletChangeLeft = ((expectedValue / maxValue) * 100) + '%';
      this.appletChangeWidth = ((targetValue / maxValue) * 100) + '%'; //计算进度条宽度
    }
  }
}
</script>

<style scoped>
/* .box {
  margin-left: 200px;
  margin-top: 100px;
} */

.applet-strip {
  position: relative;
  /* margin: 100px 100px; */
  width: 100%;
  height: 12px;
  background: #e4e8f1;
}

.applet-strip span {
  position: absolute;
  display: inline-block;
}

.centerLine {
  top: -4px;
  margin-left: -1px;
  height: 20px;
  width: 2px;
  background: #666;
  z-index: 2;
}

.centerLine .expected-value {
  left: -4px;
  top: 22px;
  color: #666;
  display: inline-block;
  width: 40px
}
.applet-bullet-progress {
  height: 100%;
  /* background: orange; */
  position: relative;
}

.applet-bullet-progress-before {
  /* content:''; */
  position: absolute;
  top: -3px;
  right: 0;
  width: 2px;
  height: 3px;
  /* background-color: orange; */
}

.applet-bullet-progress-after {
  position: absolute;
  top: -12px;
  right: -3px;
  border: 4px solid;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: #fff;
  border-bottom-color: #fff;
  /* border-color: transparent transparent orange transparent; */
}
.applet-bullet-progress-top {
  position: absolute;
  top: -4px;
  right: -3px;
  border: 4px solid;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: #fff;
  border-bottom-color: transparent;
}

.applet-target-num {
  position: absolute;
  top: -23px;
  right: 0;
  transform: translateX(50%);
  white-space: nowrap;
  z-index: 100;
  /* color: orange; */
}
</style>
