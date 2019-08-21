<template>
<div class="arrow-kpi">
  <span :class="['arrow-kpi-num', arrowKpiData.num === 0?'arrow-kpi-num-zero':'']" :style="{color:arrowKpiData.color}">{{arrowKpiData.num}}</span>
  <!-- <span class="arrow-kpi-oper"> -->
    <i class="ifbp-icon-up arrow-kpi-oper"  :style="{color:arrowKpiData.color}" v-if="arrowKpiData.num>0"></i>
    <i class="ifbp-icon-down arrow-kpi-oper"  :style="{color:arrowKpiData.color}" v-if="arrowKpiData.num<0"></i>
    <span class="arrow-kpi-percent" :style="{color:arrowKpiData.color}">{{arrowKpiData.unit}}</span>
  <!-- </span> -->

</div>
</template>
<script>
export default {
  name: 'IfbpArrowKpi',
  props: ['arrowKpiData'],
  data() {
    return {
      // arrowKpiData: {
      //   color: 'cyan',
      //   num: 4.5,
      //   unit: 'K'
      // }
    };
  },
  created() {
  }

}
</script>


