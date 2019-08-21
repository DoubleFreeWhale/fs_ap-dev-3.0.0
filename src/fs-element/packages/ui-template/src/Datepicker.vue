<template>
  <el-date-picker
      v-model="value"
      type="date"
      :placeholder="holder"
      :format="format"
      :disabled="data.isReadonly"
      v-if="isEdit"
      @change="changeHandle"
      :picker-options="pickerOptions0">
  </el-date-picker>
  <div
  class="tpl-label"
  v-else>
  <tooltip :content="label"></tooltip>
  </div>
</template>

<script>
  import tooltip from './toolTip.vue';
  export default {
    data() {
      var code = this.data.itemCode ? this.data.itemCode.split('.').pop() : '';
      var holder = '年-月-日'; // this.data.format=='YYYY-MM-DD'?
      return {
        holder: holder,
        format: '',
        value: '',
        pickerOptions0: {},
        code: code
      };
    },
    components: {
      tooltip: tooltip
    },
    computed: {
      label() {
        var tmp;
        if (this.value) {
          tmp = (new Date(this.value)).toLocaleDateString();
        } else {
          tmp = '';
        }
        return tmp;
      }
    },
    methods: {
      changeHandle(v) {
        if (v) {
          this.templateValue[this.code] = Date.parse(new Date(v));
        } else {
          this.templateValue[this.code] = null;
        }
        var data = {
          key: this.code,
          value: v
        };
        this.$emit('trigger', 'change', data);
      }
    },
    created() {
      this.valueWatcher = this.$watch(function() {
        return this.templateValue;
      },
      function() {
        if (this.templateValue[this.code] !== null) {
          this.value = (new Date(this.templateValue[this.code])).toISOString();
          // this.valueWatcher();
        } else {
          this.value = '';
        }
      }.bind(this), {deep: true});
      if (this.templateValue && this.templateValue[this.code] !== null) {
        this.value = (new Date(this.templateValue[this.code])).toISOString();
        // this.valueWatcher();
      }
    },
    props: ['data', 'templateValue', 'isEdit']
  };
</script>
<style scoped>
</style>
