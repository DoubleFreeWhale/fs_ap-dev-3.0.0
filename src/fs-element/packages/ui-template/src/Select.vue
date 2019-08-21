<template>
  <el-select v-if="isEdit"
             @change="changeHandle"
             :disabled="readOnly"
             v-model="templateValue[code]"
             placeholder="">
    <el-option
            v-for="item in data.options"
            :label="item.name"
            :value="item.selectionId">
    </el-option>
  </el-select>
  <div class="tpl-label"
    v-else>
    <tooltip :content="label"></tooltip>
  </div>
</template>

<script>
  import tooltip from './toolTip.vue';
  export default {
    data() {
      return {
        code: '',
        readOnly: false
      };
    },
    components: {
      tooltip: tooltip
    },
    computed: {
      label() {
        var tmp;
        var code = this.templateValue[this.code];
        for (var i = 0;i < this.data.options.length;i++) {
          if (this.data.options[i].selectionId === code) {
            tmp = this.data.options[i].name;
            break;
          }
        }
        return tmp;
      }
//    value() {
//      return (this.templateValue[this.code] !== undefined && this.templateValue[this.code] !== null) ? this.templateValue[this.code].toString() : this.templateValue[this.code];
//    }
    },
    methods: {
      changeHandle(v) {
        this.templateValue[this.code] = v;
        var data = {
          key: this.code,
          value: v
        };
        this.$emit('trigger', 'change', data);
      }
    },
    props: ['data', 'templateValue', 'isEdit'],
    created() {
      this.code = this.data.itemCode ? this.data.itemCode.split('.').pop() : '';
      this.readOnly = !!this.data.readOnly;
    }
  };
</script>
<style scoped>

</style>
