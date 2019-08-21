<template>
  <el-tabs  class="nav-business" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="昨天" name="first"></el-tab-pane>
    <el-tab-pane label="本周" name="second"></el-tab-pane>
    <el-tab-pane label="本月" name="third"></el-tab-pane>
    <ul class="day-business">
      <li><i>71</i>个<br>新增客户</li>
      <li><i>23</i>笔<br>新增投保单</li>
      <li><i>3</i>笔<br>新增保单</li>
      <li><span>0.00</span>元<br>总金额</li>
    </ul>
  </el-tabs>
</template>
<script>
  export default {
    name: 'ElDayBusiness',
    data() {
      return {
        activeName: 'second'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
