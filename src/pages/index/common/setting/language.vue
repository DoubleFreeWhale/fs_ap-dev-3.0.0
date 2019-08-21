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
        title="语言"
      >
        <el-form
          :model="language"
          ref='language'
          label-width="100px"
          style="max-width: 500px; margin: 50px auto;"
        >
          <el-form-item
            label="默认数据格式"
            prop='languageFormat'
          >
            <el-select
              v-model="language.format"
              placeholder="请选择"
            >
              <el-option
                v-for="item in languageFormat"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="默认内容语种"
            prop='languageType'
          >
            <el-select
              v-model="language.type"
              placeholder="请选择"
            >
              <el-option
                v-for="item in languageType"
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
    languages: {
      type: Object,
      default: item => {
        return {};
      }
    }
  },
  data() {
    return {
      languageFormat: [
        {
          label: "中文简体",
          value: "zh-cn"
        },
        {
          label: "中文简体111",
          value: "zh-cn111"
        }
      ],
      languageType: [
        {
          label: "中文简体",
          value: "zh-cn"
        },
        {
          label: "中文简体222",
          value: "zh-cn222"
        }
      ],
      language: {
        format: "zh-cn",
        type: "zh-cn"
      }
    };
  },
  watch: {
    language: {
      handler(newVal, oldVal) {
        this.languageSetChange();
      },
      deep: true
    }
  },
  created() {
    this.language = this.languages;
  },
  methods: {
    languageSetChange() {
      this.$emit("languageSetChange", this.language);
    }
  }
};
</script>

<style>
</style>
