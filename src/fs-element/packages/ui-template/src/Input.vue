<template>
<el-input
  v-if="isEdit"
  placeholder=""
  :type="type"
  v-model="templateValue[code]"
  v-show="data.isDisplay==true"
  @keyup.native="handleInput"
  size="small"
  v-bind:style="{width:data.width,display:'inline-block'}"
  :id="data.fieldId"
  :width='data.width'
  :disabled="data.readOnly"
  :autosize="{ minRows: 2, maxRows: 6}"
  :symbol="symbol"
  :decimals="decimals"
  :comma="comma"
  >
</el-input>
<div
  class="tpl-label"
  v-else>
  <tooltip :content="templateValue[code]"></tooltip>
</div>
</template>
<script>
import tooltip from './toolTip.vue';
export default {
  data() {
    var code = this.data.itemCode ? this.data.itemCode.split('.').pop() : '';
    var typeMap = {
      TextArea: 'textarea',
      Money: 'money',
      Phone: 'text',
      Mobile: 'text',
      Email: 'text'
    };
    var moneyMap = {
      人民币: 'CNY(¥)',
      美元: 'U.S.($)',
      日元: 'JPY(¥)',
      欧元: 'EUR(€)',
      港币: 'HKD($)',
      台币: 'NT($)'
    };
    return {
      type: typeMap[this.data.componentKey] ? typeMap[this.data.componentKey] : 'text',
      code: code,
      symbol: moneyMap[this.data.moneyType] ? moneyMap[this.data.moneyType] : 'CNY(¥)',
      decimals: this.data.decimalPlace,
      comma: true
    };
  },
  components: {
    tooltip: tooltip
  },
  props: ['data', 'templateValue', 'isEdit'],
  methods: {
    handleInput: function() {
      var value = this.templateValue[this.code];
      var data = {
        key: this.code,
        value: value
      };
      this.$emit('trigger', 'change', data);
    }
  },
  // watch:{
  //   code(a,b){
  //     this.value = this.templateValue[this.code];
  //   }
  // },
  created: function() {
  }
};
</script>
<style scoped>

</style>
