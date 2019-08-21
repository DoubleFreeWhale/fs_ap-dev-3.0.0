<template>
  <div>
    <ifbp-panel-group
      :navbar="true"
      class="setting-panel-group"
      :base-scroll-top="58"
      :base-nav-bar-top="58"
    >
      <ifbp-panel
        id='guidermodel'
        title="财务"
      >
        <el-form
          :model="business"
          ref='language'
          label-width="150px"
          style="max-width: 500px; margin: 50px auto;"
        >
          <el-form-item
            label="默认业务单元"
            prop='businessUnit'
          >
            <el-select
              v-model="business.unit"
              placeholder="请选择"
            >
              <el-option
                v-for="item in businessUnit"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="默认财务核算账簿"
            prop='businessAcountBooks'
          >
            <el-select
              v-model="business.acountBooks"
              placeholder="请选择"
            >
              <el-option
                v-for="item in businessAcountBooks"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="默认信用控制域"
            prop='businessControlArea'
          >
            <el-select
              v-model="business.controlArea"
              placeholder="请选择"
            >
              <el-option
                v-for="item in businessControlArea"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="默认成本域"
            prop='businessCostFields'
          >
            <el-select
              v-model="business.costFields"
              placeholder="请选择"
            >
              <el-option
                v-for="item in businessCostFields"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </ifbp-panel>
    </ifbp-panel-group>
  </div>

</template>

<script>
export default {
  props: {
    businesss: {
      type: Object,
      default: item => {
        return {};
      }
    }
  },
  data() {
    return {
      businessUnit: [
        {
          label: "中文简体",
          value: "zh-cn"
        },
        {
          label: "中文简体111",
          value: "zh-cn111"
        }
      ],
      businessAcountBooks: [
        {
          label: "中文简体",
          value: "zh-cn"
        },
        {
          label: "中文简体222",
          value: "zh-cn222"
        }
      ],
      businessControlArea: [
        {
          label: "中文简体",
          value: "zh-cn"
        },
        {
          label: "中文简体222",
          value: "zh-cn222"
        }
      ],
      businessCostFields: [
        {
          label: "中文简体",
          value: "zh-cn"
        },
        {
          label: "中文简体222",
          value: "zh-cn222"
        }
      ],
      business: {
        unit: "zh-cn",
        acountBooks: "zh-cn",
        controlArea: "zh-cn",
        costFields: "zh-cn"
      }
    };
  },
  watch: {
    language: {
      handler(newVal, oldVal) {
        this.businessSetChange();
      },
      deep: true
    }
  },
  created() {
    this.business = this.businesss;
  },
  methods: {
    businessSetChange() {
      this.$emit("businessSetChange", this.business);
    }
  }
};
</script>

<style>
</style>
