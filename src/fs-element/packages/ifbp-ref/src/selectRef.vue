<template>
  <el-select
    v-model="bindingValue"
    :multiple="isMutiSelect"
    @change="refSelectChange">
    <el-option
      v-for="ref in refOptions"
      :key="ref.id"
      :label="ref.refname"
      :value="ref.id">
      <span style="float: left;">{{ ref.refname }}</span>
      <span style="float: right; color: #8492a6; margin-right: 20px;">{{ ref.refcode }}</span>
    </el-option>
  </el-select>
</template>

<script>
  export default {
    props: {
      // selected: Array,
      isMutiSelect: Boolean,
      refInfo: Object,
      templateValue: Object,
      field: String,
      queryParams: Object
    },
    data() {
      return {
        // ref data used as options
        refOptions: [],
        // v-model binding value
        bindingValue: null
      };
    },
    watch: {
      refInfo: {
        handler() {
          this.requestOptions();
        },
        deep: true
      },
      queryParams: {
        handler() {
          this.requestOptions();
        },
        deep: true
      }
    },
    methods: {
      // transforming initial ref value to binding value to adjust el-select
      initBindingValue() {
        const propValue = this.templateValue ? this.templateValue[this.field] : '';
        // const propValue = this.value;
        if (propValue) {
          this.bindingValue = this.isMutiSelect ? propValue.split(',') : propValue;
        }
      },

      // handler of change event for el-select
      refSelectChange(val) {
        const selectedIds = Array.isArray(val) ? val : (val ? [val] : []);
        let selectedData = [];
        this.refOptions.forEach(ref => {
          if (selectedIds.indexOf(ref.id) !== -1) {
            selectedData.push(ref);
          }
        });
        this.$emit('change', selectedData);
      },

      // get options for el-select
      requestOptions() {
        if (!this.refInfo) {
          return;
        }
        let requestData;
        try {
          requestData = JSON.parse(JSON.stringify(this.refInfo));
        } catch (error) {
          requestData = {};
        }
        if (this.queryParams && JSON.stringify(this.queryParams) !== '{}') {
          requestData.transmitParam = JSON.stringify(this.queryParams);
        }
        this.$http({
          url: '/uitemplate_web/iref_ctr/commonRefsearch',
          method: 'post',
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(ref => {
          if (!ref || !ref.data || !ref.data.data) {
            console.log('获取下拉参照数据失败');
            return;
          }
          let resData = ref.data.data;
          resData.forEach(ref => {
            ref.refcode = ref.refcode || ref.code;
            ref.refname = ref.refname || ref.name;
          });
          this.refOptions = resData;
          this.initBindingValue();
        });
      }
    },
    created() {
      // this.initBindingValue();
      this.requestOptions();
    }
  };
</script>
<style scoped>
</style>
