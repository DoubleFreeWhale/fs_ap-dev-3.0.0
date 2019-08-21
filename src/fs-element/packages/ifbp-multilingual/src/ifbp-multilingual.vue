<template>
  <div
    class="ifbp-multilingual-container"
    v-clickoutside="closeLangOptionPanel">
    <el-input
      v-model="templateValue[currentModel]"
      @focus="langOptionsShow = false"
      ref="modelInput"
      :disabled="disabled || !editable">
      <div slot="append"
        @click="handleModelIconClick">
        <span class="input-lang-type">{{ currentLanguage }}</span>
        <i :class="{
            'ifbp-icon-caret-down': !langOptionsShow,
            'ifbp-icon-caret-up': langOptionsShow,
          }"></i>
      </div>
    </el-input>
    <el-select
      v-model="currentLanguage"
      ref="langSelect"
      @change="handleLangChange">
      <el-option v-for="(lang, langIndex) in languagesToChoose"
        :key="langIndex"
        :label="langIndex > 0 ? templateValue[field + '' + langIndex] : templateValue[field]"
        :value="lang"
        @click="closeLangOptionPanel">
        <span style="float: left">{{ langIndex > 0 ? templateValue[field + '' + langIndex] : templateValue[field] }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ lang }}</span>
      </el-option>
    </el-select>
  </div>
</template>
<script>
import Clickoutside from 'ifbp-element/src/utils/clickoutside';
export default {
  name: 'IfbpMultilingual',
  props: {
    // 数据存储的对象
    templateValue: {
      type: Object,
      default: {
      }
    },

    // 该多语字段在 templateValue 里的字段名
    field: String,

    // 多语言对应的语言名称数组
    languages: Array,

    disabled: {
      type: Boolean,
      default: false
    },

    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 可选语言
      languagesToChoose: [],
      // 系统上下文中的语言
      sysLanguages: null,
      // 默认语言
      defaultLanguages: ['zh-CN'],
      // 当前显示的语言
      currentLanguage: null,
      // options 是否显示
      langOptionsShow: false
    };
  },
  computed: {
    currentModel() {
      const currentLangIndex = this.languagesToChoose.indexOf(this.currentLanguage);
      return currentLangIndex > 0 ? this.field + '' + currentLangIndex : this.field;
    }
  },
  directives: { Clickoutside },
  created() {
    // 获取系统上下文中的语言数组
    // mock 系统上下文
    // this.$context = {};
    // this.$context.getLanguages = function() {
    //   return ['zh-CN', 'en'];
    // };
    // this.$context.getCurrentLang = function() {
    //   return 'en';
    // };
    if (this.$context && typeof this.$context.getLanguages === 'function') {
      this.sysLanguages = this.$context.getLanguages();
      // 设置默认选中的语言
      if (this.$context && typeof this.$context.getCurrentLang === 'function') {
        this.currentLanguage = this.$context.getCurrentLang();
      }
    }
    this.languagesToChoose = this.languages || this.sysLanguages || this.defaultLanguages;
    // 设置默认选中的语言
    if (!this.currentLanguage) {
      this.currentLanguage = this.languagesToChoose[0];
    }
    for (let i = 0; i < this.languagesToChoose.length; i++) {
      if (i === 0 && !this.templateValue[this.field]) {
        this.$set(this.templateValue, this.field, null);
      }
      if (i > 0 && !this.templateValue[this.field + '' + i]) {
        this.$set(this.templateValue, this.field + '' + i, null);
      }
    }
  },
  methods: {
    handleModelIconClick() {
      if (this.langOptionsShow) {
        this.$refs.langSelect.handleClose();
      } else {
        this.$refs.langSelect.toggleMenu();
      }
      this.langOptionsShow = !this.langOptionsShow;
    },
    handleLangChange() {
      this.$nextTick(() => {
        this.$refs.modelInput.$refs &&
        this.$refs.modelInput.$refs.input &&
        this.$refs.modelInput.$refs.input.focus();
      });
    },
    closeLangOptionPanel() {
      this.langOptionsShow = false;
    }
  }
};
</script>
<style>
</style>