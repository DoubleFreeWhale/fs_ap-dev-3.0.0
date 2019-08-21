<template>
  <el-checkbox-group
    v-model="checkedOptions"
    @change="changeHandle"

    >
    <el-checkbox v-for="option in data.options" :disabled="!isEdit || data.readOnly" :label="option.name">{{option.name}}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
  export default {
    data() {
      return {
        code: '',
        checkedOptions: []
      };
    },
    methods: {
      init() {
        var value = this.templateValue[this.code];
        if (Object.prototype.toString.call(value) === '[object String]' && value !== '') {
          this.checkedOptions = this.templateValue[this.code].split(',');
        } else {
          this.checkedOptions = [];
        }
      },
      changeHandle(v) {
        var value = v.join(',');
        this.templateValue[this.code] = value;
        var data = {
          key: this.code,
          value: value
        };
        this.$emit('trigger', 'change', data);
      }
    },
    props: ['data', 'templateValue', 'isEdit'],
    created() {
      this.code = this.data.itemCode ? this.data.itemCode.split('.').pop() : '';
      this.valueWatcher = this.$watch(function() {
        return this.templateValue;
      },
      function() {
        if (this.templateValue[this.code] !== null) {
          this.init();
        //  this.valueWatcher();
        }
      }.bind(this), {deep: true});
      if (this.templateValue && this.templateValue[this.code] !== null) {
        this.init();
      //  this.valueWatcher();
      }
    }
  };
</script>
<style scoped>

</style>
