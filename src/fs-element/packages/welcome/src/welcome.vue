<template>
  <div class="el-welcome">
    <div class="el-col-8">
      <img :src="userImg" alt="">
      <p>Hi，{{peopleName}}，欢迎你回来!</p>
      <p>{{companyName}}</p>
      <p class="date">{{date}}</p>
    </div>
    <div class="el-col-8">
      <img :src="current_customers" alt="">
      <p class="margin40">当前客户</p>
      <p><span class="number">{{customersNumber}}</span> 人</p>
    </div>
    <div class="el-col-8">
      <img :src="current_simple_customers" alt="">
      <p class="margin40">当前个人客户</p>
      <p><span class="number">{{simpleCustomerNumber}}</span> 人</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ElWelcome',
    props: ['peopleName', 'companyName', 'customersNumber', 'simpleCustomerNumber'],
    data() {
      return {
        userImg: require('../images/u4662.png'),
        current_customers: require('../images/u7923.png'),
        current_simple_customers: require('../images/u7933.png'),
        date: new Date().toLocaleDateString()
      };
    }
  };
</script>
